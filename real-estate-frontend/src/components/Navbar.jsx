import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks';
import {
  HomeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  HeartIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin' && location.pathname === '/') {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, user, location.pathname, navigate]);
  
  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Navigation items for regular users
  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Properties', path: '/properties', icon: BuildingOfficeIcon },
  ];

  // Navigation items that require authentication (for regular users only)
  const authNavItems = [
    { name: 'Reservations', path: '/reservations', icon: CalendarIcon },
    { name: 'Favorites', path: '/favorites', icon: HeartIcon },
    { name: 'Profile', path: '/profile', icon: UserCircleIcon },
  ];
  
  // Don't render Navbar for admin users who should be using AdminNavbar
  if (isAuthenticated && user?.role === 'admin' && location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
            <span className="font-bold text-xl">LuxeStay</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 font-medium ${
                  location.pathname === item.path
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            {isAuthenticated && user?.role !== 'admin' && (
              <>
                {authNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 font-medium ${
                      location.pathname === item.path
                        ? 'text-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </>
            )}
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserCircleIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className="font-medium">{user?.name || 'User'}</span>
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
                        <p className="text-sm font-medium text-gray-900">Your Account</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                      >
                        Profile Settings
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium"
                >
                  Register
                </Link>
              </div>
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
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 py-2 bg-white border-t border-gray-100">
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center p-2 rounded-lg ${
                      location.pathname === item.path
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {isAuthenticated && user?.role !== 'admin' && (
                  <>
                    {authNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center p-2 rounded-lg ${
                          location.pathname === item.path
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center p-2 rounded-lg text-left text-gray-700 hover:bg-gray-50 w-full"
                    >
                      <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                      <span>Logout</span>
                    </button>
                  </>
                )}
                
                {!isAuthenticated && (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-white text-primary-600 border border-primary-600 px-4 py-2 rounded-lg font-medium text-center"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium text-center"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
