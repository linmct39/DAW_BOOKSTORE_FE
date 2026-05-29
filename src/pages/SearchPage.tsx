import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { bookApi } from "../services/bookApi";
import { categoryApi } from "../services/categoryApi";
import { useCart } from "../context/CartContext";
import { Search, Ban, Loader2, X } from "lucide-react";
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

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryQ = searchParams.get("q") || "";
  const queryCat = searchParams.get("category") || "";

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search local inputs
  const [keyword, setKeyword] = useState(queryQ);
  const [selectedCat, setSelectedCat] = useState(queryCat);
  const [sortBy, setSortBy] = useState<"none" | "lowToHigh" | "highToLow">("none");

  const { addToCart } = useCart();

  useEffect(() => {
    // Sync local state when search parameter changes in url (e.g. user clicks another search link)
    setKeyword(queryQ);
    setSelectedCat(queryCat);
  }, [queryQ, queryCat]);

  useEffect(() => {
    async function fetchSearchData() {
      try {
        setLoading(true);
        setError(null);
        // Load filtering parameters on API
        const filterParams: any = {};
        if (queryQ) filterParams.search = queryQ;
        if (queryCat && queryCat !== "all") filterParams.category = queryCat;

        const [booksData, categoryData] = await Promise.all([
          bookApi.getBooks(filterParams),
          categoryApi.getCategories()
        ]);

        setBooks(booksData);
        setCategories(categoryData);
      } catch (err: any) {
        console.error(err);
        setError("Không thể nạp dữ liệu tìm kiếm. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    }
    fetchSearchData();
  }, [queryQ, queryCat]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = {};
    if (keyword.trim()) params.q = keyword;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setKeyword("");
    setSearchParams({});
  };

  // Sort calculations
  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === "lowToHigh") return a.price - b.price;
    if (sortBy === "highToLow") return b.price - a.price;
    return 0; // default no sorting
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8" id="search-page">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Tìm Kiếm Sách</h1>
        <p className="text-xs text-gray-400 font-medium font-sans">
          Nhập từ khóa tên sách, tác giả hoặc chọn phân loại sách để xem danh sách tương thích
        </p>
      </div>

      {/* Horizontal Simple Search Bar UI Component */}
      <div className="max-w-2xl mx-auto bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
        <form onSubmit={handleFilterSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập tựa sách, tác giả hoặc từ khóa liên quan..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-hidden font-semibold text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition cursor-pointer"
          >
            Tìm kiếm
          </button>
          {keyword && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2.5 rounded-lg transition flex items-center justify-center cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {/* Query Results Info and Product Listing */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center px-1">
          <p className="text-xs text-gray-500 font-medium">
            Tìm thấy <span className="text-indigo-600 font-bold">{sortedBooks.length}</span> sản phẩm sách phù hợp
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3 bg-white rounded-xl border border-gray-100">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            <p className="text-sm text-gray-500 font-medium">Đang tìm kiếm sách tương thích...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 text-center font-semibold">
            {error}
          </div>
        ) : sortedBooks.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center text-gray-500 space-y-3">
            <Ban className="h-12 w-12 text-gray-300 mx-auto" />
            <h3 className="text-sm font-bold text-gray-700">Rất tiếc! Không Tìm Thấy Sách Phù Hợp</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">Vui lòng thay đổi từ khóa tìm kiếm hoặc chọn danh mục sách khác để hiển thị.</p>
            <button
              onClick={handleClearFilters}
              className="mt-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs px-4 py-2 rounded-lg transition cursor-pointer"
            >
              Thiết lập lại tìm kiếm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedBooks.map((book) => (
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
      </div>
    </div>
  );
}
