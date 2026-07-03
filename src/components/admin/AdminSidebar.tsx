import { Link, useLocation } from 'react-router-dom'
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export interface AdminNavItem {
  key: string
  label: string
  href: string
  icon: React.ElementType
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    key: 'overview',
    label: 'Tổng quan',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    key: 'reports',
    label: 'Báo cáo',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    key: 'employees',
    label: 'Quản lý nhân viên',
    href: '/admin/employees',
    icon: Users,
  },
  {
    key: 'customers',
    label: 'Quản lý khách hàng',
    href: '/admin/customers',
    icon: Users,
  },
  {
    key: 'settings',
    label: 'Quản lý hệ thống',
    href: '/admin/settings',
    icon: Settings,
  },
]

interface Props {
  activeKey?: string
}

export default function AdminSidebar({ activeKey }: Props) {
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)

  const active =
    activeKey ??
    ADMIN_NAV_ITEMS.find((item) => item.href === location.pathname)?.key ??
    'overview'

  return (
    <aside className="flex h-screen w-[230px] flex-shrink-0 flex-col justify-between border-r border-gray-800 bg-[#111827] px-4 py-6 text-white">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-6 rounded-xl bg-[#1F2937] py-3 text-center shadow-inner">
          <p className="text-lg font-black tracking-widest text-blue-400">
            ADMIN PANEL
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {ADMIN_NAV_ITEMS.map(({ key, label, href, icon: Icon }) => {
            const isActive = active === key

            return (
              <Link
                key={key}
                to={href}
                className={`flex h-[44px] items-center gap-3 rounded-lg px-3.5 text-[13.5px] transition-all ${
                  isActive
                    ? 'bg-blue-600 font-semibold text-white shadow-md shadow-blue-600/20'
                    : 'bg-[#1F2937]/50 text-gray-300 hover:bg-[#1F2937] hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-4 border-t border-gray-800 pt-4">
        <button
          type="button"
          onClick={logout}
          className="flex h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-red-600 text-[14px] font-bold text-white transition-all hover:bg-red-700 active:scale-[0.98]"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
