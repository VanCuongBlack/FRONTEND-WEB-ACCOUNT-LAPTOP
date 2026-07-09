import api from './api'

export interface RegisterPayload {
  fullname: string
  email: string
  phone: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
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

export interface RefreshTokenPayload {
  refreshToken: string
}

export type UserRole = 'customer' | 'staff' | 'admin' | string | { _id?: string; name?: string }

export interface UserData {
  _id: string
  fullname: string
  email: string
  phone: string
  address?: string
  position?: string
  avatar?: string
  isActive: boolean
  isVerified: boolean
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface AuthResponseData {
  user: UserData
  accessToken: string
  refreshToken: string
}

export interface RegisterResponseData {
  user: UserData
}

export interface TokenResponseData {
  accessToken: string
  refreshToken: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode?: number
  message: string
  data?: T
  error?: string
  errors?: unknown
}

export const register = (data: RegisterPayload) => {
  return api.post<ApiResponse<RegisterResponseData>>('/auth/register', data)
}

export const login = (data: LoginPayload) => {
  return api.post<ApiResponse<AuthResponseData>>('/auth/login', data)
}

export const googleLogin = (idToken: string) => {
  return api.post<ApiResponse<AuthResponseData>>('/auth/google', { idToken })
}

export const refreshToken = (data: RefreshTokenPayload) => {
  return api.post<ApiResponse<TokenResponseData>>('/auth/refresh-token', data)
}

export const verifyEmail = (data: VerifyEmailPayload) => {
  return api.post<ApiResponse<{ message: string }>>('/auth/verify-email', data)
}

export const sendOtp = (data: SendOtpPayload) => {
  return api.post<ApiResponse<{ message: string }>>('/auth/send-otp', data)
}

export const forgotPassword = (data: ForgotPasswordPayload) => {
  return api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', data)
}

export const verifyResetOtp = (data: VerifyResetOtpPayload) => {
  return api.post<ApiResponse<{ message: string }>>('/auth/verify-reset-otp', data)
}

export const resetPassword = (data: ResetPasswordPayload) => {
  return api.post<ApiResponse<{ message: string }>>('/auth/reset-password', data)
}
