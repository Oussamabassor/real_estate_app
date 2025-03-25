import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import PropertyCard from './PropertyCard';

const PropertyGrid = ({ properties = [], loading, onContactClick }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 0.8
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.2
            }
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden h-[600px] border border-purple-100"
                        >
                            <div className="h-[240px] bg-gradient-to-r from-purple-50 to-purple-100 animate-pulse rounded-t-2xl" />
                            <div className="p-6 space-y-4">
                                <div className="h-4 bg-purple-100 rounded w-1/2 animate-pulse" />
                                <div className="h-8 bg-purple-100 rounded w-3/4 animate-pulse" />
                                <div className="h-16 bg-purple-100 rounded animate-pulse" />
                                <div className="grid grid-cols-2 gap-3">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-10 bg-purple-100 rounded-lg animate-pulse" />
                                    ))}
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <div className="h-12 bg-purple-100 rounded-xl flex-1 animate-pulse" />
                                    <div className="h-12 w-12 bg-purple-100 rounded-xl animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!properties || properties.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16 bg-white rounded-2xl shadow-lg border border-purple-100"
                >
                    <BuildingOfficeIcon className="mx-auto h-16 w-16 text-purple-400" />
                    <h3 className="mt-6 text-xl font-semibold text-gray-900">
                        No properties found
                    </h3>
                    <p className="mt-2 text-gray-500 max-w-sm mx-auto">
                        We couldn't find any properties matching your criteria. Try adjusting your search filters or check back later.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-6 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-purple-200 hover:shadow-xl"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        Modify Search
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key="property-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
                >
                    {properties.map((property, index) => (
                        <motion.div
                            key={property.id || index}
                            variants={itemVariants}
                            layout
                            className="h-full"
                        >
                            <PropertyCard
                                property={property}
                                onContactClick={onContactClick}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

PropertyGrid.propTypes = {
    properties: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        price: PropTypes.number,
        description: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.string),
        bedrooms: PropTypes.number,
        bathrooms: PropTypes.number,
        area: PropTypes.number,
        type: PropTypes.string,
        status: PropTypes.string,
    })),
    loading: PropTypes.bool,
    onContactClick: PropTypes.func
};

export default PropertyGrid; 