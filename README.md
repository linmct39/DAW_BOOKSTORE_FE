# Hướng Dẫn Phát Triển Hệ Thống Admin (Developer Guide)

Tài liệu này được biên soạn dành cho Lập trình viên xây dựng giao diện quản trị (Admin Dashboard) trong tệp `src/pages/AdminDashboard.tsx`. 

Toàn bộ kết nối API, cấu trúc bảo mật (Authorization Bearer Token), cơ chế chuẩn hóa dữ liệu (Normalization), và các phương thức CRUD đã được tích hợp đầy đủ. Lập trình viên chỉ cần import và gọi hàm theo các hướng dẫn chi tiết dưới đây.

---

## 📌 Tổng Quan & Vị Trí File

- **Trang Giao Diện Admin:** `src/pages/AdminDashboard.tsx`
  - Đã được dọn dẹp sạch sẽ dữ liệu demo, hoạt động như một canvas trắng (Empty Canvas) sẵn sàng để lập trình viên tự do thiết kế bố cục (Bento Grid, Drawer, Sidebar, Tabs, Modals...).
- **Đường Dẫn Các File API Services:** `src/services/`
  - `bookApi.ts` -> Quản lý Sách
  - `categoryApi.ts` -> Quản lý Danh mục (Phân loại)
  - `userApi.ts` -> Quản lý Người dùng (Users)
  - `invoiceApi.ts` -> Quản lý Hóa đơn & Đơn hàng (Invoices)

---

## 🛠️ Hướng Dẫn Gọi Chi Tiết Từng API

Tất cả các dịch vụ API đều hỗ trợ cấu trúc hoàn trả dữ liệu chuẩn hóa, tự động định dạng giữa cơ sở dữ liệu (snake_case) và phía giao diện người dùng (camelCase).

### 1. Quản Lý Sách (`bookApi`)

Dịch vụ này được sử dụng để hiển thị, lọc tìm kiếm, thêm, sửa đổi, và xóa sách.

- **Import:**
  ```typescript
  import { bookApi } from "../services/bookApi";
  ```

- **Các hàm hỗ trợ:**
  - `getBooks(params?: { search?: string; category?: string })`: Lấy danh sách sách có hỗ trợ tìm kiếm hoặc lọc theo danh mục.
  - `getBookById(id: string | number)`: Lấy chi tiết một cuốn sách theo mã ID.
  - `createBook(bookData: any)`: Thêm mới sách.
  - `updateBook(id: string | number, bookData: any)`: Cập nhật thông tin sách theo mã ID.
  - `deleteBook(id: string | number)`: Xóa sách khỏi hệ thống.

- **Ví dụ gọi thực tế trong React Component:**
  ```typescript
  import React, { useState, useEffect } from "react";
  import { bookApi } from "../services/bookApi";

  export default function MyBookManager() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Tải danh sách
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const data = await bookApi.getBooks();
        setBooks(data);
      } catch (err) {
        console.error("Lỗi khi tải sách:", err);
      } finally {
        setLoading(false);
      }
    };

    // Thêm mới sách
    const handleAddBook = async () => {
      try {
        const newBook = await bookApi.createBook({
          title: "Sách Mới Xuất Bản",
          author: "Tác Giả A",
          price: 150000,
          description: "Mô tả cuốn sách mới này...",
          imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
          categoryId: 1 // ID của Danh mục
        });
        alert("Thêm sách thành công!");
        fetchBooks(); // Tải lại danh sách
      } catch (err) {
        alert("Lỗi thêm sách!");
      }
    };

    // Xóa sách
    const handleDeleteBook = async (bookId) => {
      if (window.confirm("Bạn thực sự muốn xóa cuốn sách này?")) {
        try {
          await bookApi.deleteBook(bookId);
          fetchBooks();
        } catch (err) {
          console.error("Xóa thất bại", err);
        }
      }
    };

    useEffect(() => {
      fetchBooks();
    }, []);

    // ... code render giao diện
  }
  ```

---

### 2. Quản Lý Danh Mục / Phân Loại (`categoryApi`)

Dịch vụ này quản lý các thể loại sách hiển thị trên thanh tìm kiếm và bộ lọc trang chủ.

- **Import:**
  ```typescript
  import { categoryApi } from "../services/categoryApi";
  ```

- **Các hàm hỗ trợ:**
  - `getCategories(params?: { search?: string })`: Truy vấn danh sách danh mục có hỗ trợ lọc ký tự tìm kiếm.
  - `createCategory(categoryData: { name: string; description?: string })`: Tạo một danh mục phân loại mới.
  - `updateCategory(id: string | number, categoryData: any)`: Chỉnh sửa thông tin danh mục.
  - `deleteCategory(id: string | number)`: Xóa danh mục khởi cơ sở dữ liệu.

