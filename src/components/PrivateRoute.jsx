import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ role }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return null;

  // chưa login
  if (!isAuthenticated) {
    return <Navigate to="/cart" replace />;
  }

  // không đúng role
  if (role && user?.role !== role) {
    return <Navigate to="/cart" replace />;
  }
  return <Outlet />;
}