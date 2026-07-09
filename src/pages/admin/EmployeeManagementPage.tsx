import { useEffect, useMemo, useState } from 'react'
import { Edit, Eye, Lock, Plus, RefreshCw, Search, Shield } from 'lucide-react'
import AdminLayout from '@/layouts/AdminLayout'
import AppModal from '@/components/common/AppModal'
import {
  assignStaffRole,
  createStaff,
  deleteStaff,
  getRoles,
  getStaffs,
  updateStaff,
  type AdminUser,
  type Role,
} from '@/services/admin.service'

interface StaffForm {
  fullname: string
  email: string
  phone: string
  password: string
  address: string
  position: string
  isActive: boolean
}

const emptyForm: StaffForm = {
  fullname: '',
  email: '',
  phone: '',
  password: '',
  address: '',
  position: '',
  isActive: true,
}

const inputClass = 'h-[46px] w-full rounded-xl border border-white/10 bg-[#181B22] text-white px-4 text-sm outline-none focus:border-blue-600 disabled:bg-[#181B22]/50 disabled:text-slate-400'
const phonePattern = /^[0-9]{10,11}$/

function roleName(role?: Role | string) {
  if (!role) return 'staff'
  return typeof role === 'string' ? role : role.name
}

export default function EmployeeManagementPage() {
  const [staffs, setStaffs] = useState<AdminUser[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [keyword, setKeyword] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<AdminUser | null>(null)
  const [editingStaff, setEditingStaff] = useState<AdminUser | null>(null)
  const [form, setForm] = useState<StaffForm>(emptyForm)
  const [roleValue, setRoleValue] = useState('')
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openRoleModal, setOpenRoleModal] = useState(false)
  const [openFormModal, setOpenFormModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadData = async () => {
    setIsLoading(true)
    setError('')
    try {
      const [staffRes, roleRes] = await Promise.all([
        getStaffs({ page: 1, limit: 100, search: keyword.trim() || undefined }),
        getRoles(),
      ])
      setStaffs(staffRes.data?.data?.staff ?? [])
      setRoles(roleRes.data?.data ?? [])
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải danh sách nhân viên.')
      setStaffs([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredStaffs = useMemo(() => {
    const search = keyword.toLowerCase().trim()
    if (!search) return staffs
    return staffs.filter((item) =>
      `${item.fullname ?? ''} ${item.email ?? ''} ${item.phone ?? ''} ${item.position ?? ''}`
        .toLowerCase()
        .includes(search)
    )
  }, [staffs, keyword])

  const activeCount = filteredStaffs.filter((item) => item.isActive !== false).length

  const openAdd = () => {
    setEditingStaff(null)
    setForm(emptyForm)
    setOpenFormModal(true)
  }

  const openEdit = (staff: AdminUser) => {
    setEditingStaff(staff)
    setForm({
      fullname: staff.fullname || '',
      email: staff.email || '',
      phone: staff.phone || '',
      password: '',
      address: staff.address || '',
      position: staff.position || '',
      isActive: staff.isActive !== false,
    })
    setOpenFormModal(true)
  }

  const validateStaffForm = () => {
    if (!form.fullname.trim()) return 'Vui lòng nhập họ tên'
    if (!form.email.trim()) return 'Vui lòng nhập email'
    if (!editingStaff && !form.password) return 'Vui lòng nhập mật khẩu'
    if (form.phone && !phonePattern.test(form.phone)) return 'Số điện thoại cần từ 10 đến 11 chữ số'
    return ''
  }

  const saveStaff = async () => {
    const validationError = validateStaffForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    try {
      if (editingStaff) {
        await updateStaff(editingStaff._id, {
          fullname: form.fullname.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          position: form.position.trim(),
          isActive: form.isActive,
        })
      } else {
        await createStaff({
          fullname: form.fullname.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          password: form.password,
          address: form.address.trim(),
          position: form.position.trim(),
        })
      }
      setOpenFormModal(false)
      await loadData()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể lưu nhân viên.')
    }
  }

  const openRole = (staff: AdminUser) => {
    setSelectedStaff(staff)
    const currentRole = roles.find((role) => role.name === roleName(staff.role))
    setRoleValue(currentRole?._id ?? '')
    setOpenRoleModal(true)
  }

  const saveRole = async () => {
    if (!selectedStaff || !roleValue) return
    try {
      await assignStaffRole(selectedStaff._id, roleValue)
      setOpenRoleModal(false)
      await loadData()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể phân quyền nhân viên.')
    }
  }

  const lockStaff = async (staff: AdminUser) => {
    try {
      if (staff.isActive === false) {
        await updateStaff(staff._id, { isActive: true })
      } else {
        await deleteStaff(staff._id)
      }
      await loadData()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể cập nhật trạng thái nhân viên.')
    }
  }

  const copyStaffId = async (staffId: string) => {
    try {
      await navigator.clipboard.writeText(staffId)
      setError('')
    } catch {
      setError('Không thể copy mã nhân viên.')
    }
  }

  return (
    <AdminLayout title="Quản lý nhân viên">
      <section className="mx-auto max-w-[1840px] space-y-6 font-sans text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Quản lý nhân viên</h1>
            <p className="mt-1 text-sm text-slate-400">
              Quản lý tài khoản nhân viên, vai trò và trạng thái hoạt động.
            </p>
          </div>
          <button onClick={openAdd} className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-500 cursor-pointer">
            <Plus size={18} />
            Thêm nhân viên
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Summary label="Tổng nhân viên" value={filteredStaffs.length} color="blue" />
          <Summary label="Đang hoạt động" value={activeCount} color="green" />
          <Summary label="Bị khóa" value={filteredStaffs.length - activeCount} color="red" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#2A2F3B] p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex h-[46px] w-full items-center gap-3 rounded-xl border border-white/10 bg-[#181B22] px-4 md:w-[360px]">
              <Search size={18} className="text-[#909AAB]" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && loadData()}
                placeholder="Tìm kiếm nhân viên..."
                className="h-full flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#909AAB]"
              />
            </div>
            <button onClick={loadData} className="flex h-[46px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#181B22] px-5 text-sm font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer">
              <RefreshCw size={18} />
              Tải lại
            </button>
          </div>

          {error && <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

          <div className="overflow-x-auto">
            <div className="min-w-[1120px] overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-[1.2fr_1.4fr_1.6fr_130px_130px_120px_220px] bg-[#181B22] px-5 py-4 text-sm font-bold text-slate-300">
                <span>Tên</span>
                <span>Mã NV</span>
                <span>Email</span>
                <span>SĐT</span>
                <span>Quyền</span>
                <span>Trạng thái</span>
                <span>Thao tác</span>
              </div>

              {isLoading ? (
                <div className="py-10 text-center text-sm text-slate-400 bg-[#1E2229]/20">Đang tải nhân viên...</div>
              ) : filteredStaffs.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400 bg-[#1E2229]/20">Không tìm thấy nhân viên.</div>
              ) : (
                filteredStaffs.map((staff) => (
                  <div key={staff._id} className="grid grid-cols-[1.2fr_1.4fr_1.6fr_130px_130px_120px_220px] items-center border-t border-white/5 bg-[#1E2229]/20 px-5 py-4 text-sm text-slate-300">
                    <span className="font-semibold text-white">{staff.fullname || '-'}</span>
                    <button
                      type="button"
                      onClick={() => copyStaffId(staff._id)}
                      title="Bấm để copy mã nhân viên"
                      className="w-fit max-w-[180px] truncate rounded-lg bg-slate-800 border border-white/5 px-2.5 py-1 text-left font-mono text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                    >
                      {staff._id}
                    </button>
                    <span className="break-all text-slate-400">{staff.email}</span>
                    <span className="text-slate-450">{staff.phone || '-'}</span>
                    <span className="font-semibold text-blue-400">{roleName(staff.role)}</span>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${staff.isActive === false ? 'bg-rose-955/40 text-rose-300 border border-rose-500/20' : 'bg-emerald-955/40 text-emerald-300 border border-emerald-500/20'}`}>
                      {staff.isActive === false ? 'Bị khóa' : 'Hoạt động'}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedStaff(staff); setOpenViewModal(true) }} className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-500 cursor-pointer" title="Xem chi tiết"><Eye size={16} /></button>
                      <button onClick={() => openEdit(staff)} className="rounded-lg bg-slate-800 border border-white/10 px-3 py-2 text-slate-300 hover:bg-slate-700 cursor-pointer" title="Chỉnh sửa"><Edit size={16} /></button>
                      <button onClick={() => openRole(staff)} className="rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-500 cursor-pointer" title="Phân quyền"><Shield size={16} /></button>
                      <button onClick={() => lockStaff(staff)} className="rounded-lg bg-rose-600 px-3 py-2 text-white hover:bg-rose-500 cursor-pointer" title={staff.isActive === false ? 'Mở khóa' : 'Khóa'}><Lock size={16} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <AppModal open={openViewModal} theme="dark" title="Thông tin nhân viên" onClose={() => setOpenViewModal(false)}>
          {selectedStaff && (
            <div className="space-y-3 text-sm text-slate-300">
              <p><strong>Mã nhân viên:</strong> <span className="font-mono">{selectedStaff._id}</span></p>
              <p><strong>Tên:</strong> {selectedStaff.fullname}</p>
              <p><strong>Email:</strong> {selectedStaff.email}</p>
              <p><strong>SĐT:</strong> {selectedStaff.phone || '-'}</p>
              <p><strong>Chức vụ:</strong> {selectedStaff.position || '-'}</p>
              <p><strong>Quyền:</strong> {roleName(selectedStaff.role)}</p>
            </div>
          )}
        </AppModal>

        <AppModal
          open={openRoleModal}
          theme="dark"
          title="Phân quyền nhân viên"
          onClose={() => setOpenRoleModal(false)}
          footer={
            <>
              <button onClick={() => setOpenRoleModal(false)} className="h-[42px] rounded-xl border border-white/10 bg-[#181B22] text-slate-300 hover:bg-slate-800 cursor-pointer px-6 text-sm font-semibold">Hủy</button>
              <button onClick={saveRole} className="h-[42px] rounded-xl bg-blue-600 hover:bg-blue-500 cursor-pointer px-6 text-sm font-semibold text-white">Lưu quyền</button>
            </>
          }
        >
          <select value={roleValue} onChange={(event) => setRoleValue(event.target.value)} className={inputClass}>
            <option value="">Chọn role</option>
            {roles.filter((role) => role.name !== 'admin').map((role) => (
              <option key={role._id} value={role._id}>{role.name}</option>
            ))}
          </select>
        </AppModal>

        <AppModal
          open={openFormModal}
          theme="dark"
          title={editingStaff ? 'Sửa nhân viên' : 'Thêm nhân viên'}
          onClose={() => setOpenFormModal(false)}
          footer={
            <>
              <button onClick={() => setOpenFormModal(false)} className="h-[42px] rounded-xl border border-white/10 bg-[#181B22] text-slate-300 hover:bg-slate-800 cursor-pointer px-6 text-sm font-semibold">Hủy</button>
              <button onClick={saveStaff} className="h-[42px] rounded-xl bg-blue-600 hover:bg-blue-500 cursor-pointer px-6 text-sm font-semibold text-white">Lưu</button>
            </>
          }
        >
          <div className="space-y-4">
            <input value={form.fullname} onChange={(event) => setForm((prev) => ({ ...prev, fullname: event.target.value }))} placeholder="Họ tên" className={inputClass} />
            <input disabled={Boolean(editingStaff)} value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="Email" className={inputClass} />
            {!editingStaff && <input type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} placeholder="Mật khẩu" className={inputClass} />}
            <input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Số điện thoại" className={inputClass} />
            <input value={form.position} onChange={(event) => setForm((prev) => ({ ...prev, position: event.target.value }))} placeholder="Chức vụ" className={inputClass} />
            <input value={form.address} onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))} placeholder="Địa chỉ" className={inputClass} />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.isActive} onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))} />
              Tài khoản đang hoạt động
            </label>
          </div>
        </AppModal>
      </section>
    </AdminLayout>
  )
}

function Summary({ label, value, color }: { label: string; value: number; color: 'blue' | 'green' | 'red' }) {
  const colorClass = {
    blue: 'bg-blue-955/20 text-blue-400 border border-blue-500/20',
    green: 'bg-emerald-955/20 text-emerald-400 border border-emerald-500/20',
    red: 'bg-rose-955/20 text-rose-400 border border-rose-500/20',
  }[color]
  return (
    <div className={`rounded-2xl p-5 ${colorClass}`}>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </div>
  )
}
