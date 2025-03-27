import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks'; // Updated import path
import {
    HomeIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    UserCircleIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function Header({ isScrolled }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, initialized } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
    // Reset menu state on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Navigation items
    const navItems = [
        { name: 'Home', path: '/', icon: HomeIcon },
        { name: 'Properties', path: '/properties', icon: BuildingOfficeIcon },
    ];

    const authNavItems = [
        { name: 'Reservations', path: '/reservations', icon: CalendarIcon },
        { name: 'Profile', path: '/profile', icon: UserCircleIcon },
    ];

    // Determine header class based on scroll and path
    const isHomePage = location.pathname === '/';
    const headerStyle = {
        width: '100%',
        zIndex: 9999,
        position: 'relative',  // Changed from fixed to relative since Layout handles the positioning
    };

    // Update the header classes to ensure visibility
    const headerClasses = `w-full transition-all duration-300 ${
        isScrolled || !isHomePage
        ? 'bg-white shadow-md py-2'
        : 'bg-gray-800 bg-opacity-90 backdrop-blur-md text-white py-4'
    }`;

    return (
        <header className={headerClasses} style={headerStyle}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className={`font-bold text-xl ${
                            isScrolled || !isHomePage ? 'text-purple-600' : 'text-white'
                        }`}>
                            LuxeStay
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-1 font-medium ${
                                    location.pathname === item.path
                                        ? 'text-purple-600'
                                        : isScrolled || !isHomePage
                                        ? 'text-gray-700 hover:text-purple-600'
                                        : 'text-white hover:text-purple-200'
                                } transition-colors`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        ))}

                        {isAuthenticated && initialized && authNavItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-1 font-medium ${
                                    location.pathname === item.path
                                        ? 'text-purple-600'
                                        : isScrolled || !isHomePage
                                        ? 'text-gray-700 hover:text-purple-600'
                                        : 'text-white hover:text-purple-200'
                                } transition-colors`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        ))}

                        {/* Auth buttons */}
                        {initialized && (
                            isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className={`flex items-center space-x-2 ${
                                            isScrolled || !isHomePage ? 'text-gray-700' : 'text-white'
                                        }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                            <UserCircleIcon className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <span className="font-medium">{user?.name}</span>
                                    </button>

                                    <AnimatePresence>
                                        {isProfileMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                                            >
                                                <div className="px-4 py-2 border-b border-gray-100">
                                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                                </div>
                                                <Link
                                                    to="/profile"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                                >
                                                    Profile
                                                </Link>
                                                <Link
                                                    to="/reservations"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                                >
                                                    Reservations
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                                >
                                                    Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/login"
                                        className={`font-medium ${
                                            isScrolled || !isHomePage
                                                ? 'text-gray-700 hover:text-purple-600'
                                                : 'text-white hover:text-purple-200'
                                        } transition-colors`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-700"
                    >
                        {isMenuOpen ? (
                            <XMarkIcon className="w-6 h-6" />
                        ) : (
                            <Bars3Icon className={`w-6 h-6 ${
                                isScrolled || !isHomePage ? 'text-gray-700' : 'text-white'
                            }`} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 shadow-lg"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-4">
                            <nav className="flex flex-col space-y-3">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center space-x-2 p-2 rounded-lg ${
                                            location.pathname === item.path
                                                ? 'bg-purple-50 text-purple-600'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}

                                {isAuthenticated && initialized && authNavItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center space-x-2 p-2 rounded-lg ${
                                            location.pathname === item.path
                                                ? 'bg-purple-50 text-purple-600'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                                
                                {initialized && (
                                    isAuthenticated ? (
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 p-2 rounded-lg text-left text-gray-700 hover:bg-gray-50 w-full"
                                        >
                                            <XMarkIcon className="w-5 h-5" />
                                            <span>Logout</span>
                                        </button>
                                    ) : (
                                        <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                                            <Link
                                                to="/login"
                                                className="bg-white text-purple-600 border border-purple-600 px-4 py-2 rounded-lg font-medium text-center"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/register"
                                                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium text-center"
                                            >
                                                Register
                                            </Link>
                                        </div>
                                    )
                                )}
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}