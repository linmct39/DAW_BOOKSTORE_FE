import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import InvoicePage from './pages/InvoicePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import RegisterSuccess from './pages/RegisterSuccess';
import VerifyPage from './pages/VerifyPage';

const HomeRedirect = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="route-loading">Đang tải...</div>;
    }

    return <Navigate to={user ? '/profile' : '/login'} replace />;
};

function AppShell() {
    const location = useLocation();

    return (
        <div className="app-shell">
            <Navbar />
            <main className="app-main" data-route={location.pathname}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/register-success" element={<RegisterSuccess />} />
                    <Route path="/verify/:userid" element={<VerifyPage />} />

                    <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
                    <Route path="/invoice/:id" element={<PrivateRoute><InvoicePage /></PrivateRoute>} />
                    <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboardPage /></PrivateRoute>} />

                    <Route path="/" element={<HomeRedirect />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <Router>
                <AuthProvider>
                    <CartProvider>
                        <AppShell />
                    </CartProvider>
                </AuthProvider>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;