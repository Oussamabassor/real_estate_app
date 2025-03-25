import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authApi, userApi } from '../services/api';

// Create auth context
const AuthContext = createContext(null);

// Debug mode
const DEBUG_MODE = true;

// Context provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (DEBUG_MODE) {
          console.log('🔍 Checking user authentication status...');
        }
        
        // Check if we have a token
        const token = localStorage.getItem('token');
        if (!token) {
          if (DEBUG_MODE) console.log('⚠️ No token found, user not authenticated');
          setLoading(false);
          return;
        }
        
        // Try to get user profile
        try {
          if (DEBUG_MODE) console.log('🔍 Fetching user profile...');
          
          // In debug mode, we can use mock data if the API isn't ready
          if (DEBUG_MODE) {
            console.log('🛠️ Using debug mode for authentication');
            setUser({
              id: 1,
              name: 'Debug User',
              email: 'debug@example.com',
              is_admin: true
            });
            setLoading(false);
            return;
          }
          
          const response = await userApi.getProfile();
          if (response.data.status === 'success') {
            setUser(response.data.data);
          } else {
            throw new Error('Failed to get profile');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Clear token if it's invalid
          localStorage.removeItem('token');
          setError('Authentication failed. Please log in again.');
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      if (DEBUG_MODE) {
        console.log('🔑 Login attempt:', credentials.email);
      }

      // For debug mode, use a mock login
      if (DEBUG_MODE) {
        console.log('🛠️ Using debug mode for login');
        localStorage.setItem('token', 'debug-token-12345');
        setUser({
          id: 1,
          name: 'Debug User',
          email: credentials.email,
          is_admin: true
        });
        return { success: true };
      }
      
      const response = await authApi.login(credentials);
      
      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        setUser(user);
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    // No need to call API endpoint for logout in this implementation
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (DEBUG_MODE) console.log('📝 Register attempt:', userData.email);
      
      // For debug mode, use a mock registration
      if (DEBUG_MODE) {
        console.log('🛠️ Using debug mode for registration');
        localStorage.setItem('token', 'debug-token-12345');
        setUser({
          id: 1,
          name: userData.name,
          email: userData.email,
          is_admin: false
        });
        return { success: true };
      }
      
      const response = await authApi.register(userData);
      
      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        setUser(user);
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      return { success: false, error: err.message };
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
    isAuthenticated: !!user
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
