import { useState, useEffect } from 'react'
import {
  MapPin, Users, Wrench, ShieldAlert, Edit2, CheckCircle2,
  Trash2, Plus, Users2, FileText, ChevronRight, Check,
  Eye, Send, X, Laptop, Key, ShieldCheck, Play
} from 'lucide-react'
import StaffLayout from '@/layouts/StaffLayout'
import {
  getStoredSupportRequests,
  updateSupportRequestResponse,
  type SupportRequestAttachment,
  type SupportRequestTicket,
} from '@/utils/supportRequestStorage'
import {
  getTicketMediaObjectUrls,
  resolveAttachmentPreviewSource,
  revokeMediaObjectUrls,
} from '@/utils/supportRequestMediaStorage'

// ─── Interfaces & Mock Data ───────────────────────────────────────────────────

interface Branch {
  id: string
  name: string
  status: 'READY' | 'OVERLOADED'
  address: string
  techsCount: number
  requestsCount: number
}

const INITIAL_BRANCHES: Branch[] = [
  { id: 'b-1', name: 'CN Thủ Đức', status: 'READY', address: 'Võ Văn Ngân, Thủ Đức', techsCount: 5, requestsCount: 2 },
  { id: 'b-2', name: 'CN Quận 1', status: 'OVERLOADED', address: 'Nguyễn Huệ, Quận 1', techsCount: 2, requestsCount: 8 },
  { id: 'b-3', name: 'CN Cầu Giấy', status: 'READY', address: 'Xuân Thủy, Cầu Giấy', techsCount: 4, requestsCount: 1 },
]

interface ComponentPart {
  name: string
  qty: string
  sku: string
}

interface WarrantyTicket {
  id: string
  orderId: string
  type: 'laptop' | 'account'
  device: string
  description: string
  contactEmail: string
  attachmentsCount: number
  attachmentUrls: string[]
  videoUrl?: string
  attachments: SupportRequestAttachment[]
  status: 'DISPATCHING' | 'CONFIRMED' | 'CANCELLED'
  createdAt: string
  techName: string
  techTravelTime: string
  components: ComponentPart[]
  staffResponse: string
}

