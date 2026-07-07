import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  Copy,
  CreditCard,
  Key,
  Laptop,
  MapPin,
  ReceiptText,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { useOrder } from '@/hooks/useOrder'
import { cancelOrder, type Order, type OrderItem } from '@/services/order.service'
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

function formatPrice(value?: number) {
  return `${(value ?? 0).toLocaleString('vi-VN')}đ`
}

function formatDate(value?: string) {
  if (!value) return 'Chưa có ngày'
  return new Date(value).toLocaleString('vi-VN')
}

function getItemName(item?: OrderItem) {
  return item?.product_name || item?.product?.name || 'Sản phẩm'
}

function getItemPrice(item?: OrderItem) {
  return item?.sale_price ?? item?.price ?? item?.product?.base_price ?? 0
}

function getSupportType(order?: Order) {
  const firstItem = order?.items?.[0]
  return firstItem?.product_type === 'digital' ? 'account' : 'laptop'
}

function getStatusClass(status?: string) {
  if (status === 'confirmed' || status === 'completed') return 'bg-emerald-400/15 text-emerald-200'
  if (status === 'cancelled' || status === 'failed') return 'bg-rose-400/15 text-rose-200'
  return 'bg-amber-400/15 text-amber-100'
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
  if (key === 'account_number') return payment.bank_info?.account_number ?? payment.bank_account_number
  if (key === 'account_name') return payment.bank_info?.account_name ?? payment.bank_account_name
  if (key === 'bank_name') return payment.bank_info?.bank_name ?? payment.bank_name
  if (key === 'amount') return payment.bank_info?.amount ?? payment.amount
  if (key === 'transfer_content') return payment.bank_info?.transfer_content ?? payment.transfer_content
  if (key === 'expires_at') return payment.bank_info?.expires_at
}

