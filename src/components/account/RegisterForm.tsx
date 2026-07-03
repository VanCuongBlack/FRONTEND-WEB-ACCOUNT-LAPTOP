import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from 'lucide-react'
import { toast } from 'sonner'
import { registerSchema, type RegisterFormValues } from '@/utils/validators'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterForm() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuth()
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register: field,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    const response = await registerUser({
      fullname: data.fullName,
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      password: data.password,
    })

    if (response.success) {
      setSuccess(true)
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
          {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
          {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
        onClick={() => toast.info('Google OAuth chưa được tích hợp.')}
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
