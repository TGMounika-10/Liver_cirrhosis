import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./DisclaimerBanner.css";

/**
 * Global Medical Disclaimer Banner.
 * - Always visible on `/result` (non-dismissible per medical safety rules).
 * - Dismissible on Home (`/`) and general pages.
 */
export default function DisclaimerBanner() {
  const location = useLocation();
  const isResultScreen = location.pathname === "/result";
  const [dismissedOnHome, setDismissedOnHome] = useState(false);

  // If navigating back to a result screen, it must always be visible
  const isVisible = isResultScreen || !dismissedOnHome;

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      className={`disclaimer-banner ${isResultScreen ? "result-disclaimer" : "standard-disclaimer"}`}
      role="note"
      aria-label="Medical Disclaimer"
    >
      <div className="disclaimer-content">
        <div className="disclaimer-icon-wrapper" aria-hidden="true">
          <svg className="disclaimer-icon" viewBox="0 0 24 24" width="22" height="22">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"
            />
          </svg>
        </div>

        <div className="disclaimer-text">
          <strong className="disclaimer-title">Medical Disclaimer: </strong>
          <span>
            This tool is an educational screening aid and does not constitute medical advice or a diagnosis.
            Estimates are derived from laboratory values and require consultation with a qualified doctor or healthcare specialist.
          </span>
          {isResultScreen && (
            <div className="disclaimer-mandatory-note">
              <strong>Important:</strong> Always consult a qualified physician for clinical evaluation and diagnosis.
            </div>
          )}
        </div>

        {!isResultScreen && (
          <button
            type="button"
            className="disclaimer-dismiss-btn"
            onClick={() => setDismissedOnHome(true)}
            aria-label="Dismiss medical disclaimer banner"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        )}
      </div>
    </aside>
  );
}

