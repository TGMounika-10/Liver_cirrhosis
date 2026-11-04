import "./RiskGauge.css";

/**
 * Semi-circle Risk Gauge component.
 * Renders an SVG arc divided into Green (Low), Amber (Moderate), and Red (High) zones,
 * with an indicator needle pointing to the model's estimated probability.
 */
export default function RiskGauge({ probability = 0.5, category = "Moderate" }) {
  const percent = Math.min(100, Math.max(0, Math.round(probability * 100)));

  // Gauge angle from -90 deg (0%) to +90 deg (100%)
  const needleAngle = -90 + (percent / 100) * 180;

  const categoryColor =
    category === "High"
      ? "var(--red)"
      : category === "Moderate"
      ? "var(--amber-text)"
      : "var(--green)";

  return (
    <div
      className="risk-gauge-container"
      role="img"
      aria-label={`Risk gauge showing ${percent}% model-estimated risk, categorized as ${category} risk.`}
    >
      <svg
        viewBox="0 0 240 140"
        className="risk-gauge-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2E7D32" />
            <stop offset="35%" stopColor="#2E7D32" />
            <stop offset="36%" stopColor="#F9A825" />
            <stop offset="55%" stopColor="#F9A825" />
            <stop offset="56%" stopColor="#C62828" />
            <stop offset="100%" stopColor="#C62828" />
          </linearGradient>
        </defs>

        {/* Gauge background arc track */}
        <path
          d="M 30 120 A 90 90 0 0 1 210 120"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Colored risk zone segments */}
        <path
          d="M 30 120 A 90 90 0 0 1 210 120"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Ticks and Zone Labels */}
        <text x="30" y="136" textAnchor="middle" className="gauge-axis-label">0%</text>
        <text x="120" y="24" textAnchor="middle" className="gauge-axis-label">50%</text>
        <text x="210" y="136" textAnchor="middle" className="gauge-axis-label">100%</text>

        {/* Needle pointer */}
        <g transform={`translate(120, 120) rotate(${needleAngle})`}>
          <polygon points="-5,0 0,-85 5,0" fill="#1F2937" />
          <circle cx="0" cy="0" r="10" fill="#1565C0" />
          <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
        </g>
      </svg>

      <div className="gauge-readout">
        <span className="gauge-percent-text">{percent}%</span>
        <span
          className={`gauge-category-pill category-${category.toLowerCase()}`}
          style={{ borderColor: categoryColor }}
        >
          {category} Risk
        </span>
      </div>

      <div className="gauge-legend">
        <span className="legend-item low">
          <i className="legend-dot green"></i> Low (&lt;35%)
        </span>
        <span className="legend-item moderate">
          <i className="legend-dot amber"></i> Moderate (35–52%)
        </span>
        <span className="legend-item high">
          <i className="legend-dot red"></i> High (≥52%)
        </span>
      </div>
    </div>
  );
}

