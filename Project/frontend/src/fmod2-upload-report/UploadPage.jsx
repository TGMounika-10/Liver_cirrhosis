import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../fmod1-app-shell/api/client";
import UploadDropzone from "./UploadDropzone";
import FilePreview from "./FilePreview";
import UploadProgress from "./UploadProgress";
import ExtractedValuesTable from "./ExtractedValuesTable";
import ConfirmCheckbox from "./ConfirmCheckbox";
import { validateLabValues } from "./labFields";
import "./UploadPage.css";

export default function UploadPage() {
  const navigate = useNavigate();

  // Component states (File is held in memory only, never in localStorage per Rule 6)
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadPhase, setUploadPhase] = useState("idle"); // 'idle' | 'uploading' | 'review' | 'error'
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Uploading file...");
  const [errorMessage, setErrorMessage] = useState("");

  // Extracted values state
  const [labValues, setLabValues] = useState({});
  const [missingKeys, setMissingKeys] = useState([]);
  const [backendWarnings, setBackendWarnings] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

  // Live client-side validation
  const validation = validateLabValues(labValues);

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setErrorMessage("");
    setUploadPhase("idle");
    setLabValues({});
    setIsConfirmed(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadPhase("idle");
    setErrorMessage("");
    setLabValues({});
    setIsConfirmed(false);
  };

  const handleStartExtraction = async () => {
    if (!selectedFile) return;

    setUploadPhase("uploading");
    setProgressPercent(15);
    setStatusMessage("Uploading file...");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Simulate/measure upload progress
      const progressTimer = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev < 40) return prev + 10;
          if (prev < 70) {
            setStatusMessage("Reading report...");
            return prev + 6;
          }
          if (prev < 90) {
            setStatusMessage("Extracting lab values...");
            return prev + 3;
          }
          return prev;
        });
      }, 200);

      const response = await apiClient.post("/api/report/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 40) / progressEvent.total);
            setProgressPercent(percentCompleted);
          }
        },
      });

      clearInterval(progressTimer);
      setProgressPercent(100);

      const data = response.data || {};
      setLabValues(data.extracted_values || {});
      setMissingKeys(data.missing || []);
      setBackendWarnings(data.warnings || []);
      setUploadPhase("review");
    } catch (err) {
      // Offline development fallback simulation if backend is not running
      if (!err.response && process.env.NODE_ENV !== "production") {
        setTimeout(() => {
          setProgressPercent(100);
          setStatusMessage("Extracting lab values...");
          // Simulated mock extraction from report sample
          const mockExtracted = {
            total_bilirubin: 2.4,
            direct_bilirubin: 1.1,
            alkphos: 285,
            sgpt: 58,
            sgot: 74,
            total_proteins: 6.8,
            albumin: 2.9,
            // ag_ratio and age intentionally omitted to test missing field highlight
          };
          setLabValues(mockExtracted);
          setMissingKeys(["age", "gender", "ag_ratio"]);
          setBackendWarnings(["Albumin converted from g/L to g/dL", "A/G Ratio missing from report"]);
          setUploadPhase("review");
        }, 1200);
        return;
      }

      setUploadPhase("error");
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage(
          "We could not read values from this report. The file may be unreadable, password protected, or in an unsupported format."
        );
      }
    }
  };

  const handleValueChange = (key, val) => {
    setLabValues((prev) => ({
      ...prev,
      [key]: val,
    }));
    // Remove from missing list once user enters a value
    if (val !== "") {
      setMissingKeys((prev) => prev.filter((k) => k !== key));
    }
  };

  const handlePredict = async () => {
    // Enforcement of Rule 3 & 7: Never send prediction request before user review & valid fields
    if (!validation.isValid || !isConfirmed || isPredicting) {
      return;
    }

    setIsPredicting(true);
    setErrorMessage("");

    try {
      const response = await apiClient.post("/api/predict/manual", labValues);
      navigate("/result", {
        state: {
          prediction: response.data,
          labValues,
        },
      });
    } catch (err) {
      // Offline fallback simulation for result preview
      if (!err.response && process.env.NODE_ENV !== "production") {
        navigate("/result", {
          state: {
            prediction: {
              status: "success",
              probability: 0.68,
              risk_category: "High",
              threshold: 0.52,
              top_factors: [
                { feature: "albumin", impact: "positive", message: "Low albumin (2.9 g/dL) contributed significantly to estimated risk." },
                { feature: "total_bilirubin", impact: "positive", message: "Elevated total bilirubin (2.4 mg/dL) increased the estimated risk." },
                { feature: "sgpt", impact: "positive", message: "Elevated ALT / SGPT (58 IU/L) contributed to estimated risk." },
              ],
            },
            labValues,
          },
        });
        return;
      }

      setErrorMessage(
        err.response?.data?.message || "Failed to generate risk estimate. Please review your values and try again."
      );
      setIsPredicting(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        {/* Header section */}
        <div className="upload-intro">
          <h1>Upload Blood-Test Report</h1>
          <p className="upload-subtitle">
            Upload your laboratory report (PDF or image). Our OCR parser will extract liver panel values
            so you can inspect, edit, and confirm them before generating an educational risk estimate.
          </p>
        </div>

        {/* Phase 1: Upload Dropzone & File Selection */}
        {uploadPhase === "idle" && (
          <div className="upload-section">
            {!selectedFile ? (
              <>
                <UploadDropzone onFileSelected={handleFileSelected} disabled={false} />
                <div className="switch-to-manual-prompt">
                  <span>Having trouble scanning? </span>
                  <Link to="/manual" className="manual-link">
                    Enter lab values manually instead
                  </Link>
                </div>
              </>
            ) : (
              <div className="selected-file-action-group">
                <FilePreview
                  file={selectedFile}
                  onRemove={handleRemoveFile}
                  disabled={false}
                />
                <div className="file-actions">
                  <button
                    type="button"
                    className="btn primary extract-btn"
                    onClick={handleStartExtraction}
                  >
                    <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Extract Values from Report
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={handleRemoveFile}
                  >
                    Select Different File
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Phase 2: Progress Indicator */}
        {uploadPhase === "uploading" && (
          <div className="upload-section">
            <UploadProgress
              percent={progressPercent}
              statusMessage={statusMessage}
            />
          </div>
        )}

        {/* Phase 3: Error State with fallback to manual entry */}
        {uploadPhase === "error" && (
          <div className="upload-error-card" role="alert">
            <div className="error-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="var(--red)">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <div className="error-content">
              <h3>Report Parsing Failed</h3>
              <p>{errorMessage}</p>
              <div className="error-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={handleRemoveFile}
                >
                  Upload Another Report
                </button>
                <Link to="/manual" className="btn primary">
                  Switch to Manual Entry
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Phase 4: Review, Edit & Confirmation Table */}
        {uploadPhase === "review" && (
          <div className="review-section">
            {selectedFile && (
              <div className="review-file-indicator">
                <span>Extracted from: <strong>{selectedFile.name}</strong></span>
                <button
                  type="button"
                  className="btn sm"
                  onClick={handleRemoveFile}
                >
                  Upload Another File
                </button>
              </div>
            )}

            <ExtractedValuesTable
              values={labValues}
              onChangeValue={handleValueChange}
              errors={validation.errors}
              warnings={validation.warnings}
              backendWarnings={backendWarnings}
              missingKeys={missingKeys}
            />

            <ConfirmCheckbox
              checked={isConfirmed}
              onChange={setIsConfirmed}
              disabled={isPredicting}
            />

            {/* Validation warning block if user attempts to proceed with invalid fields */}
            {!validation.isValid && (
              <div className="validation-summary-alert" role="alert">
                <svg viewBox="0 0 20 20" width="18" height="18" fill="var(--amber-text)">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>
                  Please complete all required fields and correct flagged values before calculating the risk estimate.
                </span>
              </div>
            )}

            <div className="submit-action-bar">
              <button
                type="button"
                className="btn primary predict-submit-btn"
                onClick={handlePredict}
                disabled={!validation.isValid || !isConfirmed || isPredicting}
                title={
                  !validation.isValid
                    ? "Fill all required fields to continue"
                    : !isConfirmed
                    ? "Check the confirmation box above to proceed"
                    : "Calculate risk prediction"
                }
              >
                {isPredicting ? "Calculating Risk..." : "Calculate Risk Prediction"}
              </button>

              <Link to="/manual" className="btn switch-btn">
                Switch to Manual Entry
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
