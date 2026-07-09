import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { googleLogin } from '@/services/auth.service'

export default function GoogleAuthSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const idToken = searchParams.get('idToken')

    if (!idToken) {
      toast.error('Phiên đăng nhập Google không hợp lệ. Vui lòng thử lại.')
      navigate('/login', { replace: true })
      setLoading(false)
      return
    }

    googleLogin(idToken)
      .then((response) => {
        const data = response.data.data
        if (!response.data.success || !data) {
          toast.error(response.data.message || 'Đăng nhập Google thất bại.')
          navigate('/login', { replace: true })
          return
        }

        const role =
          typeof data.user.role === 'string'
            ? data.user.role
            : data.user.role && typeof data.user.role === 'object' && 'name' in data.user.role
              ? data.user.role.name || 'customer'
              : 'customer'

        setAuth({ ...data.user, role }, data.accessToken, data.refreshToken)
        toast.success('Đăng nhập bằng Google thành công!')

        if (role === 'admin') {
          navigate('/admin', { replace: true })
        } else if (role === 'staff') {
          navigate('/staff', { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      })
      .catch((err: any) => {
        toast.error(err?.response?.data?.message || err?.message || 'Đăng nhập Google thất bại.')
        navigate('/login', { replace: true })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [navigate, searchParams, setAuth])

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
