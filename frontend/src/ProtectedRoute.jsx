import { Navigate } from "react-router-dom";

// Wraps a route: if there's no token, bounce to /login.
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
