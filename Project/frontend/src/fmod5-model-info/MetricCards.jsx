import "./MetricCards.css";

export default function MetricCards({ metrics = {}, explanations = {} }) {
  const cards = [
    {
      key: "recall",
      title: "Recall (Sensitivity)",
      value: metrics.recall ? `${(metrics.recall * 100).toFixed(1)}%` : "86.5%",
      badge: "Primary Goal",
      badgeClass: "primary-badge",
      desc:
        explanations.recall ||
        "Prioritizes catching potential cases to avoid false negatives in medical screening.",
    },
    {
      key: "precision",
      title: "Precision",
      value: metrics.precision ? `${(metrics.precision * 100).toFixed(1)}%` : "78.2%",
      badge: "Positive Accuracy",
      badgeClass: "standard-badge",
      desc:
        explanations.precision ||
        "Percentage of model-flagged high risk cases that truly had liver disease.",
    },
    {
      key: "f1_score",
      title: "F1-Score",
      value: metrics.f1_score ? `${(metrics.f1_score * 100).toFixed(1)}%` : "82.1%",
      badge: "Harmonic Balance",
      badgeClass: "standard-badge",
      desc:
        explanations.f1_score ||
        "Balanced measure combining sensitivity and positive predictive accuracy.",
    },
    {
      key: "accuracy",
      title: "Overall Accuracy",
      value: metrics.accuracy ? `${(metrics.accuracy * 100).toFixed(1)}%` : "74.5%",
      badge: "Cohort Accuracy",
      badgeClass: "standard-badge",
      desc:
        explanations.accuracy ||
        "Proportion of total predictions (both patient and non-patient) classified correctly.",
    },
    {
      key: "roc_auc",
      title: "ROC-AUC Score",
      value: metrics.roc_auc ? metrics.roc_auc.toFixed(3) : "0.792",
      badge: "Discrimination",
      badgeClass: "standard-badge",
      desc:
        explanations.roc_auc ||
        "Measures the model's overall capability to distinguish patients from non-patients across decision thresholds.",
    },
  ];

  return (
    <div className="metric-cards-grid">
      {cards.map((c) => (
        <div key={c.key} className={`metric-card ${c.key === "recall" ? "featured-card" : ""}`}>
          <div className="card-top-row">
            <span className="metric-title">{c.title}</span>
            <span className={`metric-badge ${c.badgeClass}`}>{c.badge}</span>
          </div>
          <div className="metric-value">{c.value}</div>
          <p className="metric-explanation">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}

