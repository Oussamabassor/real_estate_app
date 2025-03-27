import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks';
import toast from 'react-hot-toast';
import { propertyApi } from '../services/api';

export default function FavoriteButton({ propertyId, initialIsFavorite = false }) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    setIsLoading(true);
    try {
      const response = await propertyApi.toggleFavorite(propertyId);
      setIsFavorite(response.data.isFavorite);
      toast.success(response.data.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      toast.error('Failed to update favorites');
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors duration-200 ${
        isFavorite
          ? 'bg-primary-50 text-primary-600'
          : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-primary-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? (
        <HeartIconSolid className="w-6 h-6" />
      ) : (
        <HeartIcon className="w-6 h-6" />
      )}
    </motion.button>
  );
}

FavoriteButton.propTypes = {
  propertyId: PropTypes.number.isRequired,
  initialIsFavorite: PropTypes.bool
};