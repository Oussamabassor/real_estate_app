import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks";
import Layout from "../components/Layout";
import { useQuery } from "@tanstack/react-query";
import { propertyApi } from "../services/api"; // Fixed import path
import toast from "react-hot-toast";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ClockIcon,
  HomeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  // Check if this is a reservation request
  const propertyId = searchParams.get("propertyId");
  const propertyTitle = searchParams.get("propertyTitle");
  const isReservation = !!propertyId;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    checkInDate: "",
    checkOutDate: "",
    guests: "2",
    propertyName: propertyTitle || "", // Pre-fill property name from URL
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: false });

    // Simulate API delay
    setTimeout(() => {
      // Mock successful submission
      setFormStatus({ submitting: false, success: true, error: false });

      // Reset form after success
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        checkInDate: "",
        checkOutDate: "",
        guests: "2",
        propertyName: "",
      });
    }, 1500);
  };

  // Fetch property details if this is a reservation
  const { data: propertyData } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => propertyApi.getById(propertyId),
    enabled: !!propertyId,
  });

  const property = propertyData?.data;

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [isAuthenticated, user]);

  // Pre-fill property data when property information is loaded
  useEffect(() => {
    if (isReservation && property) {
      const title = property?.title || propertyTitle || "this property";
      setFormData((prev) => ({
        ...prev,
        propertyName: title,
        message: `I would like to reserve ${title} for the selected dates.`,
      }));
    }
  }, [isReservation, property, propertyTitle]);

  // Reference for date fields to focus on load
  const checkInDateRef = React.useRef(null);

  // Focus on check-in date field when the page loads for reservation
  useEffect(() => {
    if (isReservation && checkInDateRef.current) {
      setTimeout(() => {
        checkInDateRef.current.focus();
      }, 500);
    }
  }, [isReservation]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Office locations
  const offices = [
    {
      city: "New York",
      address: "123 Fifth Avenue, Suite 400, New York, NY 10160",
      phone: "+1 (212) 555-6789",
      email: "newyork@luxestay.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
    },
    {
      city: "London",
      address: "30 St Mary Axe, London EC3A 8EP, United Kingdom",
      phone: "+44 20 7123 4567",
      email: "london@luxestay.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
    },
    {
      city: "Dubai",
      address: "Burj Khalifa, 1 Sheikh Mohammed bin Rashid Blvd",
      phone: "+971 4 123 4567",
      email: "dubai@luxestay.com",
      hours: "Sun-Thu: 10:00 AM - 7:00 PM",
    },
  ];

  return (
    <Layout>
      {/* Enhanced Hero Section with Background Image */}
      <div className="relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Enhanced gradient overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, rgba(15,44,92,0.97), rgba(26,58,108,0.85))",
              zIndex: 1,
            }}
          ></div>

          {/* Decorative patterns */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-32 transform -skew-y-6 bg-white opacity-5"></div>
            <div className="absolute bottom-0 right-0 w-full h-32 transform skew-y-6 bg-white opacity-5"></div>
          </div>

          {/* Geometric decorations */}
          <div className="absolute z-0 w-64 h-64 border-2 border-white rounded-full top-1/4 right-1/4 opacity-10"></div>
          <div className="absolute z-0 w-40 h-40 border border-white rounded-full bottom-1/3 left-1/3 opacity-10"></div>

          {/* Hero background image - using a professional contact/office image */}
          <img
            src="https://images.unsplash.com/photo-1582883693742-5d25dead1c79?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=2070"
            alt="Contact Us"
            className="object-cover w-full h-full"
            style={{ opacity: 0.6, position: "relative" }}
          />
        </div>

        {/* Rest of hero content remains the same */}
        <div className="container relative z-10 px-4 pb-20 mx-auto text-center pt-36">
          {/* Breadcrumb navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <ol className="flex items-center space-x-2 text-sm text-yellow-300">
              <li>
                <Link to="/" className="hover:text-yellow-200">
                  Home
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="font-medium">Contact Us</li>
            </ol>
          </motion.nav>

          {/* Golden accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div
              style={{
                height: "2px",
                width: "80px",
                backgroundColor: "#c8a55b",
                margin: "0 auto",
              }}
            ></div>
          </motion.div>

          {/* Animated heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl"
            style={{
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            Get In <span style={{ color: "#c8a55b" }}>Touch</span> With Us
          </motion.h1>

          {/* Animated description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto mb-10 text-xl text-blue-50"
          >
            We're here to help you with any questions about our properties and
            services. Our team of experts is ready to assist you.
          </motion.p>

          {/* Contact highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-x-10 gap-y-4"
          >
            <div className="flex items-center">
              <PhoneIcon className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-white">+1 (212) 555-1234</span>
            </div>
            <div className="flex items-center">
              <EnvelopeIcon className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-white">info@luxestay.com</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-white">Mon - Fri: 9AM - 6PM</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Rest of the component */}
      <div className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <motion.div
            className="mx-auto max-w-7xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Contact Information Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-3"
            >
              <div className="p-8 text-center transition-shadow bg-white shadow-md rounded-xl hover:shadow-lg">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50">
                  <PhoneIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Call Us
                </h3>
                <p className="mb-4 text-gray-600">
                  Our customer service team is ready to assist you
                </p>
                <a
                  href="tel:+12125551234"
                  className="text-lg font-semibold text-blue-700 transition-colors hover:text-blue-900"
                >
                  +1 (212) 555-1234
                </a>
              </div>

              <div className="p-8 text-center transition-shadow bg-white shadow-md rounded-xl hover:shadow-lg">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50">
                  <EnvelopeIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Email Us
                </h3>
                <p className="mb-4 text-gray-600">
                  Send us an email and we'll respond promptly
                </p>
                <a
                  href="mailto:info@luxestay.com"
                  className="text-lg font-semibold text-blue-700 transition-colors hover:text-blue-900"
                >
                  info@luxestay.com
                </a>
              </div>

              <div className="p-8 text-center transition-shadow bg-white shadow-md rounded-xl hover:shadow-lg">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50">
                  <MapPinIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Visit Us
                </h3>
                <p className="mb-4 text-gray-600">
                  Come to our head office for in-person assistance
                </p>
                <address className="text-lg not-italic font-semibold text-blue-700">
                  123 Fifth Avenue
                  <br />
                  New York, NY 10160
                </address>
              </div>
            </motion.div>

            {/* Contact Form and Office Locations */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
              {/* Contact Form */}
              <motion.div
                variants={itemVariants}
                className="overflow-hidden bg-white shadow-lg lg:col-span-3 rounded-xl"
              >
                <div className="px-6 py-4 border-b border-blue-100 bg-blue-50">
                  <h3 className="flex items-center text-xl font-semibold text-blue-900">
                    <EnvelopeIcon className="w-6 h-6 mr-2" />
                    Send Us a Message
                  </h3>
                </div>
                <div className="p-6">
                  {formStatus.success ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 text-center"
                    >
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                        <CheckCircleIcon className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        Message Sent!
                      </h3>
                      <p className="mb-6 text-gray-600">
                        Thank you for reaching out. We'll get back to you as
                        soon as possible.
                      </p>
                      <button
                        onClick={() =>
                          setFormStatus({
                            submitting: false,
                            success: false,
                            error: false,
                          })
                        }
                        style={{
                          backgroundColor: "#0f2c5c",
                          color: "#ffffff",
                          padding: "0.625rem 1.25rem",
                          borderRadius: "0.5rem",
                          fontWeight: "500",
                          display: "inline-flex",
                          alignItems: "center",
                          transition: "all 0.3s ease",
                        }}
                        className="hover:bg-blue-700 hover:shadow-md"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your phone number"
                          />
                        </div>
                        {isReservation && (
                          <div>
                            <label
                              htmlFor="propertyName"
                              className="block text-sm font-medium text-[#0f2c5c] mb-1"
                            >
                              Property
                            </label>
                            <div className="relative">
                              <HomeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6b82a8]" />
                              <input
                                type="text"
                                id="propertyName"
                                name="propertyName"
                                value={formData.propertyName}
                                readOnly
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#cad7e9] bg-[#f8fafd] text-gray-600 cursor-not-allowed"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {isReservation && (
                        <div>
                          <h4 className="font-medium text-[#0f2c5c] mb-4 pb-2 border-b border-[#cad7e9]">
                            Reservation Details
                          </h4>
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="animate-pulse-subtle">
                              <label
                                htmlFor="checkInDate"
                                className="block text-sm font-medium text-[#0f2c5c] mb-1"
                              >
                                Check-In Date{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6b82a8]" />
                                <input
                                  type="date"
                                  id="checkInDate"
                                  name="checkInDate"
                                  ref={checkInDateRef}
                                  value={formData.checkInDate}
                                  onChange={handleChange}
                                  min={new Date().toISOString().split("T")[0]}
                                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#c8a55b] shadow-sm focus:ring-2 focus:ring-[#c8a55b] focus:border-[#c8a55b] bg-[#f8fafd] hover:bg-white focus:bg-white transition-colors"
                                  required
                                />
                              </div>
                              <p className="mt-1 text-xs text-[#0f2c5c]">
                                Select arrival date
                              </p>
                            </div>

                            <div className="animate-pulse-subtle">
                              <label
                                htmlFor="checkOutDate"
                                className="block text-sm font-medium text-[#0f2c5c] mb-1"
                              >
                                Check-Out Date{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6b82a8]" />
                                <input
                                  type="date"
                                  id="checkOutDate"
                                  name="checkOutDate"
                                  value={formData.checkOutDate}
                                  onChange={handleChange}
                                  min={
                                    formData.checkInDate ||
                                    new Date().toISOString().split("T")[0]
                                  }
                                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#c8a55b] shadow-sm focus:ring-2 focus:ring-[#c8a55b] focus:border-[#c8a55b] bg-[#f8fafd] hover:bg-white focus:bg-white transition-colors"
                                  required
                                />
                              </div>
                              <p className="mt-1 text-xs text-[#0f2c5c]">
                                Select departure date
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mb-6">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="5"
                          className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="How can we help you?"
                          required
                        ></textarea>
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={formStatus.submitting}
                          style={{
                            backgroundColor: formStatus.submitting
                              ? "#94a3b8"
                              : "#0f2c5c",
                            color: "#ffffff",
                            padding: "0.75rem 2rem",
                            borderRadius: "0.5rem",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            transition: "all 0.3s ease",
                          }}
                          className={`hover:${
                            formStatus.submitting ? "" : "bg-blue-700"
                          } hover:shadow-md`}
                        >
                          {formStatus.submitting ? (
                            <>
                              <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send Message"
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>

              {/* Office Locations */}
              <motion.div
                variants={itemVariants}
                className="space-y-6 lg:col-span-2"
              >
                <div className="p-6 overflow-hidden bg-white shadow-md rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <BuildingOfficeIcon className="w-6 h-6 text-blue-700" />
                    </div>
                    <h3 className="ml-2 text-lg font-semibold text-gray-900">
                      Our Offices
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {offices.map((office, index) => (
                      <div
                        key={office.city}
                        className={`${
                          index !== offices.length - 1
                            ? "border-b border-gray-200 pb-6"
                            : ""
                        }`}
                      >
                        <h4 className="mb-2 font-semibold text-blue-800">
                          {office.city}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="flex items-start">
                            <MapPinIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                            <span className="text-gray-600">
                              {office.address}
                            </span>
                          </p>
                          <p className="flex items-center">
                            <PhoneIcon className="w-4 h-4 mr-2 text-gray-500" />
                            <a
                              href={`tel:${office.phone}`}
                              className="text-blue-700 hover:text-blue-900"
                            >
                              {office.phone}
                            </a>
                          </p>
                          <p className="flex items-center">
                            <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-500" />
                            <a
                              href={`mailto:${office.email}`}
                              className="text-blue-700 hover:text-blue-900"
                            >
                              {office.email}
                            </a>
                          </p>
                          <p className="flex items-start">
                            <span className="mr-2 text-gray-500">⏰</span>
                            <span className="text-gray-600">
                              {office.hours}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Working Hours */}
                <div className="p-6 text-white bg-blue-800 shadow-md rounded-xl">
                  <div className="flex items-center mb-4">
                    <SparklesIcon className="w-6 h-6 mr-2 text-yellow-400" />
                    <h3 className="text-lg font-semibold">Premium Service</h3>
                  </div>
                  <p className="mb-4">
                    For our premium clients, we offer extended hours and
                    personalized consultations with our top real estate experts.
                  </p>
                  <div className="flex items-center">
                    <div
                      style={{
                        backgroundColor: "#c8a55b",
                        color: "#0f2c5c",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      VIP Service
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Map Section - Updated to show ORMVAH location */}
      <div className="relative overflow-hidden bg-gray-200 h-96">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.853691046853!2d-8.05073882443458!3d31.57368144659139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafef2395d6263d%3A0xe6428767e4e845de!2sOffice%20R%C3%A9gional%20de%20Mise%20en%20Valeur%20Agricole%20du%20Haouz!5e0!3m2!1sen!2sus!4v1699268484032!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="ORMVAH Office Location"
        ></iframe>

        <div className="absolute z-10 max-w-md p-4 bg-white rounded-lg shadow-lg bottom-6 left-6">
          <h3 className="flex items-center mb-2 font-semibold text-gray-900">
            <MapPinIcon className="w-5 h-5 mr-2 text-blue-700" />
            ORMVAH Office
          </h3>
          <p className="text-gray-700">
            Avenue Hassan II, Marrakech 40000, Morocco
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <div className="flex justify-center mb-4">
              <div
                style={{
                  height: "2px",
                  width: "48px",
                  backgroundColor: "#c8a55b",
                }}
              ></div>
            </div>
            <h2
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                color: "#0f2c5c",
                marginBottom: "1rem",
              }}
            >
              Frequently Asked Questions
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Find answers to common questions about our services and processes
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  What services does LuxeStay offer?
                </h3>
                <p className="text-gray-600">
                  LuxeStay offers premium real estate services including
                  property sales, rentals, property management, and investment
                  consulting. Our team of experts can help you find your dream
                  home or investment property.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  How can I schedule a property viewing?
                </h3>
                <p className="text-gray-600">
                  You can schedule a property viewing by using our contact form,
                  calling our office directly, or by requesting a viewing
                  through our property listing pages. Our team will promptly
                  arrange a convenient time for your visit.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  What areas do you serve?
                </h3>
                <p className="text-gray-600">
                  We have offices in major cities worldwide including New York,
                  London, and Dubai. Our services extend to prime locations in
                  each of these regions, focusing on luxury properties and
                  premium real estate opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
