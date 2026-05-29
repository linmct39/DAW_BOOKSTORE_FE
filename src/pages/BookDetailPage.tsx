import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart, Check, Info, Loader2, AlertCircle } from "lucide-react";
import { bookApi } from "../services/bookApi";
import { categoryApi } from "../services/categoryApi";
import { useCart } from "../context/CartContext";

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [book, setBook] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [qty, setQty] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadBookData() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        
        const [bookData, categoriesData] = await Promise.all([
          bookApi.getBookById(id),
          categoryApi.getCategories()
        ]);

        if (bookData) {
          setBook(bookData);
        } else {
          setError("Không tìm thấy sách yêu cầu.");
        }
        setCategories(categoriesData || []);
      } catch (err: any) {
        console.error("Error loading book detail:", err);
        setError("Đã xảy ra lỗi khi tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    }

    loadBookData();
  }, [id]);

  const handleIncrease = () => {
    setQty((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (qty > 0) {
      setQty((prev) => prev - 1);
    }
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 0) {
      setQty(val);
    }
  };

  const handleAddToCart = () => {
    if (qty <= 0) return;
    addToCart(book, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (qty <= 0) return;
    addToCart(book, qty);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-gray-500">Đang tải chi tiết sách...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-full mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Đã xảy ra lỗi</h2>
        <p className="text-sm text-gray-500 mb-6">{error || "Sách không tồn tại hoặc đã bị xóa."}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại trang chủ</span>
        </button>
      </div>
    );
  }

  const categoryName = categories.find((c) => c.id.toString() === book.categoryId?.toString())?.name || "Chuyên mục tuyển chọn";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Return Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="group inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-indigo-600 mb-6 sm:mb-8 transition cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Quay Lại</span>
      </button>

      {/* Main Layout Area */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Cover Art Preview */}
          <div className="md:col-span-5 flex flex-col">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-xs max-w-sm mx-auto w-full">
              <img
                src={book.imageUrl}
                alt={book.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            {book.featured && (
              <span className="mt-4 mx-auto inline-flex items-center justify-center gap-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs w-fit">
                Sách Khuyên Đọc
              </span>
            )}
          </div>

          {/* Book General Data Panel */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest font-mono">
                {categoryName}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {book.title}
              </h1>
              <p className="text-sm font-medium text-gray-400 font-mono">
                Tác giả: <span className="text-gray-700 font-sans font-semibold">{book.author}</span>
              </p>
            </div>

            <div className="border-t border-b border-gray-100 py-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-400">Đơn Giá:</span>
                <span className="text-3xl font-black text-orange-600 font-sans">
                  {book.price.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            {/* Description Text */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Info className="h-4 w-4 text-indigo-500" />
                Giới thiệu tác phẩm:
              </span>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-50">
                {book.description || "Tác phẩm tuyệt vời này chưa được cập nhật thông tin mô tả chi tiết từ ban quản trị hệ thống."}
              </p>
            </div>

            {/* Add to Cart Controls */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-700">Chọn số lượng mua:</span>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={qty <= 0}
                    className="p-1 px-2 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-md transition disabled:opacity-35 cursor-pointer disabled:bg-transparent"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={qty}
                    onChange={handleQtyChange}
                    className="w-12 text-center text-xs font-bold bg-transparent border-0 focus:ring-0 text-gray-900 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleIncrease}
                    className="p-1 px-2 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-md transition disabled:opacity-35 cursor-pointer disabled:bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-2">
                <button
                  onClick={handleAddToCart}
                  disabled={qty <= 0}
                  className={`w-full font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all duration-200 cursor-pointer ${
                    qty <= 0
                      ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                      : added
                      ? "bg-green-600 text-white hover:bg-green-700 border-green-600"
                      : "bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Đã Thêm {qty} Cuốn!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      <span>Thêm Vào Giỏ Hàng</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={qty <= 0}
                  className={`w-full font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition duration-200 cursor-pointer ${
                    qty <= 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md"
                  }`}
                >
                  <span>Mua Ngay</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
