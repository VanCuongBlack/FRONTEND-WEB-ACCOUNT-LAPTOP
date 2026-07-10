import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
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
  const navigate = useNavigate()
  const addCartItem = useCartStore((state) => state.addItem)
  const fetchCart = useCartStore((state) => state.fetchCart)
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const [busyAction, setBusyAction] = useState<'cart' | 'buy' | null>(null)
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

  const resolveCartTarget = async () => {
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

    return { resolvedItemId, resolvedProductType, resolvedPrice }
  }

  const handleCartAction = async (event: MouseEvent<HTMLButtonElement>, action: 'cart' | 'buy') => {
    event.preventDefault()
    event.stopPropagation()

    if (isCheckingStock || busyAction) return

    if (!user || !accessToken) {
      setMessage('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.')
      return
    }

    try {
      setBusyAction(action)
      setMessage('')

      const { resolvedItemId, resolvedProductType, resolvedPrice } = await resolveCartTarget()

      if (!resolvedItemId || !resolvedProductType) {
        setMessage('Sản phẩm hiện đã hết hàng.')
        return
      }

      await addCartItem(resolvedItemId, resolvedProductType, 1)
      await fetchCart()

      if (action === 'buy') {
        navigate('/checkout')
        return
      }

      setMessage(`Đã thêm vào giỏ hàng (${formatPrice(resolvedPrice)}).`)
    } catch (error) {
      console.error('Add to cart error:', error)
      setMessage(getErrorMessage(error))
    } finally {
      setBusyAction(null)
    }
  }

  return (
    <Link
      to={`${to}/${id}`}
      className="group flex min-h-[430px] flex-col overflow-hidden rounded-[22px] border border-[#1e3a62] bg-[#0a1628] text-white shadow-[0_18px_42px_rgba(0,0,0,0.34)] transition-all duration-300 hover:-translate-y-1 hover:border-[#2d7cff]/70 hover:bg-[#0d1d34] hover:shadow-[0_24px_55px_rgba(31,124,255,0.16)]"
    >
      <div className="relative h-[220px] overflow-hidden border-b border-[#193455] bg-[#071120]">
        <div className="absolute left-4 top-4 z-10 rounded-md bg-[#1d7cff] px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-[0_8px_18px_rgba(29,124,255,0.32)]">
          PC/ACC
        </div>
        {isOutOfStock && (
          <div className="absolute right-4 top-4 z-10 rounded-md bg-rose-500 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-md">
            Hết hàng
          </div>
        )}
        {image ? (
          <img
            src={image}
            alt={name}
            className={`h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#142b4a_0%,#071120_62%)] text-xs font-black uppercase tracking-widest text-[#597aa8]">
            Chưa có ảnh
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[44px] text-[16px] font-black leading-snug text-white transition-colors duration-200 group-hover:text-[#74b7ff]">
          {name}
        </h3>

        <p className="mt-3 line-clamp-2 min-h-[44px] text-[13px] leading-relaxed text-[#a8b8d4]">
          {subtitle}
        </p>

        <p className="mt-5 text-[22px] font-black text-[#ffd84d] drop-shadow-[0_0_16px_rgba(255,216,77,0.14)]">
          {formatPrice(displayPrice)}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-[#193455] pt-4 text-xs font-bold text-emerald-400">
          <span className={`h-2 w-2 rounded-full ${isOutOfStock ? 'bg-rose-500' : 'bg-emerald-400'}`} />
          {isOutOfStock ? 'Hết hàng' : 'Sẵn hàng'}
        </div>

        <div className="mt-auto grid grid-cols-[1fr_52px] gap-3 pt-5">
          <button
            type="button"
            onClick={(event) => handleCartAction(event, 'buy')}
            disabled={isCheckingStock || isOutOfStock || Boolean(busyAction)}
            className="flex h-[46px] items-center justify-center rounded-xl bg-gradient-to-r from-[#36b8f2] via-[#2668ff] to-[#8b3df5] text-sm font-black text-white shadow-[0_12px_24px_rgba(38,104,255,0.24)] transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-none disabled:bg-white/5 disabled:text-white/30 disabled:shadow-none"
          >
            {busyAction === 'buy' ? 'Đang xử lý...' : 'Mua ngay'}
          </button>
          <button
            type="button"
            onClick={(event) => handleCartAction(event, 'cart')}
            disabled={isCheckingStock || isOutOfStock || Boolean(busyAction)}
            className="grid h-[46px] place-items-center rounded-xl border border-[#1e3a62] bg-[#0f2036] text-white shadow-[0_10px_22px_rgba(0,0,0,0.2)] transition-all duration-200 hover:border-[#36b8f2] hover:bg-[#143459] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/30"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart size={18} />
          </button>
        </div>

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
