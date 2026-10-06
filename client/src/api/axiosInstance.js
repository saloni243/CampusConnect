import axios from 'axios';
import { isTokenExpired } from '../utils/authUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token & Check Expiration
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const isAuthRoute =
      config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

    if (token) {
      if (!isAuthRoute && isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(new axios.Cancel('Session expired. Please log in again.'));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors & Authorization Failures
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const isAuthRoute =
        error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');

      // 401 Unauthorized: Invalid, missing, or expired token
      if (error.response.status === 401 && !isAuthRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
      // 403 Forbidden: Authenticated user attempting unauthorized resource access
      else if (error.response.status === 403) {
        window.dispatchEvent(new CustomEvent('auth:forbidden', {
          detail: { message: error.response.data?.message || 'Access Denied' }
        }));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
