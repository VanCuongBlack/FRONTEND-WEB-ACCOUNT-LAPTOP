import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as cartService from '@/services/cart.service'
import type {
  Cart,
  CartItem,
  ProductType,
} from '@/services/cart.service'

export interface CartState {
  items: CartItem[]
  total_amount: number
  total_items: number
  isLoading: boolean
  error: string | null
}

interface CartStore extends CartState {
  setItems: (items: CartItem[]) => void
  setTotals: (totalAmount: number, totalItems: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  fetchCart: () => Promise<void>

  addItem: (
    itemId: string,
    productType: ProductType,
    quantity?: number
  ) => Promise<void>

  removeItem: (cartItemId: string) => Promise<void>

  updateQuantity: (
    cartItemId: string,
    quantity: number
  ) => Promise<void>

  clearCart: () => Promise<void>
}

function normalizeCartItem(item: CartItem): CartItem {
  const id = item._id ?? item.cart_item_id ?? String(item.item_id)

  return {
    ...item,
    _id: id,
    product_type: item.product_type ?? item.item_type ?? 'physical',
    product:
      item.product ??
      (item.product_name
        ? {
            _id: item.product_id,
            name: item.product_name,
            base_price: item.sale_price ?? 0,
          }
        : undefined),
  }
}

function getCartTotals(cart?: Cart) {
  const items = (cart?.items ?? []).map(normalizeCartItem)

  const totalAmount =
    cart?.total_amount ??
    cart?.total_price ??
    items.reduce((total, item) => {
      const price = item.sale_price ?? item.product?.base_price ?? 0
      return total + price * item.quantity
    }, 0)

  const totalItems =
    cart?.total_items ??
    items.reduce((total, item) => total + item.quantity, 0)

  return {
    items,
    total_amount: totalAmount,
    total_items: totalItems,
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message
  return fallback
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      total_amount: 0,
      total_items: 0,
      isLoading: false,
      error: null,

      setItems: (items) => set({ items }),

      setTotals: (total_amount, total_items) =>
        set({ total_amount, total_items }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      fetchCart: async () => {
        set({ isLoading: true, error: null })

        try {
          const res = await cartService.getCart()

          if (res.data?.success && res.data?.data) {
            set(getCartTotals(res.data.data))
          }
        } catch (error) {
          set({
            error: getErrorMessage(error, 'Không thể tải giỏ hàng'),
          })
        } finally {
          set({ isLoading: false })
        }
      },

      addItem: async (itemId, productType, quantity = 1) => {
        set({ isLoading: true, error: null })

        try {
          const res = await cartService.addToCart({
            item_id: itemId,
            product_type: productType,
            quantity,
          })

          if (res.data?.success && res.data?.data) {
            set(getCartTotals(res.data.data))
          }
        } catch (error) {
          set({
            error: getErrorMessage(error, 'Không thể thêm sản phẩm vào giỏ'),
          })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (cartItemId) => {
        set({ isLoading: true, error: null })

        try {
          const res = await cartService.removeCartItem(cartItemId)

          if (res.data?.success && res.data?.data) {
            set(getCartTotals(res.data.data))
          } else {
            set((state) => {
              const items = state.items.filter(
                (item) => item._id !== cartItemId
              )

              const total_amount = items.reduce((total, item) => {
                const price =
                  item.sale_price ?? item.product?.base_price ?? 0
                return total + price * item.quantity
              }, 0)

              const total_items = items.reduce(
                (total, item) => total + item.quantity,
                0
              )

              return {
                items,
                total_amount,
                total_items,
              }
            })
          }
        } catch (error) {
          set({
            error: getErrorMessage(error, 'Không thể xóa sản phẩm khỏi giỏ'),
          })
        } finally {
          set({ isLoading: false })
        }
      },

      updateQuantity: async (cartItemId, quantity) => {
        if (quantity <= 0) {
          await useCartStore.getState().removeItem(cartItemId)
          return
        }

        set({ isLoading: true, error: null })

        try {
          const res = await cartService.updateCartItem(cartItemId, {
            quantity,
          })

          if (res.data?.success && res.data?.data) {
            set(getCartTotals(res.data.data))
          }
        } catch (error) {
          set({
            error: getErrorMessage(error, 'Không thể cập nhật số lượng'),
          })
        } finally {
          set({ isLoading: false })
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null })

        try {
          const res = await cartService.clearCart()

          if (res.data?.success) {
            set({
              items: [],
              total_amount: 0,
              total_items: 0,
            })
          }
        } catch (error) {
          set({
            error: getErrorMessage(error, 'Không thể xóa giỏ hàng'),
          })
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        total_amount: state.total_amount,
        total_items: state.total_items,
      }),
    }
  )
)