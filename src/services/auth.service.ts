import type { ApiResponse, RegisterData, AuthResponse, LoginCredentials } from 'src/types';

import { apiClient } from './api-client';

const ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  VERIFY: '/api/auth/verify',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(ENDPOINTS.LOGIN, credentials);
    
    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(ENDPOINTS.REGISTER, data);
    
    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>(ENDPOINTS.LOGOUT);
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    return response;
  },

  async verifyToken(): Promise<ApiResponse<{ user: AuthResponse['user'] }>> {
    return apiClient.get(ENDPOINTS.VERIFY);
  },

  async getGoogleOAuthUrl(): Promise<ApiResponse<{ url: string }>> {
    return apiClient.get('/api/auth/google');
  },

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    return apiClient.post(ENDPOINTS.RESET_PASSWORD, { token, password });
  },

  // Utility methods
  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  getStoredUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  },
};

