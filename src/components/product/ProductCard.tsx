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
      className="group grid min-h-[198px] overflow-hidden rounded-[22px] border border-[#3d63ff]/20 bg-[#29244f] text-white shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-0.5 hover:border-[#4c75ff] hover:bg-[#302a5f]"
    >
      <div className="relative min-h-[160px] overflow-hidden bg-[#171233]">
        <div className="absolute left-3 top-3 z-10 rounded-md bg-[#1677ff] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
          PC/ACC
        </div>
        {isOutOfStock && (
          <div className="absolute right-3 top-3 z-10 rounded-md bg-rose-500 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
            Hết hàng
          </div>
        )}
        {image ? (
          <img
            src={image}
            alt={name}
            className={`h-full min-h-[190px] w-full object-cover transition-transform duration-300 group-hover:scale-105 ${isOutOfStock ? 'opacity-45 grayscale' : ''}`}
          />
        ) : (
          <div className="flex h-full min-h-[190px] w-full items-center justify-center text-sm font-black text-[#8d86b6]">
            HÌNH ẢNH
          </div>
        )}
      </div>

      <div className="flex flex-col p-4">
        <h3 className="line-clamp-2 min-h-[44px] text-[15px] font-black leading-snug text-white group-hover:text-[#79a7ff]">
          {name}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[38px] text-[12px] leading-5 text-[#b9b4d7]">
          {subtitle}
        </p>

        <p className="mt-4 text-[18px] font-black text-[#ffd54a]">
          {formatPrice(displayPrice)}
        </p>

        <div className="mt-3 flex items-center gap-1 text-[#ffd54a]">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={15} fill="currentColor" />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || isCheckingStock || isOutOfStock}
          className="mt-4 flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-[#1677ff] text-sm font-black text-white transition-colors hover:bg-[#0f66df] disabled:cursor-not-allowed disabled:bg-[#625b84]"
        >
          <ShoppingCart size={16} />
          {isCheckingStock ? 'Đang kiểm tra...' : isOutOfStock ? 'Hết hàng' : isAdding ? 'Đang thêm...' : 'Thêm giỏ hàng'}
        </button>

        {message && (
          <p
            className={`mt-2 text-center text-xs ${
              message.includes('Đã thêm') ? 'text-[#35d07f]' : 'text-[#ff7b8f]'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </Link>
  )
}
