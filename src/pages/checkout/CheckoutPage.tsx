Dưới đây là mã nguồn đã được giải quyết triệt để các xung đột Git (conflict markers `<<<<<<<`, `=======`, `>>>>>>>`).

Tôi đã chọn giải pháp **giữ lại tính năng nâng cao từ nhánh `feature-hung**`: Tách địa chỉ thành các trường Tỉnh/Thành phố (dùng `select` từ danh sách `PROVINCES`), Quận/Huyện, và Địa chỉ chi tiết, đồng thời tự động bóc tách (parse) chuỗi địa chỉ cũ từ dữ liệu `user.address` để điền vào form một cách thông minh.

```tsx
import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, CreditCard, Landmark, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useOrder } from '@/hooks/useOrder'
import { useUser } from '@/hooks/useUser'
import { useCart } from '@/hooks/useCart'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AppModal from '@/components/common/AppModal'

import type { PaymentMethod } from '@/services/order.service'

const paymentMethods = [
  {
    id: 'cod' as PaymentMethod,
    name: 'Thanh toán khi nhận hàng',
    description: 'Chỉ áp dụng cho đơn có PC/Laptop hoặc sản phẩm vật lý.',
    icon: CreditCard,
  },
  {
    id: 'bank_transfer' as PaymentMethod,
    name: 'Chuyển khoản ngân hàng',
    description: 'Hiển thị QR và nội dung chuyển khoản sau khi tạo đơn.',
    icon: Landmark,
  },
]

const PROVINCES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái'
]

function formatPrice(price: number) {
  return `${price.toLocaleString('vi-VN')}đ`
}

function getCartItemPrice(item: { sale_price?: number; product?: { base_price?: number } }) {
  return item.sale_price ?? item.product?.base_price ?? 0
}

function getCartItemId(item: { _id?: string; cart_item_id?: string; item_id?: string }) {
  return item._id ?? item.cart_item_id ?? item.item_id
}

function getCartItemName(item: { product?: { name?: string }; product_name?: string }) {
  return item.product?.name ?? item.product_name ?? 'Sản phẩm'
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { createNewOrder, isLoading: orderLoading } = useOrder()
  const {
    items: cartItems,
    totalItems,
    totalAmount,
    isLoading: cartLoading,
    clear,
  } = useCart()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer')
  const [shippingAddress, setShippingAddress] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [exactAddress, setExactAddress] = useState('')
  const [openNoticeModal, setOpenNoticeModal] = useState(false)
  const [noticeMessage, setNoticeMessage] = useState('')

  const hasPhysicalItems = cartItems.some((item) => item.product_type === 'physical')
  const hasDigitalOnlyItems = cartItems.length > 0 && !hasPhysicalItems

  // Tự động phân tách chuỗi địa chỉ của User (nếu có) thành Tỉnh/Thành, Quận/Huyện, Địa chỉ chi tiết
  useEffect(() => {
    if (user?.address) {
      const addr = user.address.trim()
      let matchedProvince = ''
      for (const province of PROVINCES) {
        if (addr.toLowerCase().endsWith(province.toLowerCase())) {
          matchedProvince = province
          break
        }
      }

      if (matchedProvince) {
        setSelectedProvince(matchedProvince)
        let remaining = addr.slice(0, addr.length - matchedProvince.length).trim()
        if (remaining.endsWith(',')) {
          remaining = remaining.slice(0, -1).trim()
        }

        const parts = remaining.split(',').map((p) => p.trim())
        if (parts.length >= 2) {
          const district = parts[parts.length - 1]
          setSelectedDistrict(district)
          setExactAddress(parts.slice(0, -1).join(', ').trim())
        } else {
          setExactAddress(remaining)
        }
      } else {
        setExactAddress(addr)
      }
    }
  }, [user?.address])

  // Gộp các trường địa chỉ đơn lẻ thành chuỗi shippingAddress hoàn chỉnh
  useEffect(() => {
    const combined = [
      exactAddress.trim(),
      selectedDistrict.trim(),
      selectedProvince.trim(),
    ]
      .filter(Boolean)
      .join(', ')
    setShippingAddress(combined)
  }, [selectedProvince, selectedDistrict, exactAddress])

  // Chuyển phương thức về Chuyển khoản nếu giỏ hàng chỉ toàn hàng Digital/Account
  useEffect(() => {
    if (hasDigitalOnlyItems && paymentMethod === 'cod') {
      setPaymentMethod('bank_transfer')
    }
  }, [hasDigitalOnlyItems, paymentMethod])

  const subtotal = useMemo(() => {
    if (totalAmount > 0) return totalAmount
    return cartItems.reduce((total, item) => {
      return total + getCartItemPrice(item) * item.quantity
    }, 0)
  }, [cartItems, totalAmount])

  const shippingFee = 0
  const total = Math.max(subtotal + shippingFee, 0)

  const showNotice = (message: string) => {
    setNoticeMessage(message)
    setOpenNoticeModal(true)
  }

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    if (method === 'cod' && hasDigitalOnlyItems) {
      showNotice('Đơn mua tài khoản/account chỉ hỗ trợ chuyển khoản ngân hàng.')
      setPaymentMethod('bank_transfer')
      return
    }
    setPaymentMethod(method)
  }

  const handleConfirmPayment = async () => {
    if (cartItems.length === 0) {
      navigate('/cart')
      return
    }

    if (hasPhysicalItems) {
      if (!selectedProvince) {
        showNotice('Vui lòng chọn Tỉnh/Thành phố giao hàng.')
        return
      }
      if (!selectedDistrict.trim()) {
        showNotice('Vui lòng nhập Quận/Huyện giao hàng.')
        return
      }
      if (!exactAddress.trim()) {
        showNotice('Vui lòng nhập địa chỉ giao hàng chi tiết.')
        return
      }
    }

    if (hasDigitalOnlyItems && paymentMethod === 'cod') {
      showNotice('Đơn mua tài khoản/account chỉ hỗ trợ chuyển khoản ngân hàng.')
      setPaymentMethod('bank_transfer')
      return
    }

    const created = await createNewOrder({
      payment_method: paymentMethod,
      shipping_address: hasPhysicalItems ? shippingAddress.trim() : undefined,
    })

    if (created?.order) {
      await clear()
      navigate('/order-success', {
        state: {
          order: created.order,
          payment: created.payment,
        },
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#09051f] font-sans text-white">
      <Header cartCount={totalItems} />

      <main className="mx-auto w-full max-w-[1840px] flex-1 px-4 py-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-[#b9b4d7] hover:text-white"
        >
          <ChevronLeft size={20} />
          Quay lại
        </button>

        <h1 className="mb-6 text-[28px] font-bold text-white">Thanh toán</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <section className="space-y-6">
            {hasDigitalOnlyItems && (
              <div className="rounded-[18px] border border-[#3d63ff]/30 bg-[#151033] p-4 text-sm text-[#d9d6ee]">
                Giỏ hàng chỉ có tài khoản/account nên hệ thống chỉ cho phép chuyển khoản
                ngân hàng.
              </div>
            )}

            <div className="rounded-[22px] bg-[#211b42] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
              <div className="mb-5 flex items-center gap-3">
                <MapPin className="text-[#3783EC]" size={22} />
                <h2 className="text-xl font-bold">Địa chỉ nhận hàng</h2>
              </div>

              {hasPhysicalItems ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#d9d6ee]">
                      Tỉnh / Thành phố
                    </label>
                    <div className="relative">
                      <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        className="w-full h-[46px] rounded-xl border border-[#3d63ff]/30 bg-[#151033] px-4 pr-10 text-sm text-white outline-none focus:border-[#3783EC] appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23b9b4d7' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 1rem center',
                          backgroundSize: '1.25rem',
                          backgroundRepeat: 'no-repeat'
                        }}
                      >
                        <option value="" disabled className="bg-[#151033] text-[#8d86b6]">
                          -- Chọn Tỉnh / Thành phố --
                        </option>
                        {PROVINCES.map((p) => (
                          <option key={p} value={p} className="bg-[#151033] text-white">
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#d9d6ee]">
                      Quận / Huyện
                    </label>
                    <input
                      type="text"
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      placeholder="Ví dụ: Quận 5"
                      className="w-full h-[46px] rounded-xl border border-[#3d63ff]/30 bg-[#151033] px-4 text-sm text-white outline-none placeholder:text-[#8d86b6] focus:border-[#3783EC]"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#d9d6ee]">
                      Địa chỉ chi tiết (Số nhà, tên đường...)
                    </label>
                    <input
                      type="text"
                      value={exactAddress}
                      onChange={(e) => setExactAddress(e.target.value)}
                      placeholder="Ví dụ: 123 Nguyễn Trãi, Phường 5"
                      className="w-full h-[46px] rounded-xl border border-[#3d63ff]/30 bg-[#151033] px-4 text-sm text-white outline-none placeholder:text-[#8d86b6] focus:border-[#3783EC]"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-[#3d63ff]/20 bg-[#151033] p-4 text-sm text-[#c9c4e8]">
                  Đơn hàng tài khoản/account không cần địa chỉ giao hàng.
                </div>
              )}
            </div>

            <div className="rounded-[22px] bg-[#211b42] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
              <h2 className="text-xl font-bold">Chọn phương thức thanh toán</h2>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  const active = paymentMethod === method.id
                  const disabled = method.id === 'cod' && hasDigitalOnlyItems

                  return (
                    <button
                      key={method.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleSelectPaymentMethod(method.id)}
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
                        active
                          ? 'border-[#3783EC] bg-[#3783EC]/10'
                          : 'border-[#3d63ff]/20 hover:border-[#3783EC]'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          active ? 'border-[#3783EC]' : 'border-[#3d63ff]/30'
                        }`}
                      >
                        {active && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[#3783EC]" />
                        )}
                      </span>

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#09051f]">
                        <Icon size={22} className="text-[#3783EC]" />
                      </div>

                      <div>
                        <p className="font-semibold text-white">{method.name}</p>
                        <p className="mt-1 text-xs text-[#b9b4d7]">
                          {disabled
                            ? 'Không áp dụng cho đơn mua tài khoản/account.'
                            : method.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-[22px] bg-[#211b42] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
            <h2 className="text-xl font-bold">Chi tiết đơn hàng</h2>

            {cartLoading ? (
              <div className="mt-6 rounded-xl border border-[#3d63ff]/20 bg-[#151033] p-4 text-sm text-[#c9c4e8]">
                Đang tải giỏ hàng...
              </div>
            ) : cartItems.length === 0 ? (
              <div className="mt-6 rounded-xl border border-[#3d63ff]/20 bg-[#151033] p-4 text-sm text-[#c9c4e8]">
                Không có sản phẩm nào trong giỏ hàng.
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="mt-3 block font-semibold text-[#7db3ff] hover:underline"
                >
                  Quay lại giỏ hàng
                </button>
              </div>
            ) : (
              <>
                <div className="mt-5 space-y-4">
                  {cartItems.map((item) => {
                    const price = getCartItemPrice(item)

                    return (
                      <div
                        key={getCartItemId(item)}
                        className="flex items-start justify-between gap-4 border-b border-[#3d63ff]/20 pb-4"
                      >
                        <div>
                          <p className="font-medium text-white">{getCartItemName(item)}</p>
                          {item.product?.description && (
                            <p className="mt-1 text-xs text-[#8d86b6]">
                              {item.product.description}
                            </p>
                          )}
                          <p className="mt-1 text-sm text-[#b9b4d7]">
                            Số lượng: {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold text-[#7db3ff]">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-[#b9b4d7]">
                    <span>Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#b9b4d7]">
                    <span>Phí vận chuyển</span>
                    <span>{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="border-t border-[#3d63ff]/20 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng thanh toán</span>
                      <span className="text-[#7ee2a8]">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={orderLoading}
                  onClick={handleConfirmPayment}
                  className="mt-6 h-[52px] w-full rounded-xl bg-[#3783EC] font-semibold text-white hover:bg-[#206ed6] disabled:cursor-not-allowed disabled:bg-gray-500"
                >
                  {orderLoading ? 'Đang tạo đơn...' : 'Xác nhận thanh toán'}
                </button>
              </>
            )}
          </aside>
        </div>
      </main>

      <AppModal
        open={openNoticeModal}
        title="Thông báo"
        onClose={() => setOpenNoticeModal(false)}
        footer={
          <button
            type="button"
            onClick={() => setOpenNoticeModal(false)}
            className="h-[42px] rounded-xl bg-[#3783EC] px-6 text-sm font-semibold text-white hover:bg-[#206ed6]"
          >
            Đã hiểu
          </button>
        }
      >
        <p className="text-sm text-[#b9b4d7]">{noticeMessage}</p>
      </AppModal>

      <Footer />
    </div>
  )
}

```