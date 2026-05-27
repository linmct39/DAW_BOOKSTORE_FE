import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { invoiceService } from '../services/invoiceService';
import userService from '../services/userService';

const readStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
        return null;
    }
};

const ProfilePage = () => {
    const { getTotalItems, getTotalPrice } = useCart();
    const navigate = useNavigate();
    const [user, setUser] = useState(readStoredUser());

    const [fullName, setFullName] = useState(user?.full_name || user?.displayName || '');
    const [phone, setPhone] = useState(user?.phone || user?.phoneNumber || '');
    const [address, setAddress] = useState(user?.address || '');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || user?.photoURL || '');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        setUser(readStoredUser());
    }, []);

    useEffect(() => {
        setFullName(user?.full_name || user?.displayName || '');
        setPhone(user?.phone || user?.phoneNumber || '');
        setAddress(user?.address || '');
        setAvatarPreview(user?.avatar || user?.photoURL || '');
    }, [user]);

    useEffect(() => {
        const loadInvoices = async () => {
            const data = await invoiceService.getAll();
            setInvoices(data || []);
        };

        loadInvoices();
    }, []);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                setError('Chỉ chấp nhận ảnh JPG, PNG, JPEG');
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const formData = new FormData();
        if (fullName !== user?.full_name) formData.append('full_name', fullName);
        if (phone !== user?.phone) formData.append('phone', phone);
        if (address !== user?.address) formData.append('address', address);
        if (avatarFile) formData.append('avatar', avatarFile);

        if ([...formData.entries()].length === 0) {
            setError('Không có thay đổi nào');
            return;
        }

        setIsLoading(true);
        try {
            const response = await userService.updateUser(user.id, formData);
            if (response.data && response.data.data) {
                const mergedUser = { ...user, ...response.data.data, role: 'admin' };
                setUser(mergedUser);
                localStorage.setItem('user', JSON.stringify(mergedUser));
                if (response.data.data.avatar) setAvatarPreview(response.data.data.avatar);
            } else {
                const mergedUser = { ...user, full_name: fullName, phone, address, role: 'admin' };
                setUser(mergedUser);
                localStorage.setItem('user', JSON.stringify(mergedUser));
            }
            setMessage('Cập nhật thành công!');
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="page-shell profile-shell">
            <section className="hero-card">
                <div>
                    <p className="eyebrow">Xin chào</p>
                    <h1>{fullName || user.email}</h1>
                    <p className="muted">Trang hợp nhất giữa profile, cart, checkout, invoice và admin.</p>
                </div>
                <div className="hero-actions">
                    <Link className="btn btn-primary" to="/cart">Mở giỏ hàng</Link>
                    <button type="button" className="btn btn-ghost" onClick={handleLogout}>Đăng xuất</button>
                </div>
            </section>

            <div className="profile-grid">
                <section className="panel profile-panel">
                    <div className="panel__header">
                        <h2>Thông tin cá nhân</h2>
                        <span className="badge">{user.role || 'admin'}</span>
                    </div>

                    <div style={styles.avatarSection}>
                        <img src={avatarPreview || '/default-avatar.png'} alt="avatar" style={styles.avatar} />
                        <label style={styles.uploadLabel}>
                            📷 Chọn ảnh đại diện
                            <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleAvatarChange} hidden />
                        </label>
                    </div>

                    <form onSubmit={handleUpdate} style={styles.form}>
                        <div style={styles.field}>
                            <label>Email</label>
                            <input type="email" value={user.email} disabled style={styles.disabledInput} />
                        </div>
                        <div style={styles.field}>
                            <label>Họ tên</label>
                            <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={styles.input} />
                        </div>
                        <div style={styles.field}>
                            <label>Số điện thoại</label>
                            <input value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.input} placeholder="Chưa cập nhật" />
                        </div>
                        <div style={styles.field}>
                            <label>Địa chỉ</label>
                            <input value={address} onChange={(e) => setAddress(e.target.value)} style={styles.input} placeholder="Chưa cập nhật" />
                        </div>

                        {message && <p style={styles.success}>{message}</p>}
                        {error && <p style={styles.error}>{error}</p>}

                        <button type="submit" disabled={isLoading} style={{ ...styles.button, opacity: isLoading ? 0.7 : 1 }}>
                            {isLoading ? '⏳ Đang cập nhật...' : 'Cập nhật thông tin'}
                        </button>
                    </form>

                    <button onClick={handleLogout} style={styles.logoutBtn}>Đăng xuất</button>
                </section>

                <section className="stacked-panels">
                    <div className="stats-grid stats-grid--profile">
                        <article className="stat-card">
                            <span>Món trong giỏ</span>
                            <strong>{getTotalItems()}</strong>
                        </article>
                        <article className="stat-card">
                            <span>Tạm tính</span>
                            <strong>{getTotalPrice().toLocaleString('vi-VN')} đ</strong>
                        </article>
                        <article className="stat-card">
                            <span>Hóa đơn</span>
                            <strong>{invoices.length}</strong>
                        </article>
                    </div>

                    <section className="panel">
                        <div className="panel__header">
                            <h2>Lối tắt mua hàng</h2>
                            <span className="badge badge--soft">Cart / Checkout / Invoice</span>
                        </div>

                        <div className="quick-links-grid">
                            <Link className="quick-link-card" to="/cart">Giỏ hàng</Link>
                            <Link className="quick-link-card" to="/checkout">Thanh toán</Link>
                            <Link className="quick-link-card" to={invoices[0] ? `/invoice/${invoices[0].id}` : '/cart'}>Hóa đơn gần nhất</Link>
                            <Link className="quick-link-card" to="/admin">Giao diện admin</Link>
                        </div>
                    </section>

                    <section className="panel">
                        <div className="panel__header">
                            <h2>Admin dashboard</h2>
                            <span className="badge">Hoang style</span>
                        </div>
                        <p className="muted">Tài khoản này được xử lý như admin để bạn dùng đầy đủ CRUD, checkout, invoice và quản lý đơn.</p>
                        <button type="button" className="btn btn-primary" onClick={() => navigate('/admin')}>
                            Mở dashboard admin
                        </button>
                    </section>
                </section>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px',
    },
    card: {
        maxWidth: '550px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    },
    title: {
        color: '#003366',
        textAlign: 'center',
        marginBottom: '28px',
        fontSize: '28px',
        fontWeight: '600',
    },
    avatarSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '28px',
    },
    avatar: {
        width: '110px',
        height: '110px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid #003366',
        marginBottom: '12px',
    },
    uploadLabel: {
        backgroundColor: '#f0f0f0',
        padding: '8px 16px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        color: '#003366',
        transition: '0.2s',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontWeight: '500',
        color: '#333',
        fontSize: '14px',
    },
    input: {
        padding: '12px 14px',
        border: '1px solid #ccc',
        borderRadius: '12px',
        fontSize: '14px',
        outline: 'none',
    },
    disabledInput: {
        padding: '12px 14px',
        border: '1px solid #eee',
        borderRadius: '12px',
        fontSize: '14px',
        backgroundColor: '#f9f9f9',
        color: '#888',
    },
    button: {
        backgroundColor: '#003366',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '30px',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '8px',
    },
    logoutBtn: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '30px',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '20px',
        width: '100%',
    },
    success: {
        color: '#2e7d32',
        fontSize: '13px',
        textAlign: 'center',
    },
    error: {
        color: '#d32f2f',
        fontSize: '13px',
        textAlign: 'center',
    },
    loading: {
        textAlign: 'center',
        marginTop: '50px',
        fontSize: '18px',
    },
};

export default ProfilePage;