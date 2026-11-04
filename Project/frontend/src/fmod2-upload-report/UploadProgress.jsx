import "./UploadProgress.css";

/**
 * Upload & Extraction progress component.
 * Displays progress percentage and sequential statuses:
 * "Uploading", "Reading report", "Extracting values"
 */
export default function UploadProgress({ percent = 0, statusMessage = "Uploading file..." }) {
  const steps = [
    { label: "Uploading", active: percent < 40 },
    { label: "Reading report", active: percent >= 40 && percent < 75 },
    { label: "Extracting values", active: percent >= 75 },
  ];

  return (
    <div className="upload-progress-container" role="region" aria-label="Upload and extraction progress">
      <div className="progress-header">
        <span className="progress-label">{statusMessage}</span>
        <span className="progress-percent">{Math.min(100, Math.round(percent))}%</span>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress-fill"
          style={{ width: `${Math.min(100, Math.max(5, percent))}%` }}
        />
      </div>

      <div className="progress-steps-list">
        {steps.map((s, idx) => {
          const isDone = percent > (idx === 0 ? 40 : idx === 1 ? 75 : 95);
          return (
            <div
              key={s.label}
              className={`progress-step-item ${s.active ? "current" : ""} ${isDone ? "completed" : ""}`}
            >
              <div className="step-dot">{isDone ? "✓" : idx + 1}</div>
              <span className="step-text">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

