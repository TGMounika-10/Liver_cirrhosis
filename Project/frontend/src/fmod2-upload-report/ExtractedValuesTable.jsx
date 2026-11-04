import { LAB_FIELDS } from "./labFields";
import "./ExtractedValuesTable.css";

/**
 * Editable review table for extracted lab values.
 * Allows user to inspect, edit, and fill in missing values.
 */
export default function ExtractedValuesTable({
  values,
  onChangeValue,
  errors = {},
  warnings = {},
  backendWarnings = [],
  missingKeys = [],
}) {
  return (
    <div className="review-table-container">
      <div className="review-table-header">
        <div>
          <h2 className="review-table-title">Review & Confirm Extracted Values</h2>
          <p className="review-table-subtitle">
            Please verify all extracted markers against your medical report.
            Correct any inaccurate OCR extractions and fill in any missing fields.
          </p>
        </div>

        {backendWarnings.length > 0 && (
          <div className="backend-warnings-summary" role="alert">
            <svg viewBox="0 0 20 20" width="18" height="18" fill="var(--amber-text)" aria-hidden="true">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <strong>Report Extraction Notes:</strong>
              <ul>
                {backendWarnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="table-responsive-wrapper">
        <table className="review-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: "26%" }}>Laboratory Marker</th>
              <th scope="col" style={{ width: "26%" }}>Extracted Value</th>
              <th scope="col" style={{ width: "16%" }}>Unit</th>
              <th scope="col" style={{ width: "16%" }}>Reference Range</th>
              <th scope="col" style={{ width: "16%" }}>Status & Notes</th>
            </tr>
          </thead>
          <tbody>
            {LAB_FIELDS.map((field) => {
              const val = values[field.key] ?? "";
              const isMissing = missingKeys.includes(field.key) || val === "";
              const hasError = Boolean(errors[field.key]);
              const hasWarning = Boolean(warnings[field.key]);

              return (
                <tr
                  key={field.key}
                  className={`review-row ${isMissing && field.required ? "row-missing" : ""} ${hasError ? "row-error" : ""}`}
                >
                  <td className="cell-marker">
                    <span className="marker-name">{field.label}</span>
                    {field.required ? (
                      <span className="required-star" title="Required field">*</span>
                    ) : (
                      <span className="optional-tag">(Optional)</span>
                    )}
                    <span className="marker-desc">{field.description}</span>
                  </td>

                  <td className="cell-input">
                    {field.type === "select" ? (
                      <select
                        id={`input-${field.key}`}
                        value={val}
                        onChange={(e) => onChangeValue(field.key, e.target.value)}
                        className={`field-select ${hasError ? "input-invalid" : ""}`}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `error-${field.key}` : undefined}
                      >
                        <option value="">Select gender...</option>
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="input-with-validation">
                        <input
                          id={`input-${field.key}`}
                          type="number"
                          step="any"
                          value={val}
                          onChange={(e) => onChangeValue(field.key, e.target.value)}
                          placeholder={isMissing ? "Enter value" : ""}
                          className={`field-input ${hasError ? "input-invalid" : ""} ${isMissing && field.required ? "input-empty-missing" : ""}`}
                          aria-invalid={hasError}
                          aria-describedby={hasError ? `error-${field.key}` : undefined}
                        />
                      </div>
                    )}

                    {/* Validation error displayed directly beside/under field per Frontend Rule 4 */}
                    {hasError && (
                      <div id={`error-${field.key}`} className="field-error-msg" role="alert">
                        {errors[field.key]}
                      </div>
                    )}
                    {hasWarning && !hasError && (
                      <div className="field-warning-msg" role="status">
                        {warnings[field.key]}
                      </div>
                    )}
                  </td>

                  <td className="cell-unit">
                    <span className="unit-badge">{field.unit}</span>
                  </td>

                  <td className="cell-range">
                    <span className="range-text">{field.normalRange || "—"}</span>
                  </td>

                  <td className="cell-status">
                    {isMissing && field.required ? (
                      <span className="status-chip missing">Missing (Required)</span>
                    ) : hasError ? (
                      <span className="status-chip error">Needs Correction</span>
                    ) : (
                      <span className="status-chip extracted">Verified</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

