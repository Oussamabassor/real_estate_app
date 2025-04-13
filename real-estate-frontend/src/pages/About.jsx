import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  TrophyIcon,
  LightBulbIcon,
  HeartIcon,
  SparklesIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const About = () => {
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
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const team = [
    {
      name: "Sarah Johnson",
      position: "Chief Executive Officer",
      bio: "With over 15 years in luxury real estate, Sarah leads our company with innovation and excellence.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=1000"
    },
    {
      name: "Michael Chen",
      position: "Head of Property Acquisition",
      bio: "Michael's expertise in market analysis ensures we secure only the most exceptional properties.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=1000"
    },
    {
      name: "Olivia Martinez",
      position: "Director of Client Relations",
      bio: "Olivia's dedication to client satisfaction creates seamless experiences for all our customers.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=1000"
    }
  ];

  const values = [
    {
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service, from property selection to customer care.",
      icon: TrophyIcon
    },
    {
      title: "Integrity",
      description: "Transparency and honesty are at the core of our business, building trust with clients and partners.",
      icon: HeartIcon
    },
    {
      title: "Innovation",
      description: "We embrace new technology and methods to improve the real estate experience for our clients.",
      icon: LightBulbIcon
    },
    {
      title: "Client Focus",
      description: "Our client's satisfaction is our highest priority, guiding all our decisions and actions.",
      icon: SparklesIcon
    }
  ];

  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Enhanced gradient overlay */}
          <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              background: 'linear-gradient(135deg, rgba(15,44,92,0.97), rgba(26,58,108,0.85))',
              zIndex: 1
          }}></div>
          
          {/* Decorative patterns */}
          <div className="absolute inset-0 opacity-10 z-0">
              <div className="absolute top-0 left-0 w-full h-32 bg-white opacity-5 transform -skew-y-6"></div>
              <div className="absolute bottom-0 right-0 w-full h-32 bg-white opacity-5 transform skew-y-6"></div>
          </div>
          
          {/* Geometric decorations */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full border-2 border-white opacity-10 z-0"></div>
          <div className="absolute bottom-1/3 left-1/3 w-40 h-40 rounded-full border border-white opacity-10 z-0"></div>
          
          {/* Hero background image */}
          <img 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=1350" 
              alt="About Our Company" 
              className="w-full h-full object-cover"
              style={{ opacity: 0.6, position: 'relative' }}
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 pt-36 pb-20 text-center">
          {/* Breadcrumb navigation */}
          <motion.nav 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 flex justify-center"
          >
              <ol className="flex items-center space-x-2 text-sm text-yellow-300">
                  <li><Link to="/" className="hover:text-yellow-200">Home</Link></li>
                  <li><span className="mx-2">/</span></li>
                  <li className="font-medium">About Us</li>
              </ol>
          </motion.nav>
          
          {/* Golden accent line */}
          <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center mb-8"
          >
              <div style={{ height: "2px", width: "80px", backgroundColor: "#c8a55b", margin: "0 auto" }}></div>
          </motion.div>
          
          {/* Animated heading */}
          <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
              style={{ 
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)"
              }}
          >
              About <span style={{ color: "#c8a55b" }}>ORMVAH</span> Real Estate
          </motion.h1>
          
          {/* Animated description */}
          <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto"
          >
              Exceptional properties, extraordinary service, and unmatched expertise in luxury real estate since 2005
          </motion.p>
          
          {/* Company stats */}
          <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex justify-center space-x-10"
          >
              <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white">15+</span>
                  <span className="text-sm text-blue-100">Years of Excellence</span>
              </div>
              <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white">500+</span>
                  <span className="text-sm text-blue-100">Properties Sold</span>
              </div>
              <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white">20+</span>
                  <span className="text-sm text-blue-100">Industry Awards</span>
              </div>
          </motion.div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <div style={{ height: "2px", width: "48px", backgroundColor: "#c8a55b" }}></div>
              </div>
              <h2 style={{ 
                fontSize: "2.25rem",
                fontWeight: "700", 
                color: "#0f2c5c", 
                marginBottom: "1rem" 
              }}>Our Story</h2>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-xl overflow-hidden shadow-lg"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=1350" 
                    alt="Our Office" 
                    className="w-full h-auto"
                  />
                </motion.div>
              </div>
              <div className="space-y-6">
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-2xl font-semibold" 
                  style={{ color: "#0f2c5c" }}
                >
                  Building Excellence in Luxury Real Estate
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-gray-600 leading-relaxed"
                >
                  Founded in 2005, ORMVAH began with a vision to transform the luxury real estate market by offering 
                  exceptional properties paired with unparalleled service. What started as a boutique agency has 
                  grown into an industry leader with a reputation for excellence and integrity.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-gray-600 leading-relaxed"
                >
                  Our journey is marked by a deep commitment to understanding the unique needs of each client, 
                  whether they're first-time buyers or seasoned investors. Today, we continue to set the standard 
                  for luxury real estate, combining traditional values with innovative approaches.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mission, Vision & Values */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: "#0f2c5c" }}>Our Mission</h3>
                <p className="text-gray-600">
                  To connect discerning clients with exceptional properties that match their lifestyle and aspirations,
                  through personalized service and unmatched real estate expertise.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <GlobeAltIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: "#0f2c5c" }}>Our Vision</h3>
                <p className="text-gray-600">
                  To be the most trusted name in luxury real estate, known for our curated property portfolio,
                  innovative solutions, and commitment to exceeding client expectations.
                </p>
              </motion.div>
            </motion.div>

            <div className="mt-16 text-center">
              <div className="flex justify-center mb-4">
                <div style={{ height: "2px", width: "48px", backgroundColor: "#c8a55b" }}></div>
              </div>
              <h2 style={{ 
                fontSize: "2.25rem",
                fontWeight: "700", 
                color: "#0f2c5c", 
                marginBottom: "1rem" 
              }}>Our Values</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
                The principles that guide our business and shape the experience we provide to our clients
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <motion.div 
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: "#0f2c5c" }}>{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <div style={{ height: "2px", width: "48px", backgroundColor: "#c8a55b" }}></div>
              </div>
              <h2 style={{ 
                fontSize: "2.25rem",
                fontWeight: "700", 
                color: "#0f2c5c", 
                marginBottom: "1rem" 
              }}>Leadership Team</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Meet the experienced professionals guiding our company
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {team.map((member, index) => (
                <motion.div 
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1" style={{ color: "#0f2c5c" }}>{member.name}</h3>
                    <p className="text-sm font-medium" style={{ color: "#c8a55b" }}>{member.position}</p>
                    <p className="mt-4 text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex justify-center mb-4">
              <div style={{ height: "2px", width: "48px", backgroundColor: "#c8a55b" }}></div>
            </div>
            <h2 style={{ 
              fontSize: "2.25rem",
              fontWeight: "700", 
              color: "#0f2c5c", 
              marginBottom: "1rem" 
            }}>Ready to Find Your Dream Property?</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Our team of experts is ready to help you discover the perfect property that meets all your needs
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/properties" 
                style={{
                  backgroundColor: "#0f2c5c",
                  color: "#ffffff",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  transition: "all 0.3s ease"
                }}
                className="hover:bg-blue-700 hover:shadow-lg"
              >
                Browse Properties
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                to="/contact" 
                style={{
                  backgroundColor: "#c8a55b",
                  color: "#0f2c5c",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  transition: "all 0.3s ease"
                }}
                className="hover:bg-amber-400 hover:shadow-lg"
              >
                Contact Us
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
