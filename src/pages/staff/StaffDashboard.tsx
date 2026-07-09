import { useEffect, useMemo, useState } from 'react'
import {
  Headphones,
  Package,
  Shield,
  ShoppingCart,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'
import StaffLayout from '@/layouts/StaffLayout'
import { getAllProducts } from '@/services/staff-product.service'
import { getLowStockAlerts } from '@/services/inventory.service'
import {
  getAllTickets,
  getSupportStats,
  type SupportTicket,
} from '@/services/support.service'

interface StatCard {
  title: string
  value: string
  note: string
  icon: LucideIcon
  bg: string
  text: string
}

const quickActions = [
  {
    title: 'Quản lý sản phẩm',
    description: 'Thêm, sửa và cập nhật sản phẩm laptop, PC và account.',
    href: '/staff/products',
    icon: Package,
  },
  {
    title: 'Quản lý kho',
    description: 'Theo dõi tồn kho, cảnh báo sắp hết hàng và lịch sử kho.',
    href: '/staff/inventory',
    icon: Warehouse,
  },
  {
    title: 'Quản lý đơn hàng',
    description: 'Kiểm tra thanh toán và đối soát các đơn cần xử lý.',
    href: '/staff/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Quản lý bảo hành',
    description: 'Tiếp nhận và xử lý ticket bảo hành từ khách hàng.',
    href: '/staff/warranty',
    icon: Shield,
  },
  {
    title: 'Hỗ trợ khách hàng',
    description: 'Xử lý yêu cầu và phản hồi trực tuyến cho khách hàng.',
    href: '/staff/tickets',
    icon: Headphones,
  },
]

function formatNumber(value: number) {
  return value.toLocaleString('vi-VN')
}

export default function StaffDashboard() {
  const [productCount, setProductCount] = useState(0)
  const [lowStockCount, setLowStockCount] = useState(0)
  const [openTicketCount, setOpenTicketCount] = useState(0)
  const [recentTickets, setRecentTickets] = useState<SupportTicket[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true)
      setError('')

      try {
        const [productRes, lowStockRes, supportStatsRes, ticketsRes] =
          await Promise.all([
            getAllProducts({ is_active: true, limit: 1 }),
            getLowStockAlerts({ threshold: 5 }),
            getSupportStats(),
            getAllTickets({ page: 1, limit: 5 }),
          ])

        const productData = productRes.data?.data
        const supportStats = supportStatsRes.data?.data ?? {}

        setProductCount(productData?.total ?? productData?.products?.length ?? 0)
        setLowStockCount(lowStockRes.data?.data?.total_alerts ?? 0)
        setOpenTicketCount(
          Number(
            supportStats.open ??
              supportStats.in_progress ??
              supportStats.total_open ??
              ticketsRes.data?.data?.total ??
              0
          )
        )
        setRecentTickets(ticketsRes.data?.data?.tickets ?? [])
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Không thể tải dashboard nhân viên.'
        )
        setProductCount(0)
        setLowStockCount(0)
        setOpenTicketCount(0)
        setRecentTickets([])
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const stats = useMemo<StatCard[]>(
    () => [
      {
        title: 'Sản phẩm đang quản lý',
        value: formatNumber(productCount),
        note: 'Đang mở bán',
        icon: Package,
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
      },
      {
        title: 'Tồn kho thấp',
        value: formatNumber(lowStockCount),
        note: 'Cần kiểm tra',
        icon: Warehouse,
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
      },
      {
        title: 'Đơn hàng nội bộ',
        value: 'N/A',
        note: 'Chưa có dữ liệu tổng hợp',
        icon: ShoppingCart,
        bg: 'bg-green-500/10',
        text: 'text-green-400',
      },
      {
        title: 'Ticket cần hỗ trợ',
        value: formatNumber(openTicketCount),
        note: 'Đang chờ xử lý',
        icon: Headphones,
        bg: 'bg-red-500/10',
        text: 'text-red-400',
      },
    ],
    [productCount, lowStockCount, openTicketCount]
  )

  return (
    <StaffLayout
      title="Tổng quan nhân viên"
      staffName="Staff"
      notificationCount={openTicketCount}
    >
      <section className="space-y-6 text-white">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Tổng quan nhân viên
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Theo dõi công việc vận hành, tồn kho và yêu cầu hỗ trợ trong ngày.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className={`${item.bg} border border-white/5 rounded-2xl p-5 shadow-sm text-white`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#909AAB]">{item.title}</p>
                    <p className={`mt-4 text-3xl font-bold ${item.text}`}>
                      {isLoading ? '...' : item.value}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">{item.note}</p>
                  </div>
                  <div className="rounded-xl bg-[#181B22] border border-white/5 p-3">
                    <Icon className={item.text} size={22} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl bg-[#2A2F3B] border border-white/10 p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Công việc nhanh</h2>
              <span className="text-xs text-[#909AAB]">Khu vực nhân viên</span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {quickActions.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    className="rounded-2xl border border-white/5 bg-[#181B22] p-4 transition-all hover:border-green-500/30 hover:bg-[#202530]"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400 border border-green-500/20">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>
                  </a>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl bg-[#2A2F3B] border border-white/10 p-5 shadow-sm text-white">
            <h2 className="text-lg font-bold text-white">Ticket gần đây</h2>

            <div className="mt-5 space-y-4">
              {isLoading ? (
                <div className="rounded-xl bg-[#181B22] border border-white/5 p-4 text-sm text-slate-400">
                  Đang tải ticket...
                </div>
              ) : recentTickets.length === 0 ? (
                <div className="rounded-xl bg-[#181B22] border border-white/5 p-4 text-sm text-slate-400">
                  Chưa có ticket cần xử lý.
                </div>
              ) : (
                recentTickets.map((ticket) => (
                  <a
                    key={ticket._id}
                    href="/staff/warranty"
                    className="block rounded-xl bg-[#181B22] border border-white/5 p-4 transition hover:bg-[#202530]"
                  >
                    <p className="font-semibold text-white">
                      {ticket.ticket_code ?? ticket._id} - {ticket.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {ticket.status} - {ticket.product_name ?? 'Sản phẩm'}
                    </p>
                  </a>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </StaffLayout>
  )
}
