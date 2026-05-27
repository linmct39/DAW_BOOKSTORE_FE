import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoiceService } from "../services/invoiceService";
import "./Invoice.css";

function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
    }
  }, [id]);

  const fetchInvoice = async (invoiceId) => {
    try {
      setLoading(true);
      const data = await invoiceService.getById(invoiceId);
      setInvoice(data);
      setError(null);
    } catch (err) {
      setError("Không thể tải hóa đơn");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("Chức năng tải PDF sẽ được cập nhật sớm");
  };

  if (loading) {
    return <div className="invoice-container">Đang tải hóa đơn...</div>;
  }

  if (error) {
    return (
      <div className="invoice-container">
        <div className="alert alert-error">{error}</div>
        <button onClick={() => navigate("/")}>Về trang chủ</button>
      </div>
    );
  }

  if (!invoice) {
    return <div className="invoice-container">Không tìm thấy hóa đơn</div>;
  }

  const invoiceDate = new Date(invoice.createdAt).toLocaleDateString();
  const dueDate = new Date(
    new Date(invoice.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString();

  return (
    <div className="invoice-container">
      <div className="invoice-actions">
        <button className="btn-print" onClick={handlePrint}>
          🖨 In hóa đơn
        </button>
        <button className="btn-download" onClick={handleDownload}>
          📥 Tải PDF
        </button>
        <button className="btn-back" onClick={() => navigate("/")}>
          ← Quay lại
        </button>
      </div>

      <div className="invoice-document">
        {/* Header */}
        <div className="invoice-header">
          <div className="invoice-title">
            <h1>HÓA ĐƠN</h1>
            <p>Mã hóa đơn #{invoice.id}</p>
          </div>
          <div className="invoice-company">
            <h3>DAW Bookstore</h3>
            <p>180 Cao Lỗ</p>
            <p>Phường 4, Quận 8, TP. HCM, Việt Nam</p>
            <p>contact@dawbookstore.com</p>
          </div>
        </div>

        <div className="invoice-dates">
          <div className="date-group">
            <label>Ngày tạo:</label>
            <p>{invoiceDate}</p>
          </div>
          <div className="date-group">
            <label>Hạn thanh toán:</label>
            <p>{dueDate}</p>
          </div>
          <div className="date-group">
            <label>Trạng thái:</label>
            <p className={`status ${invoice.status}`}>
              {invoice.status.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="invoice-sections">
          <div className="section">
            <h4>Hóa đơn gửi đến:</h4>
            <p className="customer-name">{invoice.customerInfo?.fullName}</p>
            <p>{invoice.customerInfo?.address}</p>
            <p>{invoice.customerInfo?.email}</p>
            <p>{invoice.customerInfo?.phone}</p>
          </div>

          <div className="section">
            <h4>Giao đến:</h4>
            <p className="customer-name">{invoice.customerInfo?.fullName}</p>
            <p>{invoice.customerInfo?.address}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="invoice-table">
          <table>
            <thead>
              <tr>
                <th>Mô tả</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, index) => (
                <tr key={index}>
                  <td>{item.bookTitle || `Sách #${item.bookId}`}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">${item.price?.toFixed(2)}</td>
                  <td className="text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="invoice-totals">
          <div className="totals-row">
            <span>Tạm tính:</span>
            <span>${(invoice.totalAmount / 1.1).toFixed(2)}</span>
          </div>
          <div className="totals-row">
            <span>Thuế (10%):</span>
            <span>${((invoice.totalAmount / 1.1) * 0.1).toFixed(2)}</span>
          </div>
          <div className="totals-row">
            <span>Phí vận chuyển:</span>
            <span>$0.00</span>
          </div>
          <div className="totals-row total">
            <span>Tổng cộng:</span>
            <span>${invoice.totalAmount?.toFixed(2)}</span>
          </div>
        </div>

        <div className="invoice-payment">
          <h4>Phương thức thanh toán</h4>
          <p>
            {invoice.paymentMethod
              ?.replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </p>
        </div>

        {invoice.notes && (
          <div className="invoice-notes">
            <h4>Ghi chú</h4>
            <p>{invoice.notes}</p>
          </div>
        )}

        <div className="invoice-footer">
          <p>Cảm ơn bạn đã mua hàng!</p>
          <p>© 2024 DAW Bookstore. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  );
}

export default Invoice;