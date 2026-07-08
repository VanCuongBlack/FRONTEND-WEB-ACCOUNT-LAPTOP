import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Eye,
  Loader2,
  PackageCheck,
  RefreshCw,
  X,
} from 'lucide-react'
import StaffLayout from '@/layouts/StaffLayout'
import { confirmCOD } from '@/services/payment.service'
import { getRefundsByOrder, processRefund, type RefundRecord } from '@/services/refund.service'
import {
  getStaffOrderById,
  getStaffOrders,
  getStaffOrderStatistics,
  updateStaffOrderStatus,
  type Order,
  type OrderStatus,
  type OrderUser,
  type StaffOrderStatistic,
} from '@/services/order.service'

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'completed', label: 'Hoàn tất' },
  { value: 'cancelled', label: 'Đã hủy' },
  { value: 'failed', label: 'Thất bại' },
]

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  completed: 'Hoàn tất',
  cancelled: 'Đã hủy',
  failed: 'Thất bại',
  partially_refunded: 'Đã hoàn một phần',
  refunded: 'Đã hoàn tiền',
}

function formatPrice(price?: number) {
  return `${(price ?? 0).toLocaleString('vi-VN')}đ`
}

function formatDate(value?: string) {
  if (!value) return '-'
  return new Date(value).toLocaleString('vi-VN')
}

function formatPaymentMethod(method?: string) {
  if (method === 'cod') return 'COD'
  if (method === 'bank_transfer') return 'Chuyển khoản'
  return method ?? '-'
}

function getStatusLabel(status?: string) {
  return statusLabels[status as OrderStatus] ?? status ?? '-'
}

function getStatusBadgeClass(status?: string) {
  if (status === 'completed' || status === 'confirmed') return 'bg-emerald-50 text-emerald-700'
  if (status === 'processing') return 'bg-blue-50 text-blue-700'
  if (status === 'partially_refunded' || status === 'refunded') return 'bg-purple-50 text-purple-700'
  if (status === 'cancelled' || status === 'failed') return 'bg-rose-50 text-rose-700'
  return 'bg-amber-50 text-amber-700'
}

function getCustomer(order: Order): OrderUser {
  return typeof order.user_id === 'object' && order.user_id ? order.user_id : {}
}

function canMarkProcessing(status?: OrderStatus) {
  return status === 'pending' || status === 'confirmed'
}

function canMarkDelivered(status?: OrderStatus) {
  return status === 'confirmed' || status === 'processing'
}

function isWaitingBankTransfer(order: Order) {
  return order.payment_method === 'bank_transfer' && order.status === 'pending'
}

function canProcessRefund(order: Order) {
  return ['confirmed', 'processing', 'completed'].includes(order.status)
}

function canMarkProcessingOrder(order: Order) {
  return !isWaitingBankTransfer(order) && canMarkProcessing(order.status)
}

function canMarkDeliveredOrder(order: Order) {
  return canMarkDelivered(order.status)
}

