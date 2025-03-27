import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, BASE_URL } from '../services/api';
import axios from 'axios';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);

  // Function to check if the token exists and is valid
  const checkToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setHasValidToken(false);
      return false;
    }
    
    try {
      const response = await authApi.getProfile();
      if (response.data && response.data.status === 'success') {
        setUser(response.data.data);
        setIsAuthenticated(true);
        setHasValidToken(true);
        return true;
      } else {
        localStorage.removeItem('token');
        setHasValidToken(false);
        return false;
      }
    } catch (err) {
      console.error('Token validation error:', err);
      localStorage.removeItem('token');
      setHasValidToken(false);
      return false;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    async function initializeAuth() {
      setLoading(true);
      
      try {
        // Check localStorage for user data
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
        
        // Validate token with backend
        await checkToken();
      } catch (err) {
        console.error('Auth initialization error:', err);
        // Clear potentially invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }
    
    initializeAuth();
  }, [checkToken]);

  // Login function
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with credentials:', credentials);
      
      // Make the API call
      const response = await authApi.login(credentials);
      
      // Debug: Log the raw response to see exactly what we're getting
      console.log('Raw login response:', response);
      
      // First check if the response has a 'data' property
      if (!response) {
        throw new Error('No response received from server');
      }
      
      // Check if response contains HTML (error page) instead of JSON
      const responseData = response.data;
      
      // Fix the type checking issue - only check includes() if responseData is a string
      if (typeof responseData === 'string') {
        if (responseData.includes('<!DOCTYPE html>') || 
            responseData.includes('<html>') || 
            responseData.includes('<br />')) {
          console.error('Received HTML instead of JSON:', responseData);
          throw new Error('Invalid response format from server');
        }
      }
      
      // Check if we have a proper response structure
      if (!responseData || typeof responseData !== 'object') {
        console.error('Invalid response data type:', typeof responseData);
        throw new Error('Invalid response format from server');
      }
      
      // Check status
      if (responseData.status === 'success') {
        // Extract user and token from response
        const { token, user } = responseData.data || {};
        
        if (!token || !user) {
          console.error('Missing token or user in response:', responseData);
          throw new Error('Invalid response data: missing token or user information');
        }
        
        // Save token and user to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        setHasValidToken(true);
        
        console.log('Login successful for user:', user.name || user.email);
        return { success: true };
      } else {
        // Handle error response with status field
        const errorMessage = responseData.message || 'Login failed';
        console.error('Login failed with error message:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different error types
      let errorMessage = 'Login failed';
      
      // Error from API response
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } 
      // Error response contains HTML - only check includes() if it's a string
      else if (err.response && typeof err.response.data === 'string') {
        if (err.response.data.includes('<br />') || err.response.data.includes('<html>')) {
          console.error('Server returned HTML error:', err.response.data);
          errorMessage = 'Server error occurred. Please try again later.';
        }
      }
      // Custom error message we threw
      else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting registration with:', userData);
      
      // First, try using the regular registration endpoint
      let response;
      try {
        response = await authApi.register(userData);
      } catch (err) {
        console.error('Regular registration API failed, trying test endpoint:', err);
        
        // If regular endpoint fails, try the test endpoint
        response = await axios.post(`${BASE_URL}/api/register_test.php`, userData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      console.log('Registration response received:', response);
      
      // Check for HTML content in the response (PHP errors/warnings)
      if (typeof response.data === 'string' && 
          (response.data.includes('<br') || 
           response.data.includes('<b>Warning</b>') || 
           response.data.includes('<!DOCTYPE html>'))) {
        
        console.error('Response contains HTML/PHP warnings:', response.data);
        
        // Try to extract the JSON part from HTML response
        const jsonMatch = response.data.match(/(\{.*\})/);
        if (jsonMatch && jsonMatch[0]) {
          try {
            const jsonData = JSON.parse(jsonMatch[0]);
            console.log('Extracted JSON from HTML response:', jsonData);
            
            // Check if JSON indicates an error
            if (jsonData.status === 'error') {
              throw new Error(jsonData.message || 'Registration failed');
            }
            
            // Continue with the JSON part if it's valid
            response.data = jsonData;
          } catch (jsonError) {
            console.error('Error parsing JSON from HTML response:', jsonError);
            throw new Error('Server returned invalid response format');
          }
        } else {
          throw new Error('Server returned HTML instead of JSON');
        }
      }
      
      // Check if the response has data and status
      if (response.data && response.data.status === 'success') {
        // Some APIs return token and user directly after registration
        const { token, user } = response.data.data || {};
        
        if (token && user) {
          console.log('Registration successful with token and user data');
          
          // Save token and user to localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Update state
          setUser(user);
          setIsAuthenticated(true);
          setHasValidToken(true);
          
          return { success: true };
        } else {
          console.warn('Registration successful but missing token or user data in response');
          return { success: true };
        }
      } else {
        console.error('Registration response did not indicate success:', response.data);
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle different error types
      let errorMessage = 'Registration failed';
      
      // Error from API response
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } 
      // Custom error message we threw
      else if (err.message) {
        errorMessage = err.message;
      }
      
      // Check for specific error messages and provide user-friendly versions
      if (errorMessage.includes('Email already exists')) {
        errorMessage = 'This email address is already registered. Please try logging in instead.';
      }
      
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    // Simple client-side logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setHasValidToken(false);
    
    // Optional: notify server about logout
    authApi.logout().catch(err => console.error('Logout error:', err));
  }, []);

  // Update user function
  const updateUser = useCallback((updatedUser) => {
    // Update localStorage
    localStorage.setItem('user', JSON.stringify({
      ...user,
      ...updatedUser
    }));
    
    // Update state
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUser
    }));
  }, [user]);

  // Create the context value object
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    initialized,
    hasValidToken,
    login,
    logout,
    register,
    updateUser,
    checkToken
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
