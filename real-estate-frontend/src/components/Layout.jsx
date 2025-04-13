import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import AdminNavbar from './AdminNavbar';
import Footer from './Footer';
import { useAuth } from '../hooks';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [hideNavbar, setHideNavbar] = useState(false);
    const [hideFooter, setHideFooter] = useState(false); // Add the missing state variable
    const [lastScrollY, setLastScrollY] = useState(0);
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    
    // Check if current route is an admin route
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    // Determine which navbar to show based on user role and current route
    const showAdminNavbar = isAuthenticated && user?.role === 'admin' && isAdminRoute;
    
    // Add scroll event listener to detect when user scrolls
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Consider the page scrolled if we've gone down more than 50px
            const scrolled = currentScrollY > 50;
            
            // Hide navbar when scrolling down, show when scrolling up
            const shouldHideNavbar = scrolled && currentScrollY > lastScrollY;
            
            // For the footer visibility logic - adjust as needed
            const shouldHideFooter = false; // Generally we don't hide the footer on scroll
            
            setIsScrolled(scrolled);
            setHideNavbar(shouldHideNavbar);
            setHideFooter(shouldHideFooter);
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Clean up the event listener when component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header - add dynamic classes based on scroll state */}
            <header className={`w-full fixed top-0 z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
            } ${hideNavbar ? '-translate-y-full' : 'translate-y-0'}`}>
                {!hideNavbar && (
                    <div className="sticky top-0 z-50">
                        {showAdminNavbar ? <AdminNavbar /> : <Navbar />}
                    </div>
                )}
                {/* If your header has text that needs color change when scrolled */}
                <nav className={`${isScrolled ? 'text-gray-800' : 'text-white'} transition-colors duration-300`}>
                    {/* ...existing code... */}
                </nav>
            </header>
            
            {/* Main content */}
            <main className="flex-grow">
                {children}
            </main>
            
            {/* Footer */}
            {!hideFooter && !isAdminRoute && <Footer />}
        </div>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    hideNavbar: PropTypes.bool,
    hideFooter: PropTypes.bool,
};