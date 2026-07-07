import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { ChevronLeft, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword } from '@/services/auth.service'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    const result = forgotPasswordSchema.safeParse(values)

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ForgotPasswordFormValues
        setError(path, { message: issue.message })
      })
      return
    }

    try {
      setIsLoading(true)
      await forgotPassword({ email: values.email })
      navigate('/reset-password', {
        state: { email: values.email },
      })
    } catch {
      setError('email', {
        message: 'Không thể gửi yêu cầu đặt lại mật khẩu',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09051f] text-white">
      <header className="mx-auto flex h-20 w-full max-w-[1840px] items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-baseline gap-1">
          <span className="text-3xl font-black">PCAcc</span>
          <span className="text-sm font-black">.com</span>
        </Link>
        <Link to="/login" className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-black text-[#d9d4f2] hover:bg-white/15">
          Đăng nhập
        </Link>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1840px] items-center justify-center px-4 pb-10 sm:px-6">
        <section className="w-full max-w-[560px] rounded-[26px] border border-[#3d63ff]/20 bg-[#211b42] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#b9b4d7] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại đăng nhập
          </button>

          <p className="text-sm font-black uppercase text-[#79a7ff]">Khôi phục tài khoản</p>
          <h1 className="mt-2 text-3xl font-black text-white">Đặt lại mật khẩu</h1>
          <p className="mt-2 text-sm leading-6 text-[#b9b4d7]">
            Nhập email đã đăng ký. Chúng tôi sẽ gửi mã xác nhận để bạn tạo mật khẩu mới.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className={`flex h-12 items-center gap-3 rounded-2xl border bg-[#171233] px-4 ${
                errors.email ? 'border-[#ff7b8f]' : 'border-[#3d63ff]/25 focus-within:border-[#79a7ff]'
              }`}>
                <Mail className="h-5 w-5 text-[#79a7ff]" />
                <input
                  type="email"
                  placeholder="Email"
                  {...register('email')}
                  className="h-full flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-[#8d86b6]"
                />
              </div>
              {errors.email && <span className="pl-2 text-xs font-semibold text-[#ff7b8f]">{errors.email.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#1677ff] text-sm font-black text-white transition-colors hover:bg-[#0f66df] disabled:cursor-not-allowed disabled:bg-[#625b84]"
            >
              {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
