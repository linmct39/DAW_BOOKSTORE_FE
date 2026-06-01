import React, { useEffect, useMemo, useState } from "react";
import { bookApi } from "../services/bookApi";
import { categoryApi } from "../services/categoryApi";
import { Plus, Trash2, Pencil, X } from "lucide-react";

/* ================= TYPES ================= */
interface Category {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  description?: string;
  categoryId: number;
  categoryName?: string;
}

/* ================= COMPONENT ================= */
export default function BookManager() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== ADD ===== */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(""); 
  const [price, setPrice] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);

  /* ===== EDIT ===== */
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState(""); 
  const [editPrice, setEditPrice] = useState<string>("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<number>(0);

  /* ===== DELETE ===== */
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleting, setDeleting] = useState(false);

  /* ================= FETCH ================= */
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookApi.getBooks();
      setBooks(data ?? []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách sách:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getCategories();

      const cleaned: Category[] = (data ?? [])
        .filter((x: any) => x !== null)
        .map((x: any) => ({
          id: Number(x.id),
          name: String(x.name),
        }));

      setCategories(cleaned);

      if (cleaned.length > 0) {
        setCategoryId(cleaned[0].id);
        setEditCategoryId(cleaned[0].id);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  /* ================= SEARCH ================= */
  const filteredBooks = useMemo(() => {
    return books.filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.author && b.author.toLowerCase().includes(search.toLowerCase()))
    );
  }, [books, search]);

  /* ================= ADD ================= */
  const handleAdd = async () => {
    if (!title || !author.trim() || !price || !imageUrl || categoryId === 0) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setAdding(true);
    try {
  
      const maxId = books.reduce((max, book) => {
        const bookId = Number(book.id);
        return !isNaN(bookId) && bookId > max ? bookId : max;
      }, 0);
      
      const nextId = maxId + 1; 

      await bookApi.createBook({
        id: nextId, 
        title,
        author: author.trim(),
        price: Number(price),
        imageUrl,
        description,
        categoryId,
      });

      setIsAddOpen(false);
      setTitle("");
      setAuthor(""); 
      setPrice("");
      setImageUrl("");
      setDescription("");
      if (categories.length > 0) setCategoryId(categories[0].id);

      fetchBooks();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  /* ================= EDIT ================= */
  const openEdit = (b: Book) => {
    setEditId(b.id);
    setEditTitle(b.title);
    setEditAuthor(b.author || ""); 
    setEditPrice(String(b.price));
    setEditImageUrl(b.imageUrl);
    setEditDescription(b.description || "");
    setEditCategoryId(b.categoryId);
    setIsEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editId || !editTitle || !editAuthor.trim() || !editPrice || !editImageUrl) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setSaving(true);
    try {
      await bookApi.updateBook(editId, {
        title: editTitle,
        author: editAuthor.trim(), 
        price: Number(editPrice),
        imageUrl: editImageUrl,
        description: editDescription,
        categoryId: editCategoryId,
      });

      setIsEditOpen(false);
      fetchBooks();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const openDelete = (b: Book) => {
    setDeleteId(b.id);
    setDeleteTitle(b.title);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await bookApi.deleteBook(deleteId);
      setIsDeleteOpen(false);
      fetchBooks();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  /* ================= UI ================= */
  return (
   <div className="p-4 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý sách</h2>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-gray-800 active:scale-98 transition cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Thêm sách
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="w-full border p-3 rounded-2xl mb-6 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Tìm sách theo tiêu đề hoặc tác giả..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LIST */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Đang tải...</p>
      ) : filteredBooks.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Không tìm thấy sách nào.</p>
      ) : (
        <div className="space-y-3">
          {filteredBooks.map((b) => (
            <div
              key={b.id}
              className="border p-4 rounded-2xl flex justify-between items-center bg-white shadow-sm"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-16 h-20 object-cover rounded-xl border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/150x200?text=No+Image";
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md border border-gray-200">
                      ID: #{b.id}
                    </span>
                    <div className="font-bold text-lg">{b.title}</div>
                  </div>
                  <div className="text-xs font-medium text-indigo-600 mb-1 mt-0.5">
                    Tác giả: {b.author || "Chưa rõ tác giả"}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-2 max-w-md">
                    {b.description || "Không có mô tả"}
                  </div>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="text-sm font-semibold text-gray-800">
                      {Number(b.price).toLocaleString()}đ
                    </span>
                    {b.categoryName && (
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                        {b.categoryName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(b)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => openDelete(b)}
                  className="p-2 hover:bg-red-50 rounded-full text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= ADD MODAL ================= */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl relative shadow-xl">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <div className="p-6 text-center border-b font-bold text-xl">
              Thêm sách mới
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="bg-indigo-50 border border-indigo-150 p-2.5 rounded-xl text-center text-xs text-indigo-800 font-medium">
                ID sách: <strong className="font-bold text-indigo-950">#{books.reduce((max, b) => Number(b.id) > max ? Number(b.id) : max, 0) + 1}</strong>
              </div>

              <input
                placeholder="Tên sách *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />

              <input
                placeholder="Tên tác giả *"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />

              <input
                type="text"
                inputMode="numeric"
                placeholder="Giá sách (đ) *"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 px-1">Danh mục *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <input
                placeholder="Link ảnh (URL) *"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />

              <textarea
                placeholder="Mô tả"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-3 rounded-xl h-24 focus:ring-2 focus:ring-black outline-none resize-none"
              />
            </div>

            <div className="p-4 border-t">
              <button
                onClick={handleAdd}
                disabled={adding}
                className="w-full bg-black text-white py-3 rounded-xl font-medium disabled:bg-gray-400 transition"
              >
                {adding ? "Đang thêm..." : "Thêm sách"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-2xl relative shadow-xl">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <div className="p-6 text-center border-b font-bold text-xl">
              Chỉnh sửa thông tin sách
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 px-1">Tên sách *</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 px-1">Tác giả *</label>
                <input
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 px-1">Giá tiền *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 px-1">Danh mục *</label>
                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(Number(e.target.value))}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-green-600 outline-none bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 px-1">Đường dẫn hình ảnh *</label>
                <input
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 px-1">Mô tả chi tiết</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border p-3 rounded-xl h-24 focus:ring-2 focus:ring-green-600 outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t">
              <button
                onClick={handleEdit}
                disabled={saving}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-medium disabled:bg-gray-400 transition"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 text-center border-b">
              <div className="text-red-600 mb-2">
                <Trash2 className="mx-auto" size={32} />
              </div>
              <h2 className="font-bold text-xl">Xóa sách</h2>
              <p className="text-sm text-gray-400 mt-1">Không thể hoàn tác hành động này</p>
            </div>

            <div className="p-6 text-center">
              <p className="text-gray-600">Bạn có chắc muốn xóa cuốn sách:</p>
              <p className="font-bold text-gray-900 mt-1">{deleteTitle}</p>
            </div>

            <div className="p-4 bg-gray-50 flex gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 border border-gray-300 bg-white rounded-xl py-2.5 font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white rounded-xl py-2.5 font-medium disabled:bg-gray-400 hover:bg-red-700 transition"
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