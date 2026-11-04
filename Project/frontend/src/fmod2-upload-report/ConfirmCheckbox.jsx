import "./ConfirmCheckbox.css";

export default function ConfirmCheckbox({ checked, onChange, disabled }) {
  return (
    <div className={`confirm-checkbox-container ${disabled ? "is-disabled" : ""}`}>
      <label className="checkbox-label" htmlFor="confirm-values-checkbox">
        <input
          id="confirm-values-checkbox"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="checkbox-input"
        />
        <div className="checkbox-text">
          <strong className="checkbox-title">I have checked and confirmed these values.</strong>
          <span className="checkbox-desc">
            I verify that the above laboratory figures accurately reflect my blood-test report.
            Unconfirmed OCR output cannot be used for risk calculation.
          </span>
        </div>
      </label>
    </div>
  );
}

