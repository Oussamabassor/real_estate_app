import axios from 'axios';

// Use your PHP backend URL
export const BASE_URL = 'http://localhost:8000';

console.log('🔧 API Configuration:', {
  baseUrl: BASE_URL
});

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
    
    console.log(`🔷 API Request: ${config.method.toUpperCase()} ${config.url}`, { 
      headers: config.headers,
      data: config.data,
      params: config.params
    });
    
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
    console.log(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
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