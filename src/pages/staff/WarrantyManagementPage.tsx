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
  ShieldCheck,
  UserCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { useLocation } from 'react-router-dom'
import StaffLayout from '@/layouts/StaffLayout'
import {
  assignTicket,
  getAllTickets,
  getManagedTicketDetail,
  refundTicket,
  rejectTicket,
  resolveTicket,
  sendStaffMessage,
  updateTicketPriority,
  type SupportTicket,
  type SupportTicketStatus,
  type TicketMessage,
} from '@/services/support.service'
import { getStaffs, type AdminUser } from '@/services/admin.service'
import { useAuthStore } from '@/store/authStore'

const objectIdPattern = /^[a-fA-F0-9]{24}$/

const statusLabels: Record<SupportTicketStatus, string> = {
  open: 'Chờ tiếp nhận',
  in_progress: 'Đang xử lý',
  waiting_customer: 'Chờ khách phản hồi',
  resolved: 'Đã xử lý',
  closed: 'Đã đóng',
  cancelled: 'Đã hủy',
  reopened: 'Mở lại',
  rejected: 'Đã từ chối',
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

function getRoleName(role: unknown) {
  if (typeof role === 'string') return role
  if (role && typeof role === 'object' && 'name' in role) {
    const roleName = (role as { name?: unknown }).name
    return typeof roleName === 'string' ? roleName : null
  }
  return null
}

function assigneeLabel(ticket: SupportTicket) {
  const assignee = ticket.assigned_to
  if (!assignee) return 'Chưa gán'
  if (typeof assignee === 'string') return assignee

  return assignee.fullname || assignee.email || assignee._id || 'Đã gán'
}

function ticketAssignLabel(ticket: SupportTicket) {
  const typeName = typeLabels[ticket.type] ?? 'ticket'
  return `Gán ${typeName.toLowerCase()}`
}

function canHandleRefundTicket(ticket: SupportTicket) {
  return ['open', 'in_progress', 'waiting_customer', 'reopened'].includes(ticket.status)
}

const modeConfigs = {
  warranty: {
    eyebrow: 'Bảo hành & hoàn tiền',
    accent: 'emerald',
    heroClass: 'border-emerald-200 bg-emerald-50/80',
    iconClass: 'bg-emerald-600 text-white',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500',
    selectedClass: 'border-emerald-400 bg-emerald-50/70',
    tabClass: 'bg-emerald-600 text-white shadow-sm',
    detailTint: 'border-emerald-100 bg-emerald-50',
    listTitle: 'Phiếu bảo hành / hoàn tiền',
    searchPlaceholder: 'Tìm mã phiếu, sản phẩm, lỗi bảo hành...',
    emptyHint: 'Ticket hỗ trợ kỹ thuật và khiếu nại nằm ở mục Hỗ trợ khách hàng.',
    guideTitle: 'Quy trình xử lý bảo hành',
    guideText: 'Kiểm tra đơn hàng, gán nhân viên phụ trách, phản hồi khách và ghi rõ kết quả xử lý trước khi hoàn tất.',
    detailTitle: 'Thông tin phiếu bảo hành',
    replyLabel: 'Phản hồi bảo hành cho khách',
    resolveLabel: 'Kết quả bảo hành / hoàn tiền',
    Icon: ShieldCheck,
    stats: {
      total: 'Tổng phiếu',
      open: 'Cần xử lý',
      waiting: 'Chờ khách bổ sung',
      resolved: 'Đã hoàn tất',
    },
  },
  support: {
    eyebrow: 'Hỗ trợ & khiếu nại',
    accent: 'blue',
    heroClass: 'border-blue-200 bg-blue-50/80',
    iconClass: 'bg-blue-600 text-white',
    buttonClass: 'bg-blue-600 hover:bg-blue-500',
    selectedClass: 'border-blue-400 bg-blue-50/70',
    tabClass: 'bg-blue-600 text-white shadow-sm',
    detailTint: 'border-blue-100 bg-blue-50',
    listTitle: 'Ticket hỗ trợ / khiếu nại',
    searchPlaceholder: 'Tìm ticket, nội dung hỗ trợ, sản phẩm...',
    emptyHint: 'Ticket bảo hành và hoàn tiền nằm ở mục Quản lý bảo hành.',
    guideTitle: 'Quy trình hỗ trợ khách hàng',
    guideText: 'Tiếp nhận câu hỏi, trao đổi trong tin nhắn, gán người xử lý khi cần và phản hồi rõ ràng cho khách.',
    detailTitle: 'Thông tin ticket hỗ trợ',
    replyLabel: 'Phản hồi hỗ trợ cho khách',
    resolveLabel: 'Kết quả hỗ trợ / khiếu nại',
    Icon: MessageSquare,
    stats: {
      total: 'Tổng ticket',
      open: 'Đang hỗ trợ',
      waiting: 'Chờ khách',
      resolved: 'Đã xử lý',
    },
  },
} as const

export default function WarrantyManagementPage() {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const role = getRoleName(user?.role)
  const mode = location.pathname.includes('/tickets') ? 'support' : 'warranty'
  const view = modeConfigs[mode]
  const ViewIcon = view.Icon
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
  const [refundReason, setRefundReason] = useState('')
  const [refundMethod, setRefundMethod] = useState<'original_payment' | 'bank_transfer' | 'store_credit'>('original_payment')
  const [restockPhysical, setRestockPhysical] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [assignStaffId, setAssignStaffId] = useState('')
  const [staffOptions, setStaffOptions] = useState<AdminUser[]>([])
  const [isInternal, setIsInternal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const openTicket = async (ticketId: string) => {
    try {
      const res = await getManagedTicketDetail(ticketId)
      setSelectedTicket(res.data?.data?.ticket ?? null)
      setMessages(res.data?.data?.messages ?? [])
      setReply('')
      setResolution('')
      setRefundReason('')
      setRejectReason('')
      setRestockPhysical(false)
      setAssignStaffId('')
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải chi tiết ticket.')
    }
  }

  const loadTickets = async (preferredTicketId?: string) => {
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
      const nextSelectedId =
        preferredTicketId && nextTickets.some((ticket) => ticket._id === preferredTicketId)
          ? preferredTicketId
          : nextTickets[0]?._id
      if (nextSelectedId) await openTicket(nextSelectedId)
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

  useEffect(() => {
    const loadStaffOptions = async () => {
      if (role !== 'admin') {
        setStaffOptions([])
        return
      }

      try {
        const res = await getStaffs({ page: 1, limit: 100 })
        setStaffOptions(res.data?.data?.staff ?? [])
      } catch {
        setStaffOptions([])
      }
    }

    loadStaffOptions()
  }, [role])

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
    [view.stats.total, stats.total, FileText, mode === 'support' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'],
    [view.stats.open, stats.open, ShieldAlert, 'bg-amber-50 text-amber-600'],
    [view.stats.waiting, stats.waiting, MessageSquare, 'bg-purple-50 text-purple-600'],
    [view.stats.resolved, stats.resolved, Check, 'bg-slate-100 text-slate-600'],
  ]

  const sendReply = async () => {
    if (!selectedTicket || !reply.trim()) return
    try {
      setError('')
      setSuccess('')
      await sendStaffMessage(selectedTicket._id, {
        content: reply.trim(),
        attachments: [],
        is_internal: isInternal,
      })
      await openTicket(selectedTicket._id)
      await loadTickets(selectedTicket._id)
      setSuccess('Đã gửi phản hồi cho khách.')
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể gửi phản hồi.')
    }
  }

  const assignSelectedTicket = async () => {
    if (!selectedTicket) return
    if (!objectIdPattern.test(assignStaffId.trim())) {
      setError('Mã nhân viên chưa đúng định dạng.')
      setSuccess('')
      return
    }
    try {
      const nextStaffId = assignStaffId.trim()
      setError('')
      setSuccess('')
      await assignTicket(selectedTicket._id, nextStaffId)
      await openTicket(selectedTicket._id)
      await loadTickets(selectedTicket._id)
      setSuccess(`Đã gán ticket cho nhân viên ${nextStaffId}.`)
    } catch (err: any) {
      setSuccess('')
      setError(err?.response?.data?.message || err?.message || 'Không thể gán nhân viên xử lý.')
    }
  }

  const markResolved = async () => {
    if (!selectedTicket) return
    const note = resolution.trim() || reply.trim()
    if (note.length < 10) {
      setError('Kết quả xử lý cần ít nhất 10 ký tự.')
      setSuccess('')
      return
    }
    try {
      setError('')
      setSuccess('')
      await resolveTicket(selectedTicket._id, note)
      await openTicket(selectedTicket._id)
      await loadTickets(selectedTicket._id)
      setSuccess('Đã đánh dấu ticket là đã xử lý.')
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể đánh dấu đã xử lý.')
    }
  }

  const approveRefund = async () => {
    if (!selectedTicket) return
    if (!canHandleRefundTicket(selectedTicket)) {
      setError(`Ticket đang ở trạng thái "${statusLabels[selectedTicket.status] ?? selectedTicket.status}" nên BE không cho phép hoàn tiền.`)
      setSuccess('')
      return
    }
    const reason = refundReason.trim() || selectedTicket.description
    if (reason.trim().length < 10) {
      setError('Lý do hoàn tiền cần ít nhất 10 ký tự.')
      setSuccess('')
      return
    }

    try {
      setError('')
      setSuccess('')
      await refundTicket(selectedTicket._id, {
        reason,
        refund_method: refundMethod,
        restock_physical: restockPhysical,
      })
      await openTicket(selectedTicket._id)
      await loadTickets(selectedTicket._id)
      setSuccess('Đã duyệt yêu cầu hoàn tiền.')
    } catch (err: any) {
      setSuccess('')
      setError(err?.response?.data?.message || err?.message || 'Không thể duyệt hoàn tiền.')
    }
  }

  const rejectRefundRequest = async () => {
    if (!selectedTicket) return
    if (!canHandleRefundTicket(selectedTicket)) {
      setError(`Ticket đang ở trạng thái "${statusLabels[selectedTicket.status] ?? selectedTicket.status}" nên BE không cho phép từ chối.`)
      setSuccess('')
      return
    }
    const reason = rejectReason.trim()
    if (reason.length < 10) {
      setError('Lý do từ chối cần ít nhất 10 ký tự.')
      setSuccess('')
      return
    }

    try {
      setError('')
      setSuccess('')
      await rejectTicket(selectedTicket._id, reason)
      await openTicket(selectedTicket._id)
      await loadTickets(selectedTicket._id)
      setSuccess('Đã từ chối yêu cầu hoàn tiền.')
    } catch (err: any) {
      setSuccess('')
      setError(err?.response?.data?.message || err?.message || 'Không thể từ chối yêu cầu.')
    }
  }

  const changePriority = async (priority: NonNullable<SupportTicket['priority']>) => {
    if (!selectedTicket) return
    try {
      setError('')
      setSuccess('')
      await updateTicketPriority(selectedTicket._id, priority)
      await openTicket(selectedTicket._id)
      await loadTickets(selectedTicket._id)
      setSuccess('Đã cập nhật độ ưu tiên.')
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể cập nhật độ ưu tiên.')
    }
  }

  return (
    <StaffLayout title={pageTitle} notificationCount={stats.open}>
      <div className="mx-auto max-w-[1600px] space-y-6 pb-12 font-sans text-slate-800">
        <div className={`rounded-3xl border p-5 shadow-sm ${view.heroClass}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${view.iconClass}`}>
                <ViewIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">{view.eyebrow}</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                  {pageTitle}
                </h1>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{pageDescription}</p>
              </div>
            </div>
            <button
              onClick={() => loadTickets()}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white ${view.buttonClass}`}
            >
              <RefreshCw className="h-4 w-4" />
              Tải lại
            </button>
          </div>
          <div className="mt-5 rounded-2xl bg-white/70 p-4 text-sm text-slate-600 ring-1 ring-white/70">
            <div className="flex items-start gap-3">
              {mode === 'support' ? <MessageSquare className="mt-0.5 h-5 w-5 text-blue-600" /> : <Wrench className="mt-0.5 h-5 w-5 text-emerald-600" />}
              <div>
                <p className="font-black text-slate-900">{view.guideTitle}</p>
                <p className="mt-1 leading-6">{view.guideText}</p>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
        {success && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>}

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
                    activeTab === key ? view.tabClass : 'text-slate-500 hover:text-slate-900'
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
                placeholder={view.searchPlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-slate-800">{view.listTitle}</h2>
            <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
              {isLoading ? (
                <p className="py-8 text-center text-sm text-slate-400">Đang tải ticket...</p>
              ) : filteredTickets.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  <p>Không có ticket phù hợp.</p>
                  <p className="mt-1 text-xs">{view.emptyHint}</p>
                </div>
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
                        selected ? view.selectedClass : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">{ticket.ticket_code ?? ticket._id}</p>
                          <p className="mt-1 truncate text-xs text-slate-500">{ticket.title}</p>
                        </div>
                        <Icon className={`h-4 w-4 shrink-0 ${mode === 'support' ? 'text-blue-500' : 'text-emerald-500'}`} />
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
                    <p className="text-xs uppercase text-slate-400">{view.detailTitle}</p>
                    <h2 className="text-xl font-extrabold text-slate-900">{selectedTicket.ticket_code ?? selectedTicket._id}</h2>
                    <p className="mt-1 text-sm text-slate-500">{selectedTicket.title}</p>
                  </div>
                  <label className="flex flex-col gap-1 text-xs font-bold text-slate-500">
                    Độ ưu tiên xử lý
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
                  </label>
                </div>

                <div className={`grid gap-3 rounded-2xl border p-4 text-sm md:grid-cols-4 ${view.detailTint}`}>
                  <p><strong>Trạng thái:</strong> {statusLabels[selectedTicket.status] ?? selectedTicket.status}</p>
                  <p><strong>Loại:</strong> {typeLabels[selectedTicket.type] ?? selectedTicket.type}</p>
                  <p><strong>Sản phẩm:</strong> {selectedTicket.product_name ?? '-'}</p>
                  <p><strong>Nhân viên xử lý:</strong> {assigneeLabel(selectedTicket)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{ticketAssignLabel(selectedTicket)} cho nhân viên xử lý</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Nhập mã nhân viên được cấp trong màn quản lý nhân viên. Hiện đang gán: {assigneeLabel(selectedTicket)}.
                  </p>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    {staffOptions.length > 0 ? (
                      <select
                        value={assignStaffId}
                        onChange={(event) => setAssignStaffId(event.target.value)}
                        className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Chọn nhân viên xử lý</option>
                        {staffOptions.map((staff) => (
                          <option key={staff._id} value={staff._id}>
                            {staff.fullname || staff.email || staff._id}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={assignStaffId}
                        onChange={(event) => setAssignStaffId(event.target.value)}
                        placeholder="Nhập mã nhân viên"
                        className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    )}
                    <button onClick={assignSelectedTicket} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white ${mode === 'support' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
                      <UserCheck className="h-4 w-4" />
                      {ticketAssignLabel(selectedTicket)}
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
                    <label className="text-sm font-bold text-slate-900">{view.replyLabel}</label>
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
                    <button onClick={sendReply} className={`mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white ${view.buttonClass}`}>
                      <Send className="h-4 w-4" />
                      Gửi phản hồi
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-900">{view.resolveLabel}</label>
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

                {selectedTicket.type === 'refund_request' && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-black text-amber-950">Xử lý yêu cầu hoàn tiền</p>
                      <p className="text-xs leading-5 text-amber-800">
                        BE sẽ hoàn đúng sản phẩm gắn với ticket này, không hoàn toàn bộ đơn.
                      </p>
                    </div>

                    {!canHandleRefundTicket(selectedTicket) && (
                      <p className="mt-4 rounded-xl border border-amber-200 bg-white px-4 py-3 text-xs font-bold text-amber-800">
                        Ticket đang ở trạng thái "{statusLabels[selectedTicket.status] ?? selectedTicket.status}", không còn thao tác hoàn tiền/từ chối.
                      </p>
                    )}

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-700">
                          Lý do hoàn tiền
                          <textarea
                            value={refundReason}
                            onChange={(event) => setRefundReason(event.target.value)}
                            className="mt-2 min-h-[96px] w-full rounded-xl border border-amber-200 bg-white p-3 text-sm focus:border-amber-500 focus:outline-none"
                            placeholder="Nhập lý do hoàn tiền..."
                          />
                        </label>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block text-xs font-bold text-slate-700">
                            Phương thức hoàn
                            <select
                              value={refundMethod}
                              onChange={(event) => setRefundMethod(event.target.value as typeof refundMethod)}
                              className="mt-2 h-11 w-full rounded-xl border border-amber-200 bg-white px-3 text-sm font-semibold focus:border-amber-500 focus:outline-none"
                            >
                              <option value="original_payment">Theo phương thức gốc</option>
                              <option value="bank_transfer">Chuyển khoản</option>
                              <option value="store_credit">Điểm cửa hàng</option>
                            </select>
                          </label>

                          <label className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-700">
                            <input
                              type="checkbox"
                              checked={restockPhysical}
                              onChange={(event) => setRestockPhysical(event.target.checked)}
                            />
                            Nhập lại kho nếu là hàng vật lý
                          </label>
                        </div>

                        <button
                          type="button"
                          onClick={approveRefund}
                          disabled={!canHandleRefundTicket(selectedTicket)}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                          Duyệt hoàn tiền
                        </button>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-700">
                          Lý do từ chối
                          <textarea
                            value={rejectReason}
                            onChange={(event) => setRejectReason(event.target.value)}
                            className="mt-2 min-h-[96px] w-full rounded-xl border border-rose-200 bg-white p-3 text-sm focus:border-rose-500 focus:outline-none"
                            placeholder="Nhập lý do từ chối..."
                          />
                        </label>
                        <button
                          type="button"
                          onClick={rejectRefundRequest}
                          disabled={!canHandleRefundTicket(selectedTicket)}
                          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 disabled:opacity-50"
                        >
                          <ShieldAlert className="h-4 w-4" />
                          Từ chối yêu cầu
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </StaffLayout>
  )
}
