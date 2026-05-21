import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/auth.service";

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, {
    message: "Email hoặc số điện thoại không được để trống",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu phải từ 6 ký tự trở lên",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const result = loginSchema.safeParse(values);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof LoginFormValues;
        setError(path, { message: issue.message });
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await login({
        emailOrPhone: values.emailOrPhone,
        password: values.password,
      });

      const accessToken = response.data.data?.accessToken;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      navigate("/");
    } catch {
      setError("password", {
        message: "Tài khoản hoặc mật khẩu không đúng",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1440px] min-h-screen mx-auto bg-white font-['Inter',_sans-serif] flex flex-col items-center justify-center py-10">
      <div className="flex flex-col items-center w-[722px]">
        <h1 className="text-[36px] font-bold text-black text-center tracking-wide">
          ĐĂNG NHẬP
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col mt-[75px] gap-[47px]"
        >
          <div className="w-full flex flex-col gap-[12px]">
            <label className="text-[20px] font-normal text-black pl-5">
              Email hoặc số điện thoại
            </label>

            <input
              type="text"
              placeholder="Nhập email hoặc số điện thoại..."
              {...register("emailOrPhone")}
              className="w-[722px] h-[82px] rounded-[29px] bg-transparent border border-black/34 px-[20px] text-[20px] text-black placeholder-[#ADA2A2] placeholder-opacity-100 focus:outline-none focus:border-[#3783EC] transition-all"
            />

            {errors.emailOrPhone && (
              <span className="text-red-500 text-sm pl-5 mt-1">
                {errors.emailOrPhone.message}
              </span>
            )}
          </div>

          <div className="w-full flex flex-col gap-[12px]">
            <label className="text-[20px] font-normal text-black pl-5">
              Mật khẩu
            </label>

            <div className="relative w-[722px] h-[82px] flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu..."
                {...register("password")}
                className="w-full h-full rounded-[29px] bg-transparent border border-black/34 pl-[20px] pr-[60px] text-[20px] text-black placeholder-[#ADA2A2] placeholder-opacity-100 focus:outline-none focus:border-[#3783EC] transition-all"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[24px] text-black/40 hover:text-black/70 transition-colors cursor-pointer p-1 flex items-center justify-center"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
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

            {errors.password && (
              <span className="text-red-500 text-sm pl-5 mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="w-full flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-[704px] h-[57px] rounded-[84px] bg-[#3783EC]/58 hover:bg-[#3783EC]/83 active:bg-[#3783EC] disabled:opacity-60 disabled:cursor-not-allowed text-black font-normal text-[20px] transition-all duration-200 shadow-sm flex items-center justify-center cursor-pointer"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>

          <div className="w-full flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-[20px] font-normal text-black hover:underline cursor-pointer"
            >
              Quên mật khẩu?
            </button>
          </div>

          <div className="w-full flex flex-col items-center gap-4">
            <p className="text-[20px] font-normal text-black/60">
              Hoặc đăng nhập bằng
            </p>

            <div className="flex gap-6 justify-center items-center">
              <button
                type="button"
                className="w-[60px] h-[60px] rounded-full border border-black/20 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm cursor-pointer"
                title="Đăng nhập bằng Google"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 12-4.53z"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="w-[60px] h-[60px] rounded-full border border-black/20 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm cursor-pointer"
                title="Đăng nhập bằng Facebook"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#1877F2"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-[704px] h-[57px] rounded-[84px] bg-transparent border border-black/34 hover:bg-gray-50 text-black font-normal text-[20px] transition-all duration-200 shadow-sm flex items-center justify-center cursor-pointer"
            >
              Đăng ký tài khoản mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}