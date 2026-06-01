import React, { useEffect, useState } from "react";
import { categoryApi } from "../services/categoryApi";
import { Plus, Trash2, Pencil, X, AlertCircle, CheckCircle2 } from "lucide-react";

/* ================= TYPE ================= */
interface Category {
  id: number;
  name: string;
}

/* ================= COMPONENT ================= */
export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== NOTIFICATION ===== */
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

  /* ===== LOADING ===== */
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  /* ===== MODAL ===== */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState("");

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryApi.getCategories();

      const cleaned: Category[] = (data ?? [])
        .filter((item: any) => item !== null)
        .map((item: any) => ({
          id: item.id,
          name: item.name,
        }));

      setCategories(cleaned);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= ADD ================= */
  const handleAdd = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      showToast("error", "Tên danh mục không được để trống!");
      return;
    }

    const isDuplicate = categories.some(
      (cat) => cat.name.toLowerCase().trim() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      showToast("error", `Danh mục "${trimmedName}" đã tồn tại rồi nhé!`);
      return;
    }

    setAdding(true);
    try {
      await categoryApi.createCategory({ name: trimmedName });
      setName("");
      setIsAddOpen(false);
      await fetchCategories();
      showToast("success", "Thêm danh mục mới thành công!");
    } catch (err: any) {
      console.error(err);
      const serverMsg = err.response?.data?.message || err.response?.data?.messenger || "Thêm thất bại";
      showToast("error", serverMsg);
    } finally {
      setAdding(false);
    }
  };

  /* ================= OPEN DELETE ================= */
  const openDelete = (cat: Category) => {
    setDeleteId(cat.id);
    setDeleteName(cat.name);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeletingId(deleteId);
    try {
      await categoryApi.deleteCategory(deleteId);
      setIsDeleteOpen(false);
      setDeleteId(null);
      await fetchCategories();
      showToast("success", "Xóa danh mục thành công!");
    } catch (err: any) {
      console.error(err);
      showToast("error", "Không thể xóa danh mục này!");
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= EDIT ================= */
  const openEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditId(null);
  };

  const handleUpdate = async () => {
    const trimmedEditName = editName.trim();
    if (!editId || !trimmedEditName) {
      showToast("error", "Tên danh mục không được để trống!");
      return;
    }

    const isDuplicate = categories.some(
      (cat) => cat.id !== editId && cat.name.toLowerCase().trim() === trimmedEditName.toLowerCase()
    );

    if (isDuplicate) {
      showToast("error", `Tên danh mục "${trimmedEditName}" đã được sử dụng!`);
      return;
    }

    setUpdating(true);
    try {
      await categoryApi.updateCategory(editId, { name: trimmedEditName });
      closeEdit();
      await fetchCategories();
      showToast("success", "Cập nhật danh mục thành công!");
    } catch (err: any) {
      console.error(err);
      const serverMsg = err.response?.data?.message || err.response?.data?.messenger || "Cập nhật thất bại";
      showToast("error", serverMsg);
    } finally {
      setUpdating(false);
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

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-gray-800 transition"
        >
          <Plus className="w-5 h-5" />
          Thêm mới
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-center text-gray-500 py-4">Đang tải...</p>
      ) : (
        <div className="space-y-3">
          {categories.map((item) => (
            <div
              key={item.id}
              className="border rounded-2xl p-4 flex justify-between items-center bg-white shadow-sm"
            >
              <div className="font-semibold text-gray-800">{item.name}</div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                >
                  <Pencil className="w-5 h-5" />
                </button>

                <button
                  onClick={() => openDelete(item)}
                  className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= ADD MODAL ================= */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-2xl relative shadow-2xl">

            <button onClick={() => setIsAddOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X size={20} />
            </button>

            <div className="p-6 text-center border-b">
              <h2 className="text-xl font-bold">Thêm danh mục</h2>
            </div>

            <div className="p-6">
              <label className="text-sm font-medium mb-1 block">Tên danh mục *</label>
              <input
                placeholder="Ví dụ: Tiểu thuyết, Kỹ năng sống..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-3 rounded-xl outline-none focus:border-black"
              />
            </div>

            <div className="p-6 border-t">
              <button
                onClick={handleAdd}
                disabled={adding}
                className="w-full bg-black text-white py-3 rounded-xl flex justify-center gap-2 disabled:bg-gray-400 transition"
              >
                {adding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  "Thêm"
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-2xl relative shadow-2xl">

            <button onClick={closeEdit} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X size={20} />
            </button>

            <div className="p-6 text-center border-b">
              <h2 className="text-xl font-bold">Sửa danh mục</h2>
            </div>

            <div className="p-6">
              <label className="text-sm font-medium mb-1 block">Tên danh mục mới *</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border p-3 rounded-xl outline-none focus:border-green-600"
              />
            </div>

            <div className="p-6 border-t">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="w-full bg-green-600 text-white py-3 rounded-xl disabled:bg-gray-400 font-medium transition"
              >
                {updating ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="p-6 text-center border-b">
              <div className="w-12 h-12 mx-auto bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6" />
              </div>

              <h2 className="text-lg font-bold text-gray-900">
                Xóa danh mục
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Hành động này không thể hoàn tác
              </p>
            </div>

            {/* BODY */}
            <div className="p-6 text-center">
              <p className="text-gray-700">
                Bạn có chắc muốn xóa:
              </p>

              <p className="mt-2 font-semibold text-gray-900">
                “{deleteName}”
              </p>
            </div>

            {/* FOOTER */}
            <div className="p-4 bg-gray-50 flex gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 py-3 rounded-xl bg-white border hover:bg-gray-100 transition font-medium"
              >
                Hủy
              </button>

              <button
                onClick={handleDelete}
                disabled={deletingId !== null}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center gap-2 font-medium"
              >
                {deletingId ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa"
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}