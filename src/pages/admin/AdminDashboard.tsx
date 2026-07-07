import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  BarChart3,
  Clock3,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react'
import AdminLayout from '@/layouts/AdminLayout'
import { getDashboard, getRevenueReport, type AdminDashboardResponse } from '@/services/admin.service'

interface ChartPoint {
  label: string
  value: number
}

function formatPrice(price?: number) {
  return `${(price ?? 0).toLocaleString('vi-VN')}đ`
}

function formatDate(value?: string) {
  if (!value) return 'Chưa có thời gian'
  return new Date(value).toLocaleString('vi-VN')
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null)
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [range, setRange] = useState('7')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadDashboard = async () => {
    setIsLoading(true)
    setError('')
    try {
      const now = new Date()
      const from = new Date(now)
      from.setDate(now.getDate() - Number(range) + 1)

      const [dashboardRes, reportRes] = await Promise.all([
        getDashboard(),
        getRevenueReport({
          from: from.toISOString().slice(0, 10),
          to: now.toISOString().slice(0, 10),
        }),
      ])

      setDashboard(dashboardRes.data?.data ?? null)
      setChartData(
        (reportRes.data?.data?.data ?? []).map((item) => ({
          label: item._id,
          value: item.revenue ?? 0,
        }))
      )
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải dashboard.')
      setDashboard(null)
      setChartData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [range])

  const summary = dashboard?.summary
  const revenue = dashboard?.revenue
  const maxChartValue = useMemo(
    () => Math.max(1, ...chartData.map((item) => item.value)),
    [chartData]
  )

  return (
    <AdminLayout title="Tổng quan hệ thống" notificationCount={summary?.pending_orders ?? 0}>
      <div className="mx-auto max-w-[1840px] space-y-6 font-sans text-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-blue-600">Admin</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
              Tổng quan hệ thống
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Theo dõi doanh thu, đơn hàng, khách hàng và sản phẩm đang hoạt động.
            </p>
          </div>
          <button
            type="button"
            onClick={loadDashboard}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" />
            Tải lại
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Tổng doanh thu tháng này"
            value={formatPrice(revenue?.this_month)}
            note={`Tháng trước: ${formatPrice(revenue?.last_month)}`}
            icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
          />
          <MetricCard
            label="Tổng đơn hàng"
            value={(summary?.total_orders ?? 0).toLocaleString('vi-VN')}
            note="Tất cả trạng thái"
            icon={<ShoppingCart className="h-6 w-6 text-emerald-600" />}
          />
          <MetricCard
            label="Tổng khách hàng"
            value={(summary?.total_customers ?? 0).toLocaleString('vi-VN')}
            note="Role customer"
            icon={<Users className="h-6 w-6 text-violet-600" />}
          />
          <MetricCard
            label="Sản phẩm đang bán"
            value={(summary?.total_products ?? 0).toLocaleString('vi-VN')}
            note="is_active = true"
            icon={<Package className="h-6 w-6 text-amber-600" />}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatusCard
            label="Đơn chờ xử lý"
            value={summary?.pending_orders ?? 0}
            icon={<Clock3 className="h-5 w-5" />}
            className="bg-blue-50 text-blue-700"
          />
          <StatusCard
            label="Đơn hoàn tất"
            value={summary?.completed_orders ?? 0}
            icon={<BarChart3 className="h-5 w-5" />}
            className="bg-emerald-50 text-emerald-700"
          />
          <StatusCard
            label="Đơn đã hủy"
            value={summary?.cancelled_orders ?? 0}
            icon={<XCircle className="h-5 w-5" />}
            className="bg-rose-50 text-rose-700"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Doanh thu theo ngày</h2>
                <p className="text-sm text-slate-500">Thống kê doanh thu theo từng ngày trong khoảng đã chọn.</p>
              </div>
              <select
                value={range}
                onChange={(event) => setRange(event.target.value)}
                className="h-10 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              >
                <option value="7">7 ngày qua</option>
                <option value="30">30 ngày qua</option>
                <option value="90">3 tháng qua</option>
              </select>
            </div>

            <div className="flex h-[260px] items-end gap-3 rounded-2xl bg-slate-50 p-4">
              {chartData.length === 0 ? (
                <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                  Chưa có dữ liệu doanh thu.
                </div>
              ) : (
                chartData.map((item) => {
                  const height = Math.max(8, (item.value / maxChartValue) * 210)
                  return (
                    <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                      <div className="text-[11px] font-bold text-slate-500">
                        {formatShortMoney(item.value)}
                      </div>
                      <div
                        className="w-full rounded-t-lg bg-blue-500"
                        style={{ height }}
                        title={`${item.label}: ${formatPrice(item.value)}`}
                      />
                      <div className="w-full truncate text-center text-[10px] text-slate-400">
                        {item.label.slice(5)}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">Đơn hàng mới</h2>
            <div className="mt-4 space-y-3">
              {(dashboard?.recent_orders ?? []).length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-400">
                  Chưa có đơn hàng.
                </div>
              ) : (
                dashboard?.recent_orders?.map((order) => {
                  const firstItem = order.items?.[0]
                  return (
                    <div key={order._id} className="rounded-2xl border border-slate-100 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            #{order._id.slice(-8).toUpperCase()} - {firstItem?.product_name || order.user_id?.fullname || order.user_id?.email || 'Đơn hàng'}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                          {order.status ?? 'unknown'}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-black text-blue-600">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}

function formatShortMoney(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`
  return String(value)
}

function MetricCard({
  label,
  value,
  note,
  icon,
}: {
  label: string
  value: string
  note: string
  icon: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <div className="rounded-2xl bg-slate-50 p-3">{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </div>
  )
}

function StatusCard({
  label,
  value,
  icon,
  className,
}: {
  label: string
  value: number
  icon: ReactNode
  className: string
}) {
  return (
    <div className={`rounded-2xl p-5 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">{label}</p>
        {icon}
      </div>
      <p className="mt-4 text-3xl font-black">{value.toLocaleString('vi-VN')}</p>
    </div>
  )
}
