import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { invoiceService } from "../services/invoiceService";
import "./Checkout.css";

function Checkout() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "credit_card",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { fullName, email, phone, address, city } = formData;

    if (!fullName || !email || !phone || !address || !city) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return false;
    }

    if (phone.length < 9) {
      setError("Số điện thoại không hợp lệ");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setError("Bạn chưa chọn món nào");
      return;
    }

    if (!validateForm()) return;

    const confirm = window.confirm("Xác nhận đặt hàng?");
    if (!confirm) return;

    try {
      setLoading(true);

      const invoiceData = {
        userId: user?.id,
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        items: cartItems.map((item) => ({
          bookId: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: getTotalPrice(),
        tax: getTotalPrice() * 0.1,
        totalAmount: getTotalPrice() * 1.1,
        paymentMethod: formData.paymentMethod,
        status: "pending",
      };

      const res = await invoiceService.create(invoiceData);

      clearCart();
      navigate(`/invoice/${res.id}`);
    } catch (err) {
      setError("Đặt hàng thất bại");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="empty-checkout">
        <h2>Giỏ hàng trống</h2>
        <p>Bạn chưa chọn mua món nào</p>
        <button onClick={() => navigate("/cart")}>
          Quay lại giỏ hàng
        </button>
      </div>
    );
  }

  return (
    <div className="checkout">

      {/* LEFT */}
      <form className="checkout-left" onSubmit={handleSubmit}>

        <button
          type="button"
          className="btn-back"
          onClick={() => navigate("/cart")}
        >
          ← Quay lại giỏ hàng
        </button>

        <h2>Thanh toán</h2>

        {error && <p className="error">{error}</p>}

        <div className="card">
          <h3>Thông tin khách hàng</h3>

          <input
            name="fullName"
            placeholder="Họ tên *"
            value={formData.fullName}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Số điện thoại *"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setFormData({
                ...formData,
                phone: value.slice(0, 11),
              });
            }}
          />

          <input
            name="address"
            placeholder="Địa chỉ *"
            value={formData.address}
            onChange={handleChange}
          />

          <input
            name="city"
            placeholder="Thành phố *"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div className="card">
          <h3>Thanh toán</h3>

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="credit_card">Thẻ tín dụng</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Chuyển khoản</option>
          </select>
        </div>

        <button className="btn-primary" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đặt hàng"}
        </button>
      </form>

      {/* RIGHT */}
      <div className="checkout-right">

        <div className="summary card">
          <h3>Đơn hàng</h3>

          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <span>{item.title}</span>
              <span>x{item.quantity}</span>
              <span>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <hr />

          <div className="row total">
            <span>Tổng cộng</span>
            <span>
              ${(getTotalPrice() * 1.1).toFixed(2)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;