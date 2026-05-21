import api from './api'

export interface RegisterPayload {
  fullName: string
  email: string
  phone: string
  password: string
}

export interface LoginPayload {
  emailOrPhone: string;
  password: string;
}

export interface ForgotPasswordPayload {
  emailOrPhone: string
}

export interface ResetPasswordPayload {
  verificationCode: string
  newPassword: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}

export const register = (data: RegisterPayload) => {
  return api.post<ApiResponse>('/auth/register', data)
}

export const login = (data: LoginPayload) => {
  return api.post<ApiResponse>('/auth/login', data)
}

export const forgotPassword = (data: ForgotPasswordPayload) => {
  return api.post<ApiResponse>('/auth/forgot-password', data)
}

export const resetPassword = (data: ResetPasswordPayload) => {
  return api.post<ApiResponse>('/auth/reset-password', data)
}