import { useState } from "react";
import "./PasswordField.css";

/**
 * Accessible Password Input with Show/Hide toggle and password manager autocomplete support.
 */
export default function PasswordField({
  id,
  label = "Password",
  value = "",
  onChange,
  autoComplete = "current-password",
  placeholder = "••••••••",
  required = true,
  error = "",
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShow = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`password-field-group ${error ? "has-error" : ""}`}>
      <div className="label-row">
        <label htmlFor={id} className="pw-label">
          {label}
        </label>
        <button
          type="button"
          className="toggle-visibility-btn"
          onClick={toggleShow}
          disabled={disabled}
          aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <div className="pw-input-wrapper">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`pw-input ${error ? "input-invalid" : ""}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>

      {error && (
        <span id={`${id}-error`} className="pw-error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

