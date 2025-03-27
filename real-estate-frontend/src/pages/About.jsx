import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <Layout>
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              About Us
            </h1>
            <p className="mt-5 text-xl text-gray-500">
              We are dedicated to providing the best real estate experience possible.
            </p>
          </motion.div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-50 p-8 rounded-lg shadow-sm"
              >
                <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
                <p className="mt-4 text-gray-600">
                  Our mission is to help people find their perfect property and make the buying or renting process
                  as simple and stress-free as possible. We believe that everyone deserves to live in a place they love.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gray-50 p-8 rounded-lg shadow-sm"
              >
                <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
                <p className="mt-4 text-gray-600">
                  We envision a world where finding and securing your ideal property is efficient, transparent,
                  and enjoyable. We're constantly innovating to make this vision a reality.
                </p>
              </motion.div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 bg-gray-50 p-8 rounded-lg shadow-sm"
          >
            <h2 className="text-2xl font-bold text-gray-900">Our Team</h2>
            <p className="mt-4 text-gray-600">
              Our team consists of passionate real estate professionals who have extensive experience in the industry.
              We're dedicated to providing exceptional service and guidance throughout your property journey.
            </p>
            
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Team placeholder */}
              {['John Doe', 'Jane Smith', 'Mike Johnson'].map((name, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto h-32 w-32 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500"></div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{name}</h3>
                  <p className="text-sm text-gray-500">Real Estate Expert</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
