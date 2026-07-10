import { useState, type MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Bot, Laptop, PackageCheck, ShoppingCart, Truck } from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '@/services/landing.service'
import {
  getDisplayPrice,
  getProductById,
  normalizeProductDetail,
} from '@/services/product.service'
import type { ProductType } from '@/services/cart.service'
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

function isAvailableItem(item: any) {
  return String(item?.status ?? 'available').toLowerCase() === 'available'
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [busyAction, setBusyAction] = useState<'cart' | 'buy' | null>(null)

  const Icon = product.category === 'laptop' ? Laptop : Bot
  const detailUrl = product.category === 'laptop' ? `/laptops/${product.id}` : `/accounts/${product.id}`
  const initialType = (product.product_type || (product.category === 'laptop' ? 'physical' : 'digital')) as ProductType
  const isOutOfStock = product.stock !== undefined && product.stock <= 0

  const resolveCartTarget = async () => {
    const detailResponse = await getProductById(product.id)
    const rawDetail = detailResponse.data?.data as any
    const detail = normalizeProductDetail(rawDetail)
    const rawItems = Array.isArray(rawDetail?.items) ? rawDetail.items : []
    const fallbackItem =
      detail?.availableItem ||
      rawDetail?.availableItem ||
      rawDetail?.available_item ||
      rawDetail?.item ||
      rawItems.find(isAvailableItem)
    const itemId = fallbackItem?._id || fallbackItem?.id
    const productType = (detail?.product_type || initialType) as ProductType
    const price = detail ? getDisplayPrice(detail) : product.price

    return { itemId, productType, price }
  }

  const handleAction = async (event: MouseEvent<HTMLButtonElement>, action: 'cart' | 'buy') => {
    event.preventDefault()
    event.stopPropagation()

    if (isOutOfStock || busyAction) return

    try {
      setBusyAction(action)
      const target = await resolveCartTarget()

      if (!target.itemId) {
        toast.warning('Sản phẩm hiện chưa có hàng khả dụng để thêm vào giỏ.')
        return
      }

      const ok = await addToCart(target.itemId, target.productType, 1)
      if (ok && action === 'buy') {
        navigate('/checkout')
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng.')
    } finally {
      setBusyAction(null)
    }
  }

  return (
    <Link
      to={detailUrl}
      className="group flex min-h-[430px] flex-col overflow-hidden rounded-[22px] border border-[#1e3a62] bg-[#0a1628] text-white shadow-[0_18px_42px_rgba(0,0,0,0.34)] transition-all duration-300 hover:-translate-y-1 hover:border-[#2d7cff]/70 hover:bg-[#0d1d34] hover:shadow-[0_24px_55px_rgba(31,124,255,0.16)]"
    >
      <div className="relative h-[220px] overflow-hidden border-b border-[#193455] bg-[#071120]">
        {product.badge && (
          <span className="absolute left-4 top-4 z-10 rounded-md bg-[#1d7cff] px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-[0_8px_18px_rgba(29,124,255,0.32)]">
            {product.badge}
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute right-4 top-4 z-10 rounded-md bg-rose-500 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-md">
            Hết hàng
          </span>
        )}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#142b4a_0%,#071120_62%)]">
            <Icon className="h-16 w-16 text-[#597aa8]" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#74b7ff]">
          {product.category === 'laptop' ? 'PC / Laptop' : 'Tài khoản số'}
        </span>
        <h3 className="mt-2 line-clamp-2 min-h-[44px] text-[16px] font-black leading-snug text-white transition-colors duration-200 group-hover:text-[#74b7ff]">
          {product.name}
        </h3>
        <p className="mt-3 line-clamp-2 min-h-[44px] text-[13px] leading-relaxed text-[#a8b8d4]">
          {product.description || 'Sản phẩm chính hãng, giao nhanh và hỗ trợ rõ ràng.'}
        </p>

        <p className="mt-5 text-[22px] font-black text-[#ffd84d] drop-shadow-[0_0_16px_rgba(255,216,77,0.14)]">
          {fmt(product.price)}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-[#193455] pt-4 text-xs">
          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
            <Truck className="h-3.5 w-3.5" />
            {isOutOfStock ? 'Hết hàng' : 'Sẵn hàng'}
          </span>
          {product.sold !== undefined && (
            <span className="font-bold text-[#a8b8d4]">Đã bán {product.sold}</span>
          )}
        </div>

        <div className="mt-auto grid grid-cols-[1fr_52px] gap-3 pt-5">
          <button
            type="button"
            onClick={(event) => handleAction(event, 'buy')}
            disabled={isOutOfStock || Boolean(busyAction)}
            className="flex h-[46px] items-center justify-center rounded-xl bg-gradient-to-r from-[#36b8f2] via-[#2668ff] to-[#8b3df5] text-sm font-black text-white shadow-[0_12px_24px_rgba(38,104,255,0.24)] transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-none disabled:bg-white/5 disabled:text-white/30 disabled:shadow-none"
          >
            {busyAction === 'buy' ? 'Đang xử lý...' : 'Mua ngay'}
          </button>
          <button
            type="button"
            onClick={(event) => handleAction(event, 'cart')}
            disabled={isOutOfStock || Boolean(busyAction)}
            className="grid h-[46px] place-items-center rounded-xl border border-[#1e3a62] bg-[#0f2036] text-white shadow-[0_10px_22px_rgba(0,0,0,0.2)] transition-all duration-200 hover:border-[#36b8f2] hover:bg-[#143459] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/30"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="flex min-h-[430px] flex-col overflow-hidden rounded-[22px] border border-[#1e3a62] bg-[#0a1628]">
      <div className="h-[220px] animate-pulse bg-[#071120]" />
      <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
        <div className="space-y-3">
          <div className="h-3 w-1/4 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
        </div>
        <div className="h-11 w-full animate-pulse rounded-xl bg-white/10" />
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
    <section id="products" className="relative z-10 w-full max-w-none px-3 pb-8 sm:px-5 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {showEyebrow && (
            <p className="text-sm font-black uppercase text-[#74b7ff]">
              {accent === 'account' ? 'Account số' : accent === 'laptop' ? 'PC / Laptop' : 'Hot deal'}
            </p>
          )}
          <h2 className={`${showEyebrow ? 'mt-1' : ''} text-2xl font-black text-white`}>{title}</h2>
        </div>
        {headerRight ? headerRight : (
          <Link
            to={viewMoreUrl}
            className="inline-flex items-center gap-1 text-xs font-black text-[#a8b8d4] transition-colors duration-200 hover:text-white"
          >
            Xem tất cả
            <ArrowUpRight className="h-3.5 w-3.5 text-[#39bdf8]" />
          </Link>
        )}
      </div>

      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
        ) : active.length > 0 ? (
          active.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="col-span-full flex min-h-[220px] w-full flex-col items-center justify-center rounded-[24px] border border-[#1e3a62] bg-[#0a1628] px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#123b70]/65 text-white/40">
              <PackageCheck className="h-7 w-7 text-[#39bdf8]" />
            </div>
            <p className="text-sm font-bold text-[#a8b8d4]">Chưa có sản phẩm phù hợp.</p>
          </div>
        )}
      </div>
    </section>
  )
}
