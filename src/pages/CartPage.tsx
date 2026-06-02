import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { invoiceApi } from "../services/invoiceApi";
import { Trash2, ShoppingBag, ShoppingCart, User, Phone, MapPin, Loader2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cartItems, updateCartQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form values for checkout
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  const [checkingOut, setCheckingOut] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync profile data to checkout fields automatically
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
      setShippingAddress(user.address || "");
    }
  }, [user]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg({ type: "error", text: "Tính năng đặt hàng COD đang được phát triển. Vui lòng quay lại sau." });
    return;
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-4" id="empty-cart-page">
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-xs">
          <ShoppingCart className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Giỏ Hàng Chưa Có Sách</h2>
        <p className="text-xs text-gray-500 font-medium">Hiện tại bạn chưa chọn mua bất kỳ cuốn sách nào trên kệ hàng.</p>
        <Link to="/" className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition shadow-xs">
          <ShoppingBag className="h-4 w-4" />
          <span>Tiếp tục mua sắm</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8" id="cart-page">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-gray-900">Giỏ Hàng Của Bạn</h1>
        <p className="text-xs text-gray-500 font-medium">Bạn có {cartItems.length} đầu mục sách trong giỏ thanh toán.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Cart Items Table/cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden shadow-xs">
            {cartItems.map((item) => (
              <div key={item.bookId} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded-lg bg-gray-50 border border-gray-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{item.title}</h3>
                    <p className="text-[10px] text-gray-400 font-medium font-mono">{item.author}</p>
                    <p className="text-xs font-bold text-orange-600 font-sans">
                      {item.price.toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Quantity adjustment widgets */}
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateCartQuantity(item.bookId, item.quantity - 1)}
                      className="px-2 py-1 text-gray-500 hover:bg-gray-100 text-xs font-bold font-mono transition"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs text-gray-800 font-bold font-mono min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.bookId, item.quantity + 1)}
                      className="px-2 py-1 text-gray-500 hover:bg-gray-100 text-xs font-bold font-mono transition"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-xs font-extrabold text-gray-900 font-sans">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                  </p>

                  <button
                    onClick={() => {
                      removeFromCart(item.bookId);
                      alert(`Đã xóa "${item.title}" khỏi giỏ hàng.`);
                    }}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition"
                    title="Xóa khỏi giỏ hàng"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-baseline pt-2">
            <Link to="/" className="text-xs text-indigo-600 hover:underline font-semibold font-sans">
              ← Tiếp tục chọn sách khác
            </Link>
            <button
              onClick={() => {
                if (confirm("Bạn thực sự muốn làm trống giỏ hàng?")) {
                  clearCart();
                }
              }}
              className="text-xs text-red-500 hover:underline font-medium"
            >
              Làm trống toàn bộ giỏ
            </button>
          </div>
        </div>

        {/* Right Side: Order checkout form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit space-y-6">
          <div className="space-y-1 pb-4 border-b border-gray-150">
            <h2 className="font-bold text-gray-900 text-sm">Thanh Toán Đơn Hàng</h2>
            <p className="text-xs text-gray-400">Kiểm tra thông tin giao nhận và hoàn tất thủ tục</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs py-1">
              <span className="text-gray-500 font-medium font-sans">Tạm tính giỏ sách:</span>
              <span className="font-semibold text-gray-800 font-sans">{cartTotal.toLocaleString("vi-VN")} đ</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <span className="text-gray-500 font-medium">Chi phí giao hàng:</span>
              <span className="text-green-600 font-bold font-sans">Miễn Phí Toàn Quốc</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-t border-gray-100">
              <span className="font-bold text-gray-900">Tổng cộng thanh toán:</span>
              <span className="text-base font-extrabold text-orange-600 font-mono">
                {cartTotal.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>

          {statusMsg && (
            <div className={`p-3 rounded-lg text-xs font-semibold ${statusMsg.type === "success" ? "bg-green-50 border border-green-100 text-green-800" : "bg-red-50 border border-red-100 text-red-800"}`}>
              {statusMsg.text}
            </div>
          )}

          {/* User checking form */}
          {user ? (
            <form onSubmit={handleCheckout} className="space-y-4 pt-2 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-800">Thông Tin Giao Nhận Hàng</h3>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Họ tên người nhận</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Họ và tên hoặc bí danh..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-250 focus:bg-white focus:border-indigo-500 rounded-lg pl-9 pr-3 py-1.5 text-xs font-medium text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Số điện thoại liên lạc</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="Số điện thoại nhận sách..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-250 focus:bg-white focus:border-indigo-500 rounded-lg pl-9 pr-3 py-1.5 text-xs font-medium text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Địa chỉ chi tiết nhận hàng</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Địa chỉ nhà, căn hộ, phường xã..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-250 focus:bg-white focus:border-indigo-500 rounded-lg pl-9 pr-3 py-1.5 text-xs font-medium text-gray-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={checkingOut}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-xs transition cursor-pointer flex items-center justify-center space-x-2 border border-transparent shadow-xs disabled:bg-indigo-400"
              >
                {checkingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang kiểm tra kho & xác thực...</span>
                  </>
                ) : (
                  <>
                    <span>Xác Nhận Đặt Hàng COD</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-3">
              <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                Bạn cần phải đăng nhập tài khoản DAW BOOKSTORE trước khi tiến hành đặt hàng để lưu trữ hóa đơn lịch sử!
              </p>
              <button
                onClick={() => navigate("/login", { state: { from: { pathname: "/cart" } } })}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs transition"
              >
                Đăng Nhập Thử Ngay
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
