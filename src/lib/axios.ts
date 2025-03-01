// src/lib/axios.ts
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true // This is crucial for cookies to be sent
});

// Add request interceptor for authorization
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookie
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    
    // If we get a 401 Unauthorized error, clear the token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    
    const { response } = error;
    
    // Create a standardized error object
    const errorObj = {
      message: response?.data?.message || 'An unexpected error occurred',
      errors: response?.data?.errors || {},
      status: response?.status || 500
    };
    
    return Promise.reject(errorObj);
  }
);