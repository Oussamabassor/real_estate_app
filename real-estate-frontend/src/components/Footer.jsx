import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';
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
    <footer className="bg-white pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 md:gap-6 lg:gap-10"
        >
          {/* Company Information */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
            {/* Logo - properly used without nesting Links */}
            <Logo size="md" linkTo="/" />
            <p className="mt-4 text-gray-600 max-w-xs">
              Discover extraordinary properties with ORMVAH. We offer a curated selection of premium real estate in the most desirable locations.
            </p>
            <div className="flex space-x-4 mt-6">
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
          </motion.div>

          {/* Make these columns more space-efficient on laptop screens */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-800">
              Quick Links
            </h3>
            <ul className="space-y-3">
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

          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-800">
              Properties
            </h3>
            <ul className="space-y-3">
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

          {/* Contact Information - Make sure it fits well on all screens */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-800">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">
                  Avenue Hassan II, Marrakech 40000, Morocco
                </span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                <a href="tel:+212522222222" className="text-gray-600 hover:text-primary-700 transition-colors">
                  +212 522 222 222
                </a>
              </li>
              <li className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                <a href="mailto:info@ormvah.com" className="text-gray-600 hover:text-primary-700 transition-colors truncate">
                  info@ormvah.com
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>
        
        {/* Copyright section */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ORMVAH. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-gray-600 hover:text-primary-800 transition-colors duration-200"
              >
                {t(link.name)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
