import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import BookManager from "./admin/BookManager";
import CategoryManager from "./admin/CategoryManager";
import UserManager from "./admin/UserManager";
import InvoiceManager from "./admin/InvoiceManager";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyPage from "./pages/VerifyPage";
import SearchPage from "./pages/SearchPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import InvoicePage from "./pages/InvoicePage";
import AdminDashboard from "./pages/AdminDashboard";
import BookDetailPage from "./pages/BookDetailPage";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/book/:id" element={<BookDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/verify/:id" element={<VerifyPage />} />

              {/* User Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices"
                element={
                  <ProtectedRoute>
                    <InvoicePage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
>

  <Route
    index
    element={<Navigate to="books" replace />}
  />

  <Route
    path="books"
    element={<BookManager />}
  />

  <Route
    path="categories"
    element={<CategoryManager />}
  />

  <Route
    path="users"
    element={<UserManager />}
  />

  <Route
    path="invoices"
    element={<InvoiceManager />}
  />

</Route>

              {/* Catch-all fallback redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
