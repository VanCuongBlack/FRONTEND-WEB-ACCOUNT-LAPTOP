import { Link } from 'react-router-dom'
import { ShieldCheck, Sparkles, Zap } from 'lucide-react'
import RegisterForm from '@/components/account/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#09051f] text-white">
      <header className="mx-auto flex h-20 w-full max-w-[1840px] items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-baseline gap-1">
          <span className="text-3xl font-black">PCAcc</span>
          <span className="text-sm font-black">.com</span>
        </Link>
        <Link to="/login" className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-black text-[#d9d4f2] hover:bg-white/15">
          Đăng nhập
        </Link>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-[1840px] grid-cols-1 items-center gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-[1fr_560px]">
        <section className="hidden max-w-3xl lg:block">
          <p className="text-sm font-black uppercase text-[#79a7ff]">Tài khoản PCAcc</p>
          <h1 className="mt-4 text-5xl font-black leading-tight">
            Tạo tài khoản để mua PC, laptop và account số nhanh hơn.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b4d7]">
            Quản lý đơn hàng, bảo hành, hỗ trợ và lịch sử mua hàng trong cùng một hồ sơ.
          </p>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-4">
            {[
              [ShieldCheck, 'Bảo hành rõ ràng'],
              [Zap, 'Thanh toán nhanh'],
              [Sparkles, 'Ưu đãi riêng'],
            ].map(([Icon, label]) => (
              <div key={label as string} className="rounded-[22px] bg-[#211b42] p-5">
                <Icon className="h-7 w-7 text-[#79a7ff]" />
                <p className="mt-3 text-sm font-black text-white">{label as string}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full rounded-[26px] border border-[#3d63ff]/20 bg-[#211b42] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <RegisterForm />
        </section>
      </main>
    </div>
  )
}
