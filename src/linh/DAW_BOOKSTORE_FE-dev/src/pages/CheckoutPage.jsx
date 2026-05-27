import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { invoiceService } from '../services/invoiceService';

const readStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
        return null;
    }
};

const CheckoutPage = () => {
    const user = readStoredUser();
    const { cartItems, activeItems, getTotalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: user?.full_name || user?.displayName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: '',
        paymentMethod: 'credit_card',
    });

    const handleChange = (event) => {
        setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!activeItems.length) {
            setError('Giỏ hàng đang trống');
            return;
        }

        if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            setLoading(true);
            const invoiceData = {
                userId: user?.id || user?.uid,
                userName: formData.fullName,
                customerInfo: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                },
                items: cartItems
                    .filter((item) => item.quantity > 0)
                    .map((item) => ({
                        bookId: item.id,
                        title: item.title,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                subtotal: getTotalPrice(),
                tax: getTotalPrice() * 0.1,
                totalAmount: getTotalPrice() * 1.1,
                paymentMethod: formData.paymentMethod,
                status: 'pending',
            };

            const invoice = await invoiceService.create(invoiceData);
            clearCart();
            navigate(`/invoice/${invoice.id}`);
        } catch (checkoutError) {
            setError('Đặt hàng thất bại');
            console.error(checkoutError);
        } finally {
            setLoading(false);
        }
    };

    if (!activeItems.length) {
        return (
            <div className="empty-page">
                <h2>Giỏ hàng trống</h2>
                <p className="muted">Hãy quay lại cart để chọn sách trước khi thanh toán.</p>
                <button type="button" className="btn btn-primary" onClick={() => navigate('/cart')}>
                    Về giỏ hàng
                </button>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <section className="hero-card hero-card--compact">
                <div>
                    <p className="eyebrow">Checkout</p>
                    <h1>Trang thanh toán theo style hoang.</h1>
                    <p className="muted">Điền thông tin, xác nhận đơn và chuyển sang hóa đơn ngay lập tức.</p>
                </div>
            </section>

            <div className="grid-two">
                <form className="panel form-panel" onSubmit={handleSubmit}>
                    <h2>Thông tin khách hàng</h2>
                    {error && <p className="message message--error">{error}</p>}
                    <input name="fullName" placeholder="Họ tên *" value={formData.fullName} onChange={handleChange} />
                    <input name="email" placeholder="Email *" value={formData.email} onChange={handleChange} />
                    <input name="phone" placeholder="Số điện thoại *" value={formData.phone} onChange={handleChange} />
                    <input name="address" placeholder="Địa chỉ *" value={formData.address} onChange={handleChange} />
                    <input name="city" placeholder="Thành phố *" value={formData.city} onChange={handleChange} />

                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                        <option value="credit_card">Thẻ tín dụng</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank_transfer">Chuyển khoản</option>
                    </select>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                    </button>
                </form>

                <aside className="panel">
                    <h2>Đơn hàng</h2>
                    <div className="cart-list">
                        {activeItems.map((item) => (
                            <div key={item.id} className="cart-row cart-row--checkout">
                                <div>
                                    <strong>{item.title}</strong>
                                    <p className="muted">x{item.quantity}</p>
                                </div>
                                <strong>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</strong>
                            </div>
                        ))}
                    </div>
                    <div className="summary-box">
                        <div className="summary-row">
                            <span>Tạm tính</span>
                            <strong>{getTotalPrice().toLocaleString('vi-VN')} đ</strong>
                        </div>
                        <div className="summary-row">
                            <span>Thuế</span>
                            <strong>{(getTotalPrice() * 0.1).toLocaleString('vi-VN')} đ</strong>
                        </div>
                        <div className="summary-row summary-row--total">
                            <span>Thanh toán</span>
                            <strong>{(getTotalPrice() * 1.1).toLocaleString('vi-VN')} đ</strong>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CheckoutPage;