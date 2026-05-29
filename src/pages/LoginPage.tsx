import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to the page they were trying to access, or homepage
  const from = (location.state as any)?.from?.pathname || "/";

  // Google OAuth Credentials Config State
  const [googleClientId, setGoogleClientId] = useState(() => {
    return localStorage.getItem("google_client_id") || "1042797769997-p6icpsuonr6v2sc9bgnm30bof8h62clv.apps.googleusercontent.com";
  });
  const [showConfig, setShowConfig] = useState(false);

  // Use postMessage listener to capture Google Callback credentials
  React.useEffect(() => {
    const handleGoogleMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith(".run.app") && !origin.includes("localhost")) {
        return;
      }

      if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
        const idToken = event.data.idToken;
        setError(null);
        setSubmitting(true);
        try {
          const user = await loginWithGoogle(idToken);
          // Auto-redirect
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate(from, { replace: true });
          }
        } catch (err: any) {
          console.error(err);
          setError(err?.toString() || "Đăng nhập Google thất bại tại máy chủ backend. Vui lòng kiểm tra lại cấu hình Client ID.");
        } finally {
          setSubmitting(false);
        }
      } else if (event.data?.type === "GOOGLE_AUTH_FAILURE") {
        setError("Đăng nhập bằng Google đã bị hủy hoặc gặp lỗi: " + (event.data.error || ""));
      }
    };

    window.addEventListener("message", handleGoogleMessage);
    return () => window.removeEventListener("message", handleGoogleMessage);
  }, [loginWithGoogle, navigate, from]);

  const handleGoogleLogin = () => {
    setError(null);
    try {
      if (!googleClientId || !googleClientId.trim()) {
        setError("Vui lòng điền Google Client ID trong mục Cấu hình phía dưới!");
        return;
      }

      localStorage.setItem("google_client_id", googleClientId.trim());

      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const scope = "openid email profile";
      const nonce = Math.random().toString(36).substring(2);

      const params = new URLSearchParams({
        client_id: googleClientId.trim(),
        redirect_uri: redirectUri,
        response_type: "id_token",
        scope: scope,
        nonce: nonce,
        prompt: "select_account"
      });

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

      const popupWidth = 500;
      const popupHeight = 600;
      const left = window.screenX + (window.outerWidth - popupWidth) /  2;
      const top = window.screenY + (window.outerHeight - popupHeight) / 2;

      const authWindow = window.open(
        googleAuthUrl,
        "google_oauth_popup",
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,status=yes`
      );

      if (!authWindow) {
        setError("Popup bị chặn bởi trình duyệt! Vui lòng cho phép popup để liên kết với Google.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Không thể chuẩn bị Google OAuth: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validations
    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin tài khoản!");
      return;
    }

    try {
      setSubmitting(true);
      const user = await login({ email: email.trim(), password });
      
      // Redirect depending on user role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.toString() || "Đăng nhập thất bại. Vui lòng kiểm tra lại trạng thái kích hoạt tài khoản của bạn!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4 animate-fade-in" id="login-container">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Đăng Nhập</h2>
          <p className="text-xs text-gray-500 font-medium">Đăng nhập tài khoản của bạn để tiếp tục mua sách</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-red-700 text-[11px] font-semibold leading-relaxed flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="email"
                placeholder="ten-ban@gmail.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 rounded-lg pl-9 pr-4 py-3 text-xs focus:outline-hidden font-medium text-gray-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-semibold text-gray-700 block">Mật khẩu bảo mật</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 rounded-lg pl-9 pr-4 py-3 text-xs focus:outline-hidden font-medium text-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-xs transition flex items-center justify-center space-x-2 border border-transparent shadow-xs cursor-pointer disabled:bg-indigo-400"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang xử lý kết nối...</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Đăng Nhập Hệ Thống</span>
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-1.5 items-center">
          <div className="flex-grow border-t border-gray-150"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-extrabold uppercase tracking-widest">Hoặc chọn</span>
          <div className="flex-grow border-t border-gray-150"></div>
        </div>

        <div className="space-y-3">
          {/* Real Google Sign-In Connector */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-300 shadow-xs hover:shadow-xs py-3 px-4 rounded-xl text-xs font-bold text-gray-700 transition duration-200 cursor-pointer disabled:opacity-50"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" className="w-5 h-5 shrink-0" />
            <span>Đăng nhập qua tài khoản Google</span>
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="text-[10px] text-gray-400 hover:text-indigo-600 font-semibold underline transition duration-150 cursor-pointer focus:outline-hidden"
            >
              {showConfig ? "Ẩn hướng dẫn liên kết API" : "⚙️ Xem thông tin tích hợp Google OAuth 2.0"}
            </button>
          </div>
        </div>

        {showConfig && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 text-xs text-gray-600 animate-slide-down">
            <h4 className="font-bold text-gray-800 text-xs">Cấu hình Google Credentials</h4>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Google Client ID:</label>
              <input
                type="text"
                placeholder="Google Client ID (.apps.googleusercontent.com)"
                value={googleClientId}
                onChange={(e) => {
                  setGoogleClientId(e.target.value);
                  localStorage.setItem("google_client_id", e.target.value.trim());
                }}
                className="w-full bg-white border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2 text-xs font-mono"
              />
            </div>
            
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Authorized JavaScript Origins:</span>
              <div className="bg-gray-100 p-2 rounded-lg font-mono text-[9px] select-all break-all border border-gray-200">
                {window.location.origin}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Authorized Redirect URIs:</span>
              <div className="bg-gray-100 p-2 rounded-lg font-mono text-[9px] select-all break-all border border-gray-200">
                {window.location.origin}/auth/google/callback
              </div>
            </div>

            <p className="text-[10px] text-gray-400 leading-tight">
              Để thử nghiệm đăng nhập Google thật, quý khách vui lòng thêm các URL nguồn chính xác trên vào Google Cloud Console.
            </p>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 text-center">
          <p className="text-xs text-gray-500">
            Chưa có tài khoản thành viên?{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline font-semibold">
              Đăng ký tài khoản mới
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
