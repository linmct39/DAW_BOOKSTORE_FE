import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { label: "Bảng điều khiển", path: "/admin", icon: "📊" },
    { label: "Sách", path: "/admin/books", icon: "📚" },
    { label: "Danh mục", path: "/admin/categories", icon: "📁" },
    { label: "Người dùng", path: "/admin/users", icon: "👥" },
    { label: "Hóa đơn", path: "/admin/invoices", icon: "📄" },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="nav-item"
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <p className="user-name">{user?.full_name || user?.displayName || user?.email}</p>
            <p className="user-role">{user?.role}</p>
          </div>
          <button className="btn-logout" onClick={() => navigate("/profile")} style={{ marginBottom: 10, backgroundColor: "#2196f3" }}>
            Profile
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;