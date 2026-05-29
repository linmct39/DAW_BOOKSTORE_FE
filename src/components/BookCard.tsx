import React, { useState } from "react";
import { ShoppingCart, Minus, Plus, Bookmark, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

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

interface BookCardProps {
  key?: any;
  book: any;
  categoryName?: string;
  onViewDetails: (book: any) => void;
}

export default function BookCard({ book, categoryName, onViewDetails }: BookCardProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(0);
  const [added, setAdded] = useState(false);

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening details modal
    if (qty > 0) {
      setQty((prev) => prev - 1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening details modal
    setQty((prev) => prev + 1);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening details modal
    if (qty <= 0) return;
    
    addToCart(book as any, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  const handleCardClick = () => {
    onViewDetails(book);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 flex flex-col h-full overflow-hidden cursor-pointer group"
    >
      {/* Clickable Image Section */}
      <div className="relative aspect-video bg-gray-50 overflow-hidden">
        <img
          src={book.imageUrl}
          alt={book.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
        />
      </div>
      
      {/* Clickable Info Area */}
      <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wide">
              {categoryName || "Danh mục"}
            </p>
          </div>
          <h3 className="font-extrabold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition text-sm">
            {book.title}
          </h3>
          <p className="text-xs text-gray-400 font-medium font-mono">Tác giả: {book.author}</p>
        </div>

        {/* Pricing, Quantity selector & Action bar */}
        <div className="space-y-2 pt-2 border-t border-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm font-black text-orange-600 font-sans">
              {book.price.toLocaleString("vi-VN")} đ
            </span>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            {/* Drop-down / Custom local input qty */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-100 shrink-0">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={qty <= 0}
                className="px-1.5 py-1 text-gray-500 hover:text-indigo-600 hover:bg-white rounded transition disabled:opacity-30 cursor-pointer disabled:bg-transparent"
                title="Giảm"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-5 text-center text-[11px] font-bold text-gray-800 select-none">
                {qty}
              </span>
              <button
                type="button"
                onClick={handleIncrease}
                className="px-1.5 py-1 text-gray-500 hover:text-indigo-600 hover:bg-white rounded transition disabled:opacity-30 cursor-pointer disabled:bg-transparent"
                title="Tăng"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {/* Add Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={qty <= 0}
              className={`flex-grow font-bold py-2 px-2.5 rounded-lg text-[11px] flex items-center justify-center gap-1 border transition-all duration-200 cursor-pointer ${
                qty <= 0
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : added
                  ? "bg-green-600 border-green-600 text-white shadow-xs"
                  : "bg-indigo-600 border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 text-white shadow-xs"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Đã Thêm!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>Thêm ({qty})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
