import { useMemo, useState } from 'react'
import { ChevronLeft, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import ProductFilter from '@/components/product/ProductFilter'
import { laptopProducts } from '@/services/product.service'

type LaptopTab = '' | 'Gaming' | 'Văn phòng' | 'MacBook'

export default function LaptopListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<LaptopTab>('Gaming')
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  const toggleValue = (
    value: string,
    list: string[],
    setter: (value: string[]) => void
  ) => {
    setter(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    )
  }

  const handleTabClick = (tab: LaptopTab) => {
    setActiveTab(tab)
    setSearch(tab === 'Gaming' ? '' : tab)
  }

  const tabClass = (tab: LaptopTab) =>
    activeTab === tab
      ? 'font-bold text-black'
      : 'text-gray-600 hover:text-black'

  const pageTitle =
    activeTab === 'Gaming'
      ? 'Laptop Gaming'
      : activeTab === 'Văn phòng'
        ? 'Laptop Văn Phòng'
        : activeTab === 'MacBook'
          ? 'MacBook'
          : 'Laptop / PC cũ'

  const pageDescription =
    activeTab === 'Gaming'
      ? 'Khám phá các dòng laptop gaming hiệu năng cao.'
      : activeTab === 'Văn phòng'
        ? 'Laptop văn phòng mỏng nhẹ, ổn định, phù hợp học tập và làm việc.'
        : activeTab === 'MacBook'
          ? 'Các dòng MacBook phù hợp học tập, thiết kế và làm việc chuyên nghiệp.'
          : 'Tìm kiếm laptop và PC cũ chất lượng, giá tốt.'

  const filteredProducts = useMemo(() => {
    return laptopProducts.filter((item) => {
      const keyword = search.toLowerCase().trim()

      const matchSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.brand.toLowerCase().includes(keyword) ||
        item.cpu.toLowerCase().includes(keyword) ||
        item.gpu.toLowerCase().includes(keyword)

      const matchBrand =
        selectedBrands.length === 0 || selectedBrands.includes(item.brand)

      const matchPrice =
        selectedPrices.length === 0 ||
        selectedPrices.some((price) => {
          if (price === 'low') return item.price < 15000000
          if (price === 'middle') return item.price >= 15000000 && item.price <= 25000000
          if (price === 'high') return item.price > 25000000
          return true
        })

      return matchSearch && matchBrand && matchPrice
    })
  }, [search, selectedPrices, selectedBrands])

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] font-sans text-black">
      <Header />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm text-gray-500 hover:text-black"
        >
          <ChevronLeft size={20} />
          Quay lại
        </button>

        <nav className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-8 py-4 text-sm shadow-sm">
          <button type="button" onClick={() => navigate('/')}>
            Trang chủ
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('Gaming')}
            className={tabClass('Gaming')}
          >
            Laptop Gaming
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('Văn phòng')}
            className={tabClass('Văn phòng')}
          >
            Laptop Văn Phòng
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('MacBook')}
            className={tabClass('MacBook')}
          >
            MacBook
          </button>

          <button
            type="button"
            onClick={() => alert('Hotline: 1900 xxxx')}
            className="text-[#00A651]"
          >
            ☎ Hotline: 1900 xxxx
          </button>
        </nav>

        <section className="mt-6">
          <h1 className="text-[30px] font-bold text-black">
            {pageTitle}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {pageDescription}
          </p>
        </section>

        <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex h-[48px] items-center gap-3 rounded-xl border border-gray-300 px-4 focus-within:border-[#3783EC]">
            <Search size={18} className="text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setActiveTab('')
              }}
              placeholder="Tìm kiếm laptop, PC, MacBook..."
              className="h-full flex-1 bg-transparent text-sm outline-none"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setActiveTab('')
                }}
                className="text-xs font-medium text-gray-400 hover:text-red-500"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <ProductFilter
            type="laptop"
            selectedPrices={selectedPrices}
            selectedCategories={selectedBrands}
            onTogglePrice={(value) =>
              toggleValue(value, selectedPrices, setSelectedPrices)
            }
            onToggleCategory={(value) =>
              toggleValue(value, selectedBrands, setSelectedBrands)
            }
            onClearFilter={() => {
              setSearch('')
              setActiveTab('Gaming')
              setSelectedPrices([])
              setSelectedBrands([])
            }}
          />

          <section className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Tìm thấy {filteredProducts.length} sản phẩm
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
                  Không tìm thấy sản phẩm phù hợp.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}