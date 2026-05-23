import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "@/services/auth.service";

const resetPasswordSchema = z
  .object({
    verificationCode: z
      .string()
      .min(1, {
        message: "Mã xác nhận không được để trống",
      })
      .regex(/^[0-9]{4,6}$/, {
        message: "Mã xác nhận phải gồm 4 đến 6 chữ số",
      }),

    newPassword: z.string().min(6, {
      message: "Mật khẩu phải từ 6 ký tự trở lên",
    }),

    confirmPassword: z.string().min(1, {
      message: "Vui lòng xác nhận mật khẩu",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    const result = resetPasswordSchema.safeParse(values);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ResetPasswordFormValues;
        setError(path, { message: issue.message });
      });
      return;
    }

    try {
      setIsLoading(true);

      await resetPassword({
        verificationCode: values.verificationCode,
        newPassword: values.newPassword,
      });

      navigate("/login");
    } catch {
      setError("verificationCode", {
        message: "Mã xác nhận không đúng hoặc đã hết hạn",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen mx-auto bg-white font-['Inter',_sans-serif] px-4 py-10 sm:px-6">
      <div className="w-full max-w-[900px] mx-auto pt-[40px] sm:pt-[90px]">
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="flex items-center justify-center text-black cursor-pointer"
          aria-label="Quay lại"
        >
          <ChevronLeft size={24} strokeWidth={2} />
        </button>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[722px] mx-auto mt-[35px] sm:mt-[45px] flex flex-col gap-[32px] sm:gap-[47px]"
        >
          <div className="flex flex-col gap-3">
            <label className="text-[16px] sm:text-[20px] font-normal text-black">
              Nhập mã xác nhận
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Mã xác nhận"
              {...register("verificationCode")}
              className="w-full h-[64px] sm:h-[82px] rounded-[29px] bg-transparent border border-black/34 px-5 text-[16px] sm:text-[20px] text-black placeholder-[#ADA2A2] placeholder-opacity-100 focus:outline-none focus:border-[#3783EC] transition-all"
            />

            {errors.verificationCode && (
              <span className="text-red-500 text-sm">
                {errors.verificationCode.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[16px] sm:text-[20px] font-normal text-black">
              Tạo mật khẩu mới
            </label>

            <input
              type="password"
              placeholder="Mật khẩu mới"
              {...register("newPassword")}
              className="w-full h-[64px] sm:h-[82px] rounded-[29px] bg-transparent border border-black/34 px-5 text-[16px] sm:text-[20px] text-black placeholder-[#ADA2A2] placeholder-opacity-100 focus:outline-none focus:border-[#3783EC] transition-all"
            />

            {errors.newPassword && (
              <span className="text-red-500 text-sm">
                {errors.newPassword.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[16px] sm:text-[20px] font-normal text-black">
              Xác nhận mật khẩu mới
            </label>

            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              {...register("confirmPassword")}
              className="w-full h-[64px] sm:h-[82px] rounded-[29px] bg-transparent border border-black/34 px-5 text-[16px] sm:text-[20px] text-black placeholder-[#ADA2A2] placeholder-opacity-100 focus:outline-none focus:border-[#3783EC] transition-all"
            />

            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] sm:h-[57px] rounded-[84px] bg-[#3783EC]/58 hover:bg-[#3783EC]/83 active:bg-[#3783EC]/83 disabled:opacity-60 disabled:cursor-not-allowed text-black text-[16px] sm:text-[20px] font-normal transition-all cursor-pointer"
          >
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
}