function getStatusOptionsForOrder(order: Order) {
  if (order.status === 'refunded' || order.status === 'partially_refunded') {
    return [{ value: order.status, label: getStatusLabel(order.status) }]
  }
  if (!isWaitingBankTransfer(order)) return statusOptions
  return statusOptions.filter((status) => ['pending', 'cancelled', 'failed'].includes(status.value))
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statistics, setStatistics] = useState<StaffOrderStatistic[]>([])
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [refundHistory, setRefundHistory] = useState<RefundRecord[]>([])
  const [refundReason, setRefundReason] = useState('')
  const [refundMethod, setRefundMethod] = useState<'original_payment' | 'bank_transfer' | 'store_credit'>('original_payment')
  const [refundRestockPhysical, setRefundRestockPhysical] = useState(false)
  const [refundSelectedItemIds, setRefundSelectedItemIds] = useState<string[]>([])

  const statisticMap = useMemo(() => {
    return statistics.reduce<Record<string, number>>((map, item) => {
      map[item._id] = item.total
      return map
    }, {})
  }, [statistics])

  const loadOrders = async (nextPage = page, nextStatus = statusFilter, silent = false) => {
    if (!silent) setIsLoading(true)
    setError('')

    try {
      const [ordersRes, statsRes] = await Promise.all([
        getStaffOrders({
          page: nextPage,
          limit: 10,
          status: nextStatus || undefined,
        }),
        getStaffOrderStatistics(),
      ])

      const data = ordersRes.data.data
      setOrders(data?.orders ?? [])
      setTotalOrders(data?.total ?? 0)
      setTotalPages(data?.totalPages ?? 1)
      setStatistics(statsRes.data.data ?? [])
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải danh sách đơn hàng.')
    } finally {
      if (!silent) setIsLoading(false)
    }
  }

  const refreshSelectedOrder = async (orderId: string) => {
    try {
      const [orderRes, refundsRes] = await Promise.all([
        getStaffOrderById(orderId),
        getRefundsByOrder(orderId),
      ])
      setSelectedOrder(orderRes.data.data ?? null)
      setRefundHistory(Array.isArray(refundsRes.data.data) ? refundsRes.data.data : [])
      setRefundReason('')
      setRefundRestockPhysical(false)
      setRefundSelectedItemIds([])
    } catch {
      // Giữ chi tiết hiện tại nếu refresh nền lỗi tạm thời.
    }
  }

  useEffect(() => {
    loadOrders(page, statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (isActionLoading) return
      loadOrders(page, statusFilter, true)
      if (selectedOrder?._id) {
        refreshSelectedOrder(selectedOrder._id)
      }
    }, 12000)

    return () => window.clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, selectedOrder?._id, isActionLoading])

  const handleSelectOrder = async (orderId: string) => {
    setIsActionLoading(true)
    setError('')
    setMessage('')

    try {
      const [orderRes, refundsRes] = await Promise.all([
        getStaffOrderById(orderId),
        getRefundsByOrder(orderId),
      ])
      setSelectedOrder(orderRes.data.data ?? null)
      setRefundHistory(Array.isArray(refundsRes.data.data) ? refundsRes.data.data : [])
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải chi tiết đơn hàng.')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    setIsActionLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await updateStaffOrderStatus(orderId, status)
      setSelectedOrder(res.data.data ?? selectedOrder)
      setMessage('Đã cập nhật trạng thái đơn hàng.')
      await loadOrders(page, statusFilter)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể cập nhật trạng thái đơn hàng.')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleConfirmCOD = async (order: Order) => {
    setIsActionLoading(true)
    setError('')
    setMessage('')

    try {
      await confirmCOD(order._id)
      setMessage('Đã xác nhận COD. Đơn hàng đã được cập nhật thành hoàn tất.')
      await Promise.all([loadOrders(page, statusFilter), handleSelectOrder(order._id)])
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể xác nhận COD.')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleFilterChange = (status: OrderStatus | '') => {
    setStatusFilter(status)
    setPage(1)
    setSelectedOrder(null)
    setRefundHistory([])
    setRefundSelectedItemIds([])
  }

  const handleProcessRefund = async (order: Order) => {
    const reason = refundReason.trim()
    if (reason.length < 10) {
      setError('Lý do hoàn tiền cần ít nhất 10 ký tự.')
      setMessage('')
      return
    }

    setIsActionLoading(true)
    setError('')
    setMessage('')

    try {
      await processRefund(order._id, {
        ...(refundSelectedItemIds.length ? { order_item_ids: refundSelectedItemIds } : {}),
        reason,
        refund_method: refundMethod,
        restock_physical: refundRestockPhysical,
      })
      setMessage('Đã gửi yêu cầu hoàn tiền đơn hàng sang BE.')
      setRefundReason('')
      setRefundSelectedItemIds([])
      await Promise.all([loadOrders(page, statusFilter), handleSelectOrder(order._id)])
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể xử lý hoàn tiền đơn hàng.')
    } finally {
      setIsActionLoading(false)
    }
  }

  const toggleRefundItem = (itemId: string) => {
    setRefundSelectedItemIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    )
  }

  return (
    <StaffLayout title="Quản lý đơn hàng" notificationCount={0}>
      <div className="mx-auto w-full max-w-[1840px] space-y-6 font-sans text-slate-800">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý đơn hàng</h1>
            <p className="mt-1 text-sm text-slate-500">
              Theo dõi đơn hàng, kiểm tra thanh toán và xác nhận COD sau khi đã gọi khách.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadOrders(page, statusFilter)}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 xl:grid-cols-6">
          <InfoCard icon={<ClipboardList className="h-7 w-7 text-blue-600" />} label="Tổng đơn" value={totalOrders.toLocaleString('vi-VN')} />
          {statusOptions.slice(0, 5).map((status) => (
            <InfoCard
              key={status.value}
              icon={<PackageCheck className="h-7 w-7 text-emerald-600" />}
              label={status.label}
              value={(statisticMap[status.value] ?? 0).toLocaleString('vi-VN')}
            />
          ))}
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Danh sách đơn hàng</h2>
              <p className="mt-1 text-sm text-slate-500">Theo dõi đơn mới nhất và xử lý theo trạng thái.</p>
            </div>

            <select
              value={statusFilter}
              onChange={(event) => handleFilterChange(event.target.value as OrderStatus | '')}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-500">
                        Đang tải đơn hàng...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-500">
                        Chưa có đơn hàng phù hợp.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const customer = getCustomer(order)

                      return (
                        <tr key={order._id} className="hover:bg-slate-50">
                          <TableCell>
                            <button
                              type="button"
                              onClick={() => handleSelectOrder(order._id)}
                              className="font-bold text-blue-700 hover:underline"
                            >
                              {order._id}
                            </button>
                          </TableCell>
                          <TableCell>
                            <p className="font-semibold text-slate-900">{customer.fullname ?? '-'}</p>
                            <p className="text-xs text-slate-500">{customer.phone ?? customer.email ?? '-'}</p>
                          </TableCell>
                          <TableCell>{formatPaymentMethod(order.payment_method)}</TableCell>
                          <TableCell className="font-bold text-slate-900">{formatPrice(order.total_amount)}</TableCell>
                          <TableCell>
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeClass(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleSelectOrder(order._id)}
                                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Chi tiết
                              </button>
                              {order.payment_method === 'cod' && ['pending', 'processing'].includes(order.status) && (
                                <button
                                  type="button"
                                  disabled={isActionLoading}
                                  onClick={() => handleConfirmCOD(order)}
                                  className="inline-flex h-9 items-center gap-1 rounded-lg bg-blue-600 px-3 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-60"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Xác nhận COD
                                </button>
                              )}
                              {canMarkProcessingOrder(order) && (
                                <button
                                  type="button"
                                  disabled={isActionLoading}
                                  onClick={() => handleUpdateStatus(order._id, 'processing')}
                                  className="inline-flex h-9 items-center gap-1 rounded-lg bg-amber-500 px-3 text-xs font-bold text-white hover:bg-amber-400 disabled:opacity-60"
                                >
                                  <PackageCheck className="h-3.5 w-3.5" />
                                  Đang giao
                                </button>
                              )}
                              {canMarkDeliveredOrder(order) && (
                                <button
                                  type="button"
                                  disabled={isActionLoading}
                                  onClick={() => handleUpdateStatus(order._id, 'completed')}
                                  className="inline-flex h-9 items-center gap-1 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-60"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Đã giao
                                </button>
                              )}
                            </div>
                          </TableCell>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>
              Trang {page}/{Math.max(totalPages, 1)}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="h-9 rounded-lg border border-slate-200 px-4 font-bold disabled:opacity-50"
              >
                Trước
              </button>
              <button
                type="button"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((prev) => prev + 1)}
                className="h-9 rounded-lg border border-slate-200 px-4 font-bold disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </section>

        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4 py-8 backdrop-blur-sm">
            <section className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Chi tiết đơn hàng</h2>
                  <p className="mt-1 break-all text-sm font-semibold text-blue-700">{selectedOrder._id}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={selectedOrder.status}
                    disabled={isActionLoading}
                    onChange={(event) => handleUpdateStatus(selectedOrder._id, event.target.value as OrderStatus)}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
                  >
                    {getStatusOptionsForOrder(selectedOrder).map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>

                  {selectedOrder.payment_method === 'cod' && ['pending', 'processing'].includes(selectedOrder.status) && (
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => handleConfirmCOD(selectedOrder)}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-60"
                    >
                      {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                      Xác nhận COD
                    </button>
                  )}
                  {canMarkProcessingOrder(selectedOrder) && (
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => handleUpdateStatus(selectedOrder._id, 'processing')}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-bold text-white hover:bg-amber-400 disabled:opacity-60"
                    >
                      <PackageCheck className="h-4 w-4" />
                      Đang giao
                    </button>
                  )}
                  {canMarkDeliveredOrder(selectedOrder) && (
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => handleUpdateStatus(selectedOrder._id, 'completed')}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-60"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Đã giao hàng
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                    aria-label="Đóng chi tiết đơn hàng"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {isWaitingBankTransfer(selectedOrder) && (
                <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                  Đơn chuyển khoản đang chờ SePay xác nhận thanh toán. Nhân viên không xác nhận tiền thủ công cho đơn này.
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
                <DetailItem label="Khách hàng" value={getCustomer(selectedOrder).fullname ?? '-'} />
                <DetailItem label="Số điện thoại" value={getCustomer(selectedOrder).phone ?? '-'} />
                <DetailItem label="Phương thức" value={formatPaymentMethod(selectedOrder.payment_method)} />
                <DetailItem label="Tổng tiền" value={formatPrice(selectedOrder.total_amount)} />
              </div>

              {(selectedOrder.shipping_address) && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="font-bold text-slate-900">Địa chỉ giao hàng: </span>
                  {selectedOrder.shipping_address}
                </div>
              )}

              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <TableHead>Hoàn</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Giá bán</TableHead>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.items.map((item) => {
                      const itemId = item._id ?? ''
                      const isRefunded = Boolean(item.is_refunded)
                      return (
                        <tr key={item._id ?? item.item_id}>
                          <TableCell>
                            {itemId ? (
                              <input
                                type="checkbox"
                                checked={refundSelectedItemIds.includes(itemId)}
                                disabled={isRefunded || !canProcessRefund(selectedOrder)}
                                onChange={() => toggleRefundItem(itemId)}
                                className="h-4 w-4 accent-emerald-600 disabled:opacity-40"
                                title={isRefunded ? 'Sản phẩm này đã được hoàn' : 'Chọn sản phẩm cần hoàn'}
                              />
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell className="font-semibold text-slate-900">
                            {item.product_name}
                            {isRefunded && (
                              <span className="ml-2 rounded-full bg-purple-50 px-2 py-1 text-[11px] font-black text-purple-700">
                                Đã hoàn
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{item.product_type === 'physical' ? 'PC/Laptop' : 'Account'}</TableCell>
                          <TableCell className="font-bold">{formatPrice(item.sale_price)}</TableCell>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-black text-amber-950">Hoàn tiền đơn hàng</h3>
                  <p className="text-sm leading-6 text-amber-800">
                    Chỉ áp dụng cho đơn đã xác nhận, đang xử lý hoặc hoàn tất. Chọn sản phẩm cần hoàn; nếu không chọn sản phẩm nào, BE sẽ hoàn toàn bộ đơn.
                  </p>
                </div>

                {!canProcessRefund(selectedOrder) && (
                  <p className="mt-4 rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-amber-800">
                    Đơn đang ở trạng thái "{getStatusLabel(selectedOrder.status)}" nên BE chưa cho phép hoàn tiền.
                  </p>
                )}

                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_260px]">
                  <label className="block text-sm font-bold text-slate-800">
                    Lý do hoàn tiền
                    <textarea
                      value={refundReason}
                      onChange={(event) => setRefundReason(event.target.value)}
                      className="mt-2 min-h-[96px] w-full rounded-xl border border-amber-200 bg-white p-3 text-sm focus:border-amber-500 focus:outline-none"
                      placeholder="Nhập lý do hoàn tiền..."
                    />
                  </label>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-800">
                      Phương thức hoàn
                      <select
                        value={refundMethod}
                        onChange={(event) => setRefundMethod(event.target.value as typeof refundMethod)}
                        className="mt-2 h-11 w-full rounded-xl border border-amber-200 bg-white px-3 text-sm font-semibold focus:border-amber-500 focus:outline-none"
                      >
                        <option value="original_payment">Theo phương thức gốc</option>
                        <option value="bank_transfer">Chuyển khoản</option>
                        <option value="store_credit">Điểm cửa hàng</option>
                      </select>
                    </label>

                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={refundRestockPhysical}
                        onChange={(event) => setRefundRestockPhysical(event.target.checked)}
                      />
                      Nhập lại kho hàng vật lý
                    </label>

                    <button
                      type="button"
                      disabled={isActionLoading || !canProcessRefund(selectedOrder)}
                      onClick={() => handleProcessRefund(selectedOrder)}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-60"
                    >
                      {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      {refundSelectedItemIds.length > 0
                        ? `Hoàn ${refundSelectedItemIds.length} sản phẩm`
                        : 'Hoàn toàn bộ đơn'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-black text-slate-950">Lịch sử hoàn tiền</h3>
                  <p className="text-sm text-slate-600">Dữ liệu lấy từ API hoàn tiền của BE theo mã đơn hiện tại.</p>
                </div>

                <div className="mt-4 space-y-3">
                  {refundHistory.length === 0 ? (
                    <p className="rounded-xl bg-white px-4 py-3 text-sm text-slate-500">
                      Chưa có bản ghi hoàn tiền cho đơn này.
                    </p>
                  ) : (
                    refundHistory.map((refund) => (
                      <div key={refund._id} className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="break-all text-sm font-black text-slate-900">{refund._id}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatDate(refund.createdAt)} • {refund.refund_method ?? 'original_payment'} • {refund.status ?? 'completed'}
                            </p>
                          </div>
                          <p className="text-sm font-black text-emerald-700">
                            {formatPrice(refund.total_refund_amount ?? refund.amount)}
                          </p>
                        </div>
                        {refund.reason && (
                          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{refund.reason}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {message && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </p>
        )}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h2 className="font-bold text-amber-900">Lưu ý COD</h2>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Với đơn COD, nhân viên gọi khách trước rồi bấm xác nhận COD khi khách đồng ý nhận hàng. Đơn chuyển khoản do SePay tự xác nhận khi nhận đúng tiền và nội dung.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {icon}
      <p className="mt-4 text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 break-words text-xl font-black text-slate-900">{value}</p>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-slate-900">{value}</p>
    </div>
  )
}

function TableHead({ children }: { children: ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
      {children}
    </th>
  )
}

function TableCell({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <td className={`px-6 py-4 text-sm text-slate-700 ${className}`}>{children}</td>
}
