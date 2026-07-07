import { create } from 'zustand'

import * as orderService from '@/services/order.service'

import type {
  Order,
  CreateOrderPayload,
  CreateOrderResponse,
  GetOrdersParams,
} from '@/services/order.service'

interface OrderStore {
  orders: Order[]

  currentOrder: Order | null

  isLoading: boolean

  error: string | null

  setOrders: (orders: Order[]) => void

  setCurrentOrder: (
    order: Order | null
  ) => void

  setLoading: (
    loading: boolean
  ) => void

  setError: (
    error: string | null
  ) => void

  fetchOrders: (
    params?: GetOrdersParams
  ) => Promise<void>

  fetchOrderById: (
    orderId: string
  ) => Promise<void>

  createOrder: (
    data: CreateOrderPayload
  ) => Promise<CreateOrderResponse | null>

  cancelOrder: (
    orderId: string,
    reason?: string
  ) => Promise<void>
}

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (error instanceof Error) {
    return error.message
  }

  return fallback
}

export const useOrderStore =
  create<OrderStore>((set) => ({
    orders: [],

    currentOrder: null,

    isLoading: false,

    error: null,

    setOrders: (orders) =>
      set({ orders }),

    setCurrentOrder: (order) =>
      set({ currentOrder: order }),

    setLoading: (loading) =>
      set({ isLoading: loading }),

    setError: (error) =>
      set({ error }),

    fetchOrders: async (
      params?: GetOrdersParams
    ) => {
      set({
        isLoading: true,
        error: null,
      })

      try {
        const res =
          await orderService.getOrders(
            params
          )

        if (
          res.data?.success &&
          res.data?.data
        ) {
          const orders =
            orderService.extractOrders(
              res.data.data
            )

          set({ orders })
        }
      } catch (error) {
        set({
          error: getErrorMessage(
            error,
            'Không thể tải đơn hàng'
          ),
        })
      } finally {
        set({
          isLoading: false,
        })
      }
    },

    fetchOrderById: async (
      orderId
    ) => {
      set({
        isLoading: true,
        error: null,
      })

      try {
        const res =
          await orderService.getOrderById(
            orderId
          )

        if (
          res.data?.success &&
          res.data?.data
        ) {
          set({
            currentOrder:
              res.data.data,
          })
        }
      } catch (error) {
        set({
          error: getErrorMessage(
            error,
            'Không thể tải đơn hàng'
          ),
        })
      } finally {
        set({
          isLoading: false,
        })
      }
    },

    createOrder: async (
      data
    ) => {
      set({
        isLoading: true,
        error: null,
      })

      try {
        const res =
          await orderService.createOrder(
            data
          )

        if (
          res.data?.success &&
          res.data?.data
        ) {
          const order =
            orderService.extractCreatedOrder(
              res.data.data
            )

          set({
            currentOrder:
              order,
          })

          return res.data.data
        }

        return null
      } catch (error) {
        set({
          error: getErrorMessage(
            error,
            'Không thể tạo đơn hàng'
          ),
        })

        return null
      } finally {
        set({
          isLoading: false,
        })
      }
    },

    cancelOrder: async (
      orderId,
      reason
    ) => {
      set({
        isLoading: true,
        error: null,
      })

      try {
        const res =
          await orderService.cancelOrder(
            orderId,
            reason
          )

        if (
          res.data?.success &&
          res.data?.data
        ) {
          set({
            currentOrder:
              res.data.data,
          })

          await useOrderStore
            .getState()
            .fetchOrders()
        }
      } catch (error) {
        set({
          error: getErrorMessage(
            error,
            'Không thể hủy đơn hàng'
          ),
        })
      } finally {
        set({
          isLoading: false,
        })
      }
    },
  }))
