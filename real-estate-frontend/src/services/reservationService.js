import BaseService from './base/BaseService';
import api from './config';

/**
 * @typedef {import('../types/api').Reservation} Reservation
 * @typedef {import('../types/api').ReservationCreateInput} ReservationCreateInput
 * @typedef {import('../types/api').ApiResponse} ApiResponse
 * @typedef {import('../types/api').PaginatedResponse} PaginatedResponse
 */

/**
 * Service for managing reservations
 * @extends BaseService
 */
class ReservationService extends BaseService {
    constructor() {
        super('/reservations');
    }

    /**
     * Get all reservations with pagination
     * @param {number} page - Page number
     * @param {number} perPage - Items per page
     * @returns {Promise<PaginatedResponse<Reservation>>}
     */
    async getAll(page = 1, perPage = 10) {
        try {
            const response = await api.get('/reservations', {
                params: { page, per_page: perPage }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get a reservation by ID
     * @param {number} id - Reservation ID
     * @returns {Promise<ApiResponse<Reservation>>}
     */
    async getById(id) {
        try {
            const response = await api.get(`/reservations/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Create a new reservation
     * @param {ReservationCreateInput} data - Reservation data
     * @returns {Promise<ApiResponse<Reservation>>}
     */
    async create(data) {
        try {
            const response = await api.post('/reservations', data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Update a reservation
     * @param {number} id - Reservation ID
     * @param {Partial<ReservationCreateInput>} data - Updated reservation data
     * @returns {Promise<ApiResponse<Reservation>>}
     */
    async update(id, data) {
        try {
            const response = await api.put(`/reservations/${id}`, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get user's reservations
     * @param {number} userId - User ID
     * @param {Object} [params] - Query parameters
     * @param {number} [params.page=1] - Page number
     * @param {number} [params.per_page=10] - Items per page
     * @param {string} [params.status] - Reservation status
     * @returns {Promise<import('./types').PaginatedResponse>}
     */
    async getUserReservations(userId, params = {}) {
        try {
            const response = await this.api.get(`/users/${userId}/reservations`, {
                params: {
                    page: 1,
                    per_page: 10,
                    ...params
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Cancel a reservation
     * @param {number} id - Reservation ID
     * @param {string} [reason] - Cancellation reason
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async cancel(id, reason = '') {
        try {
            const response = await this.api.post(`${this.resourcePath}/${id}/cancel`, { reason });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Check property availability
     * @param {number} propertyId - Property ID
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async checkAvailability(propertyId, startDate, endDate) {
        try {
            const response = await this.api.get(`/properties/${propertyId}/availability`, {
                params: { start_date: startDate, end_date: endDate }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get reservation summary
     * @param {number} propertyId - Property ID
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async getReservationSummary(propertyId, startDate, endDate) {
        try {
            const response = await this.api.get(`/properties/${propertyId}/reservation-summary`, {
                params: { start_date: startDate, end_date: endDate }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Update reservation status
     * @param {number} id - Reservation ID
     * @param {string} status - New status
     * @param {string} [note] - Status update note
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async updateStatus(id, status, note = '') {
        try {
            const response = await this.api.put(`${this.resourcePath}/${id}/status`, {
                status,
                note
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Handle API errors
     * @private
     * @param {Error} error - Error object
     * @returns {Error}
     */
    handleError(error) {
        if (error.response) {
            return new Error(error.response.data.message || 'An error occurred');
        } else if (error.request) {
            return new Error('No response received from server');
        } else {
            return new Error('Error setting up the request');
        }
    }
}

// Create a singleton instance
export const reservationService = new ReservationService(); 