import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/authApi";
import { User, Phone, MapPin, Key, Mail, Sparkles, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg("Họ tên không được phép để trống!");
      return;
    }

    try {
      setSubmitting(true);
      
      // Build FormData according to API spec: username, email, full_name, phone, address, avatar (file)
      const fd = new FormData();
      fd.append("username", user.email.split("@")[0]);
      fd.append("email", user.email);
      fd.append("full_name", fullName);
      fd.append("phone", phone);
      fd.append("address", address);
      if (avatarFile) fd.append("avatar", avatarFile);

      await authApi.updateProfile(user.id, fd);

      // If they also want to change password (Row 7 endpoint)
      if (password) {
        // According to Row 7, we need { oldPassword, newPassword }
        // Let's ask for the current password, or if they don't have it, assume default "123456789"
        const oldPwd = prompt("Vui lòng nhập mật khẩu cũ để xác thực thay đổi mật khẩu:") || "123456789";
        await authApi.changePassword(user.id, {
          oldPassword: oldPwd,
          newPassword: password
        });
      }

      await refreshProfile(); // Refresh context user state
      setSuccessMsg("Cập nhật thông tin hồ sơ tài khoản thành công!");
      setPassword(""); // clear password field
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.toString() || "Cập nhật hồ sơ thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-8 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-amber-800 font-semibold mb-2">Bạn cần phải đăng nhập để xem thông tin trang này!</p>
        <button onClick={() => navigate("/login")} className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg font-bold">
          Đi đến Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8" id="profile-page">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left column info overview card */}
        <div className="md:col-span-4 bg-gradient-to-b from-indigo-600 to-indigo-800 p-8 text-white flex flex-col justify-between items-center text-center">
          <div className="space-y-4 py-6 w-full">
            <div className="bg-white/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto border border-white/20">
              <User className="h-10 w-10 text-indigo-200" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">{user.fullName}</h2>
              <span className="inline-block mt-1 bg-amber-400 text-gray-900 font-extrabold text-[9px] uppercase px-3 py-0.5 rounded-full tracking-wider">
                {user.role === "admin" ? "Ban Quản Trị" : "Khách Hàng Thân Thiết"}
              </span>
            </div>
          </div>

          <div className="space-y-2 w-full pt-8 border-t border-white/10">
            <div className="flex items-center text-xs space-x-2 text-indigo-200 justify-center">
              <Mail className="h-3.5 w-3.5" />
              <span className="font-mono">{user.email}</span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="mt-4 w-full bg-red-600/30 hover:bg-red-600/40 border border-red-500/20 text-red-200 font-semibold py-2 rounded-lg text-xs transition cursor-pointer"
            >
              Đăng Xuất Tài Khoản
            </button>
          </div>
        </div>

        {/* Right column Form values */}
        <form onSubmit={handleUpdate} className="md:col-span-8 p-8 space-y-6">
          <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 text-base">Cập Nhật Hồ Sơ</h3>
              <p className="text-xs text-gray-500 font-medium">Thay đổi thông tin liên hệ và mật khẩu bảo mật của bạn</p>
            </div>
            <Sparkles className="h-5 w-5 text-indigo-500" />
          </div>

          {successMsg && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-xs flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Địa chỉ Email (Không được đổi)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-gray-100 border border-gray-250 text-gray-500 rounded-lg px-3 py-2 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Họ và Tên</label>
              <input
                type="text"
                placeholder="Họ tên đầy đủ"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 rounded-lg px-3 py-2 text-xs font-medium text-gray-900 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Ảnh đại diện (jpg, jpeg, png)</label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Số điện thoại liên hệ</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="09xx xxx xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-gray-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Mật khẩu mới (Bỏ trống nếu không đổi)</label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-gray-900 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Địa chỉ giao hàng mặc định</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Số nhà, Tên đường, Quận, Thành phố..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-gray-900 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg text-xs transition cursor-pointer flex items-center justify-center space-x-2 disabled:bg-indigo-400"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang xử lý lưu...</span>
              </>
            ) : (
              <span>Lưu Cập Nhật</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
