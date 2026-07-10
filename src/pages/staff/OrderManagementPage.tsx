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

const statusFilterOptions: Array<{ value: OrderStatus; label: string }> = [
  ...statusOptions,
  { value: 'partially_refunded', label: 'Đã hoàn một phần' },
  { value: 'refunded', label: 'Đã hoàn tiền' },
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
  if (status === 'completed' || status === 'confirmed') return 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
  if (status === 'processing') return 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
  if (status === 'partially_refunded' || status === 'refunded') return 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
  if (status === 'cancelled' || status === 'failed') return 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
  return 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
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
      const orderRes = await getStaffOrderById(orderId)
      setSelectedOrder(orderRes.data.data ?? null)
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
      const orderRes = await getStaffOrderById(orderId)
      setSelectedOrder(orderRes.data.data ?? null)
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
  }

  return (
    <StaffLayout title="Quản lý đơn hàng" notificationCount={0}>
      <div className="mx-auto w-full max-w-[1840px] space-y-6 font-sans text-white">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Quản lý đơn hàng</h1>
            <p className="mt-1 text-sm text-slate-400">
              Theo dõi đơn hàng, kiểm tra thanh toán và xác nhận COD sau khi đã gọi khách.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadOrders(page, statusFilter)}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#181B22] px-5 text-sm font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 xl:grid-cols-6">
          <InfoCard icon={<ClipboardList className="h-7 w-7 text-blue-400" />} label="Tổng đơn" value={totalOrders.toLocaleString('vi-VN')} />
          {statusOptions.slice(0, 5).map((status) => (
            <InfoCard
              key={status.value}
              icon={<PackageCheck className="h-7 w-7 text-emerald-400" />}
              label={status.label}
              value={(statisticMap[status.value] ?? 0).toLocaleString('vi-VN')}
            />
          ))}
        </div>

        <section className="rounded-2xl border border-white/10 bg-[#2A2F3B] p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-white">Danh sách đơn hàng</h2>
              <p className="mt-1 text-sm text-slate-400">Theo dõi đơn mới nhất và xử lý theo trạng thái.</p>
            </div>

            <select
              value={statusFilter}
              onChange={(event) => handleFilterChange(event.target.value as OrderStatus | '')}
              className="h-11 rounded-xl border border-white/10 bg-[#181B22] px-4 text-sm font-semibold text-white outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              {statusFilterOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#2A2F3B]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5">
                <thead className="bg-[#181B22]">
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
                <tbody className="divide-y divide-white/5 bg-[#2A2F3B]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-[#909AAB]">
                        Đang tải đơn hàng...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-[#909AAB]">
                        Chưa có đơn hàng phù hợp.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const customer = getCustomer(order)

                      return (
                        <tr key={order._id} className="hover:bg-[#202530] transition-colors">
                          <TableCell>
                            <button
                              type="button"
                              onClick={() => handleSelectOrder(order._id)}
                              className="font-bold text-blue-400 hover:underline cursor-pointer"
                            >
                              {order._id}
                            </button>
                          </TableCell>
                          <TableCell>
                            <p className="font-semibold text-white">{customer.fullname ?? '-'}</p>
                            <p className="text-xs text-[#909AAB]">{customer.phone ?? customer.email ?? '-'}</p>
                          </TableCell>
                          <TableCell>{formatPaymentMethod(order.payment_method)}</TableCell>
                          <TableCell className="font-bold text-white">{formatPrice(order.total_amount)}</TableCell>
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
                                className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/10 bg-[#181B22] px-3 text-xs font-bold text-slate-300 hover:bg-[#202530] cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Chi tiết
                              </button>
                              {order.payment_method === 'cod' && ['pending', 'processing'].includes(order.status) && (
                                <button
                                  type="button"
                                  disabled={isActionLoading}
                                  onClick={() => handleConfirmCOD(order)}
                                  className="inline-flex h-9 items-center gap-1 rounded-lg bg-blue-600 px-3 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-60 cursor-pointer"
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
                                  className="inline-flex h-9 items-center gap-1 rounded-lg bg-amber-500 px-3 text-xs font-bold text-white hover:bg-amber-400 disabled:opacity-60 cursor-pointer"
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
                                  className="inline-flex h-9 items-center gap-1 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-60 cursor-pointer"
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

          <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
            <span>
              Trang {page}/{Math.max(totalPages, 1)}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="h-9 rounded-lg border border-white/10 bg-[#181B22] px-4 font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                Trước
              </button>
              <button
                type="button"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((prev) => prev + 1)}
                className="h-9 rounded-lg border border-white/10 bg-[#181B22] px-4 font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                Sau
              </button>
            </div>
          </div>
        </section>

        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181B22]/80 px-4 py-8 backdrop-blur-sm">
            <section className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/10 bg-[#2A2F3B] p-6 shadow-2xl text-white">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Chi tiết đơn hàng</h2>
                  <p className="mt-1 break-all text-sm font-semibold text-blue-400">{selectedOrder._id}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={selectedOrder.status}
                    disabled={isActionLoading}
                    onChange={(event) => handleUpdateStatus(selectedOrder._id, event.target.value as OrderStatus)}
                    className="h-11 rounded-xl border border-white/10 bg-[#181B22] px-4 text-sm font-bold text-white outline-none focus:border-blue-600 cursor-pointer"
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
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-60 cursor-pointer"
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
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-bold text-white hover:bg-amber-400 disabled:opacity-60 cursor-pointer"
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
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-60 cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Đã giao hàng
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#181B22] text-slate-300 hover:bg-slate-800 cursor-pointer"
                    aria-label="Đóng chi tiết đơn hàng"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {isWaitingBankTransfer(selectedOrder) && (
                <div className="mt-4 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm leading-6 text-blue-300">
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
                <div className="mt-4 rounded-xl bg-[#181B22] border border-white/5 p-4 text-sm text-slate-300">
                  <span className="font-bold text-white">Địa chỉ giao hàng: </span>
                  {selectedOrder.shipping_address}
                </div>
              )}

              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                <table className="min-w-full divide-y divide-white/5">
                  <thead className="bg-[#181B22]">
                    <tr>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Giá bán</TableHead>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {selectedOrder.items.map((item) => {
                      const isRefunded = Boolean(item.is_refunded)
                      return (
                        <tr key={item._id ?? item.item_id}>
                          <TableCell className="font-semibold text-white">
                            {item.product_name}
                            {isRefunded && (
                              <span className="ml-2 rounded-full bg-purple-500/10 border border-purple-500/25 px-2 py-1 text-[11px] font-black text-purple-400">
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
            </section>
          </div>
        )}

        {message && (
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300">
            {error}
          </p>
        )}

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-bold text-amber-300">Lưu ý COD</h2>
              <p className="mt-2 text-sm leading-6 text-amber-400">
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
    <div className="rounded-2xl border border-white/10 bg-[#2A2F3B] p-5 shadow-sm">
      {icon}
      <p className="mt-4 text-sm font-semibold text-[#909AAB]">{label}</p>
      <p className="mt-1 break-words text-xl font-black text-white">{value}</p>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl bg-[#181B22] border border-white/5 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#909AAB]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-white">{value}</p>
    </div>
  )
}

function TableHead({ children }: { children: ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-300">
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
  return <td className={`px-6 py-4 text-sm text-slate-300 ${className}`}>{children}</td>
}
