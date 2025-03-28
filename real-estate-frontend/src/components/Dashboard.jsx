import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks';
import {
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  HomeIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useAdminDashboardData } from '../hooks/useDashboardData';
import ChartWrapper from './ChartWrapper';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,  // This is needed for Doughnut charts
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const { user } = useAuth();
  const { data: dashboardData, loading, error } = useAdminDashboardData();
  
  // Define meaningful stats with trends
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
      name: 'Occupancy Rate',
      value: dashboardData?.occupancyRate || 0,
      suffix: '%',
      icon: CalendarIcon,
      change: '+3.2%',
      trend: 'up',
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Admin'}!</h1>
        <p className="mt-1 text-sm text-gray-500">Here's what's happening with your properties today.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

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
                  {stat.name.includes('Revenue') ? `$${stat.value.toLocaleString()}` : 
                    stat.suffix ? `${stat.value.toLocaleString()}${stat.suffix}` : 
                    stat.value.toLocaleString()}
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

      {/* Charts and Popular Properties Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <ChartWrapper id="revenue-chart">
            <Line
              data={{
                labels: dashboardData?.revenueMonths || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'Monthly Revenue',
                    data: dashboardData?.revenueData || [],
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.3,
                    fill: true
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `Revenue: $${context.raw.toLocaleString()}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + value.toLocaleString();
                      }
                    }
                  }
                }
              }}
            />
          </ChartWrapper>
        </motion.div>

        {/* Properties by Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties by Type</h3>
          <ChartWrapper id="doughnut-chart">
            <Doughnut
              data={{
                labels: ['Apartments', 'Bungalows', 'Other'],
                datasets: [
                  {
                    data: dashboardData?.propertiesByType || [30, 25, 5],
                    backgroundColor: [
                      'rgb(99, 102, 241)',
                      'rgb(16, 185, 129)',
                      'rgb(249, 115, 22)',
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
                cutout: '65%'
              }}
              redraw={true}
            />
          </ChartWrapper>
        </motion.div>
      </div>

      {/* Popular Properties */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Properties</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(dashboardData?.popularProperties || []).map((property, index) => (
                <tr key={property.id || index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{property.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.reservations}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${property.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, property.reservations * 8)}%` }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {(dashboardData?.recentActivity || []).map((activity, index) => (
            <div key={activity.id || index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'confirmed' ? 'bg-green-500' :
                  activity.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-900">{activity.user}</span>
                <span className="text-sm text-gray-500">{activity.action}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">${activity.amount.toLocaleString()}</span>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
