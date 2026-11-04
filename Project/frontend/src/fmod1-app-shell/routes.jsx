import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "./ProtectedRoute";

// Page Components
import HomePage from "../fmod7-home-awareness/HomePage";
import LoginPage from "../fmod6-auth/LoginPage";
import SignupPage from "../fmod6-auth/SignupPage";
import UploadPage from "../fmod2-upload-report/UploadPage";
import ManualEntryPage from "../fmod3-manual-entry/ManualEntryPage";
import ResultPage from "../fmod4-result-dashboard/ResultPage";
import AboutModelPage from "../fmod5-model-info/AboutModelPage";

/**
 * Primary routing configuration adhering strictly to f1.md specification:
 * - Public routes: /, /about-model
 * - Public auth routes (redirect to /upload if logged in): /login, /signup
 * - Protected routes (require patient authentication): /upload, /manual, /result
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about-model" element={<AboutModelPage />} />

      {/* Auth Pages (Public, but redirects to /upload if already authenticated) */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />

      {/* Protected Routes (Require patient login, redirects to /login) */}
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manual"
        element={
          <ProtectedRoute>
            <ManualEntryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/result"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

