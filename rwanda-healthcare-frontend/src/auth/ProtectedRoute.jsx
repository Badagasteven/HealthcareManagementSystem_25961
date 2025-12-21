import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthed, role } = useAuth();
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/app/unauthorized" replace />;
  }

  // Supports both wrapper style and layout-route style (Outlet)
  return children ? children : <Outlet />;
}
