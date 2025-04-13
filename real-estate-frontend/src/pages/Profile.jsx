import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    PencilSquareIcon,
    KeyIcon,
    HeartIcon,
    CalendarIcon,
    ClockIcon,
    ArrowPathIcon,
    ShieldCheckIcon,
    BellIcon,
    CheckIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [favoriteProperties, setFavoriteProperties] = useState([]);
    const [recentViews, setRecentViews] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            
            // Mock data - replace with actual API calls
            const mockFavorites = [
                {
                    id: 1,
                    title: "Luxury Downtown Apartment",
                    price: 850000,
                    location: "Manhattan, New York",
                    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                    savedDate: "2023-08-15T14:30:00Z"
                },
                {
                    id: 2,
                    title: "Beachfront Villa",
                    price: 2500000,
                    location: "Malibu, California",
                    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                    savedDate: "2023-09-20T10:15:00Z"
                }
            ];
            
            const mockRecentViews = [
                {
                    id: 3,
                    title: "Modern Mountain Retreat",
                    price: 1200000,
                    location: "Aspen, Colorado",
                    image: "https://images.unsplash.com/photo-1504507926084-34cf0b939964?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                    viewedDate: "2023-10-10T16:45:00Z"
                },
                {
                    id: 4,
                    title: "Urban Loft Apartment",
                    price: 620000,
                    location: "Chicago, Illinois",
                    image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                    viewedDate: "2023-10-12T09:20:00Z"
                }
            ];
            
            // Simulate API delay
            setTimeout(() => {
                setFavoriteProperties(mockFavorites);
                setRecentViews(mockRecentViews);
                setLoading(false);
            }, 600);
        };
        
        fetchUserData();
    }, []);

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    // Tab options
    const tabs = [
        { id: 'profile', label: 'Personal Info', icon: UserCircleIcon },
        { id: 'favorites', label: 'Favorites', icon: HeartIcon },
        { id: 'activity', label: 'Recent Activity', icon: ClockIcon },
        { id: 'security', label: 'Security', icon: ShieldCheckIcon }
    ];

    return (
        <Layout>
            {/* Page Header Section */}
            <div className="relative">
                <div className="absolute inset-0 z-0">
                    <div style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        background: 'linear-gradient(to right, rgba(15,44,92,0.95), rgba(26,58,108,0.85))'
                    }}></div>
                    <img 
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80" 
                        alt="Profile Background" 
                        className="w-full h-full object-cover" 
                        style={{ opacity: 0.7 }}
                    />
                </div>
                <div className="relative z-10 container mx-auto px-4 pt-32 pb-16">
                    <div className="flex justify-center mb-6">
                        <div style={{ height: "2px", width: "48px", backgroundColor: "#c8a55b", margin: "0 auto" }}></div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <UserCircleIcon className="w-full h-full text-gray-400" />
                            )}
                        </div>
                        <h1 style={{ 
                            fontSize: "2.5rem",
                            fontWeight: "700",
                            marginTop: "0.75rem",
                            marginBottom: "0.5rem",
                            color: "#ffffff",
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                        }}>{user?.name || "User Profile"}</h1>
                        <p style={{ 
                            fontSize: "1.125rem", 
                            color: "#ffffff"
                        }}>
                            Member since {user?.createdAt ? formatDate(user.createdAt) : "2023"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Tabs Navigation */}
                        <div className="mb-8 bg-white rounded-xl shadow-md">
                            <div className="flex overflow-x-auto scrollbar-hide">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center px-6 py-4 text-sm sm:text-base font-medium whitespace-nowrap border-b-2 transition-colors ${
                                            activeTab === tab.id
                                                ? "border-blue-600 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        <tab.icon className="w-5 h-5 mr-2 flex-shrink-0" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Profile Content */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Personal Information Tab */}
                            {activeTab === 'profile' && (
                                <div className="space-y-8">
                                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
                                        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                                            <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                                                <UserCircleIcon className="h-5 w-5 mr-2 text-blue-700" />
                                                Personal Information
                                            </h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-500">Full Name</p>
                                                    <p className="font-medium text-gray-900">{user?.name || "John Doe"}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-500">Email Address</p>
                                                    <div className="flex items-center">
                                                        <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                        <p className="font-medium text-gray-900">{user?.email || "john@example.com"}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-500">Phone Number</p>
                                                    <div className="flex items-center">
                                                        <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                        <p className="font-medium text-gray-900">{user?.phone || "+1 (555) 123-4567"}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-500">Location</p>
                                                    <div className="flex items-center">
                                                        <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                        <p className="font-medium text-gray-900">{user?.location || "New York, USA"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-8">
                                                <button
                                                    style={{
                                                        backgroundColor: "#0f2c5c",
                                                        color: "#ffffff",
                                                        padding: "0.625rem 1.25rem",
                                                        borderRadius: "0.5rem",
                                                        fontWeight: "500",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    className="hover:bg-blue-700 hover:shadow-md"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5 mr-2" />
                                                    Edit Profile
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
                                        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                                            <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                                                <BellIcon className="h-5 w-5 mr-2 text-blue-700" />
                                                Preferences
                                            </h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                    <div>
                                                        <p className="font-medium text-gray-900">Email Notifications</p>
                                                        <p className="text-sm text-gray-500">Receive updates about new properties</p>
                                                    </div>
                                                    <div className="relative inline-block w-11 mr-2 align-middle">
                                                        <input type="checkbox" name="emailNotifications" id="emailNotifications" 
                                                            className="sr-only peer" defaultChecked />
                                                        <label htmlFor="emailNotifications" 
                                                            className="block h-6 w-11 rounded-full bg-gray-200 cursor-pointer peer-checked:bg-blue-600 
                                                            after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5 
                                                            after:rounded-full after:transition-all peer-checked:after:translate-x-5"></label>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                    <div>
                                                        <p className="font-medium text-gray-900">SMS Notifications</p>
                                                        <p className="text-sm text-gray-500">Receive text messages for important updates</p>
                                                    </div>
                                                    <div className="relative inline-block w-11 mr-2 align-middle">
                                                        <input type="checkbox" name="smsNotifications" id="smsNotifications" 
                                                            className="sr-only peer" />
                                                        <label htmlFor="smsNotifications" 
                                                            className="block h-6 w-11 rounded-full bg-gray-200 cursor-pointer peer-checked:bg-blue-600 
                                                            after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5 
                                                            after:rounded-full after:transition-all peer-checked:after:translate-x-5"></label>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                    <div>
                                                        <p className="font-medium text-gray-900">Newsletter</p>
                                                        <p className="text-sm text-gray-500">Receive our monthly newsletter</p>
                                                    </div>
                                                    <div className="relative inline-block w-11 mr-2 align-middle">
                                                        <input type="checkbox" name="newsletter" id="newsletter" 
                                                            className="sr-only peer" defaultChecked />
                                                        <label htmlFor="newsletter" 
                                                            className="block h-6 w-11 rounded-full bg-gray-200 cursor-pointer peer-checked:bg-blue-600 
                                                            after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5 
                                                            after:rounded-full after:transition-all peer-checked:after:translate-x-5"></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-6">
                                                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                                    Save Preferences
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {/* Favorites Tab */}
                            {activeTab === 'favorites' && (
                                <div className="space-y-6">
                                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
                                        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                                            <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                                                <HeartIcon className="h-5 w-5 mr-2 text-blue-700" />
                                                Saved Properties
                                            </h3>
                                        </div>
                                        
                                        {loading ? (
                                            <div className="p-6">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                                </div>
                                            </div>
                                        ) : favoriteProperties.length === 0 ? (
                                            <div className="p-6 text-center">
                                                <HeartIcon className="h-12 w-12 mx-auto text-gray-300" />
                                                <h3 className="mt-2 text-lg font-medium text-gray-900">No saved properties</h3>
                                                <p className="mt-1 text-gray-500">You haven't saved any properties yet.</p>
                                                <div className="mt-6">
                                                    <Link 
                                                        to="/properties"
                                                        style={{
                                                            backgroundColor: "#c8a55b",
                                                            color: "#0f2c5c",
                                                            padding: "0.625rem 1.25rem",
                                                            borderRadius: "0.5rem",
                                                            fontWeight: "500",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            transition: "all 0.3s ease"
                                                        }}
                                                        className="hover:bg-amber-400 hover:shadow-md"
                                                    >
                                                        Browse Properties
                                                        <ChevronRightIcon className="h-5 w-5 ml-1" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-200">
                                                {favoriteProperties.map((property) => (
                                                    <div key={property.id} className="p-6 flex flex-col sm:flex-row sm:items-center">
                                                        <div className="h-24 w-32 rounded-md overflow-hidden mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                                                            <img 
                                                                src={property.image} 
                                                                alt={property.title}
                                                                className="h-full w-full object-cover" 
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900 mb-1">{property.title}</h4>
                                                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                                                <MapPinIcon className="h-4 w-4 mr-1" />
                                                                {property.location}
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="font-bold text-blue-900">${property.price.toLocaleString()}</div>
                                                                <div className="text-sm text-gray-500">Saved on {formatDate(property.savedDate)}</div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 flex space-x-2">
                                                            <Link 
                                                                to={`/properties/${property.id}`}
                                                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100"
                                                            >
                                                                View
                                                            </Link>
                                                            <button className="px-3 py-1 bg-gray-50 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100">
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            )}

                            {/* Activity Tab */}
                            {activeTab === 'activity' && (
                                <div className="space-y-6">
                                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
                                        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                                            <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                                                <ClockIcon className="h-5 w-5 mr-2 text-blue-700" />
                                                Recently Viewed Properties
                                            </h3>
                                        </div>
                                        
                                        {loading ? (
                                            <div className="p-6">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                                </div>
                                            </div>
                                        ) : recentViews.length === 0 ? (
                                            <div className="p-6 text-center">
                                                <ClockIcon className="h-12 w-12 mx-auto text-gray-300" />
                                                <h3 className="mt-2 text-lg font-medium text-gray-900">No recent activity</h3>
                                                <p className="mt-1 text-gray-500">You haven't viewed any properties recently.</p>
                                                <div className="mt-6">
                                                    <Link 
                                                        to="/properties"
                                                        style={{
                                                            backgroundColor: "#c8a55b",
                                                            color: "#0f2c5c",
                                                            padding: "0.625rem 1.25rem",
                                                            borderRadius: "0.5rem",
                                                            fontWeight: "500",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            transition: "all 0.3s ease"
                                                        }}
                                                        className="hover:bg-amber-400 hover:shadow-md"
                                                    >
                                                        Explore Properties
                                                        <ChevronRightIcon className="h-5 w-5 ml-1" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-200">
                                                {recentViews.map((property) => (
                                                    <div key={property.id} className="p-6 flex flex-col sm:flex-row sm:items-center">
                                                        <div className="h-24 w-32 rounded-md overflow-hidden mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                                                            <img 
                                                                src={property.image} 
                                                                alt={property.title}
                                                                className="h-full w-full object-cover" 
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900 mb-1">{property.title}</h4>
                                                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                                                <MapPinIcon className="h-4 w-4 mr-1" />
                                                                {property.location}
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="font-bold text-blue-900">${property.price.toLocaleString()}</div>
                                                                <div className="text-sm text-gray-500">Viewed on {formatDate(property.viewedDate)}</div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                                                            <Link 
                                                                to={`/properties/${property.id}`}
                                                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100"
                                                            >
                                                                View Again
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
                                        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                                            <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                                                <ShieldCheckIcon className="h-5 w-5 mr-2 text-blue-700" />
                                                Account Security
                                            </h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-1">Password</h4>
                                                    <p className="text-sm text-gray-500 mb-3">Last updated 3 months ago</p>
                                                    <button
                                                        style={{
                                                            backgroundColor: "#0f2c5c",
                                                            color: "#ffffff",
                                                            padding: "0.5rem 1rem",
                                                            borderRadius: "0.5rem",
                                                            fontWeight: "500",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            transition: "all 0.3s ease"
                                                        }}
                                                        className="hover:bg-blue-700 hover:shadow-md"
                                                    >
                                                        <KeyIcon className="h-4 w-4 mr-2" />
                                                        Change Password
                                                    </button>
                                                </div>

                                                <div className="pt-4 border-t border-gray-200">
                                                    <h4 className="font-medium text-gray-900 mb-1">Two-Factor Authentication</h4>
                                                    <p className="text-sm text-gray-500 mb-3">Add an extra layer of security to your account</p>
                                                    <button className="px-4 py-2 border border-blue-200 rounded-lg text-blue-700 font-medium hover:bg-blue-50 transition-colors">
                                                        Setup 2FA
                                                    </button>
                                                </div>

                                                <div className="pt-4 border-t border-gray-200">
                                                    <h4 className="font-medium text-gray-900 mb-1">Active Sessions</h4>
                                                    <div className="mt-3 border border-gray-200 rounded-lg">
                                                        <div className="p-4 flex items-center justify-between">
                                                            <div>
                                                                <div className="font-medium text-gray-900">Current Session</div>
                                                                <div className="text-sm text-gray-500">Chrome on Windows • New York, USA</div>
                                                            </div>
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                <CheckIcon className="h-3.5 w-3.5 mr-1" />
                                                                Active
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-gray-200">
                                                    <button 
                                                        onClick={logout}
                                                        className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center"
                                                    >
                                                        Sign out of all devices
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}