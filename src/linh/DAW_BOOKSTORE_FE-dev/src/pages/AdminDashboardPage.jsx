import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { invoiceService } from '../services/invoiceService';

const readStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
        return null;
    }
};

const AdminDashboardPage = () => {
    const user = readStoredUser();
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const loadInvoices = async () => {
            const data = await invoiceService.getAll();
            setInvoices(data || []);
        };

        loadInvoices();
    }, []);

    const pendingInvoices = invoices.filter((item) => item.status === 'pending').length;
    const completedInvoices = invoices.filter((item) => item.status === 'completed').length;

    return (
        <div className="admin-layout-shell">
            <aside className="admin-sidebar">
                <div>
                    <p className="eyebrow">Admin</p>
                    <h2>Bảng điều khiển</h2>
                </div>

                <nav className="admin-menu">
                    <Link to="/profile">Profile</Link>
                    <Link to="/cart">Cart</Link>
                    <Link to="/checkout">Checkout</Link>
                    <Link to="/profile">Invoice</Link>
                </nav>

                <div className="admin-sidebar__footer">
                    <p className="muted">{user?.full_name || user?.displayName || user?.email}</p>
                    <p className="muted">{user?.role}</p>
                    <button
                        type="button"
                        className="btn btn-ghost btn-block"
                        onClick={() => {
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }}
                    >
                        Đăng xuất
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <section className="hero-card hero-card--compact">
                    <div>
                        <p className="eyebrow">Hoang style</p>
                        <h1>Trang admin sau khi login.</h1>
                        <p className="muted">Đây là lớp giao diện quản trị gắn với profile, cart, checkout và invoice.</p>
                    </div>
                </section>

                <div className="stats-grid">
                    <article className="stat-card">
                        <span>Tổng hóa đơn</span>
                        <strong>{invoices.length}</strong>
                    </article>
                    <article className="stat-card">
                        <span>Đang chờ xử lý</span>
                        <strong>{pendingInvoices}</strong>
                    </article>
                    <article className="stat-card">
                        <span>Hoàn thành</span>
                        <strong>{completedInvoices}</strong>
                    </article>
                </div>

                <section className="panel">
                    <div className="panel__header">
                        <h2>Liên kết nhanh</h2>
                        <span className="badge">Admin</span>
                    </div>
                    <div className="quick-links-grid">
                        <Link className="quick-link-card" to="/profile">Thông tin cá nhân</Link>
                        <Link className="quick-link-card" to="/cart">Giỏ hàng</Link>
                        <Link className="quick-link-card" to="/checkout">Thanh toán</Link>
                        <Link className="quick-link-card" to="/profile">Hóa đơn gần nhất</Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboardPage;