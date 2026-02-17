import apiClient from '@/lib/api';

/**
 * Fetch partner items with filters
 * @param {Object} filters
 * @returns {Promise<Object>} API response
 */
export const fetchPartnerItems = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.state && filters.state !== 'all') {
        params.append('state', filters.state);
    }

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

/**
 * Archive a partner item
 * @param {string} itemId - The ID of the item to archive
 * @returns {Promise<Object>} API response
 */
export const archivePartnerItem = async (itemId) => {
    try {
        const response = await apiClient.delete(`/partner/items/${itemId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
