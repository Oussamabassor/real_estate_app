import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { reservationApi, propertyApi } from '../services/api';
import { useAuth } from '../hooks';
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
    ExclamationTriangleIcon,
    ArrowLeftIcon
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

// Mock reservation data for when the API fails
const MOCK_RESERVATIONS = [
    {
        id: 1,
        propertyId: 1,
        property: {
            title: "Luxury Apartment in Downtown",
            images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"]
        },
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        totalPrice: 2800,
        status: 'confirmed',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'completed',
        guests: 2,
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        propertyId: 3,
        property: {
            title: "Cozy Studio Apartment",
            images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457"]
        },
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString(),
        totalPrice: 1200,
        status: 'pending',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        guests: 1,
        createdAt: new Date().toISOString()
    }
];

export default function Reservations() {
    const { user, isAuthenticated, hasValidToken } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [properties, setProperties] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorDetails, setErrorDetails] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('date_desc');
    const [useMockData, setUseMockData] = useState(false);

    // Debug mode - turn off to remove unnecessary console logs
    const DEBUG_MODE = false;

    useEffect(() => {
        // Check if we have a user and valid token
        const token = localStorage.getItem('token');
        
        // Only fetch if authenticated and valid token
        if (isAuthenticated) {
            if (hasValidToken) {
                fetchReservations(false); // Try with real API
            } else {
                // Token not validated, but user is logged in
                setError('Your session may have expired. Please log in again to access your reservations.');
                setErrorDetails({
                    title: 'Authentication Issue',
                    message: 'Your authentication token needs to be refreshed.',
                    action: 'Please log in again to continue.'
                });
                setUseMockData(true);
                fetchReservations(true); // Use mock data since token is invalid
            }
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, hasValidToken, user]);

    const fetchReservations = async (useMock = false) => {
        try {
            setLoading(true);
            
            if (useMock) {
                // Use mock data
                setTimeout(() => {
                    setReservations(MOCK_RESERVATIONS);
                    setLoading(false);
                    
                    if (!error) {
                        setError('Using demo data - API connection unavailable');
                        setErrorDetails({
                            title: 'Demo Mode',
                            message: 'Showing sample reservations since the API is unavailable.',
                            action: 'You can still explore the interface with this demo data.'
                        });
                    }
                }, 800); // Simulate API delay
                
                return;
            }
            
            // Real API call
            const response = await reservationApi.getAll();
            
            // Check if we have valid data in the response
            if (response && response.data && Array.isArray(response.data.data)) {
                const reservationsData = response.data.data;
                setReservations(reservationsData);
                
                // Fetch property details for each reservation
                if (reservationsData.length > 0) {
                    const propertyDetails = {};
                    await Promise.all(
                        reservationsData.map(async (reservation) => {
                            try {
                                if (reservation.propertyId) {
                                    const propertyResponse = await propertyApi.getById(reservation.propertyId);
                                    if (propertyResponse && propertyResponse.data) {
                                        propertyDetails[reservation.propertyId] = propertyResponse.data;
                                    }
                                }
                            } catch (propErr) {
                                // Only log significant errors
                                console.error('Failed to fetch property details');
                            }
                        })
                    );
                    setProperties(propertyDetails);
                }
                
                setError(null);
                setErrorDetails(null);
                setUseMockData(false);
            } else {
                // If no data, fall back to mock
                setUseMockData(true);
                setReservations(MOCK_RESERVATIONS);
            }
        } catch (err) {
            // Only log the essential error information
            console.error('Error fetching reservations');
            
            // Enhanced error handling to show more detail about auth errors
            if (err.response?.status === 401) {
                setError('Authentication failed. Please log in again.');
                setErrorDetails({
                    title: 'Authentication Error (401)',
                    message: 'Your session may have expired or is invalid.',
                    action: 'Please try logging out and logging in again.'
                });
                
                // Fall back to mock data for better UX
                setUseMockData(true);
                setReservations(MOCK_RESERVATIONS);
            } else {
                setError(`Failed to load reservations: ${err.message || 'Unknown error'}`);
                setErrorDetails({
                    title: `Error (${err.response?.status || 'Network Error'})`,
                    message: err.response?.data?.message || err.message,
                    action: 'Please try again later or contact support.'
                });
                
                // Fall back to mock data for better UX
                setUseMockData(true);
                setReservations(MOCK_RESERVATIONS);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async (reservationId) => {
        try {
            if (useMockData) {
                // Just update local state for mock data
                setReservations(prev =>
                    prev.map(res =>
                        res.id === reservationId
                            ? { ...res, status: 'cancelled' }
                            : res
                    )
                );
                return;
            }
            
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

    const handleLogin = () => {
        // Save the current location to redirect back after login
        localStorage.setItem('redirectAfterLogin', '/reservations');
        window.location.href = '/login';
    };
    
    const handleRefresh = () => {
        // Clear any errors and try again
        setError(null);
        setErrorDetails(null);
        fetchReservations(false); // Try with real API again
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

    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="min-h-screen flex flex-col items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        <ExclamationTriangleIcon className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
                        <p className="text-gray-600 mb-6">
                            You need to be logged in to view your reservations.
                        </p>
                        <button 
                            onClick={handleLogin}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Log In to Continue
                        </button>
                        <div className="mt-6">
                            <Link to="/" className="text-purple-600 hover:text-purple-800 inline-flex items-center">
                                <ArrowLeftIcon className="h-4 w-4 mr-1" /> Return to Home Page
                            </Link>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </Layout>
        );
    }

    // Show a notification bar if using mock data but continue to show the content
    const MockDataBanner = () => (
        useMockData && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            <strong>Demo Mode:</strong> Showing sample reservations. {errorDetails?.action}
                        </p>
                        <div className="mt-2">
                            <button 
                                onClick={handleRefresh}
                                className="text-sm font-medium text-yellow-700 hover:text-yellow-600 underline"
                            >
                                Try connecting to API
                            </button>
                            {" | "}
                            <button 
                                onClick={handleLogin}
                                className="text-sm font-medium text-yellow-700 hover:text-yellow-600 underline"
                            >
                                Log in again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );

    if (reservations.length === 0 && !useMockData) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <MockDataBanner />
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            No Reservations Found
                        </h2>
                        <p className="text-gray-500 mb-6">
                            You haven't made any reservations yet.
                        </p>
                        <Link
                            to="/properties"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
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
                <MockDataBanner />

                {filteredReservations.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900">No reservations found</h3>
                        <p className="mt-1 text-gray-500">You haven't made any reservations yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredReservations.map((reservation) => (
                            <div
                                key={reservation.id}
                                className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {reservation.property?.title || `Property #${reservation.propertyId}`}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex justify-between items-center">
                                    <div className="text-gray-700">
                                        <span className="font-medium">Total:</span> ${reservation.totalPrice}
                                    </div>
                                    <div className="flex space-x-4">
                                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">View Details</button>
                                        {reservation.status === 'pending' && (
                                            <button 
                                                onClick={() => handleCancelReservation(reservation.id)}
                                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
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