import axios from 'axios';
import API_CONFIG from "../../config/api.config";

/**
 * Base service class for API operations
 */
class BaseService {
  /**
   * Constructor
   * @param {string} resourcePath - Resource path for this service
   */
  constructor(resourcePath) {
    this.resourcePath = resourcePath;
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS
    });

    // Add request interceptor to include the JWT token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Log error for debugging
        console.error('API Error:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        throw error;
      }
    );
  }
}

export default BaseService;