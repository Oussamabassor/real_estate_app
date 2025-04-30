import React, { useState, useEffect } from "react";
import { propertyApi } from "../services/api";
import { motion } from "framer-motion";
import AdminModal from "./AdminModal";
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [currentProperty, setCurrentProperty] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    type: "apartment",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyApi.getAll();

      // Debug the response structure
      console.log("API Response:", response);

      // If we get valid data from API
      if (response && response.data) {
        // Ensure we're always setting an array to properties
        if (Array.isArray(response.data.data)) {
          setProperties(response.data.data);
        } else if (Array.isArray(response.data)) {
          setProperties(response.data);
        } else {
          console.warn("API returned data is not an array, using mock data");
          // Fallback to mock data if API doesn't return an array
          setProperties([
            {
              id: 1,
              name: "Luxury Apartment",
              description: "A stunning apartment with modern amenities",
              price: 250000,
              type: "apartment",
              location: "Downtown",
              bedrooms: 3,
              bathrooms: 2,
              area: 1500,
            },
            {
              id: 2,
              name: "Family Home",
              description: "Perfect for a growing family",
              price: 450000,
              type: "house",
              location: "Suburbs",
              bedrooms: 4,
              bathrooms: 3,
              area: 2200,
            },
          ]);
        }
      } else {
        // Fallback to mock data if needed
        console.warn("API returned unexpected format, using mock data");
        setProperties([
          {
            id: 1,
            name: "Luxury Apartment",
            description: "A stunning apartment with modern amenities",
            price: 250000,
            type: "apartment",
            location: "Downtown",
            bedrooms: 3,
            bathrooms: 2,
            area: 1500,
          },
          {
            id: 2,
            name: "Family Home",
            description: "Perfect for a growing family",
            price: 450000,
            type: "house",
            location: "Suburbs",
            bedrooms: 4,
            bathrooms: 3,
            area: 2200,
          },
        ]);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError(err.message || "Failed to fetch properties");

      // Fallback to mock data
      setProperties([
        {
          id: 1,
          name: "Luxury Apartment",
          description: "A stunning apartment with modern amenities",
          price: 250000,
          type: "apartment",
          location: "Downtown",
          bedrooms: 3,
          bathrooms: 2,
          area: 1500,
        },
        {
          id: 2,
          name: "Family Home",
          description: "Perfect for a growing family",
          price: 450000,
          type: "house",
          location: "Suburbs",
          bedrooms: 4,
          bathrooms: 3,
          area: 2200,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.location.trim()) errors.location = "Location is required";

    // Validate price
    if (!formData.price) {
      errors.price = "Price is required";
    } else if (
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      errors.price = "Price must be a positive number";
    }

    // Validate bedrooms and bathrooms
    if (
      formData.bedrooms &&
      (isNaN(parseInt(formData.bedrooms)) || parseInt(formData.bedrooms) < 0)
    ) {
      errors.bedrooms = "Bedrooms must be a non-negative number";
    }

    if (
      formData.bathrooms &&
      (isNaN(parseInt(formData.bathrooms)) || parseInt(formData.bathrooms) < 0)
    ) {
      errors.bathrooms = "Bathrooms must be a non-negative number";
    }

    // Validate area
    if (
      formData.area &&
      (isNaN(parseFloat(formData.area)) || parseFloat(formData.area) <= 0)
    ) {
      errors.area = "Area must be a positive number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open modal for creating new property
  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      name: "",
      description: "",
      price: "",
      type: "apartment",
      location: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing property
  const openEditModal = (property) => {
    setModalMode("edit");
    setCurrentProperty(property);
    setFormData({
      name: property.name || property.title || "",
      description: property.description || "",
      price: property.price?.toString() || "",
      type: property.type || "apartment",
      location: property.location || "",
      bedrooms: property.bedrooms?.toString() || "",
      bathrooms: property.bathrooms?.toString() || "",
      area: property.area?.toString() || "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSuccessMessage("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // Prepare data for API
      const propertyData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        type: formData.type,
        location: formData.location,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        area: formData.area ? parseFloat(formData.area) : null,
      };

      if (modalMode === "create") {
        // Create new property
        const response = await propertyApi.create(propertyData);
        setSuccessMessage("Property created successfully!");

        // Add new property to list
        if (response?.data?.data) {
          setProperties([...properties, response.data.data]);
        } else {
          // Refresh all properties if we don't get the new one back
          fetchProperties();
        }
      } else {
        // Update existing property
        await propertyApi.update(currentProperty.id, propertyData);
        setSuccessMessage("Property updated successfully!");

        // Update property in the list
        setProperties(
          properties.map((p) =>
            p.id === currentProperty.id ? { ...p, ...propertyData } : p
          )
        );
      }

      // Close modal after a short delay
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      console.error("Error saving property:", err);
      setFormErrors({
        submit:
          err.response?.data?.message ||
          "Failed to save property. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteConfirmation = (propertyId) => {
    setConfirmDeleteId(propertyId);
    setShowDeleteConfirm(true);
  };

  // Handle property deletion
  const handleDeleteProperty = async () => {
    if (!confirmDeleteId) return;

    try {
      await propertyApi.delete(confirmDeleteId);

      // Remove property from the list
      setProperties(properties.filter((p) => p.id !== confirmDeleteId));
      setSuccessMessage("Property deleted successfully!");
      setShowDeleteConfirm(false);
      setConfirmDeleteId(null);

      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error deleting property:", err);
      setError("Failed to delete property. Please try again.");
      setShowDeleteConfirm(false);
    }
  };

  // Filter properties by search term
  const filteredProperties = properties.filter((property) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (property.name || property.title || "")
        .toLowerCase()
        .includes(searchTermLower) ||
      (property.location || "").toLowerCase().includes(searchTermLower) ||
      (property.type || "").toLowerCase().includes(searchTermLower)
    );
  });

  // Success toast notification
  const SuccessToast = () => {
    if (!successMessage) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 flex items-center bg-green-50 border-l-4 border-green-500 py-2 px-3 shadow-md rounded-md z-50"
      >
        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
        <p className="text-green-800">{successMessage}</p>
      </motion.div>
    );
  };

  // Error toast notification
  const ErrorToast = () => {
    if (!error) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 flex items-center bg-red-50 border-l-4 border-red-500 py-2 px-3 shadow-md rounded-md z-50"
      >
        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-red-800">{error}</p>
      </motion.div>
    );
  };

  // Form Footer component
  const FormFooter = () => (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={closeModal}
        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="propertyForm"
        disabled={submitting}
        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
      >
        {submitting ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : modalMode === "create" ? (
          "Create Property"
        ) : (
          "Update Property"
        )}
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">
          Properties Management
        </h1>
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <SuccessToast />
      <ErrorToast />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Properties Management</h1>
        <button
          onClick={openCreateModal}
          className="bg-primary-600 hover:bg-primary-700 text-white px-3 sm:px-4 py-2 rounded-md flex items-center text-sm transition-colors"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add New Property
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        {/* Search and filter bar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, type or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex-shrink-0">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <FunnelIcon className="h-4 w-4 mr-1" />
              Filters
            </button>
          </div>
        </div>

        {/* Properties table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredProperties.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {searchTerm ? (
                      <p>No properties found matching your search criteria.</p>
                    ) : (
                      <p>No properties available. Add your first property!</p>
                    )}
                  </td>
                </tr>
              ) : (
                filteredProperties.map((property) => (
                  <motion.tr
                    key={property.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{property.id}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 max-w-[200px] truncate">
                      {property.name || property.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {property.type &&
                        property.type.charAt(0).toUpperCase() +
                          property.type.slice(1)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${Number(property.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 max-w-[200px] truncate hidden md:table-cell">
                      {property.location}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <button
                        onClick={() => openEditModal(property)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 inline-flex items-center"
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => openDeleteConfirmation(property.id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <TrashIcon className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Property statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total Properties
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {properties.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {properties.length > 0
              ? `Last added on ${new Date().toLocaleDateString()}`
              : "No properties yet"}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Apartments</h3>
          <p className="text-2xl font-bold text-gray-900">
            {properties.filter((p) => p.type === "apartment").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Houses</h3>
          <p className="text-2xl font-bold text-gray-900">
            {properties.filter((p) => p.type === "house").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Average Price</h3>
          <p className="text-2xl font-bold text-gray-900">
            $
            {properties.length
              ? Math.round(
                  properties.reduce(
                    (acc, curr) => acc + Number(curr.price),
                    0
                  ) / properties.length
                ).toLocaleString()
              : 0}
          </p>
        </div>
      </div>

      {/* Property Form Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === "create" ? "Add New Property" : "Edit Property"}
        size="lg"
        footer={<FormFooter />}
      >
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            <p>{successMessage}</p>
          </div>
        )}

        <form id="propertyForm" onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name / Title
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 transition-colors ${
                formErrors.name
                  ? "border-red-500"
                  : "border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200"
              }`}
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Property Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="bungalow">Bungalow</option>
                <option value="condo">Condo</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full border rounded-md pl-7 px-3 py-2 transition-colors ${
                    formErrors.price
                      ? "border-red-500"
                      : "border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200"
                  }`}
                />
              </div>
              {formErrors.price && (
                <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 transition-colors ${
                formErrors.location
                  ? "border-red-500"
                  : "border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200"
              }`}
            />
            {formErrors.location && (
              <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="bedrooms"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bedrooms
              </label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 transition-colors ${
                  formErrors.bedrooms
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200"
                }`}
              />
              {formErrors.bedrooms && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.bedrooms}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="bathrooms"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 transition-colors ${
                  formErrors.bathrooms
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200"
                }`}
              />
              {formErrors.bathrooms && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.bathrooms}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="area"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Area (sq ft)
              </label>
              <input
                type="text"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 transition-colors ${
                  formErrors.area
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200"
                }`}
              />
              {formErrors.area && (
                <p className="text-red-500 text-xs mt-1">{formErrors.area}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full border rounded-md px-3 py-2 transition-colors ${
                formErrors.description
                  ? "border-red-500"
                  : "border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200"
              }`}
            />
            {formErrors.description && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.description}
              </p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Images
            </label>
            <div className="flex items-center justify-center px-6 py-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary-400 transition-colors">
              <div className="space-y-1 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                  >
                    <span>Upload images</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
            </div>
          </div>

          {formErrors.submit && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
              <p>{formErrors.submit}</p>
            </div>
          )}
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="py-3">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-center text-lg font-medium text-gray-900 mb-2">
            Delete Property
          </h3>
          <p className="text-center text-gray-500 mb-6">
            Are you sure you want to delete this property? This action cannot be
            undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteProperty}
              className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default AdminProperties;
