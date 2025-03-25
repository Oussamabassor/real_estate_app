import { useState, useEffect } from 'react';
import axios from 'axios';

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    revenueData: [],
    occupationData: [],
    typesData: [],
    users: [],
    reservations: [],
    stats: {
      totalReservations: 0,
      monthlyRevenue: 0,
      occupationRate: 0,
      premiumReservations: 0
    }
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Replace these with your actual API endpoints
      const [
        revenueResponse,
        occupationResponse,
        typesResponse,
        usersResponse,
        reservationsResponse,
        statsResponse
      ] = await Promise.all([
        axios.get('/api/revenue'),
        axios.get('/api/occupation'),
        axios.get('/api/property-types'),
        axios.get('/api/users'),
        axios.get('/api/reservations'),
        axios.get('/api/stats')
      ]);

      setData({
        revenueData: revenueResponse.data,
        occupationData: occupationResponse.data,
        typesData: typesResponse.data,
        users: usersResponse.data,
        reservations: reservationsResponse.data,
        stats: statsResponse.data
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refetch = () => {
    fetchDashboardData();
  };

  return { data, loading, error, refetch };
};
