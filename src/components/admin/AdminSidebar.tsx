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
    <aside className="min-h-screen w-[260px] flex-shrink-0 bg-[#111827] px-5 py-7 text-white">
      <div className="mb-8 rounded-2xl bg-[#1F2937] px-5 py-4 text-center">
        <p className="text-[24px] font-black tracking-wide">ADMIN PANEL</p>
      </div>

      <nav className="flex flex-col gap-3">
        {ADMIN_NAV_ITEMS.map(({ key, label, href, icon: Icon }) => {
          const isActive = active === key

          return (
            <Link
              key={key}
              to={href}
              className={`flex h-[52px] items-center gap-3 rounded-xl px-5 text-[15px] transition-all ${
                isActive
                  ? 'bg-[#2563EB] font-semibold text-white'
                  : 'bg-[#1F2937] text-gray-200 hover:bg-[#374151]'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-10 flex h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-red-600 text-[16px] font-bold text-white transition-all hover:bg-red-700"
      >
        <LogOut size={20} />
        ĐĂNG XUẤT
      </button>
    </aside>
  )
}