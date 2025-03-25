import axios from 'axios';

// Enable debug mode for development
const DEBUG_MODE = true;

// Use your PHP backend URL
export const BASE_URL = 'http://localhost:8000/api';

// Log API configuration in debug mode
if (DEBUG_MODE) {
  console.log('🔧 API Configuration:', {
    baseUrl: BASE_URL,
    environment: process.env.NODE_ENV
  });
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include the JWT token in the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (DEBUG_MODE) {
      console.log(`🔷 API Request: ${config.method.toUpperCase()} ${config.url}`, { 
        headers: config.headers,
        data: config.data,
        params: config.params
      });
    }
    
    return config;
  },
  (error) => {
    if (DEBUG_MODE) {
      console.error('❌ API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// API error handling with improved debugging
api.interceptors.response.use(
  (response) => {
    if (DEBUG_MODE) {
      console.log(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    if (DEBUG_MODE) {
      console.error('❌ API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase()
      });
    }
    
    // Don't throw the error in debug mode to prevent app crashes
    if (DEBUG_MODE && !error.config?.dontSuppressErrors) {
      console.warn('⚠️ Error suppressed in debug mode');
      return Promise.resolve({
        data: {
          status: 'error',
          message: 'API Error (suppressed in debug mode)',
          debug: {
            originalError: error.message,
            status: error.response?.status
          },
          data: null
        }
      });
    }
    
    throw error;
  }
);

// Authentication endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout')
};

// Property endpoints
export const propertyApi = {
  getAll: (params) => api.get('/properties', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  getFeatured: () => api.get('/properties/featured', { 
    // This will suppress errors for this specific request
    dontSuppressErrors: false
  }),
  search: (params) => api.get('/properties', { params })
};

// User endpoints - Now with getProfile method and debug mode handling
export const userApi = {
  getProfile: () => {
    if (DEBUG_MODE) {
      console.log('🔍 userApi.getProfile() called');
      // Return mock data in debug mode to prevent app crashes
      return Promise.resolve({
        data: {
          status: 'success',
          data: {
            id: 1,
            name: 'Debug User',
            email: 'debug@example.com',
            is_admin: true,
            is_verified: true
          }
        }
      });
    }
    return api.get('/auth/profile');
  },
  getFavorites: () => api.get('/favorites'),
  addFavorite: (propertyId) => api.post('/favorites', { property_id: propertyId }),
  removeFavorite: (propertyId) => api.delete(`/favorites/${propertyId}`)
};

// Stats endpoints
export const statsApi = {
  getAll: () => api.get('/stats')
};

export default api;
