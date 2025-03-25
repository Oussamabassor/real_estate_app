import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import {
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  HomeIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/dashboard-stats');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    }
  });

  const stats = [
    {
      name: 'Total Revenue',
      value: dashboardData?.totalRevenue || 0,
      icon: CurrencyDollarIcon,
      change: '+12.3%',
      trend: 'up',
    },
    {
      name: 'Active Users',
      value: dashboardData?.activeUsers || 0,
      icon: UserGroupIcon,
      change: '+5.4%',
      trend: 'up',
    },
    {
      name: 'Properties Listed',
      value: dashboardData?.totalProperties || 0,
      icon: HomeIcon,
      change: '+7.8%',
      trend: 'up',
    },
    {
      name: 'Reservations',
      value: dashboardData?.totalReservations || 0,
      icon: CalendarIcon,
      change: '+3.2%',
      trend: 'up',
    }
  ];

  const navigationItems = [
    { name: 'Overview', icon: ChartBarIcon, tab: 'overview' },
    { name: 'Properties', icon: HomeIcon, tab: 'properties' },
    { name: 'Users', icon: UserGroupIcon, tab: 'users' },
    { name: 'Reservations', icon: CalendarIcon, tab: 'reservations' },
    { name: 'Revenue', icon: CurrencyDollarIcon, tab: 'revenue' },
    { name: 'Settings', icon: Cog6ToothIcon, tab: 'settings' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
          </div>
          <nav className="mt-6">
            {navigationItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === item.tab
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="mt-1 text-sm text-gray-500">Here's what's happening with your properties today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="mt-2 text-3xl font-bold text-gray-900">
                        {stat.name.includes('Revenue') ? `$${stat.value.toLocaleString()}` : stat.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <stat.icon className={`w-6 h-6 ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <ArrowTrendingUpIcon className={`w-4 h-4 mr-1 ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <span className={`text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last month
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Revenue Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                <Line
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                      {
                        label: 'Revenue',
                        data: dashboardData?.revenueData || [],
                        borderColor: 'rgb(99, 102, 241)',
                        tension: 0.3,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </motion.div>

              {/* Properties by Type */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties by Type</h3>
                <Doughnut
                  data={{
                    labels: ['Apartments', 'Houses', 'Villas', 'Commercial'],
                    datasets: [
                      {
                        data: dashboardData?.propertiesByType || [30, 25, 20, 25],
                        backgroundColor: [
                          'rgb(99, 102, 241)',
                          'rgb(16, 185, 129)',
                          'rgb(249, 115, 22)',
                          'rgb(59, 130, 246)',
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {(dashboardData?.recentActivity || []).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-900">{activity.user}</span>
                      <span className="text-sm text-gray-500">{activity.action}</span>
                    </div>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
