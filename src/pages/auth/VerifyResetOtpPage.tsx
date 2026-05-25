import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, Loader2, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { verifyResetOtp, forgotPassword } from '@/services/auth.service'
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
      setCooldown((c) => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [cooldown])

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otpDigits]
    next[index] = digit
    setOtpDigits(next)
    setValue('otp', next.join(''))
    if (digit && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = pasted.split('').concat(Array(6).fill('')).slice(0, 6)
    setOtpDigits(next)
    setValue('otp', next.join(''))
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    e.preventDefault()
  }

  const onSubmit = async (data: VerifyEmailFormValues) => {
    try {
      const res = await verifyResetOtp({ email: emailFromState, otp: data.otp })
      if (res.data?.success === false) {
        toast.error(res.data.message || 'Mã OTP không hợp lệ.')
        return
      }
      toast.success('Xác thực OTP thành công! Vui lòng đặt mật khẩu mới.')
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
    <div className="w-full max-w-[1440px] min-h-screen mx-auto bg-white font-['Inter',_sans-serif] flex flex-col items-center justify-center py-10">
      <div className="flex flex-col items-center w-full max-w-[480px] px-6">
        {/* Back */}
        <div className="w-full flex items-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="flex items-center justify-center text-black cursor-pointer hover:opacity-70 transition-opacity"
            aria-label="Quay lại"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
          <span className="text-sm text-gray-500">Quay lại</span>
        </div>

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
          <KeyRound className="w-10 h-10 text-[#3783EC]" />
        </div>

        <h1 className="text-[28px] font-bold text-black text-center mb-2">Xác thực OTP</h1>
        <p className="text-[15px] text-gray-500 text-center mb-1">
          Nhập mã OTP đặt lại mật khẩu đã gửi đến
        </p>
        <p className="text-[15px] font-semibold text-[#3783EC] text-center mb-8 break-all">
          {emailFromState}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-8">
          <div className="flex gap-3" onPaste={handleOtpPaste}>
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="w-[60px] h-[70px] rounded-[16px] border border-black/20 text-center text-[24px] font-bold text-black bg-transparent focus:outline-none focus:border-[#3783EC] focus:ring-2 focus:ring-[#3783EC]/20 transition-all caret-transparent"
                aria-label={`Chữ số OTP thứ ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otpDigits.join('').length < 6}
            className="w-full h-[57px] rounded-[84px] bg-[#3783EC]/58 hover:bg-[#3783EC]/83 active:bg-[#3783EC] disabled:opacity-50 disabled:cursor-not-allowed text-black font-normal text-[18px] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang xác thực...
              </>
            ) : (
              'Xác thực OTP'
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-[14px] text-gray-500">Không nhận được mã?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || isSending}
            className="text-[14px] font-semibold text-[#3783EC] hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer"
          >
            {isSending ? 'Đang gửi...' : cooldown > 0 ? `Gửi lại sau ${cooldown}s` : 'Gửi lại mã OTP'}
          </button>
        </div>
      </div>
    </div>
  )
}
