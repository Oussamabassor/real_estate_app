/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request was successful
 * @property {string} message - Response message
 * @property {*} data - Response data
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {boolean} success - Whether the request was successful
 * @property {string} message - Response message
 * @property {Object} data - Paginated data
 * @property {Array} data.items - Array of items
 * @property {Object} data.pagination - Pagination information
 * @property {number} data.pagination.total - Total number of items
 * @property {number} data.pagination.per_page - Items per page
 * @property {number} data.pagination.current_page - Current page number
 * @property {number} data.pagination.total_pages - Total number of pages
 */

/**
 * @typedef {Object} Property
 * @property {number} id - Property ID
 * @property {string} title - Property title
 * @property {string} description - Property description
 * @property {number} price - Property price
 * @property {string} type - Property type
 * @property {number} bedrooms - Number of bedrooms
 * @property {number} bathrooms - Number of bathrooms
 * @property {number} area - Property area
 * @property {string[]} images - Array of image URLs
 * @property {number} [floor] - Floor number (optional)
 * @property {string} status - Property status
 * @property {string} created_at - Creation date
 * @property {string} updated_at - Last update date
 */

/**
 * @typedef {Object} Reservation
 * @property {number} id - Reservation ID
 * @property {number} property_id - Property ID
 * @property {number} user_id - User ID
 * @property {string} status - Reservation status
 * @property {string} start_date - Start date
 * @property {string} end_date - End date
 * @property {number} total_price - Total price
 * @property {string} created_at - Creation date
 * @property {string} updated_at - Last update date
 */

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} name - User's name
 * @property {string} email - User's email
 * @property {string} role - User's role
 * @property {string} [profile_image] - Profile image URL
 * @property {string} created_at - Creation date
 * @property {string} updated_at - Last update date
 */

/**
 * @typedef {Object} PaymentReceipt
 * @property {number} id - Receipt ID
 * @property {number} reservation_id - Reservation ID
 * @property {number} user_id - User ID
 * @property {number} amount - Payment amount
 * @property {string} status - Payment status
 * @property {string} payment_method - Payment method
 * @property {string} created_at - Creation date
 * @property {string} updated_at - Last update date
 */

export {}; 