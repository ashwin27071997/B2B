import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { supabase } from '@/lib/supabase';

// API Error type
export interface ApiError {
  message: string;
  code?: string;
  status: number;
  details?: Record<string, unknown>;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch {
      // Continue without token if auth fails
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; code?: string; details?: Record<string, unknown> }>) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      code: error.response?.data?.code || error.code,
      status: error.response?.status || 500,
      details: error.response?.data?.details,
    };

    // Handle 401 - token expired
    if (error.response?.status === 401) {
      // Try to refresh session
      const { error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        // Refresh failed, sign out
        await supabase.auth.signOut();
        window.location.href = '/login';
      } else if (error.config) {
        // Retry original request with new token
        return apiClient.request(error.config);
      }
    }

    return Promise.reject(apiError);
  }
);

// Typed request helpers
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

export async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

export async function patch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}

export { apiClient };
