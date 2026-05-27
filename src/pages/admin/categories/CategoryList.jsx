import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { categoryService } from "../../../services/categoryService";

import "../books/BookList.css";

function CategoryList() {

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {

    try {

      setLoading(true);

      const data = await categoryService.getAll();

      setCategories(data || []);

      setError(null);

    } catch (err) {

      setError("Không thể tải danh sách danh mục");

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa danh mục này không?"
    );

    if (!confirmDelete) return;

    try {

      await categoryService.delete(id);

      setCategories(
        categories.filter((cat) => cat.id !== id)
      );

      alert("Xóa danh mục thành công");

    } catch (err) {

      setError("Không thể xóa danh mục");

      console.error(err);

    }
  };

  // Chỉnh sửa danh mục
  const handleEdit = (id) => {
    navigate(`/admin/categories/edit/${id}`);
  };

  return (
    <div className="book-list-container">

      {/* Header */}
      <div className="book-list-header">

        <h1>Quản lý danh mục</h1>

        <button
          className="btn-add"
          onClick={() =>
            navigate("/admin/categories/create")
          }
        >
          + Thêm danh mục mới
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (

        <div className="loading">
          Đang tải danh sách danh mục...
        </div>

      ) : (

        <div className="table-container">

          <table className="admin-table">

            {/* Header */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>

              {categories && categories.length > 0 ? (

                categories.map((cat) => (

                  <tr key={cat.id}>

                    {/* ID */}
                    <td>{cat.id}</td>

                    {/* Tên danh mục */}
                    <td>{cat.name}</td>

                    {/* Mô tả */}
                    <td>
                      {cat.description || "Không có"}
                    </td>

                    {/* Action */}
                    <td className="actions-cell">

                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(cat.id)}
                      >
                        Sửa
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(cat.id)}
                      >
                        Xóa
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="4"
                    className="no-data"
                  >
                    Không tìm thấy danh mục nào
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

export default CategoryList;

