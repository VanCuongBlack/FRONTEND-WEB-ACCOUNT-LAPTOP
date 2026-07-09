import { Link } from 'react-router-dom'
import { Laptop, Sparkles, Key, ShieldCheck, Headphones, Truck, CreditCard } from 'lucide-react'

const FEATURES = [
  { label: 'UY TÍN 5 SAO, GIAO TIN CẬY', icon: ShieldCheck },
  { label: 'HỖ TRỢ 24/7 NHIỆT TÌNH', icon: Headphones },
  { label: 'GIAO HÀNG SIÊU TỐC TOÀN QUỐC', icon: Truck },
  { label: 'THANH TOÁN BẢO MẬT', icon: CreditCard },
]

const CATEGORIES = [
  {
    id: 'laptop',
    label: 'Laptop & Máy tính',
    desc: 'Giao nhận nhanh chóng, cấu hình mạnh, rẻ',
    href: '/laptops',
    icon: Laptop,
    iconColor: 'text-[#00c6ff]',
    bgIcon: 'bg-[#00c6ff]/10',
  },
  {
    id: 'account',
    label: 'Tài khoản Premium',
    desc: 'Netflix, Adobe, Spotify, Canva, v.v.',
    href: '/accounts',
    icon: Key,
    iconColor: 'text-[#d946ef]',
    bgIcon: 'bg-[#d946ef]/10',
  },
  {
    id: 'best-seller',
    label: 'Ưu đãi bán chạy',
    desc: 'Sản phẩm được săn đón nhiều nhất',
    href: '/best-seller',
    icon: Sparkles,
    iconColor: 'text-[#ffd54a]',
    bgIcon: 'bg-[#ffd54a]/10',
  },
]

export default function CategoryBar() {
  return (
    <section className="mx-auto max-w-[1840px] px-4 pb-6 sm:px-6 relative z-10">
      {/* Trust Features Row */}
      <div className="flex flex-wrap items-center justify-around gap-4 py-4 mb-6 border-b border-white/5 text-[10px] font-black tracking-widest text-white/60">
        {FEATURES.map((feat, idx) => {
          const Icon = feat.icon
          return (
            <div key={idx} className="flex items-center gap-2 hover:text-white transition-colors duration-200">
              <Icon className="h-4 w-4 text-[#00d6ff]" />
              <span>{feat.label}</span>
            </div>
          )
        })}
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 rounded-[26px] bg-gradient-to-b from-[#1c1739] to-[#120d2b] border border-white/5 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.id}
              to={cat.href}
              className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 transition-all duration-300 hover:bg-white/10 hover:border-white/10 hover:scale-[1.02]"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.bgIcon} ${cat.iconColor} shadow-inner mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-white font-black text-base group-hover:text-[#00d6ff] transition-colors">{cat.label}</h3>
              <p className="text-center text-xs text-white/50 mt-1 max-w-[200px] leading-relaxed">{cat.desc}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
