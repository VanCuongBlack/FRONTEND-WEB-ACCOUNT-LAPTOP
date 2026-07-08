import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  CheckCircle2,
  ChevronLeft,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  Send,
  XCircle,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  cancelTicket,
  closeTicket,
  getMyTicketDetail,
  reopenTicket,
  sendCustomerMessage,
  type SupportTicket,
  type SupportTicketStatus,
  type TicketMessage,
} from '@/services/support.service'

const statusLabelMap: Record<SupportTicketStatus, string> = {
  open: 'Chờ tiếp nhận',
  in_progress: 'Đang xử lý',
  waiting_customer: 'Chờ khách phản hồi',
  resolved: 'Đã xử lý',
  closed: 'Đã đóng',
  cancelled: 'Đã hủy',
  reopened: 'Đã mở lại',
  rejected: 'Đã từ chối',
}

const typeLabelMap: Record<SupportTicket['type'], string> = {
  warranty: 'Bảo hành',
  support: 'Hỗ trợ',
  complaint: 'Khiếu nại',
  refund_request: 'Yêu cầu hoàn tiền',
}

const activeStatuses: SupportTicketStatus[] = ['open', 'in_progress', 'waiting_customer', 'reopened']

function formatDateTime(value?: string) {
  if (!value) return 'Chưa có thời gian'
  return new Date(value).toLocaleString('vi-VN')
}