const INITIAL_TICKETS: WarrantyTicket[] = [
  {
    id: 'TK-87012',
    orderId: 'ACC-20260513',
    type: 'laptop',
    device: 'Laptop Dell Inspiron 15',
    description: 'laptop sập nguồn liên tục sau 10 phút sử dụng, có mùi khét nhẹ ở khe tản nhiệt phía sau.',
    contactEmail: 'ngngan169@gmail.com',
    attachmentsCount: 1,
    attachmentUrls: ['/error-screenshot.png'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    attachments: [
      { name: 'error-screenshot.png', type: 'image/png', isVideo: false, previewUrl: '/error-screenshot.png' },
      { name: 'mov_bbb.mp4', type: 'video/mp4', isVideo: true, previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
    status: 'DISPATCHING',
    createdAt: '13:51:10 9/6/2026',
    techName: 'Trần Văn A',
    techTravelTime: '15 phút',
    components: [
      { name: 'Mainboard Dell G15', qty: '01', sku: 'MB-DEL-G15' },
      { name: 'Bàn phím RGB Dell', qty: '01', sku: 'KB-DEL-RGB' },
      { name: 'Adapter 180W Dell', qty: '01', sku: 'PWR-DEL-180W' },
    ],
    staffResponse: '',
  },
  {
    id: 'TK-88219',
    orderId: 'ACC-20260513',
    type: 'laptop',
    device: 'Dell Gaming G15',
    description: 'Khách hàng phản hồi phím bị kẹt cơ và lỗi kết nối cổng HDMI. Cần kỹ thuật viên hỗ trợ kiểm tra chi tiết, thay phím cơ mới và linh kiện kết nối HDMI nếu Mainboard bị hỏng.',
    contactEmail: 'customer88@gmail.com',
    attachmentsCount: 2,
    attachmentUrls: ['/side-card-macbook.png', '/hero-3.png'],
    attachments: [
      { name: 'side-card-macbook.png', type: 'image/png', isVideo: false, previewUrl: '/side-card-macbook.png' },
      { name: 'hero-3.png', type: 'image/png', isVideo: false, previewUrl: '/hero-3.png' },
    ],
    status: 'DISPATCHING',
    createdAt: '14:30 9/6/2026',
    techName: 'Nguyễn Văn B',
    techTravelTime: '20 phút',
    components: [
      { name: 'Bàn phím RGB Dell', qty: '01', sku: 'KB-DEL-RGB' },
    ],
    staffResponse: 'Mang máy đến chi nhánh Thủ Đức để kiểm tra phần cứng trực tiếp.',
  },
  {
    id: 'TK-90124',
    orderId: 'ACC-20260601',
    type: 'account',
    device: 'Tài khoản Netflix Premium 1 Tháng',
    description: 'Không thể đăng nhập vào tài khoản Netflix. Hệ thống báo sai mật khẩu đăng nhập mặc dù đã copy-paste chuẩn xác.',
    contactEmail: 'acc_buyer@gmail.com',
    attachmentsCount: 1,
    attachmentUrls: ['/side-card-netflix.png'],
    attachments: [
      { name: 'side-card-netflix.png', type: 'image/png', isVideo: false, previewUrl: '/side-card-netflix.png' },
    ],
    status: 'DISPATCHING',
    createdAt: '10:15:30 9/6/2026',
    techName: 'Hệ thống tự động',
    techTravelTime: 'N/A',
    components: [],
    staffResponse: '',
  },
  {
    id: 'TK-90255',
    orderId: 'ACC-20260602',
    type: 'account',
    device: 'Tài khoản Youtube Premium 1 Năm',
    description: 'Tài khoản bị mất Premium, chuyển về tài khoản thường chỉ sau 2 tuần sử dụng mặc dù mua gói 1 năm.',
    contactEmail: 'yt_user@gmail.com',
    attachmentsCount: 1,
    attachmentUrls: ['/side-card-netflix.png'],
    attachments: [
      { name: 'side-card-netflix.png', type: 'image/png', isVideo: false, previewUrl: '/side-card-netflix.png' },
    ],
    status: 'DISPATCHING',
    createdAt: '11:20:00 9/6/2026',
    techName: 'Hệ thống tự động',
    techTravelTime: 'N/A',
    components: [],
    staffResponse: '',
  }
]

function mapSupportStatusToWarrantyStatus(status: SupportRequestTicket['status']): WarrantyTicket['status'] {
  if (status === 'responded') {
    return 'CONFIRMED'
  }
  return 'DISPATCHING'
}

function formatCreatedAtLabel(createdAt: string): string {
  return new Date(createdAt).toLocaleString('vi-VN')
}

function mapSupportTicketToWarrantyTicket(ticket: SupportRequestTicket): WarrantyTicket {
  const mediaUrls = ticket.attachments
    .map((attachment) => attachment.previewUrl)
    .filter((previewUrl): previewUrl is string => Boolean(previewUrl))

  const firstVideoUrl = ticket.attachments.find((attachment) => attachment.isVideo && attachment.previewUrl)?.previewUrl

  return {
    id: ticket.id,
    orderId: ticket.orderCode,
    type: ticket.issueType,
    device: ticket.productName || (ticket.issueType === 'laptop' ? 'Laptop/Pc cần hỗ trợ' : 'Tài khoản số cần hỗ trợ'),
    description: ticket.description || 'Khách hàng chưa bổ sung mô tả chi tiết.',
    contactEmail: ticket.contactInfo || 'Chưa có thông tin liên hệ',
    attachmentsCount: ticket.attachments.length,
    attachmentUrls: mediaUrls,
    videoUrl: firstVideoUrl,
    attachments: ticket.attachments,
    status: mapSupportStatusToWarrantyStatus(ticket.status),
    createdAt: formatCreatedAtLabel(ticket.createdAt),
    techName:
      ticket.issueType === 'laptop'
        ? ticket.assignedTechName || 'Trần Văn A'
        : 'Hệ thống tự động',
    techTravelTime: ticket.issueType === 'laptop' ? '20 phút' : 'N/A',
    components:
      ticket.issueType === 'laptop'
        ? [{ name: 'Bàn phím RGB Dell', qty: '01', sku: 'KB-DEL-RGB' }]
        : [],
    staffResponse: ticket.staffResponse || '',
  }
}

function mergeTicketsWithSupportSource(baseTickets: WarrantyTicket[]): WarrantyTicket[] {
  const merged = new Map<string, WarrantyTicket>()

  baseTickets.forEach((ticket) => {
    merged.set(ticket.id, ticket)
  })

  getStoredSupportRequests().forEach((supportTicket) => {
    const mapped = mapSupportTicketToWarrantyTicket(supportTicket)
    const existing = merged.get(mapped.id)

    if (existing) {
      merged.set(mapped.id, {
        ...existing,
        orderId: mapped.orderId,
        type: mapped.type,
        description: mapped.description,
        device: mapped.device,
        techName: mapped.techName,
        contactEmail: mapped.contactEmail,
        attachments: mapped.attachments,
        attachmentsCount: mapped.attachmentsCount,
        attachmentUrls: mapped.attachmentUrls,
        videoUrl: mapped.videoUrl,
        status: mapped.status,
        createdAt: mapped.createdAt,
        staffResponse: mapped.staffResponse,
      })
      return
    }

    merged.set(mapped.id, mapped)
  })

  return Array.from(merged.values())
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function WarrantyManagementPage() {
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES)
  const [selectedBranchId, setSelectedBranchId] = useState<string>('b-1')
  const [tickets, setTickets] = useState<WarrantyTicket[]>(() => mergeTicketsWithSupportSource(INITIAL_TICKETS))
  const [selectedTicketId, setSelectedTicketId] = useState<string>('TK-87012')
  const [activeBottomTab, setActiveBottomTab] = useState<'laptop' | 'account'>('laptop')
  
  // State for staff response input
  const [tempResponse, setTempResponse] = useState<string>('')

  // State for detail Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false)
  const [mediaByName, setMediaByName] = useState<Record<string, string>>({})

  // Current selected ticket
  const currentTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0] || INITIAL_TICKETS[0]

  useEffect(() => {
    const syncFromStorage = () => {
      setTickets((prevTickets) => mergeTicketsWithSupportSource(prevTickets))
    }

    window.addEventListener('storage', syncFromStorage)
    window.addEventListener('focus', syncFromStorage)

    return () => {
      window.removeEventListener('storage', syncFromStorage)
      window.removeEventListener('focus', syncFromStorage)
    }
  }, [])

  // Synchronize input value with current ticket's staff response
  useEffect(() => {
    if (currentTicket) {
      setTempResponse(currentTicket.staffResponse || '')
    }
  }, [selectedTicketId, currentTicket])

  useEffect(() => {
    let isMounted = true

    const loadMedia = async () => {
      if (!isDetailModalOpen || !currentTicket) {
        if (isMounted) {
          setMediaByName((prev) => {
            revokeMediaObjectUrls(prev)
            return {}
          })
        }
        return
      }

      const urls = await getTicketMediaObjectUrls(currentTicket.id)
      if (!isMounted) {
        revokeMediaObjectUrls(urls)
        return
      }

      setMediaByName((prev) => {
        revokeMediaObjectUrls(prev)
        return urls
      })
    }

    loadMedia()

    return () => {
      isMounted = false
      revokeMediaObjectUrls(mediaByName)
    }
  }, [isDetailModalOpen, currentTicket?.id])

  const handleChangeTech = () => {
    const newName = prompt('Nhập tên kỹ thuật viên mới:', currentTicket.techName)
    if (newName && newName.trim() !== '') {
      setTickets(prev =>
        prev.map(t => t.id === currentTicket.id ? { ...t, techName: newName.trim() } : t)
      )
    }
  }

  const handleConfirmDispatch = () => {
    setTickets(prev =>
      prev.map(t => t.id === currentTicket.id ? { ...t, status: 'CONFIRMED' } : t)
    )
    alert('Đã xác nhận chuyển máy đến chi nhánh và phân phối linh kiện thành công!')
  }

  const handleCancelRequest = () => {
    if (confirm('Bạn có chắc chắn muốn hủy yêu cầu bảo hành này không?')) {
      setTickets(prev =>
        prev.map(t => t.id === currentTicket.id ? { ...t, status: 'CANCELLED' } : t)
      )
    }
  }

  const handleSaveResponse = () => {
    const normalizedResponse = tempResponse.trim()

    if (!normalizedResponse) {
      alert('Vui lòng nhập nội dung phản hồi trước khi lưu!')
      return
    }

    setTickets(prev =>
      prev.map(t =>
        t.id === currentTicket.id
          ? { ...t, staffResponse: normalizedResponse, status: 'CONFIRMED' }
          : t
      )
    )

    setTempResponse(normalizedResponse)

    updateSupportRequestResponse(
      currentTicket.id,
      normalizedResponse,
      'KimNgan',
      currentTicket.type === 'laptop' ? currentTicket.techName : undefined
    )
    alert('Đã lưu phản hồi hướng dẫn xử lý tiếp theo cho khách hàng!')
  }

  const handleCreateRequest = () => {
    alert('Mở cửa sổ tạo yêu cầu bảo hành mới cho thiết bị khách hàng...')
  }

  const handleSyncBranches = () => {
    alert('Đang đồng bộ trạng thái nhân sự và linh kiện giữa các chi nhánh...')
  }

  const laptopTickets = tickets.filter(t => t.type === 'laptop')
  const accountTickets = tickets.filter(t => t.type === 'account')

  return (
    <StaffLayout title="Quản lý bảo hành" notificationCount={3}>
      <div className="space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800 pb-12">
        
        {/* Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý bảo hành laptop</h1>
            <p className="text-sm text-slate-500 mt-1">Hệ thống điều phối linh kiện và kỹ thuật viên bảo hành liên chi nhánh.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateRequest}
              className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Yêu cầu mới
            </button>
            <button
              onClick={handleSyncBranches}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users2 className="w-3.5 h-3.5" />
              Điều phối CN
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Branches list */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Danh sách chi nhánh
              </h2>

              <div className="space-y-3">
                {branches.map(branch => {
                  const isSelected = branch.id === selectedBranchId
                  return (
                    <div
                      key={branch.id}
                      onClick={() => setSelectedBranchId(branch.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/40 shadow-sm ring-1 ring-blue-500/30'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{branch.name}</h3>
                          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            {branch.address}
                          </p>
                        </div>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          branch.status === 'READY'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}>
                          {branch.status === 'READY' ? 'SẴN SÀNG' : 'QUÁ TẢI'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mt-1">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {branch.techsCount} Kỹ thuật viên
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          {branch.requestsCount} Yêu cầu
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Map Card */}
            <div
              onClick={() => alert('Mở chế độ hiển thị bản đồ định vị kỹ thuật viên Realtime...')}
              className="bg-[#1e2130] rounded-2xl p-5 text-white relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">Xem bản đồ trực quan</h4>
                  <p className="text-xs text-white/60 mt-1">Xem tất cả chi nhánh và kỹ thuật viên trên bản đồ</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white/20 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dispatch Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm h-full flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Request Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600 tracking-wider">
                      {currentTicket.type === 'laptop' ? 'YÊU CẦU BẢO HÀNH CHỜ XỬ LÝ' : 'HỖ TRỢ TÀI KHOẢN CHỜ XỬ LÝ'}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">Mã Ticket: #{currentTicket.id}</h2>
                    <p className="text-sm text-slate-500 mt-1 font-semibold">Đơn hàng: {currentTicket.orderId} • Loại: {currentTicket.type === 'laptop' ? 'Laptop/Pc' : 'Tài khoản'}</p>
                  </div>
                  <div>
                    {currentTicket.status === 'DISPATCHING' && (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider animate-pulse">
                        Chờ tiếp nhận
                      </span>
                    )}
                    {currentTicket.status === 'CONFIRMED' && (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                        Đã tiếp nhận
                      </span>
                    )}
                    {currentTicket.status === 'CANCELLED' && (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wider">
                        Đã hủy yêu cầu
                      </span>
                    )}
                  </div>
                </div>

                {/* Status & Notes Card */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>Mô tả chi tiết sự cố</span>
                    <span>Khởi tạo lúc: {currentTicket.createdAt}</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium mt-3 leading-relaxed">
                    {currentTicket.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Liên hệ khách hàng: <span className="font-semibold text-slate-600">{currentTicket.contactEmail}</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    File đính kèm: <span className="font-semibold text-slate-600">{currentTicket.attachmentsCount} file</span>
                  </p>
                  
                  {/* VIEW TECHNICAL DETAILS BUTTON */}
                  <div className="mt-4 flex items-center justify-start">
                    <button
                      onClick={() => setIsDetailModalOpen(true)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      Xem chi tiết kỹ thuật (Hình ảnh / Video lỗi)
                    </button>
                  </div>
                </div>

                {/* Assigned Tech Card */}
                {currentTicket.type === 'laptop' ? (
                  <div className="bg-blue-50/30 rounded-xl p-4 border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kỹ thuật viên chỉ định</p>
                        <p className="text-sm font-bold text-slate-900 mt-1">
                          {currentTicket.techName || 'Chưa chỉ định kỹ thuật viên'}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">Dự kiến thời gian di chuyển: <span className="font-bold text-blue-600">{currentTicket.techTravelTime}</span></p>
                      </div>
                    </div>
                    {currentTicket.status === 'DISPATCHING' && (
                      <button
                        onClick={handleChangeTech}
                        className="p-2 rounded-lg hover:bg-blue-100/60 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                        title="Thay đổi kỹ thuật viên"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-purple-50/30 rounded-xl p-4 border border-purple-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hỗ trợ tự động trực tuyến</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">Hệ thống kích hoạt sửa lỗi tài khoản từ xa</p>
                      <p className="text-xs text-slate-500 mt-0.5">Không yêu cầu kỹ thuật viên di chuyển trực tiếp</p>
                    </div>
                  </div>
                )}

                {/* STAFF RESPONSE SECTION */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-blue-600" />
                      Nhập phản hồi / Hướng dẫn bước tiếp theo cho khách hàng
                    </label>
                    {currentTicket.staffResponse && (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-200">
                        Đã có phản hồi
                      </span>
                    )}
                  </div>
                  <textarea
                    value={tempResponse}
                    onChange={(e) => setTempResponse(e.target.value)}
                    placeholder="Nhập hướng dẫn (Ví dụ: 'Mang máy đến chi nhánh Thủ Đức để nhân viên kiểm tra', 'Đã reset mật khẩu tài khoản Netflix và gửi thông tin mới về email của quý khách', v.v.)"
                    className="w-full text-sm p-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] text-slate-700 placeholder-slate-400 resize-y"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[11px] text-slate-400 italic">
                      Thông tin này sẽ hiển thị trực tiếp cho khách hàng ở phần lịch sử bảo hành.
                    </span>
                    <button
                      onClick={handleSaveResponse}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Lưu & Gửi phản hồi
                    </button>
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-100 mt-6">
                {currentTicket.status === 'DISPATCHING' ? (
                  <>
                    <button
                      onClick={handleCancelRequest}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hủy yêu cầu
                    </button>
                    <button
                      onClick={handleConfirmDispatch}
                      className="w-full sm:w-auto sm:ml-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      Xác nhận chuyển máy
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 italic">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                    Trạng thái yêu cầu bảo hành đã được cập nhật: {currentTicket.status === 'CONFIRMED' ? 'Đã tiếp nhận' : 'Đã hủy'}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Section (Components list) */}
        {currentTicket.type === 'laptop' && currentTicket.components.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-amber-500" />
                Linh kiện cần chuẩn bị (Dự kiến)
              </h2>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                {currentTicket.components.length} sản phẩm được chọn
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentTicket.components.map((part, index) => (
                <div key={index} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{part.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">Mã linh kiện: {part.sku}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold text-slate-400">Số lượng</span>
                    <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                      {part.qty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* YÊU CẦU TỪ KHÁCH HÀNG (TABS) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-4 gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Yêu cầu từ khách hàng
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Click chọn yêu cầu để cập nhật thông tin và trả lời trực tuyến.</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveBottomTab('laptop')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeBottomTab === 'laptop'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                Laptop / PC ({laptopTickets.length})
              </button>
              <button
                onClick={() => setActiveBottomTab('account')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeBottomTab === 'account'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                Tài khoản (Acc) ({accountTickets.length})
              </button>
            </div>
          </div>

          {/* List display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeBottomTab === 'laptop' ? laptopTickets : accountTickets).map((ticket) => {
              const isSelected = ticket.id === selectedTicketId
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 group relative ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/20 shadow-md ring-1 ring-purple-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-purple-600 transition-colors">
                        #{ticket.id} • {ticket.orderId}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 mt-1">
                        {ticket.device}
                      </h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ticket.status === 'DISPATCHING'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : ticket.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {ticket.status === 'DISPATCHING' ? 'Chờ tiếp nhận' : ticket.status === 'CONFIRMED' ? 'Đã tiếp nhận' : 'Đã hủy'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {ticket.description}
                  </p>

                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400 font-medium border-t border-slate-100/80 pt-2">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-400" />
                      File đính kèm: {ticket.attachmentsCount}
                    </span>
                    <span>Khởi tạo: {ticket.createdAt.split(' ')[0]}</span>
                  </div>
                </div>
              )
            })}
            {(activeBottomTab === 'laptop' ? laptopTickets : accountTickets).length === 0 && (
              <div className="col-span-2 py-8 text-center text-slate-400 text-sm font-medium">
                Không tìm thấy yêu cầu bảo hành nào thuộc danh mục này.
              </div>
            )}
          </div>

          <div className="mt-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 mb-3">Yêu cầu từ khách hàng</h2>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full text-left rounded-xl border px-3 py-3 transition-all ${
                    selectedTicketId === ticket.id
                      ? 'border-blue-400 bg-blue-50/40'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">
                    #{ticket.id} • {ticket.orderId}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ticket.description}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {ticket.status === 'DISPATCHING' ? 'Chờ tiếp nhận' : ticket.status === 'CONFIRMED' ? 'Đã tiếp nhận' : 'Đã hủy'} • {ticket.createdAt}
                  </p>
                </button>
              ))}

              {tickets.length === 0 && (
                <p className="text-xs text-slate-500">Chưa có yêu cầu mới từ khách hàng.</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* DETAIL MODAL (TECHNICAL INFORMATION & MEDIA) */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-[900px] w-full max-h-[85vh] overflow-y-auto flex flex-col p-6 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Chi tiết kỹ thuật
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">Ticket: #{currentTicket.id}</h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap rounded-2xl border border-slate-300 px-4 py-3 text-sm md:text-base">
                <p className="shrink-0">
                  Trạng thái:{' '}
                  <span className="font-semibold">
                    {currentTicket.status === 'DISPATCHING'
                      ? 'Chờ tiếp nhận'
                      : currentTicket.status === 'CONFIRMED'
                      ? 'Đã xử lý'
                      : 'Đã hủy'}
                  </span>
                </p>
                <p className="shrink-0">
                  Ngày gửi: <span className="font-semibold">{currentTicket.createdAt}</span>
                </p>
                <p className="shrink-0">
                  Sản phẩm:{' '}
                  <span className="font-semibold">{currentTicket.type === 'account' ? 'Account' : 'Laptop/PC'}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <section className="rounded-3xl border border-slate-300 p-5">
                  <h2 className="text-xl font-extrabold uppercase text-slate-900">Chi tiết yêu cầu</h2>

                  <div className="mt-5 space-y-3 text-base text-slate-800">
                    <p>
                      Loại sản phẩm:{' '}
                      <span className="font-semibold">{currentTicket.type === 'account' ? 'Account' : 'Laptop/PC'}</span>
                    </p>
                      <p>
                        Tên sản phẩm: <span className="font-semibold">{currentTicket.device}</span>
                      </p>
                      {currentTicket.type === 'laptop' && currentTicket.techName && (
                        <p>
                          Kỹ thuật viên chỉ định: <span className="font-semibold">{currentTicket.techName}</span>
                        </p>
                      )}
                    <p>Mô tả chi tiết:</p>
                    <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-base leading-relaxed text-slate-700">
                      {currentTicket.description || 'Khách hàng chưa bổ sung mô tả chi tiết.'}
                    </p>
                    <p>Hình ảnh/ video sản phẩm lỗi:</p>
                      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                        {currentTicket.attachments.length > 0 ? (
                          currentTicket.attachments.map((attachment, index) => {
                          const previewSource = resolveAttachmentPreviewSource(attachment, mediaByName)

                          if (!previewSource) {
                              return (
                                <div key={`${currentTicket.id}-${attachment.name}-${index}`} className="rounded-xl border border-slate-200 bg-white p-3">
                                  <p className="text-xs font-semibold text-slate-600">
                                    File #{index + 1}: {attachment.name}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    Không thể hiển thị trực tiếp file cũ này. Vui lòng yêu cầu khách hàng tải lại file để xem preview.
                                  </p>
                                </div>
                              )
                            }

                            return (
                              <div key={`${currentTicket.id}-${attachment.name}-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                <div className="border-b border-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
                                  {attachment.name}
                                </div>
                                {attachment.isVideo ? (
                                  <video src={previewSource} controls className="h-auto max-h-[220px] w-full bg-black" />
                                ) : (
                                  <img src={previewSource} alt={attachment.name} className="h-auto max-h-[220px] w-full object-contain bg-white" />
                                )}
                              </div>
                            )
                          })
                      ) : (
                        <p>Không có file đính kèm.</p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-300 p-5">
                  <h2 className="text-xl font-extrabold uppercase text-slate-900">Phản hồi của nhân viên</h2>

                  {currentTicket.staffResponse?.trim() ? (
                    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-200 text-sm font-bold text-emerald-800">
                          {(currentTicket.techName?.[0] || 'N').toUpperCase()}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-slate-900">{currentTicket.techName || 'Nhân viên hỗ trợ'}</p>
                          <p className="text-xs text-slate-600">Phản hồi đã được gửi cho khách hàng.</p>
                          {currentTicket.type === 'laptop' && currentTicket.techName && (
                            <p className="text-xs text-slate-600">
                              Kỹ thuật viên chỉ định: <span className="font-semibold text-slate-700">{currentTicket.techName}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="mt-4 whitespace-pre-line rounded-xl border border-emerald-100 bg-white p-3 text-sm leading-relaxed text-slate-700">
                        {currentTicket.staffResponse}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm font-semibold text-amber-800">Nhân viên chưa phản hồi yêu cầu này.</p>
                      <p className="mt-2 text-sm text-amber-700">
                        Vui lòng chờ thêm, bộ phận hỗ trợ sẽ phản hồi trong thời gian sớm nhất.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Đóng chi tiết
              </button>
            </div>

          </div>
        </div>
      )}
    </StaffLayout>
  )
}