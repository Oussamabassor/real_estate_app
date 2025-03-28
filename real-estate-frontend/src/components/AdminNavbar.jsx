import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks';
import {
  ChartBarIcon,
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  BellIcon
} from '@heroicons/react/24/outline';

export default function AdminNavbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Example notification count
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect non-admin users
  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'admin') {
      console.warn('Non-admin user attempting to view admin navbar');
      navigate('/', { replace: true });
    }
  }, [user, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navigationItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: ChartBarIcon },
    { name: 'Properties', path: '/admin/properties', icon: HomeIcon },
    { name: 'Users', path: '/admin/users', icon: UserGroupIcon },
    { name: 'Reservations', path: '/admin/reservations', icon: CalendarIcon },
    { name: 'Revenue', path: '/admin/revenue', icon: CurrencyDollarIcon },
    { name: 'Settings', path: '/admin/settings', icon: Cog6ToothIcon },
  ];

  // If not authenticated or not admin, don't render admin navbar
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return null;
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <div className="bg-primary-50 p-1.5 rounded-lg">
              <BuildingOfficeIcon className="h-7 w-7 text-primary-800" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900">LuxeStay</span>
              <div className="flex items-center text-xs text-primary-600">
                <ShieldCheckIcon className="h-3 w-3 mr-1" />
                <span>Admin Portal</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 font-medium relative group ${
                  location.pathname === item.path
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
                {/* Animated underline for active and hover states */}
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary-600 
                    ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'} 
                    transition-all duration-300 ease-in-out -mb-1.5`}
                ></span>
              </Link>
            ))}

            <div className="relative ml-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all w-40 focus:w-56"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-1.5 text-gray-600 hover:text-primary-600 transition-colors rounded-full hover:bg-gray-100">
                <BellIcon className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full -mt-1 -mr-1">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center relative overflow-hidden border border-primary-200 group-hover:border-primary-300">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircleIcon className="w-6 h-6 text-primary-600 group-hover:text-primary-700" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", bounce: 0.25 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-elegant py-2 z-50 border border-gray-100"
                  >
                    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">Admin Panel</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/"
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      View Site
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100 shadow-md"
          >
            <div className="px-4 py-3">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              <nav className="flex flex-col space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center p-3 rounded-lg ${
                      location.pathname === item.path
                        ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600 border-l-4 border-transparent'
                    } transition-all duration-200`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                  >
                    <HomeIcon className="w-5 h-5 mr-3" />
                    <span>View Site</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                  >
                    <UserCircleIcon className="w-5 h-5 mr-3" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center p-3 rounded-lg text-left text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
