import { Link } from 'react-router-dom'
import { Laptop, Sparkles, UserRound } from 'lucide-react'

const CATEGORIES = [
  { id: 'laptop', label: 'Laptop / PC', href: '/laptops', icon: Laptop },
  { id: 'account', label: 'Account số', href: '/accounts', icon: UserRound },
  { id: 'best-seller', label: 'Bán chạy', href: '/best-seller', icon: Sparkles },
]

export default function CategoryBar() {
  return (
    <section className="mx-auto max-w-[1840px] px-4 pb-5 sm:px-6">
      <div className="grid grid-cols-3 gap-3 rounded-[24px] bg-[#211b42] px-4 py-5 shadow-[0_14px_35px_rgba(0,0,0,0.22)]">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.id}
              to={cat.href}
              className="group flex min-h-[96px] flex-col items-center justify-center gap-3 rounded-2xl text-[#c9c2e7] transition-colors hover:bg-white/5 hover:text-white"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#332c5d] text-[#76a7ff] shadow-inner transition-transform group-hover:-translate-y-0.5">
                <Icon className="h-7 w-7" />
              </div>
              <span className="text-center text-sm font-bold">{cat.label}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
