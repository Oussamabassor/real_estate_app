import axios from 'axios';

// Use your PHP backend URL
export const BASE_URL = 'http://localhost:8000';

// Debug mode
const DEBUG_MODE = true;

if (DEBUG_MODE) {
  console.log('🔧 API Configuration:', {
    baseUrl: BASE_URL
  });
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Function to get the current token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  // Debug token retrieval
  if (DEBUG_MODE) {
    console.log('📥 Retrieved token:', token ? `${token.substring(0, 15)}...` : 'No token found');
  }
  return token;
};

// Add request interceptor to include the JWT token in the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (DEBUG_MODE) {
      console.log(`🔷 API Request: ${config.method.toUpperCase()} ${config.url}`, { 
        headers: {
          ...config.headers,
          Authorization: config.headers.Authorization 
            ? `${config.headers.Authorization.substring(0, 15)}...` 
            : 'Not provided',
        },
        data: config.data,
        params: config.params
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// API error handling
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
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase()
    });
    
    // Handle 401 errors (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Check if we're already on the login page to avoid redirect loops
      if (!window.location.href.includes('/login')) {
        console.warn('🔒 Authentication token expired or invalid. Redirecting to login page...');
        
        // Clear invalid token
        localStorage.removeItem('token');
        
        // Save the current location to redirect back after login
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        
        // Optional: Show a message to user
        // alert('Your session has expired. Please log in again.');
        
        // Redirect to login page
        // Uncomment this to enable automatic redirect
        // window.location.href = '/login';
      }
    }
    
    throw error;
  }
);

// Authentication endpoints
export const authApi = {
  login: (credentials) => api.post('/api/login', credentials),
  register: (data) => api.post('/api/register', data),
  getProfile: () => api.get('/api/profile'),
  updateProfile: (data) => api.put('/api/profile', data),
  logout: () => api.post('/api/logout')
};

// Property endpoints
export const propertyApi = {
  getAll: (params) => api.get('/api/properties', { params }),
  getById: (id) => api.get(`/api/properties/${id}`),
  create: (data) => api.post('/api/properties', data),
  update: (id, data) => api.put(`/api/properties/${id}`, data),
  delete: (id) => api.delete(`/api/properties/${id}`),
  getFeatured: () => api.get('/api/properties/featured'),
  search: (params) => api.get('/api/properties', { params })
};

// User endpoints
export const userApi = {
  getProfile: () => api.get('/api/profile'),
  getFavorites: () => api.get('/api/favorites'),
  addFavorite: (propertyId) => api.post('/api/favorites', { property_id: propertyId }),
  removeFavorite: (propertyId) => api.delete(`/api/favorites/${propertyId}`)
};

// Reservation endpoints
export const reservationApi = {
  getAll: () => api.get('/api/reservations'),
  getById: (id) => api.get(`/api/reservations/${id}`),
  create: (data) => api.post('/api/reservations', data),
  update: (id, data) => api.put(`/api/reservations/${id}`, data),
  cancel: (id) => api.post(`/api/reservations/${id}/cancel`)
};

// Stats endpoints
export const statsApi = {
  getAll: () => api.get('/api/stats')
};

export default api;