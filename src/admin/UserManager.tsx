import React, { useEffect, useState } from "react";
import { userApi } from "../services/userApi";
import { authApiInstance } from "../services/api"; // Import instance để tự liên kết URL chuẩn
import { Plus, Trash2, Pencil, X, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"; 

/* ================= TYPES ================= */
interface User {
  id?: number;
  _id?: string;
  username?: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
}

/* ================= COMPONENT CON ================= */
const Field = ({ label, error, children }: any) => (
  <div>
    <div className="text-sm font-medium mb-1">{label}</div>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

/* ================= MAIN COMPONENT ================= */
export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= CUSTOM NOTIFICATION SYSTEM ================= */
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    message: string;
  }>({ isOpen: false, type: "success", message: "" });

  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ isOpen: true, type, message });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isOpen: false }));
    }, 4000);
  };

  /* ================= ADD ================= */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const [username, setUsername] = useState(""); 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const [errors, setErrors] = useState<any>({});

  /* ================= EDIT ================= */
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const [editId, setEditId] = useState<number | string | null>(null);
  const [editUsername, setEditUsername] = useState(""); 
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPassword, setEditPassword] = useState(""); 
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editErrors, setEditErrors] = useState<any>({});

  /* ================= DELETE ================= */
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [deleting, setDeleting] = useState(false);

  /* ================= FETCH ================= */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userApi.getUsers();
      setUsers(data ?? []);
    } catch (err) {
      console.error("Lỗi lấy danh sách:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= CLOSE MODALS ================= */
  const closeAdd = () => {
    setIsAddOpen(false);
    setUsername("");
    setFullName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setPassword("");
    setShowPassword(false);
    setErrors({});
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditId(null);
    setEditUsername("");
    setEditName("");
    setEditEmail("");
    setEditPhone("");
    setEditAddress("");
    setEditPassword(""); 
    setShowEditPassword(false);
    setEditErrors({});
  };

  const closeDelete = () => {
    setIsDeleteOpen(false);
    setDeleteId(null);
    setDeleteName("");
  };

  /* ================= VALIDATION ================= */
  const validateAdd = () => {
    const e: any = {};
    if (!username.trim()) e.username = "Vui lòng nhập tên đăng nhập (Username)";
    if (!fullName.trim()) e.fullName = "Vui lòng nhập họ tên";
    
    if (!email.trim()) {
      e.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Email không hợp lệ";
    }
    
    if (!password.trim()) {
      e.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 5) {
      e.password = "Mật khẩu phải có ít nhất 5 ký tự";
    } else if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password)) {
      e.password = "Mật khẩu bắt buộc phải chứa ít nhất 1 ký tự đặc biệt (ví dụ: @, !, #...)";
    }

    if (phone.trim() && !/^[0-9]{10,11}$/.test(phone)) {
      e.phone = "SĐT phải gồm 10-11 chữ số";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateEdit = () => {
    const e: any = {};
    if (!editName.trim()) e.editName = "Vui lòng nhập tên";
    
    if (editPhone.trim() && !/^[0-9]{10,11}$/.test(editPhone)) {
      e.editPhone = "SĐT phải gồm 10-11 chữ số";
    }
    
    if (editPassword.trim()) {
      if (editPassword.length < 5) {
        e.editPassword = "Mật khẩu mới phải có ít nhất 5 ký tự";
      } else if (!/[!@#$%^&*(),.?":{}|<>_]/.test(editPassword)) {
        e.editPassword = "Mật khẩu mới phải chứa ít nhất 1 ký tự đặc biệt (ví dụ: @, !, #...)";
      }
    }
    
    setEditErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= ADD HANDLER ================= */
  const handleAdd = async () => {
    if (!validateAdd()) return;

    setAdding(true);
    try {
      const payloadAdd = {
        username: username.trim(), 
        email: email.trim(),
        password: password,
        full_name: fullName.trim(), 
        phone: phone.trim() || null,      
        address: address.trim() || null    
      };

      await userApi.createUser(payloadAdd);
      await fetchUsers();
      closeAdd();
      showToast("success", "Thêm người dùng mới thành công!");
    } catch (err: any) {
      console.error(err);
      let serverMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Lỗi hệ thống";
      showToast("error", serverMessage);
    } finally {
      setAdding(false);
    }
  };

  /* ================= EDIT HANDLER ================= */
  const openEdit = (u: User) => {
    const targetId = u.id || u._id || (u as any).userId || (u as any).user_id;
    if (!targetId) {
      showToast("error", "Không thể xác định ID người dùng!");
      return;
    }
    setEditId(targetId);
    setEditUsername(u.username || "");
    setEditName(u.full_name);
    setEditEmail(u.email);
    setEditPhone(u.phone || "");
    setEditAddress(u.address || "");
    setIsEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editId || !validateEdit()) return;

    setEditing(true);
    try {
      const payload: any = {
        full_name: editName.trim(),
        phone: editPhone.trim() || null,
        address: editAddress.trim() || null,
      };
      
      if (editPassword.trim()) {
        payload.password = editPassword;
      }

      await userApi.updateUser(editId, payload);
      await fetchUsers();
      closeEdit();
      showToast("success", "Cập nhật hồ sơ thành công!");
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message;
      showToast("error", msg);
    } finally {
      setEditing(false);
    }
  };

  /* ================= DELETE HANDLER ================= */
  const openDelete = (u: User) => {
    const targetId = u.id || u._id || (u as any).userId || (u as any).user_id; 
    
    if (!targetId) {
      showToast("error", "Không tìm thấy mã định danh (ID) của người dùng này!");
      return;
    }

    setDeleteId(targetId);
    setDeleteName(u.full_name);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      const cleanId = Number(deleteId) || deleteId;
      let success = false;

      try {
        await userApi.deleteUser(cleanId);
        success = true;
      } catch (firstError) {
        console.warn("Hàm gốc của file userApi lỗi 404/400. Bắt đầu tự động dò tìm Endpoint...");
      }

      if (!success) {
        try {
          await authApiInstance.delete(`users/${cleanId}`);
          success = true;
          console.log("-> Thành công với Endpoint Dự phòng A (Chuẩn RESTful)");
        } catch (errA) {
        }
      }

      if (!success) {
        try {
          await authApiInstance.post(`users/delete`, { user_id: cleanId });
          success = true;
          console.log("-> Thành công với Endpoint Dự phòng B (Hành động qua POST Body)");
        } catch (errB) {
        }
      }

      if (!success) {
        try {
          await authApiInstance.request({
            method: 'DELETE',
            url: `users`,
            data: { user_id: cleanId }
          });
          success = true;
          console.log("-> Thành công với Endpoint Dự phòng C (DELETE body)");
        } catch (errC) {
          throw errC; 
        }
      }
      setUsers((prevUsers) => 
        prevUsers.filter((u) => u.id !== deleteId && u._id !== deleteId && (u as any).userId !== deleteId)
      );
      
      closeDelete();
      showToast("success", "Đã xóa tài khoản thành công!");
    } catch (err: any) {
      console.error("Tất cả phương án kết nối đều thất bại:", err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Xóa thất bại";
      showToast("error", msg);
    } finally {
      setDeleting(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-4 max-w-5xl mx-auto relative">
      
      {notification.isOpen && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000]">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border min-w-[320px] max-w-md ${
            notification.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
            {notification.type === "success" ? (
              <CheckCircle2 className="text-emerald-600 shrink-0" size={22} />
            ) : (
              <AlertCircle className="text-rose-600 shrink-0" size={22} />
            )}
            <div className="text-sm font-medium flex-1 pr-2 break-words">
              {notification.message}
            </div>
            <button 
              onClick={() => setNotification(prev => ({ ...prev, isOpen: false }))}
              className="text-gray-400 hover:text-black transition shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-gray-800 active:scale-98 transition cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Thêm user
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-center text-gray-500 py-4">Đang tải...</p>
      ) : (
        <div className="space-y-4">
          {users.map((u) => {
            const currentId = u.id || u._id || (u as any).userId || (u as any).user_id;
            return (
              <div
                key={currentId || Math.random().toString()}
                className="border rounded-3xl p-5 flex justify-between items-center bg-white shadow-sm"
              >
                <div>
                  <div className="font-bold text-lg">{u.full_name}</div>
                  <div className="text-gray-500 text-sm">@{u.username || "Chưa có username"}</div>
                  <div className="text-gray-400 text-sm mt-1">{u.email}</div>
                  <div className="text-gray-400 text-xs">{u.phone || "Chưa cập nhật SĐT"}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(u)}
                    className="p-3 bg-blue-100 rounded-xl hover:bg-blue-200 text-blue-700 transition"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => openDelete(u)}
                    className="p-3 bg-red-100 rounded-xl hover:bg-red-200 text-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= ADD MODAL ================= */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl relative">
            <div className="p-6 border-b flex justify-between items-center">
              <b className="text-lg">Thêm người dùng mới</b>
              <button onClick={closeAdd} className="text-gray-500 hover:text-black">
                <X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Field label="Tên đăng nhập (Username) *" error={errors.username}>
                <input
                  placeholder="Ví dụ: khangtran123"
                  className="w-full border p-3 rounded-xl outline-none focus:border-black"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value.replace(/\s/g, "")); 
                    setErrors({ ...errors, username: "" });
                  }}
                />
              </Field>

              <Field label="Họ tên *" error={errors.fullName}>
                <input
                  placeholder="Nhập họ tên người dùng"
                  className="w-full border p-3 rounded-xl outline-none focus:border-black"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setErrors({ ...errors, fullName: "" });
                  }}
                />
              </Field>

              <Field label="Email *" error={errors.email}>
                <input
                  placeholder="example@gmail.com"
                  className="w-full border p-3 rounded-xl outline-none focus:border-black"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "" });
                  }}
                />
              </Field>

              <Field label="Mật khẩu ban đầu *" error={errors.password}>
                <div className="relative">
                  <input
                    placeholder="Tối thiểu 5 ký tự & có ký tự đặc biệt"
                    type={showPassword ? "text" : "password"}
                    className="w-full border p-3 rounded-xl outline-none focus:border-black pr-10"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: "" });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </Field>

              <Field label="Số điện thoại (Tùy chọn)" error={errors.phone}>
                <input
                  placeholder="Bỏ trống nếu không muốn nhập"
                  className="w-full border p-3 rounded-xl outline-none focus:border-black"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ""));
                    setErrors({ ...errors, phone: "" });
                  }}
                />
              </Field>

              <Field label="Địa chỉ (Tùy chọn)">
                <input
                  placeholder="Bỏ trống nếu không muốn nhập"
                  className="w-full border p-3 rounded-xl outline-none focus:border-black"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Field>
            </div>

            <div className="p-4 border-t">
              <button
                onClick={handleAdd}
                disabled={adding}
                className="w-full bg-black text-white py-3 rounded-xl font-medium disabled:bg-gray-400 transition"
              >
                {adding ? "Đang tạo tài khoản..." : "Thêm user"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl relative">
            <div className="p-6 border-b flex justify-between items-center">
              <b className="text-lg">Sửa thông tin user</b>
              <button onClick={closeEdit} className="text-gray-500 hover:text-black">
                <X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Field label="Tên đăng nhập (Username)">
                <input
                  disabled
                  className="w-full border p-3 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                  value={editUsername}
                />
              </Field>

              <Field label="Họ tên *" error={editErrors.editName}>
                <input
                  className="w-full border p-3 rounded-xl outline-none focus:border-green-600"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </Field>

              <Field label="Email *">
                <input
                  disabled
                  className="w-full border p-3 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                  value={editEmail}
                />
              </Field>

              <Field label="Số điện thoại (Tùy chọn)" error={editErrors.editPhone}>
                <input
                  className="w-full border p-3 rounded-xl outline-none focus:border-green-600"
                  value={editPhone}
                  onChange={(e) => {
                    setEditPhone(e.target.value.replace(/\D/g, ""));
                    setEditErrors({ ...editErrors, editPhone: "" });
                  }}
                />
              </Field>

              <Field label="Địa chỉ (Tùy chọn)">
                <input
                  className="w-full border p-3 rounded-xl outline-none focus:border-green-600"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                />
              </Field>

              <Field label="Mật khẩu mới (Bỏ trống nếu giữ nguyên)" error={editErrors.editPassword}>
                <div className="relative">
                  <input
                    type={showEditPassword ? "text" : "password"}
                    placeholder="Tối thiểu 5 ký tự và có ký tự đặc biệt"
                    className="w-full border border-orange-300 p-3 rounded-xl outline-none focus:border-orange-500 bg-orange-50/30"
                    value={editPassword}
                    onChange={(e) => {
                      setEditPassword(e.target.value);
                      setEditErrors({ ...editErrors, editPassword: "" });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showEditPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </Field>
            </div>

            <div className="p-4 border-t">
              <button
                onClick={handleEdit}
                disabled={editing}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-medium disabled:bg-gray-400 transition"
              >
                {editing ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 text-center border-b">
              <Trash2 className="mx-auto text-red-600 mb-2" size={28} />
              <b className="text-lg">Xóa tài khoản</b>
            </div>

            <div className="p-6 text-center">
              <p className="text-gray-500">Hành động này không thể hoàn tác. Xóa user:</p>
              <p className="font-bold text-gray-800 mt-1">{deleteName}</p>
            </div>

            <div className="p-4 flex gap-3 bg-gray-50">
              <button onClick={closeDelete} className="flex-1 border rounded-xl py-2.5 bg-white font-medium hover:bg-gray-100">
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white rounded-xl py-2.5 font-medium disabled:bg-gray-400 hover:bg-red-700"
              >
                {deleting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}