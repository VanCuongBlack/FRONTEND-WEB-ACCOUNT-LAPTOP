import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from 'lucide-react'
import { registerSchema, type RegisterFormValues } from '@/utils/validators'
import { useAuth } from '@/hooks/useAuth'
import { loadGoogleSdk, initGoogleAuth, triggerGoogleLogin } from '@/utils/googleAuth'
import { googleLogin } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'

export default function RegisterForm() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuth()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState(false)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const isGoogleConfigured =
    Boolean(googleClientId) &&
    String(googleClientId).endsWith('.apps.googleusercontent.com') &&
    !String(googleClientId).includes('placeholder')

  const {
    register: field,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '' },
  })

  useEffect(() => {
    if (!isGoogleConfigured) return

    loadGoogleSdk()
      .then(() => {
        initGoogleAuth(googleClientId, async (idToken) => {
          try {
            const response = await googleLogin(idToken)
            const data = response.data.data
            if (!response.data.success || !data) {
              setError('root', {
                type: 'server',
                message: response.data.message || 'Đăng nhập Google thất bại.',
              })
              return
            }

            const role =
              typeof data.user.role === 'string'
                ? data.user.role
                : data.user.role && typeof data.user.role === 'object' && 'name' in data.user.role
                  ? data.user.role.name || 'customer'
                  : 'customer'

            setAuth({ ...data.user, role }, data.accessToken, data.refreshToken)

            if (role === 'admin') {
              navigate('/admin')
              return
            }

            if (role === 'staff') {
              navigate('/staff')
              return
            }

            navigate('/')
          } catch (err: any) {
            setError('root', {
              type: 'server',
              message: err?.response?.data?.message || err?.message || 'Đăng nhập Google thất bại.',
            })
          }
        })
      })
      .catch((err) => console.error('Lỗi khi tải Google SDK:', err))
  }, [googleClientId, isGoogleConfigured, navigate, setAuth, setError])

  const onSubmit = async (data: RegisterFormValues) => {
    const response = await registerUser({
      fullname: data.fullName,
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      password: data.password,
    })

    if (response.success) {
      setSuccess(true)
      navigate('/verify-email', { state: { email: data.email.trim().toLowerCase() } })

      return
    }

    if (response.error?.toLowerCase().includes('email')) {
      setError('email', { type: 'server', message: response.error })
      return
    }

    if (response.error?.toLowerCase().includes('điện thoại') || response.error?.toLowerCase().includes('phone')) {
      setError('phone', { type: 'server', message: response.error })
      return
    }

    setError('root', {
      type: 'server',
      message: response.error || 'Đăng ký thất bại',
    })
  }

  const handleGoogleRegister = () => {
    if (!isGoogleConfigured) {
      setError('root', {
        type: 'manual',
        message: 'Đăng ký Google chưa được cấu hình. Cần thêm VITE_GOOGLE_CLIENT_ID hợp lệ vào file .env FE.',
      })
      return
    }

    triggerGoogleLogin()
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle2 className="h-16 w-16 text-[#35d07f]" />
        <p className="text-2xl font-black text-white">Đăng ký thành công</p>
        <p className="max-w-sm text-sm leading-6 text-[#b9b4d7]">
          Vui lòng xác thực email của bạn. Sau đó đăng nhập để tiếp tục mua sắm.
        </p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mt-2 rounded-2xl bg-[#1677ff] px-5 py-3 text-sm font-black text-white hover:bg-[#0f66df]"
        >
          Đến trang đăng nhập
        </button>
      </div>
    )
  }

  const iconCls = 'h-5 w-5 shrink-0 text-[#79a7ff]'
  const inputCls = 'h-12 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-[#8d86b6]'

  const Field = ({
    icon,
    error,
    children,
  }: {
    icon: React.ReactNode
    error?: string
    children: React.ReactNode
  }) => (
    <div className="flex flex-col gap-2">
      <div className={`flex items-center gap-3 rounded-2xl border bg-[#171233] px-4 transition-colors ${
        error ? 'border-[#ff7b8f]' : 'border-[#3d63ff]/25 focus-within:border-[#79a7ff]'
      }`}>
        {icon}
        {children}
      </div>
      {error && <p className="pl-2 text-xs font-semibold text-[#ff7b8f]">{error}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex w-full flex-col gap-5">
      <div>
        <p className="text-sm font-black uppercase text-[#79a7ff]">Đăng ký</p>
        <h1 className="mt-2 text-3xl font-black text-white">Tạo tài khoản mới</h1>
        <p className="mt-2 text-sm text-[#b9b4d7]">Nhập thông tin để bắt đầu mua sắm trên PCAcc.</p>
      </div>

      <Field icon={<User className={iconCls} />} error={errors.fullName?.message}>
        <input {...field('fullName')} type="text" placeholder="Họ và tên" className={inputCls} />
      </Field>

      <Field icon={<Mail className={iconCls} />} error={errors.email?.message}>
        <input {...field('email')} type="email" placeholder="Email" className={inputCls} />
      </Field>

      <Field icon={<Phone className={iconCls} />} error={errors.phone?.message}>
        <input
          {...field('phone')}
          type="tel"
          inputMode="numeric"
          maxLength={11}
          placeholder="Số điện thoại"
          className={inputCls}
        />
      </Field>

      <Field icon={<Lock className={iconCls} />} error={errors.password?.message}>
        <input
          {...field('password')}
          type={showPass ? 'text' : 'password'}
          placeholder="Mật khẩu"
          autoComplete="new-password"
          className={inputCls}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPass((value) => !value)}
          className="shrink-0 text-[#8d86b6] hover:text-white"
        >
          {showPass ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </button>
      </Field>

      <Field icon={<Lock className={iconCls} />} error={errors.confirmPassword?.message}>
        <input
          {...field('confirmPassword')}
          type={showConfirm ? 'text' : 'password'}
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
          className={inputCls}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowConfirm((value) => !value)}
          className="shrink-0 text-[#8d86b6] hover:text-white"
        >
          {showConfirm ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </button>
      </Field>

      {errors.root?.message && (
        <p className="rounded-2xl bg-[#ff7b8f]/10 px-4 py-3 text-center text-sm font-semibold text-[#ff7b8f]">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1677ff] text-sm font-black text-white transition-colors hover:bg-[#0f66df] disabled:cursor-not-allowed disabled:bg-[#625b84]"
      >
        {isSubmitting || isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          'Đăng ký'
        )}
      </button>

      <button
        type="button"
        onClick={handleGoogleRegister}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[#3d63ff]/25 bg-[#171233] text-sm font-black text-white hover:border-[#79a7ff]"
      >
        G
        Đăng ký bằng Google
      </button>

      <p className="text-center text-sm text-[#b9b4d7]">
        Đã có tài khoản?{' '}
        <button type="button" onClick={() => navigate('/login')} className="font-black text-[#79a7ff] hover:text-white">
          Đăng nhập
        </button>
      </p>
    </form>
  )
}
