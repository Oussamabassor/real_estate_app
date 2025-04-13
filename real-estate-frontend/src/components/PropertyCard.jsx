import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  HomeIcon, 
  BuildingOfficeIcon, 
  BeakerIcon, 
  ArrowsPointingOutIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import PropTypes from 'prop-types';

// Add the missing utility function
const getPropertyTypeIcon = (type) => {
  const typeMap = {
    'apartment': BuildingOfficeIcon,
    'house': HomeIcon,
    'villa': HomeIcon,
    'office': BuildingOfficeIcon,
    'land': ArrowsPointingOutIcon,
    'commercial': BuildingOfficeIcon,
    'studio': BuildingOfficeIcon,
    'industrial': BeakerIcon,
    'bungalow': HomeIcon
  };
  
  return typeMap[type?.toLowerCase()] || HomeIcon;
};

// Format price utility function if needed
const formatPrice = (price) => {
  return `$${price?.toLocaleString() || 0}`;
};

// Utility functions remain the same as in previous version

const PropertyCard = ({ 
  property, 
  onContactClick, 
  isFeatured = false,
  onFavoriteToggle 
}) => {
  const {
    id,
    title = 'Untitled Property',
    location = 'Location not specified',
    type,
    price,
    description,
    images,
    bedrooms,
    bathrooms,
    area,
    created_at,
    discount_percentage,
    is_favorite = false
  } = property;

  // Compute derived states
  const isNew = created_at 
    ? new Date(created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    : false;
  const hasDiscount = discount_percentage > 0;
  const PropertyTypeIcon = getPropertyTypeIcon(type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="relative flex flex-col overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-200 transform transition-all duration-300 group"
    >
      {/* Rest of the component remains the same */}

      {/* Price and Contact Section */}
      <div className="flex items-center justify-between p-5 pt-0">
        <div className="text-2xl font-bold text-primary-800">
          {formatPrice(price)}
        </div>
        <button
          onClick={() => onContactClick(id)}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:scale-95"
        >
          View Details
        </button>
      </div>

      {/* Premium Ribbon */}
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-1 text-xs font-bold transform translate-x-1/2 -translate-y-1/2 rotate-45 origin-bottom-right">
          PREMIUM
        </div>
      )}
    </motion.div>
  );
};


PropertyCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    location: PropTypes.string,
    type: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
    area: PropTypes.number,
    created_at: PropTypes.string,
    discount_percentage: PropTypes.number,
    is_favorite: PropTypes.bool
  }).isRequired,
  onContactClick: PropTypes.func.isRequired,
  isFeatured: PropTypes.bool,
  onFavoriteToggle: PropTypes.func
};

PropertyCard.defaultProps = {
  isFeatured: false,
  onFavoriteToggle: () => {}
};

export default PropertyCard;