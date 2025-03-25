import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-4"
        >
          <BuildingOfficeIcon className="w-16 h-16 text-primary-600" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          <p className="mt-2 text-sm text-gray-500">Please wait while we prepare everything for you</p>
        </motion.div>
      </div>
    </div>
  );
}

