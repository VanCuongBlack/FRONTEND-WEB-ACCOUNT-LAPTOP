import { useState, useEffect } from 'react'
import {
  ShoppingCart, LayoutDashboard, TrendingUp,
  Laptop, Bot, ChevronDown, ArrowUpRight,
} from 'lucide-react'
import AdminLayout from '@/layouts/AdminLayout'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DashboardStats {
  revenue: number
  orders: number
  products: number
  customers: number
  revenueChange: number
  ordersChange: number
  newProducts: number
  newCustomers: number
}

interface RecentOrder {
  id: string
  name: string
  time: string
  amount: number
  type: 'laptop' | 'account'
}

interface ActivityLog {
  initials: string
  bg: string
  name: string
  action: string
  time: string
  status: 'success' | 'pending' | 'cancelled'
}

interface ChartPoint { label: string; value: number }

// ─── Defaults (hiển thị 0 khi chưa có API) ────────────────────────────────────

const DEFAULT_STATS: DashboardStats = {
  revenue: 1852400000,
  orders: 1420,
  products: 850,
  customers: 3200,
  revenueChange: 12.5,
  ordersChange: 8.2,
  newProducts: 14,
  newCustomers: 145,
}

const DEFAULT_CHART: ChartPoint[] = [
  { label: 'T2', value: 12000000 },
  { label: 'T3', value: 15000000 },
  { label: 'T4', value: 18000000 },
  { label: 'T5', value: 14000000 },
  { label: 'T6', value: 22000000 },
  { label: 'T7', value: 35000000 },
  { label: 'CN', value: 28000000 },
]

// ─── API fetch functions ────────────────────────────────────────────────────────
// import api from '@/services/api'

async function fetchDashboardStats(): Promise<DashboardStats> {
  return DEFAULT_STATS
}

async function fetchRecentOrders(): Promise<RecentOrder[]> {
  return [
    { id: 'LAP-87012', name: 'Laptop Dell Gaming G15 5530', time: '10 phút trước', amount: 24990000, type: 'laptop' },
    { id: 'ACC-90124', name: 'Tài khoản Netflix Premium 12 Tháng', time: '25 phút trước', amount: 540000, type: 'account' },
    { id: 'LAP-85190', name: 'MacBook Pro M3 Max 14-inch', time: '1 giờ trước', amount: 69990000, type: 'laptop' },
    { id: 'ACC-88219', name: 'YouTube Premium 1 Năm', time: '2 giờ trước', amount: 390000, type: 'account' },
    { id: 'ACC-87301', name: 'Spotify Premium 1 Tháng', time: '4 giờ trước', amount: 190000, type: 'account' },
  ]
}

async function fetchActivityLogs(): Promise<ActivityLog[]> {
  return [
    { initials: 'NH', bg: 'bg-blue-600', name: 'Nguyễn Văn Hưng', action: 'Cập nhật cấu hình Banner trang chủ', time: '5 phút trước', status: 'success' },
    { initials: 'TA', bg: 'bg-emerald-600', name: 'Trần Văn A', action: 'Xác nhận tiếp nhận Ticket bảo hành #TK-87012', time: '12 phút trước', status: 'success' },
    { initials: 'LB', bg: 'bg-purple-600', name: 'Lê Thị B', action: 'Đăng ký tài khoản khách hàng mới', time: '1 giờ trước', status: 'success' },
    { initials: 'HT', bg: 'bg-slate-600', name: 'Hệ thống', action: 'Tự động sao lưu dữ liệu cơ sở dữ liệu', time: '3 giờ trước', status: 'success' },
    { initials: 'KH', bg: 'bg-rose-600', name: 'Khách hàng', action: 'Hủy yêu cầu bảo hành #TK-85112', time: '5 giờ trước', status: 'cancelled' },
  ]
}

