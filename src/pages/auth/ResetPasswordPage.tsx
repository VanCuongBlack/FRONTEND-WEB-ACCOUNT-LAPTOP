import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "@/services/auth.service";

const resetPasswordSchema = z
  .object({
    otp: z
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
  const location = useLocation();

  const email = location.state?.email || "";

  const [isLoading, setIsLoading] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      otp: "",
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
        email,
        otp: values.otp,
        newPassword: values.newPassword,
      });

      navigate("/login");
    } catch {
      setError("otp", {
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
              {...register("otp")}
              className="w-full h-[64px] sm:h-[82px] rounded-[29px] bg-transparent border border-black/34 px-5 text-[16px] sm:text-[20px] text-black placeholder-[#ADA2A2] placeholder-opacity-100 focus:outline-none focus:border-[#3783EC] transition-all"
            />

            {errors.otp && (
              <span className="text-red-500 text-sm">
                {errors.otp.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[16px] sm:text-[20px] font-normal text-black">
              Tạo mật khẩu mới
            </label>

            <div className="relative w-full h-[64px] sm:h-[82px] flex items-center">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Mật khẩu mới"
                {...register("newPassword")}
                className="w-full h-full rounded-[29px] bg-transparent border border-black/34 pl-5 pr-[60px] text-[16px] sm:text-[20px] text-black placeholder-[#ADA2A2] placeholder-opacity-100 focus:outline-none focus:border-[#3783EC] transition-all"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-[24px] text-black/40 hover:text-black/70 transition-colors cursor-pointer p-1 flex items-center justify-center"
              >
                {showNewPassword ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.024 10.024 0 014.501-5.176M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 12m0 0L9.172 7.757M13.414 12H12m4.542-3.458A10.05 10.05 0 0121.542 12c-1.274 4.057-5.064 7-9.542 7a9.963 9.963 0 01-1.205-.073M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>

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

            <div className="relative w-full h-[64px] sm:h-[82px] flex items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                {...register("confirmPassword")}
                className="w-full h-full rounded-[29px] bg-transparent border border-black/34 pl-5 pr-[60px] text-[16px] sm:text-[20px] text-black placeholder-[#ADA2A2] placeholder-opacity-100 focus:outline-none focus:border-[#3783EC] transition-all"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-[24px] text-black/40 hover:text-black/70 transition-colors cursor-pointer p-1 flex items-center justify-center"
              >
                {showConfirmPassword ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.024 10.024 0 014.501-5.176M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 12m0 0L9.172 7.757M13.414 12H12m4.542-3.458A10.05 10.05 0 0121.542 12c-1.274 4.057-5.064 7-9.542 7a9.963 9.963 0 01-1.205-.073M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>

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