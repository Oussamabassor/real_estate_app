/**
 * API Configuration
 */
const API_CONFIG = {
  // Using the correct path to our PHP backend
  BASE_URL: 'http://localhost/real-estate/real-estate-backend',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  ENDPOINTS: {
    // Auth
    LOGIN: '/api/auth/login.php',
    REGISTER: '/api/auth/register.php',
    PROFILE: '/api/auth/profile.php',
    LOGOUT: '/api/auth/logout.php',
    
    // Properties
    PROPERTIES: '/api/properties/index.php',
    FEATURED_PROPERTIES: '/api/properties/featured.php',
    
    // Reservations
    RESERVATIONS: '/api/reservations/index.php',
    
    // Users
    FAVORITES: '/api/favorites/index.php',
    
    // Stats
    STATS: '/api/stats.php'
  }
};

export default API_CONFIG;
