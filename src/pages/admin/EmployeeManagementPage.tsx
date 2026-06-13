import { useMemo, useState } from 'react'
import { Search, Plus, Eye, Edit, Lock, Unlock, Shield } from 'lucide-react'
import AdminLayout from '@/layouts/AdminLayout'
import AppModal from '@/components/common/AppModal'

type EmployeeStatus = 'Hoạt động' | 'Bị khóa' | 'Đang mời'
type EmployeeRole = 'Admin' | 'Staff' | 'Manager'

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  role: EmployeeRole
  status: EmployeeStatus
}

const initialEmployees: Employee[] = [
  {
    id: 'NV01',
    name: 'Nguyễn Văn A',
    email: 'admin@gmail.com',
    phone: '0901234567',
    position: 'Quản lý',
    role: 'Admin',
    status: 'Hoạt động',
  },
  {
    id: 'NV02',
    name: 'Nguyễn Văn B',
    email: 'staff@gmail.com',
    phone: '0912345678',
    position: 'Nhân viên kho',
    role: 'Staff',
    status: 'Hoạt động',
  },
  {
    id: 'NV03',
    name: 'Trần Thị C',
    email: 'manager@gmail.com',
    phone: '0923456789',
    position: 'Quản lý đơn hàng',
    role: 'Manager',
    status: 'Bị khóa',
  },
]