function splitUrls(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function SupportRequestDetailPage() {
  const navigate = useNavigate()
  const { ticketId } = useParams<{ ticketId: string }>()
  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [messageContent, setMessageContent] = useState('')
  const [messageAttachments, setMessageAttachments] = useState('')
  const [rating, setRating] = useState(5)
  const [ratingComment, setRatingComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const canSendMessage = useMemo(
    () => Boolean(ticket && activeStatuses.includes(ticket.status)),
    [ticket]
  )
  const canCancel = ticket?.status === 'open'
  const canResolveAction = ticket?.status === 'resolved'

  const loadTicket = async () => {
    if (!ticketId) {
      setTicket(null)
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const res = await getMyTicketDetail(ticketId)
      setTicket(res.data?.data?.ticket ?? null)
      setMessages(res.data?.data?.messages ?? [])
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || 'Không thể tải yêu cầu hỗ trợ.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTicket()
  }, [ticketId])

  const handleSendMessage = async (event: FormEvent) => {
    event.preventDefault()
    if (!ticketId || !messageContent.trim()) return

    const attachments = splitUrls(messageAttachments)
    if (attachments.length > 5) {
      setError('BE chỉ nhận tối đa 5 URL đính kèm.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setNotice('')
    try {
      await sendCustomerMessage(ticketId, {
        content: messageContent.trim(),
        ...(attachments.length > 0 ? { attachments } : {}),
      })
      setMessageContent('')
      setMessageAttachments('')
      setNotice('Đã gửi phản hồi.')
      await loadTicket()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể gửi phản hồi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTicketAction = async (action: 'cancel' | 'reopen' | 'close') => {
    if (!ticketId) return

    setIsSubmitting(true)
    setError('')
    setNotice('')
    try {
      if (action === 'cancel') {
        await cancelTicket(ticketId)
        setNotice('Đã hủy yêu cầu hỗ trợ.')
      }

      if (action === 'reopen') {
        await reopenTicket(ticketId)
        setNotice('Đã mở lại yêu cầu hỗ trợ.')
      }

      if (action === 'close') {
        await closeTicket(ticketId, {
          rating,
          rating_comment: ratingComment.trim() || undefined,
        })
        setNotice('Đã đóng yêu cầu hỗ trợ.')
      }

      await loadTicket()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể cập nhật yêu cầu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#07031a] px-4 py-6 text-white md:px-8">
      <div className="mx-auto w-full max-w-[1560px] space-y-5">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          <ChevronLeft size={18} />
          Quay lại hồ sơ
        </button>

        <section className="rounded-2xl border border-[#3d63ff]/25 bg-[#151036] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] md:p-7">
          {isLoading ? (
            <p className="text-sm text-[#c9c3ef]">Đang tải yêu cầu hỗ trợ...</p>
          ) : !ticket ? (
            <p className="text-sm text-[#c9c3ef]">
              {error || 'Không tìm thấy yêu cầu hỗ trợ.'}
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#6da2ff]">
                    {typeLabelMap[ticket.type] ?? ticket.type}
                  </p>
                  <h1 className="mt-2 break-all text-2xl font-black md:text-4xl">
                    {ticket.ticket_code ?? `#${ticket._id}`}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#c9c3ef]">
                    {ticket.title}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={loadTicket}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15"
                  >
                    <RefreshCw size={16} />
                    Tải lại
                  </button>
                  {canCancel && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleTicketAction('cancel')}
                      className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2 text-sm font-bold text-white hover:bg-rose-400 disabled:opacity-60"
                    >
                      <XCircle size={16} />
                      Hủy yêu cầu
                    </button>
                  )}
                  {canResolveAction && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleTicketAction('reopen')}
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-[#130b2f] hover:bg-amber-400 disabled:opacity-60"
                    >
                      <RotateCcw size={16} />
                      Mở lại
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-[#221b46] p-4 text-sm md:grid-cols-4">
                <p>
                  <span className="block text-[#9d95c9]">Trạng thái</span>
                  <strong>{statusLabelMap[ticket.status] ?? ticket.status}</strong>
                </p>
                <p>
                  <span className="block text-[#9d95c9]">Ngày gửi</span>
                  <strong>{formatDateTime(ticket.createdAt)}</strong>
                </p>
                <p>
                  <span className="block text-[#9d95c9]">Sản phẩm</span>
                  <strong>{ticket.product_type === 'digital' ? 'Tài khoản số' : 'Laptop/PC'}</strong>
                </p>
                <p>
                  <span className="block text-[#9d95c9]">Mã sản phẩm</span>
                  <strong className="break-all">{ticket.order_item_id}</strong>
                </p>
              </div>

              {error && (
                <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100">
                  {error}
                </p>
              )}
              {notice && (
                <p className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-100">
                  {notice}
                </p>
              )}

              <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                <section className="rounded-2xl border border-white/10 bg-[#0f0a2a] p-5">
                  <h2 className="text-lg font-black">Chi tiết yêu cầu</h2>
                  <div className="mt-4 space-y-4 text-sm text-[#d8d3ff]">
                    <p>
                      <span className="text-[#9d95c9]">Tên sản phẩm:</span>{' '}
                      <strong>{ticket.product_name ?? 'Sản phẩm'}</strong>
                    </p>
                    <div>
                      <p className="mb-2 text-[#9d95c9]">Mô tả</p>
                      <p className="whitespace-pre-line rounded-xl border border-white/10 bg-white/5 p-4 leading-7">
                        {ticket.description}
                      </p>
                    </div>
                    {(ticket.attachments ?? []).length > 0 && (
                      <div>
                        <p className="mb-2 text-[#9d95c9]">Đính kèm</p>
                        <div className="space-y-2">
                          {ticket.attachments?.map((url) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="block break-all rounded-lg bg-white/5 px-3 py-2 text-[#6da2ff] hover:bg-white/10"
                            >
                              {url}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {canResolveAction && (
                    <div className="mt-5 rounded-2xl border border-[#3d63ff]/25 bg-[#1b153d] p-4">
                      <h3 className="font-bold">Đóng yêu cầu sau khi đã xử lý</h3>
                      <div className="mt-3 grid gap-3">
                        <label className="text-sm font-semibold text-[#c9c3ef]">
                          Đánh giá
                          <select
                            value={rating}
                            onChange={(event) => setRating(Number(event.target.value))}
                            className="mt-1 w-full rounded-xl border border-white/10 bg-[#100b2c] px-3 py-2 text-white outline-none focus:border-[#3d63ff]"
                          >
                            {[5, 4, 3, 2, 1].map((value) => (
                              <option key={value} value={value}>
                                {value} sao
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="text-sm font-semibold text-[#c9c3ef]">
                          Nhận xét
                          <textarea
                            value={ratingComment}
                            onChange={(event) => setRatingComment(event.target.value)}
                            maxLength={500}
                            rows={3}
                            className="mt-1 w-full rounded-xl border border-white/10 bg-[#100b2c] px-3 py-2 text-white outline-none focus:border-[#3d63ff]"
                            placeholder="Nhận xét tối đa 500 ký tự"
                          />
                        </label>
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleTicketAction('close')}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3d63ff] px-4 py-2 text-sm font-bold text-white hover:bg-[#6da2ff] disabled:opacity-60"
                        >
                          <CheckCircle2 size={16} />
                          Đóng yêu cầu
                        </button>
                      </div>
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-white/10 bg-[#0f0a2a] p-5">
                  <h2 className="text-lg font-black">Trao đổi với nhân viên</h2>
                  <div className="mt-4 max-h-[520px] space-y-3 overflow-y-auto pr-1">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <div
                          key={message._id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-[#9d95c9]">
                            <MessageSquare size={14} />
                            {message.sender_role === 'customer'
                              ? 'Khách hàng'
                              : message.sender_role === 'staff'
                                ? 'Nhân viên'
                                : 'Quản trị'}
                            <span className="font-normal normal-case">
                              {formatDateTime(message.createdAt)}
                            </span>
                          </div>
                          <p className="whitespace-pre-line text-sm leading-6 text-[#eeeaff]">
                            {message.content}
                          </p>
                          {(message.attachments ?? []).length > 0 && (
                            <div className="mt-3 space-y-2">
                              {message.attachments?.map((url) => (
                                <a
                                  key={url}
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block break-all text-xs font-semibold text-[#6da2ff]"
                                >
                                  {url}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-amber-300/30 bg-amber-400/10 p-4">
                        <p className="text-sm font-semibold text-amber-100">
                          Chưa có phản hồi cho yêu cầu này.
                        </p>
                      </div>
                    )}
                  </div>

                  {canSendMessage ? (
                    <form onSubmit={handleSendMessage} className="mt-5 space-y-3">
                      <textarea
                        value={messageContent}
                        onChange={(event) => setMessageContent(event.target.value)}
                        maxLength={2000}
                        rows={4}
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#100b2c] px-4 py-3 text-sm text-white outline-none focus:border-[#3d63ff]"
                        placeholder="Nhập nội dung phản hồi..."
                      />
                      <textarea
                        value={messageAttachments}
                        onChange={(event) => setMessageAttachments(event.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-white/10 bg-[#100b2c] px-4 py-3 text-sm text-white outline-none focus:border-[#3d63ff]"
                        placeholder="URL đính kèm, mỗi dòng một URL. Tối đa 5 URL."
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3d63ff] px-5 py-3 text-sm font-bold text-white hover:bg-[#6da2ff] disabled:opacity-60"
                      >
                        <Send size={16} />
                        {isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
                      </button>
                    </form>
                  ) : (
                    <p className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#c9c3ef]">
                      Trạng thái hiện tại không cho phép gửi phản hồi mới.
                    </p>
                  )}
                </section>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
