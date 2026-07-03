import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/hooks/useCart'
import type { CartItem } from '@/services/cart.service'

function getPrice(item: CartItem) {
  return item.sale_price ?? item.product?.base_price ?? 0
}

function getTotal(item: CartItem) {
  return getPrice(item) * item.quantity
}

function getCartItemId(item: CartItem) {
  return item._id ?? item.cart_item_id
}

function getProductName(item: CartItem) {
  return item.product?.name ?? item.product_name ?? 'Sản phẩm'
}

function getProductId(item: CartItem) {
  return item.product?._id ?? item.product_id
}

function getProductLink(item: CartItem) {
  const productId = getProductId(item)
  if (!productId) return ''

  return item.product_type === 'digital'
    ? `/accounts/${productId}`
    : `/laptops/${productId}`
}

function getProductImage(item: CartItem) {
  return item.product?.thumbnail ?? item.product?.images?.[0] ?? ''
}

export default function CartPage() {
  const navigate = useNavigate()

  const {
    items,
    totalItems,
    isLoading,
    removeFromCart,
    updateQuantity,
  } = useCart()

  const cartAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + getTotal(item), 0)
  }, [items])

  const handleDeleteItem = async (cartItemId: string) => {
    await removeFromCart(cartItemId)
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.warning('Giỏ hàng đang trống.')
      return
    }

    navigate('/checkout')
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#09051f] text-white">
      <Header pageLabel="Giỏ hàng" cartCount={totalItems} />

      <main className="mx-auto w-full max-w-[1840px] flex-1 px-4 py-6">
        <h1 className="mb-6 text-3xl font-bold">Giỏ hàng</h1>

        {isLoading ? (
          <div className="py-20 text-center text-[#b9b4d7]">Đang tải giỏ hàng...</div>
        ) : items.length === 0 ? (
          <div className="rounded-[22px] bg-[#211b42] p-10 text-center shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
            <h2 className="text-xl font-semibold">Giỏ hàng đang trống</h2>

            <button
              type="button"
              onClick={() => navigate('/laptops')}
              className="mt-6 h-12 rounded-xl bg-[#3783EC] px-8 font-semibold text-white hover:bg-[#206ed6]"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <>
            <div className="hidden flex-col overflow-hidden rounded-[22px] bg-[#211b42] shadow-[0_18px_40px_rgba(0,0,0,0.18)] md:flex">
              <div className="flex items-center border-b border-white/10 p-4 font-semibold text-[#b9b4d7]">
                <div className="flex-1">Sản phẩm</div>
                <div className="w-[150px] text-center">Đơn giá</div>
                <div className="w-[150px] text-center">Số lượng</div>
                <div className="w-[150px] text-center">Thành tiền</div>
                <div className="w-[100px] text-center">Thao tác</div>
              </div>

              {items.map((item) => {
                const price = getPrice(item)
                const total = getTotal(item)
                const productLink = getProductLink(item)
                const productImage = getProductImage(item)
                const cartItemId = getCartItemId(item)

                return (
                  <div
                    key={cartItemId ?? item.item_id}
                    className="flex items-center border-b border-white/10 p-4 text-[#d9d6ee] transition-colors hover:bg-[#2b2450]"
                  >
                    <div className="flex flex-1 items-center gap-4">
                      {productLink ? (
                        <Link
                          to={productLink}
                          className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#171233] transition-transform hover:scale-[1.03]"
                        >
                          {productImage ? (
                            <img src={productImage} alt={getProductName(item)} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </Link>
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#171233]">
                          <span className="text-2xl">📦</span>
                        </div>
                      )}

                      <div>
                        {productLink ? (
                          <Link
                            to={productLink}
                            className="font-semibold text-white underline-offset-4 hover:text-[#6aa8ff] hover:underline"
                          >
                            {getProductName(item)}
                          </Link>
                        ) : (
                          <h3 className="font-semibold text-white">{getProductName(item)}</h3>
                        )}

                        <p className="mt-1 text-sm text-[#b9b4d7]">
                          {item.product?.description || `Mã item: ${item.item_id}`}
                        </p>

                        <p className="mt-1 text-xs text-[#8d86b6]">
                          Loại: {item.product_type === 'physical' ? 'Laptop' : 'Account'}
                        </p>
                      </div>
                    </div>

                    <div className="w-[150px] text-center font-semibold text-[#d9d6ee]">
                      {price.toLocaleString('vi-VN')}đ
                    </div>

                    <div className="flex w-[150px] justify-center">
                      <div className="flex overflow-hidden rounded-lg border border-white/15 bg-[#171233] text-white">
                        <button
                          type="button"
                          onClick={() => cartItemId && updateQuantity(cartItemId, item.quantity - 1)}
                          className="h-8 w-8 hover:bg-[#2b2450]"
                        >
                          −
                        </button>

                        <div className="flex h-8 w-10 items-center justify-center border-x border-white/15 text-sm">
                          {item.quantity}
                        </div>

                        <button
                          type="button"
                          onClick={() => cartItemId && updateQuantity(cartItemId, item.quantity + 1)}
                          className="h-8 w-8 hover:bg-[#2b2450]"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="w-[150px] text-center font-bold text-[#3783EC]">
                      {total.toLocaleString('vi-VN')}đ
                    </div>

                    <div className="w-[100px] text-center">
                      <button
                        type="button"
                        onClick={() => cartItemId && handleDeleteItem(cartItemId)}
                        className="font-semibold text-red-400 hover:text-red-300 hover:underline"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col gap-4 md:hidden">
              {items.map((item) => {
                const price = getPrice(item)
                const productLink = getProductLink(item)
                const productImage = getProductImage(item)
                const cartItemId = getCartItemId(item)

                return (
                  <div key={cartItemId ?? item.item_id} className="rounded-[22px] bg-[#211b42] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                    <div className="flex gap-3">
                      {productLink ? (
                        <Link
                          to={productLink}
                          className="flex h-[90px] w-[90px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#171233]"
                        >
                          {productImage ? (
                            <img src={productImage} alt={getProductName(item)} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </Link>
                      ) : (
                        <div className="flex h-[90px] w-[90px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#171233]">
                          <span className="text-2xl">📦</span>
                        </div>
                      )}

                      <div className="flex-1">
                        {productLink ? (
                          <Link to={productLink} className="line-clamp-2 text-sm font-semibold text-white hover:text-[#6aa8ff]">
                            {getProductName(item)}
                          </Link>
                        ) : (
                          <h3 className="line-clamp-2 text-sm font-semibold text-white">
                            {getProductName(item)}
                          </h3>
                        )}

                        <p className="mt-1 line-clamp-2 text-xs text-[#b9b4d7]">
                          {item.product?.description || `Mã item: ${item.item_id}`}
                        </p>

                        <p className="mt-2 font-bold text-[#3783EC]">
                          {price.toLocaleString('vi-VN')}đ
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex overflow-hidden rounded-lg border border-white/15 bg-[#171233] text-white">
                            <button
                              type="button"
                              onClick={() => cartItemId && updateQuantity(cartItemId, item.quantity - 1)}
                              className="h-8 w-8 hover:bg-[#2b2450]"
                            >
                              −
                            </button>

                            <div className="flex h-8 w-10 items-center justify-center border-x border-white/15 text-sm">
                              {item.quantity}
                            </div>

                            <button
                              type="button"
                              onClick={() => cartItemId && updateQuantity(cartItemId, item.quantity + 1)}
                              className="h-8 w-8 hover:bg-[#2b2450]"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => cartItemId && handleDeleteItem(cartItemId)}
                            className="text-[13px] font-semibold text-red-400 hover:text-red-300"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex flex-col gap-5 rounded-[22px] bg-[#211b42] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] md:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-[15px] text-[#b9b4d7]">
                Thanh toán toàn bộ {items.length} sản phẩm trong giỏ hàng.
              </div>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <span className="text-[#b9b4d7]">
                    Tổng ({items.length}):
                  </span>

                  <span className="text-[28px] font-bold text-[#3783EC]">
                    {cartAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="h-[46px] w-full rounded-xl bg-[#3783EC] px-10 font-bold text-white transition-colors hover:bg-[#206ed6] sm:w-auto"
                >
                  MUA HÀNG
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
