import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../services/api';

// Debug mode
const DEBUG_MODE = true;

// Mock featured properties for development
const MOCK_FEATURED_PROPERTIES = [
    {
        id: 1,
        title: 'Luxury Apartment in Downtown',
        description: 'Beautiful luxury apartment with amazing city views',
        price: 500000,
        type: 'apartment',
        property_type: 'apartment',
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        images: ['https://placehold.co/800x600/png'],
        location: 'New York, NY',
        status: 'For Sale'
    },
    {
        id: 2,
        title: 'Modern Bungalow with Pool',
        description: 'Spacious bungalow with private pool and garden',
        price: 750000,
        type: 'bungalow',
        property_type: 'bungalow',
        bedrooms: 4,
        bathrooms: 3,
        area: 200,
        images: ['https://placehold.co/800x600/png'],
        location: 'Los Angeles, CA',
        status: 'For Sale'
    },
    {
        id: 3,
        title: 'Cozy Studio Apartment',
        description: 'Perfect starter home in a great location',
        price: 200000,
        type: 'apartment',
        property_type: 'apartment',
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        images: ['https://placehold.co/800x600/png'],
        location: 'Chicago, IL',
        status: 'For Sale'
    }
];

/**
 * Custom hook to fetch featured properties
 */
export function useFeaturedProperties(limit = 6) {
    return useQuery({
        queryKey: ['featuredProperties'],
        queryFn: async () => {
            if (DEBUG_MODE) {
                console.log('🔍 Fetching featured properties...');
            }
            
            try {
                // Try to get featured properties from API
                const response = await propertyApi.getFeatured();
                
                if (DEBUG_MODE) {
                    console.log('✅ Fetched featured properties:', response.data);
                }
                
                // Transform the data if needed
                const properties = response.data.data || [];
                
                // Normalize property data
                return properties.map(property => ({
                    ...property,
                    id: property.id,
                    type: property.property_type || property.type,
                    // Ensure required properties exist
                    price: property.price || 0,
                    bedrooms: property.bedrooms || 0,
                    bathrooms: property.bathrooms || 0,
                    area: property.area || 0,
                    images: property.images || ['https://placehold.co/800x600/png'],
                })).slice(0, limit);
                
            } catch (error) {
                console.error('Error fetching featured properties:', error);
                
                if (DEBUG_MODE) {
                    console.log('🛠️ Using mock featured properties data');
                    return MOCK_FEATURED_PROPERTIES.slice(0, limit);
                }
                
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        // In debug mode, don't re-fetch on window focus
        refetchOnWindowFocus: !DEBUG_MODE
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
                
                return {
                    properties: response.data.data.data || [],
                    total: response.data.data.total || 0,
                    currentPage: response.data.data.current_page || 1,
                    lastPage: response.data.data.last_page || 1
                };
                
            } catch (error) {
                console.error('Error fetching properties:', error);
                
                if (DEBUG_MODE) {
                    console.log('🛠️ Using mock properties data');
                    // Return mock paginated data
                    return {
                        properties: MOCK_FEATURED_PROPERTIES,
                        total: MOCK_FEATURED_PROPERTIES.length,
                        currentPage: 1,
                        lastPage: 1
                    };
                }
                
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        keepPreviousData: true,
        refetchOnWindowFocus: !DEBUG_MODE
    });
}
