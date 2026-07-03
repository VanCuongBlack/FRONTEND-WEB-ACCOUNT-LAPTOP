import { useEffect, useState } from 'react'
import { CheckCircle2, Copy, Home, ReceiptText, ShoppingBag } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { Order } from '@/services/order.service'
import { getPaymentByOrder, type Payment } from '@/services/payment.service'

type PaymentWithQr = Payment & {
  qr_url?: string
  qrUrl?: string
  paid_at?: string
  bank_info?: Payment['bank_info'] & {
    qr_url?: string
    qrUrl?: string
  }
}

const VIET_QR_BANK_CODES: Record<string, string> = {
  mb: 'MB',
  mbbank: 'MB',
  'mb bank': 'MB',
  mbs: 'MB',
  vietcombank: 'VCB',
  vcb: 'VCB',
  techcombank: 'TCB',
  tcb: 'TCB',
  bidv: 'BIDV',
  vietinbank: 'ICB',
  icb: 'ICB',
  agribank: 'VBA',
  acb: 'ACB',
  sacombank: 'STB',
  stb: 'STB',
  vpbank: 'VPB',
  vpb: 'VPB',
}

function formatPrice(price: number) {
  return `${price.toLocaleString('vi-VN')}đ`
}

function getOrderCode(order?: Order) {
  return order?._id ? `DH${order._id.slice(-8).toUpperCase()}` : 'DH'
}

function normalizeBankCode(bankName: string) {
  const normalized = bankName.trim().toLowerCase().replace(/\s+/g, ' ')
  return VIET_QR_BANK_CODES[normalized] ?? VIET_QR_BANK_CODES[normalized.replace(/\s/g, '')] ?? bankName.trim()
}

function getBankValue(
  payment: PaymentWithQr | undefined,
  key:
    | 'bank_name'
    | 'account_number'
    | 'account_name'
    | 'amount'
    | 'transfer_content'
    | 'expires_at'
) {
  if (!payment) return undefined
  if (key === 'account_number') {
    return payment.bank_info?.account_number ?? payment.bank_account_number
  }
  if (key === 'account_name') {
    return payment.bank_info?.account_name ?? payment.bank_account_name
  }
  if (key === 'bank_name') return payment.bank_info?.bank_name ?? payment.bank_name
  if (key === 'amount') return payment.bank_info?.amount ?? payment.amount
  if (key === 'transfer_content') {
    return payment.bank_info?.transfer_content ?? payment.transfer_content
  }
  if (key === 'expires_at') return payment.bank_info?.expires_at
}

function getPaymentQrUrl(payment?: PaymentWithQr) {
  return payment?.bank_info?.qr_url ?? payment?.bank_info?.qrUrl ?? payment?.qr_url ?? payment?.qrUrl ?? ''
}

