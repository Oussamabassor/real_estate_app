import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';
import {
    HomeIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    UserCircleIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  // Enhanced scroll effect with more reliable handling
  useEffect(() => {
    const handleScroll = () => {
      // Simplified check to ensure reliable state updates
      setScrolled(window.scrollY > 10);
    };

    // Add passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Remove dependency on scrolled to prevent feedback loops

  // Logout handler
  const handleLogout = () => {
    logout();
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

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'scrolled-header' : ''}`}
      style={{ 
        backgroundColor: scrolled ? 'rgb(255, 255, 255)' : 'transparent',
        boxShadow: scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
        height: '80px', 
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Add an additional solid background div to ensure coverage */}
      {scrolled && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#ffffff',
            zIndex: -1
          }}
        ></div>
      )}
    
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">
              <span style={{ color: scrolled ? '#0f2c5c' : '#ffffff' }}>
                Luxe<span style={{ color: '#c8a55b' }}>Stay</span>
              </span>
            </Link>
          </div>

          {/* Navigation links with improved visibility */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Navigation links with proper color contrast */}
            <Link
              to="/"
              style={{ 
                color: scrolled ? '#1a202c' : '#ffffff',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                padding: '0.5rem 0'
              }}
              onMouseOver={e => {
                e.currentTarget.style.color = '#c8a55b';
              }}
              onMouseOut={e => {
                e.currentTarget.style.color = scrolled ? '#1a202c' : '#ffffff';
              }}
            >
              Home
            </Link>
            <Link
              to="/properties"
              style={{ 
                color: scrolled ? '#1a202c' : '#ffffff',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                padding: '0.5rem 0'
              }}
              onMouseOver={e => {
                e.currentTarget.style.color = '#c8a55b';
              }}
              onMouseOut={e => {
                e.currentTarget.style.color = scrolled ? '#1a202c' : '#ffffff';
              }}
            >
              Properties
            </Link>

            {isAuthenticated && authNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{ 
                  color: scrolled ? '#1a202c' : '#ffffff',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  padding: '0.5rem 0'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.color = '#c8a55b';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.color = scrolled ? '#1a202c' : '#ffffff';
                }}
              >
                <item.icon className="w-5 h-5 inline-block mr-1" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons with improved visibility */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600"
              >
                <XMarkIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-medium"
                  style={{ color: scrolled ? '#1a202c' : '#ffffff' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button with improved visibility */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            style={{ color: scrolled ? '#1a202c' : '#ffffff' }}
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className={`w-6 h-6`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
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

              {isAuthenticated && authNavItems.map((item) => (
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

              {isAuthenticated ? (
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
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

// Add this to ensure the header styling is properly applied and not overridden
// Add this to your custom-styles.css or a <style> tag in your component
const style = document.createElement('style');
style.textContent = `
  .scrolled-header {
    background-color: #ffffff !important;
  }
`;
document.head.appendChild(style);