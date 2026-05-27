import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = readStoredUser();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
              DAW <span className="text-gray-900">BookStore</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link 
                to="/" 
                className={`transition-colors ${location.pathname === '/' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
              >
                Trang chủ
              </Link>
              <Link 
                to="/search" 
                className={`transition-colors ${location.pathname === '/search' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
              >
                Tìm kiếm
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/search" 
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Tìm kiếm"
            >
              <Search size={22} />
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {user.full_name || user.displayName || user.email}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
