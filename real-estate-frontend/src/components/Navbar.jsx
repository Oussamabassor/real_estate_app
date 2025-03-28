import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks';
import {
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  HeartIcon,
  CalendarIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Monitor scroll position for styling changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  // Navigation links for main menu
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Additional links for authenticated users
  const authNavItems = [
    { name: 'My Profile', path: '/profile', icon: UserCircleIcon },
    { name: 'Favorites', path: '/favorites', icon: HeartIcon },
    { name: 'Bookings', path: '/reservations', icon: CalendarIcon }
  ];
  
  // Close announcement after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnnouncement(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <header 
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' 
          : 'bg-white py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`p-1.5 rounded-lg ${isScrolled ? 'bg-primary-50' : 'bg-gold-50'} transition-colors duration-300`}
            >
              <BuildingOfficeIcon className={`h-7 w-7 ${isScrolled ? 'text-primary-800' : 'text-gold-500'} group-hover:text-primary-700 transition-colors duration-300`} />
            </motion.div>
            <div className="flex flex-col">
              <span className={`font-bold text-xl ${isScrolled ? 'text-primary-800' : 'text-primary-900'} group-hover:text-gold-500 transition-colors duration-300`}>
                LuxeStay
              </span>
              <span className="text-xs text-gray-500">Premium Properties</span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  <div className={`flex items-center space-x-1.5 font-medium px-1 py-2 ${
                    location.pathname === item.path
                      ? 'text-primary-800'
                      : 'text-gray-700 hover:text-primary-800'
                  } transition-colors duration-200`}
                  >
                    <span>{item.name}</span>
                  </div>
                  {/* Animated underline */}
                  <span className={`absolute bottom-0 left-0 h-0.5 ${
                    location.pathname === item.path ? 'w-full bg-gold-500' : 'w-0 bg-gold-500'
                  } group-hover:w-full transition-all duration-300 ease-in-out`}></span>
                </Link>
              ))}
              
              {isAuthenticated && user?.role !== 'admin' && (
                <>
                  {authNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="relative group"
                    >
                      <div className={`flex items-center space-x-1.5 font-medium px-1 py-2 ${
                        location.pathname === item.path
                          ? 'text-primary-800'
                          : 'text-gray-700 hover:text-primary-800'
                      } transition-colors duration-200`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </div>
                      {/* Animated underline */}
                      <span className={`absolute bottom-0 left-0 h-0.5 ${
                        location.pathname === item.path ? 'w-full bg-gold-500' : 'w-0 bg-gold-500'
                      } group-hover:w-full transition-all duration-300 ease-in-out`}></span>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </nav>
            
          {/* Right Section with Search & Auth Buttons / User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <div className="relative search-container">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="absolute -right-2 top-0">
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search properties..."
                      className="w-56 sm:w-64 px-4 py-2 focus:outline-none text-sm"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="p-2 bg-primary-50 text-primary-800"
                    >
                      <MagnifyingGlassIcon className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-600 hover:text-primary-800 focus:outline-none transition-colors"
                >
                  <MagnifyingGlassIcon className="w-6 h-6" />
                </button>
              )}
            </div>
            
            {/* Auth Buttons or User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-800 focus:outline-none transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100 group-hover:bg-primary-100 transition-colors">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <UserCircleIcon className="w-6 h-6 text-primary-700" />
                    )}
                  </div>
                  <span className="font-medium hidden sm:block group-hover:text-primary-800 transition-colors duration-200">{user?.name || 'User'}</span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500 group-hover:text-primary-800 transition-colors duration-200" />
                </button>
                
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", bounce: 0.25 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-elegant py-2 z-50 border border-gray-100 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-medium text-primary-800">Your Account</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors duration-200"
                        >
                          <UserCircleIcon className="w-4 h-4 mr-3 text-gray-400" />
                          Profile Settings
                        </Link>
                        
                        <Link
                          to="/favorites"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors duration-200"
                        >
                          <HeartIcon className="w-4 h-4 mr-3 text-gray-400" />
                          Saved Properties
                        </Link>
                        
                        <Link
                          to="/reservations"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors duration-200"
                        >
                          <CalendarIcon className="w-4 h-4 mr-3 text-gray-400" />
                          My Bookings
                        </Link>
                        
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors duration-200"
                          >
                            <BuildingOfficeIcon className="w-4 h-4 mr-3 text-gray-400" />
                            Admin Dashboard
                          </Link>
                        )}
                        
                        <div className="border-t border-gray-100 my-2"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login"
                  className="hidden sm:block text-gray-700 hover:text-primary-800 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="hidden sm:block px-4 py-2 rounded-lg bg-gradient-to-r from-primary-700 to-primary-800 text-white hover:from-primary-600 hover:to-primary-700 font-medium transition-all duration-200 hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-primary-800 transition-colors focus:outline-none"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100 shadow-md"
          >
            <div className="px-4 py-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search properties..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-700"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  </button>
                </div>
              </form>
              
              <nav className="space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg ${
                      location.pathname === item.path
                        ? 'bg-primary-50 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {isAuthenticated ? (
                  <>
                    {authNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center px-3 py-2 rounded-lg ${
                          location.pathname === item.path
                            ? 'bg-primary-50 text-primary-800'
                            : 'text-gray-700 hover:bg-gray-50'
                        } transition-colors`}
                      >
                        <item.icon className="w-5 h-5 mr-2" />
                        {item.name}
                      </Link>
                    ))}
                    
                    <div className="border-t border-gray-200 my-2 pt-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center px-3 py-2 w-full text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-white text-primary-800 border border-primary-800 p-3 rounded-lg font-medium text-center transition-all duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-gradient-to-r from-primary-700 to-primary-800 text-white p-3 rounded-lg font-medium text-center transition-all duration-200"
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
      
      {/* "New" Feature Announcement */}
      {isScrolled && showAnnouncement && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-4 py-1.5 rounded-full shadow-md border border-gray-100 flex items-center"
        >
          <SparklesIcon className="w-4 h-4 text-gold-500 mr-1.5 animate-pulse" />
          <span className="text-xs font-medium">New properties available!</span>
        </motion.div>
      )}
    </header>
  );
}
