import { useState } from "react";
import FieldWithHint from "./FieldWithHint";
import { FIELD_DEFINITIONS } from "./useLabValidation";
import "./ManualEntryForm.css";

export default function ManualEntryForm({
  validation,
  onSubmit,
  isSubmitting = false,
  apiError = "",
}) {
  const { values, errors, warnings, touched, isValid, handleChange, handleBlur, resetForm } =
    validation;

  // Group fields into logical clinical sections
  const demographicFields = FIELD_DEFINITIONS.filter((f) =>
    ["age", "gender"].includes(f.key)
  );

  const enzymeFields = FIELD_DEFINITIONS.filter((f) =>
    ["total_bilirubin", "direct_bilirubin", "alkphos", "sgpt", "sgot"].includes(f.key)
  );

  const proteinFields = FIELD_DEFINITIONS.filter((f) =>
    ["total_proteins", "albumin", "ag_ratio"].includes(f.key)
  );

  const optionalFields = FIELD_DEFINITIONS.filter((f) =>
    ["platelet_count", "pt", "inr", "ggt"].includes(f.key)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    onSubmit(values);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all entered values?")) {
      resetForm({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="manual-entry-form" noValidate>
      {apiError && (
        <div className="form-global-error-alert" role="alert">
          <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="error-text-wrap">
            <strong>Server Validation Error: </strong>
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* Section 1: Demographics */}
      <fieldset className="form-section">
        <legend className="section-title">1. Patient Information</legend>
        <p className="section-subtitle">
          Basic demographic characteristics required by the baseline screening model.
        </p>
        <div className="fields-grid two-cols">
          {demographicFields.map((f) => (
            <FieldWithHint
              key={f.key}
              fieldDef={f}
              value={values[f.key] ?? ""}
              error={errors[f.key]}
              warning={warnings[f.key]}
              isTouched={touched[f.key]}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
          ))}
        </div>
      </fieldset>

      {/* Section 2: Bilirubin & Liver Enzymes */}
      <fieldset className="form-section">
        <legend className="section-title">2. Bilirubin & Liver Enzymes</legend>
        <p className="section-subtitle">
          Key hepatocellular and hepatobiliary injury markers.
        </p>
        <div className="fields-grid two-cols">
          {enzymeFields.map((f) => (
            <FieldWithHint
              key={f.key}
              fieldDef={f}
              value={values[f.key] ?? ""}
              error={errors[f.key]}
              warning={warnings[f.key]}
              isTouched={touched[f.key]}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
          ))}
        </div>
      </fieldset>

      {/* Section 3: Proteins & Ratios */}
      <fieldset className="form-section">
        <legend className="section-title">3. Serum Proteins & Ratios</legend>
        <p className="section-subtitle">
          Synthesis capability indicators (Albumin, Total Protein, A/G Ratio).
        </p>
        <div className="fields-grid two-cols">
          {proteinFields.map((f) => (
            <FieldWithHint
              key={f.key}
              fieldDef={f}
              value={values[f.key] ?? ""}
              error={errors[f.key]}
              warning={warnings[f.key]}
              isTouched={touched[f.key]}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
          ))}
        </div>
      </fieldset>

      {/* Section 4: Optional Extended Markers */}
      <fieldset className="form-section optional-section">
        <legend className="section-title">
          4. Extended Secondary Markers <span className="optional-legend-tag">(Optional)</span>
        </legend>
        <p className="section-subtitle">
          Additional clotting and enzyme markers. Validated only if entered.
        </p>
        <div className="fields-grid two-cols">
          {optionalFields.map((f) => (
            <FieldWithHint
              key={f.key}
              fieldDef={f}
              value={values[f.key] ?? ""}
              error={errors[f.key]}
              warning={warnings[f.key]}
              isTouched={touched[f.key]}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
          ))}
        </div>
      </fieldset>

      {/* Action Bar with Rule 7: Predict button disabled until all required fields valid */}
      <div className="form-actions-bar">
        <button
          type="submit"
          className="btn primary predict-btn"
          disabled={!isValid || isSubmitting}
          title={!isValid ? "Complete all required fields without errors to proceed" : "Generate educational risk prediction"}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-icon" aria-hidden="true">⏳</span>
              Calculating Risk Estimate...
            </>
          ) : (
            "Generate Risk Prediction"
          )}
        </button>

        <button
          type="button"
          className="btn btn-clear"
          onClick={handleClear}
          disabled={isSubmitting}
        >
          Clear Values
        </button>

        {!isValid && (
          <span className="actions-validation-hint" role="status">
            * Please complete all required fields with valid numbers to enable prediction.
          </span>
        )}
      </div>
    </form>
  );
}

