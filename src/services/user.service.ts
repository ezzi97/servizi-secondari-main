import type { User, ApiResponse, UserProfileUpdate } from 'src/types';

import { apiClient } from './api-client';

const ENDPOINTS = {
  PROFILE: '/api/users/profile',
  AVATAR: '/api/users/avatar',
};

export const userService = {
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get(ENDPOINTS.PROFILE);
  },

  async updateProfile(data: UserProfileUpdate): Promise<ApiResponse<User>> {
    return apiClient.put(ENDPOINTS.PROFILE, data);
  },

  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    // For file uploads, we need to use FormData
    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${window.location.origin}${ENDPOINTS.AVATAR}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Upload failed',
      };
    }

    return {
      success: true,
      data: result,
    };
  },
};

