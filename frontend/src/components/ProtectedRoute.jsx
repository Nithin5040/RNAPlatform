import { Navigate } from "react-router-dom";

// Helper functions to check authentication status
const isAuthenticated = () => {
  const token = sessionStorage.getItem("auth_token");
  return !!token;
};

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const roleId = parseInt(sessionStorage.getItem("roleId"), 10);

  console.log("ProtectedRoute - Checking access:", {
    allowedRoles,
    isAuthenticated: isAuthenticated(),
    roleId
  });

  // 🔒 Not logged in
  if (!isAuthenticated()) {
    console.log("ProtectedRoute - Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // 🔐 Role-based access
  if (allowedRoles.length > 0) {
    // Check if user's roleId is in allowedRoles
    if (!allowedRoles.includes(roleId)) {
      console.log("ProtectedRoute - Role not allowed:", { roleId, allowedRoles });

      // Redirect based on role
      if (roleId === 1) {
        return <Navigate to="/admin_dashboard" replace />;
      } else if (roleId === 4) {
        return <Navigate to="/reporting_manager_dashboard" replace />;
      } else {
        // All other non-admin roles go to home page
        return <Navigate to="/" replace />;
      }
    }
  }

  console.log("ProtectedRoute - Access granted");
  return children;
}
