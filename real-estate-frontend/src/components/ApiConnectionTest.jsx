import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApiConnectionTest.css'; // We'll create this stylesheet

const ApiConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    console.log('Testing API connection to:', import.meta.env.VITE_API_BASE_URL + '/api_test.php');
    try {
      const response = await axios.get(import.meta.env.VITE_API_BASE_URL + '/api_test.php', {
        withCredentials: true
      });
      console.log('API connection successful:', response.data);
      
      // On success, immediately hide without showing a success message
      setConnectionStatus('connected');
      setVisible(false);
      
      // Store connection status in localStorage so other components can check it
      localStorage.setItem('apiConnectionStatus', 'connected');
      
    } catch (error) {
      console.error('API connection test failed:', error);
      setConnectionStatus('failed');
      setError(error);
      
      // Update localStorage so other components know API is down
      localStorage.setItem('apiConnectionStatus', 'failed');
      
      setVisible(true); // Keep component visible on error
    }
  };

  // Don't render anything if the connection was successful
  if (!visible || connectionStatus === 'connected') {
    return null;
  }

  return (
    <div className="api-connection-banner">
      {connectionStatus === 'testing' && (
        <div className="api-testing">
          <div className="spinner"></div>
          <span>Connecting to services...</span>
        </div>
      )}
      
      {connectionStatus === 'failed' && (
        <div className="api-error">
          <p>
            <i className="error-icon">⚠️</i> 
            Unable to connect to services: {error?.message || 'Unknown error'}
          </p>
          <button className="retry-button" onClick={testConnection}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default ApiConnectionTest;