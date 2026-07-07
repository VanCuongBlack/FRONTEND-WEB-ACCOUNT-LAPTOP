import api from './api'
import type { UploadedImage } from './upload.service'

export type BannerPosition = 'home_top' | 'home_middle' | 'category_page' | 'popup'

export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode?: number
  message: string
  data?: T
  error?: string
}

export interface BannerRecord {
  _id: string
  title: string
  image: UploadedImage
  link_url?: string | null
  position: BannerPosition
  display_order: number
  is_active: boolean
  start_date?: string | null
  end_date?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface BannerPayload {
  title: string
  image: UploadedImage
  link_url?: string | null
  position?: BannerPosition
  display_order?: number
  is_active?: boolean
  start_date?: string | null
  end_date?: string | null
}

export const getActiveBanners = (position?: BannerPosition) =>
  api.get<ApiResponse<BannerRecord[]>>('/banner/active', { params: { position } })

export const getAllBanners = (params?: { position?: BannerPosition; is_active?: boolean }) =>
  api.get<ApiResponse<BannerRecord[]>>('/banner', { params })

export const createBanner = (data: BannerPayload) =>
  api.post<ApiResponse<BannerRecord>>('/banner', data)

export const updateBanner = (bannerId: string, data: Partial<BannerPayload>) =>
  api.put<ApiResponse<BannerRecord>>(`/banner/${bannerId}`, data)

export const deleteBanner = (bannerId: string) =>
  api.delete<ApiResponse>(`/banner/${bannerId}`)
