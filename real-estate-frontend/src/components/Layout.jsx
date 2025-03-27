import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AdminNavbar from './AdminNavbar';
import { useAuth } from '../hooks'; // Updated import path
import PropTypes from 'prop-types';

const Layout = ({ children, hideNavbar = false, hideFooter = false }) => {
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user && user.role === 'admin';
  
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && (
        isAdmin ? <AdminNavbar /> : <Navbar />
      )}
      <main className="flex-grow">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  hideNavbar: PropTypes.bool,
  hideFooter: PropTypes.bool,
};

export default Layout;