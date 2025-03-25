import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

export default function Layout({ children, hideFooter = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Force header to be visible with extreme z-index
  const headerContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999, // Very high z-index to ensure it's above everything
    display: 'block',
    visibility: 'visible',
    pointerEvents: 'auto'
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Force header visibility */}
      <div style={headerContainerStyle} className="header-container">
        <Header isScrolled={isScrolled} />
      </div>
      
      {/* Add padding to prevent content from being hidden behind the header */}
      <main className="flex-grow pt-16">
        {children}
      </main>
      
      {!hideFooter && <Footer />}
      <ScrollToTop />
    </div>
  );
}