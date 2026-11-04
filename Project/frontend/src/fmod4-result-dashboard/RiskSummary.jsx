import RiskGauge from "./RiskGauge";
import "./RiskSummary.css";

export default function RiskSummary({ probability = 0.5, category = "Moderate" }) {
  const percent = Math.min(100, Math.max(0, Math.round(probability * 100)));

  const categoryDescriptions = {
    Low: "Submitted biomarkers are largely within typical baseline ranges. While estimated risk is low, lifestyle precautions and periodic health screenings remain recommended.",
    Moderate: "Certain markers are borderline or moderately elevated compared to reference populations. A clinical review with a physician is recommended to identify contributing factors.",
    High: "Several critical liver markers diverge substantially from normal clinical reference intervals. Prompt consultation with a healthcare professional or hepatologist is strongly advised for thorough clinical evaluation.",
  };

  const description = categoryDescriptions[category] || categoryDescriptions.Moderate;

  return (
    <section className={`risk-summary-card category-${category.toLowerCase()}`} aria-labelledby="risk-summary-heading">
      <div className="summary-details">
        <span className="summary-badge-label">Screening Assessment Result</span>
        
        {/* Strict adherence to Frontend Rule 1 & Rule 8: Never say "You have cirrhosis" */}
        <h2 id="risk-summary-heading" className="summary-title">
          Model-Estimated Liver Disease / Cirrhosis Risk: {percent}%
        </h2>

        <div className="summary-category-row">
          <span className="category-tag">Category: <strong>{category} Risk</strong></span>
          <span className="probability-tag">Statistical Probability: <strong>{probability.toFixed(2)}</strong></span>
        </div>

        <p className="summary-description">{description}</p>

        <p className="summary-disclaimer-note">
          <strong>Important Clinical Note:</strong> This probability reflects machine learning pattern correlation with liver patient lab records (ILPD). It does not confirm or diagnose cirrhosis, fibrosis, or any disease.
        </p>
      </div>

      <div className="summary-gauge-wrapper">
        <RiskGauge probability={probability} category={category} />
      </div>
    </section>
  );
}

