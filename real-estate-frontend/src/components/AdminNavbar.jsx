import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
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
} from "@heroicons/react/24/outline";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-900/80"
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div className="fixed inset-y-0 left-0 w-64 bg-white">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="text-xl font-bold text-blue-800">Admin Panel</div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive(item.href) ? "text-blue-500" : "text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            ))}

            <hr className="my-4 border-gray-200" />

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3 text-gray-500" />
              Sign Out
            </button>
          </nav>
        </div>
      </div>

      {/* Desktop navigation */}
      <div className="hidden border-r border-gray-200 lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white">
          <div className="flex items-center flex-shrink-0 px-6 mb-5">
            <div className="text-xl font-bold text-blue-800">Admin Panel</div>
          </div>

          <div className="flex flex-col px-4 mb-6">
            <div className="flex items-center p-3 space-x-3 rounded-lg bg-blue-50">
              <div className="flex-shrink-0">
                <UserCircleIcon className="w-8 h-8 text-blue-700" />
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
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive(item.href) ? "text-blue-500" : "text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="px-4 mt-6">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3 text-gray-500" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Top navbar for mobile */}
      <div className="sticky top-0 z-40 bg-white shadow-sm lg:hidden">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="text-lg font-bold text-blue-800">Admin Panel</div>
          <div className="flex items-center">
            <UserCircleIcon className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>
    </>
  );
}
