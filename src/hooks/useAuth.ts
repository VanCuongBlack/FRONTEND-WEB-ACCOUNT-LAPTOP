import { useCallback } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/store/authStore'
import * as authService from '@/services/auth.service'

function getRoleFromToken(token?: string | null) {
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? ''))
    return typeof payload.role === 'string' ? payload.role : null
  } catch {
    return null
  }
}

function normalizeRole(role: unknown, token?: string | null) {
  if (typeof role === 'string' && ['customer', 'staff', 'admin'].includes(role)) {
    return role
  }

  if (role && typeof role === 'object' && 'name' in role) {
    const roleName = (role as { name?: unknown }).name
    if (typeof roleName === 'string') return roleName
  }

  return getRoleFromToken(token) ?? role
}

export const useAuth = () => {
  const {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    setAuth,
    setLoading,
    setError,
    logout: storeLogout,
  } = useAuthStore()

  const register = useCallback(
    async (data: {
      fullname: string
      email: string
      phone: string
      password: string
    }) => {
      try {
        setLoading(true)
        setError(null)

        const response = await authService.register({
          fullname: data.fullname,
          email: data.email,
          phone: data.phone,
          password: data.password,
        })

        if (response.data.success) {
          toast.success('Đăng ký thành công! Vui lòng xác thực email.')
          return {
            success: true,
            data: response.data.data,
          }
        }

        return {
          success: false,
          error: response.data.message || 'Đăng ký thất bại',
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Đăng ký thất bại'
        setError(message)
        toast.error(message)
        return {
          success: false,
          error: message,
        }
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError]
  )

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true)
        setError(null)

        const response = await authService.login({
          email,
          password,
        })

        if (response.data.success && response.data.data) {
          const {
            user: userData,
            accessToken: token,
            refreshToken: refresh,
          } = response.data.data

          const normalizedUser = {
            ...userData,
            role: normalizeRole(userData.role, token),
          } as typeof userData

          setAuth(normalizedUser, token, refresh)

          toast.success('Đăng nhập thành công!')

          return {
            success: true,
            user: normalizedUser,
            accessToken: token,
            refreshToken: refresh,
          }
        }

        return {
          success: false,
          error: response.data.message || 'Đăng nhập thất bại',
        }
      } catch (err: any) {
        const message = err.response?.data?.message || 'Đăng nhập thất bại'
        setError(message)
        toast.error(message)
        return {
          success: false,
          error: message,
        }
      } finally {
        setLoading(false)
      }
    },
    [setAuth, setLoading, setError]
  )

  const logout = useCallback(() => {
    storeLogout()
    toast.success('Đã đăng xuất')
  }, [storeLogout])

  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        setLoading(true)
        setError(null)

        const response = await authService.forgotPassword({
          email,
        })

        if (response.data.success) {
          toast.success('OTP đã được gửi đến email của bạn')
          return {
            success: true,
          }
        }

        return {
          success: false,
          error: response.data.message || 'Yêu cầu thất bại',
        }
      } catch (err: any) {
        const message = err.response?.data?.message || 'Yêu cầu thất bại'
        setError(message)
        toast.error(message)
        return {
          success: false,
          error: message,
        }
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError]
  )

  const verifyResetOtp = useCallback(
    async (email: string, otp: string) => {
      try {
        setLoading(true)
        setError(null)

        const response = await authService.verifyResetOtp({
          email,
          otp,
        })

        if (response.data.success) {
          toast.success('OTP hợp lệ')
          return {
            success: true,
          }
        }

        return {
          success: false,
          error: response.data.message || 'OTP không hợp lệ',
        }
      } catch (err: any) {
        const message = err.response?.data?.message || 'OTP không hợp lệ'
        setError(message)
        toast.error(message)
        return {
          success: false,
          error: message,
        }
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError]
  )

  const resetPassword = useCallback(
    async (email: string, otp: string, newPassword: string) => {
      try {
        setLoading(true)
        setError(null)

        const response = await authService.resetPassword({
          email,
          otp,
          newPassword,
        })

        if (response.data.success) {
          toast.success('Đặt lại mật khẩu thành công!')
          return {
            success: true,
          }
        }

        return {
          success: false,
          error: response.data.message || 'Đặt lại mật khẩu thất bại',
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message || 'Đặt lại mật khẩu thất bại'
        setError(message)
        toast.error(message)
        return {
          success: false,
          error: message,
        }
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError]
  )

  const verifyEmail = useCallback(
    async (email: string, otp: string) => {
      try {
        setLoading(true)
        setError(null)

        const response = await authService.verifyEmail({
          email,
          otp,
        })

        if (response.data.success) {
          toast.success('Email đã được xác thực!')
          return {
            success: true,
          }
        }

        return {
          success: false,
          error: response.data.message || 'Xác thực email thất bại',
        }
      } catch (err: any) {
        const message = err.response?.data?.message || 'Xác thực email thất bại'
        setError(message)
        toast.error(message)
        return {
          success: false,
          error: message,
        }
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError]
  )

  const isAuthenticated = Boolean(
    user && accessToken
  )

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    isAuthenticated,

    register,
    login,
    logout,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
    verifyEmail,
  }
}
