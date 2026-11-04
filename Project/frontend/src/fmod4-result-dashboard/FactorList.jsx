import "./FactorList.css";

/**
 * Top Contributing Factors component.
 * Displays 3 to 5 plain-language explanations from the model explainability engine (SHAP).
 */
export default function FactorList({ factors = [] }) {
  if (!factors || factors.length === 0) {
    return (
      <div className="factor-list-card">
        <h3 className="factors-title">Key Contributing Factors</h3>
        <p className="no-factors-text">
          No individual marker stood out as a dominant driver for this estimate. The risk estimate reflects the cumulative pattern across all submitted markers.
        </p>
      </div>
    );
  }

  return (
    <section className="factor-list-card" aria-labelledby="factors-heading">
      <div className="factors-header">
        <h3 id="factors-heading" className="factors-title">
          Top Contributing Factors
        </h3>
        <span className="factors-badge">Explainable AI (SHAP Analysis)</span>
      </div>

      <p className="factors-intro">
        The factors below represent the primary laboratory markers that influenced the model&apos;s statistical estimate either upward or downward.
      </p>

      <ul className="factors-list">
        {factors.map((factor, index) => {
          const isPositive =
            factor.impact === "positive" ||
            factor.message?.toLowerCase().includes("increased") ||
            factor.message?.toLowerCase().includes("elevated");

          return (
            <li
              key={index}
              className={`factor-item ${isPositive ? "impact-up" : "impact-down"}`}
            >
              <div className="factor-icon-bubble" aria-hidden="true">
                {isPositive ? (
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="factor-content">
                <span className="factor-message">{factor.message}</span>
                <span className="factor-impact-label">
                  {isPositive ? "Pushed estimate upward" : "Lowered estimate"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="factors-footnote">
        * Note: These explanations describe how the algorithm weighted your inputs, not a biological cause of disease.
      </p>
    </section>
  );
}

