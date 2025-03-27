import axios from 'axios';
import { API_BASE_URL } from '../config';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
let cache = new Map();

const clearCache = () => {
    cache.clear();
};

const getCacheKey = (params) => {
    return JSON.stringify(params);
};

const propertiesService = {
    async getProperties(params = {}) {
        const cacheKey = getCacheKey(params);
        const cached = cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/properties`, {
                params,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            const result = response.data;
            cache.set(cacheKey, {
                timestamp: Date.now(),
                data: result
            });

            return result;
        } catch (error) {
            console.error('Error fetching properties:', error);
            throw error;
        }
    },

    clearCache
};

export default propertiesService;