import Header from "./Header";
import Footer from "./Footer";
import DisclaimerBanner from "./DisclaimerBanner";
import AppRoutes from "./routes";
import "./theme.css";

export default function App() {
  return (
    <div className="app-container">
      {/* Keyboard Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Global Header */}
      <Header />

      {/* Medical Disclaimer Banner (always visible on result screens, dismissible on home) */}
      <DisclaimerBanner />

      {/* Main Content Area */}
      <main id="main-content" className="app-main" tabIndex="-1">
        <AppRoutes />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

