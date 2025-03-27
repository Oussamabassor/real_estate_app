import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authApi, userApi } from '../services/api';

// Debug mode
const DEBUG_MODE = true;

// Create auth context
const AuthContext = createContext(null);

// Context provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);

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
          if (DEBUG_MODE) {
            console.log('⚠️ No token found, user not authenticated');
          }
          setLoading(false);
          setInitialized(true);
          setTokenValidated(false);
          return;
        }
        
        if (DEBUG_MODE) {
          console.log('Token found in localStorage:', token.substring(0, 15) + '...');
        }
        
        // Try to get user profile to validate token
        try {
          if (DEBUG_MODE) {
            console.log('🔍 Fetching user profile to validate token...');
          }
          
          const response = await userApi.getProfile();
          
          if (DEBUG_MODE) {
            console.log('Profile response:', response);
          }
          
          if (response.data.status === 'success') {
            const userData = response.data.data;
            setUser(userData);
            setTokenValidated(true);
            
            // Save user data in localStorage for persistence
            localStorage.setItem('user', JSON.stringify(userData));
            
            if (DEBUG_MODE) {
              console.log('✅ Token validated, user authenticated:', userData.email);
            }
          } else {
            throw new Error(response.data.message || 'Failed to get profile');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          
          // Clear token if API returns 401 - token invalid/expired
          if (err.response && err.response.status === 401) {
            if (DEBUG_MODE) {
              console.log('⚠️ Token is invalid or expired, clearing authentication data');
            }
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setTokenValidated(false);
          }
          
          // Try to use saved user data for a better user experience
          // but mark token as invalid so sensitive operations will require re-auth
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              if (DEBUG_MODE) {
                console.log('Using cached user data while token is invalid:', parsedUser.email);
                console.log('⚠️ User will need to log in again for protected operations');
              }
              setUser(parsedUser);
              setTokenValidated(false);
            } catch (e) {
              console.error('Error parsing saved user:', e);
              setError('Authentication failed. Please log in again.');
            }
          } else {
            setError('Authentication failed. Please log in again.');
          }
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

  // Function to refresh the token
  const refreshToken = useCallback(async () => {
    try {
      if (DEBUG_MODE) {
        console.log('🔄 Attempting to refresh auth token...');
      }
      
      // For now, we'll just redirect to login since we don't have a refresh token endpoint
      // In a real app, you would call an endpoint like authApi.refreshToken()
      return false;
    } catch (err) {
      console.error('Token refresh error:', err);
      return false;
    }
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      if (DEBUG_MODE) {
        console.log('🔑 Login attempt:', credentials.email);
      }
      
      const response = await authApi.login(credentials);
      
      if (DEBUG_MODE) {
        console.log('Login response:', response);
      }
      
      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        
        // Store token and user data in localStorage for persistence
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        if (DEBUG_MODE) {
          console.log('Token saved:', token.substring(0, 15) + '...');
          console.log('User saved:', user);
        }
        
        setUser(user);
        setTokenValidated(true);
        
        // Check if we need to redirect after login
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 100);
        }
        
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed';
      
      if (err.response) {
        errorMessage = err.response.data.message || 'Login failed';
        if (DEBUG_MODE) {
          console.log('Server error response:', err.response.data);
        }
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    if (DEBUG_MODE) {
      console.log('Logging out user');
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTokenValidated(false);
    
    // Reload the page to clear any cached state
    window.location.href = '/';
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (DEBUG_MODE) {
        console.log('📝 Register attempt:', userData.email);
      }
      
      const response = await authApi.register(userData);
      
      if (DEBUG_MODE) {
        console.log('Register response:', response);
      }
      
      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        
        // Store token and user data in localStorage for persistence
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        setTokenValidated(true);
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = 'Registration failed';
      
      if (err.response) {
        errorMessage = err.response.data.message || 'Registration failed';
        if (DEBUG_MODE) {
          console.log('Server error response:', err.response.data);
        }
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
    refreshToken,
    isAuthenticated: !!user,
    hasValidToken: tokenValidated,
    initialized
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Create the useAuth hook but don't export it directly here
const useAuthHook = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the hook as default and named export
export default useAuthHook;

// Create a separate index.js to re-export with the correct name
