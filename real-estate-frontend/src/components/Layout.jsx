import React from 'react';
import Navbar from './Navbar';
import AdminNavbar from './AdminNavbar';
import Footer from './Footer';
import { useAuth } from '../hooks';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

const Layout = ({ children, hideNavbar = false, hideFooter = false }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Determine which navbar to show based on user role and current route
  const showAdminNavbar = isAuthenticated && user?.role === 'admin' && isAdminRoute;
  
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && (
        showAdminNavbar ? <AdminNavbar /> : <Navbar />
      )}
      <main className={`flex-grow ${isAdminRoute ? 'bg-gray-50' : ''}`}>
        {children}
      </main>
      {!hideFooter && !isAdminRoute && <Footer />}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  hideNavbar: PropTypes.bool,
  hideFooter: PropTypes.bool,
};

export default Layout;