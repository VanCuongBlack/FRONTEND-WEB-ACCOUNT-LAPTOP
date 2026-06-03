import { useMemo, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AppModal from '@/components/common/AppModal'

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  orders: number
  totalSpent: number
  type: 'Thường' | 'VIP'
  status: 'Hoạt động' | 'Bị khóa'
}

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    phone: '0901234567',
    orders: 24,
    totalSpent: 120000000,
    type: 'VIP',
    status: 'Hoạt động',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    phone: '0912345678',
    orders: 12,
    totalSpent: 58000000,
    type: 'VIP',
    status: 'Hoạt động',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@gmail.com',
    phone: '0923456789',
    orders: 7,
    totalSpent: 25000000,
    type: 'Thường',
    status: 'Bị khóa',
  },
]

function formatPrice(price: number) {
  return `${price.toLocaleString('vi-VN')}đ`
}

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [keyword, setKeyword] = useState('')
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null)
  const [openCustomerModal, setOpenCustomerModal] = useState(false)
  const [openHistoryModal, setOpenHistoryModal] = useState(false)
  const [openExportModal, setOpenExportModal] = useState(false)

  const filteredCustomers = useMemo(() => {
    const search = keyword.toLowerCase().trim()

    if (!search) return customers

    return customers.filter((item) => {
      return (
        item.name.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.phone.includes(search)
      )
    })
  }, [customers, keyword])

  const totalCustomers = customers.length
  const newCustomers = 520
  const vipCustomers = customers.filter((item) => item.type === 'VIP').length
  const totalRevenue = customers.reduce(
    (total, item) => total + item.totalSpent,
    0
  )

  const handleToggleStatus = (id: number) => {
    setCustomers((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'Hoạt động' ? 'Bị khóa' : 'Hoạt động',
            }
          : item
      )
    )
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setOpenCustomerModal(true)
  }

  const handleViewHistory = (customer: Customer) => {
    setSelectedCustomer(customer)
    setOpenHistoryModal(true)
  }

  const handleExport = () => {
    setOpenExportModal(true)
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] font-['Inter',sans-serif] text-black">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <section className="mx-auto max-w-[1160px] rounded-3xl bg-white p-7 shadow-sm">
          <header className="mb-7 flex items-center justify-between rounded-2xl bg-[#F3F4F6] px-7 py-5">
            <h1 className="text-[28px] font-bold">
              Quản lý khách hàng
            </h1>

            <span className="text-sm text-gray-600">
              👤 Admin
            </span>
          </header>

          <section className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-[#EEF2FF] p-6">
              <p className="text-sm text-gray-500">Tổng khách hàng</p>
              <p className="mt-2 text-[28px] font-bold">
                {totalCustomers.toLocaleString('vi-VN')}
              </p>
            </div>

            <div className="rounded-2xl bg-[#DCFCE7] p-6">
              <p className="text-sm text-gray-500">Khách mới</p>
              <p className="mt-2 text-[28px] font-bold">{newCustomers}</p>
            </div>

            <div className="rounded-2xl bg-[#FEF3C7] p-6">
              <p className="text-sm text-gray-500">Khách VIP</p>
              <p className="mt-2 text-[28px] font-bold">{vipCustomers}</p>
            </div>

            <div className="rounded-2xl bg-[#FCE7F3] p-6">
              <p className="text-sm text-gray-500">Tổng chi tiêu</p>
              <p className="mt-2 text-[28px] font-bold">
                {formatPrice(totalRevenue)}
              </p>
            </div>
          </section>

          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="🔍 Tìm kiếm khách hàng..."
              className="h-[46px] w-full rounded-xl bg-[#F3F4F6] px-5 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20 md:w-[360px]"
            />

            <button
              type="button"
              onClick={handleExport}
              className="h-[46px] rounded-xl bg-[#2563EB] px-8 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
            >
              Xuất dữ liệu
            </button>
          </div>

          <section className="rounded-3xl bg-[#F9FAFB] p-6">
            <h2 className="mb-5 text-xl font-bold">
              Danh sách khách hàng
            </h2>

            <div className="overflow-x-auto">
              <div className="min-w-[1120px] overflow-hidden rounded-2xl bg-white">
                <div className="grid grid-cols-[1.4fr_2fr_160px_100px_170px_130px_260px] bg-[#E5E7EB] px-6 py-4 text-sm font-bold">
                  <span>Khách hàng</span>
                  <span>Email</span>
                  <span>SĐT</span>
                  <span>Đơn hàng</span>
                  <span>Tổng chi tiêu</span>
                  <span>Trạng thái</span>
                  <span>Thao tác</span>
                </div>

                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="grid grid-cols-[1.4fr_2fr_160px_100px_170px_130px_260px] items-center border-b border-gray-100 px-6 py-5 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D1D5DB] font-bold text-gray-600">
                        {customer.name.charAt(0)}
                      </div>

                      <div>
                        <p className="font-semibold leading-5">
                          {customer.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {customer.type}
                        </p>
                      </div>
                    </div>

                    <span className="break-all text-gray-600">
                      {customer.email}
                    </span>

                    <span className="text-gray-600">
                      {customer.phone}
                    </span>

                    <span>{customer.orders}</span>

                    <span className="font-semibold text-[#10B981]">
                      {formatPrice(customer.totalSpent)}
                    </span>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        customer.status === 'Hoạt động'
                          ? 'bg-[#DCFCE7] text-[#16A34A]'
                          : 'bg-red-100 text-red-500'
                      }`}
                    >
                      {customer.status}
                    </span>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewCustomer(customer)}
                        className="rounded-lg bg-[#2563EB] px-4 py-2 text-white hover:bg-[#1D4ED8]"
                      >
                        Xem
                      </button>

                      <button
                        type="button"
                        onClick={() => handleViewHistory(customer)}
                        className="rounded-lg bg-[#10B981] px-4 py-2 text-white hover:bg-[#059669]"
                      >
                        Lịch sử
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(customer.id)}
                        className={`rounded-lg px-4 py-2 text-white ${
                          customer.status === 'Hoạt động'
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-gray-500 hover:bg-gray-600'
                        }`}
                      >
                        {customer.status === 'Hoạt động' ? 'Khóa' : 'Mở'}
                      </button>
                    </div>
                  </div>
                ))}

                {filteredCustomers.length === 0 && (
                  <div className="py-10 text-center text-sm text-gray-500">
                    Không tìm thấy khách hàng.
                  </div>
                )}
              </div>
            </div>
          </section>
        </section>

        <AppModal
          open={openCustomerModal}
          title="Thông tin khách hàng"
          onClose={() => setOpenCustomerModal(false)}
          footer={
            <button
              type="button"
              onClick={() => setOpenCustomerModal(false)}
              className="h-[42px] rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
            >
              Đóng
            </button>
          }
        >
          {selectedCustomer && (
            <div className="space-y-3 text-sm">
              <p>
                <strong>Họ tên:</strong> {selectedCustomer.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedCustomer.email}
              </p>
              <p>
                <strong>SĐT:</strong> {selectedCustomer.phone}
              </p>
              <p>
                <strong>Loại khách:</strong> {selectedCustomer.type}
              </p>
              <p>
                <strong>Đơn hàng:</strong> {selectedCustomer.orders}
              </p>
              <p>
                <strong>Tổng chi tiêu:</strong>{' '}
                {formatPrice(selectedCustomer.totalSpent)}
              </p>
              <p>
                <strong>Trạng thái:</strong> {selectedCustomer.status}
              </p>
            </div>
          )}
        </AppModal>

        <AppModal
          open={openHistoryModal}
          title="Lịch sử mua hàng"
          onClose={() => setOpenHistoryModal(false)}
          footer={
            <button
              type="button"
              onClick={() => setOpenHistoryModal(false)}
              className="h-[42px] rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
            >
              Đóng
            </button>
          }
        >
          {selectedCustomer && (
            <div className="space-y-3 text-sm">
              <p>
                <strong>Khách hàng:</strong> {selectedCustomer.name}
              </p>
              <p>
                <strong>Tổng đơn hàng:</strong> {selectedCustomer.orders}
              </p>
              <p>
                <strong>Tổng chi tiêu:</strong>{' '}
                {formatPrice(selectedCustomer.totalSpent)}
              </p>

              <div className="mt-4 rounded-xl bg-[#F3F4F6] p-4">
                <p className="font-semibold">Đơn hàng mẫu</p>
                <p className="mt-1 text-gray-600">
                  #DH12345 - Laptop / Account số -{' '}
                  {formatPrice(selectedCustomer.totalSpent)}
                </p>
              </div>
            </div>
          )}
        </AppModal>

        <AppModal
          open={openExportModal}
          title="Xuất dữ liệu khách hàng"
          onClose={() => setOpenExportModal(false)}
          footer={
            <button
              type="button"
              onClick={() => setOpenExportModal(false)}
              className="h-[42px] rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
            >
              Đã hiểu
            </button>
          }
        >
          <p className="text-sm text-gray-600">
            Chức năng xuất dữ liệu đang được mô phỏng ở FE. Khi có BE, hệ thống
            sẽ xuất file Excel/CSV từ API.
          </p>
        </AppModal>
      </main>
    </div>
  )
}