import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart, User, LogOut, BookOpen, Search, Shield, FileText, Menu, X } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-xs" id="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-indigo-700 font-bold text-xl hover:text-indigo-800 transition" id="logo">
              <BookOpen className="h-6 w-6" />
              <span>DAW BOOKSTORE</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              <Link to="/" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition">
                Trang Chủ
              </Link>
              <Link to="/search" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition flex items-center space-x-1">
                <Search className="h-4 w-4" />
                <span>Tìm Kiếm</span>
              </Link>
              {user && (
                <Link to="/invoices" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>Đơn Hàng</span>
                </Link>
              )}
              {user?.role === "admin" && (
                <Link to="/admin" className="text-red-600 hover:text-red-700 font-medium px-3 py-2 text-sm transition flex items-center space-x-1 border border-red-100 rounded-md bg-red-50/50">
                  <Shield className="h-4 w-4" />
                  <span>Quản Lý Admin</span>
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-indigo-600 transition" id="cart-btn">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium border border-gray-100 rounded-lg hover:border-indigo-100 transition">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{user.fullName}</span>
                </Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 p-2 rounded-md transition" title="Đăng xuất">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 px-4 py-2 text-sm font-medium transition">
                  Đăng Nhập
                </Link>
                <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition">
                  Đăng Ký
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            {/* Mobile menu, shopping cart shortcut */}
            <Link to="/cart" className="relative p-2 text-gray-500 mr-2" id="cart-mobile-btn">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-hidden">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
              Trang Chủ
            </Link>
            <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
              Tìm Kiếm Sách
            </Link>
            {user && (
              <Link to="/invoices" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                Đơn Hàng Đã Mua
              </Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-red-600 bg-red-50">
                Quản lý Admin Dashboard
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-100 px-3">
            {user ? (
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm font-medium text-gray-500">
                  Tài khoản: <span className="font-semibold text-gray-800">{user.fullName}</span>
                </div>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                  Hồ Sơ Cá Nhân
                </Link>
                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50">
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center block px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">
                  Đăng Nhập
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-center block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Đăng Ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
