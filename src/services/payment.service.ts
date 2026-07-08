import api from './api'

export interface Payment {
  _id?: string
  payment_id?: string
  order_id: string
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'expired' | 'refunded'
  method?: 'cod' | 'bank_transfer'
  payment_method?: 'cod' | 'bank_transfer'
  transfer_content?: string
  bank_account_number?: string
  bank_account_name?: string
  bank_name?: string
  bank_info?: {
    bank_name?: string
    account_number?: string
    account_name?: string
    amount?: number
    transfer_content?: string
    expires_at?: string
    qr_url?: string
    qrUrl?: string
  }
  qr_url?: string
  qrUrl?: string
  sepay_transaction_id?: string
  sepay_reference_code?: string
  created_at?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode?: number
  message: string
  data?: T
  error?: string
}

export const getPaymentByOrder = (orderId: string) => {
  return api.get<ApiResponse<Payment>>(`/payment/order/${orderId}`)
}

export const confirmCOD = (orderId: string) => {
  return api.post<ApiResponse<{ message?: string }>>(`/payment/cod/confirm/${orderId}`)
}