const emptyForm: Employee = {
  id: '',
  name: '',
  email: '',
  phone: '',
  position: '',
  role: 'Staff',
  status: 'Hoạt động',
}

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [keyword, setKeyword] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const [openViewModal, setOpenViewModal] = useState(false)
  const [openRoleModal, setOpenRoleModal] = useState(false)
  const [openFormModal, setOpenFormModal] = useState(false)

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [employeeForm, setEmployeeForm] = useState<Employee>(emptyForm)
  const [roleValue, setRoleValue] = useState<EmployeeRole>('Staff')

  const filteredEmployees = useMemo(() => {
    const search = keyword.toLowerCase().trim()
    if (!search) return employees

    return employees.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.phone.includes(search) ||
        item.id.toLowerCase().includes(search)
    )
  }, [employees, keyword])

  const totalEmployees = employees.length
  const activeEmployees = employees.filter((item) => item.status === 'Hoạt động').length
  const invitedEmployees = employees.filter((item) => item.status === 'Đang mời').length
  const lockedEmployees = employees.filter((item) => item.status === 'Bị khóa').length

  const handleOpenAdd = () => {
    setEditingEmployee(null)
    setEmployeeForm({
      ...emptyForm,
      id: `NV${String(employees.length + 1).padStart(2, '0')}`,
    })
    setOpenFormModal(true)
  }

  const handleOpenEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setEmployeeForm(employee)
    setOpenFormModal(true)
  }

  const handleSaveEmployee = () => {
    if (!employeeForm.id.trim() || !employeeForm.name.trim() || !employeeForm.email.trim()) return

    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((item) => (item.id === editingEmployee.id ? employeeForm : item))
      )
    } else {
      setEmployees((prev) => [...prev, employeeForm])
    }

    setOpenFormModal(false)
    setEditingEmployee(null)
    setEmployeeForm(emptyForm)
  }

  const handleToggleLock = (id: string) => {
    setEmployees((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'Bị khóa' ? 'Hoạt động' : 'Bị khóa' }
          : item
      )
    )
  }

  const handleOpenRole = (employee: Employee) => {
    setSelectedEmployee(employee)
    setRoleValue(employee.role)
    setOpenRoleModal(true)
  }

  const handleSaveRole = () => {
    if (!selectedEmployee) return

    setEmployees((prev) =>
      prev.map((item) =>
        item.id === selectedEmployee.id ? { ...item, role: roleValue } : item
      )
    )

    setOpenRoleModal(false)
  }

  const statusClass = (status: EmployeeStatus) => {
    if (status === 'Hoạt động') return 'bg-green-100 text-green-700'
    if (status === 'Bị khóa') return 'bg-red-100 text-red-600'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <AdminLayout title="Quản lý nhân viên">
      <section className="mx-auto max-w-[1200px] space-y-6 font-sans">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân viên</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý tài khoản nhân viên, trạng thái hoạt động và phân quyền.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-sm text-gray-500">Tổng nhân viên</p>
            <p className="mt-3 text-3xl font-bold text-blue-700">{totalEmployees}</p>
          </div>

          <div className="rounded-2xl bg-green-50 p-5">
            <p className="text-sm text-gray-500">Tài khoản Active</p>
            <p className="mt-3 text-3xl font-bold text-green-700">{activeEmployees}</p>
          </div>

          <div className="rounded-2xl bg-yellow-50 p-5">
            <p className="text-sm text-gray-500">Đang mời</p>
            <p className="mt-3 text-3xl font-bold text-yellow-700">{invitedEmployees}</p>
          </div>

          <div className="rounded-2xl bg-red-50 p-5">
            <p className="text-sm text-gray-500">Bị khóa</p>
            <p className="mt-3 text-3xl font-bold text-red-600">{lockedEmployees}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex h-[46px] w-full items-center gap-3 rounded-xl border border-gray-200 px-4 md:w-[360px]">
              <Search size={18} className="text-gray-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm nhân viên..."
                className="h-full flex-1 bg-transparent text-sm outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              Thêm nhân viên
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1000px] overflow-hidden rounded-2xl border border-gray-100">
              <div className="grid grid-cols-[100px_1.2fr_1.7fr_140px_150px_120px_220px] bg-gray-100 px-5 py-4 text-sm font-bold">
                <span>Mã NV</span>
                <span>Tên</span>
                <span>Email</span>
                <span>SĐT</span>
                <span>Quyền</span>
                <span>Trạng thái</span>
                <span>Thao tác</span>
              </div>

              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="grid grid-cols-[100px_1.2fr_1.7fr_140px_150px_120px_220px] items-center border-t border-gray-100 px-5 py-4 text-sm"
                >
                  <span className="font-semibold">{employee.id}</span>
                  <span>{employee.name}</span>
                  <span className="break-all text-gray-600">{employee.email}</span>
                  <span className="text-gray-600">{employee.phone}</span>
                  <span className="font-semibold text-blue-600">{employee.role}</span>
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                      employee.status
                    )}`}
                  >
                    {employee.status}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEmployee(employee)
                        setOpenViewModal(true)
                      }}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(employee)}
                      className="rounded-lg bg-gray-600 px-3 py-2 text-white hover:bg-gray-700"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenRole(employee)}
                      className="rounded-lg bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                    >
                      <Shield size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleLock(employee.id)}
                      className={`rounded-lg px-3 py-2 text-white ${
                        employee.status === 'Bị khóa'
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {employee.status === 'Bị khóa' ? <Unlock size={16} /> : <Lock size={16} />}
                    </button>
                  </div>
                </div>
              ))}

              {filteredEmployees.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-500">
                  Không tìm thấy nhân viên.
                </div>
              )}
            </div>
          </div>
        </div>

        <AppModal open={openViewModal} title="Thông tin nhân viên" onClose={() => setOpenViewModal(false)}>
          {selectedEmployee && (
            <div className="space-y-3 text-sm">
              <p><strong>Mã NV:</strong> {selectedEmployee.id}</p>
              <p><strong>Tên:</strong> {selectedEmployee.name}</p>
              <p><strong>Email:</strong> {selectedEmployee.email}</p>
              <p><strong>SĐT:</strong> {selectedEmployee.phone}</p>
              <p><strong>Chức vụ:</strong> {selectedEmployee.position}</p>
              <p><strong>Quyền:</strong> {selectedEmployee.role}</p>
              <p><strong>Trạng thái:</strong> {selectedEmployee.status}</p>
            </div>
          )}
        </AppModal>

        <AppModal
          open={openRoleModal}
          title="Phân quyền nhân viên"
          onClose={() => setOpenRoleModal(false)}
          footer={
            <>
              <button onClick={() => setOpenRoleModal(false)} className="h-[42px] rounded-xl border px-6 text-sm font-semibold">
                Hủy
              </button>
              <button onClick={handleSaveRole} className="h-[42px] rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white">
                Lưu quyền
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Nhân viên: <strong>{selectedEmployee?.name}</strong>
            </p>

            <select
              value={roleValue}
              onChange={(e) => setRoleValue(e.target.value as EmployeeRole)}
              className="h-[46px] w-full rounded-xl border border-gray-300 px-4 text-sm outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
        </AppModal>

        <AppModal
          open={openFormModal}
          title={editingEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên'}
          onClose={() => setOpenFormModal(false)}
          footer={
            <>
              <button onClick={() => setOpenFormModal(false)} className="h-[42px] rounded-xl border px-6 text-sm font-semibold">
                Hủy
              </button>
              <button onClick={handleSaveEmployee} className="h-[42px] rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white">
                Lưu
              </button>
            </>
          }
        >
          <div className="space-y-4">
            {[
              ['id', 'Mã nhân viên'],
              ['name', 'Tên nhân viên'],
              ['email', 'Email'],
              ['phone', 'Số điện thoại'],
              ['position', 'Chức vụ'],
            ].map(([key, placeholder]) => (
              <input
                key={key}
                value={employeeForm[key as keyof Employee] as string}
                onChange={(e) =>
                  setEmployeeForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                placeholder={placeholder}
                className="h-[46px] w-full rounded-xl border border-gray-300 px-4 text-sm outline-none"
              />
            ))}

            <select
              value={employeeForm.role}
              onChange={(e) =>
                setEmployeeForm((prev) => ({ ...prev, role: e.target.value as EmployeeRole }))
              }
              className="h-[46px] w-full rounded-xl border border-gray-300 px-4 text-sm outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
            </select>

            <select
              value={employeeForm.status}
              onChange={(e) =>
                setEmployeeForm((prev) => ({
                  ...prev,
                  status: e.target.value as EmployeeStatus,
                }))
              }
              className="h-[46px] w-full rounded-xl border border-gray-300 px-4 text-sm outline-none"
            >
              <option value="Hoạt động">Hoạt động</option>
              <option value="Bị khóa">Bị khóa</option>
              <option value="Đang mời">Đang mời</option>
            </select>
          </div>
        </AppModal>
      </section>
    </AdminLayout>
  )
}