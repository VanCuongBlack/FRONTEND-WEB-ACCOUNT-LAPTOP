import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { ChevronLeft, Link2, Send } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { createTicket, type SupportTicketType } from '@/services/support.service'

const objectIdPattern = /^[a-fA-F0-9]{24}$/
const fieldClass =
  'w-full rounded-xl border border-[#3d63ff]/30 bg-[#151033] px-4 text-sm text-white outline-none placeholder:text-[#8d86b6] focus:border-[#3783EC] focus:ring-2 focus:ring-[#3783EC]/20'

const ticketTypes: Array<{ value: SupportTicketType; label: string }> = [
  { value: 'warranty', label: 'Bảo hành' },
  { value: 'support', label: 'Hỗ trợ kỹ thuật' },
  { value: 'complaint', label: 'Khiếu nại' },
  { value: 'refund_request', label: 'Yêu cầu hoàn tiền' },
]

export default function SupportRequestPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { type, id } = useParams<{ type?: string; id?: string }>()
  const routeState = location.state as {
    orderId?: string
    orderItemId?: string
    productName?: string
    productType?: 'physical' | 'digital'
  } | null

  const defaultType: SupportTicketType = type === 'account' ? 'support' : 'warranty'
  const [orderId, setOrderId] = useState(routeState?.orderId || id || '')
  const [orderItemId, setOrderItemId] = useState(routeState?.orderItemId || '')
  const [ticketType, setTicketType] = useState<SupportTicketType>(defaultType)
  const [title, setTitle] = useState(
    routeState?.productName ? `Hỗ trợ ${routeState.productName}` : ''
  )
  const [description, setDescription] = useState('')
  const [attachmentText, setAttachmentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const attachmentUrls = useMemo(() => {
    return attachmentText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5)
  }, [attachmentText])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')

    if (!objectIdPattern.test(orderId.trim())) {
      setSubmitError('Mã đơn hàng không hợp lệ. Hãy mở yêu cầu từ trang chi tiết đơn hàng.')
      return
    }

    if (!objectIdPattern.test(orderItemId.trim())) {
      setSubmitError('Mã sản phẩm trong đơn không hợp lệ. Hãy mở yêu cầu từ trang chi tiết đơn hàng.')
      return
    }

    if (title.trim().length < 10) {
      setSubmitError('Tiêu đề cần ít nhất 10 ký tự.')
      return
    }

    if (description.trim().length < 20) {
      setSubmitError('Mô tả cần ít nhất 20 ký tự để nhân viên có đủ thông tin xử lý.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await createTicket({
        order_id: orderId.trim(),
        order_item_id: orderItemId.trim(),
        type: ticketType,
        title: title.trim().slice(0, 200),
        description: description.trim(),
        attachments: attachmentUrls,
      })

      const createdTicketId = res.data?.data?._id
      navigate(createdTicketId ? `/profile/support/${createdTicketId}` : '/profile')
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.message ||
          error?.message ||
          'Không thể gửi yêu cầu hỗ trợ. Vui lòng thử lại.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09051f] px-4 py-6 text-white md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-[980px] rounded-[22px] border border-[#3d63ff]/20 bg-[#211b42] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] md:p-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#b9b4d7] hover:text-white"
        >
          <ChevronLeft size={18} />
          Quay lại
        </button>

        <div className="mb-7">
          <h1 className="text-2xl font-black md:text-[30px]">
            Tạo yêu cầu hỗ trợ
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#b9b4d7]">
            Gửi yêu cầu bảo hành, hỗ trợ kỹ thuật, khiếu nại hoặc hoàn tiền cho sản phẩm trong đơn hàng.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Mã đơn hàng">
            <input
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Tự điền khi mở từ chi tiết đơn hàng"
              className={`${fieldClass} h-[48px]`}
              required
            />
          </Field>

          <Field label="Mã sản phẩm trong đơn">
            <input
              value={orderItemId}
              onChange={(event) => setOrderItemId(event.target.value)}
              placeholder="Tự điền khi mở từ chi tiết đơn hàng"
              className={`${fieldClass} h-[48px]`}
              required
            />
          </Field>

          <Field label="Loại yêu cầu">
            <select
              value={ticketType}
              onChange={(event) => setTicketType(event.target.value as SupportTicketType)}
              className={`${fieldClass} h-[48px]`}
            >
              {ticketTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tiêu đề">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Tóm tắt vấn đề cần hỗ trợ"
              className={`${fieldClass} h-[48px]`}
              required
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Mô tả chi tiết">
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Mô tả lỗi, thời điểm phát sinh, thao tác trước khi lỗi xảy ra..."
                rows={6}
                className={`${fieldClass} min-h-[150px] resize-none py-3`}
                required
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Link ảnh/video đính kèm">
              <div className="relative">
                <Link2 className="absolute left-4 top-4 h-4 w-4 text-[#8d86b6]" />
                <textarea
                  value={attachmentText}
                  onChange={(event) => setAttachmentText(event.target.value)}
                  placeholder="Mỗi dòng một URL ảnh/video. Backend hiện nhận tối đa 5 URL."
                  rows={4}
                  className={`${fieldClass} min-h-[110px] resize-none py-3 pl-11`}
                />
              </div>
              <p className="mt-2 text-xs text-[#a9a2cf]">
                Hiện backend chưa có API upload file từ máy, nên frontend chỉ gửi được link ảnh/video.
              </p>
            </Field>
          </div>

          {submitError && (
            <p className="md:col-span-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {submitError}
            </p>
          )}

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-[48px] items-center justify-center gap-2 rounded-xl bg-[#3783EC] px-7 text-sm font-bold text-white hover:bg-[#206ed6] disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              <Send size={18} />
              {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#d9d6ee]">{label}</span>
      {children}
    </label>
  )
}
