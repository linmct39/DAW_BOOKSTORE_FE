import React from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const stats = [
    { label: "Tổng số sách", value: "1,234", color: "#2196f3" },
    { label: "Tổng danh mục", value: "15", color: "#4caf50" },
    { label: "Tổng người dùng", value: "456", color: "#ff9800" },
    { label: "Tổng đơn hàng", value: "789", color: "#f44336" },
  ];

  const recentActivities = [
    { id: 1, action: "Đơn đặt hàng mới", time: "2 giờ trước", icon: "📦" },
    { id: 2, action: "Người dùng mới đăng ký", time: "3 giờ trước", icon: "👤" },
    { id: 3, action: "Sách mới được thêm", time: "5 giờ trước", icon: "📖" },
    { id: 4, action: "Đơn hàng bị hủy", time: "1 ngày trước", icon: "❌" },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Bảng điều khiển</h1>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stat-card"
            style={{ borderLeftColor: stat.color }}
          >
            <h3>{stat.label}</h3>

            <p
              className="stat-value"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Hoạt động gần đây</h2>

          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="activity-item"
              >
                <span className="activity-icon">
                  {activity.icon}
                </span>

                <div className="activity-info">
                  <p className="activity-action">
                    {activity.action}
                  </p>

                  <p className="activity-time">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Liên kết nhanh</h2>

          <div className="quick-links">
            <a
              href="/admin/books"
              className="quick-link-btn"
            >
              📚 Quản lý sách
            </a>

            <a
              href="/admin/categories"
              className="quick-link-btn"
            >
              📁 Quản lý danh mục
            </a>

            <a
              href="/admin/users"
              className="quick-link-btn"
            >
              👥 Quản lý người dùng
            </a>

            <a
              href="/admin/invoices"
              className="quick-link-btn"
            >
              📄 Quản lý hóa đơn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;