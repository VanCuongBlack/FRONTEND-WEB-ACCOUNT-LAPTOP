import { useMemo, useState } from 'react'
import StaffLayout from '@/layouts/StaffLayout'
import AppModal from '@/components/common/AppModal'
import { Search, Download, Users, Eye, History, Lock, Unlock } from 'lucide-react'

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
    <StaffLayout title="Quản lý khách hàng" notificationCount={3}>
      <div className="space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800">

        {/* Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý khách hàng</h1>
            <p className="text-sm text-slate-500 mt-1">Quản lý thông tin tài khoản, hạng thành viên, chi tiêu và lịch sử hoạt động của khách hàng.</p>
          </div>
        </div>

        {/* Metrics Row (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Tổng khách hàng */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng khách hàng</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalCustomers.toLocaleString('vi-VN')}</h3>
              <p className="text-xs text-slate-400 font-semibold mt-2">Đăng ký trên hệ thống</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Khách mới */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khách mới</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{newCustomers}</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-2 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                +15% tháng này
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Khách VIP */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khách VIP</p>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{vipCustomers}</h3>
              <p className="text-xs text-slate-400 font-semibold mt-2">Hạng thành viên VIP</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Tổng chi tiêu */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng chi tiêu</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{formatPrice(totalRevenue)}</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-2 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                Tích lũy hoàn thành
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Controls & Search Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm khách hàng..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Xuất dữ liệu
          </button>
        </div>

        {/* Customer Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              Danh sách khách hàng
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SĐT</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Đơn hàng</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng chi tiêu</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 border border-slate-200">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{customer.name}</p>
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold mt-0.5 ${
                            customer.type === 'VIP' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-slate-50 text-slate-500 border border-slate-200'
                          }`}>
                            {customer.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 break-all">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{customer.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{customer.orders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">{formatPrice(customer.totalSpent)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.status === 'Hoạt động' ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                          Bị khóa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewCustomer(customer)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Xem
                        </button>
                        <button
                          type="button"
                          onClick={() => handleViewHistory(customer)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 transition-all"
                        >
                          <History className="w-3.5 h-3.5" />
                          Lịch sử
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(customer.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                            customer.status === 'Hoạt động'
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {customer.status === 'Hoạt động' ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              Khóa
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3.5 h-3.5" />
                              Mở khóa
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400 font-medium">
                      Không tìm thấy khách hàng nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Section */}
        <p className="text-center text-xs text-slate-400 py-4 border-t border-slate-100">
          © 2024 Admin Panel. Hệ thống Quản lý Khách hàng.
        </p>

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
            <div className="space-y-3 text-sm text-slate-600 font-medium">
              <p>
                <strong className="text-slate-800">Họ tên:</strong> {selectedCustomer.name}
              </p>
              <p>
                <strong className="text-slate-800">Email:</strong> {selectedCustomer.email}
              </p>
              <p>
                <strong className="text-slate-800">SĐT:</strong> {selectedCustomer.phone}
              </p>
              <p>
                <strong className="text-slate-800">Loại khách:</strong> {selectedCustomer.type}
              </p>
              <p>
                <strong className="text-slate-800">Đơn hàng:</strong> {selectedCustomer.orders}
              </p>
              <p>
                <strong className="text-slate-800">Tổng chi tiêu:</strong>{' '}
                {formatPrice(selectedCustomer.totalSpent)}
              </p>
              <p>
                <strong className="text-slate-800">Trạng thái:</strong> {selectedCustomer.status}
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
            <div className="space-y-3 text-sm text-slate-600 font-medium">
              <p>
                <strong className="text-slate-800">Khách hàng:</strong> {selectedCustomer.name}
              </p>
              <p>
                <strong className="text-slate-800">Tổng đơn hàng:</strong> {selectedCustomer.orders}
              </p>
              <p>
                <strong className="text-slate-800">Tổng chi tiêu:</strong>{' '}
                {formatPrice(selectedCustomer.totalSpent)}
              </p>

              <div className="mt-4 rounded-xl bg-[#F3F4F6] p-4 border border-slate-200/50">
                <p className="font-semibold text-slate-800">Đơn hàng mẫu</p>
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

      </div>
    </StaffLayout>
  )
}