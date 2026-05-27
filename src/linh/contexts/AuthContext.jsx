import React, { createContext, useState, useContext, useEffect } from 'react';
import userService from '../services/userService';

const AuthContext = createContext();

const normalizeAuthPayload = (responseData) => {
    const payload = responseData?.data || responseData || {};

    const userData =
        payload.user ||
        payload.data ||
        payload.result ||
        payload.profile ||
        payload;

    const token =
        payload.token ||
        payload.access_token ||
        payload.accessToken ||
        responseData?.token ||
        responseData?.access_token ||
        responseData?.accessToken ||
        null;

    return { userData, token };
};

const buildAuthenticatedUser = (userData, fallbackEmail) => {
    const baseUser = userData && typeof userData === 'object' ? userData : {};

    return {
        ...baseUser,
        email: baseUser.email || fallbackEmail,
        role: baseUser.role || 'admin',
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser({ ...parsedUser, role: parsedUser.role || 'admin' });
        }
        setLoading(false);
    }, []);

    // Đăng nhập bằng email/password
    const login = async (email, password) => {
        console.log('[AuthContext] login called with', email);
        const response = await userService.login({ email, password });
        const { userData, token } = normalizeAuthPayload(response.data);
        const adminUser = buildAuthenticatedUser(userData, email);

        if (!adminUser.email) {
            throw new Error('Phản hồi đăng nhập không hợp lệ');
        }

        if (token) {
            localStorage.setItem('access_token', token);
        }
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        return response.data;
    };

    // Đăng nhập bằng Google
    const loginWithGoogle = async (idToken) => {
        console.log('[AuthContext] loginWithGoogle called');
        const response = await userService.loginWithGoogle(idToken);
        const { userData, token } = normalizeAuthPayload(response.data);
        const adminUser = buildAuthenticatedUser(userData, userData?.email);

        if (!adminUser.email) {
            throw new Error('Phản hồi đăng nhập Google không hợp lệ');
        }

        if (token) {
            localStorage.setItem('access_token', token);
        }
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        return response.data;
    };

    // Đăng xuất
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // Cập nhật thông tin user trong context sau khi chỉnh sửa
    const updateUserInfo = (updatedData) => {
        const newUser = { ...user, ...updatedData, role: 'admin' };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider
            value={{ user, login, loginWithGoogle, logout, updateUserInfo, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
