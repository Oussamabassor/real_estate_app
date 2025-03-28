import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks';
import {
  ChartBarIcon,
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  BellIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import AdminNavbar from './AdminNavbar';

/**
 * AdminLayout component that provides a consistent layout for all admin pages
 * with a fixed sidebar navigation
 */
const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count
  
  // Get current active route
  const currentPath = location.pathname;
  
  const navigationItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: ChartBarIcon },
    { name: 'Properties', path: '/admin/properties', icon: HomeIcon },
    { name: 'Users', path: '/admin/users', icon: UserGroupIcon },
    { name: 'Reservations', path: '/admin/reservations', icon: CalendarIcon },
    { name: 'Revenue', path: '/admin/revenue', icon: CurrencyDollarIcon },
    { name: 'Settings', path: '/admin/settings', icon: Cog6ToothIcon },
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <motion.div 
        initial={{ width: isCollapsed ? 20 : 64 }}
        animate={{ width: isCollapsed ? 20 : 64 }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 overflow-y-auto z-10 shadow-md`}
      >
        <div className="p-4">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="bg-primary-50 p-1.5 rounded-lg">
              <BuildingOfficeIcon className="h-7 w-7 text-primary-800" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">Admin</span>
                <span className="text-xs text-primary-600">Control Panel</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Toggle Button */}
        <div className="px-4 mb-6">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronDoubleRightIcon className="w-5 h-5" />
            ) : (
              <>
                <ChevronDoubleLeftIcon className="w-5 h-5 mr-2" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-2 px-2">
          {navigationItems.map((item) => (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileHover={{ x: 3 }}
              className={`w-full flex items-center px-3 py-3 my-1 rounded-lg transition-all ${
                currentPath === item.path
                  ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50 border-l-4 border-transparent'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </motion.button>
          ))}
          
          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ x: 3 }}
            className="w-full flex items-center px-3 py-3 my-1 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all mt-6 border-l-4 border-transparent"
          >
            <ArrowLeftOnRectangleIcon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </motion.button>
        </nav>
        
        {/* Admin Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          {isCollapsed ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-medium text-sm">{user?.name?.charAt(0) || 'A'}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center mr-3 overflow-hidden border border-primary-200">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary-700 font-medium">{user?.name?.charAt(0) || 'A'}</span>
                  )}
                </div>
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {notifications}
                  </span>
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@luxestay.com'}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            {navigationItems.find(item => item.path === currentPath)?.name || 'Admin Dashboard'}
          </h1>
          
          <div className="flex items-center space-x-4">
            {/* Notifications Bell */}
            <div className="relative">
              <button className="text-gray-600 hover:text-primary-600 transition-colors">
                <BellIcon className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
            
            {/* View Site Link */}
            <button 
              onClick={() => navigate('/')}
              className="text-sm text-primary-600 hover:text-primary-800 flex items-center transition-colors"
            >
              <span>View Site</span>
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;