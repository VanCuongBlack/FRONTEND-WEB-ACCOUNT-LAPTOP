import { useState } from 'react'
import {
  MapPin, Users, Wrench, ShieldAlert, Edit2, CheckCircle2,
  Trash2, Plus, Users2, FileText, ChevronRight, Check
} from 'lucide-react'
import StaffLayout from '@/layouts/StaffLayout'

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

const REQUIRED_COMPONENTS: ComponentPart[] = [
  { name: 'Mainboard Dell G15', qty: '01', sku: 'MB-DEL-G15' },
  { name: 'Bàn phím RGB Dell', qty: '01', sku: 'KB-DEL-RGB' },
  { name: 'Adapter 180W Dell', qty: '01', sku: 'PWR-DEL-180W' },
]

// ─── Component ─────────────────────────────────────────────────────────────────

export default function WarrantyManagementPage() {
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES)
  const [selectedBranchId, setSelectedBranchId] = useState<string>('b-1')
  const [techName, setTechName] = useState<string>('Trần Văn A')
  const [ticketStatus, setTicketStatus] = useState<'DISPATCHING' | 'CONFIRMED' | 'CANCELLED'>('DISPATCHING')

  const handleChangeTech = () => {
    const newName = prompt('Nhập tên kỹ thuật viên mới:', techName)
    if (newName && newName.trim() !== '') {
      setTechName(newName.trim())
    }
  }

  const handleConfirmDispatch = () => {
    setTicketStatus('CONFIRMED')
    alert('Đã xác nhận chuyển máy đến chi nhánh và phân phối linh kiện thành công!')
  }

  const handleCancelRequest = () => {
    if (confirm('Bạn có chắc chắn muốn hủy yêu cầu bảo hành này không?')) {
      setTicketStatus('CANCELLED')
    }
  }

  const handleCreateRequest = () => {
    alert('Mở cửa sổ tạo yêu cầu bảo hành mới cho thiết bị khách hàng...')
  }

  const handleSyncBranches = () => {
    alert('Đang đồng bộ trạng thái nhân sự và linh kiện giữa các chi nhánh...')
  }

  return (
    <StaffLayout title="Quản lý bảo hành" notificationCount={3}>
      <div className="space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800">
        
        {/* Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý bảo hành laptop</h1>
            <p className="text-sm text-slate-500 mt-1">Hệ thống điều phối linh kiện và kỹ thuật viên bảo hành liên chi nhánh.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateRequest}
              className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Yêu cầu mới
            </button>
            <button
              onClick={handleSyncBranches}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Users2 className="w-4 h-4" />
              Điều phối CN
            </button>
          </div>
        </div>

        {/* Two Column Grid */}
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
              {/* Fake Map Grid lines background */}
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
                    <span className="text-xs font-bold text-blue-600 tracking-wider">YÊU CẦU BẢO HÀNH CHỜ XỬ LÝ</span>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">Mã Ticket: #TK-88219</h2>
                    <p className="text-sm text-slate-500 mt-1 font-semibold">Thiết bị bảo hành: Dell Gaming G15</p>
                  </div>
                  <div>
                    {ticketStatus === 'DISPATCHING' && (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider animate-pulse">
                        Đang điều phối
                      </span>
                    )}
                    {ticketStatus === 'CONFIRMED' && (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                        Đã xác nhận
                      </span>
                    )}
                    {ticketStatus === 'CANCELLED' && (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wider">
                        Đã hủy yêu cầu
                      </span>
                    )}
                  </div>
                </div>

                {/* Status & Notes Card */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>Mô tả chi tiết sự cố</span>
                    <span>Khởi tạo lúc: 14:30 Hôm nay</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium mt-3 leading-relaxed">
                    Khách hàng phản hồi phím bị kẹt cơ và lỗi kết nối cổng HDMI. Cần kỹ thuật viên hỗ trợ kiểm tra chi tiết, thay phím cơ mới và linh kiện kết nối HDMI nếu Mainboard bị hỏng.
                  </p>
                </div>

                {/* Assigned Tech Card */}
                <div className="bg-blue-50/30 rounded-xl p-4 border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kỹ thuật viên chỉ định</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">{techName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Dự kiến thời gian di chuyển: <span className="font-bold text-blue-600">15 phút</span></p>
                    </div>
                  </div>
                  {ticketStatus === 'DISPATCHING' && (
                    <button
                      onClick={handleChangeTech}
                      className="p-2 rounded-lg hover:bg-blue-100/60 text-slate-500 hover:text-blue-600 transition-colors"
                      title="Thay đổi kỹ thuật viên"
                    >
                      <Edit2 className="w-4.5 h-4.5" />
                    </button>
                  )}
                </div>

              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-100 mt-8">
                {ticketStatus === 'DISPATCHING' ? (
                  <>
                    <button
                      onClick={handleCancelRequest}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hủy yêu cầu
                    </button>
                    <button
                      onClick={handleConfirmDispatch}
                      className="w-full sm:w-auto sm:ml-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      Xác nhận chuyển máy
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 italic">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                    Trạng thái yêu cầu bảo hành đã được cập nhật cố định.
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* ─── Bottom Section (Components list) ─── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-amber-500" />
              Linh kiện cần chuẩn bị (Dự kiến)
            </h2>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
              3 sản phẩm được chọn
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REQUIRED_COMPONENTS.map((part, index) => (
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

      </div>
    </StaffLayout>
  )
}
