import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import { queryKeys } from '../services/queryClient';
import api from '../services/api';

export function useProperties(page = 1, perPage = 12) {
  return useQuery({
    queryKey: ['properties', page, perPage],
    queryFn: async () => {
      try {
        const response = await propertyService.getAll(page, perPage);
        const { data, current_page, last_page, total } = response.data || {};
        
        return {
          properties: data || [],
          total: total || 0,
          currentPage: current_page || 1,
          lastPage: last_page || 1
        };
      } catch (error) {
        // Transform the error to be more user-friendly
        const message = error.response?.data?.message 
          || error.message 
          || 'Failed to fetch properties';
        throw new Error(message);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes,
    retry: 1
  });
}

export function useProperty(id) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data } = await api.get(`/properties/${id}`);
      return data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useFeaturedProperties(limit = 9) {
  return useQuery({
    queryKey: ['properties', 'featured', limit],
    queryFn: async () => {
      try {
        const response = await propertyService.getFeatured(limit);
        console.log('Featured properties response:', response); // Debug log
        if (!response.data || response.data.length === 0) {
          console.warn('No featured properties found, using mock data');
        }
        return response.data;
      } catch (error) {
        console.error('Error in useFeaturedProperties:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    retry: 1, // Only retry once
  });
}

export function useSearchProperties(query, filters) {
  return useQuery({
    queryKey: [...queryKeys.properties.search(filters), query],
    queryFn: () => propertyService.search(query, filters),
    enabled: !!query,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => propertyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.properties.all);
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => propertyService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(queryKeys.properties.detail(variables.id));
      queryClient.invalidateQueries(queryKeys.properties.all);
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => propertyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.properties.all);
    },
  });
}