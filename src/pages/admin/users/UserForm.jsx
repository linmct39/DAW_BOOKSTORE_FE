import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { userService } from "../../../services/userService";

import "../books/BookList.css";

function UserForm() {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    address: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {

    if (id) {
      fetchUser(id);
    }

  }, [id]);

  // Lấy thông tin người dùng
  const fetchUser = async (userId) => {

    try {

      setLoading(true);

      const data = await userService.getById(userId);

      setFormData({
        email: data.email || "",
        password: "",
        confirmPassword: "",
        fullName: data.fullName || "",
        phone: data.phone || "",
        address: data.address || "",
        role: data.role || "customer",
      });

    } catch (err) {

      setError("Không thể tải thông tin người dùng");

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa lỗi khi nhập lại
    setError(null);
  };

  // Validate email
  const isValidEmail = (email) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate số điện thoại
  const isValidPhone = (phone) => {

    return /^(0|\+84)[0-9]{9,10}$/.test(phone);
  };

  // Gửi form
  const handleSubmit = async (e) => {

    e.preventDefault();

    // Kiểm tra email
    if (!formData.email.trim()) {

      setError("Vui lòng nhập email");

      return;
    }

    if (!isValidEmail(formData.email)) {

      setError("Email không hợp lệ");

      return;
    }

    // Kiểm tra vai trò
    if (!formData.role) {

      setError("Vui lòng chọn vai trò");

      return;
    }

    // Kiểm tra số điện thoại
    if (
      formData.phone &&
      !isValidPhone(formData.phone)
    ) {

      setError("Số điện thoại không hợp lệ");

      return;
    }

    // Kiểm tra mật khẩu khi tạo mới
    if (!id && !formData.password) {

      setError("Vui lòng nhập mật khẩu");

      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (
      formData.password &&
      formData.password.length < 6
    ) {

      setError("Mật khẩu phải có ít nhất 6 ký tự");

      return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (
      formData.password &&
      formData.password !== formData.confirmPassword
    ) {

      setError("Mật khẩu xác nhận không khớp");

      return;
    }

    try {

      setLoading(true);

      const dataToSend = {
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        role: formData.role,
      };

      // Chỉ gửi mật khẩu nếu có nhập
      if (formData.password) {
        dataToSend.password = formData.password;
      }

      if (id) {

        await userService.update(id, dataToSend);

        alert("Cập nhật người dùng thành công");

      } else {

        await userService.create(dataToSend);

        alert("Thêm người dùng thành công");
      }

      navigate("/admin/users");

    } catch (err) {

      setError("Không thể lưu người dùng");

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // Hủy thao tác
  const handleCancel = () => {

    navigate("/admin/users");
  };

  return (
    <div className="book-list-container">

      <div className="form-container">

        <h1>
          {id
            ? "Chỉnh sửa người dùng"
            : "Thêm người dùng mới"}
        </h1>

        {/* Hiển thị lỗi */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
        >

          {/* Email */}
          <div className="form-group">

            <label>Email *</label>

            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          {/* Họ tên */}
          <div className="form-group">

            <label>Họ và tên</label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />

          </div>

          {/* Số điện thoại */}
          <div className="form-group">

            <label>Số điện thoại</label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

          </div>

          {/* Địa chỉ */}
          <div className="form-group">

            <label>Địa chỉ</label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
            />

          </div>

          {/* Vai trò */}
          <div className="form-group">

            <label>Vai trò *</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">
                -- Chọn vai trò --
              </option>

              <option value="customer">
                Khách hàng
              </option>

              <option value="admin">
                Quản trị viên
              </option>
            </select>

          </div>

          {/* Mật khẩu */}
          <div className="form-group">

            <label>
              Mật khẩu {!id && "*"}
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={
                id
                  ? "Để trống nếu không muốn đổi mật khẩu"
                  : ""
              }
            />

          </div>

          {/* Xác nhận mật khẩu */}
          {formData.password && (

            <div className="form-group">

              <label>
                Xác nhận mật khẩu *
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

            </div>

          )}

          {/* Nút thao tác */}
          <div className="form-actions">

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading
                ? "Đang lưu..."
                : id
                ? "Cập nhật người dùng"
                : "Thêm người dùng"}
            </button>

            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Hủy
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default UserForm;