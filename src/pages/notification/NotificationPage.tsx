import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  PackageCheck,
  Gift,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  CheckCheck,
  Search,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

type NotificationType = 'order' | 'promotion' | 'warranty' | 'system'
type FilterType = 'all' | NotificationType

interface NotificationItem {
  id: number
  type: NotificationType
  title: string
  description: string
  time: string
  isRead: boolean
  link?: string
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: 'order',
    title: 'Đơn hàng #12345 đã được bàn giao',
    description:
      'Laptop Dell Precision đã được bàn giao cho đơn vị vận chuyển.',
    time: '2 phút trước',
    isRead: false,
    link: '/profile/history/laptop/12345',
  },
  {
    id: 2,
    type: 'warranty',
    title: 'Yêu cầu bảo hành đã được xử lý',
    description:
      'Yêu cầu hỗ trợ bảo hành cho Account ChatGPT của bạn đã được kỹ thuật viên xử lý.',
    time: '1 giờ trước',
    isRead: false,
  },
  {
    id: 3,
    type: 'promotion',
    title: 'Bạn nhận được voucher giảm 50K',
    description:
      'Voucher áp dụng cho đơn hàng Account tiếp theo. Hãy sử dụng trước khi hết hạn.',
    time: 'Hôm nay',
    isRead: true,
    link: '/accounts',
  },
  {
    id: 4,
    type: 'promotion',
    title: 'Xả kho laptop cũ',
    description:
      'Giảm giá đồng loạt 20% cho các mẫu laptop cũ trong hôm nay.',
    time: 'Hôm qua',
    isRead: true,
    link: '/laptops',
  },
  {
    id: 5,
    type: 'system',
    title: 'Cảnh báo bảo mật tài khoản',
    description:
      'Cảnh báo chiêu trò lừa đảo chiếm đoạt Account mới nhất. Bạn cần kiểm tra kỹ trước khi giao dịch.',
    time: '03/06/2026',
    isRead: false,
  },
]

const typeLabels: Record<FilterType, string> = {
  all: 'Tất cả',
  order: 'Đơn hàng',
  promotion: 'Khuyến mãi',
  warranty: 'Bảo hành',
  system: 'Hệ thống',
}

const typeStyles: Record<NotificationType, string> = {
  order: 'bg-blue-50 text-blue-600',
  promotion: 'bg-yellow-50 text-yellow-600',
  warranty: 'bg-green-50 text-green-600',
  system: 'bg-red-50 text-red-600',
}

function getNotificationIcon(type: NotificationType) {
  if (type === 'order') return PackageCheck
  if (type === 'promotion') return Gift
  if (type === 'warranty') return ShieldCheck
  return AlertTriangle
}

export default function NotificationPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [keyword, setKeyword] = useState('')

  const unreadCount = notifications.filter((item) => !item.isRead).length

  const filteredNotifications = useMemo(() => {
    const search = keyword.toLowerCase().trim()

    return notifications.filter((item) => {
      const matchType = activeFilter === 'all' || item.type === activeFilter

      const matchSearch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search)

      return matchType && matchSearch
    })
  }, [notifications, activeFilter, keyword])

  const getFilterCount = (type: FilterType) => {
    if (type === 'all') return notifications.length
    return notifications.filter((item) => item.type === type).length
  }

  const handleOpenNotification = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === item.id
          ? { ...notification, isRead: true }
          : notification
      )
    )

    if (item.link) {
      navigate(item.link)
    }
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      }))
    )
  }

  const handleDeleteAll = () => {
    setNotifications([])
  }

  const handleDeleteOne = (id: number) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] font-sans text-black">
      <Header pageLabel="Thông báo" cartCount={0} />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-[28px] font-bold">
                <Bell className="text-[#2563EB]" size={28} />
                Thông báo
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Bạn có {unreadCount} thông báo chưa đọc.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
              >
                <CheckCheck size={18} />
                Đánh dấu đã đọc
              </button>

              <button
                type="button"
                onClick={handleDeleteAll}
                className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-red-500 px-5 text-sm font-semibold text-white hover:bg-red-600"
              >
                <Trash2 size={18} />
                Xóa tất cả
              </button>
            </div>
          </div>

          <div className="mb-6 flex h-[48px] items-center gap-3 rounded-xl border border-gray-300 px-4 focus-within:border-[#2563EB]">
            <Search size={18} className="text-gray-400" />

            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm thông báo..."
              className="h-full flex-1 bg-transparent text-sm outline-none"
            />

            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword('')}
                className="text-xs font-medium text-gray-400 hover:text-red-500"
              >
                Xóa
              </button>
            )}
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            {(['all', 'order', 'promotion', 'warranty', 'system'] as FilterType[]).map(
              (type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveFilter(type)}
                  className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                    activeFilter === type
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[#F3F4F6] text-gray-600 hover:bg-[#E5E7EB]'
                  }`}
                >
                  {typeLabels[type]} ({getFilterCount(type)})
                </button>
              )
            )}
          </div>

          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => {
                const Icon = getNotificationIcon(item.type)

                return (
                  <div
                    key={item.id}
                    className={`group rounded-2xl border p-4 transition-all hover:border-[#2563EB] hover:bg-[#F8FAFC] ${
                      item.isRead
                        ? 'border-gray-100 bg-white'
                        : 'border-[#2563EB]/30 bg-[#2563EB]/5'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${typeStyles[item.type]}`}
                      >
                        <Icon size={24} />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenNotification(item)}
                        className="flex-1 text-left"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-2">
                            {!item.isRead && (
                              <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
                            )}

                            <h2 className="font-bold text-gray-900">
                              {item.title}
                            </h2>

                            {!item.isRead && (
                              <span className="rounded-full bg-[#2563EB] px-2 py-0.5 text-[10px] font-bold text-white">
                                MỚI
                              </span>
                            )}
                          </div>

                          <span className="text-xs text-gray-400">
                            {item.time}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {item.description}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteOne(item.id)}
                        className="h-9 w-9 rounded-lg text-gray-400 opacity-100 hover:bg-red-50 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100"
                        title="Xóa thông báo"
                      >
                        <Trash2 size={18} className="mx-auto" />
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="rounded-2xl bg-[#F8FAFC] p-10 text-center">
                <Bell size={40} className="mx-auto text-gray-300" />
                <p className="mt-4 font-semibold text-gray-600">
                  Không có thông báo nào.
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Các thông báo về đơn hàng, bảo hành và khuyến mãi sẽ hiển thị tại đây.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}