import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const forgotPasswordSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, {
      message: "Email hoặc số điện thoại không được để trống",
    })
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;

        return emailRegex.test(value) || phoneRegex.test(value);
      },
      {
        message: "Email hoặc số điện thoại không hợp lệ",
      }
    ),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      emailOrPhone: "",
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    const result = forgotPasswordSchema.safeParse(values);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ForgotPasswordFormValues;
        setError(path, { message: issue.message });
      });
      return;
    }

    console.log("Dữ liệu quên mật khẩu:", values);
    navigate("/reset-password");
  };

  return (
    <div className="w-full max-w-[1440px] min-h-screen mx-auto bg-white font-['Inter',_sans-serif]">
      <div className="pt-[90px] pl-[35px]">
        <div className="flex items-center gap-[40px]">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center justify-center text-black cursor-pointer"
            aria-label="Quay lại"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>

          <h1 className="text-[36px] font-bold text-black">
            Đặt lại mật khẩu
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-[75px] ml-[243px] flex flex-col gap-[47px]"
        >
          <div className="flex flex-col gap-3">
            <label className="text-[20px] font-normal text-black">
              Email hoặc số điện thoại
            </label>

            <input
              type="text"
              placeholder="Email hoặc số điện thoại"
              {...register("emailOrPhone")}
              className="w-[722px] h-[82px] rounded-[29px] bg-transparent border border-black/34 px-5 text-[20px] text-black placeholder-[#ADA2A2] placeholder-opacity-100 focus:outline-none focus:border-[#3783EC] transition-all"
            />

            {errors.emailOrPhone && (
              <span className="text-red-500 text-sm">
                {errors.emailOrPhone.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-[704px] h-[57px] rounded-[84px] bg-[#3783EC]/58 hover:bg-[#3783EC]/83 active:bg-[#3783EC]/83 text-black text-[20px] font-normal transition-all cursor-pointer"
          >
            Tiếp tục
          </button>
        </form>
      </div>
    </div>
  );
}