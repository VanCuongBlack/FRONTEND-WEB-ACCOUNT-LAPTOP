import { ChevronLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { accountProducts, formatPrice } from '@/services/product.service'

export default function AccountDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = accountProducts.find((item) => item.id === id) || accountProducts[0]

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] font-sans text-black">
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

        <p className="text-sm text-gray-500">
          Trang chủ / Account số / {product.name}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex h-[320px] items-center justify-center rounded-2xl bg-[#d9d9d9] text-2xl font-bold text-gray-500">
              HÌNH ẢNH ACCOUNT
            </div>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-[30px] font-bold">{product.name}</h1>

            <p className="mt-6 text-[36px] font-bold text-[#27AE60]">
              {formatPrice(product.price)}
            </p>

            <div className="mt-8 space-y-4 text-gray-700">
              <p>• Nền tảng: {product.platform}</p>
              <p>• Thời hạn: {product.duration}</p>
              <p>• Thiết bị: {product.devices}</p>
              <p>• Giao tài khoản sau khi thanh toán</p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => alert('Chuyển sang thanh toán')}
                className="h-[52px] rounded-xl bg-[#3783EC] px-12 font-semibold text-white hover:bg-[#206ed6]"
              >
                Mua ngay
              </button>

              <button
                onClick={() => alert('Đã thêm vào giỏ hàng')}
                className="h-[52px] rounded-xl bg-[#F5F5F5] px-12 font-semibold text-black hover:bg-[#e8e8e8]"
              >
                Thêm giỏ hàng
              </button>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-sm lg:col-span-2">
            <h2 className="text-[24px] font-bold">Mô tả account</h2>
            <p className="mt-6 leading-8 text-gray-600">{product.description}</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}