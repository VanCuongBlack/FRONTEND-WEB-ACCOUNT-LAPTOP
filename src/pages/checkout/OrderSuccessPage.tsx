import { CheckCircle2, Clock3, Home, ReceiptText, ShoppingBag } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { Order } from '@/services/order.service'
import type { Payment } from '@/services/payment.service'

interface SuccessState {
  order?: Order
  payment?: Payment
}

function formatPrice(price?: number) {
  return `${(price ?? 0).toLocaleString('vi-VN')}đ`
}

function formatDate(value?: string) {
  if (!value) return new Date().toLocaleString('vi-VN')
  return new Date(value).toLocaleString('vi-VN')
}

function paymentLabel(method?: string) {
  if (method === 'cod') return 'Thanh toán khi nhận hàng'
  if (method === 'bank_transfer') return 'Chuyển khoản ngân hàng'
  return method || 'Chưa xác định'
}

function statusText(order?: Order, payment?: Payment) {
  if (order?.payment_method === 'cod') {
    if (order.status === 'completed') return 'COD đã xác nhận'
    return 'Chờ nhân viên xác nhận COD'
  }

  if (payment?.status === 'paid' || order?.status === 'confirmed' || order?.status === 'completed') {
    return 'Đã thanh toán'
  }

  if (order?.status === 'cancelled') return 'Đã hủy'
  if (order?.status === 'failed') return 'Thanh toán thất bại'
  return 'Chờ chuyển khoản'
}

export default function OrderSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { order, payment } = (location.state ?? {}) as SuccessState

  const isCOD = order?.payment_method === 'cod'
  const isPaid = payment?.status === 'paid' || order?.status === 'confirmed' || order?.status === 'completed'
  const title = isCOD ? 'Đặt hàng thành công' : isPaid ? 'Thanh toán thành công' : 'Đã tạo đơn hàng'
  const description = isCOD
    ? 'Đơn hàng COD đã được ghi nhận. Nhân viên sẽ gọi xác nhận trước khi giao hàng.'
    : isPaid
      ? 'Cảm ơn bạn đã mua hàng. Đơn hàng đã được xác nhận thanh toán.'
      : 'Đơn hàng đã được tạo. Vui lòng chuyển khoản đúng nội dung thanh toán để hệ thống xác nhận.'

  return (
    <div className="flex min-h-screen flex-col bg-[#09051f] font-sans text-white">
      <Header />

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 items-center justify-center px-4 py-10">
        <section className="w-full max-w-[760px] rounded-[22px] border border-[#3d63ff]/20 bg-[#211b42] p-6 text-center shadow-[0_18px_45px_rgba(0,0,0,0.28)] sm:p-10">
          <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${isPaid || isCOD ? 'bg-emerald-500/12' : 'bg-amber-400/12'}`}>
            {isPaid || isCOD ? (
              <CheckCircle2 size={48} className="text-emerald-400" />
            ) : (
              <Clock3 size={48} className="text-amber-300" />
            )}
          </div>

          <h1 className="mt-6 text-[28px] font-black text-white">{title}</h1>

          <p className="mx-auto mt-3 max-w-[540px] text-sm leading-6 text-[#c8c1e8]">
            {description}
          </p>

          <div className="mt-8 rounded-2xl bg-[#151033] p-5 text-left">
            <h2 className="mb-4 text-lg font-black text-white">Thông tin đơn hàng</h2>

            <div className="space-y-3 text-sm">
              <InfoRow label="Mã đơn hàng" value={order?._id ? `#${order._id.slice(-8).toUpperCase()}` : 'Đơn vừa tạo'} />
              <InfoRow label="Ngày đặt" value={formatDate(order?.createdAt)} />
              <InfoRow label="Phương thức thanh toán" value={paymentLabel(order?.payment_method)} />

              <div className="flex items-center justify-between gap-4">
                <span className="text-[#b9b4d7]">Trạng thái</span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${
                  isPaid || isCOD ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-400/15 text-amber-200'
                }`}>
                  {statusText(order, payment)}
                </span>
              </div>

              <div className="border-t border-[#3d63ff]/20 pt-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-[#d9d6ee]">Tổng thanh toán</span>
                  <span className="text-xl font-black text-[#ffd84d]">
                    {formatPrice(order?.total_amount ?? payment?.amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => navigate('/profile/history')}
              className="flex h-[48px] items-center justify-center gap-2 rounded-xl bg-[#3783EC] text-sm font-bold text-white transition-all hover:bg-[#206ed6]"
            >
              <ReceiptText size={18} />
              Xem đơn hàng
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex h-[48px] items-center justify-center gap-2 rounded-xl border border-[#5a5480] text-sm font-bold text-[#d9d6ee] transition-all hover:bg-[#151033] hover:text-white"
            >
              <Home size={18} />
              Về trang chủ
            </button>

            <button
              type="button"
              onClick={() => navigate('/laptops')}
              className="flex h-[48px] items-center justify-center gap-2 rounded-xl bg-[#3783EC] text-sm font-bold text-white transition-all hover:bg-[#206ed6]"
            >
              <ShoppingBag size={18} />
              Tiếp tục mua
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[#b9b4d7]">{label}</span>
      <span className="text-right font-semibold text-white">{value}</span>
    </div>
  )
}
