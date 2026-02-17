import React, { createContext, useState, useContext, useEffect } from 'react';

// Polyfill de AsyncStorage para web usando localStorage
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

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar usuario al iniciar la app
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userStr = await storage.getItem('user');
      const token = await storage.getItem('accessToken');

      if (userStr && token) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, accessToken, refreshToken) => {
    try {
      await storage.setItem('user', JSON.stringify(userData));
      await storage.setItem('accessToken', accessToken);
      await storage.setItem('refreshToken', refreshToken);

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storage.multiRemove(['user', 'accessToken', 'refreshToken']);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const updateUser = async (userData) => {
    try {
      await storage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
