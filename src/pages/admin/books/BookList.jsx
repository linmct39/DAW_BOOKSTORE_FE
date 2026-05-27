import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BookTable from "./BookTable";

import { bookService } from "../../../services/bookService";
import { categoryService } from "../../../services/categoryService";

import "./BookList.css";

function BookList() {

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  // Lấy danh sách sách
  const fetchBooks = async () => {
    try {

      setLoading(true);

      const data = await bookService.getAll();

      setBooks(data || []);

      setError(null);

    } catch (err) {

      setError("Không thể tải danh sách sách");

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  const fetchCategories = async () => {
    try {

      const data = await categoryService.getAll();

      setCategories(data || []);

    } catch (err) {

      console.error("Lỗi lấy danh mục:", err);

    }
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sách này không?"
    );

    if (!confirmDelete) return;

    try {

      await bookService.delete(id);

      setBooks(
        books.filter((book) => book.id !== id)
      );

      alert("Xóa sách thành công");

    } catch (err) {

      setError("Không thể xóa sách");

      console.error(err);

    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/books/edit/${id}`);
  };

  return (
    <div className="book-list-container">

      <div className="book-list-header">

        <h1>Quản lý sách</h1>

        <button
          className="btn-add"
          onClick={() =>
            navigate("/admin/books/create")
          }
        >
          + Thêm sách mới
        </button>

      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {loading ? (

        <div className="loading">
          Đang tải danh sách sách...
        </div>

      ) : (

        <BookTable
          books={books}
          categories={categories}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

      )}

    </div>
  );
}

export default BookList;
