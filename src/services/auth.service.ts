import api from './api'

// ─── Request Payloads ───────────────────────────────────────────────────────

export interface RegisterPayload {
  fullname: string  // backend expects 'fullname' (lowercase n)
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

export interface VerifyEmailPayload {
  email: string
  otp: string
}

export interface SendOtpPayload {
  email: string
}

export interface ForgotPasswordPayload {
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

// ─── Response Types ──────────────────────────────────────────────────────────

export interface UserData {
  _id: string
  fullname: string
  email: string
  phone: string
  address?: string
  position?: string
  isActive: boolean
  isVerified: boolean
  role: string
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode: number
  message: string
  data?: T
  error?: string
  errors?: unknown
}

// ─── API Calls ───────────────────────────────────────────────────────────────

/** POST /api/v1/auth/register */
export const register = (data: RegisterPayload) =>
  api.post<ApiResponse<{ user: UserData } & AuthTokens>>('/auth/register', data)

/** POST /api/v1/auth/login */
export const login = (data: LoginPayload) =>
  api.post<ApiResponse<{ user: UserData } & AuthTokens>>('/auth/login', data)

/** POST /api/v1/auth/refresh-token */
export const refreshToken = (data: RefreshTokenPayload) =>
  api.post<ApiResponse<AuthTokens>>('/auth/refresh-token', data)

/** POST /api/v1/auth/verify-email */
export const verifyEmail = (data: VerifyEmailPayload) =>
  api.post<ApiResponse<{ message: string }>>('/auth/verify-email', data)

/** POST /api/v1/auth/send-otp */
export const sendOtp = (data: SendOtpPayload) =>
  api.post<ApiResponse<{ message: string }>>('/auth/send-otp', data)

/** POST /api/v1/auth/forgot-password */
export const forgotPassword = (data: ForgotPasswordPayload) =>
  api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', data)

/** POST /api/v1/auth/verify-reset-otp */
export const verifyResetOtp = (data: VerifyResetOtpPayload) =>
  api.post<ApiResponse<{ message: string }>>('/auth/verify-reset-otp', data)

/** POST /api/v1/auth/reset-password */
export const resetPassword = (data: ResetPasswordPayload) =>
  api.post<ApiResponse<{ message: string }>>('/auth/reset-password', data)