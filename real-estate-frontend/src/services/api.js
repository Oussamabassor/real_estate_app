import axios from 'axios';

// Use your PHP backend URL
export const BASE_URL = 'http://localhost:8000';

// Debug mode - only show errors
const DEBUG_MODE = false; // Turn off regular debug logs
const ERROR_ONLY = true;  // Only show error logs

// Create Axios instance with custom configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Add withCredentials to properly handle CORS with credentials
  withCredentials: false
});

// Function to get the current token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token;
};

// Add request interceptor to include the JWT token in the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (ERROR_ONLY) {
      console.error('❌ API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// API error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (ERROR_ONLY) {
      console.error('❌ API Error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
      });
    }
    
    // Handle 401 errors (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Check if we're already on the login page to avoid redirect loops
      if (!window.location.href.includes('/login')) {
        console.warn('🔒 Authentication token expired or invalid.');
        
        // Clear invalid token
        localStorage.removeItem('token');
        
        // Save the current location to redirect back after login
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
      }
    }
    
    throw error;
  }
);

// Authentication endpoints - Using our new endpoints
export const authApi = {
  login: (credentials) => api.post('/api/login_new.php', credentials),
  register: (data) => api.post('/api/register.php', data),
  getProfile: () => api.get('/api/profile_new.php'),
  updateProfile: (data) => api.put('/api/profile.php', data),
  logout: () => {
    // Simple client-side logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve({ data: { status: 'success' } });
  }
};

// Property endpoints
export const propertyApi = {
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      if (params.page) queryParams.set('page', params.page);
      if (params.per_page) queryParams.set('per_page', params.per_page);
      
      // Add filter params if they have values
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && !['page', 'per_page'].includes(key)) {
          queryParams.set(key, value);
        }
      });
      
      // Use mock data instead of trying to fetch from the API that returns HTML
      console.log('Using mock data for properties');
      
      // Generate mock properties
      const mockProperties = [];
      for (let i = 1; i <= 15; i++) {
        mockProperties.push({
          id: i,
          title: `Featured Property ${i}`,
          description: 'A beautiful property with modern amenities and great location.',
          price: 500000 + (i * 100000),
          type: i % 2 === 0 ? 'apartment' : 'bungalow',
          bedrooms: 3 + (i % 3),
          bathrooms: 2 + (i % 2),
          area: 150 + (i * 25),
          images: [`https://picsum.photos/seed/${i}/600/400`],
          location: 'Premium Location',
          floor: i % 2 === 0 ? i + 1 : null,
        });
      }
      
      // Paginate mock data
      const page = params.page || 1;
      const perPage = params.per_page || 12;
      const filteredProperties = mockProperties.filter(property => {
        if (params.type && params.type !== 'all' && property.type !== params.type) {
          return false;
        }
        if (params.minPrice && property.price < Number(params.minPrice)) {
          return false;
        }
        if (params.maxPrice && property.price > Number(params.maxPrice)) {
          return false;
        }
        return true;
      });
      
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedProperties = filteredProperties.slice(start, end);
      
      return {
        data: {
          data: paginatedProperties,
          total: filteredProperties.length,
          per_page: perPage,
          current_page: page,
          last_page: Math.ceil(filteredProperties.length / perPage)
        }
      };
      
      // Uncomment this code if you want to try the actual API call again
      /*
      const url = `/api/properties${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return axios.get(url, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      */
    } catch (err) {
      console.error('Error in getAll properties:', err);
      throw err;
    }
  },
  getById: (id) => api.get(`/api/properties/index.php?id=${id}`),
  create: (data) => api.post('/api/properties/index.php', data),
  update: (id, data) => api.put(`/api/properties/index.php?id=${id}`, data),
  delete: (id) => api.delete(`/api/properties/index.php?id=${id}`),
  getFeatured: () => api.get('/api/properties/featured.php'),
  search: (params) => api.get('/api/properties/index.php', { params })
};

// User endpoints
export const userApi = {
  getProfile: () => api.get('/api/profile_new.php'),
  getFavorites: () => api.get('/api/favorites/index.php'),
  addFavorite: (propertyId) => api.post('/api/favorites/index.php', { property_id: propertyId }),
  removeFavorite: (propertyId) => api.delete(`/api/favorites/index.php?id=${propertyId}`)
};

// Reservation endpoints
export const reservationApi = {
  getAll: () => api.get('/api/reservations/index.php'),
  getById: (id) => api.get(`/api/reservations/index.php?id=${id}`),
  create: (data) => api.post('/api/reservations/index.php', data),
  update: (id, data) => api.put(`/api/reservations/index.php?id=${id}`, data),
  cancel: (id) => api.post(`/api/reservations/index.php?id=${id}&action=cancel`)
};

// Stats endpoints
export const statsApi = {
  getAll: () => api.get('/api/stats.php')
};

export default api;