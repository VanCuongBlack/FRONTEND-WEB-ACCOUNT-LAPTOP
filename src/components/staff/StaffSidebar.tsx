import { Link, useLocation } from 'react-router-dom'
import {
  Package,
  Warehouse,
  ShoppingCart,
  Users,
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

export default function StaffSidebar({ activeKey }: Props) {
  const location = useLocation()

  const active =
    activeKey ??
    STAFF_NAV_ITEMS.find((item) => item.href === location.pathname)?.key ??
    'products'

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <aside className="h-screen w-[230px] flex-shrink-0 bg-[#111827] px-4 py-6 text-white flex flex-col justify-between border-r border-gray-800">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="mb-6 rounded-xl bg-[#1F2937] py-3 text-center shadow-inner">
          <p className="text-lg font-black tracking-widest text-green-400">
            STAFF PANEL
          </p>
        </div>

        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 select-none scrollbar-none">
          {STAFF_NAV_ITEMS.map(({ key, label, href, icon: Icon }) => {
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

      <div className="pt-4 border-t border-gray-800 mt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-red-600 text-[14px] font-bold text-white transition-all hover:bg-red-700 active:scale-[0.98] shadow-sm"
        >
          <LogOut size={16} />
          <span>ĐĂNG XUẤT</span>
        </button>
      </div>
    </aside>
  )
}