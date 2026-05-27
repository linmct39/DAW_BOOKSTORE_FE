import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Category } from '../../types';
import { ArrowRight, BookOpen, Star, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { bookService } from '../../services/bookService';
import { categoryService } from '../../services/categoryService';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [booksData, catsData] = await Promise.all([
          bookService.getAll({ limit: 12 }),
          categoryService.getAll()
        ]);
        
        setBooks(Array.isArray(booksData) ? booksData : []);
        setCategories(Array.isArray(catsData) ? catsData : []);
      } catch (e: any) {
        console.error('API Error:', e);
        toast.error('Không thể tải dữ liệu từ máy chủ API.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const featuredBooks = books.slice(0, 8); // Backend might not have isFeatured flag, so just show first few

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-64 bg-slate-200 rounded-2xl w-full" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-200 rounded-xl" />)}
    </div>
  </div>;

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-blue-600 text-white p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Khám phá thế giới qua <span className="text-blue-200">từng trang sách</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-lg">
            Chào mừng bạn đến với DAW BookStore – nơi hội tụ những đầu sách hay nhất, đa dạng thể loại và cập nhật liên tục.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link 
              to="/search" 
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 group"
            >
              Xem ngay <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all"
            >
              Tham gia cộng đồng
            </Link>
          </div>
        </div>
        <div className="flex-1 relative hidden md:block">
           <img 
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2100&auto=format&fit=crop" 
              alt="Bookstore Hero" 
              className="rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 max-h-[400px] w-full object-cover" 
              referrerPolicy="no-referrer"
           />
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold">Danh mục sản phẩm</h2>
            <p className="text-slate-500">Khám phá theo thể loại bạn yêu thích</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link 
              key={cat.id} 
              to={`/search?category_id=${cat.id}`}
              className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all text-center space-y-3 group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="font-semibold text-sm">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Star className="text-yellow-400 fill-yellow-400" /> Sách nổi bật
            </h2>
            <p className="text-slate-500">Những tác phẩm được bạn đọc quan tâm nhất tuần qua</p>
          </div>
          <Link to="/search" className="text-blue-600 font-medium flex items-center gap-1 hover:underline">
            Tất cả sách <ChevronRight size={18} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {featuredBooks.map(book => (
            <Link key={book.id} to={`/books/${book.id}`} className="group space-y-4 pt-4">
              <div className="aspect-[3/4] rounded-2xl bg-white p-4 shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:-translate-y-2 transition-all overflow-hidden relative">
                <img 
                  src={book.imageUrl || 'https://images.unsplash.com/photo-1543005128-d9b21007c641?q=80&w=1974&auto=format&fit=crop'} 
                  alt={book.title} 
                  className="w-full h-full object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                  {book.price.toLocaleString('vi-VN')}đ
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">{categories.find(c => c.id === book.category_id)?.name}</p>
                <h3 className="font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{book.title}</h3>
                <p className="text-sm text-slate-500">{book.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
