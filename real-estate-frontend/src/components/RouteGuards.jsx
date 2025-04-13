import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import PropTypes from 'prop-types';

export const ProfileRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const UserRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role !== 'admin' ? 
    children : 
    isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'admin' ? 
    children : 
    isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
};

// Add prop types for better type checking
ProfileRoute.propTypes = {
  children: PropTypes.node.isRequired
};

UserRoute.propTypes = {
  children: PropTypes.node.isRequired
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired
};
