import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authApi } from "../services/authApi";
import { ShieldCheck, ShieldAlert, Loader2, ArrowRight, BookOpen } from "lucide-react";

export default function VerifyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setSuccess(false);
      setMessage("Không tìm thấy mã người dùng hợp lệ.");
      return;
    }

    const triggerVerification = async () => {
      try {
        setLoading(true);
        const res = await authApi.verifyAccount(id);
        // BE response for success: {"success": true, "message": "Xác thực thành công! Bạn hiện đã có thể đăng nhập."}
        setSuccess(true);
        setMessage(res.message || "Xác thực thành công! Tài khoản của bạn đã được kích hoạt và có thể đăng nhập.");
      } catch (err: any) {
        console.error(err);
        // Account might have already been verified 
        // e.g., "Liên kết không hợp lệ, đã hết hạn hoặc tài khoản đã được kích hoạt trước đó."
        setSuccess(false);
        setMessage(
          err?.response?.data?.message || 
          err?.message || 
          "Xác thực không thành công. Liên kết không hợp lệ, đã hết hạn hoặc tài khoản đã được kích hoạt từ trước."
        );
      } finally {
        setLoading(false);
      }
    };

    triggerVerification();
  }, [id]);

  return (
    <div className="max-w-md mx-auto mt-16 px-4 animate-fade-in" id="verify-page-container">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex items-center gap-1">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span className="font-extrabold text-gray-900 text-sm tracking-wider font-sans">DAW BOOKSTORE</span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 py-6">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-800">Đang kích hoạt tài khoản...</h3>
              <p className="text-xs text-gray-400 font-medium">Hệ thống đang gọi API xác thực cho người dùng #{id}</p>
            </div>
          </div>
        ) : success ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
                <ShieldCheck className="h-10 w-10 text-green-500 animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Kích Hoạt Thành Công!</h2>
              <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg p-2.5 font-semibold font-sans">
                {message}
              </p>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Tài khoản của bạn đã chuyển sang trạng thái hoạt động <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px] text-indigo-600 font-bold">is_active = true</code>. Bạn hiện đã sở hữu toàn bộ quyền mua sắm giáo trình & tài liệu học thuật.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <span>Đăng Nhập Ngay</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center border border-red-200">
                <ShieldAlert className="h-10 w-10 text-red-500 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Xác Thực Kết Thúc</h2>
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-2.5 font-semibold font-sans">
                {message}
              </p>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Trường hợp này xảy ra nếu bạn vừa nhấn kích hoạt trực tiếp từ link email hoặc tài khoản đã kích hoạt thành công trước đó. Vui lòng bấm vào đăng nhập thử nghiệm.
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gray-950 hover:bg-gray-900 text-white font-bold py-3 rounded-lg text-xs transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Thành viên: Đi đến Đăng Nhập</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <Link to="/signup" className="block text-xs text-indigo-600 hover:underline font-semibold font-sans">
                Trở lại tạo tài khoản khách hàng mới
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
