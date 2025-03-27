import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { propertyApi } from "../services/api";
import PropertyGrid from "../components/PropertyGrid";
import Layout from "../components/Layout";
import {
  AdjustmentsHorizontalIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  PageTransition,
  LoadingSpinner,
  FadeIn,
  SlideIn,
  StaggerChildren,
} from "../components/PageAnimations";

export default function Properties() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    minPrice: "",
    maxPrice: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProperties, setTotalProperties] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Fetch properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyApi.getAll({
        page: currentPage,
        per_page: 12,
        ...filters,
        search: searchQuery,
      });
      
      console.log('API Response:', response);

      // Check if the response has the expected structure
      if (typeof response.data === 'string' || !response.data || !response.data.data) {
        console.error('Invalid API response format, using fallback data');
        
        // Fallback mock data when API fails
        const mockProperties = [
          {
            id: 1,
            title: 'Luxury Apartment',
            description: 'A beautiful property with modern amenities and great location.',
            price: 1200000,
            type: 'apartment',
            bedrooms: 4,
            bathrooms: 3,
            area: 350,
            images: ['https://picsum.photos/seed/1/600/400'],
            location: 'Downtown',
          },
          {
            id: 2,
            title: 'Modern Bungalow',
            description: 'A beautiful property with modern amenities and great location.',
            price: 850000,
            type: 'bungalow',
            bedrooms: 3,
            bathrooms: 2,
            area: 290,
            images: ['https://picsum.photos/seed/2/600/400'],
            location: 'Suburban Area',
          },
          {
            id: 3,
            title: 'City Apartment',
            description: 'A beautiful property with modern amenities and great location.',
            price: 950000,
            type: 'apartment',
            bedrooms: 2,
            bathrooms: 1,
            area: 180,
            images: ['https://picsum.photos/seed/3/600/400'],
            location: 'City Center',
          },
        ];
        
        setProperties(mockProperties);
        setTotalProperties(mockProperties.length);
        setLastPage(1);
        return;
      }
      
      // Ensure consistent property structure
      const normalizedProperties = response.data.data.map(prop => ({
        ...prop,
        // Ensure essential fields exist
        name: prop.name || prop.title,
        title: prop.title || prop.name,
        location: prop.location || 'Unknown location',
        // Convert price to number if it's a string
        price: typeof prop.price === 'string' ? parseFloat(prop.price) : prop.price
      }));

      console.log('Normalized Properties:', normalizedProperties);
      
      setProperties(normalizedProperties);
      setTotalProperties(response.data.total || normalizedProperties.length);
      setLastPage(response.data.last_page || Math.ceil(normalizedProperties.length / 12));
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message || "Failed to fetch properties");
      
      // Provide fallback data when API fails
      const fallbackProperties = [
        {
          id: 1,
          title: 'Luxury Apartment',
          description: 'A beautiful property with modern amenities and great location.',
          price: 1200000,
          type: 'apartment',
          bedrooms: 4,
          bathrooms: 3,
          area: 350,
          images: ['https://picsum.photos/seed/1/600/400'],
          location: 'Downtown',
        },
        {
          id: 2,
          title: 'Modern Bungalow',
          description: 'A beautiful property with modern amenities and great location.',
          price: 850000,
          type: 'bungalow',
          bedrooms: 3,
          bathrooms: 2,
          area: 290,
          images: ['https://picsum.photos/seed/2/600/400'],
          location: 'Suburban Area',
        },
        {
          id: 3,
          title: 'City Apartment',
          description: 'A beautiful property with modern amenities and great location.',
          price: 950000,
          type: 'apartment',
          bedrooms: 2,
          bathrooms: 1,
          area: 180,
          images: ['https://picsum.photos/seed/3/600/400'],
          location: 'City Center',
        },
      ];
      
      setProperties(fallbackProperties);
      setTotalProperties(fallbackProperties.length);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [currentPage, filters, searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProperties();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Filter properties based on current filters
  const filteredProperties = (properties || []).filter((property) => {
    // Debug each property filtering
    console.log('Filtering property:', property.id, property);

    // Skip invalid properties
    if (!property || !property.type || !property.price) {
      console.warn('Invalid property data:', property);
      return false;
    }

    // Type filter
    if (filters.type !== "all" && property.type !== filters.type) {
      return false;
    }
    
    // Price filters (ensure numeric comparison)
    const propertyPrice = Number(property.price);
    const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
    const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;

    if (minPrice && propertyPrice < minPrice) {
      return false;
    }
    
    if (maxPrice && propertyPrice > maxPrice) {
      return false;
    }
    
    return true;
  });

  console.log('Filtered properties count:', filteredProperties.length);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      type: "all",
      minPrice: "",
      maxPrice: "",
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContactClick = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <XMarkIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Properties</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-purple-200 hover:shadow-xl gap-2"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const filterOptions = [
    {
      icon: BuildingOfficeIcon,
      label: "Property Type",
      name: "type",
      type: "select",
      options: [
        { value: "all", label: "All Types" },
        { value: "apartment", label: "Apartments" },
        { value: "bungalow", label: "Bungalows" },
      ],
    },
  ];

  return (
    <AnimatePresence mode="wait">
      <PageTransition key="properties">
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section with Enhanced Background */}
          <FadeIn>
            <div className="relative h-[500px] bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
              {/* Background Image Layer */}
              <div
                className="absolute inset-0 bg-center bg-no-repeat bg-cover"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
                }}
              />
              {/* Overlay Layers */}
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/50 to-blue-950/80"></div>

              {/* Content */}
              <div className="relative flex flex-col justify-center h-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl drop-shadow-lg">
                    Discover Your Dream Property
                  </h1>
                  <p className="max-w-2xl mx-auto text-xl text-white/90 drop-shadow-lg">
                    {totalProperties} exclusive listings waiting for you to explore
                  </p>
                </motion.div>

                {/* Enhanced Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="w-full max-w-3xl mx-auto mt-12"
                >
                  <form onSubmit={handleSearch} className="relative group">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        placeholder="Search by property name or location..."
                        className="w-full px-6 py-4 pr-12 text-white border bg-white/10 backdrop-blur-lg placeholder-white/60 rounded-xl border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <button
                        type="submit"
                        className="absolute p-2 transition-colors -translate-y-1/2 right-2 top-1/2 text-white/60 hover:text-white"
                      >
                        <MagnifyingGlassIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </FadeIn>

          {/* Main Content */}
          <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Filters Section */}
            <SlideIn>
              <div className="p-6 mb-8 bg-white border border-gray-100 shadow-md rounded-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm"
                    >
                      <FunnelIcon className="w-4 h-4" />
                      <span className="font-medium">Filters</span>
                    </button>
                    {Object.values(filters).some(
                      (value) => value !== "" && value !== "all"
                    ) && (
                      <button
                        onClick={resetFilters}
                        className="flex items-center gap-2 px-4 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        <span className="font-medium">Clear</span>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleRefresh}
                    className={`flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    <span className="font-medium">Refresh</span>
                  </button>
                </div>

                {/* Filter Options */}
                {showFilters && (
                  <div className="p-5 border border-gray-100 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      {filterOptions.map((filter) => (
                        <div key={filter.name} className="space-y-2">
                          <label className="flex items-center gap-2 font-medium text-gray-700">
                            <filter.icon className="w-4 h-4 text-purple-500" />
                            {filter.label}
                          </label>
                          <select
                            name={filter.name}
                            value={filters[filter.name]}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all text-gray-800 bg-white"
                          >
                            {filter.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                      {/* Price Range Filters */}
                      <div className="space-y-2">
                        <label className="font-medium text-gray-700">Min Price</label>
                        <input
                          type="number"
                          name="minPrice"
                          value={filters.minPrice}
                          onChange={handleFilterChange}
                          placeholder="Min Price"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-medium text-gray-700">Max Price</label>
                        <input
                          type="number"
                          name="maxPrice"
                          value={filters.maxPrice}
                          onChange={handleFilterChange}
                          placeholder="Max Price"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="flex items-center gap-2 px-4 py-2 text-purple-600 transition-colors hover:text-purple-800"
                      >
                        <span className="font-medium">Apply</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </SlideIn>

            {/* Properties Grid */}
            <StaggerChildren>
              <PropertyGrid
                properties={filteredProperties}
                loading={loading}
                onContactClick={handleContactClick}
              />
            </StaggerChildren>

            {/* Pagination (only show if we have properties) */}
            {filteredProperties.length > 0 && lastPage > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-600 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                {Array.from({ length: lastPage }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? "bg-purple-600 text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === lastPage}
                  className="p-2 text-gray-600 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </AnimatePresence>
  );
}
