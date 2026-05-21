import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const resetPasswordSchema = z.object({
  verificationCode: z
    .string()
    .min(1, {
      message: "Mã xác nhận không được để trống",
    })
    .regex(/^[0-9]{4,6}$/, {
      message: "Mã xác nhận phải gồm 4 đến 6 chữ số",
    }),

  newPassword: z
    .string()
    .min(6, {
      message: "Mật khẩu phải từ 6 ký tự trở lên",
    }),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      verificationCode: "",
      newPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    const result = resetPasswordSchema.safeParse(values);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ResetPasswordFormValues;
        setError(path, { message: issue.message });
      });
      return;
    }

    console.log("Dữ liệu tạo mật khẩu mới:", values);
    navigate("/login");
  };

  return (
    <div className="w-full max-w-[1440px] min-h-screen mx-auto bg-white font-['Inter',_sans-serif]">
      <div className="pt-[90px] pl-[75px]">
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
          className="mt-[27px] ml-[189px] flex flex-col gap-[47px]"
        >
          <div className="flex flex-col gap-3">
            <label className="text-[20px] font-normal text-black">
              Nhập mã xác nhận
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Mã xác nhận"
              {...register("verificationCode")}
              className="w-[722px] h-[82px] rounded-[29px] bg-transparent border border-black/34 px-5 text-[20px] text-black placeholder-[#ADA2A2] placeholder-opacity-100 focus:outline-none focus:border-[#3783EC] transition-all"
            />

            {errors.verificationCode && (
              <span className="text-red-500 text-sm">
                {errors.verificationCode.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[20px] font-normal text-black">
              Tạo mật khẩu mới
            </label>

            <input
              type="password"
              placeholder="Mật khẩu mới"
              {...register("newPassword")}
              className="w-[722px] h-[82px] rounded-[29px] bg-transparent border border-black/34 px-5 text-[20px] text-black placeholder-[#ADA2A2] placeholder-opacity-100 focus:outline-none focus:border-[#3783EC] transition-all"
            />

            {errors.newPassword && (
              <span className="text-red-500 text-sm">
                {errors.newPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-[704px] h-[57px] rounded-[84px] bg-[#3783EC]/58 hover:bg-[#3783EC]/83 active:bg-[#3783EC]/83 text-black text-[20px] font-normal transition-all cursor-pointer"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
}