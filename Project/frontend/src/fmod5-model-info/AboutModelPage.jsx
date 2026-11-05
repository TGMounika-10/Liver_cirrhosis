import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../fmod1-app-shell/api/client";
import MetricCards from "./MetricCards";
import ConfusionMatrix from "./ConfusionMatrix";
import ClassBalanceChart from "./ClassBalanceChart";
import SubgroupTable from "./SubgroupTable";
import LimitationsList from "./LimitationsList";
import { DEFAULT_MODEL_INFO } from "./modelData";
import "./AboutModelPage.css";

export default function AboutModelPage() {
  const [modelInfo, setModelInfo] = useState(DEFAULT_MODEL_INFO);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const fetchModelInfo = async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const response = await apiClient.get("/api/model/info");
      if (response.data && response.data.metrics) {
        setModelInfo(response.data);
      } else {
        // Use default benchmark data if response is empty
        setModelInfo(DEFAULT_MODEL_INFO);
      }
    } catch (err) {
      // In offline / dev mode, fall back to benchmark modelData while displaying a soft notice
      if (!err.response) {
        setModelInfo(DEFAULT_MODEL_INFO);
      } else {
        setFetchError("Unable to load live metrics from the model service. Showing cached benchmark specifications.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelInfo();
  }, []);

  return (
    <div className="about-model-page">
      <div className="about-model-container">
        {/* Page Header */}
        <header className="about-header">
          <div className="header-badge-row">
            <span className="info-badge">Model Transparency & Governance</span>
            <span className="version-badge">{modelInfo.model_version || "v1.0.0"}</span>
          </div>
          <h1 className="about-title">Algorithm Specifications & Performance</h1>
          <p className="about-subtitle">
            Complete transparency on training datasets, classification metrics, subgroup fairness, and limitations
            for the Liver Cirrhosis Risk Prediction System.
          </p>

          <div className="meta-pills-row">
            <div className="meta-pill">
              <span className="meta-label">Architecture:</span>
              <strong>{modelInfo.model_name}</strong>
            </div>
            <div className="meta-pill">
              <span className="meta-label">Training Date:</span>
              <strong>{modelInfo.training_date}</strong>
            </div>
            <div className="meta-pill">
              <span className="meta-label">Dataset:</span>
              <strong>{modelInfo.dataset?.name}</strong>
            </div>
          </div>
        </header>

        {/* Error alert with retry button if backend call failed */}
        {fetchError && (
          <div className="fetch-error-banner" role="alert">
            <div className="error-text">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{fetchError}</span>
            </div>
            <button
              type="button"
              className="btn sm"
              onClick={fetchModelInfo}
              disabled={loading}
            >
              {loading ? "Retrying..." : "Retry Connection"}
            </button>
          </div>
        )}

        {/* Section 1: Performance Metric Cards */}
        <section aria-labelledby="metrics-summary-heading">
          <h2 id="metrics-summary-heading" className="section-heading">
            Evaluation Metrics
          </h2>
          <MetricCards
            metrics={modelInfo.metrics}
            explanations={modelInfo.metric_explanations}
          />
        </section>

        {/* Section 2: Confusion Matrix & Class Balance */}
        <section className="two-column-section">
          <ConfusionMatrix matrix={modelInfo.confusion_matrix} />
          <ClassBalanceChart distribution={modelInfo.dataset?.class_distribution} />
        </section>

        {/* Section 3: Subgroup Performance */}
        <section aria-labelledby="subgroup-heading">
          <h2 id="subgroup-heading" className="section-heading">
            Fairness & Demographic Subgroups
          </h2>
          <SubgroupTable subgroups={modelInfo.subgroups} />
        </section>

        {/* Section 4: Known Limitations */}
        <section aria-labelledby="limitations-heading">
          <h2 id="limitations-heading" className="section-heading">
            Clinical Limitations
          </h2>
          <LimitationsList limitations={modelInfo.limitations} />
        </section>

        {/* Section 5: Call to action */}
        <section className="about-cta-card">
          <h2>Ready to Check Your Lab Values?</h2>
          <p>
            Upload an existing laboratory report or manually enter your metrics to view your personalized risk estimate.
          </p>
          <div className="cta-buttons">
            <Link to="/upload" className="btn primary">
              Upload Report
            </Link>
            <Link to="/manual" className="btn">
              Manual Entry
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
