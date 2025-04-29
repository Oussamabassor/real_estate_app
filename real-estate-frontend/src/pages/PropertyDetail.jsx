import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../services/api';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import {
  HeartIcon, 
  MapPinIcon, 
  CalendarDaysIcon,
  InformationCircleIcon,
  CheckIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

// Modern, visually appealing Property Detail page
export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  
  // Fetch property data
  const { data: propertyResponse, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getById(id),
  });
  
  const property = propertyResponse?.data;
  
  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };
  
  // Handle reserve button click
  const handleReserve = () => {
    navigate(`/contact?propertyId=${id}&propertyTitle=${encodeURIComponent(property?.title || '')}`);
  };
  
  // Default fallback image
  const fallbackImage = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60";

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-t-4 border-[#0f2c5c] border-t-[#c8a55b] rounded-full animate-spin mb-4"></div>
              <p className="text-[#0f2c5c] text-lg font-medium">Loading property details...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !property) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="max-w-md py-12 mx-auto text-center">
              <div className="p-8 bg-white shadow-lg rounded-xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="mb-2 text-2xl font-bold text-gray-800">Property Not Found</h1>
                <p className="mb-6 text-gray-600">We couldn't find the property you're looking for. It may have been removed or doesn't exist.</p>
                <Link 
                  to="/properties" 
                  className="block w-full bg-[#0f2c5c] text-white text-center py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Browse Other Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Ensure images array is valid
  const propertyImages = property.images && Array.isArray(property.images) && property.images.length > 0 
    ? property.images 
    : [fallbackImage];
  
  return (
    <Layout>
      {/* Hero Section with Main Property Image */}
      <div className="pt-16 bg-gradient-to-b from-gray-900 to-[#0f2c5c]">
        <div className="container px-4 mx-auto">
          <div className="h-80 md:h-96 lg:h-[500px] overflow-hidden relative rounded-b-3xl">
            <img 
              src={propertyImages[mainImageIndex]} 
              alt={property.title}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = fallbackImage;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            
            {/* Property Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="bg-[#c8a55b] text-[#0f2c5c] text-xs font-bold px-2 py-1 rounded-md mr-2">
                      {property.type || 'PROPERTY'}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-white/20 backdrop-blur-sm">
                      ID: #{property.id}
                    </span>
                  </div>
                  <h1 className="mb-2 text-2xl font-bold md:text-3xl lg:text-4xl">{property.title}</h1>
                  <div className="flex items-center text-white/90">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm md:text-base">{property.location}</span>
                  </div>
                </div>
                <div className="items-center hidden gap-2 md:flex">
                  <button 
                    onClick={handleFavoriteToggle}
                    className="p-2 transition-colors rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  >
                    {isFavorite ? 
                      <HeartSolid className="w-6 h-6 text-red-500" /> : 
                      <HeartIcon className="w-6 h-6 text-white" />
                    }
                  </button>
                  <button 
                    onClick={handleReserve}
                    className="py-2 px-4 bg-[#c8a55b] text-[#0f2c5c] rounded-lg font-bold hover:bg-[#d8b56b] transition-colors"
                  >
                    Reserve Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Thumbnails */}
      <div className="bg-white">
        <div className="container relative z-10 px-4 mx-auto -mt-6">
          <div className="p-4 bg-white shadow-lg rounded-xl">
            <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-thin">
              {propertyImages.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setMainImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all ${
                    mainImageIndex === index ? 'border-[#c8a55b]' : 'border-transparent hover:border-[#c8a55b]/50'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`View ${index + 1}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = fallbackImage;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="py-8 bg-gray-50 md:py-12">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Property Details */}
            <div className="space-y-8 lg:col-span-2">
              {/* Quick Info */}
              <div className="overflow-hidden bg-white shadow-sm rounded-xl">
                <div className="p-6">
                  <div className="flex flex-wrap gap-6 mb-4">
                    <div className="flex flex-col items-center px-4">
                      <span className="text-3xl font-bold text-[#0f2c5c]">${Number(property.price).toLocaleString()}</span>
                      <span className="text-sm text-gray-500">Price</span>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="flex flex-col items-center px-4">
                      <span className="text-3xl font-bold text-[#0f2c5c]">{property.bedrooms}</span>
                      <span className="text-sm text-gray-500">Bedrooms</span>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="flex flex-col items-center px-4">
                      <span className="text-3xl font-bold text-[#0f2c5c]">{property.bathrooms}</span>
                      <span className="text-sm text-gray-500">Bathrooms</span>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="flex flex-col items-center px-4">
                      <span className="text-3xl font-bold text-[#0f2c5c]">{property.area}</span>
                      <span className="text-sm text-gray-500">Sq Ft</span>
                    </div>
                  </div>

                  {/* Mobile action buttons */}
                  <div className="flex justify-between gap-4 mb-4 md:hidden">
                    <button 
                      onClick={handleFavoriteToggle}
                      className="flex items-center justify-center flex-1 gap-2 py-3 border border-gray-300 rounded-lg"
                    >
                      {isFavorite ? 
                        <HeartSolid className="w-5 h-5 text-red-500" /> : 
                        <HeartIcon className="w-5 h-5 text-gray-600" />
                      }
                      <span>{isFavorite ? 'Saved' : 'Save'}</span>
                    </button>
                    <button 
                      onClick={handleReserve}
                      className="flex-1 py-3 bg-[#c8a55b] text-[#0f2c5c] rounded-lg font-bold hover:bg-[#d8b56b] transition-colors"
                    >
                      Reserve Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="overflow-hidden bg-white shadow-sm rounded-xl">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#0f2c5c] mb-4 flex items-center">
                    <InformationCircleIcon className="w-5 h-5 mr-2" />
                    About This Property
                  </h2>
                  <div className="prose text-gray-600 max-w-none">
                    <p className="whitespace-pre-line">{property.description || 'No description provided.'}</p>
                  </div>
                </div>
              </div>

              {/* Features and Amenities */}
              <div className="overflow-hidden bg-white shadow-sm rounded-xl">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#0f2c5c] mb-4 flex items-center">
                    <CheckIcon className="w-5 h-5 mr-2" />
                    Features & Amenities
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {property.features && property.features.length > 0 ? (
                      property.features.map((feature, index) => (
                        <div key={index} className="flex items-center py-1">
                          <div className="w-2 h-2 bg-[#c8a55b] rounded-full mr-3"></div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-2 italic text-gray-500">Features not specified</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Map */}
              <div className="overflow-hidden bg-white shadow-sm rounded-xl">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#0f2c5c] mb-4 flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    Location
                  </h2>
                  
                  <div className="overflow-hidden bg-gray-200 rounded-lg h-80">
                    <iframe
                      title="Property Location"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Contact and Action Cards */}
            <div className="space-y-8">
              {/* Price and Reserve Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border-t-4 border-[#c8a55b]">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#0f2c5c]">Interested?</h2>
                    <span className="text-xl font-bold text-[#c8a55b]">${Number(property.price).toLocaleString()}</span>
                  </div>
                  
                  <button 
                    onClick={handleReserve}
                    className="w-full py-3 px-6 bg-[#c8a55b] text-[#0f2c5c] font-bold rounded-lg flex items-center justify-center hover:bg-[#d8b56b] transition-colors mb-3"
                  >
                    <CalendarDaysIcon className="w-5 h-5 mr-2" />
                    Reserve Now
                  </button>
                  
                  <Link 
                    to="/contact"
                    className="w-full py-3 px-6 border border-[#0f2c5c] text-[#0f2c5c] font-bold rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <EnvelopeIcon className="w-5 h-5 mr-2" />
                    Contact Agent
                  </Link>
                </div>
              </div>
              
              {/* Property Details Card */}
              <div className="overflow-hidden bg-white shadow-sm rounded-xl">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#0f2c5c] mb-4">Property Details</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-medium text-[#0f2c5c]">{property.type || 'Residential'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Year Built</span>
                      <span className="font-medium text-[#0f2c5c]">{property.year_built || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Status</span>
                      <span className="font-medium text-[#0f2c5c]">{property.status || 'Available'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Bedrooms</span>
                      <span className="font-medium text-[#0f2c5c]">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Bathrooms</span>
                      <span className="font-medium text-[#0f2c5c]">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Area</span>
                      <span className="font-medium text-[#0f2c5c]">{property.area} sq ft</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">Garage</span>
                      <span className="font-medium text-[#0f2c5c]">{property.garage || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Similar Properties Teaser */}
              <div className="bg-gradient-to-br from-[#0f2c5c] to-[#193f78] rounded-xl shadow-sm overflow-hidden text-white">
                <div className="p-6">
                  <h2 className="mb-4 text-xl font-bold">Looking for more?</h2>
                  <p className="mb-4 text-blue-100">Explore similar properties in the same area.</p>
                  <Link 
                    to="/properties"
                    className="block w-full py-3 px-6 bg-white text-[#0f2c5c] font-bold rounded-lg text-center hover:bg-gray-100 transition-colors"
                  >
                    Browse Properties
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
