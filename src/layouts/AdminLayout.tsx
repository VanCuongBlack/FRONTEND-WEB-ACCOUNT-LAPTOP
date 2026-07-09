import type { ReactNode } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  /** Tiêu đề trang — hiển thị trên topbar */
  title: string
  /** Nội dung trang */
  children: ReactNode
  /** Số thông báo (optional) */
  notificationCount?: number
  /** Tên admin (optional) */
  adminName?: string
  /** Content tùy chỉnh bên phải topbar (optional) */
  topbarRight?: ReactNode
}

// ─── Layout ────────────────────────────────────────────────────────────────────

/**
 * AdminLayout — wrapper dùng cho mọi trang trong khu vực admin.
 *
 * Cách dùng:
 * ```tsx
 * export default function ProductsPage() {
 *   return (
 *     <AdminLayout title="Quản lý sản phẩm">
 *       <div>...nội dung trang...</div>
 *     </AdminLayout>
 *   )
 * }
 * ```
 */
export default function AdminLayout({
  title,
  children,
  notificationCount = 0,
  adminName = 'Admin',
  topbarRight,
}: Props) {
  return (
    <div className="flex h-screen bg-[#1E2229] overflow-hidden font-sans text-white">

      {/* Sidebar — tự detect active từ URL */}
      <AdminSidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <AdminTopbar
          title={title}
          notificationCount={notificationCount}
          adminName={adminName}
          rightSlot={topbarRight}
        />

        {/* Page content — scrollable */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          {children}
        </main>

      </div>
    </div>
  )
}
