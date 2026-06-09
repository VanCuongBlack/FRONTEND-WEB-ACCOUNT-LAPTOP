import type { ReactNode } from 'react'
import StaffSidebar from '@/components/staff/StaffSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

interface Props {
  title: string
  children: ReactNode
  notificationCount?: number
  staffName?: string
  topbarRight?: ReactNode
}

export default function StaffLayout({
  title,
  children,
  notificationCount = 0,
  staffName = 'Staff',
  topbarRight,
}: Props) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <StaffSidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminTopbar
          title={title}
          notificationCount={notificationCount}
          adminName={staffName}
          rightSlot={topbarRight}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}