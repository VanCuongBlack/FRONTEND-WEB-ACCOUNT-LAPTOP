import { useState, type ReactNode } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileText,
  RefreshCw,
} from 'lucide-react'
import StaffLayout from '@/layouts/StaffLayout'
import { confirmCOD, getPaymentByOrder } from '@/services/payment.service'

function formatPrice(price?: number) {
  return `${(price ?? 0).toLocaleString('vi-VN')}đ`
}

export default function OrderManagementPage() {
  const [orderId, setOrderId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [paymentInfo, setPaymentInfo] = useState<{
    amount?: number
    status?: string
    method?: string
  } | null>(null)

  const normalizedOrderId = orderId.trim()

  const handleLoadPayment = async () => {
    if (!normalizedOrderId) {
      setError('Nhập orderId trước khi kiểm tra thanh toán.')
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')
    setPaymentInfo(null)
    try {
      const res = await getPaymentByOrder(normalizedOrderId)
      const payment = res.data.data
      setPaymentInfo({
        amount: payment?.amount,
        status: payment?.status,
        method: payment?.method ?? payment?.payment_method,
      })
      setMessage('Đã tải thông tin thanh toán của đơn.')
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Không thể tải thông tin thanh toán.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmCOD = async () => {
    if (!normalizedOrderId) {
      setError('Nhập orderId trước khi xác nhận COD.')
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')
    try {
      await confirmCOD(normalizedOrderId)
      setMessage('Đã xác nhận COD thành công.')
      await handleLoadPayment()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể xác nhận COD.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <StaffLayout title="Quản lý đơn hàng" notificationCount={0}>
      <div className="mx-auto w-full max-w-[1840px] space-y-6 font-sans text-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Quản lý đơn hàng
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kiểm tra thanh toán theo mã đơn và xác nhận các đơn COD khi cần đối soát.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <InfoCard
            icon={<ClipboardList className="h-8 w-8 text-blue-600" />}
            label="Danh sách đơn của khách"
            value="/order/my-orders"
          />
          <InfoCard
            icon={<FileText className="h-8 w-8 text-emerald-600" />}
            label="Chi tiết đơn"
            value="/order/:orderId"
          />
          <InfoCard
            icon={<CreditCard className="h-8 w-8 text-violet-600" />}
            label="Xác nhận COD"
            value="/payment/cod/confirm/:orderId"
          />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <label className="flex-1">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                orderId
              </span>
              <input
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder="Dán _id đơn hàng cần kiểm tra hoặc xác nhận COD"
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              />
            </label>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleLoadPayment}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw className="h-4 w-4" />
              Kiểm tra thanh toán
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleConfirmCOD}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-60"
            >
              <CheckCircle2 className="h-4 w-4" />
              Xác nhận COD
            </button>
          </div>

          {paymentInfo && (
            <div className="mt-5 grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4 text-sm md:grid-cols-3">
              <p>
                <span className="block text-slate-500">Phương thức</span>
                <strong>{paymentInfo.method ?? '-'}</strong>
              </p>
              <p>
                <span className="block text-slate-500">Trạng thái</span>
                <strong>{paymentInfo.status ?? '-'}</strong>
              </p>
              <p>
                <span className="block text-slate-500">Số tiền</span>
                <strong>{formatPrice(paymentInfo.amount)}</strong>
              </p>
            </div>
          )}

          {message && (
            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </p>
          )}
        </section>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h2 className="font-bold text-amber-900">
                Chưa thể làm bảng quản lý đơn đầy đủ ở FE
              </h2>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Hiện màn hình này xử lý theo từng mã đơn. Danh sách tổng hợp và các thao tác giao hàng/hoàn đơn sẽ hiển thị khi hệ thống có dữ liệu quản trị tương ứng.
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
      <p className="mt-1 break-all text-lg font-bold text-slate-900">{value}</p>
    </div>
  )
}
