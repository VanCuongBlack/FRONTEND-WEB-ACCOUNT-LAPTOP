import api from './api'

export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode?: number
  message: string
  data?: T
  error?: string
}

/* ===========================
   Types
=========================== */

export type ProductType = 'physical' | 'digital'

export interface AddCartPayload {
  item_id: string
  product_type: ProductType
  quantity: number
}

export interface UpdateCartItemPayload {
  quantity: number
}

export interface CartProduct {
  _id?: string
  name: string
  description?: string
  thumbnail?: string
  images?: string[]
  base_price: number
}

export interface CartItem {
  _id: string
  cart_item_id?: string
  product_id?: string
  product_name?: string
  item_id: string
  product_type: ProductType
  item_type?: ProductType
  quantity: number
  sale_price?: number
  subtotal?: number
  product?: CartProduct
}

export interface Cart {
  _id?: string
  cart_id?: string
  user_id?: string
  items: CartItem[]
  total_amount?: number
  total_price?: number
  total_items?: number
  createdAt?: string
  updatedAt?: string
}

/* ===========================
   API
=========================== */

// Lấy giỏ hàng

export const getCart = () => {
  return api.get<ApiResponse<Cart>>('/cart', {
    params: { _t: Date.now() },
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  })
}

// Thêm vào giỏ hàng

export const addToCart = (data: AddCartPayload) => {
  return api.post<ApiResponse<Cart>>('/cart/add', data)
}

// Cập nhật số lượng

export const updateCartItem = (
  cartItemId: string,
  data: UpdateCartItemPayload
) => {
  return api.put<ApiResponse<Cart>>(
    `/cart/item/${cartItemId}`,
    data
  )
}

// Xóa 1 sản phẩm khỏi giỏ

export const removeCartItem = (cartItemId: string) => {
  return api.delete<ApiResponse<Cart>>(
    `/cart/item/${cartItemId}`
  )
}

// Xóa toàn bộ giỏ hàng

export const clearCart = () => {
  return api.delete<ApiResponse<Cart>>('/cart')
}
