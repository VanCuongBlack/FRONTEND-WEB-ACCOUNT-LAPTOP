import { Link, useLocation } from 'react-router-dom'
import {
  Headphones,
  LogOut,
  Package,
  Shield,
  ShoppingCart,
  Users,
  Warehouse,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export interface StaffNavItem {
  key: string
  label: string
  href: string
  icon: React.ElementType
}

export const STAFF_NAV_ITEMS: StaffNavItem[] = [
  { key: 'products', label: 'Quản lý sản phẩm', href: '/staff/products', icon: Package },
  { key: 'inventory', label: 'Quản lý kho', href: '/staff/inventory', icon: Warehouse },
  { key: 'orders', label: 'Quản lý đơn hàng', href: '/staff/orders', icon: ShoppingCart },
  { key: 'customers', label: 'Quản lý khách hàng', href: '/staff/customers', icon: Users },
  { key: 'warranty', label: 'Quản lý bảo hành', href: '/staff/warranty', icon: Shield },
  { key: 'tickets', label: 'Hỗ trợ khách hàng', href: '/staff/tickets', icon: Headphones },
]

interface Props {
  activeKey?: string
}

function getRoleName(role: unknown) {
  if (typeof role === 'string') return role
  if (role && typeof role === 'object' && 'name' in role) {
    const roleName = (role as { name?: unknown }).name
    return typeof roleName === 'string' ? roleName : null
  }
  return null
}

export default function StaffSidebar({ activeKey }: Props) {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const role = getRoleName(user?.role)
  const navItems = STAFF_NAV_ITEMS.filter((item) => item.key !== 'customers' || role === 'admin')

  const active =
    activeKey ??
    navItems.find((item) => item.href === location.pathname)?.key ??
    'products'

  return (
    <aside className="flex h-screen w-[230px] flex-shrink-0 flex-col justify-between border-r border-gray-800 bg-[#111827] px-4 py-6 text-white">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-6 rounded-xl bg-[#1F2937] py-3 text-center shadow-inner">
          <p className="text-lg font-black tracking-widest text-green-400">
            STAFF PANEL
          </p>
        </div>

        <nav className="scrollbar-none flex flex-1 select-none flex-col gap-2 overflow-y-auto pr-1">
          {navItems.map(({ key, label, href, icon: Icon }) => {
            const isActive = active === key

            return (
              <Link
                key={key}
                to={href}
                className={`flex h-[44px] items-center gap-3 rounded-lg px-3.5 text-[13.5px] transition-all ${
                  isActive
                    ? 'bg-green-600 font-semibold text-white shadow-md shadow-green-600/20'
                    : 'bg-[#1F2937]/50 text-gray-300 hover:bg-[#1F2937] hover:text-white'
                }`}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-4 border-t border-gray-800 pt-4">
        <button
          type="button"
          onClick={logout}
          className="flex h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-red-600 text-[14px] font-bold text-white shadow-sm transition-all hover:bg-red-700 active:scale-[0.98]"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
