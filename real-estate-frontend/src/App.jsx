import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks';
import { Suspense, lazy, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import AdminLayout from './components/AdminLayout';

// Lazy-loaded pages that exist or will be created with placeholder components
const Home = lazy(() => import('./pages/Home'));
const Properties = lazy(() => import('./pages/Properties'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const Reservations = lazy(() => import('./pages/Reservations'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const About = lazy(() => import('./pages/About'));

// Updated import for Favorites to use components folder
const Favorites = lazy(() => import('./components/Favorites'));

// Admin components from the components directory
const Dashboard = lazy(() => import('./components/Dashboard'));
const AdminProperties = lazy(() => import('./components/AdminProperties'));
const AdminUsers = lazy(() => import('./components/AdminUsers'));
const AdminReservations = lazy(() => import('./components/AdminReservations'));
const AdminRevenue = lazy(() => import('./components/AdminRevenue'));
const AdminSettings = lazy(() => import('./components/AdminSettings'));

// Admin route component - wraps content with AdminLayout
const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Only redirect after auth is fully initialized and not loading
    if (initialized && !loading) {
      // If not authenticated at all, redirect to login
      if (!isAuthenticated) {
        navigate('/login', { 
          replace: true,
          state: { from: location, message: 'You need to be logged in to access the admin area' } 
        });
      } 
      // If authenticated but not admin, redirect to home with message
      else if (user && user.role !== 'admin') {
        console.warn('Non-admin user attempting to access admin route');
        navigate('/', { 
          replace: true,
          state: { 
            adminAccessDenied: true,
            message: 'You do not have permission to access the admin area' 
          } 
        });
      }
    }
  }, [user, loading, isAuthenticated, initialized, navigate, location]);
  
  // Show loading screen while checking authentication
  if (loading || !initialized) {
    return <LoadingScreen />;
  }
  
  // Only render children if user is authenticated and has admin role
  return isAuthenticated && user?.role === 'admin' ? (
    <AdminLayout>{children}</AdminLayout>
  ) : null;
};

// User route component - only allows authenticated users, redirects admins to admin dashboard
const UserRoute = ({ children }) => {
  const { user, loading, isAuthenticated, initialized } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (initialized && !loading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      }
      // If admin user, redirect to admin dashboard
      else if (user?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [user, loading, isAuthenticated, initialized, navigate]);
  
  // Show loading screen while checking authentication
  if (loading || !initialized) {
    return <LoadingScreen />;
  }
  
  // Only render children if user is authenticated and not an admin
  return isAuthenticated && user?.role !== 'admin' ? children : null;
};

// Profile route - accessible by both user and admin
const ProfileRoute = ({ children }) => {
  const { isAuthenticated, loading, initialized } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (initialized && !loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [loading, isAuthenticated, initialized, navigate]);
  
  // Show loading screen while checking authentication
  if (loading || !initialized) {
    return <LoadingScreen />;
  }
  
  // Render children if user is authenticated (regardless of role)
  return isAuthenticated ? children : null;
};

function App() {
  const { initialized } = useAuth();
  
  if (!initialized) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="app">
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public routes - accessible by everyone */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Profile route - accessible by both regular users and admins */}
          <Route path="/profile" element={<ProfileRoute><Profile /></ProfileRoute>} />
          
          {/* User-only routes - not accessible by admins */}
          <Route path="/reservations" element={<UserRoute><Reservations /></UserRoute>} />
          <Route path="/favorites" element={<UserRoute><Favorites /></UserRoute>} />
          
          {/* Admin-only routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/properties" element={<AdminRoute><AdminProperties /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/reservations" element={<AdminRoute><AdminReservations /></AdminRoute>} />
          <Route path="/admin/revenue" element={<AdminRoute><AdminRevenue /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          
          {/* Admin redirect - redirects admin from / to /admin/dashboard */}
          <Route 
            path="/admin" 
            element={<AdminRoute><Navigate to="/admin/dashboard" replace /></AdminRoute>} 
          />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
