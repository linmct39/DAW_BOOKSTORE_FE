import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import BookList from "./pages/admin/books/BookList";
import BookForm from "./pages/admin/books/BookForm";
import CategoryList from "./pages/admin/categories/CategoryList";
import CategoryForm from "./pages/admin/categories/CategoryForm";
import UserList from "./pages/admin/users/UserList";
import UserForm from "./pages/admin/users/UserForm";
import InvoiceList from "./pages/admin/invoices/InvoiceList";
import Checkout from "./pages/Checkout";
import Invoice from "./pages/Invoice";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";

// Guard
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>

            {/* HOME => luôn vào SHOP */}
            <Route path="/" element={<Navigate to="/cart" replace />} />

            {/* ================= SHOP ================= */}
            <Route element={<MainLayout />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/invoice/:id" element={<Invoice />} />
            </Route>

            {/* ================= ADMIN (PROTECTED) ================= */}
            <Route element={<PrivateRoute role="admin" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />

                <Route path="books" element={<BookList />} />
                <Route path="books/create" element={<BookForm />} />
                <Route path="books/edit/:id" element={<BookForm />} />

                <Route path="categories" element={<CategoryList />} />
                <Route path="categories/create" element={<CategoryForm />} />
                <Route path="categories/edit/:id" element={<CategoryForm />} />

                <Route path="users" element={<UserList />} />
                <Route path="users/create" element={<UserForm />} />
                <Route path="users/edit/:id" element={<UserForm />} />

                <Route path="invoices" element={<InvoiceList />} />
              </Route>
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/cart" replace />} />

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;