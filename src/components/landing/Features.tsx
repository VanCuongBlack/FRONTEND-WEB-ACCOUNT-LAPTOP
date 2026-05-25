import { Shield, Zap, Users, Clock, Bell, BarChart3 } from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    title: 'Bảo mật đa lớp',
    desc: 'Xác thực 2 yếu tố (2FA), mã hóa dữ liệu và giám sát hoạt động đăng nhập 24/7.',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Zap,
    title: 'Giao tài khoản tự động',
    desc: 'Nhận tài khoản ngay sau khi thanh toán – hệ thống xử lý tự động, không cần chờ đợi.',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
  {
    icon: Users,
    title: 'Chia sẻ nhóm',
    desc: 'Hỗ trợ tài khoản gia đình và nhóm, phân quyền thành viên linh hoạt, dễ quản lý.',
    bg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: Clock,
    title: 'Gia hạn dễ dàng',
    desc: 'Gia hạn theo tháng hoặc năm chỉ trong vài click. Nhận thông báo trước khi hết hạn.',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    icon: Bell,
    title: 'Thông báo thời gian thực',
    desc: 'Nhận cảnh báo ngay khi tài khoản có thay đổi hoặc cần gia hạn sắp tới.',
    bg: 'bg-rose-50',
    iconColor: 'text-rose-500',
  },
  {
    icon: BarChart3,
    title: 'Lịch sử & Quản lý',
    desc: 'Theo dõi lịch sử mua hàng, quản lý tất cả tài khoản đã mua tại một nơi duy nhất.',
    bg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-16 px-4 sm:px-8 lg:px-16 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-widest mb-3">
            Tính năng
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Tại sao chọn WebACC?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
            Mua tài khoản số nhanh chóng, an toàn và tiện lợi – giao hàng tự động, bảo hành rõ ràng.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, bg, iconColor }, i) => (
            <div key={i}
              className="group p-6 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-default">
              <div className={`w-11 h-11 rounded-lg ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