- **Ví dụ gọi thực tế trong React Component:**
  ```typescript
  import { categoryApi } from "../services/categoryApi";

  // Lấy danh sách danh mục
  const loadCategories = async () => {
    try {
      const list = await categoryApi.getCategories();
      console.log("Danh mục:", list); // Trả về dạng Array<{ id: string, name: string, description: string }>
    } catch (err) {
      console.error(err);
    }
  };
  ```

---

### 3. Quản Lý Người Dùng (`userApi`)

Dịch vụ kiểm tra tài khoản thành viên, tìm kiếm và phân cấp người dùng.

- **Import:**
  ```typescript
  import { userApi } from "../services/userApi";
  ```

- **Các hàm hỗ trợ:**
  - `getUsers(search?: string)`: Truy vấn danh tính tất cả thành viên trong hệ thống (hoặc tìm theo từ khóa nếu truyền đối số `search`).
  - `createUser(userData: any)`: Đăng ký tạo một tài khoản mới.
  - `updateUser(id: string | number, userData: any)`: Cập nhật thông số hồ sơ khách hàng.
  - `deleteUser(id: string | number)`: Xóa tài khoản người dùng theo ID.

- **Ví dụ gọi thực tế:**
  ```typescript
  import { userApi } from "../services/userApi";

  const loadAllUsers = async () => {
    try {
      const userList = await userApi.getUsers();
      // Mỗi người dùng gồm các thuộc tính: id, email, full_name, phone, address, role
    } catch (err) {
      console.error(err);
    }
  };
  ```

---

### 4. Quản Lý Hóa Đơn & Đơn Hàng (`invoiceApi`)

Dịch vụ giúp Admin kiểm duyệt, tra cứu hóa đơn và xử lý trạng thái đặt mua sách.

- **Import:**
  ```typescript
  import { invoiceApi } from "../services/invoiceApi";
  ```

- **Các hàm hỗ trợ:**
  - `getInvoices()`: Truy vấn toàn bộ danh sách hóa đơn đơn hàng của tất cả khách hàng (Chỉ dành cho Admin).
  - `getInvoiceById(id: string | number)`: Xem thông tin chi tiết một đơn đặt hàng cụ thể.
  - `deleteInvoice(invoiceId: string | number)`: Hủy bỏ hoặc xóa bỏ một hóa đơn khỏi cơ sở dữ liệu hệ thống.
  - `updateInvoiceStatus(id: string | number, status: string)`: Hàm cập nhật/giả lập thay đổi trạng thái hóa đơn thanh toán (Ví dụ: `"pending"`, `"processing"`, `"completed"`, `"cancelled"`).

- **Ví dụ gọi thực tế:**
  ```typescript
  import { invoiceApi } from "../services/invoiceApi";

  const loadAdminInvoices = async () => {
    try {
      const invoices = await invoiceApi.getInvoices();
      console.log("Toàn bộ hóa đơn:", invoices);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelInvoice = async (invoiceId) => {
    try {
      await invoiceApi.deleteInvoice(invoiceId);
      alert("Hủy và xóa đơn hàng thành công!");
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };
  ```

---

## 🔒 Kiểm Tra Quyền Truy Cập (Router Guards & Auth)

Bên trong trang Admin, luôn bảo vệ và chống xâm nhập trái phép bằng cách kiểm tra quyền hạn của người sử dụng thông qua `useAuth()` hook. Logic này đã được viết sẵn ở đầu file `AdminDashboard.tsx`:

```typescript
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  // Chỉ cho phép hiển thị nếu người dùng là Quản trị viên (admin)
  if (!user || user.role !== "admin") {
    return <div>Bạn cần đăng nhập bằng tài khoản Admin để truy cập trang này.</div>;
  }

  // Bắt đầu viết UI Admin của bạn ở đây...
}
```

## 🚀 Các Bước Chạy Thử Giao Diện
1. Đăng nhập bằng tài khoản có đặc quyền `admin`. Nếu chưa có, bạn có thể đăng ký tài khoản mới và gán sửa vai trò (role) thành `"admin"` trong cơ sở dữ liệu hoặc phân quyền cho tài khoản đó.
2. Nhấn vào mục quản trị trực tiếp trên thanh điều hướng hoặc truy cập đường dẫn `/admin` để kiểm nghiệm tính liên kết dữ liệu thời gian thực.
3. Sử dụng các thẻ bock, bảng biểu (table), hoặc các thư viện cài đặt sẵn để kiến thiết UI.

---
*Chúc bạn xây dựng ứng dụng thành công! Nếu cần trợ giúp thêm, hãy liên hệ bất kỳ lúc nào.*
