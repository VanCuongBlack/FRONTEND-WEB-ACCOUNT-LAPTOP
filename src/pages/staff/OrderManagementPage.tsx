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

function formatMethod(method?: string) {
  if (method === 'cod') return 'Thanh toán khi nhận hàng'
  if (method === 'bank_transfer') return 'Chuyển khoản ngân hàng'
  return method ?? '-'
}

function formatStatus(status?: string) {
  const labels: Record<string, string> = {
    pending: 'Đang chờ',
    paid: 'Đã thanh toán',
    failed: 'Thất bại',
    expired: 'Hết hạn',
    refunded: 'Đã hoàn tiền',
  }

  return status ? labels[status] ?? status : '-'
}

function isMongoObjectId(value: string) {
  return /^[a-f\d]{24}$/i.test(value)
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

    if (!isMongoObjectId(normalizedOrderId)) {
      setError('BE hiện chỉ nhận Mongo _id của đơn hàng gồm 24 ký tự. Mã DH... là nội dung chuyển khoản, không dùng để xác nhận COD.')
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

    if (!isMongoObjectId(normalizedOrderId)) {
      setError('BE hiện chỉ nhận Mongo _id của đơn hàng gồm 24 ký tự. Mã DH... là nội dung chuyển khoản, không dùng để xác nhận COD.')
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      await confirmCOD(normalizedOrderId)
      setMessage('Đã xác nhận COD thành công. BE đã chuyển thanh toán sang paid và đơn sang completed.')
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
            Xử lý đơn COD theo quy trình: khách tạo đơn, nhân viên gọi xác nhận, sau đó xác nhận thủ công.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <InfoCard
            icon={<ClipboardList className="h-8 w-8 text-blue-600" />}
            label="Bước 1"
            value="Khách tạo đơn COD"
          />
          <InfoCard
            icon={<FileText className="h-8 w-8 text-emerald-600" />}
            label="Bước 2"
            value="Nhân viên gọi xác nhận"
          />
          <InfoCard
            icon={<CreditCard className="h-8 w-8 text-violet-600" />}
            label="Bước 3"
            value="Bấm xác nhận COD"
          />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <label className="flex-1">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Order ID
              </span>
              <input
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder="Dán Mongo _id của đơn hàng, ví dụ 6a461b49327337931e809297"
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              />
              <span className="mt-1.5 block text-xs text-slate-500">
                Không nhập mã DH... vì đó là nội dung chuyển khoản do payment tạo ra.
              </span>
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
                <strong>{formatMethod(paymentInfo.method)}</strong>
              </p>
              <p>
                <span className="block text-slate-500">Trạng thái</span>
                <strong>{formatStatus(paymentInfo.status)}</strong>
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
                Lưu ý khi xác nhận COD
              </h2>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Chỉ bấm xác nhận sau khi nhân viên đã gọi khách và xác nhận đơn hợp lệ. API BE chỉ cho admin/staff xác nhận COD, sau đó tự cập nhật thanh toán, trạng thái đơn và item đã bán.
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
      <p className="mt-1 break-words text-lg font-bold text-slate-900">{value}</p>
    </div>
  )
}
