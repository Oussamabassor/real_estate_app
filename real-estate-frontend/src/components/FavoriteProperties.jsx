import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../services/api';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function FavoriteProperties() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        // In a real app, this would call the API
        // const response = await userApi.getFavorites();
        // setFavorites(response.data.data);
        
        // Mock data for development
        setFavorites([
          {
            id: 1,
            property: {
              id: 1,
              title: 'Luxury Apartment in Downtown',
              price: 500000,
              location: 'Downtown',
              images: ['https://picsum.photos/seed/1/600/400'],
              bedrooms: 3,
              bathrooms: 2,
              area: 200,
              type: 'apartment'
            }
          },
          {
            id: 2,
            property: {
              id: 2,
              title: 'Modern Bungalow with Garden',
              price: 750000,
              location: 'Suburban Area',
              images: ['https://picsum.photos/seed/2/600/400'],
              bedrooms: 4,
              bathrooms: 3,
              area: 300,
              type: 'bungalow'
            }
          }
        ]);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, []);
  
  const handleRemoveFavorite = async (favoriteId) => {
    try {
      // In a real app, this would call the API
      // await userApi.removeFavorite(favoriteId);
      
      // Remove from local state
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }
  
  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <HeartIcon className="w-12 h-12 text-gray-300 mx-auto" />
        <p className="mt-4 text-lg font-medium text-gray-900">No favorites yet</p>
        <p className="mt-2 text-gray-500">
          Browse our properties and add your favorites
        </p>
        <Link
          to="/properties"
          className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Browse Properties
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {favorites.map(favorite => (
        <div
          key={favorite.id}
          className="bg-white overflow-hidden rounded-lg shadow transition-shadow hover:shadow-md"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img
                src={favorite.property.images[0]}
                alt={favorite.property.title}
                className="h-48 w-full object-cover"
              />
            </div>
            <div className="p-4 md:w-2/3 flex flex-col justify-between">
              <div>
                <Link
                  to={`/properties/${favorite.property.id}`}
                  className="block text-lg font-medium text-gray-900 hover:text-primary-600"
                >
                  {favorite.property.title}
                </Link>
                <p className="mt-1 text-primary-600 font-medium">${favorite.property.price.toLocaleString()}</p>
                <p className="mt-2 text-gray-500">{favorite.property.location}</p>
                
                <div className="mt-3 flex items-center text-sm text-gray-500 space-x-4">
                  <span>{favorite.property.bedrooms} Bedrooms</span>
                  <span>{favorite.property.bathrooms} Bathrooms</span>
                  <span>{favorite.property.area} m²</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Link
                  to={`/properties/${favorite.property.id}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100"
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}