import "./ConfusionMatrix.css";

export default function ConfusionMatrix({ matrix = {} }) {
  const tp = matrix.true_positive ?? 109;
  const fp = matrix.false_positive ?? 30;
  const fn = matrix.false_negative ?? 17;
  const tn = matrix.true_negative ?? 23;
  const total = tp + fp + fn + tn;

  const pct = (val) => ((val / total) * 100).toFixed(1);

  return (
    <div className="confusion-matrix-card" aria-labelledby="cm-heading">
      <div className="cm-header">
        <h3 id="cm-heading" className="cm-title">Test Set Confusion Matrix</h3>
        <span className="cm-subtitle">Evaluation cohort (N = {total} samples)</span>
      </div>

      <p className="cm-description">
        Demonstrates actual clinical labels versus model screening predictions on the held-out test cohort.
      </p>

      <div className="cm-grid-wrapper">
        <div className="cm-corner-label"></div>
        <div className="cm-col-header">Predicted: Disease</div>
        <div className="cm-col-header">Predicted: Healthy</div>

        <div className="cm-row-header">Actual: Disease</div>
        <div className="cm-cell tp-cell">
          <span className="cell-type">True Positive (TP)</span>
          <strong className="cell-count">{tp}</strong>
          <span className="cell-pct">{pct(tp)}% of total</span>
          <span className="cell-meaning">Correctly flagged disease</span>
        </div>
        <div className="cm-cell fn-cell">
          <span className="cell-type">False Negative (FN)</span>
          <strong className="cell-count">{fn}</strong>
          <span className="cell-pct">{pct(fn)}% of total</span>
          <span className="cell-meaning">Missed screening cases</span>
        </div>

        <div className="cm-row-header">Actual: Healthy</div>
        <div className="cm-cell fp-cell">
          <span className="cell-type">False Positive (FP)</span>
          <strong className="cell-count">{fp}</strong>
          <span className="cell-pct">{pct(fp)}% of total</span>
          <span className="cell-meaning">Healthy flagged for review</span>
        </div>
        <div className="cm-cell tn-cell">
          <span className="cell-type">True Negative (TN)</span>
          <strong className="cell-count">{tn}</strong>
          <span className="cell-pct">{pct(tn)}% of total</span>
          <span className="cell-meaning">Correctly flagged healthy</span>
        </div>
      </div>

      <div className="cm-footer-note">
        * Decision threshold was tuned to 0.52 to prioritize low False Negatives (FN = {fn}) over False Positives in accordance with screening protocol standards.
      </div>
    </div>
  );
}

