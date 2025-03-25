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
  
  // Debug visibility
  console.log('Layout rendered with header visibility: true');
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Force header visibility */}
      <Header isScrolled={isScrolled} className="z-50" />
      
      <main className="flex-grow">
        {children}
      </main>
      
      {!hideFooter && <Footer />}
      <ScrollToTop />
    </div>
  );
}