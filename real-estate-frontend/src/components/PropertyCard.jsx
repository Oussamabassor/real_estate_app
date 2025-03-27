import React from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, HomeIcon } from '@heroicons/react/24/outline';
import FavoriteButton from './FavoriteButton';
import PropTypes from 'prop-types';

const PropertyCard = ({ property, onContactClick }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle both title and name properties for backwards compatibility
  const propertyTitle = property.title || property.name || 'Untitled Property';
  const propertyLocation = property.location || 'Location not specified';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all group"
    >
      <div className="relative">
        {/* Property Image */}
        <img
          src={property.images?.[0] || `https://source.unsplash.com/800x600/?property,${property.type}`}
          alt={propertyTitle}
          className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
        />
        {/* Favorite Button */}
        <div className="absolute top-2 right-2">
          <FavoriteButton propertyId={property.id} />
        </div>
        {/* Property Type Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-black/50 backdrop-blur-sm rounded-full">
            <HomeIcon className="w-3 h-3 mr-1" />
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Property Name */}
        <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-1">
          {propertyTitle}
        </h3>

        {/* Location */}
        <div className="flex items-center mb-2 text-gray-600">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span className="text-sm">{propertyLocation}</span>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center justify-between">
          {/* Price */}
          <div className="text-xl font-bold text-purple-600">
            {formatPrice(property.price)}
          </div>

          {/* Contact Button */}
          <button
            onClick={() => onContactClick(property.id)}
            className="px-4 py-2 text-sm font-medium text-white transition-all bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    title: PropTypes.string, // Added title as an alternative
    price: PropTypes.number,
    description: PropTypes.string,
    location: PropTypes.string,
    type: PropTypes.string,
    images: PropTypes.array,
  }).isRequired,
  onContactClick: PropTypes.func
};

export default PropertyCard;