import api from './api'
import type { Payment } from './payment.service'

export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode?: number
  message: string
  data?: T
  error?: string
}

export type PaymentMethod = 'cod' | 'bank_transfer'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'partially_refunded'
  | 'refunded'

export interface OrderItemProduct {
  _id?: string
  name?: string
  description?: string
  base_price?: number
}

export interface OrderUser {
  _id?: string
  fullname?: string
  email?: string
  phone?: string
}

export interface OrderItem {
  _id?: string
  item_id?: string
  product_id?: string
  product_type?: 'physical' | 'digital'
  quantity?: number
  product_name?: string
  price?: number
  sale_price?: number
  item_type_ref?: 'PhysicalProductItem' | 'DigitalProductItem'
  total?: number
  product?: OrderItemProduct
  is_refunded?: boolean
  refunded_at?: string
  refund_amount?: number
}

export interface Order {
  _id: string
  user_id?: string | OrderUser
  items: OrderItem[]
  total_amount: number
  status: OrderStatus
  shipping_address?: string
  payment_method?: PaymentMethod
  note?: string
  createdAt?: string
  updatedAt?: string
}

export interface OrdersResponse {
  orders: Order[]
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

export interface CreateOrderPayload {
  payment_method: PaymentMethod
  shipping_address?: string
  note?: string
}

export interface CreateOrderResponse {
  order: Order
  payment?: Payment
}

export interface GetOrdersParams {
  status?: OrderStatus
  page?: number
  limit?: number
}

// Lấy đơn hàng của user đang đăng nhập.
export const getOrders = (params?: GetOrdersParams) => {
  return api.get<ApiResponse<OrdersResponse | Order[]>>(
    '/order/my-orders',
    {
      params,
    }
  )
}

// Lấy chi tiết đơn hàng.
export const getOrderById = (orderId: string) => {
  return api.get<ApiResponse<Order>>(`/order/${orderId}`)
}

// Tạo đơn hàng từ cart. BE tự lấy cart hiện tại, FE không gửi items.
export const createOrder = (data: CreateOrderPayload) => {
  return api.post<ApiResponse<CreateOrderResponse>>('/order/create', data)
}

// Hủy đơn hàng.
export const cancelOrder = (orderId: string, reason?: string) => {
  return api.put<ApiResponse<Order>>(
    `/order/${orderId}/cancel`,
    {
      cancel_reason: reason,
    }
  )
}

export function extractOrders(data: OrdersResponse | Order[] | undefined) {
  if (!data) return []
  if (Array.isArray(data)) return data
  return data.orders ?? []
}

export function extractCreatedOrder(data: CreateOrderResponse | undefined) {
  return data?.order ?? null
}

export interface StaffOrderStatistic {
  _id: OrderStatus
  total: number
}

export const getStaffOrders = (params?: GetOrdersParams) => {
  return api.get<ApiResponse<OrdersResponse>>('/staff/orders', { params })
}

export const getStaffOrderById = (orderId: string) => {
  return api.get<ApiResponse<Order>>(`/staff/orders/${orderId}`)
}

export const updateStaffOrderStatus = (orderId: string, status: OrderStatus) => {
  return api.patch<ApiResponse<Order>>(`/staff/orders/${orderId}/status`, { status })
}

export const getStaffOrderStatistics = () => {
  return api.get<ApiResponse<StaffOrderStatistic[]>>('/staff/orders/statistics')
}
