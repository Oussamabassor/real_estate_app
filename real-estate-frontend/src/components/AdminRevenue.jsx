import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminRevenue() {
  // Mock revenue data
  const monthlyRevenue = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: [12000, 19000, 15000, 23000, 28000, 32000],
        backgroundColor: 'rgba(124, 58, 237, 0.5)',
        borderColor: 'rgb(124, 58, 237)',
      }
    ]
  };

  const revenueByType = {
    labels: ['Apartments', 'Bungalows', 'Other'],
    datasets: [
      {
        label: 'Revenue by Property Type',
        data: [65000, 45000, 15000],
        backgroundColor: [
          'rgba(124, 58, 237, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Revenue Dashboard</h1>
      
      {/* Revenue summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-500 mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold text-gray-900">$129,000</p>
          <p className="text-sm text-green-600 mt-2">+12.5% from last period</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-500 mb-2">Average Revenue</h2>
          <p className="text-3xl font-bold text-gray-900">$21,500</p>
          <p className="text-sm text-green-600 mt-2">+5.3% from last period</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-500 mb-2">Total Bookings</h2>
          <p className="text-3xl font-bold text-gray-900">48</p>
          <p className="text-sm text-green-600 mt-2">+8.7% from last period</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue</h2>
          <Line 
            data={monthlyRevenue} 
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' }
              }
            }}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue by Property Type</h2>
          <Bar 
            data={revenueByType}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
