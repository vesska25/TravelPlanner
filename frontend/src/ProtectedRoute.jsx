import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    // no token → redirect to login instead of rendering the page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // token present → render whatever this wraps
    return children;
}

export default ProtectedRoute;