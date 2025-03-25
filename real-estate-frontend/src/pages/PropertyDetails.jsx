import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  MapPinIcon,
  HomeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShareIcon,
  ArrowLeftIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserIcon,
  StarIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { propertyApi } from '../services/api';
import ReservationForm from '../components/ReservationForm';
import FavoriteButton from '../components/FavoriteButton';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getById(id).then(res => res.data)
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load property details</p>
            <Link to="/properties" className="text-primary-600 hover:text-primary-700">
              ← Back to Properties
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Image Gallery */}
        <div className="relative h-[60vh] bg-gray-900">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={property.images[currentImageIndex]}
              alt={`Property image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>

          {/* Image Navigation */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={prevImage}
              className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Back Button and Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Link
              to="/properties"
              className="flex items-center px-4 py-2 bg-black/30 text-white rounded-lg hover:bg-black/50 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back
            </Link>
            <div className="flex items-center space-x-2">
              <FavoriteButton propertyId={property.id} initialIsFavorite={property.is_favorited} />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard!');
                }}
                className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <ShareIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/30 text-white rounded-lg">
            {currentImageIndex + 1} / {property.images.length}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Property Details */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                  <p className="text-2xl font-bold text-primary-600">${property.price}/night</p>
                </div>
                <div className="flex items-center text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    {property.location}
                  </div>
                  <div className="flex items-center">
                    <HomeIcon className="w-5 h-5 mr-2" />
                    {property.property_type}
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About this property</h2>
                <p className="text-gray-600">{property.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {property.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center p-4 bg-white rounded-lg shadow-sm"
                    >
                      <StarIcon className="w-5 h-5 text-primary-600 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Host Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Host</h2>
                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{property.owner.name}</h3>
                      <p className="text-gray-500 text-sm">Host since {new Date(property.owner.created_at).getFullYear()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {showContact ? (
                      <div className="space-y-2">
                        <a
                          href={`tel:${property.owner.phone}`}
                          className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                        >
                          <PhoneIcon className="w-5 h-5 mr-2" />
                          Call Host
                        </a>
                        <a
                          href={`mailto:${property.owner.email}`}
                          className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                        >
                          <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                          Message Host
                        </a>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowContact(true)}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Contact Host
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reservation Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ReservationForm property={property} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}