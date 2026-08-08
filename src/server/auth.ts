/**
 * Auth API Service
 * Handles all authentication-related API calls
 */

import { apiClient } from './client';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  GoogleAuthRequest,
} from './types';

export const authApi = {
  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post<LoginResponse>('/auth/login', data);
  },

  /**
   * Sign up with email and password
   */
  signUp: async (data: SignUpRequest): Promise<ApiResponse<SignUpResponse>> => {
    return apiClient.post<SignUpResponse>('/auth/signup', data);
  },

  /**
   * Authenticate with Google
   */
  googleAuth: async (data: GoogleAuthRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post<LoginResponse>('/auth/google', data);
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<void>('/auth/logout');
    apiClient.setAuthToken(null);
    return response;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post<LoginResponse>('/auth/refresh', { refreshToken });
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>('/auth/reset-password', {
      token,
      newPassword,
    });
  },
};
