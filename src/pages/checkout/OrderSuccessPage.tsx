import { useEffect, useState } from 'react'
import { CheckCircle2, Clock3, Copy, Home, ReceiptText, ShoppingBag } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getOrderById, type Order } from '@/services/order.service'
import { getPaymentByOrder, type Payment } from '@/services/payment.service'
import { toast } from 'sonner'

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

const VIET_QR_BANK_CODES: Record<string, string> = {
  mb: 'MB',
  mbbank: 'MB',
  'mb bank': 'MB',
  vcb: 'VCB',
  vietcombank: 'VCB',
  tcb: 'TCB',
  techcombank: 'TCB',
  bidv: 'BIDV',
  vietinbank: 'ICB',
  icb: 'ICB',
  agribank: 'VBA',
  acb: 'ACB',
}

function normalizeBankCode(bankName: string) {
  const normalized = bankName.trim().toLowerCase().replace(/\s+/g, ' ')
  return VIET_QR_BANK_CODES[normalized] ?? VIET_QR_BANK_CODES[normalized.replace(/\s/g, '')] ?? bankName.trim()
}

function getBankValue(
  payment: Payment | undefined,
  key: 'bank_name' | 'account_number' | 'account_name' | 'amount' | 'transfer_content' | 'expires_at'
) {
  if (!payment) return undefined
  if (key === 'account_number') return payment.bank_info?.account_number ?? payment.bank_account_number
  if (key === 'account_name') return payment.bank_info?.account_name ?? payment.bank_account_name
  if (key === 'bank_name') return payment.bank_info?.bank_name ?? payment.bank_name
  if (key === 'amount') return payment.bank_info?.amount ?? payment.amount
  if (key === 'transfer_content') return payment.bank_info?.transfer_content ?? payment.transfer_content
  if (key === 'expires_at') return payment.bank_info?.expires_at
}

function buildVietQrUrl(payment?: Payment) {
  const providedQrUrl = payment?.bank_info?.qr_url ?? payment?.bank_info?.qrUrl ?? payment?.qr_url ?? payment?.qrUrl
  if (providedQrUrl) return providedQrUrl

  const bankCode = normalizeBankCode(String(getBankValue(payment, 'bank_name') ?? ''))
  const accountNumber = String(getBankValue(payment, 'account_number') ?? '').trim()
  const amount = Number(getBankValue(payment, 'amount') ?? 0)
  const transferContent = String(getBankValue(payment, 'transfer_content') ?? '').trim()
  const accountName = String(getBankValue(payment, 'account_name') ?? '').trim()

  if (!bankCode || !accountNumber || !amount || !transferContent) return ''

  const params = new URLSearchParams({
    amount: String(amount),
    addInfo: transferContent,
    accountName,
  })

  return `https://img.vietqr.io/image/${encodeURIComponent(bankCode)}-${encodeURIComponent(accountNumber)}-compact2.png?${params.toString()}`
}

function copyText(value?: unknown) {
  const text = String(value ?? '').trim()
  if (!text) return
  navigator.clipboard.writeText(text)
  toast.success('Đã sao chép')
}

