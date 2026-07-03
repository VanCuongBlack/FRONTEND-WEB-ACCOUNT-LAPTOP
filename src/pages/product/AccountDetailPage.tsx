import { ChevronLeft, Minus, Plus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  getProductById,
  getDisplayPrice,
  getProductImage,
  normalizeProductDetail,
  type ProductDetail,
} from '@/services/product.service'
import { useCart } from '@/hooks/useCart'

type AccountProduct = ProductDetail

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<AccountProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingCart, setAddingCart] = useState(false)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setError('Thiếu mã sản phẩm.')
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getProductById(id)
        const productData = normalizeProductDetail(response.data?.data) as AccountProduct | null

        setProduct(productData)
      } catch (err) {
        console.error('Failed to fetch product:', err)
        setError('Không thể tải chi tiết sản phẩm.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const productPrice = useMemo(() => {
    return product ? getDisplayPrice(product) : 0
  }, [product])

  const productImage = useMemo(() => {
    return product ? getProductImage(product) : ''
  }, [product])

  const maxQuantity = useMemo(() => {
    const availableCount = product?.items?.filter((item) => item.status === 'available').length ?? 0
    return Math.max(1, availableCount)
  }, [product?.items])

  useEffect(() => {
    setQuantity((value) => Math.min(Math.max(value, 1), maxQuantity))
  }, [maxQuantity])

  const handleAddToCart = async () => {
    if (!product?.availableItem?._id) {
      toast.warning('Sản phẩm hiện chưa có hàng để thêm vào giỏ.')
      return false
    }

    try {
      setAddingCart(true)
      return await addToCart(product.availableItem._id, product.product_type, quantity)
    } catch (err) {
      console.error('Failed to add to cart:', err)
      toast.error('Không thể thêm vào giỏ hàng.')
      return false
    } finally {
      setAddingCart(false)
    }
  }

  const handleBuyNow = async () => {
    const added = await handleAddToCart()
    if (added) {
      navigate('/checkout')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#09051f] font-sans text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1840px] flex-1 px-4 py-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-[#b9b4d7] hover:text-white"
        >
          <ChevronLeft size={20} />
          Quay lại
        </button>

        {loading && <p className="text-center text-[#b9b4d7]">Đang tải...</p>}

        {!loading && error && <p className="text-center text-[#ff7b8f]">{error}</p>}

        {!loading && !error && !product && (
          <p className="text-center text-[#ff7b8f]">Không tìm thấy sản phẩm.</p>
        )}

        {!loading && !error && product && (
          <>
            <p className="text-sm text-[#b9b4d7]">
              Trang chủ / Account số / {product.name}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <section className="rounded-[22px] border border-[#3d63ff]/20 bg-[#211b42] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
                <div className="flex h-[360px] items-center justify-center overflow-hidden rounded-[20px] bg-[#171233]">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-black text-[#8d86b6]">
                      HÌNH ẢNH ACCOUNT
                    </span>
                  )}
                </div>
              </section>

              <section className="rounded-[22px] border border-[#3d63ff]/20 bg-[#211b42] p-8 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
                <h1 className="text-[30px] font-black text-white">{product.name}</h1>

                <p className="mt-6 text-[36px] font-black text-[#ffd54a]">
                  {formatPrice(productPrice)}
                </p>

                <div className="mt-8 space-y-4 text-[#d9d6ee]">
                  <p>Nền tảng: {product.platform || 'Đang cập nhật'}</p>
                  <p>Khu vực: {product.region || 'Đang cập nhật'}</p>
                  <p>
                    Thời hạn: {product.duration_months ? `${product.duration_months} tháng` : 'Đang cập nhật'}
                  </p>
                  <p>Giao tài khoản sau khi thanh toán</p>
                </div>

                <div className="mt-8">
                  <p className="mb-3 text-sm font-bold text-[#d9d6ee]">Số lượng</p>
                  <div className="inline-flex h-12 items-center overflow-hidden rounded-xl border border-[#3d63ff]/30 bg-[#151033]">
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      disabled={quantity <= 1 || addingCart}
                      className="flex h-full w-12 items-center justify-center text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Giảm số lượng"
                    >
                      <Minus size={18} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={maxQuantity}
                      value={quantity}
                      onChange={(event) => {
                        const next = Number(event.target.value)
                        setQuantity(Number.isNaN(next) ? 1 : Math.min(Math.max(next, 1), maxQuantity))
                      }}
                      className="h-full w-16 border-x border-[#3d63ff]/20 bg-transparent text-center font-black text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                      disabled={quantity >= maxQuantity || addingCart}
                      className="flex h-full w-12 items-center justify-center text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Tăng số lượng"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  {maxQuantity <= 1 && (
                    <p className="mt-2 text-xs text-[#b9b4d7]">Hiện chỉ còn 1 tài khoản khả dụng.</p>
                  )}
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={addingCart || !product.availableItem}
                    className="h-[52px] rounded-xl bg-[#1677ff] px-12 font-black text-white hover:bg-[#0f66df] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {addingCart ? 'Đang xử lý...' : 'Mua ngay'}
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={addingCart}
                    className="h-[52px] rounded-xl bg-[#4a4568] px-12 font-black text-white hover:bg-[#5a5378] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {addingCart ? 'Đang thêm...' : 'Thêm giỏ hàng'}
                  </button>
                </div>
              </section>

              <section className="rounded-[22px] border border-[#3d63ff]/20 bg-[#211b42] p-8 shadow-[0_18px_40px_rgba(0,0,0,0.18)] lg:col-span-2">
                <h2 className="text-[24px] font-black text-white">Mô tả account</h2>
                <p className="mt-6 leading-8 text-[#b9b4d7]">
                  {product.description || 'Chưa có mô tả sản phẩm.'}
                </p>
              </section>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
