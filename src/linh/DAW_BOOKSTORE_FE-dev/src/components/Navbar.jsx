import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="topbar">
            <div className="topbar__brand">
                <Link to="/" className="brand-link">
                    DAW <span>Bookstore</span>
                </Link>
            </div>

            <nav className="topbar__nav">
                <Link className={isActive('/profile') ? 'nav-link active' : 'nav-link'} to="/profile">
                    Profile
                </Link>
                <Link className={isActive('/cart') ? 'nav-link active' : 'nav-link'} to="/cart">
                    Cart
                </Link>
                {user?.role === 'admin' && (
                    <Link className={isActive('/admin') ? 'nav-link active' : 'nav-link'} to="/admin">
                        Admin
                    </Link>
                )}
            </nav>

            <div className="topbar__actions">
                {user ? (
                    <>
                        <div className="user-chip">
                            <span className="user-chip__avatar">{(user.full_name || user.email || 'U').slice(0, 1).toUpperCase()}</span>
                            <div className="user-chip__meta">
                                <strong>{user.full_name || user.displayName || user.email}</strong>
                                <span>{user.role || 'user'}</span>
                            </div>
                        </div>
                        <button type="button" className="btn btn-ghost" onClick={handleLogout}>
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-ghost">
                            Đăng nhập
                        </Link>
                        <Link to="/signup" className="btn btn-primary">
                            Đăng ký
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Navbar;