import React from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, HomeIcon, BuildingOfficeIcon, BeakerIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import FavoriteButton from './FavoriteButton';
import PropTypes from 'prop-types';

const PropertyCard = ({ property, onContactClick, isFeatured }) => {
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
  
  // Determine if the property is new (less than 7 days old)
  const isNew = property.created_at ? 
    new Date(property.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : 
    false;
    
  // Determine if the property has a discount
  const hasDiscount = property.discount_percentage || property.discount_price;
  
  // Icon based on property type
  const PropertyTypeIcon = property.type === 'apartment' ? BuildingOfficeIcon : HomeIcon;
  
  // Get background color based on property type
  const getTypeColor = (type) => {
    const typeColors = {
      'apartment': 'bg-blue-500',
      'house': 'bg-emerald-500',
      'villa': 'bg-purple-500',
      'bungalow': 'bg-amber-500',
      'condo': 'bg-rose-500',
    };
    return typeColors[type] || 'bg-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden bg-white rounded-2xl shadow-elegant hover:shadow-hover transition-all duration-300 group border border-gray-100 relative h-full flex flex-col"
    >
      {/* Premium ribbon for featured properties */}
      {isFeatured && (
        <div className="absolute -right-12 top-6 z-10 bg-gradient-to-r from-gold-500 to-gold-400 text-white py-1 px-12 transform rotate-45 shadow-md text-xs font-bold tracking-wider">
          PREMIUM
        </div>
      )}
      
      <div className="relative overflow-hidden flex-shrink-0">
        {/* Property Image */}
        <div className="h-64 overflow-hidden">
          <img
            src={property.images?.[0] || `https://source.unsplash.com/800x600/?property,${property.type}`}
            alt={propertyTitle}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 group-hover:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center px-3 py-1.5 bg-primary-800 text-white rounded-lg shadow-lg backdrop-blur-sm"
            >
              <SparklesIcon className="w-4 h-4 mr-1 text-gold-300 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide">NEW</span>
            </motion.div>
          )}
          
          {hasDiscount && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center px-3 py-1.5 bg-gradient-to-r from-gold-600 to-gold-500 text-white rounded-lg shadow-lg"
            >
              <span className="text-xs font-semibold tracking-wide">
                {property.discount_percentage 
                  ? `${property.discount_percentage}% OFF` 
                  : 'SPECIAL OFFER'}
              </span>
            </motion.div>
          )}
        </div>
        
        {/* Favorite Button */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton propertyId={property.id} />
        </div>
        
        {/* Property Type Badge and Price */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border border-white/10 ${getTypeColor(property.type)} text-white`}>
              <PropertyTypeIcon className="w-3.5 h-3.5 mr-1.5" />
              {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
            </span>
            <span className="text-xl font-bold drop-shadow-md">
              {formatPrice(property.price)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        {/* Property Name */}
        <h3 className="mb-2 text-xl font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-800 transition-colors duration-300">
          {propertyTitle}
        </h3>

        {/* Location */}
        <div className="flex items-center mb-3 text-gray-600">
          <MapPinIcon className="w-4 h-4 mr-1.5 text-gold-500 flex-shrink-0" />
          <span className="text-sm truncate">{propertyLocation}</span>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-gray-600 line-clamp-2 flex-grow">
          {property.description}
        </p>

        {/* Property Features */}
        <div className="flex items-center justify-between px-2 py-3 mb-4 text-sm text-gray-600 bg-gray-50 rounded-xl">
          {property.bedrooms && (
            <div className="flex flex-col items-center gap-1">
              <HomeIcon className="w-5 h-5 text-primary-700" />
              <span className="font-medium">{property.bedrooms} Beds</span>
            </div>
          )}
          
          {property.bathrooms && (
            <div className="flex flex-col items-center gap-1">
              <BeakerIcon className="w-5 h-5 text-primary-700" />
              <span className="font-medium">{property.bathrooms} Baths</span>
            </div>
          )}
          
          {property.area && (
            <div className="flex flex-col items-center gap-1">
              <ArrowsPointingOutIcon className="w-5 h-5 text-primary-700" />
              <span className="font-medium">{property.area} m²</span>
            </div>
          )}
        </div>

        {/* Contact Button */}
        <button
          onClick={() => onContactClick(property.id)}
          className="w-full py-3 text-sm font-medium text-white transition-all bg-gradient-to-r from-primary-800 to-primary-900 rounded-xl hover:from-primary-700 hover:to-primary-800 focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 shadow-md hover:shadow-lg hover:scale-[1.02] relative overflow-hidden group"
        >
          <span className="relative z-10">View Details</span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
        </button>
      </div>
    </motion.div>
  );
};

// PropTypes remain the same
PropertyCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string,
    location: PropTypes.string,
    type: PropTypes.string,
    images: PropTypes.array,
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
    area: PropTypes.number,
    created_at: PropTypes.string,
    discount_percentage: PropTypes.number,
    discount_price: PropTypes.number
  }).isRequired,
  onContactClick: PropTypes.func,
  isFeatured: PropTypes.bool
};

PropertyCard.defaultProps = {
  isFeatured: false
};

export default PropertyCard;