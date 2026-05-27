import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book, Category, CartItem } from '../../types';
import { ShoppingCart, ArrowLeft, Check, Plus, Minus, Tag, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { bookService } from '../../services/bookService';

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = readStoredUser();
  
  const [book, setBook] = useState<Book | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const bookData = await bookService.getById(id);
        setBook(bookData);
      } catch (e) {
        console.error('API Error:', e);
        toast.error('Không thể tải thông tin sách.');
        navigate('/search');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, navigate]);

  const addToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      // Fetch current cart or just send the item
      const cartItem: CartItem = { bookId: book!.id, quantity };
      
      // In a real REST API we might have /api/cart/:userId
      // For this demo we'll use local storage as fallback or a dedicated endpoint
      const currentCartRaw = localStorage.getItem(`cart_${user.uid}`);
      const currentCart: CartItem[] = currentCartRaw ? JSON.parse(currentCartRaw) : [];
      
      const existingIdx = currentCart.findIndex(i => i.bookId === book!.id);
      if (existingIdx > -1) {
        currentCart[existingIdx].quantity += quantity;
      } else {
        currentCart.push(cartItem);
      }
      
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(currentCart));
      
      toast.success('Đã thêm vào giỏ hàng!');
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (e) {
      console.error(e);
      toast.error('Lỗi khi thêm vào giỏ hàng');
    } finally {
      setAdding(false);
    }
  };

  if (loading || !book) return <div className="animate-pulse flex flex-col md:flex-row gap-12 pt-12">
    <div className="w-full md:w-1/3 aspect-[3/4] bg-slate-200 rounded-3xl" />
    <div className="flex-1 space-y-6">
      <div className="h-12 bg-slate-200 rounded-xl w-3/4" />
      <div className="h-6 bg-slate-200 rounded-lg w-1/4" />
      <div className="h-32 bg-slate-200 rounded-2xl w-full" />
    </div>
  </div>;

  return (
    <div className="pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors"
      >
        <ArrowLeft size={20} /> Quay lại
      </button>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        {/* Book Image */}
        <div className="w-full md:w-2/5 lg:w-1/3">
          <div className="sticky top-24 aspect-[3/4] rounded-[2.5rem] bg-white shadow-2xl p-6 border border-slate-100 overflow-hidden group">
            <img 
              src={book.imageUrl || 'https://images.unsplash.com/photo-1543005128-d9b21007c641?q=80&w=1974&auto=format&fit=crop'} 
              alt={book.title} 
              className="w-full h-full object-cover rounded-[1.5rem] shadow-inner transform group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Book Info */}
        <div className="flex-1 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full flex items-center gap-1 uppercase tracking-wider">
                <Tag size={12} /> {book.category?.name || 'Chưa phân loại'}
              </span>
              {(book.stock ?? 0) > 0 ? (
                <span className="text-xs font-bold text-green-500 uppercase tracking-wider flex items-center gap-1">
                  <Check size={14} /> Còn hàng ({book.stock})
                </span>
              ) : (
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Hết hàng</span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">{book.title}</h1>
            <p className="text-xl text-slate-500 font-medium">Tác giả: <span className="text-slate-900">{book.author}</span></p>
          </div>

          <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-blue-600 font-bold text-sm uppercase tracking-widest">Giá bán ưu đãi</p>
              <h2 className="text-4xl font-extrabold text-blue-700">{book.price.toLocaleString('vi-VN')} VNĐ</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white border border-blue-200 rounded-2xl p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <Minus size={18} />
                </button>
                <span className="w-10 text-center font-bold text-slate-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                  className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <button 
                onClick={addToCart}
                disabled={book.stock === 0 || adding}
                className={`flex-1 sm:flex-none px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg ${
                  added 
                  ? 'bg-green-500 text-white shadow-green-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none'
                }`}
              >
                {added ? (
                  <>
                    <Check size={20} /> Đã thêm
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} /> 
                    {adding ? 'Đang xử lý...' : 'Thêm vào giỏ'}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-4">
              <BookOpen size={20} className="text-blue-600" />
              <h3 className="text-xl font-bold">Mô tả sản phẩm</h3>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed italic">
              {book.description || 'Chưa có mô tả chi tiết cho cuốn sách này.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
