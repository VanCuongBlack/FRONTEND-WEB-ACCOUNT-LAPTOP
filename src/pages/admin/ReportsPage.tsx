import { useMemo, useState } from 'react'
import {
  Download,
  FileText,
  Search,
  TrendingUp,
  ShoppingCart,
  Package,
} from 'lucide-react'
import AdminLayout from '@/layouts/AdminLayout'

type ProductType = 'all' | 'laptop' | 'account'
type RangeType = '7days' | '30days' | 'month' | 'year'

interface RevenueItem {
  id: number
  productName: string
  serial: string
  type: 'laptop' | 'account'
  revenue: number
  orders: number
  status: 'Hoàn thành' | 'Đang xử lý'
}

interface ExportLog {
  id: number
  name: string
  date: string
  type: string
  status: 'Hoàn thành' | 'Đang xử lý'
}

const revenueData: RevenueItem[] = [
  {
    id: 1,
    productName: 'ChatGPT Plus 1 Tháng',
    serial: 'GPT-8X29-XK92',
    type: 'account',
    revenue: 3000000,
    orders: 15,
    status: 'Hoàn thành',
  },
  {
    id: 2,
    productName: 'Dell Latitude 7420 i7',
    serial: 'DELL-7420-I7',
    type: 'laptop',
    revenue: 22500000,
    orders: 1,
    status: 'Hoàn thành',
  },
  {
    id: 3,
    productName: 'Netflix Premium 4K',
    serial: 'NF-4K-001',
    type: 'account',
    revenue: 1650000,
    orders: 30,
    status: 'Đang xử lý',
  },
]

const exportLogs: ExportLog[] = [
  {
    id: 1,
    name: 'Report_ChatGPT_T1',
    date: '30/04/2026',
    type: 'Tài chính',
    status: 'Hoàn thành',
  },
  {
    id: 2,
    name: 'Report_Laptop_T5',
    date: '02/05/2026',
    type: 'Doanh thu',
    status: 'Hoàn thành',
  },
]

function formatPrice(price: number) {
  return `${price.toLocaleString('vi-VN')}đ`
}

export default function ReportsPage() {
  const [range, setRange] = useState<RangeType>('30days')
  const [type, setType] = useState<ProductType>('all')
  const [keyword, setKeyword] = useState('')

  const filteredRevenue = useMemo(() => {
    const search = keyword.toLowerCase().trim()

    return revenueData.filter((item) => {
      const matchType = type === 'all' || item.type === type

      const matchSearch =
        !search ||
        item.productName.toLowerCase().includes(search) ||
        item.serial.toLowerCase().includes(search)

      return matchType && matchSearch
    })
  }, [type, keyword])

  const totalRevenue = filteredRevenue.reduce((sum, item) => sum + item.revenue, 0)
  const totalOrders = filteredRevenue.reduce((sum, item) => sum + item.orders, 0)
  const totalProducts = filteredRevenue.length

  return (
    <AdminLayout title="Báo cáo doanh thu">
      <section className="mx-auto max-w-[1200px] space-y-6 font-sans">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Báo cáo doanh thu
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Theo dõi doanh thu theo sản phẩm, loại sản phẩm và thời gian.
            </p>
          </div>

          <button
            type="button"
            className="flex h-[44px] items-center justify-center gap-2 rounded-xl bg-green-600 px-6 text-sm font-semibold text-white hover:bg-green-700"
          >
            <Download size={18} />
            Export
          </button>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as RangeType)}
              className="h-[46px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value as ProductType)}
              className="h-[46px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-600"
            >
              <option value="all">Tất cả sản phẩm</option>
              <option value="laptop">Laptop / PC</option>
              <option value="account">Account số</option>
            </select>

            <div className="flex h-[46px] items-center gap-3 rounded-xl border border-gray-300 px-4">
              <Search size={18} className="text-gray-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm báo cáo..."
                className="h-full flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-blue-50 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Tổng doanh thu</p>
              <TrendingUp className="text-blue-600" size={22} />
            </div>
            <p className="mt-4 text-3xl font-bold text-blue-700">
              {formatPrice(totalRevenue)}
            </p>
          </div>

          <div className="rounded-2xl bg-green-50 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Tổng đơn hàng</p>
              <ShoppingCart className="text-green-600" size={22} />
            </div>
            <p className="mt-4 text-3xl font-bold text-green-700">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-2xl bg-yellow-50 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Sản phẩm có doanh thu</p>
              <Package className="text-yellow-600" size={22} />
            </div>
            <p className="mt-4 text-3xl font-bold text-yellow-700">
              {totalProducts}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-gray-900">
            Doanh thu theo sản phẩm
          </h2>

          <div className="overflow-x-auto">
            <div className="min-w-[900px] overflow-hidden rounded-2xl border border-gray-100">
              <div className="grid grid-cols-[1.5fr_1.2fr_120px_140px_120px_130px] bg-gray-100 px-5 py-4 text-sm font-bold">
                <span>Sản phẩm</span>
                <span>Serial Account</span>
                <span>Loại</span>
                <span>Doanh thu</span>
                <span>Đơn hàng</span>
                <span>Trạng thái</span>
              </div>

              {filteredRevenue.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1.5fr_1.2fr_120px_140px_120px_130px] items-center border-t border-gray-100 px-5 py-4 text-sm"
                >
                  <span className="font-semibold">{item.productName}</span>
                  <span className="text-gray-600">{item.serial}</span>
                  <span>{item.type === 'laptop' ? 'Laptop' : 'Account'}</span>
                  <span className="font-bold text-green-600">
                    {formatPrice(item.revenue)}
                  </span>
                  <span>{item.orders}</span>
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === 'Hoàn thành'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}

              {filteredRevenue.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-500">
                  Không có dữ liệu báo cáo.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-gray-900">
            Lịch sử xuất file
          </h2>

          <div className="overflow-x-auto">
            <div className="min-w-[760px] overflow-hidden rounded-2xl border border-gray-100">
              <div className="grid grid-cols-[1.5fr_140px_140px_140px_120px] bg-gray-100 px-5 py-4 text-sm font-bold">
                <span>Tên</span>
                <span>Ngày</span>
                <span>Loại</span>
                <span>Trạng thái</span>
                <span>Thao tác</span>
              </div>

              {exportLogs.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1.5fr_140px_140px_140px_120px] items-center border-t border-gray-100 px-5 py-4 text-sm"
                >
                  <span className="font-semibold">{item.name}</span>
                  <span>{item.date}</span>
                  <span>{item.type}</span>
                  <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {item.status}
                  </span>
                  <button
                    type="button"
                    className="w-fit rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                  >
                    <FileText size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}