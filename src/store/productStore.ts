import { create } from 'zustand'
import * as productService from '@/services/product.service'
import type { ProductDetail } from '@/services/product.service'

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
  product_type: 'physical' | 'digital'
  is_active: boolean
  createdAt: string
  updatedAt: string
}

interface ProductStore {
  products: Product[]
  currentProduct: ProductDetail | null
  laptops: Product[]
  accounts: Product[]
  isLoading: boolean
  error: string | null
  total: number
  page: number
  limit: number

  // Actions
  setProducts: (products: Product[]) => void
  setCurrentProduct: (product: ProductDetail | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchProducts: (params?: any) => Promise<void>
  fetchProductById: (productId: string) => Promise<void>
  fetchPhysicalProducts: (params?: any) => Promise<void>
  fetchDigitalProducts: (params?: any) => Promise<void>
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  currentProduct: null,
  laptops: [],
  accounts: [],
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 12,

  setProducts: (products) => set({ products }),
  setCurrentProduct: (product) => set({ currentProduct: product }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchProducts: async (params?: any) => {
    set({ isLoading: true, error: null })
    try {
      const res = await productService.getProducts(params)
      if (res.data?.success && res.data?.data) {
        set({
          products: res.data.data.products || [],
          total: res.data.data.total || 0,
          page: res.data.data.page || 1,
          limit: res.data.data.limit || 12,
        })
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch products' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchProductById: async (productId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await productService.getProductById(productId)
      if (res.data?.success && res.data?.data) {
        set({ currentProduct: productService.normalizeProductDetail(res.data.data) })
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch product' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchPhysicalProducts: async (params?: any) => {
    set({ isLoading: true, error: null })
    try {
      const res = await productService.getPhysicalProducts(params)
      if (res.data?.success && res.data?.data) {
        set({
          laptops: res.data.data.products || [],
          total: res.data.data.total || 0,
          page: res.data.data.page || 1,
          limit: res.data.data.limit || 12,
        })
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch physical products' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchDigitalProducts: async (params?: any) => {
    set({ isLoading: true, error: null })
    try {
      const res = await productService.getDigitalProducts(params)
      if (res.data?.success && res.data?.data) {
        set({
          accounts: res.data.data.products || [],
          total: res.data.data.total || 0,
          page: res.data.data.page || 1,
          limit: res.data.data.limit || 12,
        })
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch digital products' })
    } finally {
      set({ isLoading: false })
    }
  },
}))
