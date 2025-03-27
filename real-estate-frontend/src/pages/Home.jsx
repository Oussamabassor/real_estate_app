import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import ApiConnectionTest from '../components/ApiConnectionTest'; // Import the API connection test component
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
    CheckCircleIcon
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
    // Track if we're using fallback data
    const [usingFallbackData, setUsingFallbackData] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const heroRef = useRef(null);
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    
    // Debug mode
    const DEBUG_MODE = true;
    
    useEffect(() => {
        if (DEBUG_MODE) {
            console.log('🏠 Home component mounted');
        }
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                // Set fallback stats data
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
                
                // Log detailed error info in debug mode
                if (DEBUG_MODE) {
                    console.warn('Using fallback stats data due to network error:', err);
                }
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    const filteredProperties = featuredProperties?.filter(property => {
        if (!property) return false;

        // Log the property for debugging
        console.log('Validating property:', property);

        // Basic property validation with detailed error logging
        const requiredFields = {
            id: 'number',
            title: 'string',
            description: 'string',
            price: 'number'
        };

        const isValidProperty = Object.entries(requiredFields).every(([field, type]) => {
            const value = property[field];
            const hasField = field in property;

            // Try to coerce the value to the correct type
            let hasCorrectType = false;
            if (type === 'number') {
                const num = Number(value);
                hasCorrectType = !isNaN(num);
                if (hasCorrectType) {
                    property[field] = num; // Update the value to be a number
                }
            } else {
                hasCorrectType = typeof value === type;
            }

            if (!hasField || !hasCorrectType) {
                console.warn(`Property validation failed: ${field} should be ${type}, got ${typeof value}. Value:`, value);
                return false;
            }
            return true;
        });

        // Check for either type or property_type
        const propertyType = property.type || property.property_type;
        const hasValidType = propertyType && ['apartment', 'bungalow'].includes(propertyType);
        if (!hasValidType) {
            console.warn('Property validation failed: invalid or missing type/property_type. Value:', propertyType);
            return false;
        }

        if (!isValidProperty) {
            console.warn('Invalid property data:', property);
            return false;
        }

        const matchesSearch = !searchQuery ||
            property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = propertyType === 'all' || propertyType === propertyType;

        return matchesSearch && matchesType;
    }) || [];

    console.log('Featured Properties:', featuredProperties); // Debug log
    console.log('Filtered Properties:', filteredProperties); // Debug log

    const displayedProperties = filteredProperties.slice(0, 6);

    // Render a fallback UI if things are loading or there are errors
    if (propertiesLoading) {
        if (DEBUG_MODE) console.log('⏳ Rendering loading screen');
        return <LoadingScreen />;
    }

    // Only show error page for properties error, not for stats error
    if (propertiesError) {
        if (DEBUG_MODE) {
            console.error('🔴 Properties Error detected:', propertiesError);
        }
        
        return (
            <Layout>
                <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
                            <div className="text-red-500 mb-6">
                                {propertiesError && (
                                    <div className="mb-2">
                                        <p className="font-semibold">Properties Error:</p>
                                        <p>{propertiesError}</p>
                                    </div>
                                )}
                                
                                {DEBUG_MODE && (
                                    <div className="mt-4 p-4 bg-gray-100 rounded text-left text-xs overflow-auto max-h-40">
                                        <p className="font-semibold">Debug Information:</p>
                                        <pre>{JSON.stringify({ propertiesError }, null, 2)}</pre>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    // Render the main content
    const HomeContent = () => (
        <AnimatePresence mode="wait">
            <PageTransition key="home">
                <div className="min-h-screen bg-gray-50">
                    {/* Add API Connection Test if in debug mode */}
                    {DEBUG_MODE && (
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                            <ApiConnectionTest />
                        </div>
                    )}
                    
                    {/* Show warning banner if using fallback data */}
                    {usingFallbackData && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Network connection issue. Using offline data. Some features may be limited.
                                        <button 
                                            onClick={() => window.location.reload()} 
                                            className="ml-2 font-medium underline text-yellow-700 hover:text-yellow-600"
                                        >
                                            Retry
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Enhanced Hero Section with CTA */}
                    <div className="relative min-h-screen pt-16"> {/* Added padding-top for header space */}
                        {/* Background Video/Image */}
                        <div className="absolute inset-0 top-16"> {/* Top offset for header */}
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')"
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-purple-600/80" />
                        </div>

                        {/* Hero Content */}
                        <div className="relative min-h-[calc(100vh-4rem)] flex items-center"> {/* Adjusted height */}
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    {/* Left Column - Main Content */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className="text-white space-y-8"
                                    >
                                        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                            Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-400">Perfect Home</span>
                                        </h1>
                                        <p className="text-xl text-purple-100 max-w-xl">
                                            Experience luxury living with our exclusive collection of premium properties. Let us guide you to your dream home today.
                                        </p>
                                        <div className="flex flex-wrap gap-4">
                                            <Link
                                                to="/properties"
                                                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-xl"
                                            >
                                                Browse Properties
                                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                                            </Link>
                                            <Link
                                                to="/contact"
                                                className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-xl border border-purple-400"
                                            >
                                                Contact Us
                                            </Link>
                                        </div>
                                    </motion.div>

                                    {/* Right Column - Quick Stats */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
                                    >
                                        <div className="grid grid-cols-2 gap-8">
                                            {statsData.map((stat, index) => (
                                                <motion.div
                                                    key={stat.label}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.4 + index * 0.1 }}
                                                    className="text-center"
                                                >
                                                    <stat.icon className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                                                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                                                    <div className="text-purple-200">{stat.label}</div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Scroll Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                        >
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center cursor-pointer"
                                onClick={scrollToContent}
                            >
                                <motion.div className="w-1 h-2 bg-white/50 rounded-full mt-2" />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Features Section with Enhanced Design */}
                    <div className="py-24 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <StaggerChildren>
                                <div className="text-center mb-16">
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="text-4xl font-bold text-gray-900 mb-4"
                                    >
                                        Why Choose Us
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                                    >
                                        We provide comprehensive real estate services tailored to your needs, ensuring a seamless experience from start to finish
                                    </motion.p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {features.map((feature, index) => (
                                        <StaggerItem key={index}>
                                            <motion.div
                                                whileHover={{ y: -5 }}
                                                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                                            >
                                                <feature.icon className="w-12 h-12 text-purple-500 mb-6" />
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                                <p className="text-gray-600 mb-4">{feature.description}</p>
                                                <div className="text-sm font-semibold text-purple-500">{feature.highlight}</div>
                                            </motion.div>
                                        </StaggerItem>
                                    ))}
                                </div>
                            </StaggerChildren>
                        </div>
                    </div>

                    {/* Services Section */}
                    <div className="py-24 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-4xl font-bold text-gray-900 mb-4"
                                >
                                    Our Services
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="text-xl text-gray-600 max-w-3xl mx-auto"
                                >
                                    Comprehensive real estate solutions tailored to your needs
                                </motion.p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {services.map((service, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.2 }}
                                        className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                                        <p className="text-gray-600 mb-6">{service.description}</p>
                                        <ul className="space-y-3">
                                            {service.items.map((item, itemIndex) => (
                                                <li key={itemIndex} className="flex items-center text-gray-700">
                                                    <CheckCircleIcon className="w-5 h-5 text-purple-500 mr-3" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Featured Properties Section */}
                    {featuredProperties && featuredProperties.length > 0 && (
                        <div className="py-24 bg-white">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="text-center mb-16">
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="text-4xl font-bold text-gray-900 mb-4"
                                    >
                                        Featured Properties
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                                    >
                                        Discover our handpicked selection of premium properties
                                    </motion.p>
                                </div>

                                <PropertyGrid
                                    properties={displayedProperties}
                                    loading={false}
                                />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-center mt-12"
                                >
                                    <Link
                                        to="/properties"
                                        className="inline-flex items-center px-8 py-4 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-all duration-200 shadow-lg shadow-purple-200 hover:shadow-xl"
                                    >
                                        View All Properties
                                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    )}

                    {/* Newsletter Section */}
                    <div className="py-24 bg-purple-900">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-4">
                                            Stay Updated
                                        </h2>
                                        <p className="text-purple-100 text-lg mb-8">
                                            Subscribe to our newsletter for exclusive property updates and market insights.
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <form className="flex gap-4">
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                className="flex-1 px-6 py-4 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                                            />
                                            <button
                                                type="submit"
                                                className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-xl"
                                            >
                                                Subscribe
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </AnimatePresence>
    );

    // Return the Layout with HomeContent
    return (
        <Layout>
            <div className="home-container">
                {/* ApiConnectionTest will automatically hide itself on successful connection */}
                <ApiConnectionTest />
                
                <HomeContent />
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