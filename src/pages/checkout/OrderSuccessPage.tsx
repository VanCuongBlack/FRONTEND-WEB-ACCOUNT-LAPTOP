import { CheckCircle2, Home, ReceiptText, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

function formatPrice(price: number) {
  return `${price.toLocaleString('vi-VN')}đ`
}

export default function OrderSuccessPage() {
  const navigate = useNavigate()

  const order = {
    code: '#DH12345',
    total: 475000,
    paymentMethod: 'VNPay QR',
    status: 'Đã thanh toán',
    createdAt: '03/06/2026 14:30',
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] font-['Inter',sans-serif] text-black">
      <Header />

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 items-center justify-center px-4 py-10">
        <section className="w-full max-w-[760px] rounded-2xl bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#27AE60]/10">
            <CheckCircle2 size={48} className="text-[#27AE60]" />
          </div>

          <h1 className="mt-6 text-[28px] font-bold text-black">
            Thanh toán thành công
          </h1>

          <p className="mx-auto mt-3 max-w-[520px] text-sm leading-6 text-gray-500">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và đang
            được hệ thống xử lý.
          </p>

          <div className="mt-8 rounded-2xl bg-[#F8FAFC] p-5 text-left">
            <h2 className="mb-4 text-lg font-bold text-black">
              Thông tin đơn hàng
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Mã đơn hàng</span>
                <span className="font-semibold text-black">{order.code}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Ngày đặt</span>
                <span className="font-semibold text-black">
                  {order.createdAt}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Phương thức thanh toán</span>
                <span className="font-semibold text-black">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Trạng thái</span>
                <span className="rounded-full bg-[#27AE60]/10 px-3 py-1 text-xs font-semibold text-[#27AE60]">
                  {order.status}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-gray-700">
                    Tổng thanh toán
                  </span>
                  <span className="text-xl font-bold text-[#27AE60]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex h-[48px] items-center justify-center gap-2 rounded-xl border border-[#3783EC] text-sm font-semibold text-[#3783EC] transition-all hover:bg-[#3783EC] hover:text-white"
            >
              <ReceiptText size={18} />
              Xem đơn hàng
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex h-[48px] items-center justify-center gap-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100"
            >
              <Home size={18} />
              Về trang chủ
            </button>

            <button
              type="button"
              onClick={() => navigate('/laptops')}
              className="flex h-[48px] items-center justify-center gap-2 rounded-xl bg-[#3783EC] text-sm font-semibold text-white transition-all hover:bg-[#206ed6]"
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