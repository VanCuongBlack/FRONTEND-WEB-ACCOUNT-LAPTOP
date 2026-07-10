import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, Loader2, Settings, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import {
  deleteAllReadNotifications,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationRecord,
} from '@/services/notification.service'
import { normalizeNotificationLink } from '@/utils/normalizeNotificationLink'

interface Props {
  title: string
  notificationCount?: number
  adminName?: string
  rightSlot?: ReactNode
}

function getRoleName(role: unknown) {
  if (typeof role === 'string') return role
  if (role && typeof role === 'object' && 'name' in role) {
    const roleName = (role as { name?: unknown }).name
    return typeof roleName === 'string' ? roleName : null
  }
  return null
}

export default function AdminTopbar({
  title,
  notificationCount = 0,
  adminName = 'Admin',
  rightSlot,
}: Props) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const role = getRoleName(user?.role)
  const settingsPath = role === 'admin' ? '/admin/settings' : '/staff/settings'
  const [openNotifications, setOpenNotifications] = useState(false)
  const [notifications, setNotifications] = useState<NotificationRecord[]>([])
  const [unreadCount, setUnreadCount] = useState(notificationCount)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const loadNotifications = async () => {
    setIsLoadingNotifications(true)
    try {
      const res = await getNotifications({ page: 1, limit: 8 })
      const data = res.data?.data
      setNotifications(data?.notifications ?? [])
      setUnreadCount(data?.unread_count ?? 0)
    } catch {
      setNotifications([])
    } finally {
      setIsLoadingNotifications(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpenNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpenNotifications = () => {
    setOpenNotifications((value) => !value)
    if (!openNotifications) loadNotifications()
  }

  const handleNotificationClick = async (notification: NotificationRecord) => {
    if (!notification.is_read) {
      await markNotificationAsRead(notification._id)
      setUnreadCount((count) => Math.max(0, count - 1))
      setNotifications((items) =>
        items.map((item) =>
          item._id === notification._id ? { ...item, is_read: true } : item
        )
      )
    }

    setOpenNotifications(false)
    const target = normalizeNotificationLink(notification.link, role)
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
    <header className="flex h-14 flex-shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#2A2F3B] px-4 sm:px-6">
      <h1 className="truncate text-base font-bold text-white sm:text-lg">
        {title}
      </h1>

      <div className="flex flex-shrink-0 items-center gap-1.5">
        {rightSlot}

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={handleOpenNotifications}
            className="relative rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white cursor-pointer"
            title="Thông báo"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {openNotifications && (
            <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#2A2F3B] shadow-2xl text-white">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-[#181B22]">
                <div>
                  <p className="text-sm font-extrabold text-white">Thông báo</p>
                  <p className="text-xs text-slate-400">{unreadCount} chưa đọc</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-blue-400 cursor-pointer"
                    title="Đánh dấu tất cả đã đọc"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteRead}
                    className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-red-400 cursor-pointer"
                    title="Xóa thông báo đã đọc"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-[420px] overflow-y-auto bg-[#2A2F3B]">
                {isLoadingNotifications ? (
                  <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải thông báo...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-10 text-center text-sm text-slate-400">
                    Chưa có thông báo.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification._id}
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className={`block w-full border-b border-white/5 px-4 py-3 text-left transition-colors hover:bg-[#202530] cursor-pointer ${
                        notification.is_read ? 'bg-[#2A2F3B]' : 'bg-blue-950/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 h-2 w-2 rounded-full ${
                            notification.is_read ? 'bg-white/20' : 'bg-blue-400'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-bold text-white">
                            {notification.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-355">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-[11px] font-semibold text-[#909AAB]">
                            {notification.createdAt
                              ? new Date(notification.createdAt).toLocaleString('vi-VN')
                              : 'Vừa xong'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link
          to={settingsPath}
          className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Settings className="h-5 w-5" />
        </Link>

        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#181B22] py-1.5 pl-2 pr-3 text-sm text-slate-300">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
            <span className="text-[10px] font-bold text-white">
              {adminName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="hidden sm:block">{adminName}</span>
        </div>
      </div>
    </header>
  )
}
