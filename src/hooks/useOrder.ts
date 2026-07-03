import { useEffect } from 'react'
import { toast } from 'sonner'

import { useOrderStore } from '@/store/orderStore'
import type { CreateOrderPayload } from '@/services/order.service'

export const useOrder = () => {
  const store = useOrderStore()

  useEffect(() => {
    store.fetchOrders().catch((error) => {
      console.error('Fetch orders error:', error)
    })
  }, [])

  const getOrder = async (orderId: string) => {
    try {
      await store.fetchOrderById(orderId)
    } catch (error) {
      console.error(error)
      toast.error('Không thể tải thông tin đơn hàng')
    }
  }

  const createNewOrder = async (data: CreateOrderPayload) => {
    try {
      const order = await store.createOrder(data)

      if (order?.order) {
        toast.success('Tạo đơn hàng thành công')
        return order
      }

      toast.error('Không thể tạo đơn hàng')
      return null
    } catch (error) {
      console.error(error)
      toast.error('Không thể tạo đơn hàng')
      return null
    }
  }

  const cancel = async (orderId: string, reason?: string) => {
    try {
      await store.cancelOrder(orderId, reason)
      toast.success('Hủy đơn hàng thành công')
    } catch (error) {
      console.error(error)
      toast.error('Không thể hủy đơn hàng')
    }
  }

  return {
    orders: store.orders,
    currentOrder: store.currentOrder,
    isLoading: store.isLoading,
    error: store.error,

    fetchOrders: () => store.fetchOrders(),
    getOrder,
    createNewOrder,
    cancel,
  }
}