function buildVietQrUrl(payment?: PaymentWithQr) {
  const providedQrUrl = getPaymentQrUrl(payment)
  if (providedQrUrl) return providedQrUrl

  const bankName = String(getBankValue(payment, 'bank_name') ?? '').trim()
  const bankCode = normalizeBankCode(bankName)
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

function InfoRow({
  label,
  value,
  strong = false,
}: {
  label: string
  value?: string | number
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[#b9b4d7]">{label}</span>
      <span className={strong ? 'font-bold text-white' : 'font-semibold text-white'}>
        {value || '-'}
      </span>
    </div>
  )
}

export default function OrderSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { order?: Order; payment?: PaymentWithQr } | null
  const createdOrder = state?.order
  const [payment, setPayment] = useState<PaymentWithQr | undefined>(state?.payment)
  const [hasShownPaidToast, setHasShownPaidToast] = useState(false)

  const paymentMethod =
    createdOrder?.payment_method ?? payment?.method ?? payment?.payment_method
  const isBankTransfer = paymentMethod === 'bank_transfer'
  const isPaid = payment?.status === 'paid' || createdOrder?.status === 'completed' || createdOrder?.status === 'confirmed'
  const orderCode = getOrderCode(createdOrder)
  const officialTotal =
    createdOrder?.total_amount ??
    payment?.amount ??
    Number(getBankValue(payment, 'amount') ?? 0)
  const qrUrl = buildVietQrUrl(payment)
  const transferContent = String(getBankValue(payment, 'transfer_content') ?? orderCode)
  const expiresAt = getBankValue(payment, 'expires_at')

  useEffect(() => {
    if (!isBankTransfer || !createdOrder?._id || isPaid) return

    let cancelled = false

    const fetchPaymentStatus = async () => {
      try {
        const response = await getPaymentByOrder(createdOrder._id)
        const nextPayment = response.data?.data as PaymentWithQr | undefined
        if (!cancelled && nextPayment) {
          setPayment(nextPayment)
        }
      } catch (error) {
        console.error('Fetch payment status error:', error)
      }
    }

    fetchPaymentStatus()
    const intervalId = window.setInterval(fetchPaymentStatus, 5000)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [createdOrder?._id, isBankTransfer, isPaid])

  useEffect(() => {
    if (isPaid && !hasShownPaidToast) {
      toast.success('Thanh toán đã được xác nhận.')
      setHasShownPaidToast(true)
    }
  }, [hasShownPaidToast, isPaid])

  const copyText = async (value?: string | number) => {
    if (!value) return
    await navigator.clipboard.writeText(String(value))
    toast.success('Đã sao chép')
  }

  const order = {
    code: orderCode,
    total: officialTotal,
    paymentMethod: isBankTransfer
      ? 'Chuyển khoản ngân hàng'
      : 'Thanh toán khi nhận hàng',
    status: isPaid ? 'Đã thanh toán' : 'Chờ xử lý',
    createdAt: createdOrder?.createdAt
      ? new Date(createdOrder.createdAt).toLocaleString('vi-VN')
      : new Date().toLocaleString('vi-VN'),
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#09051f] font-sans text-white">
      <Header />

      <main className="mx-auto flex w-full max-w-[1840px] flex-1 items-center justify-center px-4 py-10">
        <section className="w-full max-w-[980px] rounded-[22px] bg-[#211b42] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#27AE60]/10">
              <CheckCircle2 size={48} className="text-[#27AE60]" />
            </div>
            <h1 className="mt-6 text-[28px] font-bold text-white">
              {isPaid ? 'Thanh toán thành công' : 'Tạo đơn hàng thành công'}
            </h1>
            <p className="mx-auto mt-3 max-w-[620px] text-sm leading-6 text-[#b9b4d7]">
              {isPaid
                ? 'Hệ thống đã ghi nhận thanh toán từ SePay. Đơn hàng của bạn đang được xử lý.'
                : 'Đơn hàng đã được ghi nhận. Nếu chọn chuyển khoản, vui lòng thanh toán đúng số tiền và nội dung bên dưới để hệ thống đối soát chính xác.'}
            </p>
          </div>

          <div
            className={`mt-8 grid grid-cols-1 gap-5 ${
              isBankTransfer ? 'lg:grid-cols-[360px_1fr]' : ''
            }`}
          >
            {isBankTransfer && (
              <div className="rounded-2xl border border-[#3d63ff]/25 bg-[#151033] p-5 text-center">
                <h2 className="text-lg font-bold text-white">
                  {isPaid ? 'Thanh toán đã xác nhận' : 'QR chuyển khoản'}
                </h2>
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="QR chuyển khoản"
                    className={`mx-auto mt-4 w-full max-w-[280px] rounded-2xl bg-white p-3 ${isPaid ? 'opacity-60' : ''}`}
                  />
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-[#3d63ff]/35 p-8 text-sm text-[#b9b4d7]">
                    Chưa đủ thông tin ngân hàng để tạo QR. Kiểm tra BANK_NAME,
                    BANK_ACCOUNT_NUMBER và BANK_ACCOUNT_NAME ở backend, sau đó restart BE.
                  </div>
                )}
                <p className="mt-4 text-xs leading-5 text-[#8d86b6]">
                  {isPaid
                    ? 'SePay đã báo thanh toán thành công về hệ thống.'
                    : 'Trang này tự kiểm tra trạng thái thanh toán mỗi 5 giây. Khi SePay báo về BE, trạng thái sẽ tự cập nhật.'}
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-[#3d63ff]/25 bg-[#151033] p-5 text-left">
              <h2 className="mb-4 text-lg font-bold text-white">Thông tin đơn hàng</h2>
              <div className="space-y-3 text-sm">
                <InfoRow label="Mã đơn hàng" value={order.code} strong />
                <InfoRow label="Ngày đặt" value={order.createdAt} />
                <InfoRow label="Phương thức thanh toán" value={order.paymentMethod} />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#b9b4d7]">Trạng thái</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isPaid
                        ? 'bg-[#27AE60]/10 text-[#7ee2a8]'
                        : 'bg-amber-400/10 text-amber-200'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {isBankTransfer && (
                  <>
                    <div className="border-t border-[#3d63ff]/20 pt-3" />
                    <InfoRow
                      label="Ngân hàng"
                      value={String(getBankValue(payment, 'bank_name') ?? '')}
                    />
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#b9b4d7]">Số tài khoản</span>
                      <button
                        type="button"
                        onClick={() => copyText(getBankValue(payment, 'account_number'))}
                        className="inline-flex items-center gap-2 font-semibold text-white hover:text-[#7db3ff]"
                      >
                        {String(getBankValue(payment, 'account_number') ?? '-')}
                        <Copy size={14} />
                      </button>
                    </div>
                    <InfoRow
                      label="Tên tài khoản"
                      value={String(getBankValue(payment, 'account_name') ?? '')}
                    />
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#b9b4d7]">Nội dung CK</span>
                      <button
                        type="button"
                        onClick={() => copyText(transferContent)}
                        className="inline-flex items-center gap-2 font-bold text-[#7db3ff] hover:text-white"
                      >
                        {transferContent}
                        <Copy size={14} />
                      </button>
                    </div>
                    {expiresAt && !isPaid && (
                      <InfoRow
                        label="Hạn thanh toán"
                        value={new Date(String(expiresAt)).toLocaleString('vi-VN')}
                      />
                    )}
                    {payment?.paid_at && (
                      <InfoRow
                        label="Thời gian thanh toán"
                        value={new Date(payment.paid_at).toLocaleString('vi-VN')}
                      />
                    )}
                  </>
                )}

                <div className="border-t border-[#3d63ff]/20 pt-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-[#d9d6ee]">
                      Tổng thanh toán
                    </span>
                    <span className="text-xl font-bold text-[#7ee2a8]">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex h-[48px] items-center justify-center gap-2 rounded-xl border border-[#3783EC] text-sm font-semibold text-[#7db3ff] transition-all hover:bg-[#3783EC] hover:text-white"
            >
              <ReceiptText size={18} />
              Xem đơn hàng
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex h-[48px] items-center justify-center gap-2 rounded-xl border border-[#3d63ff]/30 text-sm font-semibold text-[#d9d6ee] transition-all hover:bg-[#0d0826]"
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
