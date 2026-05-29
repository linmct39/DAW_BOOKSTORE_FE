import axios from "axios";

// 1. Auth, Profile & Invoices API Base URL (Default connects to PDF 1 production server via local proxy to bypass CORS)
const rawAuthUrl = (import.meta as any).env?.VITE_AUTH_API_URL || "/api/remote-auth";
export const AUTH_API_BASE_URL = rawAuthUrl.endsWith("/") ? rawAuthUrl : `${rawAuthUrl}/`;

// 2. Books & Categories API Base URL (Default connects to PDF 2 production server via local proxy to bypass CORS)
const rawBookUrl = (import.meta as any).env?.VITE_BOOK_API_URL || "/api/remote-books";
export const BOOK_API_BASE_URL = rawBookUrl.endsWith("/") ? rawBookUrl : `${rawBookUrl}/`;

console.log("DAW BOOKSTORE API configurations:", {
  AUTH_API_BASE_URL,
  BOOK_API_BASE_URL
});

// Create Axios Instance for Authentication & Administration
export const authApiInstance = axios.create({
  baseURL: AUTH_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create Axios Instance for Books & Categories Catalog
export const bookApiInstance = axios.create({
  baseURL: BOOK_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to dynamically add authorization tokens to any instance
const configureInterceptors = (instance: any) => {
  instance.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem("bookstore_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
};

// Configure interceptors on both instances so auth is always supported
configureInterceptors(authApiInstance);
configureInterceptors(bookApiInstance);

// Default export authApiInstance to maintain simple compatibility with existing imports
export default authApiInstance;

