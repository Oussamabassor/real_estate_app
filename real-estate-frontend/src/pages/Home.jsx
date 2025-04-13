import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import PropTypes from 'prop-types';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
// Import custom styles
import '../custom-styles.css';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import ApiConnectionTest from '../components/ApiConnectionTest';
import {
    HomeIcon,
    MagnifyingGlassIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    ShieldCheckIcon,
    ArrowRightIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
    PhoneIcon,
    ChevronDownIcon,
    ChartBarIcon,
    CheckCircleIcon,
    CalendarIcon,
    HeartIcon,
    ArrowLongRightIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import Layout from '../components/Layout';
import CTASection from '../components/CTASection';
import ErrorBoundary from '../components/ErrorBoundary';

// Custom hook for fetching featured properties
const useFeaturedProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedProperties = async () => {
            try {
                setLoading(true);
                // Using a mock dataset instead of making a failing API call
                const mockFeaturedProperties = [
                    {
                        id: 1,
                        title: "Luxury Downtown Apartment",
                        price: 850000,
                        location: "Manhattan, New York",
                        bedrooms: 3,
                        bathrooms: 2,
                        area: 1800,
                        description: "Stunning luxury apartment with panoramic city views, modern finishes, and exclusive building amenities.",
                        type: "apartment",
                        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"],
                        created_at: new Date().toISOString(),
                        for_sale: true
                    },
                    {
                        id: 2,
                        title: "Beachfront Villa",
                        price: 2500000,
                        location: "Malibu, California",
                        bedrooms: 5,
                        bathrooms: 4,
                        area: 4200,
                        description: "Spectacular beachfront property with direct ocean access, infinity pool, and state-of-the-art smart home features.",
                        type: "villa",
                        images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"],
                        created_at: new Date().toISOString(),
                        for_sale: true
                    },
                    {
                        id: 3,
                        title: "Modern Mountain Retreat",
                        price: 1200000,
                        location: "Aspen, Colorado",
                        bedrooms: 4,
                        bathrooms: 3,
                        area: 2800,
                        description: "Contemporary mountain home with floor-to-ceiling windows, gourmet kitchen, and breathtaking views of the Rockies.",
                        type: "house",
                        images: ["https://images.unsplash.com/photo-1504507926084-34cf0b939964?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"],
                        created_at: new Date().toISOString(),
                        for_sale: true
                    }
                ];

                // Simulate API delay
                setTimeout(() => {
                    setProperties(mockFeaturedProperties);
                    setLoading(false);
                }, 500);

                // Comment out the failing API call for now
                // const response = await api.get('/properties/featured');
                // setProperties(response.data);
                // setLoading(false);
            } catch (err) {
                setError('Failed to fetch featured properties');
                setLoading(false);
                console.error('Error fetching featured properties:', err);
            }
        };

        fetchFeaturedProperties();
    }, []);

    return { properties, loading, error };
};

const statsData = [
    { icon: HomeIcon, label: 'Properties', value: '1,000+' },
    { icon: BuildingOfficeIcon, label: 'Cities', value: '50+' },
    { icon: UserGroupIcon, label: 'Happy Clients', value: '2,000+' },
    { icon: ChartBarIcon, label: 'Success Rate', value: '95%' }
];

// Testimonials data
const testimonials = [
    {
        id: 1,
        content: "Finding our dream home was effortless with LuxeStay. Their personalized approach and extensive selection made all the difference.",
        author: "Michael Johnson",
        position: "Homeowner",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
        id: 2,
        content: "The virtual tours saved us so much time. We found our perfect vacation property without having to travel to multiple locations.",
        author: "Sarah Thompson",
        position: "Property Investor",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
        id: 3,
        content: "The investment properties recommended by LuxeStay have significantly boosted my portfolio. Their market insights are invaluable.",
        author: "Alexandra Williams",
        position: "Property Investor",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
];

// Property types for search filter
const propertyTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'apartment', label: 'Apartments' },
    { value: 'house', label: 'Houses' },
    { value: 'villa', label: 'Villas' },
    { value: 'condo', label: 'Condos' },
];

// Locations for search filter
const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'downtown', label: 'Downtown' },
    { value: 'suburban', label: 'Suburban Area' },
    { value: 'beach', label: 'Beachfront' },
    { value: 'mountain', label: 'Mountain View' },
];

