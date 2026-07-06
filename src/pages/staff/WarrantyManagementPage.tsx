import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  FileText,
  Key,
  Laptop,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  UserCheck,
  type LucideIcon,
} from 'lucide-react'
import { useLocation } from 'react-router-dom'
import StaffLayout from '@/layouts/StaffLayout'
import {
  assignTicket,
  getAllTickets,
  getManagedTicketDetail,
  resolveTicket,
  sendStaffMessage,
  updateTicketPriority,
  type SupportTicket,
  type SupportTicketStatus,
  type TicketMessage,
} from '@/services/support.service'

const objectIdPattern = /^[a-fA-F0-9]{24}$/

const statusLabels: Record<SupportTicketStatus, string> = {
  open: 'Chờ tiếp nhận',
  in_progress: 'Đang xử lý',
  waiting_customer: 'Chờ khách phản hồi',
  resolved: 'Đã xử lý',
  closed: 'Đã đóng',
  cancelled: 'Đã hủy',
  reopened: 'Mở lại',
}

const typeLabels: Record<SupportTicket['type'], string> = {
  warranty: 'Bảo hành',
  support: 'Hỗ trợ kỹ thuật',
  complaint: 'Khiếu nại',
  refund_request: 'Yêu cầu hoàn tiền',
}

function formatDate(value?: string) {
  if (!value) return 'Chưa có'
  return new Date(value).toLocaleString('vi-VN')
}

function productKind(ticket: SupportTicket) {
  return ticket.product_type === 'digital' ? 'account' : 'laptop'
}

