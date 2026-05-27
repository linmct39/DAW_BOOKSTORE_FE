import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { categoryService } from "../../../services/categoryService";

import "../books/BookList.css";

function CategoryForm() {

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {

    if (id) {
      fetchCategory(id);
    }

  }, [id]);

  // Lấy thông tin danh mục
  const fetchCategory = async (categoryId) => {

    try {

      setLoading(true);

      const data = await categoryService.getById(categoryId);

      setFormData(data);

    } catch (err) {

      setError("Không thể tải thông tin danh mục");

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // Thay đổi input
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      if (id) {

        await categoryService.update(id, formData);

        alert("Cập nhật danh mục thành công");

      } else {

        await categoryService.create(formData);

        alert("Thêm danh mục thành công");
      }

      navigate("/admin/categories");

    } catch (err) {

      setError("Không thể lưu danh mục");

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // Hủy
  const handleCancel = () => {
    navigate("/admin/categories");
  };

  return (
    <div className="book-list-container">

      <div className="form-container">

        <h1>
          {id
            ? "Chỉnh sửa danh mục"
            : "Thêm danh mục mới"}
        </h1>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Tên danh mục */}
          <div className="form-group">

            <label>Tên danh mục *</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          {/* Mô tả */}
          <div className="form-group">

            <label>Mô tả</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />

          </div>

          {/* Button */}
          <div className="form-actions">

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading
                ? "Đang lưu..."
                : id
                ? "Cập nhật danh mục"
                : "Thêm danh mục"}
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

export default CategoryForm;

