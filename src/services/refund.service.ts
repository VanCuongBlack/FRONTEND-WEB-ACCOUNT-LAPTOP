import api from './api'
import type { ApiResponse } from './support.service'

export interface RefundRecord {
  _id: string
  order_id?: string
  ticket_id?: string | null
  order_item_ids?: string[]
  reason?: string
  refund_method?: 'original_payment' | 'bank_transfer' | 'store_credit'
  restock_physical?: boolean
  amount?: number
  total_refund_amount?: number
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface ProcessRefundPayload {
  order_item_ids?: string[]
  reason: string
  refund_method?: 'original_payment' | 'bank_transfer' | 'store_credit'
  restock_physical?: boolean
  ticket_id?: string | null
}

export const processRefund = (orderId: string, data: ProcessRefundPayload) => {
  return api.post<ApiResponse<RefundRecord>>(`/refund/orders/${orderId}`, data)
}

export const getRefundsByOrder = (orderId: string) => {
  return api.get<ApiResponse<RefundRecord[]>>(`/refund/orders/${orderId}`)
}

export const getRefundDetail = (refundId: string) => {
  return api.get<ApiResponse<RefundRecord>>(`/refund/${refundId}`)
}

export const getRefunds = (params?: {
  page?: number
  limit?: number
  order_id?: string
  user_id?: string
}) => {
  return api.get<ApiResponse<RefundRecord[] | { refunds: RefundRecord[]; total?: number }>>(
    '/refund',
    { params }
  )
}
