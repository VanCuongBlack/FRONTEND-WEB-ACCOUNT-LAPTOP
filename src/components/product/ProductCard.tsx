import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import {
  formatPrice,
  getDisplayPrice,
  getProductById,
  normalizeProductDetail,
} from '@/services/product.service'
import type { ProductType } from '@/services/cart.service'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

interface ProductCardProps {
  id: string
  name: string
  price: number
  subtitle: string
  to: string
  image?: string
  itemId?: string
  productType?: ProductType
}

function getErrorMessage(error: unknown) {
  const status = (error as any)?.response?.status
  const apiMessage = (error as any)?.response?.data?.message
  if (status === 401) return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
  if (status === 403) return 'Chỉ tài khoản khách hàng mới thêm sản phẩm vào giỏ.'
  if (typeof apiMessage === 'string') return apiMessage
  if (error instanceof Error && error.message) return error.message
  return 'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.'
}

export default function ProductCard({
  id,
  name,
  price,
  subtitle,
  to,
  image,
  itemId,
  productType,
}: ProductCardProps) {
  const addCartItem = useCartStore((state) => state.addItem)
  const fetchCart = useCartStore((state) => state.fetchCart)
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const [isAdding, setIsAdding] = useState(false)
  const [isCheckingStock, setIsCheckingStock] = useState(true)
  const [message, setMessage] = useState('')
  const [displayPrice, setDisplayPrice] = useState(price)
  const [availableItemId, setAvailableItemId] = useState(itemId)
  const [availableProductType, setAvailableProductType] = useState<ProductType | undefined>(productType)

  const isOutOfStock = !isCheckingStock && !availableItemId

  useEffect(() => {
    let cancelled = false

    const syncOfficialItemPrice = async () => {
      try {
        setIsCheckingStock(true)
        const detailResponse = await getProductById(id)
        const detail = normalizeProductDetail(detailResponse.data?.data)

        if (cancelled || !detail) return

        setAvailableItemId(detail.availableItem?._id)
        setAvailableProductType(detail.product_type)
        setDisplayPrice(getDisplayPrice(detail))
      } catch (error) {
        console.error('Sync product price error:', error)
      } finally {
        if (!cancelled) {
          setIsCheckingStock(false)
        }
      }
    }

    syncOfficialItemPrice()

    return () => {
      cancelled = true
    }
  }, [id])

  const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (isCheckingStock) return

    if (!user || !accessToken) {
      setMessage('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.')
      return
    }

    try {
      setIsAdding(true)
      setMessage('')

      let resolvedItemId = availableItemId
      let resolvedProductType = availableProductType
      let resolvedPrice = displayPrice

      if (!resolvedItemId || !resolvedProductType) {
        const detailResponse = await getProductById(id)
        const detail = normalizeProductDetail(detailResponse.data?.data)

        resolvedItemId = detail?.availableItem?._id
        resolvedProductType = detail?.product_type
        resolvedPrice = detail ? getDisplayPrice(detail) : displayPrice

        setAvailableItemId(resolvedItemId)
        setAvailableProductType(resolvedProductType)
        setDisplayPrice(resolvedPrice)
      }

      if (!resolvedItemId || !resolvedProductType) {
        setMessage('Sản phẩm hiện đã hết hàng.')
        return
      }

      await addCartItem(resolvedItemId, resolvedProductType, 1)
      await fetchCart()

      setMessage(`Đã thêm vào giỏ hàng (${formatPrice(resolvedPrice)}).`)
    } catch (error) {
      console.error('Add to cart error:', error)
      setMessage(getErrorMessage(error))
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Link
      to={`${to}/${id}`}
      className="group grid min-h-[198px] overflow-hidden rounded-[26px] border border-white/5 bg-[#120d2b] text-white shadow-[0_20px_45px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-[#1a1435]"
    >
      <div className="relative min-h-[160px] overflow-hidden bg-[#09051f]">
        <div className="absolute left-3 top-3 z-10 rounded-md bg-gradient-to-r from-[#00c6ff] to-[#8a2be2] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-md">
          PC/ACC
        </div>
        {isOutOfStock && (
          <div className="absolute right-3 top-3 z-10 rounded-md bg-rose-500/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-md">
            Hết hàng
          </div>
        )}
        {image ? (
          <img
            src={image}
            alt={name}
            className={`h-full min-h-[190px] w-full object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}
          />
        ) : (
          <div className="flex h-full min-h-[190px] w-full items-center justify-center text-xs font-black text-white/30 uppercase tracking-widest bg-[#140f30]">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-col p-5">
        <h3 className="line-clamp-2 min-h-[44px] text-[15px] font-black leading-snug text-white group-hover:text-[#00c6ff] transition-colors duration-200">
          {name}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[38px] text-[12px] leading-relaxed text-white/50">
          {subtitle}
        </p>

        <p className="mt-4 text-lg font-black text-[#00c6ff] drop-shadow-[0_2px_10px_rgba(0,198,255,0.15)]">
          {formatPrice(displayPrice)}
        </p>

        <div className="mt-3 flex items-center gap-1 text-yellow-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={13} fill="currentColor" className="stroke-none" />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || isCheckingStock || isOutOfStock}
          className="mt-5 flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00c6ff] to-[#8a2be2] text-xs font-black uppercase tracking-wider text-white hover:opacity-90 active:scale-95 transition-all duration-200 disabled:cursor-not-allowed disabled:from-white/5 disabled:to-white/5 disabled:text-white/30 disabled:border disabled:border-white/5 disabled:scale-100 disabled:opacity-50"
        >
          <ShoppingCart size={14} />
          {isCheckingStock ? 'Đang kiểm tra...' : isOutOfStock ? 'Hết hàng' : isAdding ? 'Đang thêm...' : 'Thêm giỏ hàng'}
        </button>

        {message && (
          <p
            className={`mt-3 text-center text-xs font-bold ${
              message.includes('Đã thêm') ? 'text-teal-400' : 'text-rose-400'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </Link>
  )
}