function buildVietQrUrl(payment?: PaymentWithQr) {
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

export default function LaptopOrderDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { currentOrder, getOrder, isLoading } = useOrder()
  const [payment, setPayment] = useState<PaymentWithQr | undefined>()
  const [cancelReason, setCancelReason] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      getOrder(id)
    }
  }, [id])

  useEffect(() => {
    if (!id) return

    let cancelled = false

    const fetchPayment = async () => {
      try {
        const response = await getPaymentByOrder(id)
        if (!cancelled) {
          setPayment(response.data?.data as PaymentWithQr | undefined)
        }
      } catch (err) {
        console.error('Fetch payment by order error:', err)
      }
    }

    fetchPayment()
    const intervalId = window.setInterval(fetchPayment, 5000)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [id])

  const order = currentOrder?._id === id ? currentOrder : null
  const firstItem = order?.items?.[0]
  const isDigitalOrder = firstItem?.product_type === 'digital'
  const isBankTransfer = order?.payment_method === 'bank_transfer' || payment?.method === 'bank_transfer'
  const isPaid = payment?.status === 'paid' || order?.status === 'confirmed' || order?.status === 'completed'
  const canCancel = order?.status === 'pending' && !isPaid
  const qrUrl = buildVietQrUrl(payment)
  const canRequestSupport = useMemo(
    () => Boolean(order && ['confirmed', 'completed'].includes(order.status) && firstItem?._id),
    [order, firstItem?._id]
  )

  const copyText = async (value?: string | number) => {
    if (!value) return
    await navigator.clipboard.writeText(String(value))
    toast.success('Đã sao chép')
  }

  const handleSupport = () => {
    if (!order || !firstItem?._id) return

    navigate(`/profile/history/support/${getSupportType(order)}/${order._id}`, {
      state: {
        orderId: order._id,
        orderItemId: firstItem._id,
        productName: getItemName(firstItem),
        productType: firstItem.product_type,
      },
    })
  }

  const handleCancelOrder = async () => {
    if (!order) return
    setIsCancelling(true)
    setError('')
    try {
      await cancelOrder(order._id, cancelReason.trim() || undefined)
      await getOrder(order._id)
      setCancelReason('')
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể hủy đơn hàng.')
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading && !order) {
    return (
      <div className="min-h-screen bg-[#07031a] px-4 py-8 text-white">
        <div className="mx-auto max-w-[980px] rounded-2xl border border-[#3d63ff]/25 bg-[#151036] p-8">
          Đang tải chi tiết đơn hàng...
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#07031a] px-4 py-8 text-white">
        <div className="mx-auto max-w-[980px] rounded-2xl border border-[#3d63ff]/25 bg-[#151036] p-8">
          <button
            type="button"
            onClick={() => navigate('/profile/history')}
            className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white hover:bg-white/10"
          >
            <ChevronLeft size={18} />
            Quay lại
          </button>
          Không tìm thấy đơn hàng.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07031a] px-4 py-6 font-sans text-white md:px-8">
      <div className="mx-auto w-full max-w-[1560px] space-y-6">
        <section className="rounded-2xl border border-[#3d63ff]/25 bg-[#151036] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] md:p-7">
          <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/profile/history')}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition-colors hover:bg-white/10"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#6da2ff]">Mã đơn hàng</p>
                <h1 className="break-all font-mono text-xl font-black md:text-3xl">#{order._id}</h1>
              </div>
            </div>

            <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClass(isPaid ? 'confirmed' : order.status)}`}>
              {isPaid ? 'Đã thanh toán' : statusLabels[order.status] ?? order.status}
            </span>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100">
              {error}
            </p>
          )}

          <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_420px]">
            <main className="space-y-5">
              <section className="rounded-2xl border border-white/10 bg-[#221b46] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0f0a2a] text-[#6da2ff]">
                    {isDigitalOrder ? <Key size={30} /> : <Laptop size={30} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-black text-white">{getItemName(firstItem)}</h2>
                    <div className="mt-3 grid gap-2 text-sm text-[#c9c3ef] sm:grid-cols-2">
                      <p className="flex items-center gap-2">
                        <Calendar size={15} />
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="flex items-center gap-2">
                        <ReceiptText size={15} />
                        {paymentLabels[order.payment_method ?? ''] ?? order.payment_method ?? 'Chưa có'}
                      </p>
                    </div>
                    <p className="mt-4 text-2xl font-black text-[#ffd84d]">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#0f0a2a] p-5">
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#6da2ff]">
                  Sản phẩm trong đơn
                </h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {order.items.map((item) => (
                    <div key={item._id ?? item.item_id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="font-bold text-white">{getItemName(item)}</p>
                      <p className="mt-1 text-sm text-[#c9c3ef]">
                        Loại: {item.product_type === 'digital' ? 'Tài khoản số' : 'Laptop / PC'}
                      </p>
                      <p className="mt-2 font-black text-[#ffd84d]">{formatPrice(getItemPrice(item))}</p>
                    </div>
                  ))}
                </div>
              </section>
            </main>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-white/10 bg-[#0f0a2a] p-5">
                <h4 className="flex items-center gap-2 font-bold text-white">
                  <CreditCard size={17} className="text-[#6da2ff]" />
                  Thanh toán
                </h4>
                <div className="mt-3 space-y-2 text-sm text-[#c9c3ef]">
                  <p>{paymentLabels[order.payment_method ?? ''] ?? order.payment_method ?? 'Chưa có'}</p>
                  <p>Tổng tiền cần thanh toán: {formatPrice(order.total_amount)}</p>
                  <p>
                    Trạng thái thanh toán:{' '}
                    <span className={isPaid ? 'font-bold text-[#7ee2a8]' : 'font-bold text-amber-200'}>
                      {isPaid ? 'Đã thanh toán' : 'Chờ thanh toán'}
                    </span>
                  </p>
                  {isBankTransfer && payment && (
                    <>
                      <p>Ngân hàng: {String(getBankValue(payment, 'bank_name') ?? '-')}</p>
                      <button
                        type="button"
                        onClick={() => copyText(getBankValue(payment, 'account_number'))}
                        className="inline-flex items-center gap-2 font-bold text-white hover:text-[#7db3ff]"
                      >
                        STK: {String(getBankValue(payment, 'account_number') ?? '-')}
                        <Copy size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => copyText(getBankValue(payment, 'transfer_content'))}
                        className="block font-bold text-[#7db3ff] hover:text-white"
                      >
                        Nội dung CK: {String(getBankValue(payment, 'transfer_content') ?? '-')}
                      </button>
                    </>
                  )}
                </div>

                {isBankTransfer && !isPaid && qrUrl && (
                  <div className="mt-4 rounded-2xl border border-[#3d63ff]/25 bg-white p-3">
                    <img src={qrUrl} alt="QR chuyển khoản" className="mx-auto w-full max-w-[260px]" />
                  </div>
                )}

                {isBankTransfer && !isPaid && (
                  <p className="mt-3 text-xs leading-5 text-[#8d86b6]">
                    Trang này tự kiểm tra trạng thái thanh toán mỗi 5 giây. Khi SePay báo về BE, trạng thái sẽ tự cập nhật.
                  </p>
                )}
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#0f0a2a] p-5">
                <h4 className="flex items-center gap-2 font-bold text-white">
                  <MapPin size={17} className="text-rose-300" />
                  Địa chỉ giao hàng
                </h4>
                <p className="mt-3 text-sm leading-6 text-[#c9c3ef]">
                  {order.shipping_address || 'Không áp dụng cho đơn hàng này.'}
                </p>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#0f0a2a] p-5">
                <h4 className="flex items-center gap-2 font-bold text-white">
                  <ShieldCheck size={17} className="text-emerald-300" />
                  Hỗ trợ sau mua
                </h4>
                <p className="mt-3 text-sm leading-6 text-[#c9c3ef]">
                  Yêu cầu hỗ trợ/hoàn tiền được tạo qua API support của BE và cần mã đơn cùng mã item trong đơn.
                </p>
                <button
                  type="button"
                  disabled={!canRequestSupport}
                  onClick={handleSupport}
                  className="mt-4 w-full rounded-xl bg-[#3d63ff] px-4 py-3 text-sm font-bold text-white hover:bg-[#6da2ff] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[#9d95c9]"
                >
                  Tạo yêu cầu hỗ trợ
                </button>
              </section>

              {canCancel && (
                <section className="rounded-2xl border border-rose-400/25 bg-rose-500/10 p-5">
                  <h4 className="flex items-center gap-2 font-bold text-rose-100">
                    <AlertTriangle size={17} />
                    Hủy đơn hàng
                  </h4>
                  <textarea
                    value={cancelReason}
                    onChange={(event) => setCancelReason(event.target.value)}
                    rows={3}
                    className="mt-3 w-full rounded-xl border border-rose-300/20 bg-[#100b2c] px-3 py-2 text-sm text-white outline-none focus:border-rose-300"
                    placeholder="Lý do hủy đơn, có thể để trống"
                  />
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white hover:bg-rose-400 disabled:opacity-60"
                  >
                    <XCircle size={16} />
                    {isCancelling ? 'Đang hủy...' : 'Hủy đơn'}
                  </button>
                </section>
              )}
            </aside>
          </div>
        </section>
      </div>
    </div>
  )
}
