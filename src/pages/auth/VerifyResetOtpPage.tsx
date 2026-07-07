import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, KeyRound, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { forgotPassword, verifyResetOtp } from '@/services/auth.service'
import { verifyEmailSchema, type VerifyEmailFormValues } from '@/utils/validators'

export default function VerifyResetOtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const emailFromState = (location.state as { email?: string })?.email ?? ''

  const [cooldown, setCooldown] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: emailFromState, otp: '' },
  })

  useEffect(() => {
    if (!emailFromState) {
      toast.error('Không tìm thấy email. Vui lòng thử lại.')
      navigate('/forgot-password')
    }
  }, [emailFromState, navigate])

  useEffect(() => {
    if (cooldown <= 0) return
    timerRef.current = setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [cooldown])

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otpDigits]
    next[index] = digit
    setOtpDigits(next)
    setValue('otp', next.join(''))
    if (digit && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (event: React.ClipboardEvent) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = pasted.split('').concat(Array(6).fill('')).slice(0, 6)
    setOtpDigits(next)
    setValue('otp', next.join(''))
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    event.preventDefault()
  }

  const onSubmit = async (data: VerifyEmailFormValues) => {
    try {
      const res = await verifyResetOtp({ email: emailFromState, otp: data.otp })
      if (res.data?.success === false) {
        toast.error(res.data.message || 'Mã OTP không hợp lệ.')
        return
      }
      toast.success('Xác thực OTP thành công. Vui lòng đặt mật khẩu mới.')
      navigate('/reset-password', { state: { email: emailFromState, otp: data.otp } })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Mã OTP không đúng hoặc đã hết hạn.'
      toast.error(message)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || isSending) return
    try {
      setIsSending(true)
      const res = await forgotPassword({ email: emailFromState })
      if (res.data?.success === false) {
        toast.error(res.data.message || 'Không thể gửi lại OTP.')
        return
      }
      toast.success('Đã gửi lại OTP. Vui lòng kiểm tra email.')
      setCooldown(60)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gửi lại OTP thất bại.'
      toast.error(message)
    } finally {
      setIsSending(false)
    }
  }

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
        <section className="w-full max-w-[560px] rounded-[26px] border border-[#3d63ff]/20 bg-[#211b42] p-5 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="mb-6 flex items-center gap-2 text-sm font-bold text-[#b9b4d7] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </button>

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#171233]">
            <KeyRound className="h-10 w-10 text-[#79a7ff]" />
          </div>

          <h1 className="text-3xl font-black text-white">Xác thực OTP</h1>
          <p className="mt-3 text-sm leading-6 text-[#b9b4d7]">
            Nhập mã OTP đặt lại mật khẩu đã gửi đến
          </p>
          <p className="mt-1 break-all text-sm font-black text-[#79a7ff]">{emailFromState}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col items-center gap-7">
            <div className="grid w-full grid-cols-6 gap-2 sm:gap-3" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleOtpChange(index, event.target.value)}
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  className="h-14 rounded-2xl border border-[#3d63ff]/25 bg-[#171233] text-center text-xl font-black text-white outline-none transition-all focus:border-[#79a7ff] focus:ring-2 focus:ring-[#79a7ff]/20 sm:h-[70px] sm:text-2xl"
                  aria-label={`Chữ số OTP thứ ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otpDigits.join('').length < 6}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1677ff] text-sm font-black text-white transition-colors hover:bg-[#0f66df] disabled:cursor-not-allowed disabled:bg-[#625b84]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                'Xác thực OTP'
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="text-sm text-[#b9b4d7]">Không nhận được mã?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isSending}
              className="text-sm font-black text-[#79a7ff] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? 'Đang gửi...' : cooldown > 0 ? `Gửi lại sau ${cooldown}s` : 'Gửi lại mã OTP'}
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
