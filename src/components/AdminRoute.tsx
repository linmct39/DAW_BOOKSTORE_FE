import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="text-xs text-gray-500 font-semibold font-sans">Đang xác nhận quyền quản trị viên...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    // Redirect to home if they are not admin
    alert("Cảnh báo: Bạn không có thẩm quyền truy cập công cụ này!");
    return <Navigate to="/" replace />;
  }

  return children;
}
