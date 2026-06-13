import { Link } from 'react-router-dom'
import type { Product } from '@/services/landing.service'

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

function stockLabel(stock?: number): string {
  if (stock === undefined || stock === null) return 'Sẵn hàng'
  if (stock === 0) return 'Hết hàng'
  if (stock <= 5) return `Còn ${stock} sản phẩm`
  return `${stock} sản phẩm`
}

function stockColor(stock?: number): string {
  if (stock === 0) return 'text-red-500'
  if (stock !== undefined && stock <= 5) return 'text-orange-500'
  return 'text-gray-400'
}

const BADGE_STYLE: Record<string, string> = {
  HOT:  'bg-red-500 text-white',
  NEW:  'bg-blue-500 text-white',
  SALE: 'bg-orange-500 text-white',
  OUT:  'bg-gray-400 text-white',
}

// ─── ProductCard ───────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock === 0
  const detailUrl = product.category === 'laptop' ? `/laptops/${product.id}` : `/accounts/${product.id}`

  return (
    <Link
      to={detailUrl}
      className="relative bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer group"
    >

      {/* Badge */}
      {product.badge && (
        <span className={`absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase ${BADGE_STYLE[product.badge] ?? ''}`}>
          {product.badge}
        </span>
      )}

      {/* Image */}
      <div className="h-32 sm:h-36 lg:h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-4xl sm:text-5xl lg:text-6xl select-none group-hover:scale-110 transition-transform duration-300">
            {product.icon ?? '📦'}
          </span>
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-1">
        <h3 className="text-xs sm:text-sm font-medium text-gray-800 leading-snug line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <p className={`text-[10px] sm:text-xs mb-1.5 ${stockColor(product.stock)}`}>
          Kho: <span className="font-medium">{stockLabel(product.stock)}</span>
        </p>

        <div className="flex items-baseline gap-1 mt-auto mb-2 flex-wrap">
          <span className="text-sm sm:text-base font-bold text-blue-600">
            {fmt(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
              {fmt(product.originalPrice)}
            </span>
          )}
        </div>

        <div
          className={`w-full py-1.5 sm:py-2 rounded-lg border text-[11px] sm:text-xs font-medium transition-all duration-150 active:scale-95 text-center
            ${outOfStock
              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-blue-100 bg-blue-50 hover:bg-blue-100 text-blue-600'
            }`}
        >
          {outOfStock ? 'Hết hàng' : 'Mua ngay'}
        </div>
      </div>
    </Link>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden animate-pulse">
      <div className="h-32 sm:h-36 lg:h-40 bg-gray-100" />
      <div className="p-2.5 sm:p-3 flex flex-col gap-2">
        <div className="h-3 sm:h-4 bg-gray-100 rounded w-full" />
        <div className="h-2.5 sm:h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-4 sm:h-5 bg-gray-100 rounded w-2/3 mt-1" />
        <div className="h-7 sm:h-8 bg-gray-100 rounded mt-1" />
      </div>
    </div>
  )
}

// ─── FeaturedProducts ─────────────────────────────────────────────────────────

interface Props {
  products: Product[]
  loading?: boolean
  title?: string
  viewMoreUrl?: string
}

export default function FeaturedProducts({
  products,
  loading = false,
  title = 'Sản phẩm bán chạy',
  viewMoreUrl = '/best-seller'
}: Props) {
  const active = products.filter(p => p.isActive)

  return (
    <section id="products" className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-4 sm:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        {viewMoreUrl ? (
          <Link to={viewMoreUrl} className="flex items-center gap-2 group cursor-pointer">
            <div className="w-1 h-5 bg-blue-600 rounded-full group-hover:bg-blue-700 transition-colors" />
            <h2 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h2>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-600 rounded-full" />
            <h2 className="text-sm font-bold text-gray-900">{title}</h2>
          </div>
        )}
        {viewMoreUrl && (
          <Link to={viewMoreUrl} className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:underline">
            Xem thêm
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        )}
      </div>

      {/* Responsive grid:
            mobile  → 2 cols
            sm/md   → 3 cols
            lg+     → 4 cols */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : active.map(p => <ProductCard key={p.id} product={p} />)
        }
      </div>

      {!loading && active.length === 0 && (
        <div className="text-center py-12 sm:py-16 text-gray-400 text-sm">
          Chưa có sản phẩm nào.
        </div>
      )}
    </section>
  )
}
