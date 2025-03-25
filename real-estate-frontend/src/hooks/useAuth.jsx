import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authApi, userApi } from '../services/api';

// Create auth context
const AuthContext = createContext(null);

// Context provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Load user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('🔍 Checking user authentication status...');
        
        // Check if we have a token
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('⚠️ No token found, user not authenticated');
          setLoading(false);
          setInitialized(true);
          return;
        }
        
        console.log('Token found in localStorage:', token.substring(0, 15) + '...');
        
        // For demo/test purposes, auto-login with a saved user
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            console.log('Found saved user data, auto-logging in:', parsedUser.email);
            setUser(parsedUser);
            setLoading(false);
            setInitialized(true);
            return;
          } catch (e) {
            console.error('Error parsing saved user:', e);
            // Continue with API call if parsing fails
          }
        }
        
        // Try to get user profile
        try {
          console.log('🔍 Fetching user profile...');
          
          const response = await userApi.getProfile();
          console.log('Profile response:', response);
          
          if (response.data.status === 'success') {
            const userData = response.data.data;
            setUser(userData);
            // Save user data in localStorage for persistence
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            throw new Error(response.data.message || 'Failed to get profile');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Clear token if it's invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setError('Authentication failed. Please log in again.');
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchUser();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔑 Login attempt:', credentials.email);
      
      const response = await authApi.login(credentials);
      console.log('Login response:', response);
      
      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        
        // Store token and user data in localStorage for persistence
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('Token saved:', token.substring(0, 15) + '...');
        console.log('User saved:', user);
        
        setUser(user);
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed';
      
      if (err.response) {
        errorMessage = err.response.data.message || 'Login failed';
        console.log('Server error response:', err.response.data);
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Reload the page to clear any cached state
    window.location.href = '/';
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📝 Register attempt:', userData.email);
      
      const response = await authApi.register(userData);
      console.log('Register response:', response);
      
      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        
        // Store token and user data in localStorage for persistence
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = 'Registration failed';
      
      if (err.response) {
        errorMessage = err.response.data.message || 'Registration failed';
        console.log('Server error response:', err.response.data);
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    initialized
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
