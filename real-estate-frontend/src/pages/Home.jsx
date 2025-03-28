import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import ApiConnectionTest from '../components/ApiConnectionTest';
import {
    HomeIcon,
    MagnifyingGlassIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    ShieldCheckIcon,
    ArrowRightIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
    PhoneIcon,
    ChevronDownIcon,
    ChartBarIcon,
    CheckCircleIcon,
    CalendarIcon,
    HeartIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import Layout from '../components/Layout';
import CTASection from '../components/CTASection';
import PropertyGrid from '../components/PropertyGrid';
import { useFeaturedProperties } from '../hooks/useProperties';
import { PageTransition, FadeIn, SlideIn, StaggerChildren, StaggerItem } from '../components/PageAnimations';
import Header from '../components/Header';
import './Home.css';

const statsData = [
    { icon: HomeIcon, label: 'Properties', value: '1,000+' },
    { icon: BuildingOfficeIcon, label: 'Cities', value: '50+' },
    { icon: UserGroupIcon, label: 'Happy Clients', value: '2,000+' },
    { icon: ChartBarIcon, label: 'Success Rate', value: '95%' }
];

const features = [
    {
        icon: HomeIcon,
        title: 'Wide Range of Properties',
        description: 'From cozy apartments to luxury villas, find the perfect property that matches your lifestyle.',
        highlight: '1000+ listings'
    },
    {
        icon: ShieldCheckIcon,
        title: 'Trusted by Thousands',
        description: 'Join our community of satisfied clients who found their dream homes through our platform.',
        highlight: '98% satisfaction'
    },
    {
        icon: UserGroupIcon,
        title: 'Expert Guidance',
        description: 'Our experienced agents will guide you through every step of your real estate journey.',
        highlight: '50+ agents'
    }
];

const services = [
    {
        title: 'Property Sales',
        description: 'Find your dream home or sell your property with our expert guidance.',
        items: ['Residential Properties', 'Commercial Spaces', 'Luxury Homes', 'Investment Properties']
    },
    {
        title: 'Property Management',
        description: 'Professional management services for property owners and investors.',
        items: ['Tenant Screening', 'Maintenance', 'Rent Collection', 'Property Marketing']
    },
    {
        title: 'Investment Advisory',
        description: 'Make informed decisions with our real estate investment expertise.',
        items: ['Market Analysis', 'ROI Calculations', 'Investment Strategy', 'Portfolio Management']
    }
];

export default function Home() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { data: featuredProperties, isLoading: propertiesLoading, error: propertiesError } = useFeaturedProperties(12);
    const [displayCount, setDisplayCount] = useState(6);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [propertyType, setPropertyType] = useState('all');
    const [stats, setStats] = useState({
        properties: 0,
        clients: 0,
        cities: 0,
        agents: 0
    });
    const [usingFallbackData, setUsingFallbackData] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setStatsLoading(true);
                setStatsError(null);
                setUsingFallbackData(false);

                const statsResponse = await api.get(import.meta.env.VITE_API_BASE_URL + '/api/stats/index.php');
                if (!statsResponse || !statsResponse.data) {
                    throw new Error('Invalid stats response format');
                }
                setStats(statsResponse.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setStats({
                    properties: 1250,
                    clients: 2845,
                    cities: 52,
                    agents: 84,
                    success_rate: 95
                });
                setUsingFallbackData(true);

                const errorMessage = err.response?.data?.message || err.message || 'An error occurred while loading stats';
                setStatsError(errorMessage);
                setApiError({
                    type: 'stats',
                    message: errorMessage,
                    details: err.response?.data || err
                });
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isAuthenticated && user?.role === 'admin') {
        return null;
    }

    return (
        <Layout>
            <div className="relative">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                        <div className="md:w-3/5">
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                                Find Your Perfect Luxury Vacation Rental
                            </h1>
                            <p className="text-xl mb-8">
                                Book exceptional properties for your next getaway with a seamless reservation experience.
                            </p>
                            <div className="space-x-4">
                                <Link
                                    to="/properties"
                                    className="btn btn-white"
                                >
                                    Browse Properties
                                </Link>
                                {isAuthenticated && user?.role !== 'admin' ? (
                                    <Link
                                        to="/reservations"
                                        className="btn btn-outline-white"
                                    >
                                        My Reservations
                                    </Link>
                                ) : !isAuthenticated && (
                                    <Link
                                        to="/register"
                                        className="btn btn-outline-white"
                                    >
                                        Sign Up Now
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {isAuthenticated && user?.role !== 'admin' && (
                    <div className="bg-white shadow-md py-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Link
                                    to="/properties"
                                    className="flex items-center p-4 border border-gray-200 rounded-lg transition-all hover:shadow-md hover:border-primary-500"
                                >
                                    <div className="rounded-full p-3 bg-primary-50 mr-4">
                                        <BuildingOfficeIcon className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Browse Properties</h3>
                                        <p className="text-sm text-gray-500">Find your next dream vacation rental</p>
                                    </div>
                                </Link>

                                <Link
                                    to="/reservations"
                                    className="flex items-center p-4 border border-gray-200 rounded-lg transition-all hover:shadow-md hover:border-primary-500"
                                >
                                    <div className="rounded-full p-3 bg-primary-50 mr-4">
                                        <CalendarIcon className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">My Reservations</h3>
                                        <p className="text-sm text-gray-500">View and manage your bookings</p>
                                    </div>
                                </Link>

                                <Link
                                    to="/favorites"
                                    className="flex items-center p-4 border border-gray-200 rounded-lg transition-all hover:shadow-md hover:border-primary-500"
                                >
                                    <div className="rounded-full p-3 bg-primary-50 mr-4">
                                        <HeartIcon className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Favorites</h3>
                                        <p className="text-sm text-gray-500">View your saved properties</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                <div className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
                            <p className="mt-4 text-xl text-gray-600">Discover our handpicked selection of stunning properties</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="bg-white rounded-lg overflow-hidden shadow-md">
                                    <div className="h-48 bg-gray-300 animate-pulse"></div>
                                    <div className="p-6">
                                        <div className="h-6 bg-gray-300 rounded animate-pulse mb-4"></div>
                                        <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                                        <div className="h-4 bg-gray-300 rounded animate-pulse mb-4 w-2/3"></div>
                                        <div className="flex justify-between items-center">
                                            <div className="h-8 bg-gray-300 rounded animate-pulse w-1/3"></div>
                                            <div className="h-8 bg-gray-300 rounded animate-pulse w-1/4"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <Link to="/properties" className="btn btn-primary">
                                View All Properties
                            </Link>
                        </div>
                    </div>
                </div>

                <CTASection
                    title={isAuthenticated ? "Ready to find your next getaway?" : "Join our community today"}
                    description={isAuthenticated ? "Browse our exclusive properties and make a reservation" : "Create an account to start booking luxury properties"}
                    buttonText={isAuthenticated ? "Browse Properties" : "Sign Up Now"}
                    buttonLink={isAuthenticated ? "/properties" : "/register"}
                />
            </div>
        </Layout>
    );
}

Home.propTypes = {
    featuredProperties: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        type: PropTypes.oneOf(['apartment', 'bungalow']).isRequired,
        bedrooms: PropTypes.number.isRequired,
        bathrooms: PropTypes.number.isRequired,
        area: PropTypes.number.isRequired,
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
        floor: PropTypes.number,
    })),
};