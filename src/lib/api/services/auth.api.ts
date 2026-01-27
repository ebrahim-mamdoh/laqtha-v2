// ============================================================================
// Authentication API Service
// ============================================================================

import { apiClient, apiGet, apiPost } from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  GetCurrentUserResponse,
} from '@/types/api';

export const authApi = {
  // Customer Authentication
  login: (data: LoginRequest) => 
    apiPost<LoginResponse>('/auth/login', data),

  register: (data: RegisterRequest) => 
    apiPost<RegisterResponse>('/auth/register', data),

  verifyOtp: (data: VerifyOtpRequest) => 
    apiPost<VerifyOtpResponse>('/auth/verify', data),

  resendVerification: (data: ResendVerificationRequest) => 
    apiPost<ResendVerificationResponse>('/auth/resend-verification', data),

  forgotPassword: (data: ForgotPasswordRequest) => 
    apiPost<ForgotPasswordResponse>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) => 
    apiPost<ResetPasswordResponse>('/auth/reset-password', data),

  getCurrentUser: () => 
    apiGet<GetCurrentUserResponse>('/auth/me'),

  // Google OAuth
  getGoogleAuthUrl: () => `${apiClient.defaults.baseURL}/auth/google`,
};

export default authApi;
