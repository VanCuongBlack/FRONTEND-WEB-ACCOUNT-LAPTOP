import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2, ShieldCheck, Sparkles, Zap } from 'lucide-react'

export default function GoogleAuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login'
  const isRegisterMode = mode === 'register'

  const redirectToGoogle = () => {
    setIsRedirecting(true)
    // Use dynamic API base URL (VITE_API_URL or relative path fallback)
    const apiBase = import.meta.env.VITE_API_URL || '/api/v1'
    
    let googleUrl = apiBase.startsWith('http')
      ? `${apiBase}/auth/google`
      : `${window.location.origin}${apiBase}/auth/google`
      
    // Append the mode (login/register) so the backend knows the authentication purpose
    googleUrl += `?mode=${mode}`
    
    window.location.href = googleUrl
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      redirectToGoogle()
    }, 600)

    return () => window.clearTimeout(timer)
  }, [mode])

  return (
    <div className="min-h-screen bg-[#09051f] text-white">
      <header className="mx-auto flex h-20 w-full max-w-[1840px] items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-baseline gap-1">
          <span className="text-3xl font-black">PCAcc</span>
          <span className="text-sm font-black">.com</span>
        </Link>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1200px] items-center justify-center px-4 pb-10 sm:px-6">
        <div className="w-full max-w-2xl rounded-[30px] border border-[#3d63ff]/20 bg-[#211b42] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-10">
          <button
            type="button"
            onClick={() => navigate(isRegisterMode ? '/register' : '/login')}
            className="flex items-center gap-2 text-sm font-black text-[#79a7ff] transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại {isRegisterMode ? 'đăng ký' : 'đăng nhập'}
          </button>

          <div className="mt-8 text-center">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#79a7ff]">
              {isRegisterMode ? 'Đăng ký bằng Google' : 'Đăng nhập bằng Google'}
            </p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              {isRegisterMode ? 'Tiếp tục tạo tài khoản với Google' : 'Tiếp tục truy cập với Google'}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#b9b4d7] sm:text-base">
              {isRegisterMode
                ? 'Bạn sẽ được chuyển sang Google để xác thực và hoàn tất quá trình đăng ký tài khoản.'
                : 'Bạn sẽ được chuyển sang Google để xác thực và tiếp tục đăng nhập vào tài khoản của mình.'}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[ [ShieldCheck, 'Bảo mật cao'], [Zap, 'Tiện lợi'], [Sparkles, 'Tự động đồng bộ'] ].map(([Icon, label]) => (
              <div key={label as string} className="rounded-[22px] bg-[#171233] p-4 text-center">
                <Icon className="mx-auto h-6 w-6 text-[#79a7ff]" />
                <p className="mt-2 text-sm font-black text-white">{label as string}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={redirectToGoogle}
            disabled={isRedirecting}
            className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1677ff] text-sm font-black text-white transition-colors hover:bg-[#0f66df] disabled:cursor-not-allowed disabled:bg-[#625b84]"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang chuyển hướng...
              </>
            ) : (
              'Tiếp tục với Google'
            )}
          </button>
        </div>
      </main>
    </div>
  )
}
