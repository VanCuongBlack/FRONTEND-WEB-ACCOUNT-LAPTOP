import { Bell, Info } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NotificationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#09051f] font-sans text-white">
      <Header pageLabel="Thông báo" cartCount={0} />

      <main className="mx-auto w-full max-w-[1840px] flex-1 px-4 py-6">
        <section className="rounded-[22px] border border-[#3d63ff]/20 bg-[#211b42] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
          <div className="mb-6">
            <h1 className="flex items-center gap-3 text-[28px] font-black">
              <Bell className="text-[#79a7ff]" size={28} />
              Thông báo
            </h1>
            <p className="mt-2 text-sm text-[#b9b4d7]">
              Backend hiện chưa có API thông báo, nên FE không hiển thị dữ liệu
              mẫu.
            </p>
          </div>

          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#3d63ff]/30 bg-[#171233] p-8 text-center">
            <Info className="h-10 w-10 text-[#79a7ff]" />
            <h2 className="mt-4 text-lg font-black text-white">
              Chưa có thông báo từ backend
            </h2>
            <p className="mt-2 max-w-[560px] text-sm leading-6 text-[#b9b4d7]">
              Khi backend bổ sung route notification, màn này có thể kết nối
              trực tiếp để hiển thị thông báo đơn hàng, bảo hành, khuyến mãi và
              hệ thống theo tài khoản đăng nhập.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
