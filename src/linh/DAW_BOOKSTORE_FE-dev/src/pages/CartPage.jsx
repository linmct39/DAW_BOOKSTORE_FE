import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cartItems, activeItems, addToCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
    const navigate = useNavigate();

    return (
        <div className="page-shell">
            <section className="hero-card hero-card--compact">
                <div>
                    <p className="eyebrow">Giỏ hàng</p>
                    <h1>Quản lý sách đã chọn trong một giao diện gọn hơn.</h1>
                    <p className="muted">Thêm sách mẫu, chỉnh số lượng và chuyển thẳng sang thanh toán.</p>
                </div>
                <div className="hero-actions">
                    <button type="button" className="btn btn-primary" onClick={() => navigate('/checkout')} disabled={!activeItems.length}>
                        Đi tới thanh toán
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={clearCart}>
                        Xoá giỏ
                    </button>
                </div>
            </section>

            <div className="grid-two">
                <section className="panel">
                    <div className="panel__header">
                        <h2>Sách mẫu</h2>
                        <span className="badge">{cartItems.length} items</span>
                    </div>
                    <div className="book-grid">
                        {cartItems.map((book) => (
                            <article key={book.id} className="book-card">
                                <img src={book.image} alt={book.title} className="book-card__image" />
                                <div className="book-card__body">
                                    <h3>{book.title}</h3>
                                    <p>{book.author}</p>
                                    <strong>{book.price.toLocaleString('vi-VN')} đ</strong>
                                    <button type="button" className="btn btn-primary btn-block" onClick={() => addToCart(book)}>
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <aside className="panel panel--sticky">
                    <div className="panel__header">
                        <h2>Đơn hiện tại</h2>
                        <span className="badge badge--soft">{getTotalItems()} món</span>
                    </div>

                    {activeItems.length === 0 ? (
                        <div className="empty-state">
                            <h3>Giỏ hàng đang trống</h3>
                            <p className="muted">Chọn một vài sách mẫu để xem trải nghiệm cart theo style hoang.</p>
                        </div>
                    ) : (
                        <div className="cart-list">
                            {activeItems.map((item) => (
                                <div key={item.id} className="cart-row">
                                    <div>
                                        <strong>{item.title}</strong>
                                        <p className="muted">{item.author}</p>
                                    </div>
                                    <div className="quantity-control">
                                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <strong>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</strong>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="summary-box">
                        <div className="summary-row">
                            <span>Tạm tính</span>
                            <strong>{getTotalPrice().toLocaleString('vi-VN')} đ</strong>
                        </div>
                        <div className="summary-row">
                            <span>Thuế 10%</span>
                            <strong>{(getTotalPrice() * 0.1).toLocaleString('vi-VN')} đ</strong>
                        </div>
                        <div className="summary-row summary-row--total">
                            <span>Tổng</span>
                            <strong>{(getTotalPrice() * 1.1).toLocaleString('vi-VN')} đ</strong>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CartPage;