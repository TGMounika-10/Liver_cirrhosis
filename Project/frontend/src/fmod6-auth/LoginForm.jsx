import { useState } from "react";
import PasswordField from "./PasswordField";
import "./LoginForm.css";

export default function LoginForm({ onSubmit, loading = false, error = "" }) {
  const [patientId, setPatientId] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    const trimmedId = patientId.trim().toUpperCase();
    if (!trimmedId) {
      setLocalError("Please enter your Patient ID.");
      return;
    }
    if (!password) {
      setLocalError("Please enter your password.");
      return;
    }

    onSubmit({
      patientId: trimmedId,
      password: password,
    });

    // Clear password from local state for security per specifications
    setPassword("");
  };

  const displayError = error || localError;

  return (
    <form onSubmit={handleSubmit} className="login-form-component" noValidate>
      {displayError && (
        <div className="auth-alert error" role="alert">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{displayError}</span>
        </div>
      )}

      <div className="auth-field-group">
        <label htmlFor="login-patient-id" className="auth-label">
          Patient ID <span className="auth-hint">(e.g. PAT-1024)</span>
        </label>
        <input
          id="login-patient-id"
          type="text"
          autoComplete="username"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="e.g. PAT-1024"
          required
          disabled={loading}
          className="auth-input"
        />
      </div>

      <PasswordField
        id="login-password"
        label="Password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
        required
        disabled={loading}
      />

      <button type="submit" className="btn primary auth-btn" disabled={loading}>
        {loading ? "Authenticating..." : "Log In"}
      </button>
    </form>
  );
}

