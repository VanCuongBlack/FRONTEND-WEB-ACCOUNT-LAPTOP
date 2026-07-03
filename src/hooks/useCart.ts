import { useEffect } from 'react'
import { toast } from 'sonner'

import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

import type { ProductType } from '@/services/cart.service'

export const useCart = () => {
  const store = useCartStore()
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const isAuthenticated = Boolean(user && accessToken)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    store.fetchCart().catch((error) => {
      console.error('Fetch cart error:', error)
    })
  }, [isAuthenticated])

  const addToCart = async (
    itemId: string,
    productType: ProductType,
    quantity = 1
  ) => {
    try {
      await store.addItem(
        itemId,
        productType,
        quantity
      )

      toast.success('Đã thêm vào giỏ hàng')
      return true
    } catch (error) {
      console.error(error)

      toast.error(
        'Vui lòng đăng nhập hoặc thử lại'
      )
      return false
    }
  }

  const removeFromCart = async (
    cartItemId: string
  ) => {
    try {
      await store.removeItem(cartItemId)

      toast.success(
        'Đã xóa khỏi giỏ hàng'
      )
    } catch (error) {
      console.error(error)

      toast.error(
        'Không thể xóa sản phẩm'
      )
    }
  }

  const updateQuantity = async (
    cartItemId: string,
    quantity: number
  ) => {
    try {
      await store.updateQuantity(
        cartItemId,
        quantity
      )
    } catch (error) {
      console.error(error)

      toast.error(
        'Không thể cập nhật số lượng'
      )
    }
  }

  const clear = async () => {
    try {
      await store.clearCart()

      toast.success(
        'Đã xóa toàn bộ giỏ hàng'
      )
    } catch (error) {
      console.error(error)

      toast.error(
        'Không thể xóa giỏ hàng'
      )
    }
  }

  return {
    items: store.items,

    totalAmount: store.total_amount,

    totalItems: store.total_items,

    isLoading: store.isLoading,

    error: store.error,

    addToCart,

    removeFromCart,

    updateQuantity,

    clear,
  }
}
