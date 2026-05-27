import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ role }) {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const isAuthenticated = Boolean(localStorage.getItem("access_token") || localStorage.getItem("user"));

  // chưa login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // không đúng role
  if (role && user?.role !== role) {
    return <Navigate to="/profile" replace />;
  }
  return <Outlet />;
}