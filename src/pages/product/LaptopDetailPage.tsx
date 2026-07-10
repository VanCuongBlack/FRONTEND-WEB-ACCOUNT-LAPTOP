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

type LaptopProduct = ProductDetail

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

export default function LaptopDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<LaptopProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingCart, setAddingCart] = useState(false)
  const [error, setError] = useState('')
  const [activeImage, setActiveImage] = useState('')
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
        const productData = normalizeProductDetail(response.data?.data) as LaptopProduct | null

        setProduct(productData)

        if (productData) {
          setActiveImage(getProductImage(productData))
        }
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

  const galleryImages = useMemo(() => {
    if (!productImage) return []
    return [productImage]
  }, [productImage])

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
    <div className="flex min-h-screen flex-col bg-[#050914] font-sans text-white">
      <Header />

      <main className="w-full max-w-none flex-1 px-3 py-6 sm:px-5 lg:px-8">
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
              Trang chủ / Laptop / {product.name}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(460px,0.92fr)]">
              <section className="rounded-[22px] border border-[#1e3a62] bg-[#0a1628] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
                <div className="flex h-[520px] items-center justify-center overflow-hidden rounded-[22px] border border-[#1e3a62] bg-[#071120]">
                  {activeImage ? (
                    <img
                      src={activeImage}
                      alt={product.name}
                      className="h-full w-full object-contain p-5"
                    />
                  ) : (
                    <span className="text-2xl font-black text-[#8d86b6]">
                      HÌNH ẢNH SẢN PHẨM
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-4">
                  {galleryImages.length > 0 ? (
                    galleryImages.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setActiveImage(image)}
                        className={`h-[70px] w-[90px] overflow-hidden rounded-xl border transition-all hover:scale-105 ${
                          activeImage === image ? 'border-[#79a7ff]' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="h-full w-full object-contain p-5"
                        />
                      </button>
                    ))
                  ) : (
                    <div className="h-[70px] w-[90px] rounded-xl bg-[#071120]" />
                  )}
                </div>
              </section>

              <section className="rounded-[22px] border border-[#1e3a62] bg-[#0a1628] p-8 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
                <h1 className="text-[30px] font-black text-white">{product.name}</h1>

                <p className="mt-6 text-[36px] font-black text-[#ffd84d]">
                  {formatPrice(productPrice)}
                </p>

                <ul className="mt-8 space-y-3 text-[#d9d6ee]">
                  <li>CPU: {product.cpu || 'N/A'}</li>
                  <li>GPU: {product.gpu || 'N/A'}</li>
                  <li>RAM: {product.ram || 'N/A'}</li>
                  <li>Lưu trữ: {product.storage || 'N/A'}</li>
                  <li>
                    Màn hình: {product.display_inches ? `${product.display_inches}"` : 'N/A'}
                  </li>
                </ul>

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
                      className="h-full w-16 border-x border-[#1e3a62] bg-transparent text-center font-black text-white outline-none"
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
                    <p className="mt-2 text-xs text-[#b9b4d7]">Hiện chỉ còn 1 sản phẩm khả dụng.</p>
                  )}
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={addingCart || !product.availableItem}
                    className="h-[52px] rounded-xl bg-gradient-to-r from-[#36b8f2] via-[#2668ff] to-[#8b3df5] px-12 shadow-[0_14px_28px_rgba(38,104,255,0.24)] font-black text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {addingCart ? 'Đang xử lý...' : 'Mua ngay'}
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={addingCart}
                    className="h-[52px] rounded-xl border border-[#1e3a62] bg-[#0f2036] px-12 font-black text-white hover:bg-[#143459] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {addingCart ? 'Đang thêm...' : 'Thêm giỏ hàng'}
                  </button>
                </div>
              </section>

              <section className="rounded-[22px] border border-[#1e3a62] bg-[#0a1628] p-8 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                <h2 className="text-[24px] font-black text-white">Mô tả sản phẩm</h2>
                <p className="mt-6 leading-8 text-[#b9b4d7]">
                  {product.description || 'Chưa có mô tả sản phẩm.'}
                </p>
              </section>

              <section className="rounded-[22px] border border-[#1e3a62] bg-[#0a1628] p-8 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                <h2 className="text-[24px] font-black text-white">Cấu hình chi tiết</h2>

                <div className="mt-6 space-y-4 text-[#d9d6ee]">
                  <p>CPU: {product.cpu || 'N/A'}</p>
                  <p>GPU: {product.gpu || 'N/A'}</p>
                  <p>RAM: {product.ram || 'N/A'}</p>
                  <p>Lưu trữ: {product.storage || 'N/A'}</p>
                  <p>Màn hình: {product.display_inches ? `${product.display_inches}"` : 'N/A'}</p>
                  <p>Hệ điều hành: {product.os || 'N/A'}</p>
                  <p>
                    Tình trạng: {product.condition_percent ? `${product.condition_percent}%` : 'N/A'}
                  </p>
                  <p>
                    Bảo hành: {product.warranty_months ? `${product.warranty_months} tháng` : 'N/A'}
                  </p>
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
