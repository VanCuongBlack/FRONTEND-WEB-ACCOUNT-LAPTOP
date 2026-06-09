import { useState, useMemo } from 'react'
import {
  Search, SlidersHorizontal, Check, Clock, Truck,
  CheckCircle, MoreHorizontal, ChevronLeft, ChevronRight,
  TrendingUp, AlertCircle
} from 'lucide-react'
import StaffLayout from '@/layouts/StaffLayout'

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface Order {
  id: string
  customer: string
  amount: string
  amountRaw: number
  status: 'PENDING' | 'SHIPPING' | 'COMPLETED'
  date: string
}

const INITIAL_ORDERS: Order[] = [
  { id: '#DH001', customer: 'Nguyễn Văn A', amount: '29.990.000đ', amountRaw: 29990000, status: 'PENDING', date: '03/06/2026 14:30' },
  { id: '#DH002', customer: 'Trần Văn B', amount: '42.990.000đ', amountRaw: 42990000, status: 'SHIPPING', date: '03/06/2026 11:15' },
  { id: '#DH003', customer: 'Lê Văn C', amount: '18.990.000đ', amountRaw: 18990000, status: 'COMPLETED', date: '02/06/2026 17:45' },
  { id: '#DH004', customer: 'Hoàng Thị D', amount: '55.000.000đ', amountRaw: 55000000, status: 'COMPLETED', date: '02/06/2026 09:20' },
  { id: '#DH005', customer: 'Phạm Minh E', amount: '250.000đ', amountRaw: 250000, status: 'PENDING', date: '03/06/2026 15:10' },
  { id: '#DH006', customer: 'Đỗ Thị F', amount: '290.000đ', amountRaw: 290000, status: 'SHIPPING', date: '03/06/2026 08:05' },
]

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'SHIPPING' | 'COMPLETED'>('ALL')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  // Action Handlers
  const handleApprove = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'SHIPPING' } : o))
    )
    alert(`Đã duyệt đơn hàng ${orderId} thành công! Trạng thái chuyển sang Đang giao.`)
  }

  const handleComplete = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'COMPLETED' } : o))
    )
    alert(`Đã cập nhật đơn hàng ${orderId} hoàn thành!`)
  }

  const handleViewDetail = (order: Order) => {
    alert(`Thông tin chi tiết Đơn hàng:\nMã đơn: ${order.id}\nKhách hàng: ${order.customer}\nTổng tiền: ${order.amount}\nTrạng thái: ${order.status}\nThời gian đặt: ${order.date}`)
  }

  const handleToggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id))
    }
  }

  const handleToggleSelectOne = (id: string) => {
    setSelectedOrders(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Memoized Filtered List
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase())
      
      const matchTab = activeTab === 'ALL' || o.status === activeTab
      return matchSearch && matchTab
    })
  }, [orders, search, activeTab])

  // Count helper functions
  const countStats = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      shipping: orders.filter(o => o.status === 'SHIPPING').length,
      completed: orders.filter(o => o.status === 'COMPLETED').length,
    }
  }, [orders])

  return (
    <StaffLayout title="Quản lý đơn hàng" notificationCount={3}>
      <div className="space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800">
        
        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý đơn hàng</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý vòng đời đơn hàng, xác nhận giao dịch và cập nhật tiến độ vận chuyển.</p>
        </div>

        {/* ─── Metrics Row (4 Cards) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Tổng đơn hàng */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng đơn hàng</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">12.450</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +12.5% so với hôm qua
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Chờ xác nhận */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chờ xác nhận</p>
              <h3 className="text-2xl font-extrabold text-rose-600 mt-1">320</h3>
              <p className="text-[11px] text-rose-500 font-bold mt-2 flex items-center gap-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Cần xử lý gấp
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center animate-pulse">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Đang giao */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang giao</p>
              <h3 className="text-2xl font-extrabold text-blue-600 mt-1">128</h3>
              <p className="text-xs text-blue-500 font-semibold mt-2">Đúng tiến độ</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Hoàn thành */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hoàn thành</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">8.9K</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-2">85% Tỉ lệ thành công</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ─── Controls & Search Section ─── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Navigation Filter Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ALL'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tất cả ({countStats.all})
            </button>
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'PENDING'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Chờ xác nhận ({countStats.pending})
            </button>
            <button
              onClick={() => setActiveTab('SHIPPING')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'SHIPPING'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Đang giao ({countStats.shipping})
            </button>
            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'COMPLETED'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Hoàn thành ({countStats.completed})
            </button>
          </div>

          {/* Search Inputs & Filter Action */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm mã đơn, khách hàng..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <button
              onClick={() => alert('Chức năng lọc nâng cao đang được phát triển...')}
              className="px-3.5 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-600 flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Bộ lọc nâng cao
            </button>
          </div>
        </div>

        {/* ─── Order Table ─── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã đơn</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày đặt</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400 font-medium">
                      Không tìm thấy đơn hàng phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleToggleSelectOne(order.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-blue-600 hover:underline cursor-pointer" onClick={() => handleViewDetail(order)}>
                          {order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{order.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.status === 'PENDING' && (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 uppercase">
                            Chờ xác nhận
                          </span>
                        )}
                        {order.status === 'SHIPPING' && (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                            Đang giao
                          </span>
                        )}
                        {order.status === 'COMPLETED' && (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">
                            Hoàn thành
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === 'PENDING' && (
                            <button
                              onClick={() => handleApprove(order.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold flex items-center gap-1 transition-all"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Duyệt
                            </button>
                          )}
                          {order.status === 'SHIPPING' && (
                            <button
                              onClick={() => handleComplete(order.id)}
                              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold flex items-center gap-1 transition-all"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Cập nhật
                            </button>
                          )}
                          {order.status === 'COMPLETED' && (
                            <button
                              onClick={() => handleViewDetail(order)}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold transition-all"
                            >
                              Chi tiết
                            </button>
                          )}

                          <button
                            onClick={() => alert('Thao tác phụ: Hủy đơn / In hóa đơn / Lưu ghi chú...')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-xs font-semibold text-slate-500">
              Hiển thị 1 - {filteredOrders.length} của {orders.length} đơn hàng
            </span>

            <div className="flex items-center gap-1.5">
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 cursor-pointer" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold">1</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 font-bold">2</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 font-bold">3</button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 font-bold">312</button>
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </StaffLayout>
  )
}
