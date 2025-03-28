import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
} from "./Icons";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const companyLinks = [
    { name: "footer.about", href: "/about" },
    { name: "footer.careers", href: "/careers" },
    { name: "footer.press", href: "/press" },
    { name: "footer.blog", href: "/blog" },
  ];

  const resourceLinks = [
    { name: "footer.propertyGuides", href: "/guides" },
    { name: "footer.marketUpdates", href: "/market-updates" },
    { name: "footer.buyingGuide", href: "/buying-guide" },
    { name: "footer.sellingGuide", href: "/selling-guide" },
  ];

  const legalLinks = [
    { name: "footer.terms", href: "/terms" },
    { name: "footer.privacy", href: "/privacy" },
    { name: "footer.cookies", href: "/cookies" },
    { name: "footer.disclaimer", href: "/disclaimer" },
  ];

  const socialLinks = [
    {
      name: "footer.facebook",
      icon: FacebookIcon,
      href: "https://facebook.com",
    },
    { name: "footer.twitter", icon: TwitterIcon, href: "https://twitter.com" },
    {
      name: "footer.instagram",
      icon: InstagramIcon,
      href: "https://instagram.com",
    },
    {
      name: "footer.linkedin",
      icon: LinkedInIcon,
      href: "https://linkedin.com",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className="bg-gray-50 border-t border-gray-200 pt-16 pb-8"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Newsletter Subscription */}
        <motion.div 
          variants={itemVariants}
          className="relative mb-16 overflow-hidden rounded-2xl shadow-elegant"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-primary-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            </div>
            
            {/* Circular Decorations */}
            <div className="absolute top-0 right-0 hidden lg:block overflow-hidden">
              <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="200" r="200" fill="white" fillOpacity="0.05" />
                <circle cx="200" cy="200" r="150" fill="white" fillOpacity="0.05" />
                <circle cx="200" cy="200" r="100" fill="white" fillOpacity="0.1" />
              </svg>
            </div>
          </div>
          
          <div className="relative z-10 px-6 py-12 sm:py-16 sm:px-12 lg:px-16">
            <div className="max-w-3xl mx-auto lg:mx-0">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <motion.h3 
                  variants={itemVariants} 
                  className="text-2xl sm:text-3xl font-bold text-white"
                >
                  Stay updated with the latest properties
                </motion.h3>
                <motion.p 
                  variants={itemVariants} 
                  className="mt-4 text-base sm:text-lg text-gray-100"
                >
                  Subscribe to our newsletter and be the first to discover exclusive listings and market insights.
                </motion.p>
                
                <motion.form 
                  variants={itemVariants}
                  className="mt-8 sm:flex sm:max-w-md sm:mx-auto lg:mx-0 w-full"
                >
                  <div className="min-w-0 flex-1">
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      className="block w-full rounded-l-lg sm:rounded-r-none border-0 px-4 py-3.5 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-0">
                    <button 
                      type="submit" 
                      className="block w-full sm:w-auto rounded-lg sm:rounded-l-none px-5 py-3.5 bg-gold-500 text-base font-medium text-white shadow hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105"
                    >
                      <span className="flex items-center justify-center">
                        Subscribe
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </span>
                    </button>
                  </div>
                </motion.form>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 lg:gap-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2.5"
            >
              <div className="p-1.5 bg-primary-50 rounded-lg">
                <BuildingOfficeIcon className="w-8 h-8 text-primary-800" />
              </div>
              <span className="text-2xl font-bold text-primary-900">LuxeStay</span>
            </motion.div>
            <p className="text-gray-600">Discover extraordinary properties with LuxeStay. We offer a curated selection of premium real estate in the most desirable locations worldwide.</p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md text-gray-600 hover:text-primary-800 hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="sr-only">{t(item.name)}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-6 text-lg font-semibold text-primary-800">
              {t("footer.company")}
            </h3>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <motion.li 
                  key={link.name} 
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-primary-800 transition-colors duration-200 flex items-center group"
                  >
                    <ChevronRightIcon className="w-4 h-4 text-primary-300 group-hover:text-primary-800 mr-2 transition-colors duration-200" />
                    {t(link.name)}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resource Links */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-6 text-lg font-semibold text-primary-800">
              {t("footer.resources")}
            </h3>
            <ul className="space-y-4">
              {resourceLinks.map((link) => (
                <motion.li 
                  key={link.name} 
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-primary-800 transition-colors duration-200 flex items-center group"
                  >
                    <ChevronRightIcon className="w-4 h-4 text-primary-300 group-hover:text-primary-800 mr-2 transition-colors duration-200" />
                    {t(link.name)}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-6 text-lg font-semibold text-primary-800">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-5">
              <motion.li
                variants={itemVariants}
                className="flex items-start space-x-3 text-gray-600 group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-full bg-primary-50 group-hover:bg-primary-100 transition-colors duration-200">
                  <PhoneIcon className="w-4 h-4 text-primary-800" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <a href="tel:+2126656521368" className="hover:text-primary-800 transition-colors">+212 6 65 65 21 68</a>
                </div>
              </motion.li>
              <motion.li
                variants={itemVariants}
                className="flex items-start space-x-3 text-gray-600 group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-full bg-primary-50 group-hover:bg-primary-100 transition-colors duration-200">
                  <EnvelopeIcon className="w-4 h-4 text-primary-800" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:contact@luxestay.com" className="hover:text-primary-800 transition-colors">contact@luxestay.com</a>
                </div>
              </motion.li>
              <motion.li
                variants={itemVariants}
                className="flex items-start space-x-3 text-gray-600 group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-full bg-primary-50 group-hover:bg-primary-100 transition-colors duration-200">
                  <MapPinIcon className="w-4 h-4 text-primary-800" />
                </div>
                <div>
                  <p className="font-medium">Address</p>
                  <p>
                    123 Avenue de l'Immobilier,
                    <br />
                    40000, Marrakech, Morocco
                  </p>
                </div>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="pt-8 mt-16 border-t border-gray-200"
        >
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            {/* Copyright */}
            <motion.div
              variants={itemVariants}
              className="text-sm text-gray-600"
            >
              &copy; {currentYear} LuxeStay. All rights reserved.
            </motion.div>

            {/* Legal Links */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-6"
            >
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-gray-600 hover:text-primary-800 transition-colors duration-200"
                >
                  {t(link.name)}
                </Link>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
