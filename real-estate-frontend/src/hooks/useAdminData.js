import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Custom hook to fetch admin dashboard data
 * 
 * @returns {Object} Contains data, loading state, and error state
 */
export const useAdminDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Since the actual API endpoint might not exist yet, we'll use mock data
        // This would normally be: const response = await api.get('/admin/dashboard');
        
        // Mock data for development
        const mockData = {
          totalRevenue: 245000,
          activeUsers: 1243,
          totalProperties: 87,
          occupancyRate: 92,
          popularProperties: [
            { id: 1, name: 'Luxury Downtown Apartment', location: 'New York', views: 1243, reservations: 12, revenue: 24600 },
            { id: 2, name: 'Beachfront Villa', location: 'Miami', views: 987, reservations: 8, revenue: 35800 },
            { id: 3, name: 'Modern Loft', location: 'San Francisco', views: 756, reservations: 6, revenue: 18200 },
            { id: 4, name: 'Country House', location: 'Austin', views: 532, reservations: 4, revenue: 12400 }
          ],
          recentActivity: [
            { id: 1, type: 'booking', user: 'John Smith', property: 'Luxury Downtown Apartment', time: '2 hours ago', status: 'completed' },
            { id: 2, type: 'message', user: 'Emily Johnson', property: 'Beachfront Villa', time: '5 hours ago', status: 'pending' },
            { id: 3, type: 'booking', user: 'Michael Brown', property: 'Modern Loft', time: '1 day ago', status: 'cancelled' },
            { id: 4, type: 'review', user: 'Sarah Wilson', property: 'Country House', time: '2 days ago', status: 'completed' }
          ],
          propertyDistribution: {
            apartment: 65,
            house: 42,
            villa: 18,
            commercial: 28,
            land: 13
          },
          userDistribution: {
            propertyOwners: 45,
            tenants: 35,
            agents: 15,
            admins: 5
          },
          revenueHistory: [
            12000, 19000, 15000, 24000, 28000, 30000, 35000, 39000, 42000, 45000, 48000, 52000
          ]
        };

        // Simulate API delay
        setTimeout(() => {
          setData(mockData);
          setLoading(false);
        }, 800);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading, error };
};

export default useAdminDashboardData;