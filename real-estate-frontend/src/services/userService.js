import BaseService from './base/BaseService';

/**
 * Service for managing users
 * @extends BaseService
 */
class UserService extends BaseService {
    constructor() {
        super('/users');
    }

    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async login(email, password) {
        try {
            const response = await this.api.post('/auth/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Register new user
     * @param {Object} data - User registration data
     * @param {string} data.name - User name
     * @param {string} data.email - User email
     * @param {string} data.password - User password
     * @param {string} data.password_confirmation - Password confirmation
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async register(data) {
        try {
            const response = await this.api.post('/auth/register', data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get user profile
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async getProfile() {
        try {
            const response = await this.api.get('/auth/profile');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Update user profile
     * @param {Object} data - Profile update data
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async updateProfile(data) {
        try {
            const response = await this.api.put('/auth/profile', data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Update user password
     * @param {Object} data - Password update data
     * @param {string} data.current_password - Current password
     * @param {string} data.new_password - New password
     * @param {string} data.new_password_confirmation - New password confirmation
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async updatePassword(data) {
        try {
            const response = await this.api.put('/auth/password', data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Request password reset
     * @param {string} email - User email
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async forgotPassword(email) {
        try {
            const response = await this.api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Reset password
     * @param {Object} data - Reset password data
     * @param {string} data.token - Reset token
     * @param {string} data.password - New password
     * @param {string} data.password_confirmation - Password confirmation
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async resetPassword(data) {
        try {
            const response = await this.api.post('/auth/reset-password', data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Upload profile image
     * @param {FormData} formData - Form data containing the image
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async uploadProfileImage(formData) {
        try {
            const response = await this.api.post('/auth/profile/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Logout user
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            await this.api.post('/auth/logout');
            localStorage.removeItem('token');
        } catch (error) {
            throw this.handleError(error);
        }
    }
}

// Create a singleton instance
export const userService = new UserService(); 