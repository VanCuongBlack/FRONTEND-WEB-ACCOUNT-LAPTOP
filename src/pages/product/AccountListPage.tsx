import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '@/components/product/ProductCard'
import ProductFilter from '@/components/product/ProductFilter'
import { accountProducts } from '@/services/product.service'

export default function AccountListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [priceFilter, setPriceFilter] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')

  const filteredProducts = useMemo(() => {
    return accountProducts.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchPlatform = platformFilter ? item.platform === platformFilter : true

      const matchPrice =
        priceFilter === 'low'
          ? item.price < 150000
          : priceFilter === 'middle'
            ? item.price >= 150000 && item.price <= 250000
            : priceFilter === 'high'
              ? item.price > 250000
              : true

      return matchSearch && matchPlatform && matchPrice
    })
  }, [search, priceFilter, platformFilter])

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

      <section className="mt-8">
        <h1 className="text-[28px] font-bold text-black">Account Số</h1>
        <p className="mt-2 text-gray-500">Tài khoản số phục vụ học tập, giải trí và làm việc</p>
      </section>

      <main className="mt-8 flex flex-col gap-8 lg:flex-row">
        <ProductFilter
          type="account"
          onPriceFilter={setPriceFilter}
          onCategoryFilter={setPlatformFilter}
          onClearFilter={() => {
            setSearch('')
            setPriceFilter('')
            setPlatformFilter('')
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
                subtitle={`${item.platform} • ${item.duration}`}
                to="/accounts"
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