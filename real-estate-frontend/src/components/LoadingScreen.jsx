import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BuildingOfficeIcon, HomeIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function LoadingScreen() {
  const [loadingText, setLoadingText] = useState('Preparing your workspace');
  const [dots, setDots] = useState('');

  useEffect(() => {
    const loadingTexts = [
      'Gathering property insights',
      'Connecting market data',
      'Preparing your workspace',
      'Loading intelligent filters'
    ];

    const textCycle = setInterval(() => {
      setLoadingText(
        loadingTexts[Math.floor(Math.random() * loadingTexts.length)]
      );
    }, 3000);

    const dotCycle = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => {
      clearInterval(textCycle);
      clearInterval(dotCycle);
    };
  }, []);

  const iconVariants = {
    home: {
      rotate: [0, 10, -10, 0],
      transition: { 
        duration: 1.5, 
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    office: {
      scale: [1, 1.1, 1],
      transition: { 
        duration: 2, 
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    key: {
      x: [0, 5, -5, 0],
      transition: { 
        duration: 1.5, 
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center z-50 overflow-hidden">
      <div className="text-center relative">
        <div className="flex justify-center space-x-4 mb-6">
          <motion.div variants={iconVariants} animate="home">
            <HomeIcon className="w-12 h-12 text-blue-600 opacity-70" />
          </motion.div>
          <motion.div variants={iconVariants} animate="office">
            <BuildingOfficeIcon className="w-16 h-16 text-primary-600" />
          </motion.div>
          <motion.div variants={iconVariants} animate="key">
            <KeyIcon className="w-12 h-12 text-green-600 opacity-70" />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.3, 
            type: "spring", 
            stiffness: 100 
          }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {loadingText}{dots}
          </h2>
          <p className="text-sm text-gray-600 max-w-xs mx-auto">
            Our intelligent system is getting everything ready for your real estate experience
          </p>
        </motion.div>

        <motion.div 
          className="mt-6 w-64 h-1 bg-gray-200 rounded-full overflow-hidden"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <div className="h-full bg-primary-500 transform origin-left"></div>
        </motion.div>
      </div>
    </div>
  );
}