import { useNavigate, useParams } from 'react-router-dom'
import { accountProducts, formatPrice } from '@/services/product.service'

export default function AccountDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = accountProducts.find((item) => item.id === id) || accountProducts[0]

  return (
    <div className="min-h-screen bg-[#f3f3f3] px-4 py-8 sm:px-10">
      <header className="rounded-[20px] bg-white px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <button onClick={() => navigate('/')} className="text-[24px] font-bold">
            LOGO
          </button>

          <input
            placeholder="🔍 Tìm kiếm account..."
            className="h-[44px] w-full max-w-[450px] rounded-[12px] bg-[#f0f0f0] px-5 text-sm outline-none"
          />

          <div className="flex gap-6 text-sm">
            <button onClick={() => alert('Chưa có thông báo')}>🔔 Thông báo</button>
            <button onClick={() => navigate('/cart')}>🛒 Giỏ hàng</button>
            <button onClick={() => navigate('/login')}>Đăng nhập</button>
          </div>
        </div>
      </header>

      <p className="mt-8 text-sm text-gray-500">Trang chủ / Account số / {product.name}</p>

      <main className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="rounded-[24px] bg-white p-6">
          <div className="flex h-[280px] items-center justify-center rounded-[20px] bg-[#d9d9d9] text-[28px] font-bold text-gray-500">
            HÌNH ẢNH ACCOUNT
          </div>
        </section>

        <section className="rounded-[24px] bg-white p-8">
          <h1 className="text-[30px] font-bold text-black">{product.name}</h1>

          <p className="mt-6 text-[36px] font-bold text-green-600">{formatPrice(product.price)}</p>

          <div className="mt-8 flex flex-col gap-4 text-gray-700">
            <p>• Nền tảng: {product.platform}</p>
            <p>• Thời hạn: {product.duration}</p>
            <p>• Thiết bị: {product.devices}</p>
            <p>• Giao tài khoản sau khi thanh toán</p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => alert('Chuyển sang thanh toán')}
              className="h-[52px] rounded-[12px] bg-black px-12 text-white hover:opacity-90"
            >
              Mua ngay
            </button>

            <button
              onClick={() => alert('Đã thêm vào giỏ hàng')}
              className="h-[52px] rounded-[12px] bg-[#f5f5f5] px-12 text-black hover:bg-[#ebebeb]"
            >
              Thêm giỏ hàng
            </button>
          </div>
        </section>

        <section className="rounded-[24px] bg-white p-8 lg:col-span-2">
          <h2 className="text-[24px] font-bold">Mô tả account</h2>
          <p className="mt-6 leading-8 text-gray-600">{product.description}</p>
        </section>
      </main>
    </div>
  )
}