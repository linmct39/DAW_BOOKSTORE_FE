import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './linh/DAW_BOOKSTORE_FE-dev/src/App.css';

import { CartProvider } from './linh/DAW_BOOKSTORE_FE-dev/src/context/CartContext.jsx';
import Layout from './components/Layout';

import LoginPage from './pages/Linh/LoginPage';
import SignupPage from './pages/Linh/SignupPage';
import VerifyPage from './linh/DAW_BOOKSTORE_FE-dev/src/pages/VerifyPage.jsx';
import RegisterSuccess from './linh/DAW_BOOKSTORE_FE-dev/src/pages/RegisterSuccess.jsx';
import ProfilePage from './linh/DAW_BOOKSTORE_FE-dev/src/pages/ProfilePage.jsx';
import Home from './pages/Kiet/Home';
import Search from './pages/Kiet/Search';
import BookDetail from './pages/Kiet/BookDetail';
import Cart from './hoang/DAW_BOOKSTORE_FE/src/components/cart/Cart.jsx';
import Checkout from './hoang/DAW_BOOKSTORE_FE/src/pages/Checkout.jsx';
import Invoice from './hoang/DAW_BOOKSTORE_FE/src/pages/Invoice.jsx';
import AdminDashboard from './hoang/DAW_BOOKSTORE_FE/src/pages/admin/AdminDashboard.jsx';
import BookList from './hoang/DAW_BOOKSTORE_FE/src/pages/admin/books/BookList.jsx';
import BookForm from './hoang/DAW_BOOKSTORE_FE/src/pages/admin/books/BookForm.jsx';
import CategoryList from './hoang/DAW_BOOKSTORE_FE/src/pages/admin/categories/CategoryList.jsx';
import CategoryForm from './hoang/DAW_BOOKSTORE_FE/src/pages/admin/categories/CategoryForm.jsx';
import UserList from './hoang/DAW_BOOKSTORE_FE/src/pages/admin/users/UserList.jsx';
import UserForm from './hoang/DAW_BOOKSTORE_FE/src/pages/admin/users/UserForm.jsx';
import InvoiceList from './hoang/DAW_BOOKSTORE_FE/src/pages/admin/invoices/InvoiceList.jsx';
import MainLayout from './hoang/DAW_BOOKSTORE_FE/src/layouts/MainLayout.jsx';
import AdminLayout from './hoang/DAW_BOOKSTORE_FE/src/layouts/AdminLayout.jsx';

const ProtectedRoute = ({ children }) => {
  const hasSession = Boolean(localStorage.getItem('access_token') || localStorage.getItem('user'));

  if (!hasSession) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Router>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
        <CartProvider>
          <Toaster position="top-right" richColors />
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/register-success" element={<RegisterSuccess />} />
              <Route path="/verify/:userid" element={<VerifyPage />} />

              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/search" element={<Layout><Search /></Layout>} />
              <Route path="/books/:id" element={<Layout><BookDetail /></Layout>} />

              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/invoice/:id" element={<Invoice />} />
              </Route>

              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
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

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </CartProvider>
      </GoogleOAuthProvider>
    </Router>
  );
}