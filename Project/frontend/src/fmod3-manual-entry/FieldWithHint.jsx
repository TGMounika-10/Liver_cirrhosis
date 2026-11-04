import "./FieldWithHint.css";

export default function FieldWithHint({
  fieldDef,
  value = "",
  error,
  warning,
  isTouched,
  onChange,
  onBlur,
  disabled = false,
}) {
  const { key, label, unit, required, type, options, normalRange, hint, placeholder } = fieldDef;
  const showError = Boolean(error && (isTouched || value !== ""));
  const showWarning = Boolean(warning && !showError);

  const inputId = `manual-field-${key}`;
  const errorId = `error-${key}`;
  const hintId = `hint-${key}`;

  return (
    <div className={`form-field-group ${showError ? "has-error" : ""} ${showWarning ? "has-warning" : ""}`}>
      <div className="field-header">
        <label htmlFor={inputId} className="field-label">
          {label}
          {required ? (
            <span className="field-required-marker" title="Required field">*</span>
          ) : (
            <span className="field-optional-badge">Optional</span>
          )}
        </label>
        {normalRange && (
          <span className="field-normal-range" title="Typical clinical normal range">
            Normal: {normalRange}
          </span>
        )}
      </div>

      <div className="field-input-wrapper">
        {type === "select" ? (
          <select
            id={inputId}
            value={value}
            onChange={(e) => onChange(key, e.target.value)}
            onBlur={() => onBlur(key)}
            disabled={disabled}
            className={`field-control ${showError ? "input-error" : ""}`}
            aria-invalid={showError}
            aria-describedby={`${hintId} ${showError ? errorId : ""}`}
            required={required}
          >
            <option value="">Select gender...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <div className="input-affix-container">
            <input
              id={inputId}
              type="number"
              step="any"
              value={value}
              onChange={(e) => onChange(key, e.target.value)}
              onBlur={() => onBlur(key)}
              placeholder={placeholder || ""}
              disabled={disabled}
              className={`field-control ${showError ? "input-error" : ""}`}
              aria-invalid={showError}
              aria-describedby={`${hintId} ${showError ? errorId : ""}`}
              required={required}
            />
            {unit && <span className="field-unit-badge">{unit}</span>}
          </div>
        )}

        {/* Inline error displayed beside/under the field per Frontend Rule 4 & f3.md */}
        {showError && (
          <div id={errorId} className="field-inline-error" role="alert">
            <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {showWarning && (
          <div className="field-inline-warning" role="status">
            <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{warning}</span>
          </div>
        )}
      </div>

      {hint && !showError && (
        <span id={hintId} className="field-bottom-hint">
          {hint}
        </span>
      )}
    </div>
  );
}

