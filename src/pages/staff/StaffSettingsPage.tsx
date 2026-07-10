import { useEffect, useState } from 'react'
import { KeyRound, RefreshCw, Save, User } from 'lucide-react'
import { toast } from 'sonner'
import StaffLayout from '@/layouts/StaffLayout'
import { getProfile, updateProfile, changePassword } from '@/services/user.service'

export default function StaffSettingsPage() {
  const [fullname, setFullname] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [position, setPosition] = useState('')
  const [email, setEmail] = useState('')
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [error, setError] = useState('')

  const loadProfile = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await getProfile()
      if (res.data?.data) {
        const p = res.data.data
        setFullname(p.fullname || '')
        setPhone(p.phone || '')
        setAddress(p.address || '')
        setPosition(p.position || '')
        setEmail(p.email || '')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải thông tin hồ sơ.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullname.trim()) {
      toast.error('Họ tên không được để trống')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await updateProfile({
        fullname: fullname.trim(),
        phone: phone.trim(),
        address: address.trim(),
        position: position.trim(),
      })
      if (res.data?.success) {
        toast.success('Cập nhật hồ sơ thành công!')
        loadProfile()
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Lỗi khi cập nhật hồ sơ.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      toast.error('Vui lòng nhập mật khẩu hiện tại')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải từ 6 ký tự trở lên')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Xác nhận mật khẩu mới không khớp')
      return
    }

    setIsPasswordLoading(true)
    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
      })
      if (res.data?.success) {
        toast.success('Đổi mật khẩu thành công!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Lỗi khi đổi mật khẩu.')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  return (
    <StaffLayout title="Cài đặt tài khoản">
      <section className="mx-auto w-full max-w-[1200px] space-y-6 font-sans text-white">
        <div>
          <h1 className="text-2xl font-bold text-white">Cài đặt tài khoản</h1>
          <p className="mt-1 text-sm text-slate-400">
            Cập nhật thông tin cá nhân và thay đổi mật khẩu tài khoản của bạn.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Personal Info Form */}
          <div className="rounded-2xl bg-[#2A2F3B] p-6 shadow-sm border border-white/10">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/10">
              <User className="text-blue-400 w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Thông tin cá nhân</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email (Không thể thay đổi)
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="h-[46px] w-full rounded-xl border border-white/5 bg-[#181B22]/50 px-4 text-sm text-slate-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Họ tên nhân viên
                </label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Nhập họ và tên"
                  className="h-[46px] w-full rounded-xl border border-white/10 bg-[#181B22] text-white px-4 text-sm outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="h-[46px] w-full rounded-xl border border-white/10 bg-[#181B22] text-white px-4 text-sm outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Chức vụ / Vị trí
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Ví dụ: Nhân viên kho, Nhân viên hỗ trợ"
                  className="h-[46px] w-full rounded-xl border border-white/10 bg-[#181B22] text-white px-4 text-sm outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Địa chỉ liên hệ
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ"
                  className="h-[46px] w-full rounded-xl border border-white/10 bg-[#181B22] text-white px-4 text-sm outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
                >
                  <Save size={18} />
                  {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>

                <button
                  type="button"
                  onClick={loadProfile}
                  className="flex h-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#181B22] px-5 text-sm font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  <RefreshCw size={16} />
                  Hoàn tác
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="rounded-2xl bg-[#2A2F3B] p-6 shadow-sm border border-white/10 text-white">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/10">
              <KeyRound className="text-green-400 w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Đổi mật khẩu</h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="h-[46px] w-full rounded-xl border border-white/10 bg-[#181B22] text-white px-4 text-sm outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="h-[46px] w-full rounded-xl border border-white/10 bg-[#181B22] text-white px-4 text-sm outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="h-[46px] w-full rounded-xl border border-white/10 bg-[#181B22] text-white px-4 text-sm outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPasswordLoading}
                  className="flex h-[44px] items-center justify-center gap-2 rounded-xl bg-green-600 px-6 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50 cursor-pointer"
                >
                  <KeyRound size={18} />
                  {isPasswordLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </StaffLayout>
  )
}
