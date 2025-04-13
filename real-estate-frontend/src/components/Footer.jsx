import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
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
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Main Footer Content with improved styling */}
        <div className="grid grid-cols-1 gap-10 lg:gap-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BuildingOfficeIcon className="w-8 h-8 text-blue-800" />
              </div>
              <span className="text-2xl font-bold text-blue-900">LuxeStay</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Discover extraordinary properties with LuxeStay. We offer a curated selection of premium real estate in the most desirable locations worldwide.
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md text-gray-600 hover:text-blue-800 hover:shadow-lg transition-all duration-300"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="sr-only">{t(item.name)}</span>
                </a>
              ))}
            </div>
          </div>

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
    </footer>
  );
}
