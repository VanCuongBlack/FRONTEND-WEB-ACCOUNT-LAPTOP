import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { loadGoogleSdk, initGoogleAuth, triggerGoogleLogin } from '@/utils/googleAuth'

const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  password: z.string().min(6, {
    message: 'Mật khẩu phải từ 6 ký tự trở lên',
  }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1035252877685-placeholder.apps.googleusercontent.com'
    loadGoogleSdk()
      .then(() => {
        initGoogleAuth(clientId, (accessToken) => {
          navigate(`/auth/google/success?googleToken=${accessToken}`)
        })
      })
      .catch((err) => console.error('Lỗi khi tải Google SDK:', err))
  }, [navigate])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    const result = loginSchema.safeParse(values)

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof LoginFormValues
        setError(path, { message: issue.message })
      })
      return
    }

    const response = await login(values.email, values.password)

    if (!response.success) {

      if (
        response.error?.toLowerCase().includes('chưa được xác thực') ||
        response.error?.toLowerCase().includes('chưa xác thực')
      ) {
        navigate('/verify-email', { state: { email: values.email.trim().toLowerCase() } })
        return
      }

      setError('password', {
        message: response.error || 'Email hoặc mật khẩu không đúng',
      })
      return
    }

    const role = response.user?.role

    if (role === 'admin') {
      navigate('/admin')
      return
    }

    if (role === 'staff') {
      navigate('/staff')
      return
    }

    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#09051f] text-white">
      <header className="mx-auto flex h-20 w-full max-w-[1840px] items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-baseline gap-1">
          <span className="text-3xl font-black">PCAcc</span>
          <span className="text-sm font-black">.com</span>
        </Link>
        <Link to="/register" className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-black text-[#d9d4f2] hover:bg-white/15">
          Đăng ký
        </Link>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-[1840px] grid-cols-1 items-center gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-[1fr_540px]">
        <section className="hidden max-w-3xl lg:block">
          <p className="text-sm font-black uppercase text-[#79a7ff]">PCAcc member</p>
          <h1 className="mt-4 text-5xl font-black leading-tight">
            Đăng nhập để tiếp tục mua PC, laptop và account số.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b4d7]">
            Theo dõi đơn hàng, lưu lịch sử mua, gửi yêu cầu bảo hành và nhận ưu đãi riêng cho tài khoản của bạn.
          </p>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-4">
            {[
              [ShieldCheck, 'Bảo mật tài khoản'],
              [Zap, 'Mua hàng nhanh'],
              [Sparkles, 'Ưu đãi thành viên'],
            ].map(([Icon, label]) => (
              <div key={label as string} className="rounded-[22px] bg-[#211b42] p-5">
                <Icon className="h-7 w-7 text-[#79a7ff]" />
                <p className="mt-3 text-sm font-black text-white">{label as string}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full rounded-[26px] border border-[#3d63ff]/20 bg-[#211b42] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <div>
            <p className="text-sm font-black uppercase text-[#79a7ff]">Đăng nhập</p>
            <h1 className="mt-2 text-3xl font-black text-white">Chào mừng trở lại</h1>
            <p className="mt-2 text-sm text-[#b9b4d7]">Nhập thông tin tài khoản để tiếp tục.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex w-full flex-col gap-5">
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

            <div className="flex flex-col gap-2">
              <div className={`flex h-12 items-center gap-3 rounded-2xl border bg-[#171233] px-4 ${
                errors.password ? 'border-[#ff7b8f]' : 'border-[#3d63ff]/25 focus-within:border-[#79a7ff]'
              }`}>
                <Lock className="h-5 w-5 text-[#79a7ff]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  {...register('password')}
                  className="h-full flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-[#8d86b6]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-[#8d86b6] hover:text-white"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <span className="pl-2 text-xs font-semibold text-[#ff7b8f]">{errors.password.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#1677ff] text-sm font-black text-white transition-colors hover:bg-[#0f66df] disabled:cursor-not-allowed disabled:bg-[#625b84]"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm font-bold text-[#79a7ff] hover:text-white"
            >
              Quên mật khẩu?
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-bold text-[#8d86b6]">hoặc</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              type="button"
              onClick={triggerGoogleLogin}
              className="flex h-12 w-full items-center justify-center rounded-2xl border border-[#3d63ff]/25 bg-[#171233] text-sm font-black text-white hover:border-[#79a7ff]"
            >
              Đăng nhập bằng Google
            </button>

            <p className="text-center text-sm text-[#b9b4d7]">
              Chưa có tài khoản?{' '}
              <button type="button" onClick={() => navigate('/register')} className="font-black text-[#79a7ff] hover:text-white">
                Đăng ký ngay
              </button>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}
