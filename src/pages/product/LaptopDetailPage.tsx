import { useNavigate, useParams } from 'react-router-dom'
import { formatPrice, laptopProducts } from '@/services/product.service'

export default function LaptopDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const product =
    laptopProducts.find((item) => item.id === id) || laptopProducts[0]

  return (
    <div className="min-h-screen bg-[#f3f3f3] px-4 py-8 sm:px-10">
      {/* Header */}
      <header className="rounded-[20px] bg-white px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-[24px] font-bold"
          >
            LOGO
          </button>

          <input
            placeholder="🔍 Tìm kiếm sản phẩm..."
            className="h-[44px] w-full max-w-[450px] rounded-[12px] bg-[#f0f0f0] px-5 text-sm outline-none"
          />

          <div className="flex gap-6 text-sm">
            <button onClick={() => alert('Chưa có thông báo')}>
              🔔 Thông báo
            </button>

            <button onClick={() => navigate('/cart')}>
              🛒 Giỏ hàng
            </button>

            <button onClick={() => navigate('/login')}>
              Đăng nhập
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <p className="mt-8 text-sm text-gray-500">
        Trang chủ / Laptop Gaming / {product.name}
      </p>

      {/* Main */}
      <main className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <section className="rounded-[24px] bg-white p-6">
          <div className="flex h-[280px] items-center justify-center rounded-[20px] bg-[#d9d9d9] text-[28px] font-bold text-gray-500">
            HÌNH ẢNH SẢN PHẨM
          </div>

          <div className="mt-4 flex gap-4">
            {[1, 2, 3, 4].map((item) => (
              <button
                key={item}
                onClick={() => alert(`Đổi ảnh ${item}`)}
                className="h-[60px] w-[85px] rounded-[12px] bg-[#d9d9d9] transition-all hover:scale-105"
              />
            ))}
          </div>
        </section>

        {/* Info */}
        <section className="rounded-[24px] bg-white p-8">
          <h1 className="text-[30px] font-bold text-black">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-4">
            <span className="text-yellow-400">☆☆☆☆☆</span>
            <span className="text-sm text-gray-500">
              128 đánh giá
            </span>
          </div>

          <p className="mt-6 text-[36px] font-bold text-green-600">
            {formatPrice(product.price)}
          </p>

          <ul className="mt-8 flex flex-col gap-3 text-gray-700">
            <li>• {product.cpu}</li>
            <li>• {product.gpu}</li>
            <li>• RAM {product.ram}</li>
            <li>• SSD {product.ssd}</li>
          </ul>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => alert('Chuyển sang thanh toán')}
              className="h-[52px] rounded-[12px] bg-black px-12 text-white transition-all hover:opacity-90"
            >
              Mua ngay
            </button>

            <button
              onClick={() => alert('Đã thêm vào giỏ hàng')}
              className="h-[52px] rounded-[12px] bg-[#f5f5f5] px-12 text-black transition-all hover:bg-[#ebebeb]"
            >
              Thêm giỏ hàng
            </button>
          </div>
        </section>

        {/* Description */}
        <section className="rounded-[24px] bg-white p-8">
          <h2 className="text-[24px] font-bold">
            Mô tả sản phẩm
          </h2>

          <p className="mt-6 leading-8 text-gray-600">
            {product.description}
          </p>
        </section>

        {/* Specs */}
        <section className="rounded-[24px] bg-white p-8">
          <h2 className="text-[24px] font-bold">
            Cấu hình
          </h2>

          <div className="mt-6 flex flex-col gap-4 text-gray-700">
            <p>CPU: {product.cpu}</p>
            <p>GPU: {product.gpu}</p>
            <p>RAM: {product.ram}</p>
            <p>SSD: {product.ssd}</p>
            <p>Màn hình: {product.screen}</p>
          </div>
        </section>
      </main>
    </div>
  )
}