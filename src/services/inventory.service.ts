import api from './api'

export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode?: number
  message: string
  data?: T
  error?: string
}

export interface StockSummaryItem {
  product_id?: string
  _id?: string
  name?: string
  product_name?: string
  category?: string
  brand?: string
  product_type?: 'physical' | 'digital'
  available?: number
  reserved?: number
  sold?: number
  total?: number
  min_sale_price?: number
  max_sale_price?: number
}

export interface StockSummaryResponse {
  items?: StockSummaryItem[]
  data?: StockSummaryItem[]
  total?: number
  page?: number
  limit?: number
  totalPages?: number
  physical?: StockSummaryResponse
  digital?: StockSummaryResponse
}

export interface LowStockResponse {
  threshold: number
  total_alerts: number
  physical_alerts?: StockSummaryItem[]
  digital_alerts?: StockSummaryItem[]
}

export interface InventoryLog {
  _id: string
  product_id?: string
  product_type?: 'physical' | 'digital'
  action?: string
  status_before?: string | null
  status_after?: string | null
  note?: string
  createdAt?: string
}

export interface InventoryLogsResponse {
  logs?: InventoryLog[]
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

export interface StockInPhysicalPayload {
  serial_number: string
  images_urls?: string[]
  sale_price: number
  status?: 'available' | 'reserved' | 'sold'
  note?: string
}

export interface StockInDigitalPayload {
  account_email: string
  account_password: string
  expired_at?: string | null
  sale_price: number
  status?: 'available' | 'sold' | 'expired'
  note?: string
}

export const getStockSummary = (params?: {
  product_type?: 'physical' | 'digital'
  search?: string
  page?: number
  limit?: number
}) => api.get<ApiResponse<StockSummaryResponse>>('/inventory/stock', { params })

export const getLowStockAlerts = (params?: {
  threshold?: number
  product_type?: 'physical' | 'digital'
}) => api.get<ApiResponse<LowStockResponse>>('/inventory/low-stock', { params })

export const getInventoryLogs = (params?: {
  product_id?: string
  action?: string
  product_type?: 'physical' | 'digital'
  from?: string
  to?: string
  created_by?: string
  page?: number
  limit?: number
}) => api.get<ApiResponse<InventoryLogsResponse>>('/inventory/logs', { params })

export const stockInPhysical = (productId: string, data: StockInPhysicalPayload) =>
  api.post<ApiResponse>(`/inventory/stock-in/physical/${productId}`, data)

export const stockInDigital = (productId: string, data: StockInDigitalPayload) =>
  api.post<ApiResponse>(`/inventory/stock-in/digital/${productId}`, data)
