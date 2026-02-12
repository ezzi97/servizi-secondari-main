import type { Service, ApiResponse, ServiceStats, ServiceFilters, PaginatedResponse } from 'src/types';

import { apiClient } from './api-client';

const ENDPOINTS = {
  LIST: '/api/services',
  STATS: '/api/services/stats',
  DETAIL: (id: string) => `/api/services/${id}`,
};

export const serviceService = {
  async getServices(filters?: ServiceFilters): Promise<ApiResponse<PaginatedResponse<Service>>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `${ENDPOINTS.LIST}?${queryString}` : ENDPOINTS.LIST;
    
    return apiClient.get(endpoint);
  },

  async getService(id: string): Promise<ApiResponse<Service>> {
    return apiClient.get(ENDPOINTS.DETAIL(id));
  },

  async createService(data: Partial<Service>): Promise<ApiResponse<Service>> {
    return apiClient.post(ENDPOINTS.LIST, data);
  },

  async updateService(id: string, data: Partial<Service>): Promise<ApiResponse<Service>> {
    return apiClient.put(ENDPOINTS.DETAIL(id), data);
  },

  async getStats(filters?: ServiceFilters): Promise<ApiResponse<ServiceStats>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `${ENDPOINTS.STATS}?${queryString}` : ENDPOINTS.STATS;
    
    return apiClient.get(endpoint);
  },
};

