import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  MapPinIcon,
  HomeIcon,
  ArrowRightIcon,
  HeartIcon,
  CurrencyDollarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

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
          src={
            property.images && property.images.length > 0
              ? property.images[0]
              : "https://via.placeholder.com/400x300?text=No+Image"
          }
          alt={property.title}
          className="object-cover w-full h-full"
        />

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute px-3 py-1 text-xs font-semibold text-black bg-yellow-500 rounded-full top-4 left-4">
            Featured
          </div>
        )}

        {/* Save/Favorite Button */}
        <button className="absolute p-2 transition-colors bg-white rounded-full shadow-md top-4 right-4 hover:bg-gray-100">
          <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>

        {/* Price Badge */}
        <div className="absolute flex items-center px-4 py-2 space-x-1 bg-white rounded-lg shadow-md bottom-4 left-4">
          <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-blue-900">
            ${formatPrice(property.price)}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        {/* Title */}
        <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-1">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center mb-4 text-gray-600">
          <MapPinIcon className="flex-shrink-0 w-5 h-5 mr-1" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Features */}
        <div className="flex justify-between mb-6 text-gray-700">
          <div className="flex flex-col items-center">
            <span className="font-semibold text-blue-900">
              {property.bedrooms}
            </span>
            <span className="text-xs text-gray-500">Bedrooms</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-blue-900">
              {property.bathrooms}
            </span>
            <span className="text-xs text-gray-500">Bathrooms</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-blue-900">{property.area}</span>
            <span className="text-xs text-gray-500">Sq Ft</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="mb-5 text-sm text-gray-600 line-clamp-2">
          {property.description}
        </p>

        {/* View Details Button */}
        <div className="flex items-center justify-between">
          <Link
            to={`/properties/${property.id}`}
            className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
          >
            View Details
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>

          <Link
            to={`/contact?propertyId=${
              property.id
            }&propertyTitle=${encodeURIComponent(property.title)}`}
            style={{
              backgroundColor: "#c8a55b",
              color: "#0f2c5c",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              fontWeight: "500",
              fontSize: "0.875rem",
              transition: "all 0.3s ease",
            }}
            className="inline-flex items-center hover:bg-amber-400 hover:shadow-md"
          >
            <CalendarIcon className="w-4 h-4 mr-1" />
            Reserve
          </Link>
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
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onContactClick: PropTypes.func.isRequired,
  isFeatured: PropTypes.bool,
};

PropertyCard.defaultProps = {
  isFeatured: false,
};
