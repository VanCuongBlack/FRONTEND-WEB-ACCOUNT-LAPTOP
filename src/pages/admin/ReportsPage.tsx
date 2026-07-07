import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Download,
  Package,
  RefreshCw,
  Search,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'
import AdminLayout from '@/layouts/AdminLayout'
import { getReport, type RevenueReportResponse } from '@/services/admin.service'

type ReportType = 'revenue' | 'products' | 'customers'
type RangeType = 'day' | 'week' | 'month' | '30days' | 'year'
type ReportRowItem = {
  _id: string
  revenue?: number
  order_count?: number
  product_name?: string
  product_type?: 'physical' | 'digital'
  total_sold?: number
  total_revenue?: number
  total_spent?: number
}

function formatPrice(price?: number) {
  return `${(price ?? 0).toLocaleString('vi-VN')}đ`
}

function getDateRange(range: RangeType) {
  const now = new Date()
  const from = new Date(now)

  if (range === 'week') from.setDate(now.getDate() - 6)
  if (range === '30days') from.setDate(now.getDate() - 29)
  if (range === 'month') from.setDate(1)
  if (range === 'year') {
    from.setMonth(0)
    from.setDate(1)
  }

  from.setHours(0, 0, 0, 0)
  now.setHours(23, 59, 59, 999)

  return {
    from: from.toISOString(),
    to: now.toISOString(),
  }
}

function csvEscape(value: unknown) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

