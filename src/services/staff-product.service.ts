import api from './api'
import type { ProductQuery, ProductsResponse } from './product.service'
import type { UploadedImage } from './upload.service'

export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode?: number
  message: string
  data?: T
  error?: string
}

export interface ProductData {
  name: string
  description?: string
  base_price: number
  is_active?: boolean
}

export interface PhysicalData {
  brand: string
  model: string
  weight_kg: number
  cpu: string
  gpu: string
  ram: string
  storage: string
  display_inches: number
  os: string
  condition_percent: number
  warranty_months: number
  important_price: number
}

export interface DigitalData {
  platform: string
  category: string
  region: string
  duration_months: number
}

export interface PhysicalItemData {
  serial_number: string
  images_urls?: Array<UploadedImage>
  status?: 'available' | 'reserved' | 'sold' | 'returned'
  sale_price: number
}

export interface DigitalItemData {
  account_email: string
  account_password: string
  expired_at?: string
  status?: 'available' | 'reserved' | 'sold'
  sale_price: number
}

export interface UpdateDigitalItemData {
  account_email?: string
  account_password?: string
  expired_at?: string | null
  status?: 'available' | 'sold' | 'expired'
  sale_price?: number
}

export interface CreatePhysicalProductPayload {
  productData: ProductData
  physicalData: PhysicalData
  itemData: PhysicalItemData
}

export interface CreateDigitalProductPayload {
  productData: ProductData
  digitalData: DigitalData
  itemData: DigitalItemData
}

export interface UpdatePhysicalProductPayload {
  productData?: Partial<ProductData>
  physicalData?: Partial<PhysicalData>
}

export interface UpdateDigitalProductPayload {
  productData?: Partial<ProductData>
  digitalData?: Partial<DigitalData>
}

export const createPhysicalProduct = (data: CreatePhysicalProductPayload) => {
  return api.post<ApiResponse>('/product/create-physical', data)
}

export const createDigitalProduct = (data: CreateDigitalProductPayload) => {
  return api.post<ApiResponse>('/product/create-digital', data)
}

export const updatePhysicalProduct = (
  productId: string,
  data: UpdatePhysicalProductPayload
) => {
  return api.put<ApiResponse>(`/product/physical/${productId}`, data)
}

export const updateDigitalProduct = (
  productId: string,
  data: UpdateDigitalProductPayload
) => {
  return api.put<ApiResponse>(`/product/digital/${productId}`, data)
}

export const updatePhysicalProductItem = (
  itemId: string,
  data: Partial<PhysicalItemData>
) => {
  return api.put<ApiResponse>(`/product/physical/item/${itemId}`, data)
}

export const updateDigitalProductItem = (
  itemId: string,
  data: UpdateDigitalItemData
) => {
  return api.put<ApiResponse>(`/product/digital/item/${itemId}`, data)
}

export const deactivateProduct = (productId: string) => {
  return api.patch<ApiResponse>(`/product/${productId}/deactivate`)
}

export const deleteProduct = (productId: string) => {
  return api.delete<ApiResponse>(`/product/${productId}`)
}

export const getAllProducts = (params?: ProductQuery) => {
  return api.get<ApiResponse<ProductsResponse>>('/product', { params })
}
