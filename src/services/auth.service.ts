import api from './api'

export interface RegisterPayload {
  fullname: string
  email: string
  phone: string
  password: string
  address?: string
  position?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponseData {
  user?: unknown
  accessToken: string
  refreshToken: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface VerifyEmailPayload {
  email: string
  otp: string
}

export interface SendOtpPayload {
  email: string
}

export interface VerifyResetOtpPayload {
  email: string
  otp: string
}

export interface ResetPasswordPayload {
  email: string
  otp: string
  newPassword: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode?: number
  message: string
  data?: T
}

export const register = (data: RegisterPayload) => {
  return api.post<ApiResponse<AuthResponseData>>('/auth/register', data)
}

export const login = (data: LoginPayload) => {
  return api.post<ApiResponse<AuthResponseData>>('/auth/login', data)
}

export const forgotPassword = (data: ForgotPasswordPayload) => {
  return api.post<ApiResponse>('/auth/forgot-password', data)
}

export const verifyEmail = (data: VerifyEmailPayload) => {
  return api.post<ApiResponse>('/auth/verify-email', data)
}

export const sendOtp = (data: SendOtpPayload) => {
  return api.post<ApiResponse>('/auth/send-otp', data)
}

export const verifyResetOtp = (data: VerifyResetOtpPayload) => {
  return api.post<ApiResponse>('/auth/verify-reset-otp', data)
}

export const resetPassword = (data: ResetPasswordPayload) => {
  return api.post<ApiResponse>('/auth/reset-password', data)
}