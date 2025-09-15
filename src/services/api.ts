import axios from 'axios';
import { API_CONFIG, AUTH_CONFIG } from '../config/constants';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add ngrok bypass header if using ngrok
    if (API_CONFIG.BASE_URL.includes('ngrok')) {
      config.headers['ngrok-skip-browser-warning'] = 'true';
    }
    
    // For FormData uploads, remove the default Content-Type to let browser set it properly
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.USER_KEY);
      
      // Show error message
      toast.error('Session expired. Please login again.');
      
      // Redirect to login page
      window.location.href = '/login';
      
      return Promise.reject(error);
    }
    
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }
    
    // Handle other HTTP errors
    const message = error.response?.data?.message || 'An error occurred';
    
    // Don't show toast for certain errors (let components handle them)
    const skipToastFor = [400, 422, 409]; // Bad request, validation errors, conflict
    if (!skipToastFor.includes(error.response?.status)) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
export { api };

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}