import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { reservationApi, propertyApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import {
    CalendarDaysIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    BuildingOfficeIcon,
    CurrencyDollarIcon,
    FunnelIcon,
    ArrowPathIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
};

const STATUS_ICONS = {
    pending: ClockIcon,
    confirmed: CheckCircleIcon,
    cancelled: XCircleIcon,
    completed: CheckCircleIcon
};

export default function Reservations() {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [properties, setProperties] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('date_desc');

    useEffect(() => {
        if (user) {
            fetchReservations();
        }
    }, [user]);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await reservationApi.getAll();
            setReservations(response.data?.data || []);

            // Fetch property details for each reservation
            const propertyDetails = {};
            await Promise.all(
                reservations.map(async (reservation) => {
                    const { data: property } = await propertyApi.getById(reservation.propertyId);
                    propertyDetails[reservation.propertyId] = property;
                })
            );
            setProperties(propertyDetails);
            setError(null);
        } catch (err) {
            setError('Failed to load reservations');
            setReservations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async (reservationId) => {
        try {
            await reservationApi.cancel(reservationId);
            // Update the reservation status in the local state
            setReservations(prev =>
                prev.map(res =>
                    res.id === reservationId
                        ? { ...res, status: 'cancelled' }
                        : res
                )
            );
        } catch (err) {
            setError('Failed to cancel reservation');
        }
    };

    const filteredReservations = reservations
        .filter(reservation => {
            if (activeFilter === 'all') return true;
            return reservation.status === activeFilter;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date_asc':
                    return new Date(a.startDate) - new Date(b.startDate);
                case 'date_desc':
                    return new Date(b.startDate) - new Date(a.startDate);
                case 'price_asc':
                    return a.totalPrice - b.totalPrice;
                case 'price_desc':
                    return b.totalPrice - a.totalPrice;
                default:
                    return 0;
            }
        });

    if (!user) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-500">Please log in to view your reservations.</p>
                </div>
            </Layout>
        );
    }

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
                    <div className="loading-spinner h-12 w-12"></div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
                    <div className="text-red-500">{error}</div>
                </div>
            </Layout>
        );
    }

    if (reservations.length === 0) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            No Reservations Found
                        </h2>
                        <p className="text-gray-500 mb-6">
                            You haven't made any reservations yet.
                        </p>
                        <Link
                            to="/properties"
                            className="btn btn-primary"
                        >
                            Explore Properties
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Reservations</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Manage your property reservations
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {reservations.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900">No reservations found</h3>
                        <p className="mt-1 text-gray-500">You haven't made any reservations yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {reservations.map((reservation) => (
                            <div
                                key={reservation.id}
                                className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {reservation.property.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end space-x-4">
                                    <button className="btn btn-secondary">View Details</button>
                                    {reservation.status === 'pending' && (
                                        <button className="btn btn-primary">Cancel</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}

Reservations.propTypes = {
    reservations: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        propertyId: PropTypes.number.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        totalPrice: PropTypes.number.isRequired,
        status: PropTypes.oneOf(['pending', 'confirmed', 'cancelled']).isRequired,
        paymentMethod: PropTypes.oneOf(['cash', 'cheque', 'bank_transfer']).isRequired,
        paymentStatus: PropTypes.oneOf(['pending', 'completed', 'failed']).isRequired,
    })),
    properties: PropTypes.objectOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        type: PropTypes.oneOf(['apartment', 'bungalow']).isRequired,
    })),
}; 