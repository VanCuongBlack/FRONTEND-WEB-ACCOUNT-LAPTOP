import { Link } from 'react-router-dom'
import { ArrowUpRight, Bot, Laptop, Star, Truck } from 'lucide-react'
import type { Product } from '@/services/landing.service'

type Accent = 'hot' | 'account' | 'laptop'

interface Props {
  products: Product[]
  loading?: boolean
  title?: string
  viewMoreUrl?: string
  accent?: Accent
  showEyebrow?: boolean
}

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

function priceRange(product: Product) {
  if (product.originalPrice && product.originalPrice > product.price) {
    return `${fmt(product.price)} ~ ${fmt(product.originalPrice)}`
  }
  return fmt(product.price)
}

function ProductCard({ product }: { product: Product }) {
  const Icon = product.category === 'laptop' ? Laptop : Bot
  const detailUrl = product.category === 'laptop' ? `/laptops/${product.id}` : `/accounts/${product.id}`

  return (
    <Link
      to={detailUrl}
      className="group grid min-h-[198px] grid-cols-[34%_1fr] overflow-hidden rounded-[22px] bg-[#29244f] text-white transition-all hover:ring-1 hover:ring-[#4d78ff]"
    >
      <div className="relative overflow-hidden bg-[#1d183b]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full min-h-[198px] items-center justify-center">
            <Icon className="h-14 w-14 text-[#76a7ff]" />
          </div>
        )}
        {product.badge && (
          <span className="absolute left-2 top-2 rounded-lg bg-red-500 px-2 py-1 text-[10px] font-black uppercase text-white">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-center p-5">
        <h3 className="line-clamp-2 text-lg font-black leading-snug text-white">
          {product.name}
        </h3>
        <p className="mt-3 text-lg font-black text-[#ffd54a]">
          {priceRange(product)}
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#63a7ff]">
          <Truck className="h-4 w-4" />
          Order
        </p>
        <div className="mt-4 flex gap-1 text-[#ffd54a]">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className="h-5 w-5 fill-current" />
          ))}
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="grid min-h-[198px] grid-cols-[34%_1fr] overflow-hidden rounded-[22px] bg-[#29244f]">
      <div className="animate-pulse bg-[#1d183b]" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-4/5 animate-pulse rounded bg-white/10" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
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
}: Props) {
  const active = products.filter((product) => product.isActive)

  return (
    <section id="products" className="w-full px-4 pb-7 sm:px-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          {showEyebrow && (
            <p className="text-sm font-black uppercase text-[#76a7ff]">
              {accent === 'account' ? 'Account số' : accent === 'laptop' ? 'PC / Laptop' : 'Hot deal'}
            </p>
          )}
          <h2 className={`${showEyebrow ? 'mt-1' : ''} text-2xl font-black text-white`}>{title}</h2>
        </div>
        <Link
          to={viewMoreUrl}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-[20px] bg-[#44405f] px-5 text-sm font-black text-white hover:bg-[#565176]"
        >
          Xem tất cả
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
        ) : active.length > 0 ? (
          active.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="col-span-full flex min-h-[150px] w-full items-center justify-center rounded-[22px] bg-[#211b42] px-6 py-12 text-center text-sm font-bold text-[#b9b4d7]">
            Chưa có sản phẩm nào.
          </div>
        )}
      </div>
    </section>
  )
}
