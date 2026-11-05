import "./LimitationsList.css";

export default function LimitationsList({ limitations = [] }) {
  return (
    <div className="limitations-card" role="region" aria-labelledby="limitations-heading">
      <div className="limitations-header">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="var(--amber-text)" aria-hidden="true">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
        <h3 id="limitations-heading" className="limitations-title">
          Model Limitations & Ethical Disclosure
        </h3>
      </div>

      <div className="not-a-diagnostic-callout">
        <strong>Important Statement:</strong> This machine learning screening tool is <strong>not a medical device</strong> and does not replace the clinical judgement, differential diagnosis, or physical assessment of a licensed medical practitioner.
      </div>

      <ul className="limitations-items">
        {limitations.map((item, index) => (
          <li key={index} className="limitation-bullet">
            <span className="bullet-num">{index + 1}</span>
            <span className="bullet-text">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

