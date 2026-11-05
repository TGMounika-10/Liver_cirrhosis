import "./ClassBalanceChart.css";

export default function ClassBalanceChart({ distribution = {} }) {
  const diseaseCount = distribution.liver_disease_patients ?? 416;
  const healthyCount = distribution.non_patients ?? 167;
  const total = diseaseCount + healthyCount;

  const diseasePct = ((diseaseCount / total) * 100).toFixed(1);
  const healthyPct = ((healthyCount / total) * 100).toFixed(1);

  return (
    <div className="class-balance-card" aria-labelledby="class-balance-heading">
      <div className="cb-header">
        <h3 id="class-balance-heading" className="cb-title">Training Class Distribution</h3>
        <span className="cb-subtitle">ILPD Cohort (N = {total} patients)</span>
      </div>

      <p className="cb-description">
        Demonstrates the natural imbalance between liver disease cases and non-patients in the source training data.
      </p>

      {/* Progress representation bar */}
      <div className="cb-stacked-bar" role="img" aria-label={`Class distribution: ${diseasePct}% liver disease, ${healthyPct}% healthy`}>
        <div
          className="bar-segment disease-segment"
          style={{ width: `${diseasePct}%` }}
          title={`Liver Disease: ${diseaseCount} (${diseasePct}%)`}
        >
          <span className="segment-label">{diseasePct}%</span>
        </div>
        <div
          className="bar-segment healthy-segment"
          style={{ width: `${healthyPct}%` }}
          title={`Non-Patients: ${healthyCount} (${healthyPct}%)`}
        >
          <span className="segment-label">{healthyPct}%</span>
        </div>
      </div>

      <div className="cb-legend-grid">
        <div className="cb-legend-card disease">
          <div className="legend-indicator"></div>
          <div className="legend-info">
            <span className="legend-name">Liver Disease Cohort</span>
            <strong className="legend-count">{diseaseCount} records ({diseasePct}%)</strong>
            <span className="legend-sub">Historical patients diagnosed with liver pathology</span>
          </div>
        </div>

        <div className="cb-legend-card healthy">
          <div className="legend-indicator"></div>
          <div className="legend-info">
            <span className="legend-name">Non-Patient Control Cohort</span>
            <strong className="legend-count">{healthyCount} records ({healthyPct}%)</strong>
            <span className="legend-sub">Healthy control individuals without liver disease</span>
          </div>
        </div>
      </div>

      <div className="cb-note">
        * <strong>Imbalance Handling:</strong> Training utilized stratified k-fold cross-validation and adjusted positive class weights to compensate for the 71.4% prevalence skew without compromising control specificity.
      </div>
    </div>
  );
}

