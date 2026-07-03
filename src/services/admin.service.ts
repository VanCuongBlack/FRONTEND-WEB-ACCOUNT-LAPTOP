import api from './api'

export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode?: number
  message: string
  data?: T
  error?: string
}

export interface AdminDashboardResponse {
  summary: {
    total_orders?: number
    pending_orders?: number
    completed_orders?: number
    cancelled_orders?: number
    total_customers?: number
    total_products?: number
    open_tickets?: number
  }
  revenue: {
    this_month?: number
    last_month?: number
    growth_percent?: number | string | null
  }
  recent_orders?: Array<{
    _id: string
    user_id?: {
      fullname?: string
      email?: string
    }
    items?: Array<{
      product_name?: string
      product_type?: 'physical' | 'digital'
      sale_price?: number
    }>
    total_amount?: number
    status?: string
    createdAt?: string
  }>
}

export interface RevenueReportResponse {
  type: 'revenue' | 'products' | 'customers'
  from?: string
  to?: string
  total_revenue?: number
  total_orders?: number
  data?: Array<{
    _id: string
    revenue?: number
    order_count?: number
    product_name?: string
    product_type?: 'physical' | 'digital'
    total_sold?: number
    total_revenue?: number
  }>
  new_customers?: number
  top_customers?: Array<{
    _id: string
    order_count?: number
    total_spent?: number
  }>
}

export interface Role {
  _id: string
  name: string
  description?: string
}

export interface SystemInfoResponse {
  roles?: Role[]
  stats?: {
    total_users?: number
    total_products?: number
  }
  system?: {
    node_version?: string
    uptime_seconds?: number
    memory_mb?: string | number
  }
}

export interface AdminUser {
  _id: string
  fullname?: string
  email?: string
  phone?: string
  address?: string
  position?: string
  role?: Role | string
  isActive?: boolean
  isVerified?: boolean
  createdAt?: string
}

export interface StaffListResponse {
  staff: AdminUser[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CustomerListResponse {
  customers: AdminUser[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CustomerDetailResponse {
  customer: AdminUser
  order_history?: Array<{
    _id: string
    status?: string
    total_amount?: number
    payment_method?: string
    createdAt?: string
  }>
  total_spent?: number
}

export interface CreateStaffPayload {
  fullname: string
  email: string
  phone: string
  password: string
  address?: string
  position?: string
}

export interface UpdateStaffPayload {
  fullname?: string
  phone?: string
  address?: string
  position?: string
  isActive?: boolean
}

export const getDashboard = () => {
  return api.get<ApiResponse<AdminDashboardResponse>>('/admin/dashboard')
}

export const getReport = (params?: {
  from?: string
  to?: string
  type?: 'revenue' | 'products' | 'customers'
}) => {
  return api.get<ApiResponse<RevenueReportResponse>>('/admin/reports', {
    params: {
      ...params,
      type: params?.type ?? 'revenue',
    },
  })
}

export const getRevenueReport = (params?: { from?: string; to?: string }) =>
  getReport({ ...params, type: 'revenue' })

export const getSystemInfo = () => {
  return api.get<ApiResponse<SystemInfoResponse>>('/admin/system/info')
}

export const getRoles = () => {
  return api.get<ApiResponse<Role[]>>('/admin/system/roles')
}

export const getStaffs = (params?: { page?: number; limit?: number; search?: string }) => {
  return api.get<ApiResponse<StaffListResponse>>('/admin/staffs', { params })
}

export const createStaff = (data: CreateStaffPayload) => {
  return api.post<ApiResponse<AdminUser>>('/admin/staffs', data)
}

export const updateStaff = (staffId: string, data: UpdateStaffPayload) => {
  return api.put<ApiResponse<AdminUser>>(`/admin/staffs/${staffId}`, data)
}

export const deleteStaff = (staffId: string) => {
  return api.delete<ApiResponse<null>>(`/admin/staffs/${staffId}`)
}

export const assignStaffRole = (staffId: string, roleId: string) => {
  return api.patch<ApiResponse<AdminUser>>(`/admin/staffs/${staffId}/assign-role`, { roleId })
}

export const getCustomers = (params?: { page?: number; limit?: number; search?: string }) => {
  return api.get<ApiResponse<CustomerListResponse>>('/admin/customers', { params })
}

export const getCustomerDetail = (customerId: string) => {
  return api.get<ApiResponse<CustomerDetailResponse>>(`/admin/customers/${customerId}`)
}

export const toggleCustomerStatus = (customerId: string) => {
  return api.patch<ApiResponse<AdminUser>>(`/admin/customers/${customerId}/toggle-status`)
}
