import BaseService from './base/BaseService';

/**
 * @typedef {import('../types/api').PaymentReceipt} PaymentReceipt
 * @typedef {import('../types/api').PaymentCreateInput} PaymentCreateInput
 * @typedef {import('../types/api').ApiResponse} ApiResponse
 */

/**
 * Service for managing payments
 * @extends BaseService
 */
class PaymentService extends BaseService {
    constructor() {
        super('/payments');
    }

    /**
     * Create a payment receipt
     * @param {Object} data - Payment data
     * @param {number} data.reservation_id - Reservation ID
     * @param {number} data.amount - Payment amount
     * @param {string} data.payment_method - Payment method
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async createReceipt(data) {
        try {
            const response = await this.api.post(`${this.resourcePath}/receipts`, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get a payment receipt
     * @param {number} id - Receipt ID
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async getReceipt(id) {
        try {
            const response = await this.api.get(`${this.resourcePath}/receipts/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Update payment status
     * @param {number} id - Receipt ID
     * @param {string} status - New status
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async updateStatus(id, status) {
        try {
            const response = await this.api.put(`${this.resourcePath}/receipts/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get user's payment history
     * @param {number} userId - User ID
     * @param {Object} [params] - Query parameters
     * @param {number} [params.page=1] - Page number
     * @param {number} [params.per_page=10] - Items per page
     * @param {string} [params.status] - Payment status
     * @returns {Promise<import('./types').PaginatedResponse>}
     */
    async getUserPayments(userId, params = {}) {
        try {
            const response = await this.api.get(`/users/${userId}/payments`, {
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
     * Generate payment invoice
     * @param {number} receiptId - Receipt ID
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async generateInvoice(receiptId) {
        try {
            const response = await this.api.post(`${this.resourcePath}/receipts/${receiptId}/invoice`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Process payment
     * @param {number} receiptId - Receipt ID
     * @param {Object} paymentDetails - Payment details
     * @returns {Promise<import('./types').ApiResponse>}
     */
    async processPayment(receiptId, paymentDetails) {
        try {
            const response = await this.api.post(
                `${this.resourcePath}/receipts/${receiptId}/process`,
                paymentDetails
            );
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
export const paymentService = new PaymentService(); 