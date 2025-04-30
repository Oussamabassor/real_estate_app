import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavbar />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isMobile ? "pl-0" : "lg:pl-64"
        }`}
      >
        {/* Main container with improved center alignment and responsive padding */}
        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 overflow-hidden">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
