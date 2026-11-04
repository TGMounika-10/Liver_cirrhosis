import "./DisclaimerBlock.css";

/**
 * Permanent (non-collapsed) Disclaimer & Model Limitations block.
 * Adheres strictly to Frontend Rules 2, 9, and 14.
 */
export default function DisclaimerBlock() {
  return (
    <div className="disclaimer-block-card" role="region" aria-label="Model Limitations and Medical Disclaimer">
      <div className="disclaimer-block-header">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="var(--amber-text)" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        <h3 className="disclaimer-block-title">Model Limitations & Medical Notice</h3>
      </div>

      <div className="disclaimer-block-body">
        <div className="disclaimer-callout">
          <strong>Non-Diagnostic Advisory:</strong> This application is an educational screening aid powered by statistical machine learning. It is not an FDA-cleared or CE-marked medical diagnostic device. It does not provide medical advice or establish a definitive diagnosis of cirrhosis or any other clinical condition.
        </div>

        <div className="limitations-grid">
          <div className="limitation-item">
            <h4>Dataset Demographics</h4>
            <p>
              Trained on the Indian Liver Patient Dataset (ILPD, 583 records). The cohort has known male-preponderance (~76% male). Predictive accuracy may vary across different demographic groups, ages, and geographical cohorts.
            </p>
          </div>

          <div className="limitation-item">
            <h4>Disease Etiology</h4>
            <p>
              The model estimates general pattern likelihood of liver disease based on circulating biochemical markers. It cannot distinguish between specific etiologies (e.g., viral hepatitis, alcoholic hepatitis, metabolic dysfunction-associated steatotic liver disease, or biliary disorders) without clinical imaging and biopsy.
            </p>
          </div>

          <div className="limitation-item">
            <h4>Laboratory Verification</h4>
            <p>
              Laboratory values entered manually or parsed via OCR must always be cross-checked against official certified lab reports. Biological variance and differing assay instruments can cause physiological shifts across laboratories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

