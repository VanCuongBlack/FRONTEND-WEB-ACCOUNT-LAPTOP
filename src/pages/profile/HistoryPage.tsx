import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Eye, Key, Laptop, Search, X } from 'lucide-react'
import { useOrder } from '@/hooks/useOrder'
import type { Order } from '@/services/order.service'

const statusLabels: Record<string, string> = {
  pending: 'Chờ thanh toán',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  failed: 'Thất bại',
}

const paymentLabels: Record<string, string> = {
  cod: 'Thanh toán khi nhận hàng',
  bank_transfer: 'Chuyển khoản ngân hàng',
}

function formatPrice(value?: number) {
  return `${(value ?? 0).toLocaleString('vi-VN')}đ`
}

function formatDate(value?: string) {
  if (!value) return 'Chưa có ngày'
  return new Date(value).toLocaleString('vi-VN')
}

function getFirstItem(order: Order) {
  return order.items?.[0]
}

function getOrderTitle(order: Order) {
  const item = getFirstItem(order)
  return item?.product_name || item?.product?.name || `Đơn hàng #${order._id}`
}

function getOrderType(order: Order) {
  return getFirstItem(order)?.product_type ?? 'physical'
}

function getStatusClass(status: string) {
  if (status === 'confirmed' || status === 'completed') return 'bg-emerald-400/15 text-emerald-200'
  if (status === 'cancelled' || status === 'failed') return 'bg-rose-400/15 text-rose-200'
  return 'bg-amber-400/15 text-amber-100'
}

export default function HistoryPage() {
  const navigate = useNavigate()
  const { orders, fetchOrders, isLoading } = useOrder()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (!normalizedQuery) return orders

    return orders.filter((order) => {
      const itemNames = order.items
        .map((item) => item.product_name || item.product?.name || '')
        .join(' ')
        .toLowerCase()

      return (
        order._id.toLowerCase().includes(normalizedQuery) ||
        order.status.toLowerCase().includes(normalizedQuery) ||
        itemNames.includes(normalizedQuery)
      )
    })
  }, [orders, searchQuery])

  const openRouteDetail = (order: Order) => {
    const type = getOrderType(order)
    navigate(
      type === 'digital'
        ? `/profile/history/account/${order._id}`
        : `/profile/history/laptop/${order._id}`
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#07031a] px-4 py-6 font-sans text-white md:px-8">
      <div className="mx-auto w-full max-w-[1560px] space-y-6">
        <div className="rounded-2xl border border-[#3d63ff]/25 bg-[#151036] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10"
                aria-label="Quay lại trang cá nhân"
              >
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#6da2ff]">
                  Tài khoản của tôi
                </p>
                <h1 className="text-2xl font-black md:text-4xl">Lịch sử đơn hàng</h1>
              </div>
            </div>

            <div className="relative w-full md:w-[440px]">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9d95c9]" />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên sản phẩm, trạng thái..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#302a5c] pl-12 pr-4 text-sm text-white placeholder:text-[#9d95c9] outline-none focus:border-[#3d63ff]"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-[#151036] p-8 text-center text-[#c9c3ef]">
            Đang tải lịch sử đơn hàng...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#3d63ff]/35 bg-[#151036] p-10 text-center text-[#c9c3ef]">
            Không có đơn hàng phù hợp.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredOrders.map((order) => {
              const type = getOrderType(order)
              const title = getOrderTitle(order)

              return (
                <article
                  key={order._id}
                  className="rounded-2xl border border-[#3d63ff]/25 bg-[#151036] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition hover:border-[#3d63ff]/60"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <span className="break-all font-mono text-xs font-semibold text-[#c9c3ef]">
                      #{order._id}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(order.status)}`}>
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-col gap-4 sm:flex-row">
                    <div className="flex h-24 w-full shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#221b46] text-[#6da2ff] sm:w-32">
                      {type === 'digital' ? <Key size={34} /> : <Laptop size={38} />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-xl font-black text-white">{title}</h3>
                      <p className="mt-2 text-sm text-[#c9c3ef]">
                        {(order.items?.length ?? 0).toLocaleString('vi-VN')} sản phẩm ·{' '}
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="mt-1 text-sm text-[#9d95c9]">
                        {paymentLabels[order.payment_method ?? ''] ?? order.payment_method ?? 'Chưa có thanh toán'}
                      </p>
                      <p className="mt-3 text-2xl font-black text-[#ffd84d]">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
                    >
                      <Eye size={16} />
                      Xem nhanh
                    </button>

                    <button
                      type="button"
                      onClick={() => openRouteDetail(order)}
                      className="rounded-xl bg-[#3d63ff] px-4 py-2 text-sm font-bold text-white hover:bg-[#6da2ff]"
                    >
                      Chi tiết
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm md:items-center md:p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-[#3d63ff]/25 bg-[#151036] shadow-2xl md:rounded-2xl">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#211b42] p-5">
              <div>
                <h2 className="text-lg font-black text-white">Chi tiết đơn hàng</h2>
                <p className="mt-1 break-all text-xs text-[#9d95c9]">#{selectedOrder._id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-[#c9c3ef] hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {selectedOrder.items.map((item) => (
                <div key={item._id ?? item.item_id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-bold text-white">
                    {item.product_name || item.product?.name || 'Sản phẩm'}
                  </p>
                  <p className="mt-1 text-sm text-[#c9c3ef]">
                    Loại: {item.product_type === 'digital' ? 'Tài khoản số' : 'Laptop / PC'}
                  </p>
                  <p className="mt-2 font-black text-[#ffd84d]">
                    {formatPrice(item.sale_price ?? item.price ?? item.product?.base_price)}
                  </p>
                </div>
              ))}

              <div className="rounded-xl border border-white/10 bg-[#221b46] p-4 text-sm text-[#d8d3ff]">
                <p>
                  Phương thức thanh toán:{' '}
                  {paymentLabels[selectedOrder.payment_method ?? ''] ?? selectedOrder.payment_method ?? 'Chưa có'}
                </p>
                <p>Địa chỉ giao hàng: {selectedOrder.shipping_address || 'Không áp dụng'}</p>
                <p>Ghi chú: {selectedOrder.note ?? 'Không có'}</p>
                <p className="mt-3 text-lg font-black text-[#ffd84d]">
                  Tổng thanh toán: {formatPrice(selectedOrder.total_amount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
