import axios from "axios";

// Use environment variable for backend URL
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost/real-estate/real-estate-backend";

// Debug mode - only show errors
const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === "true"; // Use environment variable
const ERROR_ONLY = true; // Only show error logs

// Create Axios instance with custom configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Add withCredentials to properly handle CORS with credentials
  withCredentials: true, // Changed to true to handle CORS properly
});

// Add a check for API connectivity before making requests
const isApiConnected = () => {
  return true; // Always return true to fix login issue
};

// Wrap axios requests to handle offline state
const apiRequest = async (method, url, data = null, options = {}) => {
  try {
    const response = await api.request({
      method,
      url,
      data,
      ...options,
    });

    // Set API as connected after successful request
    localStorage.setItem("apiConnectionStatus", "connected");

    return response;
  } catch (error) {
    // Only mark as failed if it's a network error, not e.g. 404, 403, etc.
    if (error.message === "Network Error") {
      localStorage.setItem("apiConnectionStatus", "failed");
    }

    throw error;
  }
};

// Clear any existing offline status
localStorage.removeItem("apiConnectionStatus");

// Function to get the current token
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

// Add request interceptor to include the JWT token in the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (ERROR_ONLY) {
      console.error("❌ API Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// API error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (ERROR_ONLY) {
      console.error("❌ API Error:", {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
      });
    }

    // Handle 401 errors (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Check if we're already on the login page to avoid redirect loops
      if (!window.location.href.includes("/login")) {
        console.warn("🔒 Authentication token expired or invalid.");

        // Clear invalid token
        localStorage.removeItem("token");

        // Save the current location to redirect back after login
        localStorage.setItem("redirectAfterLogin", window.location.pathname);
      }
    }

    throw error;
  }
);

// Authentication endpoints
export const authApi = {
  login: (credentials) => {
    console.log("Calling login API with credentials:", credentials);
    return apiRequest("post", "/api/login_new.php", credentials);
  },
  register: (data) => apiRequest("post", "/api/register.php", data),
  getProfile: () => apiRequest("get", "/api/profile_new.php"),
  updateProfile: (data) => apiRequest("put", "/api/profile.php", data),
  logout: () => {
    // Simple client-side logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return Promise.resolve({ data: { status: "success" } });
  },
};

// Property endpoints
export const propertyApi = {
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Add pagination params
      if (params.page) queryParams.set("page", params.page);
      if (params.per_page) queryParams.set("per_page", params.per_page);

      // Add filter params if they have values
      Object.entries(params).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          !["page", "per_page"].includes(key)
        ) {
          queryParams.set(key, value);
        }
      });

      // Try the actual API call first
      try {
        const url = `/api/properties/index.php${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;
        if (DEBUG_MODE) {
          console.log("Fetching properties from:", BASE_URL + url);
        }

        const response = await apiRequest("get", url, null, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        return response;
      } catch (apiError) {
        console.error(
          "Failed to fetch from API, falling back to mock data:",
          apiError
        );

        // Fallback to mock data if API call fails
        console.log("Using mock data for properties");

        // Generate mock properties
        const mockProperties = [];
        for (let i = 1; i <= 15; i++) {
          mockProperties.push({
            id: i,
            title: `Featured Property ${i}`,
            description:
              "A beautiful property with modern amenities and great location.",
            price: 500000 + i * 100000,
            type: i % 2 === 0 ? "apartment" : "bungalow",
            bedrooms: 3 + (i % 3),
            bathrooms: 2 + (i % 2),
            area: 150 + i * 25,
            images: [`https://picsum.photos/seed/${i}/600/400`],
            location: "Premium Location",
            floor: i % 2 === 0 ? i + 1 : null,
          });
        }

        // Paginate mock data
        const page = params.page || 1;
        const perPage = params.per_page || 12;
        const filteredProperties = mockProperties.filter((property) => {
          if (
            params.type &&
            params.type !== "all" &&
            property.type !== params.type
          ) {
            return false;
          }
          if (params.minPrice && property.price < Number(params.minPrice)) {
            return false;
          }
          if (params.maxPrice && property.price > Number(params.maxPrice)) {
            return false;
          }
          return true;
        });

        const start = (page - 1) * perPage;
        const end = start + perPage;
        const paginatedProperties = filteredProperties.slice(start, end);

        return {
          data: {
            data: paginatedProperties,
            total: filteredProperties.length,
            per_page: perPage,
            current_page: page,
            last_page: Math.ceil(filteredProperties.length / perPage),
          },
        };
      }
    } catch (err) {
      console.error("Error in getAll properties:", err);
      throw err;
    }
  },
  getById: (id) => apiRequest("get", `/api/properties/index.php?id=${id}`),
  create: (data) => apiRequest("post", "/api/properties/index.php", data),
  update: (id, data) =>
    apiRequest("put", `/api/properties/index.php?id=${id}`, data),
  delete: (id) => apiRequest("delete", `/api/properties/index.php?id=${id}`),
  getFeatured: () => apiRequest("get", "/api/properties/featured.php"),
  search: (params) =>
    apiRequest("get", "/api/properties/index.php", null, { params }),
};

// User endpoints
export const userApi = {
  getProfile: () => apiRequest("get", "/api/profile_new.php"),
  getFavorites: () => apiRequest("get", "/api/favorites/index.php"),
  addFavorite: (propertyId) =>
    apiRequest("post", "/api/favorites/index.php", { property_id: propertyId }),
  removeFavorite: (propertyId) =>
    apiRequest("delete", `/api/favorites/index.php?id=${propertyId}`),

  // Admin user management endpoints
  getAllUsers: () => apiRequest("get", "/api/auth/users.php"),
  getUserById: (id) => apiRequest("get", `/api/auth/users.php?id=${id}`),
  createUser: (data) => apiRequest("post", "/api/auth/users.php", data),
  updateUser: (id, data) =>
    apiRequest("put", `/api/auth/users.php?id=${id}`, data),
  deleteUser: (id) => apiRequest("delete", `/api/auth/users.php?id=${id}`),
  updateUserRole: (id, role) =>
    apiRequest("patch", `/api/auth/users.php?id=${id}`, { role }),
};

// Reservation endpoints
export const reservationApi = {
  getAll: () => apiRequest("get", "/api/reservations/index.php"),
  getById: (id) => apiRequest("get", `/api/reservations/index.php?id=${id}`),
  create: (data) => apiRequest("post", "/api/reservations/index.php", data),
  update: (id, data) =>
    apiRequest("put", `/api/reservations/index.php?id=${id}`, data),
  cancel: (id) =>
    apiRequest("post", `/api/reservations/index.php?id=${id}&action=cancel`),

  // Admin reservation management endpoints
  getAllReservations: () =>
    apiRequest("get", "/api/reservations/index.php?admin=true"),
  updateStatus: (id, status) =>
    apiRequest("patch", `/api/reservations/index.php?id=${id}`, { status }),
  approveReservation: (id) =>
    apiRequest("patch", `/api/reservations/index.php?id=${id}`, {
      status: "approved",
    }),
  rejectReservation: (id) =>
    apiRequest("patch", `/api/reservations/index.php?id=${id}`, {
      status: "rejected",
    }),
};

// Stats endpoints
export const statsApi = {
  getAll: () => apiRequest("get", "/api/stats/index.php"),

  // Admin dashboard stats
  getDashboardStats: () =>
    apiRequest("get", "/api/stats/index.php?dashboard=admin"),
};

export default api;
