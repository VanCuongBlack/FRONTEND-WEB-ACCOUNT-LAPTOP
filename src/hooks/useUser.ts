import { useAuthStore } from '@/store/authStore'

import * as userService from '@/services/user.service'

import { toast } from 'sonner'

export const useUser = () => {
  const { user, setUser } = useAuthStore()

  const getProfile = async () => {
    try {
      const res =
        await userService.getProfile()

      if (
        res.data?.success &&
        res.data?.data
      ) {
        setUser(res.data.data)

        return res.data.data
      }

      return null

    } catch (err: any) {

      const message =
        err.response?.data?.message ||

        'Không thể tải hồ sơ'

      console.error(err)

      toast.error(message)

      return null
    }
  }

  const updateProfile = async (
    data: {
      fullname?: string

      phone?: string

      address?: string

      position?: string
    }
  ) => {
    try {
      const res =
        await userService.updateProfile(
          data
        )

      if (
        res.data?.success &&
        res.data?.data
      ) {
        setUser(res.data.data)

        toast.success(
          'Cập nhật thành công'
        )

        return res.data.data
      }

      return null

    } catch (err: any) {

      const message =
        err.response?.data?.message ||

        'Không thể cập nhật hồ sơ'

      toast.error(message)

      return null
    }
  }

  const changePassword = async (
    currentPassword: string,

    newPassword: string
  ) => {
    try {

      const res =
        await userService.changePassword({
          currentPassword,

          newPassword,
        })

      if (res.data?.success) {

        toast.success(
          'Đổi mật khẩu thành công'
        )

        return true
      }

      return false

    } catch (err: any) {

      const message =
        err.response?.data?.message ||

        'Không thể đổi mật khẩu'

      toast.error(message)

      return false
    }
  }

  return {
    user,

    getProfile,

    updateProfile,

    changePassword,
  }
}