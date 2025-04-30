import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check scroll position to add shadow to navbar when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
    { name: "Properties", href: "/admin/properties", icon: BuildingOfficeIcon },
    { name: "Users", href: "/admin/users", icon: UsersIcon },
    { name: "Reservations", href: "/admin/reservations", icon: CalendarIcon },
    { name: "Revenue", href: "/admin/revenue", icon: ChartBarIcon },
    { name: "Settings", href: "/admin/settings", icon: Cog6ToothIcon },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/80"
              onClick={() => setSidebarOpen(false)}
            ></motion.div>

            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white"
            >
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <div className="text-xl font-bold text-primary-700">
                  Admin Panel
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
                <div className="flex items-center p-3 mb-6 space-x-3 rounded-lg bg-primary-50">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="w-10 h-10 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || "admin@example.com"}
                    </p>
                  </div>
                </div>

                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive(item.href)
                          ? "text-primary-600"
                          : "text-gray-500"
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}

                <hr className="my-4 border-gray-200" />

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3 text-gray-500" />
                  Sign Out
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop navigation */}
      <div className="hidden border-r border-gray-200 lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white">
          <div className="flex items-center flex-shrink-0 px-6 mb-5">
            <div className="text-xl font-bold text-primary-700">
              Admin Panel
            </div>
          </div>

          <div className="flex flex-col px-4 mb-6">
            <div className="flex items-center p-3 space-x-3 rounded-lg bg-primary-50">
              <div className="flex-shrink-0">
                <UserCircleIcon className="w-10 h-10 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 mt-1 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive(item.href) ? "text-primary-600" : "text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="px-4 mt-6">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3 text-gray-500" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Top navbar for mobile */}
      <div
        className={`sticky top-0 z-40 bg-white transition-shadow lg:hidden ${
          isScrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Open sidebar"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          <div className="text-lg font-bold text-primary-700">Admin Panel</div>

          <div className="flex items-center space-x-3">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
              aria-label="Notifications"
            >
              <span className="relative inline-block">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </span>
            </button>

            <button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none"
              aria-label="User menu"
              onClick={() => navigate("/admin/settings")}
            >
              <UserCircleIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
