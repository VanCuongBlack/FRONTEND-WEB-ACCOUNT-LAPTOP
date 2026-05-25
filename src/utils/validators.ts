import { z } from 'zod'

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự.'),
    email: z.string().min(1, 'Email không được để trống.').email('Email không hợp lệ.'),
    phone: z
      .string()
      .min(1, 'Số điện thoại không được để trống.')
      .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'SĐT không hợp lệ (VD: 0912345678).'),
    password: z
      .string()
      .min(8, 'Mật khẩu ít nhất 8 ký tự.')
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa.')
      .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường.')
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số.')
      .regex(/[^A-Za-z0-9]/, 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt.'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>