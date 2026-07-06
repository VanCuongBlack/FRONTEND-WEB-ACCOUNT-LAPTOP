import api from './api'

export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode?: number
  message: string
  data?: T
  error?: string
  errors?: unknown
}

export type SupportTicketType = 'warranty' | 'support' | 'complaint' | 'refund_request'

export type SupportTicketStatus =
  | 'open'
  | 'in_progress'
  | 'waiting_customer'
  | 'resolved'
  | 'closed'
  | 'cancelled'
  | 'reopened'

export interface CreateTicketPayload {
  order_id: string
  order_item_id: string
  type: SupportTicketType
  title: string
  description: string
  attachments?: string[]
}

export interface SupportTicket {
  _id: string
  ticket_code?: string
  order_id: string
  order_item_id: string
  product_name?: string
  product_type?: 'physical' | 'digital'
  type: SupportTicketType
  title: string
  description: string
  attachments?: string[]
  status: SupportTicketStatus
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  resolution_note?: string
  createdAt?: string
  updatedAt?: string
}

export interface TicketMessage {
  _id: string
  ticket_id: string
  sender_role: 'customer' | 'staff' | 'admin'
  content: string
  attachments?: string[]
  is_internal?: boolean
  createdAt?: string
}

export interface TicketsResponse {
  tickets: SupportTicket[]
  total?: number
  page?: number
  limit?: number
}

export interface TicketDetailResponse {
  ticket: SupportTicket
  messages: TicketMessage[]
}

export const createTicket = (data: CreateTicketPayload) => {
  return api.post<ApiResponse<SupportTicket>>('/support/tickets', data)
}

export const getMyTickets = (params?: {
  page?: number
  limit?: number
  status?: SupportTicketStatus
  type?: SupportTicketType
}) => {
  return api.get<ApiResponse<TicketsResponse>>('/support/tickets', { params })
}

export const getMyTicketDetail = (ticketId: string) => {
  return api.get<ApiResponse<TicketDetailResponse>>(`/support/tickets/${ticketId}`)
}

export const sendCustomerMessage = (
  ticketId: string,
  data: { content: string; attachments?: string[] }
) => {
  return api.post<ApiResponse<TicketMessage>>(
    `/support/tickets/${ticketId}/messages`,
    data
  )
}

export const cancelTicket = (ticketId: string) => {
  return api.put<ApiResponse<SupportTicket>>(`/support/tickets/${ticketId}/cancel`)
}

export const reopenTicket = (ticketId: string) => {
  return api.put<ApiResponse<SupportTicket>>(`/support/tickets/${ticketId}/reopen`)
}

export const closeTicket = (
  ticketId: string,
  data: { rating?: number; rating_comment?: string }
) => {
  return api.put<ApiResponse<SupportTicket>>(`/support/tickets/${ticketId}/close`, data)
}

export const getAllTickets = (params?: {
  page?: number
  limit?: number
  status?: SupportTicketStatus
  type?: SupportTicketType
  priority?: SupportTicket['priority']
  assigned_to?: string
  unassigned?: boolean
  search?: string
}) => {
  return api.get<ApiResponse<TicketsResponse>>('/support/manage/tickets', { params })
}

export const getManagedTicketDetail = (ticketId: string) => {
  return api.get<ApiResponse<TicketDetailResponse>>(`/support/manage/tickets/${ticketId}`)
}

export const assignTicket = (ticketId: string, staff_id: string) => {
  return api.put<ApiResponse<SupportTicket>>(`/support/manage/tickets/${ticketId}/assign`, {
    staff_id,
  })
}

export const updateTicketPriority = (
  ticketId: string,
  priority: NonNullable<SupportTicket['priority']>
) => {
  return api.put<ApiResponse<SupportTicket>>(`/support/manage/tickets/${ticketId}/priority`, {
    priority,
  })
}

export const sendStaffMessage = (
  ticketId: string,
  data: { content: string; attachments?: string[]; is_internal?: boolean }
) => {
  return api.post<ApiResponse<TicketMessage>>(
    `/support/manage/tickets/${ticketId}/messages`,
    data
  )
}

export const resolveTicket = (ticketId: string, resolution_note: string) => {
  return api.put<ApiResponse<SupportTicket>>(`/support/manage/tickets/${ticketId}/resolve`, {
    resolution_note,
  })
}

export const getSupportStats = () => {
  return api.get<ApiResponse<Record<string, number>>>('/support/manage/stats')
}