export default function OrderSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { order, payment: statePayment } = (location.state ?? {}) as SuccessState
  const [currentOrder, setCurrentOrder] = useState<Order | undefined>(order)
  const [payment, setPayment] = useState<Payment | undefined>(statePayment)

  useEffect(() => {
    setCurrentOrder(order)
  }, [order])

  useEffect(() => {
    if (!currentOrder?._id || currentOrder.payment_method !== 'bank_transfer') return

    let cancelled = false

    const refreshPaymentStatus = async () => {
      try {
        const [paymentResult, orderResult] = await Promise.allSettled([
          getPaymentByOrder(currentOrder._id),
          getOrderById(currentOrder._id),
        ])

        if (cancelled) return

        if (paymentResult.status === 'fulfilled') {
          setPayment(paymentResult.value.data.data)
        }

        if (orderResult.status === 'fulfilled' && orderResult.value.data.data) {
          setCurrentOrder(orderResult.value.data.data)
        }
      } catch {
        // Giữ nguyên dữ liệu đang có để khách vẫn thấy QR và thông tin chuyển khoản.
      }
    }

    refreshPaymentStatus()
    const intervalId = window.setInterval(refreshPaymentStatus, 5000)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [currentOrder?._id, currentOrder?.payment_method])

  const isCOD = currentOrder?.payment_method === 'cod'
  const isPaid = payment?.status === 'paid' || currentOrder?.status === 'confirmed' || currentOrder?.status === 'completed'
  const isBankTransfer = currentOrder?.payment_method === 'bank_transfer'
  const qrUrl = buildVietQrUrl(payment)
  const shouldShowQr = isBankTransfer && !isPaid
  const title = isCOD ? 'Đặt hàng thành công' : isPaid ? 'Thanh toán thành công' : 'Đã tạo đơn hàng'
  const description = isCOD
    ? 'Đơn hàng COD đã được ghi nhận. Nhân viên sẽ gọi xác nhận trước khi giao hàng.'
    : isPaid
      ? 'Cảm ơn bạn đã mua hàng. Đơn hàng đã được xác nhận thanh toán.'
      : 'Đơn hàng đã được tạo. Vui lòng chuyển khoản đúng nội dung thanh toán để hệ thống xác nhận.'

  return (
    <div className="flex min-h-screen flex-col bg-[#050914] font-sans text-white">
      <Header />

      <main className="flex w-full max-w-none flex-1 items-center justify-center px-3 py-10 sm:px-5 lg:px-8">
        <section className={`w-full rounded-[22px] border border-[#1e3a62] bg-[#0a1628] p-6 text-center shadow-[0_18px_45px_rgba(0,0,0,0.28)] sm:p-8 ${shouldShowQr ? 'max-w-[980px]' : 'max-w-[760px]'}`}>
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

          <div className={`mt-8 grid gap-5 ${shouldShowQr ? 'lg:grid-cols-[340px_1fr] lg:items-stretch' : ''}`}>
            {shouldShowQr && (
              <div className="rounded-2xl border border-[#1e3a62] bg-[#071120] p-5 text-left">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-black text-white">Quét mã QR để thanh toán</h2>
                    <p className="mt-2 text-sm leading-6 text-[#c8c1e8]">
                      FE sẽ tự kiểm tra trạng thái từ BE. Khi SePay xác nhận, màn hình sẽ đổi sang đã thanh toán.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-3">
                    {qrUrl ? (
                      <img src={qrUrl} alt="QR chuyển khoản" className="mx-auto w-full max-w-[260px]" />
                    ) : (
                      <div className="flex h-[260px] items-center justify-center rounded-xl bg-slate-100 px-4 text-center text-sm font-bold text-slate-500">
                        Chưa có đủ thông tin QR
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            <div className="rounded-2xl bg-[#071120] p-5 text-left">
              <h2 className="mb-4 text-lg font-black text-white">Thông tin đơn hàng</h2>

              <div className="space-y-3 text-sm">
                <InfoRow label="Mã đơn hàng" value={currentOrder?._id ? `#${currentOrder._id.slice(-8).toUpperCase()}` : 'Đơn vừa tạo'} />
                <InfoRow label="Ngày đặt" value={formatDate(currentOrder?.createdAt)} />
                <InfoRow label="Phương thức thanh toán" value={paymentLabel(currentOrder?.payment_method)} />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#b9b4d7]">Trạng thái</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${
                    isPaid || isCOD ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-400/15 text-amber-200'
                  }`}>
                    {statusText(currentOrder, payment)}
                  </span>
                </div>

                <div className="border-t border-[#1e3a62] pt-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-[#d9d6ee]">Tổng thanh toán</span>
                    <span className="text-xl font-black text-[#ffd84d]">
                      {formatPrice(currentOrder?.total_amount ?? payment?.amount)}
                    </span>
                  </div>
                </div>

                {shouldShowQr && (
                  <div className="space-y-3 border-t border-[#1e3a62] pt-3">
                    <BankRow label="Ngân hàng" value={getBankValue(payment, 'bank_name')} />
                    <BankRow label="Số tài khoản" value={getBankValue(payment, 'account_number')} copy />
                    <BankRow label="Chủ tài khoản" value={getBankValue(payment, 'account_name')} />
                    <BankRow label="Nội dung chuyển khoản" value={getBankValue(payment, 'transfer_content')} copy />
                    <BankRow label="Số tiền cần thanh toán" value={formatPrice(Number(getBankValue(payment, 'amount') ?? currentOrder?.total_amount ?? 0))} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => navigate('/profile/history')}
              className="flex h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#36b8f2] via-[#2668ff] to-[#8b3df5] text-sm font-bold text-white transition-all hover:brightness-110"
            >
              <ReceiptText size={18} />
              Xem đơn hàng
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex h-[48px] items-center justify-center gap-2 rounded-xl border border-[#1e3a62] text-sm font-bold text-[#d9d6ee] transition-all hover:bg-[#071120] hover:text-white"
            >
              <Home size={18} />
              Về trang chủ
            </button>

            <button
              type="button"
              onClick={() => navigate('/laptops')}
              className="flex h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#36b8f2] via-[#2668ff] to-[#8b3df5] text-sm font-bold text-white transition-all hover:brightness-110"
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

function BankRow({ label, value, copy }: { label: string; value: unknown; copy?: boolean }) {
  const display = String(value ?? '-')

  return (
    <div className="flex flex-col gap-1 rounded-xl bg-[#071120] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-[#b9b4d7]">{label}</span>
      <button
        type="button"
        disabled={!copy || !value}
        onClick={() => copyText(value)}
        className="inline-flex items-center gap-2 text-left font-black text-white disabled:cursor-default"
      >
        <span className="break-all">{display}</span>
        {copy && value ? <Copy size={15} className="shrink-0 text-[#74b7ff]" /> : null}
      </button>
    </div>
  )
}
