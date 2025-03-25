import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { propertyApi } from '../services/api';
import PropertyCard from './PropertyCard';
import { NoSymbolIcon } from '@heroicons/react/24/outline';

export default function FavoriteProperties() {
  const { data: favorites, isLoading, isError } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => propertyApi.getFavorites(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
        <NoSymbolIcon className="w-12 h-12 mb-2" />
        <p>Failed to load favorites</p>
      </div>
    );
  }

  if (!favorites?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
        <NoSymbolIcon className="w-12 h-12 mb-2" />
        <p>No favorite properties yet</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.data.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <PropertyCard property={property} />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}