import api from './api'
import type { UploadedImage } from './upload.service'

export interface Product {
  _id: string
  name: string
  description: string
  sku?: string
  brand?: string
  thumbnail?: string
  images?: string[]
  base_price: number
  sale_price?: number
  stock_quantity?: number
  total_sold?: number
  product_type: 'physical' | 'digital'
  is_active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductItem {
  _id: string
  status?: 'available' | 'reserved' | 'sold' | 'expired'
  sale_price?: number
  images_urls?: Array<string | UploadedImage>
  serial_number?: string
  account_email?: string
  expired_at?: string | null
}

export interface PhysicalProductData {
  _id: string
  brand?: string
  model?: string
  weight_kg?: number
  cpu?: string
  gpu?: string
  ram?: string
  storage?: string
  display_inches?: number
  os?: string
  condition_percent?: number
  warranty_months?: number
  important_price?: number
}

export interface DigitalProductData {
  _id: string
  platform?: string
  category?: string
  region?: string
  duration_months?: number
}

export interface ProductDetailResponse {
  product: Product
  physical?: PhysicalProductData
  digital?: DigitalProductData
  items?: ProductItem[]
}

export type ProductDetail = Product & {
  physical?: PhysicalProductData
  digital?: DigitalProductData
  items: ProductItem[]
  availableItem?: ProductItem
  brand?: string
  model?: string
  weight_kg?: number
  cpu?: string
  gpu?: string
  ram?: string
  storage?: string
  display_inches?: number
  os?: string
  condition_percent?: number
  warranty_months?: number
  important_price?: number
  platform?: string
  category?: string
  region?: string
  duration_months?: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode?: number
  message: string
  data?: T
  error?: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
}

export interface ProductQuery {
  product_type?: 'physical' | 'digital'
  is_active?: boolean
  search?: string
  page?: number
  limit?: number
}

export const getProducts = (
  params?: ProductQuery
) => {
  return api.get<ApiResponse<ProductsResponse>>(
    '/product',
    { params }
  )
}

export const getProductById = (
  productId: string
) => {
  return api.get<ApiResponse<ProductDetailResponse>>(
    `/product/${productId}`
  )
}

export const getPhysicalProducts = (
  params?: Omit<ProductQuery, 'product_type'>
) => {
  return api.get<ApiResponse<ProductsResponse>>(
    '/product',
    {
      params: {
        ...params,
        product_type: 'physical',
      },
    }
  )
}

export const getDigitalProducts = (
  params?: Omit<ProductQuery, 'product_type'>
) => {
  return api.get<ApiResponse<ProductsResponse>>(
    '/product',
    {
      params: {
        ...params,
        product_type: 'digital',
      },
    }
  )
}

export const getDisplayPrice = (
  product: Product | ProductDetail
) => {
  return (
    ('availableItem' in product ? product.availableItem?.sale_price : undefined) ??
    ('items' in product ? product.items?.find((item) => item.status === 'available')?.sale_price : undefined) ??
    product.sale_price ??
    product.base_price
  )
}

export const formatPrice = (
  price: number
) => {
  return (
    price.toLocaleString('vi-VN') + 'đ'
  )
}

export const getProductImage = (
  product: Product | ProductDetail
) => {
  const imageUrl = (image?: string | UploadedImage) =>
    typeof image === 'string' ? image : image?.url

  return (
    product.thumbnail ||
    imageUrl(product.images?.[0]) ||
    ('availableItem' in product ? imageUrl(product.availableItem?.images_urls?.[0]) : undefined) ||
    ('items' in product ? imageUrl(product.items?.find((item) => item.status === 'available' && item.images_urls?.[0])?.images_urls?.[0]) : undefined) ||
    ('items' in product ? imageUrl(product.items?.find((item) => item.images_urls?.[0])?.images_urls?.[0]) : undefined) ||
    '/placeholder.png'
  )
}

export function getAvailableItem(items: ProductItem[] = []) {
  return items.find((item) => item.status === 'available')
}

export function normalizeProductDetail(
  detail?: ProductDetailResponse
): ProductDetail | null {
  if (!detail?.product) return null

  const items = detail.items ?? []
  const availableItem = getAvailableItem(items)
  const availableImages = (availableItem?.images_urls ?? [])
    .map((image) => (typeof image === 'string' ? image : image.url))
    .filter(Boolean)

  return {
    ...detail.product,
    ...(detail.physical ?? {}),
    ...(detail.digital ?? {}),
    _id: detail.product._id,
    physical: detail.physical,
    digital: detail.digital,
    items,
    availableItem,
    sale_price: availableItem?.sale_price ?? detail.product.sale_price,
    thumbnail: availableImages[0] ?? detail.product.thumbnail,
    images: availableImages.length ? availableImages : detail.product.images,
  }
}
