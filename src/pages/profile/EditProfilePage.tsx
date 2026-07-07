import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Eye, EyeOff, Lock, Save, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useUser } from '@/hooks/useUser'

const inputClass =
  'h-[48px] w-full rounded-xl border border-[#3d63ff]/30 bg-[#151033] px-4 text-sm text-white outline-none placeholder:text-[#8d86b6] focus:border-[#3783EC] focus:ring-2 focus:ring-[#3783EC]/20'
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { user, updateProfile, changePassword } = useUser()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [position, setPosition] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (!user) return
    setFullName(user.fullname || '')
    setPhone(user.phone || '')
    setAddress(user.address || '')
    setPosition(user.position || '')
  }, [user])

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProfileSaving(true)
    try {
      const updated = await updateProfile({
        fullname: fullName,
        phone,
        address,
        position,
      })
      if (updated) navigate('/profile')
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordError('')

    if (!passwordPattern.test(newPassword)) {
      setPasswordError('Mật khẩu mới cần ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự @$!%*?&.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp.')
      return
    }

    setPasswordSaving(true)
    try {
      const changed = await changePassword(currentPassword, newPassword)
      if (changed) {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#09051f] text-white">
      <Header pageLabel="Sửa hồ sơ" />

      <main className="mx-auto w-full max-w-[1840px] flex-1 px-4 py-6">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="mb-5 text-sm font-semibold text-[#b9b4d7] hover:text-white"
        >
          Quay lại hồ sơ
        </button>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
          <section className="rounded-[22px] border border-[#3d63ff]/20 bg-[#211b42] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-[#3d63ff]/20 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3783EC]/15 text-[#7db3ff]">
                <UserRound size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Hồ sơ của tôi</h1>
                <p className="mt-1 text-sm text-[#b9b4d7]">
                  Cập nhật thông tin liên hệ và địa chỉ giao hàng.
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Họ và tên">
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className={inputClass}
                  required
                />
              </Field>

              <Field label="Số điện thoại">
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className={inputClass}
                  required
                />
              </Field>

              <Field label="Chức vụ">
                <input
                  value={position}
                  onChange={(event) => setPosition(event.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Email">
                <input value={user?.email || ''} className={`${inputClass} opacity-70`} disabled />
              </Field>

              <div className="md:col-span-2">
                <Field label="Địa chỉ giao hàng">
                  <textarea
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    rows={4}
                    className={`${inputClass} min-h-[110px] resize-none py-3`}
                    required
                  />
                </Field>
              </div>

              <div className="md:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-[#3783EC] px-6 text-sm font-bold text-white hover:bg-[#206ed6] disabled:cursor-not-allowed disabled:bg-gray-500"
                >
                  <Save size={18} />
                  {profileSaving ? 'Đang lưu...' : 'Lưu hồ sơ'}
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-[22px] border border-[#3d63ff]/20 bg-[#211b42] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-[#3d63ff]/20 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3783EC]/15 text-[#7db3ff]">
                <Lock size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Đổi mật khẩu</h2>
                <p className="mt-1 text-sm text-[#b9b4d7]">
                  Form này nối trực tiếp API /user/change-password.
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <PasswordField
                label="Mật khẩu hiện tại"
                value={currentPassword}
                onChange={setCurrentPassword}
                show={showPassword}
              />
              <PasswordField
                label="Mật khẩu mới"
                value={newPassword}
                onChange={setNewPassword}
                show={showPassword}
              />
              <PasswordField
                label="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showPassword}
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#7db3ff] hover:text-white"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                {showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              </button>

              {passwordError && (
                <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {passwordError}
                </p>
              )}

              <button
                type="submit"
                disabled={passwordSaving}
                className="h-[46px] w-full rounded-xl bg-[#3783EC] text-sm font-bold text-white hover:bg-[#206ed6] disabled:cursor-not-allowed disabled:bg-gray-500"
              >
                {passwordSaving ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#d9d6ee]">{label}</span>
      {children}
    </label>
  )
}

function PasswordField({
  label,
  value,
  onChange,
  show,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  show: boolean
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#d9d6ee]">{label}</span>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
        required
      />
    </label>
  )
}
