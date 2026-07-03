import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, Search } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import ProductFilter from '@/components/product/ProductFilter'
import { useProduct } from '@/hooks/useProduct'

type LaptopTab = '' | 'Gaming' | 'Văn phòng' | 'MacBook'

export default function LaptopListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { laptops, isLoading, getLaptops } = useProduct()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<LaptopTab>('Gaming')
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  useEffect(() => {
    getLaptops({ is_active: true })
  }, [])

  useEffect(() => {
    const query = searchParams.get('search') ?? ''
    if (query) {
      setSearch(query)
      setActiveTab('')
    }
  }, [searchParams])

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
      ? 'border-[#3d63ff] bg-[#0f0a2c] text-white'
      : 'border-transparent bg-[#4a4568] text-[#f0edf9] hover:bg-[#5a5378]'

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
      ? 'Khám phá các dòng laptop gaming, PC chiến game và cấu hình hiệu năng cao.'
      : activeTab === 'Văn phòng'
        ? 'Laptop văn phòng mỏng nhẹ, ổn định, phù hợp học tập và làm việc.'
        : activeTab === 'MacBook'
          ? 'Các dòng MacBook phù hợp học tập, thiết kế và làm việc chuyên nghiệp.'
          : 'Tìm kiếm laptop và PC cũ chất lượng, giá tốt.'

  const filteredProducts = useMemo(() => {
    return laptops
      .filter((item) => {
        const keyword = search.toLowerCase().trim()

        const matchSearch =
          !keyword ||
          item.name.toLowerCase().includes(keyword) ||
          (item.description || '').toLowerCase().includes(keyword) ||
          (item.brand || '').toLowerCase().includes(keyword)

        const matchPrice =
          selectedPrices.length === 0 ||
          selectedPrices.some((price) => {
            if (price === 'low') return item.base_price < 15000000
            if (price === 'middle') return item.base_price >= 15000000 && item.base_price <= 25000000
            if (price === 'high') return item.base_price > 25000000
            return true
          })

        return matchSearch && matchPrice
      })
      .filter((item) => {
        if (selectedBrands.length === 0) return true
        return selectedBrands.some((brand) =>
          (item.brand || '').toLowerCase().includes(brand.toLowerCase())
        )
      })
  }, [search, selectedPrices, selectedBrands, laptops])

  return (
    <div className="flex min-h-screen flex-col bg-[#09051f] font-sans text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1840px] flex-1 px-4 py-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm text-[#b9b4d7] hover:text-white"
        >
          <ChevronLeft size={20} />
          Quay lại
        </button>

        <nav className="flex flex-wrap items-center gap-3 rounded-[22px] bg-[#211b42] px-4 py-4 text-sm shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-full bg-[#4a4568] px-5 py-3 font-bold text-[#f0edf9] hover:bg-[#5a5378]"
          >
            Trang chủ
          </button>

          {(['Gaming', 'Văn phòng', 'MacBook'] as LaptopTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`rounded-full border px-5 py-3 font-bold transition-colors ${tabClass(tab)}`}
            >
              {tab === 'Gaming' ? 'Laptop Gaming' : tab}
            </button>
          ))}

          <button
            type="button"
            onClick={() => toast.info('Hotline hỗ trợ: 1900 xxxx')}
            className="rounded-full bg-[#4a4568] px-5 py-3 font-bold text-[#79a7ff] hover:bg-[#5a5378]"
          >
            Hotline: 1900 xxxx
          </button>
        </nav>

        <section className="mt-6">
          <p className="text-xs font-black uppercase tracking-wide text-[#79a7ff]">
            PC / Laptop
          </p>
          <h1 className="mt-2 text-[30px] font-black text-white">
            {pageTitle}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#b9b4d7]">
            {pageDescription}
          </p>
        </section>

        <div className="mt-6 rounded-[22px] bg-[#211b42] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
          <div className="flex h-[52px] items-center gap-3 rounded-2xl border border-[#3d63ff]/30 bg-[#34305a] px-4 focus-within:border-[#79a7ff]">
            <Search size={18} className="text-[#b9b4d7]" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setActiveTab('')
              }}
              placeholder="Tìm kiếm laptop, PC, MacBook..."
              className="h-full flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#8d86b6]"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setActiveTab('')
                }}
                className="text-xs font-bold text-[#b9b4d7] hover:text-white"
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
              <p className="text-sm text-[#b9b4d7]">
                {isLoading ? 'Đang tải sản phẩm...' : `Tìm thấy ${filteredProducts.length} sản phẩm`}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <ProductCard
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    price={item.sale_price ?? item.base_price}
                    subtitle={item.description || item.brand || 'Laptop / PC cũ'}
                    image={item.thumbnail || item.images?.[0]}
                    productType="physical"
                    to="/laptops"
                  />
                ))
              ) : (
                <div className="rounded-[22px] bg-[#211b42] p-8 text-center text-[#b9b4d7]">
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
