import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    MapPinIcon, 
    HomeIcon, 
    ArrowRightIcon,
    HeartIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function PropertyCard({ property, onContactClick, isFeatured }) {
    // Format price with commas
    const formatPrice = (price) => {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
    };
    
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
            {/* Property Image */}
            <div className="relative h-64 overflow-hidden">
                <img 
                    src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                />
                
                {/* Featured Badge */}
                {isFeatured && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-black font-semibold text-xs px-3 py-1 rounded-full">
                        Featured
                    </div>
                )}
                
                {/* Save/Favorite Button */}
                <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                    <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
                </button>
                
                {/* Price Badge */}
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md flex items-center space-x-1">
                    <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-bold text-blue-900">${formatPrice(property.price)}</span>
                </div>
            </div>
            
            {/* Property Details */}
            <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
                
                {/* Location */}
                <div className="flex items-center mb-4 text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-1 flex-shrink-0" />
                    <span className="truncate">{property.location}</span>
                </div>
                
                {/* Features */}
                <div className="flex justify-between mb-6 text-gray-700">
                    <div className="flex flex-col items-center">
                        <span className="font-semibold text-blue-900">{property.bedrooms}</span>
                        <span className="text-xs text-gray-500">Bedrooms</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-semibold text-blue-900">{property.bathrooms}</span>
                        <span className="text-xs text-gray-500">Bathrooms</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-semibold text-blue-900">{property.area}</span>
                        <span className="text-xs text-gray-500">Sq Ft</span>
                    </div>
                </div>
                
                {/* Short Description */}
                <p className="text-gray-600 mb-5 text-sm line-clamp-2">
                    {property.description}
                </p>
                
                {/* View Details Button */}
                <div className="flex justify-between items-center">
                    <Link 
                        to={`/properties/${property.id}`}
                        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                    >
                        View Details
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                    
                    <button
                        onClick={() => onContactClick(property.id)}
                        style={{
                            backgroundColor: "#c8a55b",
                            color: "#0f2c5c",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.5rem",
                            fontWeight: "500",
                            fontSize: "0.875rem",
                            transition: "all 0.3s ease"
                        }}
                        className="hover:bg-amber-400 hover:shadow-md"
                    >
                        Contact
                    </button>
                </div>
            </div>
        </div>
    );
}

PropertyCard.propTypes = {
    property: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        location: PropTypes.string.isRequired,
        bedrooms: PropTypes.number,
        bathrooms: PropTypes.number,
        area: PropTypes.number,
        description: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    onContactClick: PropTypes.func.isRequired,
    isFeatured: PropTypes.bool
};

PropertyCard.defaultProps = {
    isFeatured: false
};