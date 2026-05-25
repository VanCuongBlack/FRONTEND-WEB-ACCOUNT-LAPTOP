import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '@/components/product/ProductCard'
import ProductFilter from '@/components/product/ProductFilter'
import { laptopProducts } from '@/services/product.service'

export default function LaptopListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [priceFilter, setPriceFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')

  const filteredProducts = useMemo(() => {
    return laptopProducts.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchBrand = brandFilter ? item.brand === brandFilter : true

      const matchPrice =
        priceFilter === 'low'
          ? item.price < 15000000
          : priceFilter === 'middle'
            ? item.price >= 15000000 && item.price <= 25000000
            : priceFilter === 'high'
              ? item.price > 25000000
              : true

      return matchSearch && matchBrand && matchPrice
    })
  }, [search, priceFilter, brandFilter])

  return (
    <div className="min-h-screen bg-[#f3f3f3] px-4 py-8 sm:px-8">
      <header className="rounded-[20px] bg-white px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <button onClick={() => navigate('/')} className="rounded-[10px] bg-[#e5e5e5] px-8 py-3 font-bold">
            LOGO
          </button>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Tìm kiếm laptop..."
            className="h-[44px] w-full max-w-[450px] rounded-[12px] bg-[#f0f0f0] px-5 text-sm outline-none"
          />

          <div className="flex gap-6 text-sm">
            <button onClick={() => alert('Chưa có thông báo')}>🔔 Thông báo</button>
            <button onClick={() => navigate('/cart')}>🛒 Giỏ hàng</button>
            <button onClick={() => navigate('/login')}>Đăng nhập</button>
          </div>
        </div>
      </header>

      <nav className="mt-5 flex flex-wrap justify-between gap-4 rounded-[16px] bg-white px-8 py-4 text-sm">
        <button onClick={() => navigate('/')}>Trang chủ</button>
        <button className="font-bold" onClick={() => setBrandFilter('')}>Laptop Gaming</button>
        <button onClick={() => setBrandFilter('')}>Laptop Văn Phòng</button>
        <button onClick={() => setBrandFilter('')}>Laptop Sinh Viên</button>
        <button onClick={() => setBrandFilter('')}>MacBook</button>
        <button onClick={() => alert('Hotline: 1900 xxxx')} className="text-green-600">
          ☎ Hotline: 1900 xxxx
        </button>
      </nav>

      <section className="mt-6">
        <h1 className="text-[28px] font-bold text-black">Laptop Gaming</h1>
        <p className="mt-2 text-gray-500">Khám phá các dòng laptop gaming hiệu năng cao</p>
      </section>

      <main className="mt-8 flex flex-col gap-8 lg:flex-row">
        <ProductFilter
          type="laptop"
          onPriceFilter={setPriceFilter}
          onCategoryFilter={setBrandFilter}
          onClearFilter={() => {
            setSearch('')
            setPriceFilter('')
            setBrandFilter('')
          }}
        />

        <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                subtitle={`${item.gpu} • ${item.cpu}`}
                to="/laptops"
              />
            ))
          ) : (
            <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
          )}
        </div>
      </main>
    </div>
  )
}