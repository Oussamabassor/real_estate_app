import PropTypes from 'prop-types';

export const PropertyShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['apartment', 'bungalow']).isRequired,
    location: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    area: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    amenities: PropTypes.arrayOf(PropTypes.string).isRequired,
    available: PropTypes.bool.isRequired,
    floor: PropTypes.number,
    totalFloors: PropTypes.number,
});

export const ReservationShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    propertyId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    totalPrice: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['pending', 'confirmed', 'cancelled']).isRequired,
    paymentMethod: PropTypes.oneOf(['cash', 'cheque', 'bank_transfer']).isRequired,
    paymentStatus: PropTypes.oneOf(['pending', 'completed', 'failed']).isRequired,
    discount: PropTypes.number,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    updatedAt: PropTypes.instanceOf(Date).isRequired,
});

export const UserShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['user', 'admin']).isRequired,
});

export const PaymentReceiptShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    reservationId: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    paymentMethod: PropTypes.oneOf(['cash', 'cheque', 'bank_transfer']).isRequired,
    transactionId: PropTypes.string,
    status: PropTypes.oneOf(['pending', 'completed', 'failed']).isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
}); 