import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookService } from "../../../services/bookService";
import { categoryService } from "../../../services/categoryService";
import "../books/BookList.css";

function BookForm() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchCategories();

    if (id) {
      fetchBook(id);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
    }
  };

  const fetchBook = async (bookId) => {
    try {
      setLoading(true);

      const data = await bookService.getById(bookId);

      setFormData(data);
    } catch (err) {
      setError("Không thể tải thông tin sách");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (id) {
        await bookService.update(id, formData);

        alert("Cập nhật sách thành công");
      } else {
        await bookService.create(formData);

        alert("Thêm sách thành công");
      }

      navigate("/admin/books");
    } catch (err) {
      setError("Không thể lưu sách");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/books");
  };

  return (
    <div className="book-list-container">
      <div className="form-container">

        <h1>
          {id ? "Chỉnh sửa sách" : "Thêm sách mới"}
        </h1>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Tên sách *</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Tác giả</label>

            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Giá *</label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Số lượng tồn kho</label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Danh mục</label>

            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">
                Chọn danh mục
              </option>

              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                >
                  {cat.name}
                </option>
              ))}
            </select>
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
                ? "Cập nhật sách"
                : "Thêm sách"}
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

export default BookForm;