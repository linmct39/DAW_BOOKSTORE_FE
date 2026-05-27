import axios from 'axios';

const normalizeBaseUrl = (baseUrl) => {
    if (!baseUrl) {
        return 'https://bookking000.vercel.app/api';
    }

    const trimmed = baseUrl.replace(/\/$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const axiosClient = axios.create({
    baseURL: normalizeBaseUrl(import.meta.env.VITE_USER_API),
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
