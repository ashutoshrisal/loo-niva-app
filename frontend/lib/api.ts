import axios from 'axios';

// Centralized API base URL.
// Set NEXT_PUBLIC_API_URL in .env.local for your environment.
// Falls back to localhost:5000 for local development.
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api';

console.log('API URL USED:', API_URL);

const api = axios.create({
  baseURL: API_URL,
});

// Attach the access token to every outgoing request.
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('loo_niva_access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Automatically refresh expired access tokens
let isRefreshing = false;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !isRefreshing
    ) {
      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = window.localStorage.getItem(
          'loo_niva_refresh_token'
        );

        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {
            refreshToken,
          }
        );

        window.localStorage.setItem(
          'loo_niva_access_token',
          data.data.accessToken
        );

        window.localStorage.setItem(
          'loo_niva_refresh_token',
          data.data.refreshToken
        );

        original.headers.Authorization = `Bearer ${data.data.accessToken}`;

        return api(original);
      } catch (e) {
        window.localStorage.removeItem('loo_niva_access_token');
        window.localStorage.removeItem('loo_niva_refresh_token');
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;