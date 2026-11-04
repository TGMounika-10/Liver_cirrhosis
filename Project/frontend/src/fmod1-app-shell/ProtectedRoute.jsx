import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../fmod6-auth/useAuth";

/**
 * Route wrapper that enforces authentication.
 * If user is not logged in, redirects to /login preserving target location in state.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * Route wrapper for public auth pages (login/signup).
 * If user is already authenticated, redirects to /upload or requested page.
 */
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const destination = location.state?.from?.pathname || "/upload";

  if (isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  return children;
}

export default ProtectedRoute;

