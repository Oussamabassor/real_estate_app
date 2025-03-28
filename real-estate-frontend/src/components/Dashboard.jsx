import React from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  HomeIcon, 
  CalendarIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../hooks';
import { useAdminDashboardData } from '../hooks/useAdminData';
import ChartWrapper from './ChartWrapper';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
      bgColor: 'bg-gradient-to-r from-primary-50 to-blue-50',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-800',
      borderColor: 'border-primary-100'
    },
    {
      name: 'Active Users',
      value: dashboardData?.activeUsers || 0,
      icon: UserGroupIcon,
      change: '+5.4%',
      trend: 'up',
      bgColor: 'bg-gradient-to-r from-green-50 to-teal-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-800',
      borderColor: 'border-green-100'
    },
    {
      name: 'Properties Listed',
      value: dashboardData?.totalProperties || 0,
      icon: HomeIcon,
      change: '+7.8%',
      trend: 'up',
      bgColor: 'bg-gradient-to-r from-gold-50 to-amber-50',
      iconBg: 'bg-gold-100',
      iconColor: 'text-gold-800',
      borderColor: 'border-gold-100'
    },
    {
      name: 'Occupancy Rate',
      value: dashboardData?.occupancyRate || 0,
      suffix: '%',
      icon: CalendarIcon,
      change: '+3.2%',
      trend: 'up',
      bgColor: 'bg-gradient-to-r from-purple-50 to-indigo-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-800',
      borderColor: 'border-purple-100'
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
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl shadow-sm border ${stat.borderColor} ${stat.bgColor} hover:shadow-md transition-shadow duration-300`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </p>
                <div className="mt-1 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}{stat.suffix || ''}
                  </p>
                  <p className={`ml-2 flex items-baseline text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" aria-hidden="true" />
                    ) : (
                      <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" aria-hidden="true" />
                    )}
                    <span className="sr-only">{stat.trend === 'up' ? 'Increased' : 'Decreased'} by</span>
                    {stat.change}
                  </p>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.iconBg}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <ChartWrapper height={300}>
            <Line
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                  {
                    label: 'Revenue',
                    data: [12000, 19000, 15000, 24000, 28000, 30000, 35000, 39000, 42000, 45000, 48000, 52000],
                    borderColor: '#1E3A8A',
                    backgroundColor: 'rgba(30, 58, 138, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1E3A8A',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    padding: 12,
                    bodyFont: {
                      family: "'Inter', 'Poppins', sans-serif",
                      size: 14
                    },
                    titleFont: {
                      family: "'Inter', 'Poppins', sans-serif",
                      size: 14,
                      weight: 'bold'
                    },
                    callbacks: {
                      label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                          label += ': ';
                        }
                        if (context.parsed.y !== null) {
                          label += new Intl.NumberFormat('en-US', { 
                            style: 'currency', 
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(context.parsed.y);
                        }
                        return label;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: true,
                      drawBorder: false,
                      color: 'rgba(226, 232, 240, 0.7)'
                    },
                    ticks: {
                      callback: function(value) {
                        return '$' + value.toLocaleString();
                      }
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
              redraw={true}
            />
          </ChartWrapper>
        </motion.div>

        {/* Property Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Type Distribution</h3>
          <ChartWrapper height={300}>
            <Bar
              data={{
                labels: ['Apartments', 'Houses', 'Villas', 'Commercial', 'Land'],
                datasets: [
                  {
                    label: 'Properties',
                    data: [65, 42, 18, 28, 13],
                    backgroundColor: [
                      'rgba(30, 58, 138, 1)',
                      'rgba(30, 58, 138, 0.8)',
                      'rgba(30, 58, 138, 0.6)',
                      'rgba(30, 58, 138, 0.4)',
                      'rgba(30, 58, 138, 0.3)',
                      'rgba(30, 58, 138, 0.2)'
                    ],
                    borderRadius: 6
                  }
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: true,
                      drawBorder: false,
                      color: 'rgba(226, 232, 240, 0.7)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
              redraw={true}
            />
          </ChartWrapper>
        </motion.div>

        {/* User Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <div className="h-60 w-60 relative">
                <Doughnut
                  data={{
                    labels: ['Property Owners', 'Tenants', 'Agents', 'Admins'],
                    datasets: [
                      {
                        data: [45, 35, 15, 5],
                        backgroundColor: [
                          '#1E3A8A',
                          '#F59E0B',
                          '#10B981',
                          '#6366F1'
                        ],
                        borderWidth: 0,
                        cutout: '75%'
                      }
                    ]
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
              </div>
            </div>
          </div>
        </motion.div>

        {/* Popular Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Properties</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popularity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(dashboardData?.popularProperties || [
                  { id: 1, name: 'Luxury Downtown Apartment', location: 'New York', views: 1243, reservations: 12, revenue: 24600 },
                  { id: 2, name: 'Beachfront Villa', location: 'Miami', views: 987, reservations: 8, revenue: 35800 },
                  { id: 3, name: 'Modern Loft', location: 'San Francisco', views: 756, reservations: 6, revenue: 18200 },
                  { id: 4, name: 'Country House', location: 'Austin', views: 532, reservations: 4, revenue: 12400 }
                ]).map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{property.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.views.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.reservations}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${property.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary-800 h-2.5 rounded-full" style={{ width: `${Math.min(100, property.reservations * 8)}%` }}></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-5">
          {(dashboardData?.recentActivity || [
            { id: 1, type: 'booking', user: 'John Smith', property: 'Luxury Downtown Apartment', time: '2 hours ago', status: 'completed' },
            { id: 2, type: 'message', user: 'Emily Johnson', property: 'Beachfront Villa', time: '5 hours ago', status: 'pending' },
            { id: 3, type: 'booking', user: 'Michael Brown', property: 'Modern Loft', time: '1 day ago', status: 'cancelled' },
            { id: 4, type: 'review', user: 'Sarah Wilson', property: 'Country House', time: '2 days ago', status: 'completed' }
          ]).map((activity) => (
            <div key={activity.id} className="flex">
              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                activity.type === 'booking' ? 'bg-blue-100' : 
                activity.type === 'message' ? 'bg-green-100' : 
                activity.type === 'review' ? 'bg-yellow-100' : 'bg-gray-100'
              }`}>
                {activity.type === 'booking' ? (
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                ) : activity.type === 'message' ? (
                  <ChartBarIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <UserGroupIcon className="h-5 w-5 text-yellow-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user}{' '}
                    {activity.type === 'booking' && 'booked'}
                    {activity.type === 'message' && 'inquired about'}
                    {activity.type === 'review' && 'reviewed'}{' '}
                    <span className="font-semibold">{activity.property}</span>
                  </p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                <div className="mt-1 flex">
                  {activity.status === 'completed' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  )}
                  {activity.status === 'pending' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  )}
                  {activity.status === 'cancelled' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Cancelled
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
