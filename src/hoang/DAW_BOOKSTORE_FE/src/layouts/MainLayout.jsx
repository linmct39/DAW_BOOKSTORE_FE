import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import CartSidebar from "../components/cart/CartSidebar";
import "./MainLayout.css";

function MainLayout() {
  const location = useLocation();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="header-content">
          <Link to="/cart" className="brand-link">
            <h1>DAW Bookstore</h1>
          </Link>
          <nav className="header-nav">
            <Link
              to="/profile"
              className={location.pathname === "/profile" ? "header-btn active" : "header-btn"}
            >
              Profile
            </Link>
            {user ? (
              <span className="header-user">{user.full_name || user.displayName || user.email}</span>
            ) : null}
          </nav>
        </div>
      </header>

      <div className="main-content">
        <div className="content-area">
          <Outlet />
        </div>
        <aside className="sidebar">
          <CartSidebar />
        </aside>
      </div>

      <footer className="main-footer">
      </footer>
    </div>
  );
}

export default MainLayout;
