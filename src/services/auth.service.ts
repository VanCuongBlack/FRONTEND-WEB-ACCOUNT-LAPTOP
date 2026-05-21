import api from './api'

// ============================================================
// auth.service.ts
// ============================================================

export interface RegisterPayload {
  fullName: string
  email: string
  phone: string
  password: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}

export const register = (data: RegisterPayload) => {
  return api.post<ApiResponse>('/auth/register', data)
}
