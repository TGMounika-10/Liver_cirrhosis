import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../fmod6-auth/useAuth";
import "./Header.css";

export default function Header() {
  const { isAuthenticated, patientId, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand / Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu} aria-label="Liver Cirrhosis Risk Prediction Home">
          <svg className="brand-icon" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="var(--blue)" />
            <path
              d="M8 17C8 10 18 6 24 8c4 2 3 8 0 12-2 3-8 5-12 4-3 0-4-2-4-7Z"
              fill="#FFFFFF"
            />
            <path
              d="M17 19c1 3 4 3 6 1"
              stroke="#A5D6A7"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <div className="brand-text">
            <span className="brand-title">LiverRisk</span>
            <span className="brand-badge">Screening</span>
          </div>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="mobile-nav-toggle"
          aria-expanded={mobileMenuOpen}
          aria-controls="primary-navigation"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`hamburger-bar ${mobileMenuOpen ? "open" : ""}`}></span>
        </button>

        {/* Navigation & Auth Section */}
        <nav
          id="primary-navigation"
          className={`nav-wrapper ${mobileMenuOpen ? "is-open" : ""}`}
          aria-label="Main Navigation"
        >
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={closeMenu}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/upload"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={closeMenu}
              >
                Upload Report
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/manual"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={closeMenu}
              >
                Manual Entry
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about-model"
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={closeMenu}
              >
                About Model
              </NavLink>
            </li>
          </ul>

          <div className="nav-auth">
            {isAuthenticated ? (
              <div className="auth-profile">
                <div className="patient-pill" title={`Logged in as ${patientId}`}>
                  <svg className="patient-icon" viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="patient-id">{patientId}</span>
                </div>
                <button
                  type="button"
                  className="btn sm btn-logout"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn sm" onClick={closeMenu}>
                  Log in
                </Link>
                <Link to="/signup" className="btn sm primary" onClick={closeMenu}>
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

