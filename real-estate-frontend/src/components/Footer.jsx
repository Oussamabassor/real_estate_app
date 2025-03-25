import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
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
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="bg-white border-t border-gray-200"
    >
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <BuildingOfficeIcon className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">ORMVAH</span>
            </motion.div>
            <p className="text-sm text-gray-600">{t("footer.description")}</p>
            <div className="flex space-x-4">
              {socialLinks.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-primary-600"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  variants={itemVariants}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="sr-only">{t(item.name)}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 font-semibold text-gray-900">
              {t("footer.company")}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <motion.li key={link.name} variants={itemVariants}>
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to={link.href}
                      className="text-gray-600 transition-colors hover:text-primary-600"
                    >
                      {t(link.name)}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resource Links */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 font-semibold text-gray-900">
              {t("footer.resources")}
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link, index) => (
                <motion.li key={link.name} variants={itemVariants}>
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to={link.href}
                      className="text-gray-600 transition-colors hover:text-primary-600"
                    >
                      {t(link.name)}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 font-semibold text-gray-900">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-3">
              <motion.li
                variants={itemVariants}
                className="flex items-center space-x-3 text-gray-600"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PhoneIcon className="w-5 h-5 text-primary-600" />
                </motion.div>
                <span>+212 6 65 65 21 68</span>
              </motion.li>
              <motion.li
                variants={itemVariants}
                className="flex items-center space-x-3 text-gray-600"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <EnvelopeIcon className="w-5 h-5 text-primary-600" />
                </motion.div>
                <span>ormvah@gmail.ma</span>
              </motion.li>
              <motion.li
                variants={itemVariants}
                className="flex items-start space-x-3 text-gray-600"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MapPinIcon className="w-5 h-5 mt-1 text-primary-600" />
                </motion.div>
                <span>
                  123 Avenue de l'Immobilier,
                  <br />
                  40000, Marrakech, France
                </span>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="pt-8 mt-12 border-t border-gray-200"
        >
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            {/* Copyright */}
            <motion.div
              variants={itemVariants}
              className="text-sm text-gray-600"
            >
              &copy; {new Date().getFullYear()} ORMVAH. Tous droits réservés.
            </motion.div>

            {/* Legal Links */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center space-x-6"
            >
              {legalLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-primary-600"
                  >
                    {t(link.name)}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
