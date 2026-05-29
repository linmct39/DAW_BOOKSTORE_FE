import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { bookApi } from "../services/bookApi";
import { categoryApi } from "../services/categoryApi";
import { useCart } from "../context/CartContext";
import { BookOpen, BookMarked, HelpCircle, Loader2 } from "lucide-react";
import BookCard from "../components/BookCard";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: string;
  featured: boolean;
  stock: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function initData() {
      try {
        setLoading(true);
        setError(null);
        const [booksData, catsData] = await Promise.all([
          bookApi.getBooks(),
          categoryApi.getCategories()
        ]);
        setBooks(booksData);
        setCategories(catsData);
      } catch (err: any) {
        console.error("Lỗi tải trang chủ:", err);
        setError("Không thể nạp dữ liệu từ máy chủ. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // Filter books to display based on selected category
  const filteredBooks = activeCategory === "all"
    ? books
    : books.filter(b => b.categoryId === activeCategory);

  const featuredBooks = books.filter(b => b.featured);

  return (
    <div id="homepage-container">
      {/* Elegant Hero Banner */}
      <section className="bg-gradient-to-r from-indigo-700 to-violet-800 text-white py-16 px-4" id="home-hero">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="bg-indigo-500/30 text-indigo-200 text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full border border-indigo-400/20">
              HỆ THỐNG DAW BOOKSTORE
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Khai Mở Tri Thức <br />
              <span className="text-amber-400">Đọc Sách Vẽ Tương Lai</span>
            </h1>
            <p className="text-indigo-100 text-base max-w-lg leading-relaxed">
              Chào mừng bạn đến với hệ thống tuyển chọn hơn 1,000+ tựa sách dịch thuật, ngoại văn và giáo trình kỹ năng sống chuẩn nhất phục vụ sinh viên.
            </p>
          </div>
          
          <div className="lg:col-span-5 hidden lg:flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-amber-400 to-indigo-500 blur-sm opacity-30"></div>
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=500"
                alt="Bookpile Collection with Warm Ambient Lighting"
                className="relative rounded-xl shadow-2xl max-w-sm border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {/* Loading & Errors Status block */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            <p className="text-sm text-gray-500 font-medium">Đang tải danh mục sách mới nhất từ máy chủ...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center space-y-2">
            <p className="font-semibold">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-white border border-red-300 text-red-700 text-xs px-4 py-1.5 rounded-lg font-medium hover:bg-red-100 transition">
              Tải lại trang
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Complete Catalog Nav by category */}
            <section className="space-y-6" id="all-books">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BookMarked className="h-5 w-5 text-indigo-600" />
                    Khám Phá Toàn Bộ Sách
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">Lọc danh mục tùy chọn để nhanh chóng tiếp cận nhóm sách bạn cần</p>
                </div>

                {/* Category selectors */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${activeCategory === "all" ? "bg-indigo-600 text-white shadow-xs" : "bg-white border border-gray-100 hover:bg-gray-50 text-gray-600"}`}
                  >
                    Tất cả sách ({books.length})
                  </button>
                  {categories.map((cat) => {
                    const count = books.filter(b => b.categoryId === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${activeCategory === cat.id ? "bg-indigo-600 text-white shadow-xs" : "bg-white border border-gray-100 hover:bg-gray-50 text-gray-600"}`}
                      >
                        {cat.name} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {filteredBooks.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-500 space-y-2">
                  <HelpCircle className="h-12 w-12 text-gray-300 mx-auto" />
                  <p className="font-semibold text-sm text-gray-700">Chưa tìm thấy sách thuộc nhóm này!</p>
                  <p className="text-xs text-gray-400">Danh mục này hiện chưa có sách hoạt động. Quý khách vui lòng tham khảo nhóm sách khác.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      categoryName={categories.find((c) => c.id === book.categoryId)?.name}
                      onViewDetails={(b) => {
                        navigate(`/book/${b.id}`);
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
