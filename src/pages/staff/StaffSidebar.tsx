import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Package,
  Warehouse,
  ShoppingCart,
  Shield,
  Headphones,
  LogOut,
} from 'lucide-react'

export interface StaffNavItem {
  key: string
  label: string
  href: string
  icon: React.ElementType
}

export const STAFF_NAV_ITEMS: StaffNavItem[] = [
  {
    key: 'products',
    label: 'Quản lý sản phẩm',
    href: '/staff/products',
    icon: Package,
  },
  {
    key: 'inventory',
    label: 'Quản lý kho',
    href: '/staff/inventory',
    icon: Warehouse,
  },
  {
    key: 'orders',
    label: 'Quản lý đơn hàng',
    href: '/staff/orders',
    icon: ShoppingCart,
  },
  {
    key: 'warranty',
    label: 'Quản lý bảo hành',
    href: '/staff/warranty',
    icon: Shield,
  },
  {
    key: 'tickets',
    label: 'Hỗ trợ khách hàng',
    href: '/staff/tickets',
    icon: Headphones,
  },
]

interface Props {
  activeKey?: string
}

export default function StaffSidebar({ activeKey }: Props) {
  const location = useLocation()

  const active =
    activeKey ??
    STAFF_NAV_ITEMS.find((item) => item.href === location.pathname)?.key ??
    'products'

  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`
        ${collapsed ? 'w-16' : 'w-52 lg:w-56'}
        bg-[#1e2130]
        flex
        flex-col
        flex-shrink-0
        h-screen
        transition-all
        duration-200
      `}
    >
      {/* Header */}
      <div className="px-4 pt-6 pb-5 border-b border-white/10 flex items-center justify-between gap-2 overflow-hidden">
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-black text-sm tracking-wide truncate">
              STAFF PANEL
            </p>
            <p className="text-white/40 text-[10px] mt-0.5 truncate">
              Quản lý nhân viên
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2}
            className="w-3.5 h-3.5"
          >
            {collapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {STAFF_NAV_ITEMS.map(({ key, label, href, icon: Icon }) => {
          const isActive = active === key

          return (
            <Link
              key={key}
              to={href}
              title={collapsed ? label : undefined}
              className={`
                flex items-center gap-3
                px-3 py-2.5
                rounded-lg
                text-sm
                transition-all
                duration-150

                ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }

                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />

              {!collapsed && (
                <span className="truncate">
                  {label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-4 border-t border-white/10">
        <button
          className={`
            w-full
            flex
            items-center
            gap-3
            px-2
            py-2
            rounded-lg
            hover:bg-white/10
            transition-colors

            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              S
            </span>
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 text-left min-w-0">
                <p className="text-white text-xs font-medium truncate">
                  Staff User
                </p>

                <p className="text-white/40 text-[10px] truncate">
                  staff@webacc.vn
                </p>
              </div>

              <LogOut className="w-4 h-4 text-white/30 hover:text-red-400 transition-colors" />
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
