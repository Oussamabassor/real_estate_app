import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { faBath, faBed, faHeart, faShareNodes, faRuler } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HomeIcon, MapPinIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const DEFAULT_IMAGE = 'https://picsum.photos/600/400';

export const FeatureItem = ({ icon, value, label, iconType = "fontawesome" }) => (
    <motion.div
        whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 1)" }}
        className="flex items-center justify-center bg-white/80 px-3 py-2 rounded-lg border border-purple-100 hover:border-purple-300 hover:shadow-sm transition-all duration-300"
    >
        {iconType === "fontawesome" ? (
            <FontAwesomeIcon icon={icon} className="w-4 h-4 text-purple-500 transition-colors duration-300" />
        ) : (
            <div className="w-4 h-4 text-purple-500 transition-colors duration-300">
                {icon}
            </div>
        )}
        <span className="ml-2 text-sm font-medium text-gray-700">{value} {label}</span>
    </motion.div>
);

FeatureItem.propTypes = {
    icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
    iconType: PropTypes.oneOf(['fontawesome', 'heroicon'])
};

export default function PropertyCard({ property }) {
    const {
        id,
        title,
        description,
        price,
        type,
        bedrooms,
        bathrooms,
        area,
        images,
        floor,
        location,
        status = 'For Sale'
    } = property;

    const [imageError, setImageError] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "50px" }}
            whileHover={{
                y: -8,
                transition: {
                    duration: 0.3,
                    ease: "easeOut"
                }
            }}
            className="relative h-full bg-white rounded-2xl shadow-md group hover:shadow-xl transition-all duration-300 border border-purple-100 hover:border-purple-200 flex flex-col transform-gpu will-change-transform"
        >
            {/* Image Section */}
            <div className="relative h-[240px]">
                <div className="absolute inset-0 bg-purple-50 animate-pulse rounded-t-2xl"
                    style={{ opacity: imageLoaded ? 0 : 1 }} />
                <motion.div
                    className="relative h-full overflow-hidden rounded-t-2xl"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <img
                        src={!imageError && images?.[0] ? images[0] : DEFAULT_IMAGE}
                        alt={title}
                        className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                        onError={(e) => {
                            e.target.onerror = null;
                            setImageError(true);
                            e.target.src = DEFAULT_IMAGE;
                        }}
                        onLoad={handleImageLoad}
                        style={{ opacity: imageLoaded ? 1 : 0 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
                </motion.div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <motion.span
                        whileHover={{ scale: 1.05, y: -1 }}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-purple-500/90 backdrop-blur-sm rounded-lg shadow-lg group-hover:bg-purple-500/95"
                    >
                        {status}
                    </motion.span>
                    <motion.span
                        whileHover={{ scale: 1.05, y: -1 }}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600/90 backdrop-blur-sm rounded-lg shadow-lg group-hover:bg-purple-600/95"
                    >
                        {type === 'bungalow' ? 'Bungalow' : 'Apartment'}
                    </motion.span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                        whileHover={{ scale: 1.1, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsLiked(!isLiked)}
                        className={`p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 ${isLiked
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-white/90 text-gray-600 hover:bg-white hover:text-purple-500 hover:shadow-lg'
                            }`}
                        aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                    >
                        <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-purple-500 hover:shadow-lg transition-all duration-300"
                        aria-label="Share property"
                    >
                        <FontAwesomeIcon icon={faShareNodes} className="w-4 h-4" />
                    </motion.button>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-4 left-4 transform group-hover:translate-y-[-2px] transition-transform duration-300">
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-purple-100 group-hover:border-purple-200 group-hover:shadow-xl transition-all duration-300"
                    >
                        <span className="text-lg font-bold text-purple-900">
                            {formatPrice(price)}
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow p-6 transform group-hover:scale-[1.01] transition-transform duration-300">
                {/* Location */}
                {location && (
                    <div className="flex items-center text-purple-500 text-sm mb-3 group-hover:translate-x-0.5 transition-transform duration-300">
                        <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{location}</span>
                    </div>
                )}

                {/* Title */}
                <Link
                    to={`/properties/${id}`}
                    className="group/title"
                    aria-label={`View details for ${title}`}
                >
                    <motion.h3
                        whileHover={{ x: 4 }}
                        className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover/title:text-purple-600 transition-all duration-300"
                    >
                        {title}
                    </motion.h3>
                </Link>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-grow group-hover:text-gray-700 transition-colors duration-300">
                    {description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <FeatureItem icon={faBed} value={bedrooms} label="Beds" />
                    <FeatureItem icon={faBath} value={bathrooms} label="Baths" />
                    <FeatureItem icon={faRuler} value={area} label="m²" />
                    {type === 'apartment' && floor && (
                        <FeatureItem icon={<HomeIcon />} value={`Floor ${floor}`} label="" iconType="heroicon" />
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-auto transform group-hover:translate-y-[-2px] transition-transform duration-300">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                    >
                        <Link
                            to={`/properties/${id}`}
                            className="w-full inline-flex items-center justify-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-0.5 transform-gpu"
                        >
                            View Details
                            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform duration-300" />
                        </Link>
                    </motion.div>
                    <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 rounded-xl border border-purple-200 hover:border-purple-500 hover:bg-purple-50 text-purple-500 hover:text-purple-600 transition-all duration-300 hover:shadow-md"
                        aria-label="View on map"
                    >
                        <MapPinIcon className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

PropertyCard.propTypes = {
    property: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        type: PropTypes.oneOf(['apartment', 'bungalow']).isRequired,
        bedrooms: PropTypes.number.isRequired,
        bathrooms: PropTypes.number.isRequired,
        area: PropTypes.number.isRequired,
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
        floor: PropTypes.number,
        location: PropTypes.string,
        status: PropTypes.string,
    }).isRequired,
};