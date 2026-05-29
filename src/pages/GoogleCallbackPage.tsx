import { useEffect } from "react";

export default function GoogleCallbackPage() {
  useEffect(() => {
    try {
      // Google ID token is returned in the hash fragment for implicit grant (e.g., #id_token=...&token_type=Bearer)
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", "?"));
      const idToken = params.get("id_token");
      const error = params.get("error");

      if (idToken) {
        if (window.opener) {
          window.opener.postMessage({ type: "GOOGLE_AUTH_SUCCESS", idToken }, "*");
          window.close();
        } else {
          // Fallback if not opened in a popup
          localStorage.setItem("google_pending_token", idToken);
          window.location.href = "/login";
        }
      } else if (error) {
        if (window.opener) {
          window.opener.postMessage({ type: "GOOGLE_AUTH_FAILURE", error }, "*");
          window.close();
        } else {
          window.location.href = "/login?error=" + encodeURIComponent(error);
        }
      } else {
        // Also handle query parameters fallback (for general code flow if ever used)
        const queryParams = new URLSearchParams(window.location.search);
        const qError = queryParams.get("error");
        if (qError) {
          if (window.opener) {
            window.opener.postMessage({ type: "GOOGLE_AUTH_FAILURE", error: qError }, "*");
            window.close();
          } else {
            window.location.href = "/login?error=" + encodeURIComponent(qError);
          }
        } else {
          // If no parameters found, wait briefly and auto-close
          const timeout = setTimeout(() => {
            window.close();
          }, 3000);
          return () => clearTimeout(timeout);
        }
      }
    } catch (err) {
      console.error("Error inside Google callback page:", err);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6 font-sans">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl max-w-sm w-full text-center space-y-4">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h2 className="text-base font-bold text-gray-900">Xác thực Google...</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Đang xác thực bảo mật tài khoản với hệ thống Google. Trình duyệt sẽ tự động quay lại trang chủ.
        </p>
      </div>
    </div>
  );
}
