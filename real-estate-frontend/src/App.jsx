import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth, AuthProvider } from './hooks';
import { LanguageProvider } from './context/LanguageContext';
import LoadingScreen from './components/LoadingScreen';
import AdminLayout from './components/AdminLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Add these imports to make sure Tailwind's custom colors work
import './index.css'; // Make sure this imports your main CSS file with Tailwind

// Lazy-loaded pages that exist or will be created with placeholder components
const Home = React.lazy(() => import('./pages/Home'));
const Properties = React.lazy(() => import('./pages/Properties'));
const PropertyDetail = React.lazy(() => import('./pages/PropertyDetail'));
const Reservations = React.lazy(() => import('./pages/Reservations'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Contact = React.lazy(() => import('./pages/Contact'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const About = React.lazy(() => import('./pages/About'));

// Updated import for Favorites to use components folder
const Favorites = React.lazy(() => import('./components/Favorites'));

// Admin components from the components directory
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const AdminProperties = React.lazy(() => import('./components/AdminProperties'));
const AdminUsers = React.lazy(() => import('./components/AdminUsers'));
const AdminReservations = React.lazy(() => import('./components/AdminReservations'));
const AdminRevenue = React.lazy(() => import('./components/AdminRevenue'));
const AdminSettings = React.lazy(() => import('./components/AdminSettings'));

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  const { initialized, isAuthenticated, user } = useAuth();
  
  if (!initialized) {
    return <LoadingScreen />;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <div className="app-container">
            <ErrorBoundary>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  {/* Public routes - accessible by everyone */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/properties/:id" element={<PropertyDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Profile route - accessible by both regular users and admins */}
                  <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
                  
                  {/* User-only routes - not accessible by admins */}
                  <Route path="/reservations" element={
                    isAuthenticated && user?.role !== 'admin' ? 
                      <Reservations /> : 
                      isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
                  } />
                  <Route path="/favorites" element={
                    isAuthenticated && user?.role !== 'admin' ? 
                      <Favorites /> : 
                      isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
                  } />
                  
                  {/* Admin-only routes */}
                  <Route path="/admin/dashboard" element={
                    isAuthenticated && user?.role === 'admin' ? 
                      <AdminLayout><Dashboard /></AdminLayout> : 
                      isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
                  } />
                  <Route path="/admin/properties" element={
                    isAuthenticated && user?.role === 'admin' ? 
                      <AdminLayout><AdminProperties /></AdminLayout> : 
                      isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
                  } />
                  <Route path="/admin/users" element={
                    isAuthenticated && user?.role === 'admin' ? 
                      <AdminLayout><AdminUsers /></AdminLayout> : 
                      isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
                  } />
                  <Route path="/admin/reservations" element={
                    isAuthenticated && user?.role === 'admin' ? 
                      <AdminLayout><AdminReservations /></AdminLayout> : 
                      isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
                  } />
                  <Route path="/admin/revenue" element={
                    isAuthenticated && user?.role === 'admin' ? 
                      <AdminLayout><AdminRevenue /></AdminLayout> : 
                      isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
                  } />
                  <Route path="/admin/settings" element={
                    isAuthenticated && user?.role === 'admin' ? 
                      <AdminLayout><AdminSettings /></AdminLayout> : 
                      isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
                  } />
                  
                  {/* Admin redirect - redirects admin from / to /admin/dashboard */}
                  <Route 
                    path="/admin" 
                    element={
                      isAuthenticated && user?.role === 'admin' ? 
                        <Navigate to="/admin/dashboard" replace /> : 
                        isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
                    } 
                  />
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </div>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
