import React, { createContext, useContext, useEffect, useState } from 'react';
import userService from '../services/userService';

const AuthContext = createContext(null);

const normalizeAuthPayload = (responseData) => {
	const payload = responseData?.data || responseData || {};

	const userData = payload.user || payload.data || payload.result || payload.profile || payload;
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
		const token = localStorage.getItem('access_token') || localStorage.getItem('token');
		const storedUser = localStorage.getItem('user');

		if (token && storedUser) {
			try {
				const parsedUser = JSON.parse(storedUser);
				setUser({ ...parsedUser, role: parsedUser.role || 'admin' });
			} catch {
				localStorage.removeItem('access_token');
				localStorage.removeItem('token');
				localStorage.removeItem('user');
			}
		}

		setLoading(false);
	}, []);

	const login = async (email, password) => {
		const response = await userService.login({ email, password });
		const { userData, token } = normalizeAuthPayload(response.data);
		const authenticatedUser = buildAuthenticatedUser(userData, email);

		if (!authenticatedUser.email) {
			throw new Error('Phản hồi đăng nhập không hợp lệ');
		}

		if (token) {
			localStorage.setItem('access_token', token);
			localStorage.setItem('token', token);
		}
		localStorage.setItem('user', JSON.stringify(authenticatedUser));
		setUser(authenticatedUser);
		return response.data;
	};

	const loginWithGoogle = async (idToken) => {
		const response = await userService.loginWithGoogle(idToken);
		const { userData, token } = normalizeAuthPayload(response.data);
		const authenticatedUser = buildAuthenticatedUser(userData, userData?.email);

		if (!authenticatedUser.email) {
			throw new Error('Phản hồi đăng nhập Google không hợp lệ');
		}

		if (token) {
			localStorage.setItem('access_token', token);
			localStorage.setItem('token', token);
		}
		localStorage.setItem('user', JSON.stringify(authenticatedUser));
		setUser(authenticatedUser);
		return response.data;
	};

	const logout = async () => {
		localStorage.removeItem('access_token');
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setUser(null);
	};

	const updateUserInfo = (updatedData) => {
		const nextUser = { ...(user || {}), ...updatedData, role: 'admin' };
		setUser(nextUser);
		localStorage.setItem('user', JSON.stringify(nextUser));
	};

	return (
		<AuthContext.Provider value={{ user, login, loginWithGoogle, logout, updateUserInfo, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);