// Price ranges for search filter
const priceRanges = [
    { value: 'all', label: 'Any Price' },
    { value: '100000-500000', label: 'Up to $500,000' },
    { value: '500000-1000000', label: 'Up to $1,000,000' },
    { value: '1000000+', label: 'Luxury' },
];

// Services offered
const services = [
    {
        title: "Property Sales",
        description: "Find your dream home or investment property with our expert guidance and extensive portfolio of premium listings.",
        items: [
            "Exclusive property listings",
            "Virtual and in-person tours",
            "Professional price negotiation",
            "Complete purchase assistance"
        ]
    },
    {
        title: "Property Management",
        description: "Let us handle the complexities of property management while you enjoy the benefits of ownership without the hassle.",
        items: [
            "Tenant screening and placement",
            "Regular maintenance and inspections",
            "Rent collection and financial reporting",
            "24/7 emergency support"
        ]
    },
    {
        title: "Investment Consulting",
        description: "Make informed real estate investment decisions with our data-driven market analysis and personalized strategies.",
        items: [
            "Market trend analysis",
            "Investment portfolio diversification",
            "ROI projections and planning",
            "Property value appreciation insights"
        ]
    }
];

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  
  const handlePropertyClick = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };
  
  // Fetch featured properties
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setPropertiesLoading(true);
        // Using a mock dataset for now
        const mockFeaturedProperties = [
          {
            id: 1,
            title: "Luxury Downtown Apartment",
            price: 850000,
            location: "Manhattan, New York",
            bedrooms: 3,
            bathrooms: 2,
            area: 1800,
            description: "Stunning luxury apartment with panoramic city views, modern finishes, and exclusive building amenities.",
            type: "apartment",
            images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"],
            created_at: new Date().toISOString(),
            for_sale: true
          },
          {
            id: 2,
            title: "Beachfront Villa",
            price: 2500000,
            location: "Malibu, California",
            bedrooms: 5,
            bathrooms: 4,
            area: 4200,
            description: "Spectacular beachfront property with direct ocean access, infinity pool, and state-of-the-art smart home features.",
            type: "villa",
            images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"],
            created_at: new Date().toISOString(),
            for_sale: true
          },
          {
            id: 3,
            title: "Modern Mountain Retreat",
            price: 1200000,
            location: "Aspen, Colorado",
            bedrooms: 4,
            bathrooms: 3,
            area: 2800,
            description: "Contemporary mountain home with floor-to-ceiling windows, gourmet kitchen, and breathtaking views of the Rockies.",
            type: "house",
            images: ["https://images.unsplash.com/photo-1504507926084-34cf0b939964?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"],
            created_at: new Date().toISOString(),
            for_sale: true
          }
        ];

        // Simulate API delay
        setTimeout(() => {
          setFeaturedProperties(mockFeaturedProperties);
          setPropertiesLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setPropertiesLoading(false);
      }
    };
    
    fetchFeaturedProperties();
  }, []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  // Only keep the content Y position transform, remove opacity and scale effects
  const heroContentY = useTransform(scrollY, [0, 300], [0, 50]);

  // Testimonial interval
  useEffect(() => {
      const interval = setInterval(() => {
          setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 6000);
      return () => clearInterval(interval);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
      const handleScroll = () => {
          setIsScrolled(window.scrollY > 50);
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  }, []);

  const handleSearch = (e) => {
      e.preventDefault();
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (propertyType !== 'all') params.append('type', propertyType);
      if (selectedLocation !== 'all') params.append('location', selectedLocation);
      if (selectedPrice !== 'all') params.append('price', selectedPrice);
      
      navigate({
          pathname: '/properties',
          search: params.toString()
      });
  };

  // If you need this to show a modal instead, use this alternative implementation:
  // const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  // const [showContactModal, setShowContactModal] = useState(false);
  // 
  // const handlePropertyClick = (propertyId) => {
  //   setSelectedPropertyId(propertyId);
  //   setShowContactModal(true);
  // };

  return (
      <Layout>
          {/* Enhanced Hero Section with Parallax Effect - No opacity/scale change */}
          <div className="relative h-screen min-h-[600px] overflow-hidden" 
               style={{ paddingTop: "80px" }}
               ref={heroRef}>
              {/* Background Image - No parallax scaling or opacity change */}
              <div className="absolute inset-0 z-0">
                  {/* Enhanced overlay with better gradient */}
                  <div className="absolute inset-0" style={{ 
                    background: 'linear-gradient(to right, rgba(15,44,92,0.95), rgba(26,58,108,0.85))'
                  }}></div>
                  <img 
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
                      alt="Luxury Real Estate" 
                      className="w-full h-full object-cover" 
                      style={{ opacity: 0.7 }}
                  />
              </div>

              {/* Decorative elements */}
              <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full border-2 border-white opacity-10"></div>
                  <div className="absolute bottom-1/3 left-1/3 w-40 h-40 rounded-full border border-white opacity-10"></div>
                  <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-white opacity-5"></div>
              </div>

              {/* Hero Content - Still allowing slight vertical movement */}
              <div className="absolute inset-0 z-10 flex items-center" style={{ top: "80px" }}>
                  <motion.div 
                      className="container mx-auto px-4 sm:px-6 lg:px-8"
                      style={{ y: heroContentY }}
                  >
                      <div className="max-w-3xl mx-auto md:mx-0 mt-10"> {/* Added margin-top */}
                          <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                          >
                              <div className="flex items-center mb-6">
                                  <div style={{ height: "2px", width: "48px", backgroundColor: "#c8a55b", marginRight: "0.5rem" }}></div>
                                  <span style={{ color: "#c8a55b", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.875rem" }}>
                                      Exclusive Properties
                                  </span>
                              </div>
                              <h1 style={{ 
                                  fontSize: "4rem", 
                                  fontWeight: "700", 
                                  lineHeight: "1.1", 
                                  marginBottom: "1.5rem", 
                                  color: "#ffffff",
                                  textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                              }}>
                                  Discover Your <br /> 
                                  <span style={{ color: "#c8a55b" }}>Dream</span> Property
                              </h1>
                              <p style={{ 
                                  fontSize: "1.25rem", 
                                  color: "#ffffff", 
                                  marginBottom: "2.5rem", 
                                  maxWidth: "500px",
                                  lineHeight: "1.6"
                              }}>
                                  From elegant city apartments to stunning beachfront villas, find exceptional properties that match your lifestyle and aspirations.
                              </p>
                              
                              {/* Enhanced Call-to-Action buttons */}
                              <div className="flex flex-col sm:flex-row gap-4">
                                  <Link 
                                      to="/properties" 
                                      style={{
                                          backgroundColor: "#c8a55b",
                                          color: "#0f2c5c",
                                          padding: "1rem 2rem",
                                          borderRadius: "0.5rem",
                                          fontWeight: "600",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          transition: "all 0.3s ease",
                                          border: "none",
                                          cursor: "pointer",
                                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                                      }}
                                      onMouseOver={e => {
                                          e.currentTarget.style.backgroundColor = "#e2c07a";
                                          e.currentTarget.style.transform = "translateY(-2px)";
                                      }}
                                      onMouseOut={e => {
                                          e.currentTarget.style.backgroundColor = "#c8a55b";
                                          e.currentTarget.style.transform = "translateY(0)";
                                      }}
                                  >
                                      Explore Properties
                                      <ArrowRightIcon style={{ width: "1.25rem", height: "1.25rem", marginLeft: "0.5rem" }} />
                                  </Link>
                                  
                                  <Link 
                                      to="/contact" 
                                      style={{
                                          backgroundColor: "transparent",
                                          color: "#ffffff",
                                          padding: "1rem 2rem",
                                          borderRadius: "0.5rem",
                                          fontWeight: "600",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          transition: "all 0.3s ease",
                                          border: "2px solid #ffffff",
                                          cursor: "pointer"
                                      }}
                                      onMouseOver={e => {
                                          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                                          e.currentTarget.style.transform = "translateY(-2px)";
                                      }}
                                      onMouseOut={e => {
                                          e.currentTarget.style.backgroundColor = "transparent";
                                          e.currentTarget.style.transform = "translateY(0)";
                                      }}
                                  >
                                      Contact Us
                                  </Link>
                              </div>
                              
                              {/* Property stats */}
                              <div style={{ 
                                  display: "flex", 
                                  gap: "2rem", 
                                  marginTop: "3rem",
                                  color: "#ffffff"
                              }}>
                                  <div>
                                      <div style={{ fontSize: "1.875rem", fontWeight: "700", color: "#c8a55b" }}>1,000+</div>
                                      <div style={{ fontSize: "0.875rem", opacity: "0.8" }}>Properties</div>
                                  </div>
                                  <div>
                                      <div style={{ fontSize: "1.875rem", fontWeight: "700", color: "#c8a55b" }}>500+</div>
                                      <div style={{ fontSize: "0.875rem", opacity: "0.8" }}>Happy Clients</div>
                                  </div>
                                  <div>
                                      <div style={{ fontSize: "1.875rem", fontWeight: "700", color: "#c8a55b" }}>50+</div>
                                      <div style={{ fontSize: "0.875rem", opacity: "0.8" }}>Cities</div>
                                  </div>
                              </div>
                          </motion.div>
                      </div>
                  </motion.div>
              </div>

              {/* Scroll Indicator */}
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center"
              >
                  <span style={{ color: "#ffffff", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Scroll down</span>
                  <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      style={{ 
                          width: "2rem", 
                          height: "2rem", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          borderRadius: "9999px", 
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          backdropFilter: "blur(4px)"
                      }}
                  >
                      <ChevronDownIcon style={{ width: "1.25rem", height: "1.25rem", color: "#ffffff" }} />
                  </motion.div>
              </motion.div>
          </div>

          {/* Quick Actions for Authenticated Users */}
          {isAuthenticated && user?.role !== 'admin' && (
              <div className="bg-white shadow-2xl py-8 -mt-20 relative z-20 rounded-t-3xl mx-4 lg:mx-8 xl:mx-auto max-w-7xl">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <Link
                              to="/properties"
                              className="flex items-center p-5 bg-white border border-gray-100 rounded-xl transition-all hover:shadow-xl hover:border-blue-100 group"
                          >
                              <div className="rounded-full p-3 bg-blue-50 mr-4 group-hover:bg-blue-100 transition-colors">
                                  <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Browse Properties</h3>
                                  <p className="text-sm text-gray-500">Find your next dream vacation rental</p>
                              </div>
                              <ArrowLongRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                          </Link>

                          <Link
                              to="/reservations"
                              className="flex items-center p-5 bg-white border border-gray-100 rounded-xl transition-all hover:shadow-xl hover:border-blue-100 group"
                          >
                              <div className="rounded-full p-3 bg-blue-50 mr-4 group-hover:bg-blue-100 transition-colors">
                                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">My Reservations</h3>
                                  <p className="text-sm text-gray-500">View and manage your bookings</p>
                              </div>
                              <ArrowLongRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                          </Link>

                          <Link
                              to="/favorites"
                              className="flex items-center p-5 bg-white border border-gray-100 rounded-xl transition-all hover:shadow-xl hover:border-blue-100 group"
                          >
                              <div className="rounded-full p-3 bg-blue-50 mr-4 group-hover:bg-blue-100 transition-colors">
                                  <HeartIcon className="w-6 h-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Favorites</h3>
                                  <p className="text-sm text-gray-500">View your saved properties</p>
                              </div>
                              <ArrowLongRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                          </Link>
                      </div>
                  </div>
              </div>
          )}

          {/* Stats Section */}
          <div className="py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.8 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16"
                  >
                      {statsData.map((stat, index) => (
                          <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="flex flex-col items-center text-center"
                          >
                              <div className="rounded-full bg-blue-50 p-4 mb-4">
                                  <stat.icon className="w-8 h-8 text-blue-600" />
                              </div>
                              <div className="text-4xl font-bold text-blue-900 mb-2">{stat.value}</div>
                              <div className="text-gray-600">{stat.label}</div>
                          </motion.div>
                      ))}
                  </motion.div>
              </div>
          </div>

          {/* Featured Properties */}
          <div className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                          className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full mb-4"
                      >
                          <SparklesIcon className="w-4 h-4 mr-2" />
                          <span className="text-xs font-semibold tracking-wider uppercase">Featured Listings</span>
                      </motion.div>
                      <motion.h2 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="text-3xl font-bold text-gray-900"
                      >
                          Exceptional Properties
                      </motion.h2>
                      <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
                      >
                          Discover our handpicked selection of stunning properties designed to exceed your expectations
                      </motion.p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {propertiesLoading ? (
                          Array.from({ length: 3 }).map((_, index) => (
                              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                                  <div className="h-56 bg-gray-200 animate-pulse"></div>
                                  <div className="p-6">
                                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>
                                      <div className="flex justify-between items-center">
                                          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
                                          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>
                                      </div>
                                  </div>
                              </div>
                          ))
                      ) : (
                          featuredProperties.map((property) => (
                              <ErrorBoundary key={property.id} fallbackMessage="Failed to load property">
                                  <PropertyCard 
                                      property={property}
                                      onContactClick={handlePropertyClick}
                                      isFeatured={property.is_featured}
                                  />
                              </ErrorBoundary>
                          ))
                      )}
                  </div>

                  <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mt-12 text-center"
                  >
                      <Link 
                          to="/properties" 
                          className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                          View All Properties
                          <ArrowRightIcon className="w-5 h-5 ml-2" />
                      </Link>
                  </motion.div>
              </div>
          </div>

          {/* Services Section */}
          <div className="py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                      <motion.h2 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                          className="text-3xl font-bold text-gray-900"
                      >
                          Our Services
                      </motion.h2>
                      <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
                      >
                          Comprehensive real estate solutions tailored to your needs
                      </motion.p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {services.map((service, index) => (
                          <motion.div 
                              key={service.title}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
                          >
                              <h3 className="text-xl font-bold mb-4 text-gray-900">{service.title}</h3>
                              <p className="text-gray-600 mb-6">{service.description}</p>
                              <ul className="space-y-3">
                                  {service.items.map((item, idx) => (
                                      <li key={idx} className="flex items-start">
                                          <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                                          <span className="text-gray-700">{item}</span>
                                      </li>
                                  ))}
                              </ul>
                          </motion.div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Testimonials Section */}
          <div className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                      <motion.h2 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                          className="text-3xl font-bold text-gray-900"
                      >
                          What Our Clients Say
                      </motion.h2>
                      <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
                      >
                          Real stories from satisfied customers
                      </motion.p>
                  </div>

                  <div className="relative overflow-hidden">
                      <div className="mx-auto max-w-3xl px-4">
                          <div className="relative">
                              <AnimatePresence mode="wait">
                                  <motion.div
                                      key={currentTestimonial}
                                      initial={{ opacity: 0, x: 100 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -100 }}
                                      transition={{ duration: 0.5 }}
                                      className="bg-blue-50 p-8 rounded-2xl shadow-md"
                                  >
                                      <div className="flex flex-col items-center md:flex-row md:items-start text-center md:text-left">
                                          <div className="mb-6 md:mb-0 md:mr-6 flex-shrink-0">
                                              <img 
                                                  src={testimonials[currentTestimonial].image} 
                                                  alt={testimonials[currentTestimonial].author}
                                                  className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-md" 
                                              />
                                          </div>
                                          <div>
                                              <div className="mb-4">
                                                  {[1, 2, 3, 4, 5].map((star) => (
                                                      <span key={star} className="text-yellow-400">★</span>
                                                  ))}
                                              </div>
                                              <blockquote className="text-gray-700 text-lg italic mb-4">
                                                  "{testimonials[currentTestimonial].content}"
                                              </blockquote>
                                              <div className="font-medium text-gray-900">
                                                  {testimonials[currentTestimonial].author}
                                              </div>
                                              <div className="text-blue-600 text-sm">
                                                  {testimonials[currentTestimonial].position}
                                              </div>
                                          </div>
                                      </div>
                                  </motion.div>
                              </AnimatePresence>
                          </div>
                          
                          {/* Dots for navigation */}
                          <div className="flex justify-center space-x-2 mt-8">
                              {testimonials.map((_, index) => (
                                  <button
                                      key={index}
                                      onClick={() => setCurrentTestimonial(index)}
                                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'}`}
                                  />
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Keep only one CTA Section - the component-based one */}
          <CTASection
              title={isAuthenticated ? "Ready to find your next getaway?" : "Join our community today"}
              description={isAuthenticated 
                  ? "Browse our exclusive properties and make a reservation for your dream vacation rental." 
                  : "Create an account to start booking luxury properties and enjoy exclusive member benefits."}
              buttonText={isAuthenticated ? "Browse Properties" : "Sign Up Now"}
              buttonLink={isAuthenticated ? "/properties" : "/register"}
          />
      </Layout>
  );
}