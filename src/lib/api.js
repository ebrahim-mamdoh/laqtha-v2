/**
 * Centralized API Configuration
 * 
 * This module provides a consistent way to make API requests
 * across the application with proper base URL and headers.
 */

import axios from 'axios';

// Base API URL from environment variable
const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const API_BASE_URL = baseURL;

/**
 * Axios instance configured for API requests
 * - Uses the API base URL from environment
 * - Includes credentials for CORS
 * - Sets default headers
 */
export const apiClient = axios.create({
  baseURL: `${baseURL}/api`, // Updated to match user request requirement
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add auth token if available
 */
apiClient.interceptors.request.use(
  (config) => {
    // Check for user token (customer auth)
    const userToken = typeof window !== 'undefined'
      ? localStorage.getItem('laqtaha_token')
      : null;

    // Check for partner token
    const partnerToken = typeof window !== 'undefined'
      ? localStorage.getItem('partner_token')
      : null;

    // Use partner token if on partner routes, otherwise use user token
    const token = partnerToken || userToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (e.g., 401 unauthorized)
    if (error.response?.status === 401) {
      // Token expired or invalid - could trigger logout here
      console.warn('Unauthorized request - token may be expired');
    }
    return Promise.reject(error);
  }
);

/**
 * Helper function to build API endpoints
 * @param {string} path - The API path (e.g., '/auth/login') NO /api prefix needed if usage is consistent
 * @returns {string} - Full API URL
 */
export const getApiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Remove /api if it's already in the base URL, or handle it carefully.
  // The user asked for baseURL: `${baseURL}/api`, so endpoints should NOT have /api prefix usually.
  // But legacy code might pass /api/...
  // Let's make it robust.
  return `${baseURL}/api${cleanPath.replace(/^\/api/, '')}`;
};

/**
 * Fetch wrapper with API base URL and credentials
 * Use this for direct fetch calls that need the API base URL
 * 
 * @param {string} endpoint - API endpoint path
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('partner_token') || localStorage.getItem('laqtaha_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Include cookies for CORS
  };

  return fetch(url, config);
};

export default apiClient;
