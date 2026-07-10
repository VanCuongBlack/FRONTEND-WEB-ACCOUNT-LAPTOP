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
    desc: 'Giao nhận nhanh chóng, cấu hình mạnh, giá rõ ràng',
    href: '/laptops',
    icon: Laptop,
    iconColor: 'text-[#39bdf8]',
    bgIcon: 'bg-[#123b70]/65',
  },
  {
    id: 'account',
    label: 'Tài khoản Premium',
    desc: 'Netflix, Adobe, Spotify, Canva, v.v.',
    href: '/accounts',
    icon: Key,
    iconColor: 'text-[#b86cff]',
    bgIcon: 'bg-[#3b1d6a]/65',
  },
  {
    id: 'best-seller',
    label: 'Ưu đãi bán chạy',
    desc: 'Sản phẩm được chọn mua nhiều nhất',
    href: '/best-seller',
    icon: Sparkles,
    iconColor: 'text-[#ffd84d]',
    bgIcon: 'bg-[#664d11]/55',
  },
]

export default function CategoryBar() {
  return (
    <section className="relative z-10 w-full max-w-none px-3 pb-6 sm:px-5 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-around gap-4 border-y border-[#1e3a62]/70 bg-[#071120]/70 py-4 text-[10px] font-black tracking-widest text-[#a8b8d4]">
        {FEATURES.map((feat, idx) => {
          const Icon = feat.icon
          return (
            <div key={idx} className="flex items-center gap-2 transition-colors duration-200 hover:text-white">
              <Icon className="h-4 w-4 text-[#39bdf8]" />
              <span>{feat.label}</span>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 rounded-[24px] border border-[#1e3a62] bg-[#0a1628] p-5 shadow-[0_18px_42px_rgba(0,0,0,0.28)] md:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.id}
              to={cat.href}
              className="group flex flex-col items-center justify-center rounded-2xl border border-[#1e3a62]/80 bg-[#071120] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#2d7cff]/70 hover:bg-[#0d1d34]"
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${cat.bgIcon} ${cat.iconColor} shadow-inner transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-base font-black text-white transition-colors group-hover:text-[#74b7ff]">{cat.label}</h3>
              <p className="mt-1 max-w-[220px] text-center text-xs leading-relaxed text-[#a8b8d4]">{cat.desc}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
