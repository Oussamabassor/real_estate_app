import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import Layout from '../components/Layout';
import LoadingScreen from '../components/LoadingScreen';

export default function Profile() {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);
  
  // Show loading screen if user data is still loading
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
          
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-purple-600">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-center">{user?.name}</h2>
            <p className="text-gray-500 text-center">{user?.email}</p>
            
            {user?.role && (
              <p className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full inline-block mt-2 mx-auto">
                {user.role === 'admin' ? 'Admin' : 'User'}
              </p>
            )}
          </div>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                disabled
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                disabled
              />
            </div>
            
            <div className="flex items-center justify-end pt-4">
              <span className="text-sm text-gray-500 mr-4">
                Account created on {new Date(user?.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}