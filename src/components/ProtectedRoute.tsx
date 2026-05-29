import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="text-xs text-gray-500 font-medium">Đang xác thực thông tin tài khoản...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page but remember where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