export default function WarrantyManagementPage() {
  const location = useLocation()
  const mode = location.pathname.includes('/tickets') ? 'support' : 'warranty'
  const pageTitle = mode === 'support' ? 'Hỗ trợ khách hàng' : 'Quản lý bảo hành'
  const pageDescription =
    mode === 'support'
      ? 'Theo dõi các yêu cầu hỗ trợ kỹ thuật và khiếu nại của khách hàng.'
      : 'Theo dõi các yêu cầu bảo hành và hoàn tiền liên quan đến đơn hàng.'

  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'laptop' | 'account'>('all')
  const [keyword, setKeyword] = useState('')
  const [reply, setReply] = useState('')
  const [resolution, setResolution] = useState('')
  const [assignStaffId, setAssignStaffId] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const openTicket = async (ticketId: string) => {
    try {
      const res = await getManagedTicketDetail(ticketId)
      setSelectedTicket(res.data?.data?.ticket ?? null)
      setMessages(res.data?.data?.messages ?? [])
      setReply('')
      setResolution('')
      setAssignStaffId('')
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải chi tiết ticket.')
    }
  }

  const loadTickets = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await getAllTickets({ page: 1, limit: 100, search: keyword.trim() || undefined })
      const rawTickets = res.data?.data?.tickets ?? []
      const nextTickets = rawTickets.filter((ticket) =>
        mode === 'support'
          ? ['support', 'complaint'].includes(ticket.type)
          : ['warranty', 'refund_request'].includes(ticket.type)
      )
      setTickets(nextTickets)
      if (nextTickets[0]) await openTicket(nextTickets[0]._id)
      else {
        setSelectedTicket(null)
        setMessages([])
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải danh sách yêu cầu.')
      setTickets([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [mode])

  const filteredTickets = useMemo(() => {
    const search = keyword.trim().toLowerCase()
    return tickets.filter((ticket) => {
      const matchesTab = activeTab === 'all' || productKind(ticket) === activeTab
      const matchesSearch =
        !search ||
        `${ticket.ticket_code ?? ''} ${ticket.title} ${ticket.product_name ?? ''} ${ticket.description}`
          .toLowerCase()
          .includes(search)
      return matchesTab && matchesSearch
    })
  }, [tickets, activeTab, keyword])

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((ticket) => ['open', 'in_progress', 'reopened'].includes(ticket.status)).length,
      waiting: tickets.filter((ticket) => ticket.status === 'waiting_customer').length,
      resolved: tickets.filter((ticket) => ['resolved', 'closed'].includes(ticket.status)).length,
    }
  }, [tickets])

  const statCards: Array<[string, number, LucideIcon, string]> = [
    ['Tổng ticket', stats.total, FileText, 'bg-blue-50 text-blue-600'],
    ['Đang xử lý', stats.open, ShieldAlert, 'bg-amber-50 text-amber-600'],
    ['Chờ khách', stats.waiting, MessageSquare, 'bg-purple-50 text-purple-600'],
    ['Đã xử lý', stats.resolved, Check, 'bg-emerald-50 text-emerald-600'],
  ]

  const sendReply = async () => {
    if (!selectedTicket || !reply.trim()) return
    try {
      await sendStaffMessage(selectedTicket._id, {
        content: reply.trim(),
        attachments: [],
        is_internal: isInternal,
      })
      await openTicket(selectedTicket._id)
      await loadTickets()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể gửi phản hồi.')
    }
  }

  const assignSelectedTicket = async () => {
    if (!selectedTicket) return
    if (!objectIdPattern.test(assignStaffId.trim())) {
      setError('Mã nhân viên chưa đúng định dạng.')
      return
    }
    try {
      await assignTicket(selectedTicket._id, assignStaffId.trim())
      await openTicket(selectedTicket._id)
      await loadTickets()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể gán nhân viên xử lý.')
    }
  }

  const markResolved = async () => {
    if (!selectedTicket) return
    const note = resolution.trim() || reply.trim()
    if (note.length < 10) {
      setError('Kết quả xử lý cần ít nhất 10 ký tự.')
      return
    }
    try {
      await resolveTicket(selectedTicket._id, note)
      await openTicket(selectedTicket._id)
      await loadTickets()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể đánh dấu đã xử lý.')
    }
  }

  const changePriority = async (priority: NonNullable<SupportTicket['priority']>) => {
    if (!selectedTicket) return
    try {
      await updateTicketPriority(selectedTicket._id, priority)
      await openTicket(selectedTicket._id)
      await loadTickets()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể cập nhật độ ưu tiên.')
    }
  }

  return (
    <StaffLayout title={pageTitle} notificationCount={stats.open}>
      <div className="mx-auto max-w-[1600px] space-y-6 pb-12 font-sans text-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {pageTitle}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{pageDescription}</p>
          </div>
          <button
            onClick={loadTickets}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
          >
            <RefreshCw className="h-4 w-4" />
            Tải lại
          </button>
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {statCards.map(([label, value, Icon, color]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
                <h3 className="mt-1 text-2xl font-extrabold text-slate-900">{value.toLocaleString('vi-VN')}</h3>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
              {[
                ['all', 'Tất cả'],
                ['laptop', 'Laptop / PC'],
                ['account', 'Account'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold ${
                    activeTab === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && loadTickets()}
                placeholder="Tìm ticket, sản phẩm..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-slate-800">Danh sách ticket</h2>
            <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
              {isLoading ? (
                <p className="py-8 text-center text-sm text-slate-400">Đang tải ticket...</p>
              ) : filteredTickets.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">Không có ticket phù hợp.</p>
              ) : (
                filteredTickets.map((ticket) => {
                  const Icon = productKind(ticket) === 'account' ? Key : Laptop
                  const selected = selectedTicket?._id === ticket._id
                  return (
                    <button
                      key={ticket._id}
                      type="button"
                      onClick={() => openTicket(ticket._id)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                        selected ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">{ticket.ticket_code ?? ticket._id}</p>
                          <p className="mt-1 truncate text-xs text-slate-500">{ticket.title}</p>
                        </div>
                        <Icon className="h-4 w-4 shrink-0 text-blue-500" />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                        <span>{statusLabels[ticket.status] ?? ticket.status}</span>
                        <span>{formatDate(ticket.createdAt)}</span>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            {!selectedTicket ? (
              <div className="py-20 text-center text-sm text-slate-400">Chọn một ticket để xem chi tiết.</div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase text-slate-400">Ticket</p>
                    <h2 className="text-xl font-extrabold text-slate-900">{selectedTicket.ticket_code ?? selectedTicket._id}</h2>
                    <p className="mt-1 text-sm text-slate-500">{selectedTicket.title}</p>
                  </div>
                  <select
                    value={selectedTicket.priority ?? 'medium'}
                    onChange={(event) => changePriority(event.target.value as NonNullable<SupportTicket['priority']>)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600"
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                    <option value="urgent">Khẩn cấp</option>
                  </select>
                </div>

                <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm md:grid-cols-3">
                  <p><strong>Trạng thái:</strong> {statusLabels[selectedTicket.status] ?? selectedTicket.status}</p>
                  <p><strong>Loại:</strong> {typeLabels[selectedTicket.type] ?? selectedTicket.type}</p>
                  <p><strong>Sản phẩm:</strong> {selectedTicket.product_name ?? '-'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">Gán nhân viên xử lý</h3>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={assignStaffId}
                      onChange={(event) => setAssignStaffId(event.target.value)}
                      placeholder="Nhập mã nhân viên"
                      className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <button onClick={assignSelectedTicket} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500">
                      <UserCheck className="h-4 w-4" />
                      Gán ticket
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">Mô tả yêu cầu</h3>
                  <p className="mt-2 whitespace-pre-line rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {selectedTicket.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tin nhắn</h3>
                  <div className="mt-2 max-h-[280px] space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
                    {messages.length === 0 ? (
                      <p className="text-sm text-slate-400">Chưa có tin nhắn.</p>
                    ) : (
                      messages.map((message) => (
                        <div key={message._id} className="rounded-xl bg-white p-3 text-sm shadow-sm">
                          <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-400">
                            <span>{message.sender_role}{message.is_internal ? ' - nội bộ' : ''}</span>
                            <span>{formatDate(message.createdAt)}</span>
                          </div>
                          <p className="whitespace-pre-line text-slate-700">{message.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="text-sm font-bold text-slate-900">Phản hồi cho khách</label>
                    <textarea
                      value={reply}
                      onChange={(event) => setReply(event.target.value)}
                      className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="Nhập nội dung phản hồi..."
                    />
                    <label className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <input type="checkbox" checked={isInternal} onChange={(event) => setIsInternal(event.target.checked)} />
                      Ghi chú nội bộ
                    </label>
                    <button onClick={sendReply} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500">
                      <Send className="h-4 w-4" />
                      Gửi phản hồi
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-900">Kết quả xử lý</label>
                    <textarea
                      value={resolution}
                      onChange={(event) => setResolution(event.target.value)}
                      className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                      placeholder="Nhập kết quả xử lý trước khi đánh dấu hoàn tất..."
                    />
                    <button onClick={markResolved} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500">
                      <Check className="h-4 w-4" />
                      Đánh dấu đã xử lý
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </StaffLayout>
  )
}
