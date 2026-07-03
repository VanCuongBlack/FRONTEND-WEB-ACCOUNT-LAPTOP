import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChevronLeft, Eye, EyeOff, Lock } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { resetPassword } from '@/services/auth.service'
import { resetPasswordSchema } from '@/utils/validators'
import { toast } from 'sonner'

type ResetPasswordFormValues = {
  newPassword: string
  confirmNewPassword: string
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [isLoading, setIsLoading] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true })
    }
  }, [email, navigate])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    const result = resetPasswordSchema.safeParse({
      email,
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword,
    })

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0]
        if (path === 'newPassword' || path === 'confirmNewPassword') {
          setError(path, { message: issue.message })
        }
      })
      return
    }

    try {
      setIsLoading(true)
      const res = await resetPassword({
        email,
        newPassword: values.newPassword,
      })
      if (res.data?.success === false) {
        setError('newPassword', {
          message: res.data.message || 'Không thể đặt lại mật khẩu.',
        })
        return
      }
      toast.success('Đặt lại mật khẩu thành công.')
      navigate('/login')
    } catch {
      setError('newPassword', {
        message: 'Không thể đặt lại mật khẩu. Vui lòng xác thực OTP lại.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const inputCls =
    'h-full flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-[#8d86b6]'

  return (
    <div className="min-h-screen bg-[#09051f] text-white">
      <header className="mx-auto flex h-20 w-full max-w-[1840px] items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-baseline gap-1">
          <span className="text-3xl font-black">PCAcc</span>
          <span className="text-sm font-black">.com</span>
        </Link>
        <Link
          to="/login"
          className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-black text-[#d9d4f2] hover:bg-white/15"
        >
          Đăng nhập
        </Link>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1840px] items-center justify-center px-4 pb-10 sm:px-6">
        <section className="w-full max-w-[560px] rounded-[26px] border border-[#3d63ff]/20 bg-[#211b42] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#b9b4d7] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </button>

          <p className="text-sm font-black uppercase text-[#79a7ff]">Bảo mật</p>
          <h1 className="mt-2 text-3xl font-black text-white">Tạo mật khẩu mới</h1>
          <p className="mt-2 text-sm leading-6 text-[#b9b4d7]">
            OTP đã được xác thực. Nhập mật khẩu mới cho tài khoản {email}.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div
                className={`flex h-12 items-center gap-3 rounded-2xl border bg-[#171233] px-4 ${
                  errors.newPassword
                    ? 'border-[#ff7b8f]'
                    : 'border-[#3d63ff]/25 focus-within:border-[#79a7ff]'
                }`}
              >
                <Lock className="h-5 w-5 text-[#79a7ff]" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu mới"
                  {...register('newPassword')}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((value) => !value)}
                  className="text-[#8d86b6] hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <span className="pl-2 text-xs font-semibold text-[#ff7b8f]">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div
                className={`flex h-12 items-center gap-3 rounded-2xl border bg-[#171233] px-4 ${
                  errors.confirmNewPassword
                    ? 'border-[#ff7b8f]'
                    : 'border-[#3d63ff]/25 focus-within:border-[#79a7ff]'
                }`}
              >
                <Lock className="h-5 w-5 text-[#79a7ff]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu mới"
                  {...register('confirmNewPassword')}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="text-[#8d86b6] hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <span className="pl-2 text-xs font-semibold text-[#ff7b8f]">
                  {errors.confirmNewPassword.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#1677ff] text-sm font-black text-white transition-colors hover:bg-[#0f66df] disabled:cursor-not-allowed disabled:bg-[#625b84]"
            >
              {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
