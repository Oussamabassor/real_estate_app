import { createContext, useContext } from 'react';

// Create a simplified context without translations
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Simple t function that just returns the key
  const t = (key) => {
    return key.split('.').pop(); // Just return the last part of the key as a fallback
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === null) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}