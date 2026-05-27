import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { invoiceService } from "../../../services/invoiceService";

import "../books/BookList.css";

function InvoiceList() {

  const [invoices, setInvoices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Lấy danh sách hóa đơn
  const fetchInvoices = async () => {

    try {

      setLoading(true);

      const data = await invoiceService.getAll();

      setInvoices(data || []);

      setError(null);

    } catch (err) {

      setError("Không thể tải danh sách hóa đơn");

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // Xóa hóa đơn
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa hóa đơn này không?"
    );

    if (!confirmDelete) return;

    try {

      await invoiceService.delete(id);

      setInvoices(
        invoices.filter((inv) => inv.id !== id)
      );

      alert("Xóa hóa đơn thành công");

    } catch (err) {

      setError("Không thể xóa hóa đơn");

      console.error(err);

    }
  };

  // Xem chi tiết hóa đơn
  const handleView = (id) => {
    navigate(`/invoice/${id}`);
  };

  // Hiển thị trạng thái hóa đơn
  const getStatusBadge = (status) => {

    const colors = {
      pending: "#fff3cd",
      completed: "#d4edda",
      cancelled: "#f8d7da",
    };

    const textColors = {
      pending: "#856404",
      completed: "#155724",
      cancelled: "#721c24",
    };

    const statusText = {
      pending: "Đang xử lý",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };

    return (
      <span
        style={{
          backgroundColor: colors[status] || "#e0e0e0",
          color: textColors[status] || "#333",
          padding: "4px 8px",
          borderRadius: "3px",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {statusText[status] || "Không xác định"}
      </span>
    );
  };

  return (
    <div className="book-list-container">

      {/* Header */}
      <div className="book-list-header">

        <h1>Quản lý hóa đơn</h1>

      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {loading ? (

        <div className="loading">
          Đang tải danh sách hóa đơn...
        </div>

      ) : (

        <div className="table-container">

          <table className="admin-table">

            {/* Header */}
            <thead>
              <tr>
                <th>Mã hóa đơn</th>
                <th>Email khách hàng</th>
                <th>Tổng tiền</th>
                <th>Phương thức thanh toán</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>

              {invoices && invoices.length > 0 ? (

                invoices.map((invoice) => (

                  <tr key={invoice.id}>

                    <td>#{invoice.id}</td>
                    <td>
                      {invoice.customerInfo?.email || "Không có"}
                    </td>
                    <td>
                      ${invoice.totalAmount?.toFixed(2) || "0.00"}
                    </td>
                    <td>
                      {invoice.paymentMethod
                        ? invoice.paymentMethod
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())
                        : "Không có"}
                    </td>
                    <td>
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td>
                      {invoice.createdAt
                        ? new Date(invoice.createdAt).toLocaleDateString("vi-VN")
                        : "Không có"}
                    </td>
                    <td className="actions-cell">

                      <button
                        className="btn-edit"
                        onClick={() => handleView(invoice.id)}
                      >
                        Xem
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(invoice.id)}
                      >
                        Xóa
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="no-data"
                  >
                    Không tìm thấy hóa đơn nào
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default InvoiceList;