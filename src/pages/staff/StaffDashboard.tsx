import {
  Package,
  Warehouse,
  ShoppingCart,
  Users,
  Shield,
  Headphones,
} from 'lucide-react'
import StaffLayout from '@/layouts/StaffLayout'

const stats = [
  {
    title: 'Sản phẩm đang quản lý',
    value: '128',
    note: '+12 sản phẩm mới',
    icon: Package,
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    title: 'Tồn kho thấp',
    value: '8',
    note: 'Cần kiểm tra',
    icon: Warehouse,
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
  },
  {
    title: 'Đơn hàng chờ xử lý',
    value: '24',
    note: 'Hôm nay',
    icon: ShoppingCart,
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
  {
    title: 'Khách cần hỗ trợ',
    value: '6',
    note: 'Ticket mới',
    icon: Headphones,
    bg: 'bg-red-50',
    text: 'text-red-600',
  },
]

const quickActions = [
  {
    title: 'Quản lý sản phẩm',
    description: 'Thêm, sửa, cập nhật sản phẩm laptop và account.',
    href: '/staff/products',
    icon: Package,
  },
  {
    title: 'Quản lý kho',
    description: 'Theo dõi tồn kho, cập nhật số lượng sản phẩm.',
    href: '/staff/inventory',
    icon: Warehouse,
  },
  {
    title: 'Quản lý đơn hàng',
    description: 'Xác nhận đơn hàng, theo dõi trạng thái xử lý.',
    href: '/staff/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Quản lý khách hàng',
    description: 'Xem thông tin khách hàng và lịch sử mua hàng.',
    href: '/staff/customers',
    icon: Users,
  },
  {
    title: 'Quản lý bảo hành',
    description: 'Tiếp nhận và xử lý yêu cầu bảo hành.',
    href: '/staff/warranty',
    icon: Shield,
  },
  {
    title: 'Hỗ trợ khách hàng',
    description: 'Xử lý ticket và yêu cầu hỗ trợ trực tuyến.',
    href: '/staff/tickets',
    icon: Headphones,
  },
]

export default function StaffDashboard() {
  return (
    <StaffLayout title="Tổng quan nhân viên" staffName="Staff">
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tổng quan nhân viên
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi công việc vận hành, đơn hàng, kho và hỗ trợ khách hàng.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.title}
                className={`${item.bg} rounded-2xl p-5 shadow-sm`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{item.title}</p>
                    <p className={`mt-4 text-3xl font-bold ${item.text}`}>
                      {item.value}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      {item.note}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/70 p-3">
                    <Icon className={item.text} size={22} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Công việc nhanh</h2>
              <span className="text-xs text-gray-400">
                Khu vực nhân viên
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {quickActions.map((item) => {
                const Icon = item.icon

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-green-500 hover:bg-green-50"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                      <Icon size={20} />
                    </div>

                    <h3 className="font-bold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      {item.description}
                    </p>
                  </a>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Hoạt động gần đây</h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="font-semibold text-gray-800">
                  Đơn hàng #DH12345 chờ xác nhận
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  5 phút trước
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="font-semibold text-gray-800">
                  Sản phẩm MacBook Pro M3 sắp hết hàng
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  20 phút trước
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="font-semibold text-gray-800">
                  Ticket bảo hành mới từ khách hàng
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  1 giờ trước
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </StaffLayout>
  )
}