export default function ReportsPage() {
  const [range, setRange] = useState<RangeType>('month')
  const [type, setType] = useState<ReportType>('revenue')
  const [keyword, setKeyword] = useState('')
  const [report, setReport] = useState<RevenueReportResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadReport = async () => {
    setIsLoading(true)
    setError('')
    try {
      const dates = getDateRange(range)
      const res = await getReport({ ...dates, type })
      setReport(res.data?.data ?? null)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải báo cáo.')
      setReport(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReport()
  }, [range, type])

  const rows = useMemo(() => {
    const search = keyword.trim().toLowerCase()
    const source = (type === 'customers'
      ? report?.top_customers ?? []
      : report?.data ?? []) as ReportRowItem[]

    if (!search) return source

    return source.filter((item) =>
      `${item._id} ${'product_name' in item ? item.product_name ?? '' : ''} ${
        'product_type' in item ? item.product_type ?? '' : ''
      }`
        .toLowerCase()
        .includes(search)
    )
  }, [keyword, report, type])

  const totalRevenue =
    report?.total_revenue ??
    rows.reduce((sum, item) => {
      if (type === 'customers') return sum + (item.total_spent ?? 0)
      return sum + (item.revenue ?? item.total_revenue ?? 0)
    }, 0)

  const totalOrders =
    report?.total_orders ??
    rows.reduce((sum, item) => {
      if (type === 'customers') return sum + (item.order_count ?? 0)
      return sum + (item.total_sold ?? 0)
    }, 0)

  const handleExportCsv = () => {
    const header =
      type === 'customers'
        ? ['Khách hàng', 'Loại', 'Chi tiêu', 'Số đơn']
        : ['Tên / Ngày', 'Loại', 'Doanh thu', 'Số đơn / Lượt bán']

    const body = rows.map((item) => {
      if (type === 'customers') {
        return [item._id, 'customer', item.total_spent ?? 0, item.order_count ?? 0]
      }

      return [
        item.product_name || item._id,
        item.product_type || 'revenue',
        item.revenue ?? item.total_revenue ?? 0,
        item.order_count ?? item.total_sold ?? 0,
      ]
    })

    const csv = [header, ...body]
      .map((line) => line.map(csvEscape).join(','))
      .join('\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bao-cao-${type}-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout title="Báo cáo">
      <section className="mx-auto max-w-[1840px] space-y-6 font-sans">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Báo cáo hệ thống</h1>
            <p className="mt-1 text-sm text-gray-500">
              Theo dõi doanh thu, sản phẩm bán chạy và nhóm khách hàng theo từng khoảng thời gian.
            </p>
          </div>

          <button
            type="button"
            onClick={loadReport}
            className="flex h-[44px] items-center justify-center gap-2 rounded-xl bg-green-600 px-6 text-sm font-semibold text-white hover:bg-green-700"
          >
            <RefreshCw size={18} />
            Tải lại
          </button>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <select
              value={range}
              onChange={(event) => setRange(event.target.value as RangeType)}
              className="h-[46px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
            >
              <option value="day">Hôm nay</option>
              <option value="week">7 ngày qua</option>
              <option value="month">Tháng này</option>
              <option value="30days">30 ngày qua</option>
              <option value="year">Năm nay</option>
            </select>

            <select
              value={type}
              onChange={(event) => setType(event.target.value as ReportType)}
              className="h-[46px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
            >
              <option value="revenue">Doanh thu theo ngày</option>
              <option value="products">Sản phẩm bán chạy</option>
              <option value="customers">Khách hàng</option>
            </select>

            <div className="flex h-[46px] items-center gap-3 rounded-xl border border-gray-300 px-4">
              <Search size={18} className="text-gray-400" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm trong báo cáo..."
                className="h-full flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard
            label="Tổng doanh thu"
            value={formatPrice(totalRevenue)}
            icon={<TrendingUp className="text-blue-600" size={22} />}
            color="blue"
          />
          <SummaryCard
            label="Tổng đơn / lượt bán"
            value={String(totalOrders)}
            icon={<ShoppingCart className="text-green-600" size={22} />}
            color="green"
          />
          <SummaryCard
            label="Dòng dữ liệu"
            value={String(rows.length)}
            icon={<Package className="text-yellow-600" size={22} />}
            color="yellow"
          />
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900">
              {type === 'revenue'
                ? 'Doanh thu theo ngày'
                : type === 'products'
                  ? 'Sản phẩm bán chạy'
                  : 'Khách hàng nổi bật'}
            </h2>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={rows.length === 0}
              className="flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              Xuất CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[760px] overflow-hidden rounded-2xl border border-gray-100">
              <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] bg-gray-100 px-5 py-4 text-sm font-bold">
                <span>
                  {type === 'revenue'
                    ? 'Ngày'
                    : type === 'products'
                      ? 'Sản phẩm'
                      : 'Khách hàng'}
                </span>
                <span>Loại / Mã</span>
                <span>Doanh thu / Chi tiêu</span>
                <span>Đơn / Lượt bán</span>
              </div>

              {isLoading ? (
                <div className="py-10 text-center text-sm text-gray-500">
                  Đang tải báo cáo...
                </div>
              ) : rows.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-500">
                  Không có dữ liệu báo cáo.
                </div>
              ) : (
                rows.map((item) => {
                  if (type === 'customers') {
                    return (
                      <ReportRow
                        key={item._id}
                        name={item._id}
                        typeLabel="customer"
                        amount={formatPrice(item.total_spent)}
                        count={item.order_count ?? 0}
                      />
                    )
                  }

                  return (
                    <ReportRow
                      key={item._id}
                      name={item.product_name || item._id}
                      typeLabel={item.product_type || 'revenue'}
                      amount={formatPrice(item.revenue ?? item.total_revenue)}
                      count={item.order_count ?? item.total_sold ?? 0}
                    />
                  )
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon: ReactNode
  color: 'blue' | 'green' | 'yellow'
}) {
  const colorClass = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
  }[color]

  return (
    <div className={`rounded-2xl p-5 ${colorClass}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        {icon}
      </div>
      <p className="mt-4 text-3xl font-bold">{value}</p>
    </div>
  )
}

function ReportRow({
  name,
  typeLabel,
  amount,
  count,
}: {
  name: string
  typeLabel: string
  amount: string
  count: number
}) {
  return (
    <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center border-t border-gray-100 px-5 py-4 text-sm">
      <span className="font-semibold">{name}</span>
      <span>{typeLabel}</span>
      <span className="font-bold text-green-600">{amount}</span>
      <span>{count}</span>
    </div>
  )
}
