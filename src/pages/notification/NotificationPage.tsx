import { useEffect, useState } from 'react'
import { Bell, CheckCheck, Loader2, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  deleteAllReadNotifications,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationRecord,
} from '@/services/notification.service'
import { normalizeNotificationLink } from '@/utils/normalizeNotificationLink'

export default function NotificationPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<NotificationRecord[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNotifications = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getNotifications({ page: 1, limit: 50 })
      const data = res.data?.data
      setNotifications(data?.notifications ?? [])
      setUnreadCount(data?.unread_count ?? 0)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải thông báo.')
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const handleOpenNotification = async (notification: NotificationRecord) => {
    if (!notification.is_read) {
      await markNotificationAsRead(notification._id)
      setUnreadCount((count) => Math.max(0, count - 1))
      setNotifications((items) =>
        items.map((item) =>
          item._id === notification._id ? { ...item, is_read: true } : item
        )
      )
    }

    const target = normalizeNotificationLink(notification.link, 'customer')
    if (target) navigate(target)
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead()
    setUnreadCount(0)
    setNotifications((items) => items.map((item) => ({ ...item, is_read: true })))
  }

  const handleDeleteRead = async () => {
    await deleteAllReadNotifications()
    await loadNotifications()
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#050914] font-sans text-white">
      <Header pageLabel="Thông báo" cartCount={0} />

      <main className="mx-auto w-full max-w-none flex-1 px-4 py-6">
        <section className="rounded-[22px] border border-[#1e3a62] bg-[#0a1628] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-[28px] font-black">
                <Bell className="text-[#74b7ff]" size={28} />
                Thông báo
              </h1>
              <p className="mt-2 text-sm text-[#b9b4d7]">
                Theo dõi cập nhật đơn hàng, thanh toán, bảo hành và hỗ trợ khách hàng.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#36b8f2] via-[#2668ff] to-[#8b3df5] px-4 text-sm font-black text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCheck className="h-4 w-4" />
                Đánh dấu đã đọc
              </button>
              <button
                type="button"
                onClick={handleDeleteRead}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-black text-[#d9d4f2] hover:bg-white/15"
              >
                <Trash2 className="h-4 w-4" />
                Xóa đã đọc
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center gap-3 rounded-[20px] bg-[#071120] text-[#b9b4d7]">
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang tải thông báo...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#1e3a62] bg-[#071120] p-8 text-center">
              <Bell className="h-10 w-10 text-[#74b7ff]" />
              <h2 className="mt-4 text-lg font-black text-white">
                Chưa có thông báo
              </h2>
              <p className="mt-2 max-w-[560px] text-sm leading-6 text-[#b9b4d7]">
                Khi đơn hàng hoặc yêu cầu hỗ trợ có cập nhật, thông báo sẽ hiển thị tại đây.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => handleOpenNotification(notification)}
                  className={`w-full rounded-2xl border px-5 py-4 text-left transition-colors ${
                    notification.is_read
                      ? 'border-[#1e3a62]/80 bg-[#071120] hover:border-[#3d63ff]/40'
                      : 'border-[#2d7cff]/70 bg-[#0d1d34] hover:border-[#79a7ff]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
                        notification.is_read ? 'bg-[#635d86]' : 'bg-[#79a7ff]'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-base font-black text-white">
                          {notification.title}
                        </h2>
                        <span className="text-xs font-semibold text-[#8d86b6]">
                          {notification.createdAt
                            ? new Date(notification.createdAt).toLocaleString('vi-VN')
                            : 'Vừa xong'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#c8c1e8]">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
