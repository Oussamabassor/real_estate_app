import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// Fix the import path to use the index.js file
import { useAuth } from './hooks';
import { Suspense, lazy, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';

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

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, initialized } = useAuth();
  
  // Show loading screen while checking authentication
  if (loading || !initialized) {
    return <LoadingScreen />;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);
  
  if (loading) return <LoadingScreen />;
  
  return user && user.role === 'admin' ? children : null;
};

function App() {
  const { initialized } = useAuth();
  
  console.log('App rendered, auth initialized:', initialized);
  
  // Show loading screen while initializing auth
  if (!initialized) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="app">
      {/* Remove or comment out this line if it exists */}
      {/* <OfflineNotice /> */}
      
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected user routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/properties" element={<AdminRoute><AdminProperties /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/reservations" element={<AdminRoute><AdminReservations /></AdminRoute>} />
          <Route path="/admin/revenue" element={<AdminRoute><AdminRevenue /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
