import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { userService } from "../../../services/userService";

import "../books/BookList.css";

function UserList() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Lấy danh sách người dùng
  const fetchUsers = async () => {

    try {

      setLoading(true);

      const data = await userService.getAll();

      setUsers(data || []);

      setError(null);

    } catch (err) {

      setError("Không thể tải danh sách người dùng");

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // Xóa người dùng
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa người dùng này không?"
    );

    if (!confirmDelete) return;

    try {

      await userService.delete(id);

      setUsers(
        users.filter((user) => user.id !== id)
      );

      alert("Xóa người dùng thành công");

    } catch (err) {

      setError("Không thể xóa người dùng");

      console.error(err);

    }
  };

  // Chỉnh sửa người dùng
  const handleEdit = (id) => {
    navigate(`/admin/users/edit/${id}`);
  };

  // Màu vai trò
  const getRoleColor = (role) => {
    return role === "admin"
      ? "#ff6b6b"
      : "#4caf50";
  };

  // Hiển thị tên vai trò
  const getRoleText = (role) => {

    if (role === "admin") {
      return "Quản trị viên";
    }

    return "Người dùng";
  };

  return (
    <div className="book-list-container">

      {/* Header */}
      <div className="book-list-header">

        <h1>Quản lý người dùng</h1>

        <button
          className="btn-add"
          onClick={() =>
            navigate("/admin/users/create")
          }
        >
          + Thêm người dùng mới
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
          Đang tải danh sách người dùng...
        </div>

      ) : (

        <div className="table-container">

          <table className="admin-table">

            {/* Header */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Họ và tên</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>

              {users && users.length > 0 ? (

                users.map((user) => (

                  <tr key={user.id}>

                    {/* ID */}
                    <td>{user.id}</td>

                    {/* Email */}
                    <td>{user.email}</td>

                    {/* Họ tên */}
                    <td>
                      {user.fullName || "Không có"}
                    </td>

                    {/* Số điện thoại */}
                    <td>
                      {user.phone || "Không có"}
                    </td>

                    {/* Vai trò */}
                    <td>

                      <span
                        style={{
                          backgroundColor: getRoleColor(user.role),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "3px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {getRoleText(user.role)}
                      </span>

                    </td>

                    {/* Action */}
                    <td className="actions-cell">

                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(user.id)}
                      >
                        Sửa
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(user.id)}
                      >
                        Xóa
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="no-data"
                  >
                    Không tìm thấy người dùng nào
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

export default UserList;