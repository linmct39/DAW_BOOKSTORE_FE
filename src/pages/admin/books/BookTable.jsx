import React from "react";
import "./BookTable.css";

function BookTable({
  books,
  categories,
  onDelete,
  onEdit
}) {

  const formatPrice = (price) => {

    if (!price) {
      return "0đ";
    }

    return `${Number(price).toLocaleString()}đ`;
  };

  const getCategoryName = (categoryId) => {

    const category = categories.find(
      (cat) => cat.id === categoryId
    );

    return category?.name || "Không có";
  };

  return (
    <div className="table-container">

      <table className="admin-table">

        {/* Header */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Tồn kho</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>

          {books && books.length > 0 ? (

            books.map((book) => (

              <tr key={book.id}>

                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>
                  {book.author || "Không có"}
                </td>
                <td>
                  {formatPrice(book.price)}
                </td>
                <td>
                  {getCategoryName(book.categoryId)}
                </td>
                <td>
                  {book.stock || 0}
                </td>
                <td className="actions-cell">

                  <button
                    className="btn-edit"
                    onClick={() => onEdit(book.id)}
                  >
                    Sửa
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => onDelete(book.id)}
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
                Không tìm thấy sách nào
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

export default BookTable;

