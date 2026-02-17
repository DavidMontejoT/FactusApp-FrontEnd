import axios from 'axios';
import { API_URL } from './constants';

// Polyfill de storage para web usando localStorage
const storage = {
  getItem: async (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      localStorage.setItem(key, value);
      return null;
    } catch (error) {
      console.error('Error setting item to storage:', error);
      return error;
    }
  },
  removeItem: async (key) => {
    try {
      localStorage.removeItem(key);
      return null;
    } catch (error) {
      console.error('Error removing item from storage:', error);
      return error;
    }
  },
  multiRemove: async (keys) => {
    try {
      keys.forEach(key => localStorage.removeItem(key));
      return null;
    } catch (error) {
      console.error('Error removing items from storage:', error);
      return error;
    }
  },
};

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las requests
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        const refreshToken = await storage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Guardar nuevos tokens
        await storage.setItem('accessToken', accessToken);
        await storage.setItem('refreshToken', newRefreshToken);

        // Reintentar la request original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, limpiar todos los datos y recargar para ir al login
        console.warn('Token refresh failed, clearing auth and redirecting to login');
        await storage.multiRemove(['accessToken', 'refreshToken', 'user']);
        // Recargar la página para que AuthContext detecte que no hay autenticación
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
