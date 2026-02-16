import apiClient from '@/lib/api';

/**
 * Fetch partner items with filters
 * @param {Object} filters
 * @param {string} [filters.state] - Filter by item state
 * @param {boolean} [filters.includeArchived] - Include archived items
 * @param {number} [filters.page] - Page number
 * @param {number} [filters.limit] - Items per page
 * @param {string} [filters.sortBy] - Field to sort by
 * @param {string} [filters.sortOrder] - 'asc' or 'desc'
 * @returns {Promise<Object>} API response
 */
export const fetchPartnerItems = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.state && filters.state !== 'all') {
        params.append('state', filters.state);
    }

    // Explicitly handle boolean as string if needed, but URLSearchParams handles toString, 
    // however backend might expect specific format. Usually 'true'/'false' is fine.
    if (filters.includeArchived !== undefined) {
        params.append('includeArchived', filters.includeArchived);
    }

    if (filters.page) {
        params.append('page', filters.page);
    }

    if (filters.limit) {
        params.append('limit', filters.limit);
    }

    if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
    }

    if (filters.sortOrder) {
        params.append('sortOrder', filters.sortOrder);
    }

    try {
        const response = await apiClient.get('/partner/items', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};
