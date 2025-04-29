import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { propertyApi } from "../services/api";
import Layout from "../components/Layout";
import {
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  ArrowTopRightOnSquareIcon,
  HeartIcon,
  ShareIcon,
  CalendarDaysIcon,
  ArrowLeftIcon,
  CheckIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Loading from "../components/Loading";
import { useAuth } from "../hooks";
import toast from "react-hot-toast";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Fetch property data
  const {
    data: propertyData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["property", id],
    queryFn: () => propertyApi.getById(id),
  });

  const property = propertyData?.data;

  // Process images for gallery
  const images =
    property?.images?.map((img) => ({
      original: img,
      thumbnail: img,
      originalAlt: property.title,
      thumbnailAlt: property.title,
    })) || [];

  // Add default image if no images available
  if (images.length === 0) {
    images.push({
      original: "https://via.placeholder.com/800x600?text=No+Image+Available",
      thumbnail: "https://via.placeholder.com/150x100?text=No+Image",
      originalAlt: "No image available",
      thumbnailAlt: "No thumbnail",
    });
  }

  // Handle favorite toggle
  const toggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error("Please login to save favorites");
      return;
    }

    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    // Here you would typically call an API to save to user's favorites
  };

  // Handle reserve click
  const handleReserve = () => {
    navigate(
      `/contact?propertyId=${id}&propertyTitle=${encodeURIComponent(
        property.title
      )}`
    );
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-24 pb-16">
          <Loading />
        </div>
      </Layout>
    );
  }

  if (error || !property) {
    return (
      <Layout>
        <div className="container px-4 pt-24 pb-16 mx-auto">
          <div className="py-12 text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
              Property Not Found
            </h1>
            <p className="mb-6 text-gray-600">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/properties"
              className="bg-[#0f2c5c] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
            >
              Back to Properties
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Top section with navigation */}
      <div className="pt-24 bg-gray-100">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center text-sm">
            <Link
              to="/properties"
              className="flex items-center text-[#0f2c5c] hover:text-[#c8a55b] transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to Properties
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link
              to="/properties"
              className="text-gray-500 hover:text-[#c8a55b]"
            >
              Properties
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700 truncate max-w-[200px]">
              {property.title}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pb-16 bg-gray-100">
        <div className="container px-4 mx-auto">
          {/* Property Title and Quick Actions */}
          <div className="flex flex-wrap items-start justify-between py-6 mb-6">
            <div className="w-full pr-0 lg:w-2/3 lg:pr-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[#0f2c5c]">
                {property.title}
              </h1>
              <div className="flex items-center mt-3 text-gray-600">
                <MapPinIcon className="flex-shrink-0 w-5 h-5 mr-2" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-start w-full gap-4 mt-4 lg:w-1/3 sm:flex-row lg:justify-end lg:mt-0">
              <span className="text-2xl md:text-3xl font-bold text-[#c8a55b]">
                ${Number(property.price).toLocaleString()}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={toggleFavorite}
                  className="p-2 transition-colors bg-white border border-gray-300 rounded-full hover:bg-gray-100"
                  aria-label="Add to favorites"
                >
                  {isFavorite ? (
                    <HeartIconSolid className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 transition-colors bg-white border border-gray-300 rounded-full hover:bg-gray-100"
                  aria-label="Share property"
                >
                  <ShareIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Image Gallery and Key Details */}
          <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
            {/* Property Images */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden bg-white shadow-md rounded-xl">
                {images.length > 0 && (
                  <div className="property-gallery">
                    <ImageGallery
                      items={images}
                      showPlayButton={false}
                      showFullscreenButton={true}
                      showBullets={images.length > 1}
                      showThumbnails={images.length > 1}
                      thumbnailPosition="bottom"
                      lazyLoad={true}
                      onSlide={setActiveImage}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Property Key Details */}
            <div className="lg:col-span-1">
              <div className="p-6 mb-6 bg-white shadow-md rounded-xl">
                <h2 className="text-xl font-bold text-[#0f2c5c] mb-4 pb-2 border-b border-gray-200">
                  Property Overview
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
                    <HomeIcon className="h-6 w-6 text-[#0f2c5c] mb-1" />
                    <span className="text-sm text-gray-500">Type</span>
                    <span className="font-semibold text-[#0f2c5c]">
                      {property.type || "Property"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
                    <ArrowTopRightOnSquareIcon className="h-6 w-6 text-[#0f2c5c] mb-1" />
                    <span className="text-sm text-gray-500">Area</span>
                    <span className="font-semibold text-[#0f2c5c]">
                      {property.area} sqft
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#0f2c5c] mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Bedrooms</span>
                    <span className="font-semibold text-[#0f2c5c]">
                      {property.bedrooms}
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#0f2c5c] mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Bathrooms</span>
                    <span className="font-semibold text-[#0f2c5c]">
                      {property.bathrooms}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-[#0f2c5c] mb-2">
                  Property Details
                </h3>
                <div className="mb-6 space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium text-[#0f2c5c]">
                      {property.status || "Available"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Year Built</span>
                    <span className="font-medium text-[#0f2c5c]">
                      {property.year_built || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Garage</span>
                    <span className="font-medium text-[#0f2c5c]">
                      {property.garage || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Property ID</span>
                    <span className="font-medium text-[#0f2c5c]">
                      #{property.id}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleReserve}
                  className="w-full py-3 px-6 bg-[#c8a55b] text-[#0f2c5c] font-bold rounded-lg flex items-center justify-center hover:bg-[#d8b56b] transition-colors mb-3"
                >
                  <CalendarDaysIcon className="w-5 h-5 mr-2" />
                  Reserve Now
                </button>
              </div>

              {/* Agent Contact */}
              <div className="p-6 bg-white shadow-md rounded-xl">
                <h2 className="text-xl font-bold text-[#0f2c5c] mb-4 pb-2 border-b border-gray-200">
                  Contact Agent
                </h2>
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-[#0f2c5c] text-white flex items-center justify-center mr-4">
                    <UserIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Property Agent</h3>
                    <p className="text-sm text-gray-600">
                      Real Estate Specialist
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${property.contact_phone || "+11234567890"}`}
                  className="w-full py-3 px-6 bg-[#0f2c5c] text-white font-bold rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-colors mb-3"
                >
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  Call Agent
                </a>
                <Link
                  to="/contact"
                  className="w-full py-3 px-6 bg-white text-[#0f2c5c] border border-[#0f2c5c] font-bold rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  Email Agent
                </Link>
              </div>
            </div>
          </div>

          {/* Description and Features */}
          <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
            {/* Description */}
            <div className="p-6 bg-white shadow-md lg:col-span-2 rounded-xl">
              <h2 className="text-xl font-bold text-[#0f2c5c] mb-4 pb-2 border-b border-gray-200">
                Property Description
              </h2>
              <div className="prose text-gray-700 max-w-none">
                <p className="whitespace-pre-line">{property.description}</p>
              </div>
            </div>

            {/* Features */}
            <div className="p-6 bg-white shadow-md lg:col-span-1 rounded-xl">
              <h2 className="text-xl font-bold text-[#0f2c5c] mb-4 pb-2 border-b border-gray-200">
                Features & Amenities
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {property.features && property.features.length > 0 ? (
                  property.features.map((feature, index) => (
                    <div key={index} className="flex items-center py-1.5">
                      <CheckIcon className="h-5 w-5 mr-3 text-[#c8a55b] flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))
                ) : (
                  <p className="italic text-gray-500">
                    No specific features listed
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Map */}
          <div className="p-6 mb-8 bg-white shadow-md rounded-xl">
            <h2 className="text-xl font-bold text-[#0f2c5c] mb-4 pb-2 border-b border-gray-200">
              Location
            </h2>
            <div className="overflow-hidden bg-gray-200 rounded-lg h-96">
              {property.location && (
                <iframe
                  title="Property Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    property.location
                  )}&output=embed`}
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#0f2c5c] to-[#193f78] rounded-xl shadow-lg p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              Ready to make this property yours?
            </h2>
            <p className="max-w-2xl mx-auto mb-6 text-blue-100">
              Don't miss out on this opportunity. Reserve now or contact us for
              more information!
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={handleReserve}
                className="px-8 py-3 bg-[#c8a55b] text-[#0f2c5c] font-bold rounded-lg hover:bg-[#d8b56b] transition-colors shadow-md"
              >
                Reserve Now
              </button>
              <Link
                to="/contact"
                className="px-8 py-3 bg-white text-[#0f2c5c] font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-md"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
