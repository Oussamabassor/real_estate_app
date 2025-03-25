import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { propertyApi } from "../services/api";
import PropertyGrid from "../components/PropertyGrid";
import Layout from "../components/Layout";
import {
  AdjustmentsHorizontalIcon,
  BuildingOfficeIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  HomeModernIcon,
  BeakerIcon,
  Square2StackIcon,
  MapPinIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useProperties } from "../hooks/useProperties";
import {
  PageTransition,
  LoadingSpinner,
  FadeIn,
  SlideIn,
  StaggerChildren,
  StaggerItem,
} from "../components/PageAnimations";

export default function Properties() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    minArea: "",
    maxArea: "",
    sortBy: "price_asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useProperties(currentPage, 12);
  const properties = data?.properties || [];
  const totalProperties = data?.total || 0;
  const lastPage = data?.lastPage || 1;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredProperties = properties
    .filter((property) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !property.title.toLowerCase().includes(query) &&
          !property.description.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Type filter
      if (filters.type !== "all" && property.property_type !== filters.type) {
        return false;
      }

      // Price filters
      if (filters.minPrice && property.price < Number(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && property.price > Number(filters.maxPrice)) {
        return false;
      }

      // Bedroom filter
      if (filters.bedrooms && property.bedrooms < Number(filters.bedrooms)) {
        return false;
      }

      // Bathroom filter
      if (filters.bathrooms && property.bathrooms < Number(filters.bathrooms)) {
        return false;
      }

      // Area filters
      if (filters.minArea && property.area < Number(filters.minArea)) {
        return false;
      }
      if (filters.maxArea && property.area > Number(filters.maxArea)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "bedrooms_desc":
          return b.bedrooms - a.bedrooms;
        case "area_desc":
          return b.area - a.area;
        default:
          return 0;
      }
    });

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
      bedrooms: "",
      bathrooms: "",
      minArea: "",
      maxArea: "",
      sortBy: "price_asc",
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
    navigate("/contact", { state: { propertyId } });
  };

  if (isLoading) {
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
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button
              onClick={() => refetch()}
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
    {
      icon: HomeModernIcon,
      label: "Bedrooms",
      name: "bedrooms",
      type: "select",
      options: [
        { value: "", label: "Any" },
        { value: "1", label: "1+" },
        { value: "2", label: "2+" },
        { value: "3", label: "3+" },
        { value: "4", label: "4+" },
        { value: "5", label: "5+" },
      ],
    },
    {
      icon: BeakerIcon,
      label: "Bathrooms",
      name: "bathrooms",
      type: "select",
      options: [
        { value: "", label: "Any" },
        { value: "1", label: "1+" },
        { value: "2", label: "2+" },
        { value: "3", label: "3+" },
        { value: "4", label: "4+" },
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
                    {totalProperties} exclusive listings waiting for you to
                    explore
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
                        placeholder="Search by property name or description..."
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
              <PropertyGrid properties={filteredProperties} loading={false} />
            </StaggerChildren>

            {/* Pagination */}
            {lastPage > 1 && (
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
