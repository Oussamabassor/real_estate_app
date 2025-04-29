import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks";
import PropTypes from "prop-types";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
// Import custom styles
import "../custom-styles.css";
import { propertyService } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";
import ApiConnectionTest from "../components/ApiConnectionTest";
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
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import Layout from "../components/Layout";
import CTASection from "../components/CTASection";
import ErrorBoundary from "../components/ErrorBoundary";

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
            description:
              "Stunning luxury apartment with panoramic city views, modern finishes, and exclusive building amenities.",
            type: "apartment",
            images: [
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            ],
            created_at: new Date().toISOString(),
            for_sale: true,
          },
          {
            id: 2,
            title: "Beachfront Villa",
            price: 2500000,
            location: "Malibu, California",
            bedrooms: 5,
            bathrooms: 4,
            area: 4200,
            description:
              "Spectacular beachfront property with direct ocean access, infinity pool, and state-of-the-art smart home features.",
            type: "villa",
            images: [
              "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            ],
            created_at: new Date().toISOString(),
            for_sale: true,
          },
          {
            id: 3,
            title: "Modern Mountain Retreat",
            price: 1200000,
            location: "Aspen, Colorado",
            bedrooms: 4,
            bathrooms: 3,
            area: 2800,
            description:
              "Contemporary mountain home with floor-to-ceiling windows, gourmet kitchen, and breathtaking views of the Rockies.",
            type: "house",
            images: [
              "https://images.unsplash.com/photo-1504507926084-34cf0b939964?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            ],
            created_at: new Date().toISOString(),
            for_sale: true,
          },
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
        setError("Failed to fetch featured properties");
        setLoading(false);
        console.error("Error fetching featured properties:", err);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return { properties, loading, error };
};

const statsData = [
  { icon: HomeIcon, label: "Properties", value: "1,000+" },
  { icon: BuildingOfficeIcon, label: "Cities", value: "50+" },
  { icon: UserGroupIcon, label: "Happy Clients", value: "2,000+" },
  { icon: ChartBarIcon, label: "Success Rate", value: "95%" },
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    content:
      "Finding our dream home was effortless with LuxeStay. Their personalized approach and extensive selection made all the difference.",
    author: "Michael Johnson",
    position: "Homeowner",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 2,
    content:
      "The virtual tours saved us so much time. We found our perfect vacation property without having to travel to multiple locations.",
    author: "Sarah Thompson",
    position: "Property Investor",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 3,
    content:
      "The investment properties recommended by LuxeStay have significantly boosted my portfolio. Their market insights are invaluable.",
    author: "Alexandra Williams",
    position: "Property Investor",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

// Property types for search filter
const propertyTypes = [
  { value: "all", label: "All Types" },
  { value: "apartment", label: "Apartments" },
  { value: "house", label: "Houses" },
  { value: "villa", label: "Villas" },
  { value: "condo", label: "Condos" },
];

// Locations for search filter
const locations = [
  { value: "all", label: "All Locations" },
  { value: "downtown", label: "Downtown" },
  { value: "suburban", label: "Suburban Area" },
  { value: "beach", label: "Beachfront" },
  { value: "mountain", label: "Mountain View" },
];

// Price ranges for search filter
const priceRanges = [
  { value: "all", label: "Any Price" },
  { value: "100000-500000", label: "Up to $500,000" },
  { value: "500000-1000000", label: "Up to $1,000,000" },
  { value: "1000000+", label: "Luxury" },
];

// Services offered
const services = [
  {
    title: "Property Sales",
    description:
      "Find your dream home or investment property with our expert guidance and extensive portfolio of premium listings.",
    items: [
      "Exclusive property listings",
      "Virtual and in-person tours",
      "Professional price negotiation",
      "Complete purchase assistance",
    ],
  },
  {
    title: "Property Management",
    description:
      "Let us handle the complexities of property management while you enjoy the benefits of ownership without the hassle.",
    items: [
      "Tenant screening and placement",
      "Regular maintenance and inspections",
      "Rent collection and financial reporting",
      "24/7 emergency support",
    ],
  },
  {
    title: "Investment Consulting",
    description:
      "Make informed real estate investment decisions with our data-driven market analysis and personalized strategies.",
    items: [
      "Market trend analysis",
      "Investment portfolio diversification",
      "ROI projections and planning",
      "Property value appreciation insights",
    ],
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroContentY = useTransform(scrollY, [0, 300], [0, 50]);

  // Get properties data from our custom hook
  const {
    properties: featuredProperties,
    loading: propertiesLoading,
    error,
  } = useFeaturedProperties();

  // Handle property click (for contact button)
  const handlePropertyClick = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

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

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (propertyType !== "all") params.append("type", propertyType);
    if (selectedLocation !== "all") params.append("location", selectedLocation);
    if (selectedPrice !== "all") params.append("price", selectedPrice);

    navigate({
      pathname: "/properties",
      search: params.toString(),
    });
  };

  return (
    <Layout>
      {/* Enhanced Hero Section with improved responsiveness */}
      <div
        className="relative h-screen min-h-[600px] overflow-hidden"
        style={{ paddingTop: "80px" }}
        ref={heroRef}
      >
        {/* Background Image - No parallax scaling or opacity change */}
        <div className="absolute inset-0 z-0">
          {/* Enhanced overlay with better gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(15,44,92,0.95), rgba(26,58,108,0.85))",
            }}
          ></div>
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Real Estate"
            className="object-cover w-full h-full"
            style={{ opacity: 0.7 }}
          />
        </div>

        {/* Decorative elements - Improved visibility on small screens */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute hidden w-64 h-64 border-2 border-white rounded-full top-1/4 right-1/4 opacity-10 md:block"></div>
          <div className="absolute hidden w-40 h-40 border border-white rounded-full bottom-1/3 left-1/3 opacity-10 md:block"></div>
          <div className="absolute hidden bg-white rounded-full bottom-1/4 right-1/3 w-80 h-80 opacity-5 md:block"></div>
          {/* Mobile optimized decorative elements */}
          <div className="absolute block w-32 h-32 border-2 border-white rounded-full top-1/4 right-1/4 opacity-10 md:hidden"></div>
          <div className="absolute block w-24 h-24 border border-white rounded-full bottom-1/3 left-1/3 opacity-10 md:hidden"></div>
        </div>

        {/* Hero Content - Improved responsive layout */}
        <div
          className="absolute inset-0 z-10 flex items-center"
          style={{ top: "80px" }}
        >
          <motion.div
            className="container w-full px-4 mx-auto sm:px-6 lg:px-8"
            style={{ y: heroContentY }}
          >
            <div className="max-w-3xl px-2 mx-auto mt-4 md:mx-0 md:mt-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center mb-4 md:mb-6">
                  <div
                    style={{
                      height: "2px",
                      width: "30px",
                      backgroundColor: "#c8a55b",
                      marginRight: "0.5rem",
                    }}
                    className="md:w-12"
                  ></div>
                  <span
                    style={{
                      color: "#c8a55b",
                      fontWeight: "500",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontSize: "0.75rem",
                    }}
                    className="md:text-sm"
                  >
                    Exclusive Properties
                  </span>
                </div>
                <h1
                  style={{
                    fontWeight: "700",
                    lineHeight: "1.1",
                    color: "#ffffff",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                  className="mb-4 text-4xl md:text-5xl lg:text-6xl md:mb-6"
                >
                  Discover Your <br />
                  <span style={{ color: "#c8a55b" }}>Dream</span> Property
                </h1>
                <p
                  style={{
                    color: "#ffffff",
                    lineHeight: "1.6",
                  }}
                  className="max-w-lg mb-6 text-base md:text-xl md:mb-10 opacity-90"
                >
                  From elegant city apartments to stunning beachfront villas,
                  find exceptional properties that match your lifestyle and
                  aspirations.
                </p>

                {/* Enhanced Call-to-Action buttons - Better mobile layout */}
                <div className="flex flex-col gap-3 sm:flex-row md:gap-4">
                  <Link
                    to="/properties"
                    className="relative overflow-hidden group inline-flex items-center justify-center px-5 py-3 md:px-8 md:py-4 rounded-lg md:rounded-xl bg-amber-500 text-blue-900 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl transform hover:translate-y-[-2px] active:translate-y-[0px]"
                    style={{
                      backgroundColor: "#c8a55b",
                      color: "#0f2c5c",
                    }}
                  >
                    <span className="relative z-10">Explore Properties</span>
                    <ArrowRightIcon className="relative z-10 w-5 h-5 ml-2" />
                    <span className="absolute inset-0 transition-transform duration-300 origin-left transform scale-x-0 bg-amber-400 group-hover:scale-x-100"></span>
                  </Link>

                  <Link
                    to="/contact"
                    className="relative overflow-hidden group inline-flex items-center justify-center px-5 py-3 md:px-8 md:py-4 rounded-lg md:rounded-xl border-2 border-white text-white font-semibold transition-all duration-300 hover:bg-white hover:text-blue-900 transform hover:translate-y-[-2px] active:translate-y-[0px]"
                  >
                    <span className="relative z-10">Contact Us</span>
                    <span className="absolute inset-0 transition-transform duration-300 origin-left transform scale-x-0 bg-white group-hover:scale-x-100 opacity-10 group-hover:opacity-100"></span>
                  </Link>
                </div>

                {/* Property stats - Improved mobile layout */}
                <div className="flex flex-wrap gap-4 mt-8 md:gap-8 md:mt-12">
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="text-2xl font-bold md:text-3xl text-amber-500">
                      1,000+
                    </div>
                    <div className="text-xs text-white md:text-sm opacity-80">
                      Properties
                    </div>
                  </div>
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="text-2xl font-bold md:text-3xl text-amber-500">
                      500+
                    </div>
                    <div className="text-xs text-white md:text-sm opacity-80">
                      Happy Clients
                    </div>
                  </div>
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="text-2xl font-bold md:text-3xl text-amber-500">
                      50+
                    </div>
                    <div className="text-xs text-white md:text-sm opacity-80">
                      Cities
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Improved Scroll Indicator - Better positioning for mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute z-20 flex flex-col items-center transform -translate-x-1/2 bottom-4 md:bottom-10 left-1/2"
        >
          <span className="mb-1 text-xs text-white md:text-sm opacity-80 md:mb-2">
            Scroll down
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center justify-center w-8 h-8 bg-white rounded-full md:w-10 md:h-10 bg-opacity-20 backdrop-blur-sm"
          >
            <ChevronDownIcon className="w-4 h-4 text-white md:w-5 md:h-5" />
          </motion.div>
        </motion.div>
      </div>

      {/* Quick Actions - Improved mobile layout */}
      {isAuthenticated && user?.role !== "admin" && (
        <div className="relative z-20 py-6 mx-2 -mt-16 bg-white shadow-xl md:py-8 md:mx-4 md:-mt-20 rounded-t-2xl md:rounded-t-3xl lg:mx-8 xl:mx-auto max-w-7xl">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Link
                to="/properties"
                className="flex items-center p-5 transition-all bg-white border border-gray-100 rounded-xl hover:shadow-xl hover:border-blue-100 group"
              >
                <div className="p-3 mr-4 transition-colors rounded-full bg-blue-50 group-hover:bg-blue-100">
                  <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                    Browse Properties
                  </h3>
                  <p className="text-sm text-gray-500">
                    Find your next dream vacation rental
                  </p>
                </div>
                <ArrowLongRightIcon className="w-5 h-5 text-gray-400 transition-all group-hover:text-blue-600 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/reservations"
                className="flex items-center p-5 transition-all bg-white border border-gray-100 rounded-xl hover:shadow-xl hover:border-blue-100 group"
              >
                <div className="p-3 mr-4 transition-colors rounded-full bg-blue-50 group-hover:bg-blue-100">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                    My Reservations
                  </h3>
                  <p className="text-sm text-gray-500">
                    View and manage your bookings
                  </p>
                </div>
                <ArrowLongRightIcon className="w-5 h-5 text-gray-400 transition-all group-hover:text-blue-600 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/favorites"
                className="flex items-center p-5 transition-all bg-white border border-gray-100 rounded-xl hover:shadow-xl hover:border-blue-100 group"
              >
                <div className="p-3 mr-4 transition-colors rounded-full bg-blue-50 group-hover:bg-blue-100">
                  <HeartIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                    Favorites
                  </h3>
                  <p className="text-sm text-gray-500">
                    View your saved properties
                  </p>
                </div>
                <ArrowLongRightIcon className="w-5 h-5 text-gray-400 transition-all group-hover:text-blue-600 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section - Improved responsive grid */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-16"
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center p-4 text-center transition-all duration-300 rounded-xl hover:bg-white hover:shadow-md"
              >
                <div className="p-3 mb-3 text-blue-600 rounded-full md:p-4 md:mb-4 bg-blue-50">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="mb-1 text-2xl font-bold text-blue-900 md:mb-2 md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Featured Properties - Improved card display */}
      <div className="py-12 bg-white md:py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-8 text-center md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 md:px-4 md:py-1.5 rounded-full mb-3 md:mb-4"
            >
              <SparklesIcon className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              <span className="font-semibold tracking-wider uppercase text-xxs md:text-xs">
                Featured Listings
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl"
            >
              Exceptional Properties
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto mt-2 text-base text-gray-600 md:mt-4 md:text-xl"
            >
              Discover our handpicked selection of stunning properties designed
              to exceed your expectations
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {propertiesLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden bg-white rounded-lg shadow-lg"
                >
                  <div className="h-56 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 mb-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 mb-2 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-2/3 h-4 mb-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex items-center justify-between">
                      <div className="w-1/3 h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-1/4 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-3 py-12 text-center">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : featuredProperties.length === 0 ? (
              <div className="col-span-3 py-12 text-center">
                <p className="text-gray-500">No properties found</p>
              </div>
            ) : (
              featuredProperties.map((property) => (
                <ErrorBoundary
                  key={property.id}
                  fallbackMessage="Failed to load property"
                >
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
            className="mt-8 text-center md:mt-12"
          >
            <Link
              to="/properties"
              className="relative overflow-hidden group inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-blue-600 text-white font-medium rounded-lg md:rounded-xl transition-all duration-300 hover:bg-blue-700 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>View All Properties</span>
              <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-300 md:w-5 md:h-5 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Services Section - Improved card layout */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-8 text-center md:mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl"
            >
              Our Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl mx-auto mt-2 text-base text-gray-600 md:mt-4 md:text-xl"
            >
              Comprehensive real estate solutions tailored to your needs
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 transition-all duration-300 bg-white border border-gray-100 shadow-lg md:p-8 rounded-xl hover:shadow-xl hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-5 rounded-lg bg-blue-50">
                  <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900 md:mb-4 md:text-xl">
                  {service.title}
                </h3>
                <p className="mb-4 text-sm text-gray-600 md:mb-6 md:text-base">
                  {service.description}
                </p>
                <ul className="space-y-2 md:space-y-3">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 md:text-base">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section - Improved mobile experience */}
      <div className="py-12 bg-white md:py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-8 text-center md:mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl"
            >
              What Our Clients Say
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl mx-auto mt-2 text-base text-gray-600 md:mt-4 md:text-xl"
            >
              Real stories from satisfied customers
            </motion.p>
          </div>

          <div className="relative overflow-hidden">
            <div className="max-w-3xl px-2 mx-auto md:px-4">
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="p-5 shadow-md md:p-8 bg-blue-50 rounded-xl md:rounded-2xl"
                  >
                    <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <img
                          src={testimonials[currentTestimonial].image}
                          alt={testimonials[currentTestimonial].author}
                          className="object-cover w-12 h-12 border-2 border-white rounded-full shadow-md md:w-16 md:h-16 md:border-4"
                        />
                      </div>
                      <div>
                        <div className="flex justify-center mb-3 md:mb-4 md:justify-start">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className="text-sm text-amber-400 md:text-base"
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <blockquote className="mb-3 text-base italic text-gray-700 md:mb-4 md:text-lg">
                          "{testimonials[currentTestimonial].content}"
                        </blockquote>
                        <div className="font-medium text-gray-900">
                          {testimonials[currentTestimonial].author}
                        </div>
                        <div className="text-xs text-blue-600 md:text-sm">
                          {testimonials[currentTestimonial].position}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Improved navigation controls */}
              <div className="flex justify-center mt-6 space-x-2 md:mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${
                      index === currentTestimonial
                        ? "bg-blue-600"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use the imported CTASection component */}
      <CTASection />
    </Layout>
  );
}
