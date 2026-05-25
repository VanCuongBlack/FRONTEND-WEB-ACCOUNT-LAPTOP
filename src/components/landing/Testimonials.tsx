// Testimonials / Stats section
const STATS = [
  { value: '50K+', label: 'Khách hàng' },
  { value: '99.9%', label: 'Uptime' },
  { value: '5 phút', label: 'Giao hàng tự động' },
  { value: '4.9 ⭐', label: 'Đánh giá' },
]

const TESTIMONIALS = [
  {
    name: 'Nguyễn Minh Tuấn',
    role: 'Nhân viên văn phòng',
    avatar: 'N',
    avatarColor: 'bg-blue-500',
    text: 'Mua Netflix 4K gia đình, nhận tài khoản ngay tức thì sau khi thanh toán. Dùng được 3 tháng rồi, không có vấn đề gì cả!',
  },
  {
    name: 'Trần Thị Lan',
    role: 'Sinh viên HUST',
    avatar: 'T',
    avatarColor: 'bg-green-500',
    text: 'Mua Office 365 cho học tập, giá rẻ hơn nhiều so với mua chính hãng. Bảo hành 1 năm, hỗ trợ rất nhanh.',
  },
  {
    name: 'Lê Hoàng Nam',
    role: 'Designer tự do',
    avatar: 'L',
    avatarColor: 'bg-indigo-500',
    text: 'Dùng WebACC mua Spotify và Canva Pro. Tiết kiệm được rất nhiều tiền mà chất lượng vẫn ổn định hoàn toàn.',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center p-5 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-3xl font-black text-[#1565c0] mb-1">{value}</div>
              <div className="text-xs text-gray-500 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded bg-amber-50 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-3">
            💬 Đánh giá
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Khách hàng nói gì về chúng tôi
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map(({ name, role, avatar, avatarColor, text }) => (
            <div key={name} className="p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300 bg-white">
              <p className="text-sm text-gray-600 leading-relaxed mb-6">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{name}</div>
                  <div className="text-xs text-gray-400">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
