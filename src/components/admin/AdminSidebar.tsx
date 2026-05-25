import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, Warehouse, ShoppingCart,
  Users, Shield, LogOut,
} from 'lucide-react'

// ─── Nav config ────────────────────────────────────────────────────────────────

export interface AdminNavItem {
  key: string
  label: string
  href: string
  icon: React.ElementType
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { key: 'overview',  label: 'Tổng quan',          href: '/admin',           icon: LayoutDashboard },
  { key: 'products',  label: 'Quản lý sản phẩm',   href: '/admin/products',  icon: Package         },
  { key: 'inventory', label: 'Quản lý kho',         href: '/admin/inventory', icon: Warehouse       },
  { key: 'orders',    label: 'Quản lý đơn hàng',   href: '/admin/orders',    icon: ShoppingCart    },
  { key: 'customers', label: 'Quản lý khách hàng',  href: '/admin/customers', icon: Users           },
  { key: 'warranty',  label: 'Quản lý bảo hành',   href: '/admin/warranty',  icon: Shield          },
]

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  /** Override active key (nếu không truyền, tự detect từ URL) */
  activeKey?: string
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AdminSidebar({ activeKey }: Props) {
  const location = useLocation()

  /** Detect active từ URL nếu không truyền prop */
  const active = activeKey ?? ADMIN_NAV_ITEMS.find(item =>
    item.href === location.pathname
  )?.key ?? 'overview'

  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`
        ${collapsed ? 'w-16' : 'w-52 lg:w-56'}
        bg-[#1e2130] flex flex-col flex-shrink-0 h-full transition-all duration-200
      `}
    >
      {/* Brand */}
      <div className="px-4 pt-6 pb-5 border-b border-white/10 flex items-center justify-between gap-2 overflow-hidden">
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-black text-sm tracking-wide truncate">ADMIN PANEL</p>
            <p className="text-white/40 text-[10px] mt-0.5 truncate">System Control</p>
          </div>
        )}
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          title={collapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-3.5 h-3.5">
            {collapsed
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            }
          </svg>
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {ADMIN_NAV_ITEMS.map(({ key, label, href, icon: Icon }) => {
          const isActive = active === key
          return (
            <Link
              key={key}
              to={href}
              title={collapsed ? label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                ${isActive
                  ? 'bg-blue-600 text-white font-semibold shadow'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Admin user / logout */}
      <div className="px-2 py-4 border-t border-white/10">
        <button
          className={`
            w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors group
            ${collapsed ? 'justify-center' : ''}
          `}
          title="Đăng xuất"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 text-left min-w-0">
                <p className="text-white text-xs font-medium truncate">Admin User</p>
                <p className="text-white/40 text-[10px] truncate">admin@webacc.vn</p>
              </div>
              <LogOut className="w-3.5 h-3.5 text-white/30 group-hover:text-red-400 flex-shrink-0 transition-colors" />
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
