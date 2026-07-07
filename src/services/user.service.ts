import api from './api'
import type { ApiResponse, UserRole } from './auth.service'

export interface UserProfile {
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

export interface UpdateProfilePayload {
  fullname?: string
  phone?: string
  address?: string
  position?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export const getProfile = () => {
  return api.get<ApiResponse<UserProfile>>('/user/get-profile')
}

export const updateProfile = (data: UpdateProfilePayload) => {
  return api.put<ApiResponse<UserProfile>>('/user/update-profile', data)
}

export const changePassword = (data: ChangePasswordPayload) => {
  return api.put<ApiResponse<{ message: string }>>(
    '/user/change-password',
    data
  )
}