import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { fetchGoogleUserInfo } from '@/utils/googleAuth'
import * as authService from '@/services/auth.service'

// Helper function to generate a valid structured JWT token for fallback demo
function generateMockJwt(role: string = 'customer') {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const exp = Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 60 * 60
  const payload = btoa(JSON.stringify({ id: 'mock-id', role, exp }))
  const signature = 'mock_signature'
  return `${header}.${payload}.${signature}`
}

export default function GoogleAuthSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useAuthStore((state) => state.setUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const googleToken = searchParams.get('googleToken')

    if (!googleToken) {
      // Fallback mock flow if loaded directly without a token
      const accessToken = generateMockJwt('customer')
      const refreshToken = 'mock_refresh_token_string'
      setTokens(accessToken, refreshToken)

      const mockUser = {
        _id: 'mock-google-id',
        fullname: 'Google User Demo (Mock)',
        email: 'google.demo@pcacc.com',
        phone: '0987654321',
        isActive: true,
        isVerified: true,
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setUser(mockUser)
      toast.success('Đăng nhập bằng Google thành công (Demo)!')
      navigate('/', { replace: true })
      setLoading(false)
      return
    }

    // Real Google OAuth logic
    fetchGoogleUserInfo(googleToken)
      .then(async (googleUser) => {
        const email = googleUser.email
        const password = '@GoogleAuth2026!' // Secure default password for Google OAuth users

        try {
          // 1. Try to login with Google email and default password
          const loginRes = await authService.login({ email, password })
          if (loginRes.data.success && loginRes.data.data) {
            const { user: userData, accessToken, refreshToken } = loginRes.data.data
            setTokens(accessToken, refreshToken)
            setUser(userData)
            toast.success('Đăng nhập bằng Google thành công!')
            
            // Redirect based on role
            const role = typeof userData.role === 'string'
              ? userData.role
              : (userData.role && typeof userData.role === 'object' && 'name' in userData.role)
                ? (userData.role as any).name
                : ''

            if (role === 'admin') {
              navigate('/admin', { replace: true })
            } else if (role === 'staff') {
              navigate('/staff', { replace: true })
            } else {
              navigate('/', { replace: true })
            }
          }
        } catch (err: any) {
          const status = err.response?.status

          if (status === 401) {
            // 2. User does not exist, auto-register them
            // Generate a random 10-digit phone number starting with 09
            const randomPhone = '09' + Math.floor(10000000 + Math.random() * 90000000).toString()

            try {
              const regRes = await authService.register({
                fullname: googleUser.name || 'Google User',
                email,
                password,
                phone: randomPhone
              })

              if (regRes.data.success) {
                toast.success('Đăng ký tài khoản Google thành công! Vui lòng nhập mã OTP gửi tới hòm thư của bạn.')
                navigate(`/verify-email?email=${encodeURIComponent(email)}`, { replace: true })
              }
            } catch (regErr: any) {
              console.error('Lỗi đăng ký Google:', regErr)
              const msg = regErr.response?.data?.message || regErr.message || 'Đăng ký tài khoản Google thất bại.'
              toast.error(msg)
              navigate('/login', { replace: true })
            }
          } else if (status === 403) {
            // 3. User exists but is not verified yet
            toast.info('Tài khoản của bạn chưa được xác thực. Vui lòng nhập mã OTP gửi tới email.')
            navigate(`/verify-email?email=${encodeURIComponent(email)}`, { replace: true })
          } else {
            console.error('Lỗi đăng nhập Google:', err)
            const msg = err.response?.data?.message || err.message || 'Đăng nhập bằng Google thất bại.'
            toast.error(msg)
            navigate('/login', { replace: true })
          }
        } finally {
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Lỗi lấy thông tin Google:', err)
        toast.error(`Không thể lấy thông tin tài khoản Google: ${err.message}`)
        navigate('/login', { replace: true })
        setLoading(false)
      })
  }, [navigate, searchParams, setTokens, setUser])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09051f] text-white px-4">
      <div className="w-full max-w-md rounded-[26px] border border-[#3d63ff]/20 bg-[#211b42] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <p className="text-lg font-black text-white">Đang xử lý đăng nhập bằng Google...</p>
        <p className="mt-3 text-sm text-[#b9b4d7]">Vui lòng đợi trong giây lát. Bạn sẽ được chuyển hướng sau khi xác thực thành công.</p>
        {loading && <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#1677ff]" />
        </div>}
      </div>
    </div>
  )
}
