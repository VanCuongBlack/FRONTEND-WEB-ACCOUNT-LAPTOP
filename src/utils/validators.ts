import { z } from 'zod'

const passwordRule = z
  .string()
  .min(8, 'Mật khẩu ít nhất 8 ký tự.')
  .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ HOA.')
  .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường.')
  .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 chữ số.')
  .regex(/[^A-Za-z0-9]/, 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.')

export const registerSchema = z
  .object({
    fullName: z.string().min(3, 'Họ tên phải có ít nhất 3 ký tự.'),
    email: z.string().min(1, 'Email không được để trống.').email('Email không hợp lệ.'),
    phone: z
      .string()
      .min(1, 'Số điện thoại không được để trống.')
      .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'SĐT không hợp lệ (VD: 0912345678).'),
    password: passwordRule,
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống.').email('Email không hợp lệ.'),
  password: z.string().min(1, 'Mật khẩu không được để trống.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const verifyEmailSchema = z.object({
  email: z.string().email('Email không hợp lệ.').optional(),
  otp: z
    .string()
    .min(1, 'Mã OTP không được để trống.')
    .regex(/^[0-9]{4,6}$/, 'Mã OTP phải gồm 4 đến 6 chữ số.'),
})

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email không được để trống.').email('Email không hợp lệ.'),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    email: z.string().email('Email không hợp lệ.').optional(),
    otp: z
      .string()
      .min(1, 'Mã OTP không được để trống.')
      .regex(/^[0-9]{4,6}$/, 'Mã OTP phải gồm 4 đến 6 chữ số.'),
    newPassword: passwordRule,
    confirmNewPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới.'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmNewPassword'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>