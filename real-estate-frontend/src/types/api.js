/**
 * @typedef {Object} Property
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {'apartment'|'bungalow'} type
 * @property {number} bedrooms
 * @property {number} bathrooms
 * @property {number} area
 * @property {string[]} images
 * @property {number} [floor]
 * @property {string} location
 * @property {'available'|'reserved'|'sold'} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} PropertyCreateInput
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {'apartment'|'bungalow'} type
 * @property {number} bedrooms
 * @property {number} bathrooms
 * @property {number} area
 * @property {string[]} images
 * @property {number} [floor]
 * @property {string} location
 */

/**
 * @typedef {Object} Reservation
 * @property {number} id
 * @property {number} propertyId
 * @property {number} userId
 * @property {string} startDate
 * @property {string} endDate
 * @property {'pending'|'confirmed'|'cancelled'} status
 * @property {number} totalAmount
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ReservationCreateInput
 * @property {number} propertyId
 * @property {string} startDate
 * @property {string} endDate
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {'user'|'admin'} role
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterInput
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} password_confirmation
 */

/**
 * @typedef {Object} PaymentReceipt
 * @property {number} id
 * @property {number} reservationId
 * @property {number} amount
 * @property {'pending'|'completed'|'failed'} status
 * @property {string} paymentMethod
 * @property {string} [transactionId]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} PaymentCreateInput
 * @property {number} reservationId
 * @property {number} amount
 * @property {string} paymentMethod
 */

/**
 * @typedef {Object} ApiResponse
 * @property {*} data
 * @property {string} [message]
 * @property {'success'|'error'} status
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {Array} data
 * @property {Object} meta
 * @property {number} meta.current_page
 * @property {number} meta.from
 * @property {number} meta.last_page
 * @property {number} meta.per_page
 * @property {number} meta.to
 * @property {number} meta.total
 */

export {}; 