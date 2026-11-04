import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import apiClient from "../fmod1-app-shell/api/client";
import "./AuthPages.css";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation criteria checklist
  const criteria = useMemo(() => {
    return {
      idValid: /^[a-zA-Z0-9_-]{4,20}$/.test(patientId.trim()),
      hasLength: password.length >= 8 && password.length <= 64,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      passwordsMatch: Boolean(password && password === confirmPassword),
    };
  }, [patientId, password, confirmPassword]);

  const isValid =
    criteria.idValid &&
    criteria.hasLength &&
    criteria.hasLetter &&
    criteria.hasNumber &&
    criteria.passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isValid) {
      setErrorMessage("Please ensure all requirements below are met before signing up.");
      return;
    }

    const normalizedId = patientId.trim().toUpperCase();
    setLoading(true);

    try {
      const response = await apiClient.post("/api/auth/signup", {
        patient_id: normalizedId,
        password: password,
      });

      const { access_token } = response.data;
      signup(normalizedId, access_token);
      navigate("/upload", { replace: true });
    } catch (err) {
      // In offline / dev mode without backend, provide a helpful demo fallback if server is unreachable
      if (!err.response && process.env.NODE_ENV !== "production") {
        const mockToken = "demo-jwt-token-" + Date.now();
        signup(normalizedId, mockToken);
        navigate("/upload", { replace: true });
        return;
      }

      if (err.response?.status === 409) {
        setErrorMessage("Patient ID is already taken. Please choose another one.");
      } else if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("An error occurred during account creation. Please try again.");
      }
    } finally {
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--blue)">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h1>Create an Account</h1>
          <p className="auth-subtitle">
            Sign up with a unique Patient ID and password to access screening tools.
          </p>
        </div>

        {errorMessage && (
          <div className="auth-error-alert" role="alert">
            <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="patient-id-signup">
              Choose Patient ID
              <span className="field-hint"> (4–20 letters, numbers, -, _)</span>
            </label>
            <input
              id="patient-id-signup"
              type="text"
              autoComplete="username"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g. PAT-1024"
              required
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password-signup">Password</label>
              <button
                type="button"
                className="toggle-pw-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="password-signup"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password-signup">Confirm Password</label>
            <input
              id="confirm-password-signup"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Live password requirements checklist per f6.md */}
          <div className="checklist-container" aria-live="polite">
            <span className="checklist-heading">Password Requirements:</span>
            <ul className="checklist">
              <li className={criteria.idValid ? "valid" : "invalid"}>
                {criteria.idValid ? "✓" : "○"} Valid Patient ID (4–20 characters, no spaces)
              </li>
              <li className={criteria.hasLength ? "valid" : "invalid"}>
                {criteria.hasLength ? "✓" : "○"} Between 8 and 64 characters
              </li>
              <li className={criteria.hasLetter ? "valid" : "invalid"}>
                {criteria.hasLetter ? "✓" : "○"} At least one letter
              </li>
              <li className={criteria.hasNumber ? "valid" : "invalid"}>
                {criteria.hasNumber ? "✓" : "○"} At least one number
              </li>
              <li className={criteria.passwordsMatch ? "valid" : "invalid"}>
                {criteria.passwordsMatch ? "✓" : "○"} Passwords match
              </li>
            </ul>
          </div>

          <div className="auth-recovery-warning">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Keep your password safe; it cannot be recovered as no email or phone is stored.</span>
          </div>

          <button
            type="submit"
            className="btn primary auth-submit-btn"
            disabled={!isValid || loading}
          >
            {loading ? "Creating account..." : "Sign Up & Continue"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

