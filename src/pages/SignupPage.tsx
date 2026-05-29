import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/authApi";
import { User, Mail, Lock, UserPlus, AlertCircle, Loader2, CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Success flow state
  const [successData, setSuccessData] = useState<{ id: string | number; email: string; username: string; message: string } | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState<boolean | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validations
    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError("Vui lòng điền đầy đủ Họ tên, Tên đăng nhập, Email và Mật khẩu!");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu bảo mật phải tối thiểu từ 6 ký tự trở lên!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Xác nhận mật khẩu mới của bạn chưa khớp nhau!");
      return;
    }

    try {
      setSubmitting(true);
      const response = await register({
        username: username.trim(),
        password,
        email: email.trim(),
        fullName: fullName.trim()
      });

      // Based on API: data has id, username, email
      const registeredUser = response?.data || response?.user || {};
      setSuccessData({
        id: registeredUser.id || "22", // default mock if empty
        email: registeredUser.email || email,
        username: registeredUser.username || username,
        message: response?.message || "Đăng kỳ thành công! Vui lòng kiểm tra email để kích hoạt tài khoản."
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.toString() || "Đăng ký thất bại. Email hoặc tên tài khoản có thể đã tồn tại!");
    } finally {
      setSubmitting(false);
    }
  };

  // If successfully registered, show success status screen instructing user to check their email
  if (successData) {
    return (
      <div className="max-w-md mx-auto mt-12 px-4 shadow-sm animate-fade-in" id="signup-success">
        <div className="bg-white rounded-2xl border border-indigo-50 shadow-xl p-8 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-indigo-600 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Đăng Ký Thành Công!</h2>
            <p className="text-sm font-semibold text-gray-800 font-sans">
              Tài khoản của bạn đã được khởi tạo!
            </p>
          </div>

          {/* Verification Notification Box */}
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-left space-y-3">
            <div className="flex items-start space-x-2.5">
              <Mail className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-900">Yêu cầu xác thực tài khoản qua email:</p>
                <p className="text-[11px] text-amber-800 leading-relaxed font-semibold">
                  Vui lòng quay lại hòm thư email cá nhân <span className="underline">{successData.email}</span> của bạn và tìm thư xác thực để nhấn nút <span className="underline font-bold text-amber-900">Xác thực tài khoản</span>.
                </p>
              </div>
            </div>
            <p className="text-[10px] text-amber-600 leading-relaxed bg-white p-2.5 rounded border border-amber-100 font-sans">
              * Sau khi nhấn liên kết xác thực trong email từ hòm thư của bạn, tài khoản sẽ được chuyển sang trạng thái hoạt động và sẵn sàng đăng nhập.
            </p>
          </div>

          {/* Account Info Panel */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-left space-y-2.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thông tin tài khoản đăng ký:</p>
            <div className="text-xs space-y-1 text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Mã người dùng (ID):</span>
                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">#{successData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Tên đăng nhập:</span>
                <span className="font-bold">{successData.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Địa chỉ Email:</span>
                <span className="font-medium text-gray-800">{successData.email}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <span>Đi Đến Đăng Nhập Sau Khi Xác Thực</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <button 
              onClick={() => setSuccessData(null)}
              className="block w-full text-center text-[11px] text-gray-400 hover:text-indigo-600 underline cursor-pointer"
            >
              Quay lại trang Đăng ký tài khoản khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 px-4 animate-fade-in" id="signup-container">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Đăng Ký Thành Viên</h2>
          <p className="text-xs text-gray-500 font-medium font-sans">Kiến tạo tài khoản mới phù hợp với thông số API</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">Họ và Tên</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={fullName}
                required
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-hidden font-medium text-gray-900 shadow-internal"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">Tên đăng nhập (Username)</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="nhap_ten_dang_nhap_viet_lien"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-hidden font-medium text-gray-900 shadow-internal"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                placeholder="ten-ban@gmail.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-hidden font-medium text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 block">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-hidden font-medium text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 block">Xác nhận</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-hidden font-medium text-gray-900"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-xs transition flex items-center justify-center space-x-2 border border-transparent shadow-xs cursor-pointer disabled:bg-indigo-400"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang xử lý đăng ký API...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Đăng Ký Tài Khoản</span>
              </>
            )}
          </button>
        </form>

        <div className="border-t border-gray-100 pt-4 text-center">
          <p className="text-xs text-gray-500">
            Đã có tài khoản DAW BOOKSTORE?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline font-semibold font-sans">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
