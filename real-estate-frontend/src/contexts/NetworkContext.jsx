import React, { createContext, useContext } from 'react';

const NetworkContext = createContext({
  isOnline: true,
  // Remove retry functionality
});

export const NetworkProvider = ({ children }) => {
  // Always return online status as true
  const value = {
    isOnline: true
  };
  
  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
