import { useState, useEffect } from 'r  eact';
import { useSearchParams, Link } from 'react-router-dom';
import { Book, Category } from '../../types';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { toast } from 'sonner';
import { bookService } from '../../services/bookService';
import { categoryService } from '../../services/categoryService';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const query = searchParams.get('q') || '';
  const category_id = searchParams.get('category_id') || '';

  const normalizedQuery = query.trim().toLowerCase();
  const filteredBooks = books.filter((book) => {
    const matchesQuery = !normalizedQuery
      ? true
      : [book.title, book.author]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery));

    const matchesCategory = !category_id || String(book.category_id) === String(category_id);

    return matchesQuery && matchesCategory;
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [booksData, catsData] = await Promise.all([
          bookService.getAll(),
          categoryService.getAll()
        ]);
        
        setBooks(Array.isArray(booksData) ? booksData : []);
        setCategories(Array.isArray(catsData) ? catsData : []);
      } catch (e: any) {
        console.error('API Error:', e);
        toast.error('Không thể tìm kiếm từ máy chủ API.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-200 pb-8">
        <h1 className="text-3xl font-bold">Tìm kiếm sách</h1>
        
        <div className="relative w-full md:w-96">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Tìm theo tên sách hoặc tác giả..."
            value={query}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              if (e.target.value) newParams.set('q', e.target.value);
              else newParams.delete('q');
              setSearchParams(newParams);
            }}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Filter size={18} className="text-blue-600" /> Danh mục
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('category_id');
                  setSearchParams(newParams);
                }}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${!category_id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Tất cả
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('category_id', cat.id);
                    setSearchParams(newParams);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${category_id === cat.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">Kết quả: {filteredBooks.length} đầu sách</p>
            {(query || category_id) && (
              <button 
                onClick={() => setSearchParams({})}
                className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 uppercase tracking-wider"
              >
                <X size={14} /> Xóa bộ lọc
              </button>
            )}
          </div>

          {loading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 animate-pulse">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-slate-200 rounded-2xl" />)}
             </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 lg:gap-8">
              {filteredBooks.map(book => (
                <Link key={book.id} to={`/books/${book.id}`} className="group space-y-3">
                  <div className="aspect-[3/4] rounded-2xl bg-white p-3 shadow-sm border border-slate-100 group-hover:shadow-lg transition-all relative overflow-hidden">
                    <img 
                      src={book.imageUrl || 'https://images.unsplash.com/photo-1543005128-d9b21007c641?q=80&w=1974&auto=format&fit=crop'} 
                      alt={book.title} 
                      className="w-full h-full object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-blue-600">
                      {book.price.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">{book.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{book.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <SearchIcon size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">Không tìm thấy kết quả</h3>
                <p className="text-slate-500">Thử tìm kiếm với từ khóa khác hoặc danh mục khác</p>
              </div>
              <button 
                onClick={() => setSearchParams({})}
                className="text-blue-600 font-bold text-sm hover:underline"
              >
                Quay lại xem tất cả
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
