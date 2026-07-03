import { useEffect, useMemo, useRef, useState } from 'react'
import type React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  getProducts,
  getDisplayPrice,
  getProductImage,
  formatPrice,
  getProductById,
  normalizeProductDetail,
  type Product,
} from '@/services/product.service'
import { useCart } from '@/hooks/useCart'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

interface FlyingItem {
  key: number
  image: string
  startX: number
  startY: number
  deltaX: number
  deltaY: number
}

export default function BestSellerPage() {
  const navigate = useNavigate()
  const { totalItems, addToCart } = useCart()
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const isAuthenticated = Boolean(user && accessToken)

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [addedProductIds, setAddedProductIds] = useState<string[]>([])
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([])
  const [isCartBumping, setIsCartBumping] = useState(false)

  const productImageRefs = useRef<Record<string, HTMLImageElement | null>>({})
  const desktopCartRef = useRef<HTMLAnchorElement | null>(null)
  const mobileCartRef = useRef<HTMLAnchorElement | null>(null)
  const timeoutIdsRef = useRef<number[]>([])

  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([])

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setIsLoading(true)
        setError('')

        const res = await getProducts({
          is_active: true,
          limit: 12,
        })

        setProducts(res.data.data?.products ?? [])
      } catch (err) {
        console.error(err)
        setError('Không thể tải sản phẩm bán chạy.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBestSellers()

    return () => {
      timeoutIdsRef.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  const toggleValue = (
    value: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState(
      state.includes(value)
        ? state.filter((item) => item !== value)
        : [...state, value]
    )
  }

  const brands = useMemo(() => {
    return Array.from(
      new Set(products.map((item) => item.brand).filter(Boolean))
    ) as string[]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const price = getDisplayPrice(product)

      const matchPrice =
        selectedPrices.length === 0 ||
        selectedPrices.some((priceRange) => {
          if (priceRange === 'under500' && price < 500000) return true
          if (
            priceRange === '500to2m' &&
            price >= 500000 &&
            price <= 2000000
          )
            return true
          if (
            priceRange === '2to10m' &&
            price >= 2000000 &&
            price <= 10000000
          )
            return true
          if (priceRange === '10mplus' && price > 10000000) return true
          return false
        })

      const matchBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(product.brand || '')

      const matchProductType =
        selectedProductTypes.length === 0 ||
        selectedProductTypes.includes(product.product_type)

      return matchPrice && matchBrand && matchProductType
    })
  }, [products, selectedPrices, selectedBrands, selectedProductTypes])

  const getVisibleCartElement = () => {
    return [desktopCartRef.current, mobileCartRef.current].find((element) => {
      if (!element) return false
      const rect = element.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    })
  }

  const runFlyAnimation = (item: Product) => {
    const imageElement = productImageRefs.current[item._id]
    const cartElement = getVisibleCartElement()
    const image = getProductImage(item)

    if (!imageElement || !cartElement) return

    const imageRect = imageElement.getBoundingClientRect()
    const cartRect = cartElement.getBoundingClientRect()

    const startX = imageRect.left + imageRect.width / 2
    const startY = imageRect.top + imageRect.height / 2
    const endX = cartRect.left + cartRect.width / 2
    const endY = cartRect.top + cartRect.height / 2
    const flyKey = Date.now()

    setFlyingItems((prev) => [
      ...prev,
      {
        key: flyKey,
        image,
        startX,
        startY,
        deltaX: endX - startX,
        deltaY: endY - startY,
      },
    ])

    const removeTimeoutId = window.setTimeout(() => {
      setFlyingItems((prev) =>
        prev.filter((flyItem) => flyItem.key !== flyKey)
      )
    }, 780)

    timeoutIdsRef.current.push(removeTimeoutId)
  }

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>,
    item: Product
  ) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      navigate('/login')
      return false
    }

    const detailResponse = await getProductById(item._id)
    const detail = normalizeProductDetail(detailResponse.data?.data)

    if (!detail?.availableItem?._id) {
      toast.warning('Sản phẩm hiện chưa có hàng để thêm vào giỏ.')
      return false
    }

    await addToCart(detail.availableItem._id, detail.product_type, 1)

    runFlyAnimation(item)

    setIsCartBumping(true)

    const bumpTimeoutId = window.setTimeout(() => {
      setIsCartBumping(false)
    }, 240)

    timeoutIdsRef.current.push(bumpTimeoutId)

    if (!addedProductIds.includes(item._id)) {
      setAddedProductIds((prev) => [...prev, item._id])
    }

    return true
  }

  const handleBuyNow = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: Product
  ) => {
    e.preventDefault()
    e.stopPropagation()

    handleAddToCart(e, item).then((added) => {
      if (added) {
        navigate('/checkout')
      }
    })
  }

  const getProductLink = (item: Product) => {
    return item.product_type === 'physical'
      ? `/laptops/${item._id}`
      : `/accounts/${item._id}`
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#09051f] text-white">
      <style>
        {`
          @keyframes flyToCart {
            0% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
            85% { opacity: 1; }
            100% { transform: translate3d(var(--delta-x), var(--delta-y), 0) scale(0.25); opacity: 0; }
          }

          @keyframes cartBump {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.14); }
          }

          .fly-item {
            position: fixed;
            width: 56px;
            height: 56px;
            border-radius: 12px;
            pointer-events: none;
            object-fit: cover;
            box-shadow: 0 10px 24px rgba(55, 131, 236, 0.35);
            z-index: 70;
            animation: flyToCart 780ms cubic-bezier(0.18, 0.75, 0.25, 1) forwards;
          }

          .cart-bump {
            animation: cartBump 240ms ease;
          }
        `}
      </style>

      <div className="pointer-events-none fixed inset-0 z-[70]">
        {flyingItems.map((flyItem) => (
          <img
            key={flyItem.key}
            src={flyItem.image}
            alt=""
            className="fly-item"
            style={
              {
                left: `${flyItem.startX - 28}px`,
                top: `${flyItem.startY - 28}px`,
                '--delta-x': `${flyItem.deltaX}px`,
                '--delta-y': `${flyItem.deltaY}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <Header
        cartCount={totalItems}
        mobileCartRef={mobileCartRef}
        desktopCartRef={desktopCartRef}
        cartIconClassName={isCartBumping ? 'cart-bump' : ''}
      />

      <main className="mx-auto w-full max-w-[1840px] flex-1 px-4 py-6">
        <h1 className="mb-2 text-3xl font-bold">Sản phẩm bán chạy</h1>

        <p className="mb-8 text-[#b9b4d7]">
          Top những sản phẩm được mua nhiều nhất trong tháng qua. Cập nhật liên
          tục để bạn không bỏ lỡ cơ hội sở hữu những món hời.
        </p>

        <div className="flex gap-6">
          <aside className="hidden h-fit w-[280px] rounded-2xl bg-[#211b42] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] lg:block">
            <h2 className="mb-5 text-lg font-bold">Bộ lọc sản phẩm</h2>

            <div className="space-y-6">
              <div>
                <p className="mb-3 font-semibold">Khoảng giá</p>

                <div className="space-y-2 text-[14px]">
                  {[
                    ['under500', 'Dưới 500K'],
                    ['500to2m', '500K - 2 Triệu'],
                    ['2to10m', '2 Triệu - 10 Triệu'],
                    ['10mplus', '10 Triệu trở lên'],
                  ].map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPrices.includes(value)}
                        onChange={() =>
                          toggleValue(value, selectedPrices, setSelectedPrices)
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 font-semibold">Loại sản phẩm</p>

                <div className="space-y-2 text-[14px]">
                  {[
                    ['physical', 'Laptop'],
                    ['digital', 'Account'],
                  ].map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedProductTypes.includes(value)}
                        onChange={() =>
                          toggleValue(
                            value,
                            selectedProductTypes,
                            setSelectedProductTypes
                          )
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 font-semibold">Thương hiệu</p>

                <div className="space-y-2 text-[14px]">
                  {brands.length === 0 ? (
                    <p className="text-[#8d86b6]">Chưa có thương hiệu</p>
                  ) : (
                    brands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() =>
                            toggleValue(brand, selectedBrands, setSelectedBrands)
                          }
                        />
                        {brand}
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            {isLoading && (
              <div className="rounded-[22px] bg-[#211b42] p-8 text-center text-[#b9b4d7]">
                Đang tải sản phẩm...
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-[22px] bg-[#211b42] p-8 text-center text-red-500">
                {error}
              </div>
            )}

            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="rounded-[22px] bg-[#211b42] p-8 text-center text-[#b9b4d7]">
                Chưa có sản phẩm nào.
              </div>
            )}

            {!isLoading && !error && filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((item) => {
                  const image = getProductImage(item)
                  const price = getDisplayPrice(item)

                  return (
                    <a
                      key={item._id}
                      href={getProductLink(item)}
                      className="group overflow-hidden rounded-2xl bg-[#211b42] shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition-all hover:shadow-md"
                    >
                      <div className="overflow-hidden">
                        <img
                          ref={(element) => {
                            productImageRefs.current[item._id] = element
                          }}
                          src={image}
                          alt={item.name}
                          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105 md:h-48"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="line-clamp-2 min-h-[44px] text-[15px] font-bold">
                          {item.name}
                        </h3>

                        <p className="mt-2 line-clamp-2 min-h-[36px] text-[12px] text-[#b9b4d7]">
                          {item.description || 'Chưa có mô tả sản phẩm'}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[16px] font-bold text-[#27AE60]">
                            {formatPrice(price)}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(e, item)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3783EC] text-white transition-colors hover:bg-[#206ed6]"
                            aria-label={`Thêm ${item.name} vào giỏ hàng`}
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 3h2l.4 2M7 13h9l3-6H6.4M7 13L5.4 5M7 13l-1.5 1.5a1 1 0 00.7 1.7H17m-8 2a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                              />
                            </svg>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleBuyNow(e, item)}
                          className="mt-4 h-[42px] w-full rounded-xl bg-[#3783EC] font-semibold text-white transition-colors hover:bg-[#206ed6]"
                        >
                          Mua ngay
                        </button>
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
