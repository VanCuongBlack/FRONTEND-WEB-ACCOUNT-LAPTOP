import { Link } from 'react-router-dom'
import { Bell, Settings, ChevronDown } from 'lucide-react'

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  /** Page title hiển thị bên trái */
  title: string
  /** Số thông báo chưa đọc (0 = ẩn dot) */
  notificationCount?: number
  /** Tên admin hiển thị */
  adminName?: string
  /** Custom content bên phải (optional) */
  rightSlot?: React.ReactNode
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AdminTopbar({
  title,
  notificationCount = 0,
  adminName = 'Admin',
  rightSlot,
}: Props) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0 gap-4">

      {/* Left: Page title */}
      <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">
        {title}
      </h1>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">

        {/* Custom slot (e.g. search bar, date picker) */}
        {rightSlot}

        {/* Notification bell */}
        <button className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        {/* Settings */}
        <Link
          to="/admin/settings"
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </Link>

        {/* Admin dropdown */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-bold">
              {adminName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="hidden sm:block">{adminName}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
        </button>

      </div>
    </header>
  )
}
