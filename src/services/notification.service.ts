import api from './api'

export interface ApiResponse<T = unknown> {
  statusCode?: number
  message?: string
  data: T
}

export type NotificationType =
  | 'order_created'
  | 'order_status_changed'
  | 'payment_success'
  | 'payment_failed'
  | 'refund_processed'
  | 'refund_rejected'
  | 'support_new_ticket'
  | 'support_new_message'
  | 'support_status_changed'
  | 'inventory_low_stock'
  | 'system'

export interface NotificationRecord {
  _id: string
  recipient_id?: string
  recipient_role?: 'customer' | 'staff' | 'admin'
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
  link?: string | null
  is_read: boolean
  read_at?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface NotificationsResponse {
  notifications: NotificationRecord[]
  total: number
  page: number
  limit: number
  totalPages: number
  unread_count: number
}

export interface UnreadCountResponse {
  unread_count: number
}

export function getNotifications(params?: {
  page?: number
  limit?: number
  is_read?: boolean
  type?: NotificationType
}) {
  return api.get<ApiResponse<NotificationsResponse>>('/notification', {
    params: {
      ...params,
      is_read: params?.is_read === undefined ? undefined : String(params.is_read),
    },
  })
}

export function getUnreadNotificationCount() {
  return api.get<ApiResponse<UnreadCountResponse>>('/notification/unread-count')
}

export function markNotificationAsRead(notificationId: string) {
  return api.put<ApiResponse<NotificationRecord>>(`/notification/${notificationId}/read`)
}

export function markAllNotificationsAsRead() {
  return api.put<ApiResponse<{ updated_count: number }>>('/notification/read-all')
}

export function deleteNotification(notificationId: string) {
  return api.delete<ApiResponse<{ message?: string }>>(`/notification/${notificationId}`)
}

export function deleteAllReadNotifications() {
  return api.delete<ApiResponse<{ deleted_count: number }>>('/notification/read')
}
