import { Link } from 'react-router-dom'
import { ArrowUpRight, Bot, Laptop, Truck, ShoppingCart } from 'lucide-react'
import type { Product } from '@/services/landing.service'
import { useCart } from '@/hooks/useCart'

type Accent = 'hot' | 'account' | 'laptop'

interface Props {
  products: Product[]
  loading?: boolean
  title?: string
  viewMoreUrl?: string
  accent?: Accent
  showEyebrow?: boolean
  headerRight?: React.ReactNode
}

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const Icon = product.category === 'laptop' ? Laptop : Bot
  const detailUrl = product.category === 'laptop' ? `/laptops/${product.id}` : `/accounts/${product.id}`
  const productType = product.product_type || (product.category === 'laptop' ? 'physical' : 'digital')

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await addToCart(product.id, productType as 'physical' | 'digital')
  }

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link
      to={detailUrl}
      className="group flex flex-col justify-between overflow-hidden rounded-[24px] bg-gradient-to-b from-[#251f47] to-[#1c1739] border border-white/5 text-white transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-blue-500/5 min-h-[380px]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#15112e] flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Icon className="h-16 w-16 text-[#76a7ff] opacity-60" />
        )}
        
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.badge && (
            <span className="rounded-lg bg-blue-600 px-2 py-0.5 text-[10px] font-black text-white shadow-sm uppercase tracking-wide">
              {product.badge}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#76a7ff]">
            {product.category === 'laptop' ? 'PC / Laptop' : 'Tài khoản số'}
          </span>
          <h3 className="mt-1 line-clamp-2 text-base font-black leading-snug text-white group-hover:text-blue-300 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-[#ffd54a]">
              {fmt(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-white/40 line-through">
                {fmt(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-white/50 border-t border-white/5 pt-3">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
              <Truck className="h-3.5 w-3.5" />
              Sẵn hàng
            </span>
            {product.sold !== undefined && (
              <span>Đã bán {product.sold}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-blue-500/20"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[24px] bg-gradient-to-b from-[#251f47] to-[#1c1739] border border-white/5 min-h-[380px]">
      <div className="aspect-[16/10] w-full animate-pulse bg-[#15112e]" />
      <div className="space-y-4 p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-3 w-1/4 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
        </div>
        <div className="h-9 w-full animate-pulse rounded-xl bg-white/10" />
      </div>
    </div>
  )
}

export default function FeaturedProducts({
  products,
  loading = false,
  title = 'Sản phẩm bán chạy',
  viewMoreUrl = '/best-seller',
  accent = 'hot',
  showEyebrow = true,
  headerRight,
}: Props) {
  const active = products.filter((product) => product.isActive)

  return (
    <section id="products" className="w-full px-4 pb-7 sm:px-6 relative z-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {showEyebrow && (
            <p className="text-sm font-black uppercase text-[#76a7ff]">
              {accent === 'account' ? 'Account số' : accent === 'laptop' ? 'PC / Laptop' : 'Hot deal'}
            </p>
          )}
          <h2 className={`${showEyebrow ? 'mt-1' : ''} text-2xl font-black text-white`}>{title}</h2>
        </div>
        {headerRight ? headerRight : (
          <Link
            to={viewMoreUrl}
            className="inline-flex items-center gap-1 text-white/50 hover:text-white font-black text-xs transition-colors duration-200"
          >
            Xem tất cả
            <ArrowUpRight className="h-3.5 w-3.5 text-[#00d6ff]" />
          </Link>
        )}
      </div>

      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
        ) : active.length > 0 ? (
          active.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center min-h-[220px] w-full rounded-[26px] bg-gradient-to-b from-[#1c1739] to-[#120d2b] border border-white/5 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white/40 mb-4">
              <Bot className="h-7 w-7 animate-pulse text-[#00d6ff]" />
            </div>
            <p className="text-sm font-bold text-white/50 mb-2">Đang cập nhật danh mục sản phẩm hot nhất...</p>
            <a href="#support" className="text-xs font-bold text-[#00d6ff] hover:underline flex items-center gap-1">
              Liên hệ hỗ trợ ngay &rarr;
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
