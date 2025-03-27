import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../services/api';

// Debug mode should be false in production
const DEBUG_MODE = false;

// Mock featured properties for development - enhanced with better data
const MOCK_FEATURED_PROPERTIES = [
    {
        id: 1,
        title: 'Luxury Apartment in Downtown',
        description: 'Beautiful luxury apartment with amazing city views. This premium property features high ceilings, modern appliances, and 24/7 security. Perfect for professionals seeking a convenient urban lifestyle.',
        price: 500000,
        type: 'apartment',
        property_type: 'apartment',
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        ],
        location: 'New York, NY',
        status: 'For Sale',
        features: ['Air Conditioning', 'Gym', 'Swimming Pool', 'Parking', 'Security']
    },
    {
        id: 2,
        title: 'Modern Bungalow with Pool',
        description: 'Spacious bungalow with private pool and garden. This single-story home offers open-concept living with plenty of natural light and a beautiful backyard perfect for entertaining.',
        price: 750000,
        type: 'bungalow',
        property_type: 'bungalow',
        bedrooms: 4,
        bathrooms: 3,
        area: 200,
        images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        ],
        location: 'Los Angeles, CA',
        status: 'For Sale',
        features: ['Swimming Pool', 'Garden', 'Smart Home', 'Garage', 'BBQ Area']
    },
    {
        id: 3,
        title: 'Cozy Studio Apartment',
        description: 'Perfect starter home in a great location. This well-designed studio makes efficient use of space with modern fixtures and plenty of storage solutions.',
        price: 200000,
        type: 'apartment',
        property_type: 'apartment',
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        images: [
            'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1157&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        ],
        location: 'Chicago, IL',
        status: 'For Sale',
        features: ['Air Conditioning', 'Laundry', 'Elevator', 'Pet Friendly']
    },
    {
        id: 4,
        title: 'Oceanfront Luxury Villa',
        description: 'Stunning oceanfront villa with panoramic sea views. Enjoy luxury living with direct beach access, infinity pool, and high-end finishes throughout.',
        price: 2500000,
        type: 'bungalow',
        property_type: 'bungalow',
        bedrooms: 5,
        bathrooms: 6,
        area: 350,
        images: [
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        ],
        location: 'Miami, FL',
        status: 'For Sale',
        features: ['Beachfront', 'Infinity Pool', 'Wine Cellar', 'Home Theatre', 'Spa']
    },
    {
        id: 5,
        title: 'Modern Downtown Loft',
        description: 'Trendy loft in the heart of the arts district. Features exposed brick walls, high ceilings, and industrial touches with modern amenities.',
        price: 450000,
        type: 'apartment',
        property_type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 120,
        images: [
            'https://images.unsplash.com/photo-1560448075-32314de132c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            'https://images.unsplash.com/photo-1565182999561-f8a8a7ccd179?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        ],
        location: 'Portland, OR',
        status: 'For Sale',
        features: ['Rooftop Deck', 'Fitness Center', 'Bike Storage', 'Pet Friendly']
    },
    {
        id: 6,
        title: 'Mountain View Chalet',
        description: 'Beautiful wooden chalet with breathtaking mountain views. Perfect for winter sports enthusiasts or summer hiking getaways.',
        price: 850000,
        type: 'bungalow',
        property_type: 'bungalow',
        bedrooms: 3,
        bathrooms: 2,
        area: 180,
        images: [
            'https://images.unsplash.com/photo-1551524559-8af4e6624178?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1625&q=80',
            'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        ],
        location: 'Aspen, CO',
        status: 'For Sale',
        features: ['Fireplace', 'Hot Tub', 'Mountain Views', 'Ski Storage']
    }
];

// Enhanced mock properties with amenities
MOCK_FEATURED_PROPERTIES.forEach(property => {
    // Ensure properties have consistent structure
    property.amenities = ['WiFi', 'Parking', ...(property.features || [])];
    property.available = true;
    property.floor = property.type === 'apartment' ? Math.floor(Math.random() * 10) + 1 : 1;
    property.totalFloors = property.type === 'apartment' ? Math.floor(Math.random() * 20) + 10 : 1;
    property.name = property.title; // Ensure name exists for backwards compatibility
    property.location = property.location || 'Popular Location'; // Add location if missing
});

/**
 * Get featured properties
 * @param {number} [limit=6] - Number of properties to return
 * @returns {Promise<import('../types/api').ApiResponse>}
 */
export function useFeaturedProperties(limit = 6) {
  return useQuery({
    queryKey: ['featured-properties', limit],
    queryFn: async () => {
      try {
        // Don't use mock data in production
        if (!DEBUG_MODE) {
          const response = await propertyApi.getFeatured(limit);
          return response.data;
        } else {
          console.log('Using mock featured properties');
          return MOCK_FEATURED_PROPERTIES.slice(0, limit);
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        return MOCK_FEATURED_PROPERTIES.slice(0, limit);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Custom hook to fetch properties with pagination and filters
 */
export function useProperties(page = 1, perPage = 10, filters = {}) {
    return useQuery({
        queryKey: ['properties', page, perPage, filters],
        queryFn: async () => {
            if (DEBUG_MODE) {
                console.log('🔍 Fetching properties:', { page, perPage, filters });
            }
            
            try {
                const params = {
                    page,
                    per_page: perPage,
                    ...filters
                };
                
                const response = await propertyApi.getAll(params);
                
                if (DEBUG_MODE) {
                    console.log('✅ Fetched properties:', response.data);
                }
                
                const properties = response.data.data.data || [];
                
                // Only fall back to mock data in development
                if (properties.length === 0 && process.env.NODE_ENV === 'development') {
                    console.warn('No properties returned from API');
                    return {
                        properties: [],
                        total: 0,
                        currentPage: page,
                        lastPage: 1
                    };
                }
                
                return {
                    properties: properties,
                    total: response.data.data.total || 0,
                    currentPage: response.data.data.current_page || 1,
                    lastPage: response.data.data.last_page || 1
                };
                
            } catch (error) {
                console.error('Error fetching properties:', error);
                throw error; // Let the error boundary handle it
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        keepPreviousData: true,
        refetchOnWindowFocus: process.env.NODE_ENV === 'production'
    });
}
