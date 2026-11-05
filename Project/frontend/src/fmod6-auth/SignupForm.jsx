import { useState, useMemo } from "react";
import PasswordField from "./PasswordField";
import PasswordChecklist from "./PasswordChecklist";
import "./SignupForm.css";

export default function SignupForm({ onSubmit, loading = false, error = "", idError = "" }) {
  const [patientId, setPatientId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const criteria = useMemo(() => {
    const trimmed = patientId.trim();
    return {
      isIdValid: /^[a-zA-Z0-9_-]{4,20}$/.test(trimmed),
      hasLength: password.length >= 8 && password.length <= 64,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      passwordsMatch: Boolean(password && password === confirmPassword),
    };
  }, [patientId, password, confirmPassword]);

  const isValid =
    criteria.isIdValid &&
    criteria.hasLength &&
    criteria.hasLetter &&
    criteria.hasNumber &&
    criteria.passwordsMatch;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!isValid) {
      setLocalError("Please fulfill all criteria listed in the checklist below.");
      return;
    }

    const normalizedId = patientId.trim().toUpperCase();

    onSubmit({
      patientId: normalizedId,
      password: password,
    });

    // Clear passwords from state for security
    setPassword("");
    setConfirmPassword("");
  };

  const displayError = error || localError;

  return (
    <form onSubmit={handleSubmit} className="signup-form-component" noValidate>
      {displayError && (
        <div className="auth-alert error" role="alert">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{displayError}</span>
        </div>
      )}

      {/* Patient ID with 409 inline error mapping */}
      <div className={`auth-field-group ${idError ? "has-error" : ""}`}>
        <label htmlFor="signup-patient-id" className="auth-label">
          Choose Patient ID <span className="auth-hint">(4–20 characters, A-Z, 0-9, -, _)</span>
        </label>
        <input
          id="signup-patient-id"
          type="text"
          autoComplete="username"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="e.g. PAT-1024"
          required
          disabled={loading}
          className={`auth-input ${idError ? "input-invalid" : ""}`}
          aria-invalid={Boolean(idError)}
          aria-describedby={idError ? "patient-id-taken-error" : undefined}
        />
        {idError && (
          <span id="patient-id-taken-error" className="field-inline-error" role="alert">
            {idError}
          </span>
        )}
      </div>

      <PasswordField
        id="signup-password"
        label="Password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        required
        disabled={loading}
      />

      <PasswordField
        id="signup-confirm-password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        required
        disabled={loading}
      />

      {/* Live Checklist */}
      <PasswordChecklist
        isIdValid={criteria.isIdValid}
        hasLength={criteria.hasLength}
        hasLetter={criteria.hasLetter}
        hasNumber={criteria.hasNumber}
        passwordsMatch={criteria.passwordsMatch}
      />

      {/* Recovery Disclaimer per f6.md specifications */}
      <div className="auth-recovery-notice">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>
          <strong>Keep your password safe:</strong> Passwords cannot be recovered because no email address or telephone number is collected.
        </span>
      </div>

      <button
        type="submit"
        className="btn primary auth-btn"
        disabled={!isValid || loading}
        title={!isValid ? "Fulfill all password and ID criteria to sign up" : "Create Account"}
      >
        {loading ? "Creating Account..." : "Create Account & Sign In"}
      </button>
    </form>
  );
}

