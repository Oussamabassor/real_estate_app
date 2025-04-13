import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks';
import Layout from '../components/Layout';
import PropertyCard from '../components/PropertyCard';
import {
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    CurrencyDollarIcon,
    HomeModernIcon,
    ArrowLongRightIcon,
    HeartIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function Properties() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalProperties, setTotalProperties] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [propertyType, setPropertyType] = useState(searchParams.get('type') || 'all');
    const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'all');
    const [selectedPrice, setSelectedPrice] = useState(searchParams.get('price') || 'all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    // Define filter options (matching Home page)
    const propertyTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'apartment', label: 'Apartments' },
        { value: 'house', label: 'Houses' },
        { value: 'villa', label: 'Villas' },
        { value: 'condo', label: 'Condos' },
    ];
    
    const locations = [
        { value: 'all', label: 'All Locations' },
        { value: 'downtown', label: 'Downtown' },
        { value: 'suburban', label: 'Suburban Area' },
        { value: 'beach', label: 'Beachfront' },
        { value: 'mountain', label: 'Mountain View' },
    ];
    
    const priceRanges = [
        { value: 'all', label: 'Any Price' },
        { value: '100000-500000', label: 'Up to $500,000' },
        { value: '500000-1000000', label: 'Up to $1,000,000' },
        { value: '1000000+', label: 'Luxury' },
    ];

    // Fetch properties
    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            
            // Mock data - replace with API call when ready
            const mockProperties = [
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
                    is_featured: true
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
                    is_featured: true
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
                    is_featured: false
                },
                {
                    id: 4,
                    title: "Urban Loft Apartment",
                    price: 620000,
                    location: "Chicago, Illinois",
                    bedrooms: 2,
                    bathrooms: 2,
                    area: 1200,
                    description: "Stylish loft in the heart of the city with exposed brick walls, high ceilings, and industrial-chic design elements.",
                    type: "apartment",
                    images: ["https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"],
                    is_featured: false
                },
                {
                    id: 5,
                    title: "Waterfront Estate",
                    price: 3200000,
                    location: "Lake Tahoe, Nevada",
                    bedrooms: 6,
                    bathrooms: 5,
                    area: 5600,
                    description: "Magnificent lakefront estate with private dock, theater room, wine cellar, and panoramic water views from every room.",
                    type: "house",
                    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"],
                    is_featured: true
                },
                {
                    id: 6,
                    title: "Desert Oasis Villa",
                    price: 1800000,
                    location: "Scottsdale, Arizona",
                    bedrooms: 4,
                    bathrooms: 4.5,
                    area: 3800,
                    description: "Modern desert retreat with infinity pool, outdoor kitchen, fire pit, and breathtaking mountain and sunset views.",
                    type: "villa",
                    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"],
                    is_featured: false
                }
            ];

            // Filter properties based on search params
            let filteredProperties = mockProperties;
            
            if (searchQuery) {
                filteredProperties = filteredProperties.filter(property => 
                    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    property.description.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            
            if (propertyType !== 'all') {
                filteredProperties = filteredProperties.filter(property => 
                    property.type === propertyType
                );
            }
            
            if (selectedLocation !== 'all') {
                // Simple mock location filter - in a real app you'd have more specific location data
                filteredProperties = filteredProperties.filter(property => 
                    property.location.toLowerCase().includes(selectedLocation)
                );
            }
            
            if (selectedPrice !== 'all') {
                const [min, max] = selectedPrice.split('-').map(Number);
                filteredProperties = filteredProperties.filter(property => {
                    if (selectedPrice === '1000000+') {
                        return property.price >= 1000000;
                    } else {
                        return property.price >= min && property.price <= max;
                    }
                });
            }

            setTotalProperties(filteredProperties.length);
            setProperties(filteredProperties);
            
            // Simulate API delay
            setTimeout(() => {
                setLoading(false);
            }, 800);
        };
        
        fetchProperties();
    }, [searchQuery, propertyType, selectedLocation, selectedPrice]);

    const handleSearch = (e) => {
        e.preventDefault();
        
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (propertyType !== 'all') params.append('type', propertyType);
        if (selectedLocation !== 'all') params.append('location', selectedLocation);
        if (selectedPrice !== 'all') params.append('price', selectedPrice);
        
        setSearchParams(params);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <Layout>
            {/* Enhanced Hero Section */}
            <div className="relative">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* Enhanced gradient overlay */}
                    <div style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        background: 'linear-gradient(135deg, rgba(15,44,92,0.97), rgba(26,58,108,0.85))',
                        zIndex: 1
                    }}></div>
                    
                    {/* Decorative patterns */}
                    <div className="absolute inset-0 opacity-10 z-0">
                        <div className="absolute top-0 left-0 w-full h-32 bg-white opacity-5 transform -skew-y-6"></div>
                        <div className="absolute bottom-0 right-0 w-full h-32 bg-white opacity-5 transform skew-y-6"></div>
                    </div>
                    
                    {/* Geometric decorations */}
                    <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full border-2 border-white opacity-10 z-0"></div>
                    <div className="absolute bottom-1/3 left-1/3 w-40 h-40 rounded-full border border-white opacity-10 z-0"></div>
                    
                    {/* Hero background image */}
                    <img 
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=1350" 
                        alt="Properties" 
                        className="w-full h-full object-cover"
                        style={{ opacity: 0.6, position: 'relative' }}
                    />
                </div>
                
                <div className="relative z-10 container mx-auto px-4 pt-36 pb-20 text-center">
                    {/* Breadcrumb navigation */}
                    <motion.nav 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6 flex justify-center"
                    >
                        <ol className="flex items-center space-x-2 text-sm text-yellow-300">
                            <li><Link to="/" className="hover:text-yellow-200">Home</Link></li>
                            <li><span className="mx-2">/</span></li>
                            <li className="font-medium">Properties</li>
                        </ol>
                    </motion.nav>
                    
                    {/* Golden accent line */}
                    <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex justify-center mb-8"
                    >
                        <div style={{ height: "2px", width: "80px", backgroundColor: "#c8a55b", margin: "0 auto" }}></div>
                    </motion.div>
                    
                    {/* Animated heading */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                        style={{ 
                            textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                        }}
                    >
                        Exclusive <span style={{ color: "#c8a55b" }}>Properties</span> Collection
                    </motion.h1>
                    
                    {/* Animated description */}
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto"
                    >
                        Discover exceptional properties that match your lifestyle and aspirations in the most desirable locations
                    </motion.p>
                    
                    {/* Property stats */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex justify-center space-x-10"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white">{totalProperties || "100"}+</span>
                            <span className="text-sm text-blue-100">Properties</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white">24</span>
                            <span className="text-sm text-blue-100">Cities</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white">1.2k+</span>
                            <span className="text-sm text-blue-100">Happy Clients</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Rest of the component */}
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    {/* Search and Filters */}
                    <div className="mb-8">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <form onSubmit={handleSearch}>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by location, property name..."
                                            className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="md:hidden">
                                        <button 
                                            type="button" 
                                            className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl text-gray-700"
                                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        >
                                            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                                            Filters
                                        </button>
                                    </div>
                                    
                                    <div className={`${isFilterOpen ? 'block' : 'hidden'} md:flex md:flex-1 md:items-center md:space-x-4 flex-col md:flex-row space-y-4 md:space-y-0`}>
                                        <div className="flex-1">
                                            <select
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 appearance-none transition-all"
                                                value={propertyType}
                                                onChange={(e) => setPropertyType(e.target.value)}
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                                    backgroundPosition: `right 0.5rem center`,
                                                    backgroundRepeat: `no-repeat`,
                                                    backgroundSize: `1.5em 1.5em`
                                                }}
                                            >
                                                {propertyTypes.map((type) => (
                                                    <option key={type.value} value={type.value}>{type.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <select
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 appearance-none transition-all"
                                                value={selectedLocation}
                                                onChange={(e) => setSelectedLocation(e.target.value)}
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                                    backgroundPosition: `right 0.5rem center`,
                                                    backgroundRepeat: `no-repeat`,
                                                    backgroundSize: `1.5em 1.5em`
                                                }}
                                            >
                                                {locations.map((location) => (
                                                    <option key={location.value} value={location.value}>{location.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <select
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 appearance-none transition-all"
                                                value={selectedPrice}
                                                onChange={(e) => setSelectedPrice(e.target.value)}
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                                    backgroundPosition: `right 0.5rem center`,
                                                    backgroundRepeat: `no-repeat`,
                                                    backgroundSize: `1.5em 1.5em`
                                                }}
                                            >
                                                {priceRanges.map((price) => (
                                                    <option key={price.value} value={price.value}>{price.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        style={{
                                            backgroundColor: "#0f2c5c",
                                            color: "#ffffff",
                                            padding: "0.75rem 1.5rem",
                                            borderRadius: "0.75rem",
                                            fontWeight: "600",
                                            minWidth: "120px"
                                        }}
                                        className="hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg"
                                    >
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{properties.length}</span> properties
                                {searchQuery && <span> for "<span className="text-blue-600">{searchQuery}</span>"</span>}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Sort by:</span>
                            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Newest</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Most Popular</option>
                            </select>
                        </div>
                    </div>

                    {/* Properties Grid */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {loading ? (
                            // Skeleton Loading Cards
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg">
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
                        ) : properties.length === 0 ? (
                            // No Results
                            <div className="col-span-full py-12 text-center">
                                <HomeModernIcon className="mx-auto h-16 w-16 text-gray-300" />
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">No properties found</h3>
                                <p className="mt-2 text-gray-600">Try adjusting your search criteria or clear filters</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setPropertyType('all');
                                        setSelectedLocation('all');
                                        setSelectedPrice('all');
                                        setSearchParams({});
                                    }}
                                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            // Property Cards
                            properties.map((property) => (
                                <motion.div key={property.id} variants={itemVariants}>
                                    <PropertyCard 
                                        property={property} 
                                        onContactClick={() => {}} 
                                        isFeatured={property.is_featured}
                                    />
                                </motion.div>
                            ))
                        )}
                    </motion.div>

                    {/* Pagination */}
                    {properties.length > 0 && (
                        <div className="mt-12 flex justify-center">
                            <nav className="inline-flex shadow-sm rounded-lg">
                                <button
                                    className="px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeftIcon className="h-5 w-5" />
                                </button>
                                <button className="px-4 py-2 border-t border-b border-gray-300 bg-blue-50 text-blue-600 font-medium">
                                    1
                                </button>
                                <button className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                                    2
                                </button>
                                <button className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                                    3
                                </button>
                                <button className="px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                                    <ChevronRightIcon className="h-5 w-5" />
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Contact CTA Section */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div style={{ width: "48px", height: "2px", backgroundColor: "#c8a55b", margin: "0 auto 1rem" }}></div>
                        <h2 style={{ fontSize: "2.25rem", fontWeight: "700", color: "#0f2c5c", marginBottom: "1rem" }}>
                            Need Help Finding Your Dream Home?
                        </h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Our team of experts is ready to guide you through every step of your property search
                        </p>
                        <Link 
                            to="/contact" 
                            style={{
                                backgroundColor: "#c8a55b",
                                color: "#0f2c5c",
                                padding: "0.875rem 2rem",
                                borderRadius: "0.5rem",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                                transition: "all 0.3s ease"
                            }}
                            className="hover:bg-amber-400 hover:shadow-lg"
                        >
                            Contact Us
                            <ArrowLongRightIcon className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
