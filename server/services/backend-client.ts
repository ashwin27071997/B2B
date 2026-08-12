import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { config } from '../config';

/**
 * Backend API Client
 * This is the abstraction layer that communicates with the actual backend service.
 * All requests from the client go through the server, which then forwards them here.
 */

// Create axios instance for backend communication
const backendClient: AxiosInstance = axios.create({
  baseURL: config.backend.baseUrl,
  timeout: config.backend.timeout,
  headers: {
    'Content-Type': 'application/json',
    ...(config.backend.apiKey && { 'X-API-Key': config.backend.apiKey }),
  },
});

// Request interceptor - add logging, transform requests
backendClient.interceptors.request.use(
  (requestConfig) => {
    console.log(`[Backend Request] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
    return requestConfig;
  },
  (error) => {
    console.error('[Backend Request Error]', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors, transform responses
backendClient.interceptors.response.use(
  (response) => {
    console.log(`[Backend Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    console.error(`[Backend Error] ${status}: ${message}`);
    return Promise.reject(error);
  }
);

// Typed request helpers
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await backendClient.get<T>(url, config);
  return response.data;
}

export async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await backendClient.post<T>(url, data, config);
  return response.data;
}

export async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await backendClient.put<T>(url, data, config);
  return response.data;
}

export async function patch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await backendClient.patch<T>(url, data, config);
  return response.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await backendClient.delete<T>(url, config);
  return response.data;
}

// Forward request with user context
export async function forwardRequest<T>(
  method: string,
  url: string,
  data?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  const response = await backendClient.request<T>({
    method,
    url,
    data,
    headers: {
      ...backendClient.defaults.headers.common,
      ...headers,
    },
  });
  return response.data;
}

export { backendClient };
