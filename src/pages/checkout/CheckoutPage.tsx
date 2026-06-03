import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  MapPin,
  CreditCard,
  Wallet,
  QrCode,
  Landmark,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

type PaymentMethod = 'vnpay' | 'momo' | 'bank' | 'cod'

interface CheckoutItem {
  id: string
  name: string
  description?: string
  price: number
  quantity: number
  image?: string
}

interface CheckoutLocationState {
  selectedItems?: CheckoutItem[]
}

const paymentMethods = [
  {
    id: 'vnpay' as PaymentMethod,
    name: 'Thanh toán VNPay-QR',
    description: 'Quét mã QR để thanh toán nhanh',
    icon: QrCode,
  },
  {
    id: 'momo' as PaymentMethod,
    name: 'Ví MoMo',
    description: 'Thanh toán qua ví điện tử MoMo',
    icon: Wallet,
  },
  {
    id: 'bank' as PaymentMethod,
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản theo thông tin đơn hàng',
    icon: Landmark,
  },
  {
    id: 'cod' as PaymentMethod,
    name: 'Thanh toán khi nhận hàng',
    description: 'Áp dụng cho sản phẩm laptop / PC',
    icon: CreditCard,
  },
]

function formatPrice(price: number) {
  return `${price.toLocaleString('vi-VN')}đ`
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as CheckoutLocationState | null
  const selectedItems = state?.selectedItems ?? []

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vnpay')
  const [voucher, setVoucher] = useState('')
  const [discount, setDiscount] = useState(0)
  const [voucherMessage, setVoucherMessage] = useState('')

  const subtotal = useMemo(() => {
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }, [selectedItems])

  const shippingFee = 0
  const total = subtotal + shippingFee - discount

  const handleApplyVoucher = () => {
    const code = voucher.trim().toUpperCase()

    if (!code) {
      setVoucherMessage('Vui lòng nhập mã ưu đãi.')
      setDiscount(0)
      return
    }

    if (code === 'SALE50') {
      setDiscount(50000)
      setVoucherMessage('Áp dụng mã giảm giá thành công.')
      return
    }

    setDiscount(0)
    setVoucherMessage('Mã ưu đãi không hợp lệ.')
  }

  const handleConfirmPayment = () => {
    if (selectedItems.length === 0) {
      alert('Không có sản phẩm để thanh toán.')
      navigate('/cart')
      return
    }

    navigate('/order-success')
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] font-['Inter',sans-serif] text-black">
      <Header />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ChevronLeft size={20} />
          Quay lại
        </button>

        <h1 className="mb-6 text-[28px] font-bold text-black">Thanh toán</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <section className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <MapPin className="text-[#3783EC]" size={22} />
                <h2 className="text-xl font-bold">Địa chỉ nhận hàng</h2>
              </div>

              <div className="flex flex-col gap-4 rounded-xl bg-[#F8FAFC] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">Kim Ngân</p>
                  <p className="mt-1 text-sm text-gray-600">0736785649</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Phan Văn Trị, Thành phố Hồ Chí Minh
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Mở danh sách địa chỉ')}
                  className="h-[40px] rounded-xl border border-gray-300 px-5 text-sm font-medium hover:bg-gray-100"
                >
                  Thay đổi
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Bạn có mã ưu đãi?</h2>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                  placeholder="Mã ưu đãi không bắt buộc"
                  className="h-[48px] flex-1 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#3783EC]"
                />

                <button
                  type="button"
                  onClick={handleApplyVoucher}
                  className="h-[48px] rounded-xl bg-[#3783EC] px-8 text-sm font-semibold text-white hover:bg-[#206ed6]"
                >
                  Áp dụng
                </button>
              </div>

              {voucherMessage && (
                <p
                  className={`mt-3 text-sm ${
                    discount > 0 ? 'text-[#27AE60]' : 'text-red-500'
                  }`}
                >
                  {voucherMessage}
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Chọn phương thức thanh toán</h2>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  const active = paymentMethod === method.id

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? 'border-[#3783EC] bg-[#3783EC]/5'
                          : 'border-gray-200 hover:border-[#3783EC]'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          active ? 'border-[#3783EC]' : 'border-gray-300'
                        }`}
                      >
                        {active && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[#3783EC]" />
                        )}
                      </span>

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F5F5]">
                        <Icon size={22} className="text-[#3783EC]" />
                      </div>

                      <div>
                        <p className="font-semibold">{method.name}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {method.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Chi tiết đơn hàng</h2>

            {selectedItems.length === 0 ? (
              <div className="mt-6 rounded-xl bg-[#F8FAFC] p-4 text-sm text-gray-500">
                Không có sản phẩm nào được chọn.
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="mt-3 block font-semibold text-[#3783EC] hover:underline"
                >
                  Quay lại giỏ hàng
                </button>
              </div>
            ) : (
              <>
                <div className="mt-5 space-y-4">
                  {selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.name}
                        </p>

                        {item.description && (
                          <p className="mt-1 text-xs text-gray-400">
                            {item.description}
                          </p>
                        )}

                        <p className="mt-1 text-sm text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-[#3783EC]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>{formatPrice(shippingFee)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng thanh toán</span>
                      <span className="text-[#27AE60]">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="mt-6 h-[52px] w-full rounded-xl bg-[#3783EC] font-semibold text-white hover:bg-[#206ed6]"
                >
                  Xác nhận thanh toán
                </button>
              </>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}