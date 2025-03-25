import axios from 'axios';

// Enable debug mode for development
const DEBUG_MODE = true;

// Use your PHP backend URL
export const BASE_URL = 'http://localhost:8000';

// Log API configuration in debug mode
if (DEBUG_MODE) {
  console.log('🔧 API Configuration:', {
    baseUrl: BASE_URL,
    environment: process.env.NODE_ENV
  });
}

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
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
  getFeatured: () => api.get('/properties/featured'),
  search: (params) => api.get('/properties', { params }),
  getSimilar: (id, limit = 3) => api.get(`/properties/${id}/similar`, { params: { limit } }),
  uploadImages: (id, formData) => api.post(`/properties/${id}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

// Reservation endpoints
export const reservationApi = {
  getAll: () => api.get('/reservations'),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (data) => api.post('/reservations', data),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  cancel: (id) => api.post(`/reservations/${id}/cancel`),
  checkAvailability: (propertyId, startDate, endDate) => 
    api.get(`/properties/${propertyId}/check-availability`, { 
      params: { start_date: startDate, end_date: endDate } 
    })
};

// Review endpoints
export const reviewApi = {
  getAll: (propertyId) => api.get(`/properties/${propertyId}/reviews`),
  create: (propertyId, data) => api.post(`/properties/${propertyId}/reviews`, data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`)
};

// User endpoints
export const userApi = {
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getFavorites: () => api.get('/favorites'),
  addFavorite: (propertyId) => api.post('/favorites', { property_id: propertyId }),
  removeFavorite: (propertyId) => api.delete(`/favorites/${propertyId}`),
  getReservations: () => api.get('/reservations')
};

// Stats endpoints
export const statsApi = {
  getAll: () => api.get('/stats')
};

export default api;