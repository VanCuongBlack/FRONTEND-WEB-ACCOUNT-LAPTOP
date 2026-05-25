import { ChevronLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { formatPrice, laptopProducts } from '@/services/product.service'

export default function LaptopDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const product =
    laptopProducts.find((item) => item.id === id) || laptopProducts[0]

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

        <p className="text-sm text-gray-500">
          Trang chủ / Laptop / {product.name}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex h-[320px] items-center justify-center rounded-2xl bg-[#d9d9d9] text-2xl font-bold text-gray-500">
              HÌNH ẢNH SẢN PHẨM
            </div>

            <div className="mt-4 flex gap-4">
              {[1, 2, 3, 4].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => alert(`Đổi ảnh ${item}`)}
                  className="h-[70px] w-[90px] rounded-xl bg-[#d9d9d9] transition-all hover:scale-105"
                />
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-[30px] font-bold">{product.name}</h1>

            <p className="mt-4 text-yellow-400">
              ☆☆☆☆☆
              <span className="ml-4 text-sm text-gray-500">
                128 đánh giá
              </span>
            </p>

            <p className="mt-6 text-[36px] font-bold text-[#27AE60]">
              {formatPrice(product.price)}
            </p>

            <ul className="mt-8 space-y-3 text-gray-700">
              <li>• CPU: {product.cpu}</li>
              <li>• GPU: {product.gpu}</li>
              <li>• RAM: {product.ram}</li>
              <li>• SSD: {product.ssd}</li>
              <li>• Màn hình: {product.screen}</li>
            </ul>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => alert('Chuyển sang thanh toán')}
                className="h-[52px] rounded-xl bg-[#3783EC] px-12 font-semibold text-white hover:bg-[#206ed6]"
              >
                Mua ngay
              </button>

              <button
                type="button"
                onClick={() => alert('Đã thêm vào giỏ hàng')}
                className="h-[52px] rounded-xl bg-[#F5F5F5] px-12 font-semibold text-black hover:bg-[#e8e8e8]"
              >
                Thêm giỏ hàng
              </button>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-[24px] font-bold">Mô tả sản phẩm</h2>
            <p className="mt-6 leading-8 text-gray-600">
              {product.description}
            </p>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-[24px] font-bold">Cấu hình chi tiết</h2>

            <div className="mt-6 space-y-4 text-gray-700">
              <p>CPU: {product.cpu}</p>
              <p>GPU: {product.gpu}</p>
              <p>RAM: {product.ram}</p>
              <p>SSD: {product.ssd}</p>
              <p>Màn hình: {product.screen}</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}