import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--blue)" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z" />
              </svg>
              <span className="footer-title">Liver Cirrhosis Risk Prediction System</span>
            </div>
            <p className="footer-disclaimer">
              Educational screening aid only. This system estimates statistical risk indicators and does not constitute a medical diagnosis. Always consult a qualified physician for clinical advice and diagnosis.
            </p>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Awareness & Home</Link>
              </li>
              <li>
                <Link to="/upload">Upload Lab Report</Link>
              </li>
              <li>
                <Link to="/manual">Manual Lab Entry</Link>
              </li>
              <li>
                <Link to="/about-model">About Model & Limitations</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {currentYear} Educational Liver Risk Predictor. All rights reserved.
          </p>
          <p className="footer-note">
            Privacy First: Uploaded files are processed in memory and never persisted to browser storage.
          </p>
        </div>
      </div>
    </footer>
  );
}

