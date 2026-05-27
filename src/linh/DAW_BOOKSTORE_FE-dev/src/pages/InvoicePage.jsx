import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { invoiceService } from '../services/invoiceService';

const InvoicePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadInvoice = async () => {
            try {
                setLoading(true);
                const result = await invoiceService.getById(id);
                setInvoice(result);
            } catch (invoiceError) {
                setError('Không thể tải hóa đơn');
                console.error(invoiceError);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadInvoice();
        }
    }, [id]);

    if (loading) {
        return <div className="route-loading">Đang tải hóa đơn...</div>;
    }

    if (error) {
        return (
            <div className="empty-page">
                <h2>{error}</h2>
                <button type="button" className="btn btn-primary" onClick={() => navigate('/profile')}>
                    Về profile
                </button>
            </div>
        );
    }

    if (!invoice) {
        return <div className="route-loading">Không tìm thấy hóa đơn</div>;
    }

    return (
        <div className="page-shell">
            <section className="hero-card hero-card--compact">
                <div>
                    <p className="eyebrow">Invoice</p>
                    <h1>Hóa đơn #{invoice.id}</h1>
                    <p className="muted">Bản in hóa đơn được lưu trong localStorage để demo luồng end-to-end.</p>
                </div>
                <div className="hero-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
                        In hóa đơn
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => navigate('/profile')}>
                        Về profile
                    </button>
                </div>
            </section>

            <div className="panel invoice-panel">
                <div className="invoice-head">
                    <div>
                        <h2>DAW Bookstore</h2>
                        <p className="muted">180 Cao Lỗ, TP. HCM</p>
                    </div>
                    <span className={`status-pill status-pill--${invoice.status || 'pending'}`}>
                        {String(invoice.status || 'pending').toUpperCase()}
                    </span>
                </div>

                <div className="invoice-grid">
                    <div>
                        <h3>Khách hàng</h3>
                        <p>{invoice.customerInfo?.fullName}</p>
                        <p>{invoice.customerInfo?.email}</p>
                        <p>{invoice.customerInfo?.phone}</p>
                    </div>
                    <div>
                        <h3>Địa chỉ giao hàng</h3>
                        <p>{invoice.customerInfo?.address}</p>
                        <p>{invoice.customerInfo?.city}</p>
                    </div>
                </div>

                <div className="invoice-table">
                    {invoice.items?.map((item) => (
                        <div key={`${item.bookId}-${item.title}`} className="invoice-row">
                            <span>{item.title || `Sách #${item.bookId}`}</span>
                            <span>x{item.quantity}</span>
                            <span>{item.price.toLocaleString('vi-VN')} đ</span>
                            <strong>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</strong>
                        </div>
                    ))}
                </div>

                <div className="summary-box summary-box--invoice">
                    <div className="summary-row">
                        <span>Tạm tính</span>
                        <strong>{invoice.subtotal?.toLocaleString('vi-VN') || '0'} đ</strong>
                    </div>
                    <div className="summary-row">
                        <span>Thuế</span>
                        <strong>{invoice.tax?.toLocaleString('vi-VN') || '0'} đ</strong>
                    </div>
                    <div className="summary-row summary-row--total">
                        <span>Tổng cộng</span>
                        <strong>{invoice.totalAmount?.toLocaleString('vi-VN') || '0'} đ</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;