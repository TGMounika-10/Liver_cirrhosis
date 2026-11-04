import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import RiskSummary from "./RiskSummary";
import MarkerTable from "./MarkerTable";
import FactorList from "./FactorList";
import NextStepsCard from "./NextStepsCard";
import DisclaimerBlock from "./DisclaimerBlock";
import { useAuth } from "../fmod6-auth/useAuth";
import "./ResultPage.css";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientId } = useAuth();

  // Check URL query parameters for demo modes (e.g. /result?demo=high | moderate | low)
  const searchParams = new URLSearchParams(location.search);
  const demoMode = searchParams.get("demo");

  // Retrieve state passed from /upload or /manual
  const stateResult = location.state?.prediction;
  const stateLabValues = location.state?.labValues;

  // Rule: "If the page is opened with no result in state, redirect to /manual."
  useEffect(() => {
    if (!stateResult && !demoMode) {
      navigate("/manual", { replace: true });
    }
  }, [stateResult, demoMode, navigate]);

  // Demo presets for validation and testing Low, Moderate, and High responses
  const demoPresets = {
    high: {
      probability: 0.78,
      risk_category: "High",
      top_factors: [
        { feature: "total_bilirubin", impact: "positive", message: "Elevated Total Bilirubin (3.8 mg/dL) significantly increased estimated risk." },
        { feature: "albumin", impact: "positive", message: "Markedly low Albumin (2.6 g/dL) contributed to the estimated risk." },
        { feature: "sgpt", impact: "positive", message: "High SGPT / ALT (115 IU/L) indicated acute hepatocellular leakage." },
        { feature: "ag_ratio", impact: "positive", message: "Inverted A/G Ratio (0.7) elevated the statistical estimate." },
      ],
      labValues: {
        age: 58,
        gender: "Male",
        total_bilirubin: 3.8,
        direct_bilirubin: 1.9,
        alkphos: 290,
        sgpt: 115,
        sgot: 142,
        total_proteins: 6.4,
        albumin: 2.6,
        ag_ratio: 0.7,
      },
    },
    moderate: {
      probability: 0.46,
      risk_category: "Moderate",
      top_factors: [
        { feature: "alkphos", impact: "positive", message: "Mildly elevated ALP (145 IU/L) pushed the risk estimate upward." },
        { feature: "sgpt", impact: "positive", message: "Borderline ALT / SGPT (64 IU/L) contributed moderately to estimated risk." },
        { feature: "albumin", impact: "negative", message: "Adequate Albumin (3.6 g/dL) helped moderate the estimated risk." },
      ],
      labValues: {
        age: 44,
        gender: "Female",
        total_bilirubin: 1.3,
        direct_bilirubin: 0.4,
        alkphos: 145,
        sgpt: 64,
        sgot: 52,
        total_proteins: 7.1,
        albumin: 3.6,
        ag_ratio: 1.2,
      },
    },
    low: {
      probability: 0.18,
      risk_category: "Low",
      top_factors: [
        { feature: "albumin", impact: "negative", message: "Normal Albumin (4.2 g/dL) lowered the estimated risk." },
        { feature: "total_bilirubin", impact: "negative", message: "Healthy Total Bilirubin (0.8 mg/dL) lowered the estimated risk." },
        { feature: "sgpt", impact: "negative", message: "Normal SGPT / ALT (22 IU/L) was consistent with low risk." },
      ],
      labValues: {
        age: 32,
        gender: "Male",
        total_bilirubin: 0.8,
        direct_bilirubin: 0.2,
        alkphos: 75,
        sgpt: 22,
        sgot: 26,
        total_proteins: 7.4,
        albumin: 4.2,
        ag_ratio: 1.5,
      },
    },
  };

  const activeDemo = demoMode ? demoPresets[demoMode.toLowerCase()] : null;
  const prediction = stateResult || activeDemo;
  const labValues = stateLabValues || activeDemo?.labValues || {};

  if (!prediction) {
    return null;
  }

  const probability = prediction.probability ?? 0.5;
  const category = prediction.risk_category || (probability >= 0.52 ? "High" : probability >= 0.35 ? "Moderate" : "Low");
  const topFactors = prediction.top_factors || [];

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="result-page">
      <div className="result-container">
        {/* Print-only patient header */}
        <div className="print-header-card">
          <div className="print-title">
            <h2>Liver Screening Assessment Summary</h2>
            <span className="print-sub">Educational Risk Evaluation</span>
          </div>
          <div className="print-meta">
            <span>Patient ID: <strong>{patientId || "ANONYMOUS"}</strong></span>
            <span>Date: <strong>{formattedDate}</strong></span>
          </div>
        </div>

        {/* Top Control Bar */}
        <div className="result-top-bar no-print">
          <div>
            <h1 className="page-heading">Evaluation Result Dashboard</h1>
            <p className="page-subheading">
              Screening analysis generated on {formattedDate}.
            </p>
          </div>

          <div className="result-quick-actions">
            <button
              type="button"
              className="btn btn-print"
              onClick={handlePrint}
              title="Print or save this summary as PDF (excludes uploaded files)"
            >
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
              </svg>
              Print / Save Summary
            </button>

            <Link to="/upload" className="btn primary">
              Start New Check
            </Link>
          </div>
        </div>

        {/* Section 1 & 2: Risk Summary & Gauge */}
        <RiskSummary probability={probability} category={category} />

        {/* Section 3: Marker Table */}
        <MarkerTable labValues={labValues} />

        {/* Section 4: Top Contributing Factors */}
        <FactorList factors={topFactors} />

        {/* Section 5: Next Steps Card */}
        <NextStepsCard category={category} />

        {/* Section 6: Limitations & Disclaimer (Always visible per Rule 2 & 9) */}
        <DisclaimerBlock />

        {/* Bottom Actions */}
        <div className="result-bottom-actions no-print">
          <Link to="/upload" className="btn primary">
            Start New Check (Upload Report)
          </Link>
          <Link to="/manual" className="btn">
            Enter Lab Values Manually
          </Link>
          <button
            type="button"
            className="btn"
            onClick={handlePrint}
          >
            Print / Save Summary
          </button>
        </div>
      </div>
    </div>
  );
}
