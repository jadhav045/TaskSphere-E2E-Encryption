import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import encryptionService from '../utils/encryption';
import toast from 'react-hot-toast';

const AuthContext = createContext();

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

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await authAPI.getProfile();
        setUser(userData);
        setIsAuthenticated(true);
        
        // Restore encryption keys
        await encryptionService.restoreKeys();
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const register = async (name, email, password) => {
    try {
      // Generate encryption keys
      await encryptionService.generateKeyPair();
      await encryptionService.generateSymmetricKey();
      
      // Export public key to store on server
      const publicKey = await encryptionService.exportPublicKey();
      
      // Register user
      const userData = await authAPI.register({ name, email, password, publicKey });
      
      // Store keys locally
      await encryptionService.storeKeys(password);
      
      setUser(userData);
      setIsAuthenticated(true);
      toast.success('Registration successful!');
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userData = await authAPI.login({ email, password });
      setUser(userData);
      setIsAuthenticated(true);
      
      // Restore encryption keys
      const keysRestored = await encryptionService.restoreKeys();
      
      if (!keysRestored) {
        // Keys not found - might be first login on this device
        // Generate new keys
        await encryptionService.generateKeyPair();
        await encryptionService.generateSymmetricKey();
        const publicKey = await encryptionService.storeKeys(password);
        
        // Update public key on server
        await authAPI.updatePublicKey(publicKey);
      }
      
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    encryptionService.clearKeys();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};