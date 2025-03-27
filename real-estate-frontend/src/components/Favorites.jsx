import React from 'react';
import Layout from './Layout';
import FavoriteProperties from './FavoriteProperties';
import { HeartIcon } from '@heroicons/react/24/outline';

export default function Favorites() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <FavoriteProperties />
        </div>
      </div>
    </Layout>
  );
}
