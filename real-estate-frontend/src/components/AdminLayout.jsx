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
} from '@heroicons/react/24/outline';

/**
 * AdminLayout component that provides a consistent layout for all admin pages
 * with a fixed sidebar navigation
 */
const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
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
      <div className="w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 overflow-y-auto z-10">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="mt-6">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                currentPath === item.path
                  ? 'text-primary-600 bg-primary-50 border-r-4 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </button>
          ))}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 mt-6"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
        
        {/* Admin Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
              <span className="text-primary-700 font-medium">{user?.name?.charAt(0) || 'A'}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-64 min-h-screen">
        {/* Content Area */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;