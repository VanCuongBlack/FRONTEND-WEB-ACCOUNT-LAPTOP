import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Users,
  Shield,
  FileText,
  BookOpen,
  TrendingUp,
  LogOut,
} from 'lucide-react'

export interface AdminNavItem {
  key: string
  label: string
  href: string
  icon: React.ElementType
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { key: 'overview', label: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
  { key: 'products', label: 'Quản lý sản phẩm', href: '/admin/products', icon: Package },
  { key: 'inventory', label: 'Quản lý kho', href: '/admin/inventory', icon: Warehouse },
  { key: 'orders', label: 'Quản lý đơn hàng', href: '/admin/orders', icon: ShoppingCart },
  { key: 'customers', label: 'Quản lý khách hàng', href: '/admin/customers', icon: Users },
  { key: 'warranty', label: 'Quản lý bảo hành', href: '/admin/warranty', icon: Shield },
  { key: 'reports', label: 'Báo cáo', href: '/admin/reports', icon: FileText },
  { key: 'guide', label: 'Hướng dẫn mua hàng', href: '/admin/shopping-guide', icon: BookOpen },
  { key: 'bestSeller', label: 'SP bán chạy', href: '/admin/best-seller', icon: TrendingUp },
]

interface Props {
  activeKey?: string
}

export default function AdminSidebar({ activeKey }: Props) {
  const location = useLocation()

  const active =
    activeKey ??
    ADMIN_NAV_ITEMS.find((item) => item.href === location.pathname)?.key ??
    'overview'

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <aside className="h-screen w-[230px] flex-shrink-0 bg-[#111827] px-4 py-6 text-white flex flex-col justify-between border-r border-gray-800">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo Header */}
        <div className="mb-6 rounded-xl bg-[#1F2937] py-3 text-center shadow-inner">
          <p className="text-lg font-black tracking-widest text-blue-400">ADMIN PANEL</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 select-none scrollbar-none">
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
                <Icon size={16} className="flex-shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Logout Button */}
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