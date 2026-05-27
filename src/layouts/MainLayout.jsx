import React from "react";
import { Outlet } from "react-router-dom";
import CartSidebar from "../components/cart/CartSidebar";
import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="header-content">
          <h1>DAW Bookstore</h1>
          <nav className="header-nav">
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
