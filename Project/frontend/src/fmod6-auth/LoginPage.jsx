import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import apiClient from "../fmod1-app-shell/api/client";
import "./AuthPages.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [patientId, setPatientId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const destination = location.state?.from?.pathname || "/upload";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedId = patientId.trim().toUpperCase();
    if (!trimmedId) {
      setErrorMessage("Please enter your Patient ID.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // Call backend auth endpoint
      const response = await apiClient.post("/api/auth/login", {
        patient_id: trimmedId,
        password: password,
      });

      const { access_token } = response.data;
      login(trimmedId, access_token);
      navigate(destination, { replace: true });
    } catch (err) {
      // In offline / dev mode without backend, provide a helpful demo fallback if server is unreachable
      if (!err.response && process.env.NODE_ENV !== "production") {
        // Mock fallback for immediate UI testing if backend server is not running
        const mockToken = "demo-jwt-token-" + Date.now();
        login(trimmedId, mockToken);
        navigate(destination, { replace: true });
        return;
      }

      if (err.response?.status === 429) {
        setErrorMessage("Too many attempts. Try again in a few minutes.");
      } else {
        // Generic per bmod6/fmod6 security rule: same message for unknown ID and wrong password
        setErrorMessage("Patient ID or password is incorrect.");
      }
    } finally {
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--blue)">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <h1>Log in to Your Account</h1>
          <p className="auth-subtitle">
            Enter your Patient ID and password to access your blood-test evaluations.
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
            <label htmlFor="patient-id-input">
              Patient ID
              <span className="field-hint"> (e.g. PAT-1024)</span>
            </label>
            <input
              id="patient-id-input"
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
              <label htmlFor="password-input">Password</label>
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
              id="password-input"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn primary auth-submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Do not have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
          <p className="auth-safety-note">
            Note: Sessions are kept in memory for confidentiality.
          </p>
        </div>
      </div>
    </div>
  );
}

