/**
 * API Configuration
 */
const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api',
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
    
    // Properties
    PROPERTIES: '/properties',
    FEATURED_PROPERTIES: '/properties/featured',
    
    // Reservations
    RESERVATIONS: '/reservations',
    
    // Users
    FAVORITES: '/favorites',
    
    // Stats
    STATS: '/stats'
  }
};

export default API_CONFIG;