async function fetchChartData(range: string): Promise<ChartPoint[]> {
  if (range === '30 ngày qua') {
    return Array.from({ length: 30 }, (_, i) => ({
      label: `${i + 1}`,
      value: Math.floor(Math.random() * 40000000) + 10000000,
    }))
  }
  if (range === '3 tháng qua') {
    return [
      { label: 'Tháng 4', value: 450000000 },
      { label: 'Tháng 5', value: 680000000 },
      { label: 'Tháng 6', value: 720000000 },
    ]
  }
  return DEFAULT_CHART
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function fmtCurrency(n: number): string {
  if (n === 0) return '0'
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace('.0', '') + 'B'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K'
  return n.toLocaleString('vi-VN')
}

function fmtNumber(n: number): string {
  if (n === 0) return '0'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K'
  return n.toLocaleString('vi-VN')
}

const STATUS_STYLE: Record<ActivityLog['status'], { label: string; cls: string }> = {
  success: { label: 'Thành công', cls: 'bg-green-100 text-green-700' },
  pending: { label: 'Chờ xử lý', cls: 'bg-blue-100 text-blue-700' },
  cancelled: { label: 'Đã hủy', cls: 'bg-red-100 text-red-600' },
}

// ─── SVG Line Chart ────────────────────────────────────────────────────────────

function LineChart({ data }: { data: ChartPoint[] }) {
  const W = 560, H = 180
  const pad = { t: 20, b: 24, l: 10, r: 10 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const vals = data.map(d => d.value)
  const max = Math.max(...vals, 1)
  const min = Math.min(...vals, 0)
  const range = max - min || 1

  const pts = vals.map((v, i) => ({
    x: pad.l + (i / Math.max(vals.length - 1, 1)) * iw,
    y: pad.t + (1 - (v - min) / range) * ih,
  }))

  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ')
  const areaPath =
    `M ${pts[0]?.x ?? 0},${pts[0]?.y ?? pad.t} ` +
    pts.slice(1).map(p => `L ${p.x},${p.y}`).join(' ') +
    ` L ${pad.l + iw},${pad.t + ih} L ${pad.l},${pad.t + ih} Z`

  const allZero = vals.every(v => v === 0)

  return (
    <div className="relative w-full h-full">
      {allZero && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xs text-gray-300 select-none">Chưa có dữ liệu</p>
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={allZero ? '0' : '0.15'} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {!allZero && (
          <>
            <path d={areaPath} fill="url(#cg)" />
            <polyline points={polyline} fill="none" stroke="#3b82f6"
              strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3.5"
                fill="white" stroke="#3b82f6" strokeWidth="2" />
            ))}
          </>
        )}
        <line x1={pad.l} y1={pad.t + ih} x2={pad.l + iw} y2={pad.t + ih}
          stroke="#e5e7eb" strokeWidth="1" />
      </svg>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function StatSkeleton() {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-3 bg-gray-200 rounded w-20" />
        <div className="w-9 h-9 rounded-xl bg-gray-200" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-32" />
    </div>
  )
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [chartRange, setChartRange] = useState('7 ngày qua')
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS)
  const [orders, setOrders] = useState<RecentOrder[]>([])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [chartData, setChartData] = useState<ChartPoint[]>(DEFAULT_CHART)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    setLoadingStats(true)
    Promise.all([
      fetchDashboardStats(),
      fetchRecentOrders(),
      fetchActivityLogs(),
      fetchChartData(chartRange),
    ]).then(([s, o, a, c]) => {
      setStats(s); setOrders(o); setActivities(a); setChartData(c)
    }).finally(() => setLoadingStats(false))
  }, [])

  useEffect(() => {
    fetchChartData(chartRange).then(setChartData)
  }, [chartRange])

  const STAT_CARDS = [
    {
      label: 'Doanh thu',
      value: fmtCurrency(stats.revenue),
      sub: `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange}% so với tháng trước`,
      subColor: stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-500',
      bg: 'bg-blue-50', iconBg: 'bg-blue-100', icon: '💰', valueColor: 'text-blue-700',
    },
    {
      label: 'Đơn hàng',
      value: fmtNumber(stats.orders),
      sub: `${stats.ordersChange >= 0 ? '+' : ''}${stats.ordersChange}% hôm nay`,
      subColor: stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-500',
      bg: 'bg-green-50', iconBg: 'bg-green-100', icon: '🚚', valueColor: 'text-green-700',
    },
    {
      label: 'Sản phẩm',
      value: fmtNumber(stats.products),
      sub: stats.newProducts > 0 ? `${stats.newProducts} sản phẩm mới` : 'Chưa có mới',
      subColor: 'text-yellow-600',
      bg: 'bg-yellow-50', iconBg: 'bg-yellow-100', icon: '📋', valueColor: 'text-yellow-700',
    },
    {
      label: 'Khách hàng',
      value: fmtNumber(stats.customers),
      sub: stats.newCustomers > 0 ? `+${stats.newCustomers} tuần này` : 'Chưa có mới',
      subColor: 'text-red-500',
      bg: 'bg-red-50', iconBg: 'bg-red-100', icon: '👤', valueColor: 'text-red-600',
    },
  ]

  return (
    <AdminLayout title="Tổng quan hệ thống" notificationCount={1}>
      <div className="space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800">

        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tổng quan hệ thống</h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi hoạt động kinh doanh, doanh thu và đơn hàng của hệ thống.</p>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingStats
            ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
            : STAT_CARDS.map(card => (
              <div key={card.label} className={`${card.bg} rounded-2xl p-4 lg:p-5`}>
                <div className="flex items-start justify-between mb-3">
                  <p className="text-gray-500 text-xs font-medium">{card.label}</p>
                  <div className={`${card.iconBg} w-9 h-9 rounded-xl flex items-center justify-center text-lg`}>
                    {card.icon}
                  </div>
                </div>
                <p className={`text-2xl lg:text-3xl font-black ${card.valueColor} mb-1`}>
                  {card.value}
                </p>
                <p className={`text-[11px] ${card.subColor} font-medium flex items-center gap-1`}>
                  <TrendingUp className="w-3 h-3" />
                  {card.sub}
                </p>
              </div>
            ))
          }
        </div>

        {/* ── Chart + Recent orders ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Revenue chart */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800">Biểu đồ doanh thu</h2>
              <div className="relative">
                <select value={chartRange} onChange={e => setChartRange(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg bg-white focus:outline-none cursor-pointer">
                  <option>7 ngày qua</option>
                  <option>30 ngày qua</option>
                  <option>3 tháng qua</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="h-44 lg:h-48">
              <LineChart data={chartData} />
            </div>
          </div>

          {/* Recent orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Đơn hàng mới</h2>
            {orders.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6">
                <ShoppingCart className="w-8 h-8 text-gray-200" />
                <p className="text-xs text-gray-300">Chưa có đơn hàng</p>
              </div>
            ) : (
              <div className="flex-1 space-y-3">
                {orders.map(order => {
                  const Icon = order.type === 'laptop' ? Laptop : Bot
                  return (
                    <div key={order.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {order.id} - {order.name}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{order.time}</p>
                      </div>
                      <span className="text-sm font-bold text-blue-600 flex-shrink-0">
                        {fmtCurrency(order.amount)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
            <button className="mt-4 w-full py-2 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 hover:border-blue-200 hover:text-blue-600 transition-all font-medium flex items-center justify-center gap-1">
              Xem tất cả đơn hàng <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ── Activity table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Hoạt động gần đây</h2>
            <button className="text-xs text-blue-600 hover:underline font-medium">
              Tải xuống báo cáo
            </button>
          </div>

          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12">
              <LayoutDashboard className="w-8 h-8 text-gray-200" />
              <p className="text-xs text-gray-300">Chưa có hoạt động nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['Người dùng', 'Hành động', 'Thời gian', 'Trạng thái'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activities.map((act, i) => {
                    const s = STATUS_STYLE[act.status]
                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors last:border-0">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full ${act.bg} flex items-center justify-center flex-shrink-0`}>
                              <span className="text-white text-[10px] font-bold">{act.initials}</span>
                            </div>
                            <span className="text-sm text-gray-700 font-medium whitespace-nowrap">{act.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{act.action}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">{act.time}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.cls}`}>
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  )
}
