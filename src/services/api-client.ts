import type { ApiResponse, RequestOptions } from 'src/types';

// API configuration
const API_BASE_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'http://localhost:3000';

// Helper functions
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// Main request function
async function makeRequest<T>(
  baseUrl: string,
  endpoint: string,
  options: RequestInit & RequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = `${baseUrl}${endpoint}`;
  const token = getAuthToken();

  // Build headers object safely
  const optionsHeaders = options.headers as Record<string, string> | undefined;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(optionsHeaders || {}),
  };

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP ${response.status}` };
      }

      return {
        success: false,
        message: errorData.message || 'Request failed',
      };
    }

    const data = await response.json();
    // Our API endpoints return { success, data, message } directly — pass through as-is
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// API client object
export const apiClient = {
  baseUrl: API_BASE_URL,

  get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return makeRequest<T>(this.baseUrl, endpoint, { method: 'GET', ...options });
  },

  post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return makeRequest<T>(this.baseUrl, endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return makeRequest<T>(this.baseUrl, endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return makeRequest<T>(this.baseUrl, endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return makeRequest<T>(this.baseUrl, endpoint, { method: 'DELETE', ...options });
  },
};
