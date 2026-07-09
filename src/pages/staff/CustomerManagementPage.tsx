import { useEffect, useMemo, useState } from 'react'
import { Eye, History, Lock, RefreshCw, Search, Unlock, Users } from 'lucide-react'
import { toast } from 'sonner'
import AppModal from '@/components/common/AppModal'
import AdminLayout from '@/layouts/AdminLayout'
import {
  getCustomerDetail,
  getCustomers,
  toggleCustomerStatus,
  type AdminUser,
  type CustomerDetailResponse,
} from '@/services/admin.service'
import { getStaffOrderById, type Order } from '@/services/order.service'

function formatPrice(price?: number) {
  return `${(price ?? 0).toLocaleString('vi-VN')}đ`
}

function formatDate(value?: string) {
  if (!value) return 'Chưa có'
  return new Date(value).toLocaleString('vi-VN')
}

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<AdminUser[]>([])
  const [keyword, setKeyword] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetailResponse | null>(null)
  const [openCustomerModal, setOpenCustomerModal] = useState(false)
  const [openHistoryModal, setOpenHistoryModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [isOrderLoading, setIsOrderLoading] = useState(false)
  const [error, setError] = useState('')

  const loadCustomers = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await getCustomers({
        page: 1,
        limit: 100,
        search: keyword.trim() || undefined,
      })
      const data = res.data?.data
      setCustomers(data?.customers ?? [])
      setTotal(data?.total ?? data?.customers?.length ?? 0)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải danh sách khách hàng.')
      setCustomers([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const filteredCustomers = useMemo(() => {
    const search = keyword.toLowerCase().trim()
    if (!search) return customers
    return customers.filter((item) =>
      `${item.fullname ?? ''} ${item.email ?? ''} ${item.phone ?? ''}`
        .toLowerCase()
        .includes(search)
    )
  }, [customers, keyword])

  const activeCustomers = filteredCustomers.filter((item) => item.isActive !== false).length

  const openDetail = async (customer: AdminUser, mode: 'info' | 'history') => {
    setIsDetailLoading(true)
    try {
      const res = await getCustomerDetail(customer._id)
      setSelectedCustomer(res.data?.data ?? { customer })
      if (mode === 'info') setOpenCustomerModal(true)
      else setOpenHistoryModal(true)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Không thể tải chi tiết khách hàng.')
    } finally {
      setIsDetailLoading(false)
    }
  }

  const handleToggleStatus = async (customer: AdminUser) => {
    try {
      await toggleCustomerStatus(customer._id)
      await loadCustomers()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Không thể cập nhật trạng thái khách hàng.')
    }
  }

  const openOrderDetail = async (orderId: string) => {
    setIsOrderLoading(true)
    setSelectedOrder(null)
    try {
      const res = await getStaffOrderById(orderId)
      setSelectedOrder(res.data?.data ?? null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Không thể tải chi tiết đơn hàng.')
    } finally {
      setIsOrderLoading(false)
    }
  }

  return (
    <AdminLayout title="Quản lý khách hàng" notificationCount={0}>
      <div className="mx-auto w-full max-w-[1840px] space-y-6 font-sans text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Quản lý khách hàng
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Theo dõi tài khoản khách hàng, lịch sử mua hàng và trạng thái hoạt động.
            </p>
          </div>
          <button
            type="button"
            onClick={loadCustomers}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Tải lại
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#2A2F3B] p-5 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#909AAB]">
                Tổng khách hàng
              </p>
              <h3 className="mt-1 text-2xl font-extrabold text-white">
                {total.toLocaleString('vi-VN')}
              </h3>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#2A2F3B] p-5 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#909AAB]">
                Đang hoạt động
              </p>
              <h3 className="mt-1 text-2xl font-extrabold text-emerald-400">
                {activeCustomers}
              </h3>
            </div>
            <Unlock className="h-8 w-8 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#2A2F3B] p-5 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#909AAB]">
                Bị khóa
              </p>
              <h3 className="mt-1 text-2xl font-extrabold text-rose-400">
                {filteredCustomers.length - activeCustomers}
              </h3>
            </div>
            <Lock className="h-8 w-8 text-rose-400" />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#2A2F3B] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#909AAB]" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && loadCustomers()}
              placeholder="Tìm tên, email, số điện thoại..."
              className="w-full rounded-xl border border-white/10 bg-[#181B22] text-white py-2 pl-9 pr-4 text-sm focus:border-blue-600 focus:outline-none placeholder:text-[#909AAB]"
            />
          </div>
          <span className="text-xs font-semibold text-[#909AAB]">
            Hiển thị {filteredCustomers.length.toLocaleString('vi-VN')} khách hàng
          </span>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#2A2F3B] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left">
              <thead className="bg-[#181B22] text-xs font-bold uppercase tracking-wider text-slate-300">
                <tr>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Số điện thoại</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#1E2229]/20">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400 bg-[#1E2229]/20">
                      Đang tải danh sách khách hàng...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400 bg-[#1E2229]/20">
                      Không tìm thấy khách hàng.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-[#202530]">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white">
                          {customer.fullname || 'Khách hàng'}
                        </p>
                        <p className="text-xs text-[#909AAB]">{customer._id}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{customer.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{customer.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {formatDate(customer.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            customer.isActive === false
                              ? 'bg-rose-955/40 text-rose-300 border border-rose-500/20'
                              : 'bg-emerald-955/40 text-emerald-300 border border-emerald-500/20'
                          }`}
                        >
                          {customer.isActive === false ? 'Bị khóa' : 'Hoạt động'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openDetail(customer, 'info')}
                            disabled={isDetailLoading}
                            className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-60 cursor-pointer"
                          >
                            <Eye className="inline h-3.5 w-3.5" /> Xem
                          </button>
                          <button
                            type="button"
                            onClick={() => openDetail(customer, 'history')}
                            disabled={isDetailLoading}
                            className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-60 cursor-pointer"
                          >
                            <History className="inline h-3.5 w-3.5" /> Đơn
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(customer)}
                            className="rounded-lg border border-white/10 bg-[#181B22] px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800 cursor-pointer"
                          >
                            {customer.isActive === false ? 'Mở khóa' : 'Khóa'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <AppModal
          open={openCustomerModal}
          theme="dark"
          title="Thông tin khách hàng"
          onClose={() => setOpenCustomerModal(false)}
        >
          {selectedCustomer && (
            <div className="space-y-3 text-sm text-slate-350">
              <p>
                <strong>Họ tên:</strong> {selectedCustomer.customer.fullname || '-'}
              </p>
              <p>
                <strong>Email:</strong> {selectedCustomer.customer.email || '-'}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {selectedCustomer.customer.phone || '-'}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {selectedCustomer.customer.address || '-'}
              </p>
              <p>
                <strong>Tổng chi tiêu:</strong> {formatPrice(selectedCustomer.total_spent)}
              </p>
            </div>
          )}
        </AppModal>

        <AppModal
          open={openHistoryModal}
          theme="dark"
          title="Lịch sử đơn hàng"
          onClose={() => setOpenHistoryModal(false)}
          maxWidthClassName="max-w-[760px]"
        >
          <div className="space-y-3 text-sm">
            {(selectedCustomer?.order_history ?? []).length === 0 ? (
              <p className="text-[#909AAB]">Khách hàng chưa có đơn hàng.</p>
            ) : (
              selectedCustomer?.order_history?.map((order) => (
                <div key={order._id} className="rounded-xl border border-white/10 bg-[#181B22] p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="break-all font-bold text-white">#{order._id}</p>
                    <button
                      type="button"
                      onClick={() => openOrderDetail(order._id)}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                  <p className="text-slate-300">Trạng thái: {order.status || '-'}</p>
                  <p className="text-slate-300">Thanh toán: {order.payment_method || '-'}</p>
                  <p className="text-slate-300">Ngày tạo: {formatDate(order.createdAt)}</p>
                  <p className="font-semibold text-emerald-400">{formatPrice(order.total_amount)}</p>
                </div>
              ))
            )}
          </div>
        </AppModal>

        <AppModal
          open={isOrderLoading || Boolean(selectedOrder)}
          theme="dark"
          title="Chi tiết đơn hàng"
          maxWidthClassName="max-w-[720px]"
          onClose={() => {
            setSelectedOrder(null)
            setIsOrderLoading(false)
          }}
        >
          {isOrderLoading ? (
            <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-4 text-sm font-semibold text-blue-300">
              Đang tải chi tiết đơn hàng...
            </div>
          ) : selectedOrder ? (
            <div className="space-y-4 text-sm">
              <div className="rounded-xl border border-white/10 bg-[#181B22] p-4">
                <p className="text-xs font-bold uppercase text-[#909AAB]">Mã đơn</p>
                <p className="mt-1 break-all font-black text-white">#{selectedOrder._id}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-slate-300">
                  <p>Trạng thái: <strong>{selectedOrder.status || '-'}</strong></p>
                  <p>Thanh toán: <strong>{selectedOrder.payment_method || '-'}</strong></p>
                  <p className="col-span-2">Ngày tạo: <strong>{formatDate(selectedOrder.createdAt)}</strong></p>
                </div>
                <p className="mt-4 text-right text-lg font-black text-emerald-400">
                  {formatPrice(selectedOrder.total_amount)}
                </p>
              </div>

              <div className="space-y-2">
                {selectedOrder.items?.map((item) => (
                  <div key={item._id ?? item.item_id} className="rounded-lg bg-[#1E2229]/40 border border-white/5 p-3">
                    <p className="font-bold text-white">{item.product_name || item.product?.name || 'Sản phẩm'}</p>
                    <p className="text-xs text-[#909AAB]">
                      {item.product_type === 'digital' ? 'Account' : 'Laptop / PC'} - {formatPrice(item.sale_price ?? item.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </AppModal>
      </div>
    </AdminLayout>
  )
}
