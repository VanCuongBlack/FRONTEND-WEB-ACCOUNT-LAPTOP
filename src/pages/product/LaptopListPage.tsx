import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, Search } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import ProductFilter from '@/components/product/ProductFilter'
import { useProduct } from '@/hooks/useProduct'

type LaptopTab = '' | 'Gaming' | 'Văn phòng' | 'MacBook'
type BrandReadableProduct = {
  name?: string
  brand?: string
  physical?: {
    brand?: string
  }
}

function getBrandSearchText(product: BrandReadableProduct) {
  return `${product.brand ?? ''} ${product.physical?.brand ?? ''} ${product.name ?? ''}`.toLowerCase()
}

function matchesBrand(product: BrandReadableProduct, brand: string) {
  const text = getBrandSearchText(product)
  const value = brand.toLowerCase()

  if (value === 'apple') {
    return text.includes('apple') || text.includes('macbook')
  }

  return text.includes(value)
}

export default function LaptopListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { laptops, products, isLoading, getLaptops, searchProducts } = useProduct()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<LaptopTab>('Gaming')
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  useEffect(() => {
    const query = searchParams.get('search') ?? ''
    setSearch(query)
    if (query) {
      setActiveTab('')
    }
  }, [searchParams])

  useEffect(() => {
    if (search) {
      const keyword = search.toLowerCase().trim()
      if (keyword === 'laptop' || keyword === 'laptops' || keyword === 'pc') {
        getLaptops({ is_active: true, limit: 100 })
      } else {
        searchProducts(search)
      }
    } else {
      getLaptops({ is_active: true, limit: 100 })
    }
  }, [search])

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
      ? 'bg-gradient-to-r from-[#00c6ff] to-[#8a2be2] text-white border-none'
      : 'border border-white/5 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'

  const pageTitle = search && activeTab === ''
    ? `Kết quả tìm kiếm: "${search}"`
    : activeTab === 'Gaming'
      ? 'Laptop Gaming'
      : activeTab === 'Văn phòng'
        ? 'Laptop Văn Phòng'
        : activeTab === 'MacBook'
          ? 'MacBook'
          : 'Laptop / PC cũ'

  const pageDescription = search && activeTab === ''
    ? `Tìm kiếm sản phẩm phù hợp với từ khoá "${search}".`
    : activeTab === 'Gaming'
      ? 'Khám phá các dòng laptop gaming, PC chiến game và cấu hình hiệu năng cao.'
      : activeTab === 'Văn phòng'
        ? 'Laptop văn phòng mỏng nhẹ, ổn định, phù hợp học tập và làm việc.'
        : activeTab === 'MacBook'
          ? 'Các dòng MacBook phù hợp học tập, thiết kế và làm việc chuyên nghiệp.'
          : 'Tìm kiếm laptop và PC cũ chất lượng, giá tốt.'

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    const isGenericKeyword = keyword === 'laptop' || keyword === 'laptops' || keyword === 'pc'
    const listToFilter = (search && activeTab === '' && !isGenericKeyword) ? products : laptops

    return listToFilter
      .filter((item) => {
        const matchSearch =
          !keyword ||
          isGenericKeyword ||
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
        return selectedBrands.some((brand) => matchesBrand(item, brand))
      })
  }, [search, activeTab, selectedPrices, selectedBrands, laptops, products])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0b0726] via-[#150e3d] to-[#040214] font-sans text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1840px] flex-1 px-4 py-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          Quay lại
        </button>

        <nav className="flex flex-wrap items-center gap-3 rounded-[26px] bg-[#1a1435]/60 backdrop-blur-md border border-white/5 px-4 py-4 text-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-full border border-white/5 bg-white/5 px-5 py-3 font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            Trang chủ
          </button>

          {(['Gaming', 'Văn phòng', 'MacBook'] as LaptopTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`rounded-full px-5 py-3 font-bold transition-all duration-200 ${tabClass(tab)}`}
            >
              {tab === 'Gaming' ? 'Laptop Gaming' : tab}
            </button>
          ))}

          <button
            type="button"
            onClick={() => { window.location.href = 'tel:19001234' }}
            className="rounded-full bg-[#00c6ff]/10 border border-[#00c6ff]/20 px-5 py-3 font-bold text-[#00c6ff] hover:bg-[#00c6ff]/25 transition-all duration-200"
          >
            Hotline: 1900 1234
          </button>
        </nav>

        <section className="mt-8">
          <span className="text-[#00c6ff] bg-[#00c6ff]/10 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            PC / Laptop
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-white leading-tight">
            {pageTitle}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/60">
            {pageDescription}
          </p>
        </section>

        <div className="mt-6 rounded-[26px] bg-[#1a1435]/60 backdrop-blur-md border border-white/5 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex h-[52px] items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 focus-within:border-[#00c6ff]/50 transition-all duration-250">
            <Search size={18} className="text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setActiveTab('')
              }}
              placeholder="Tìm kiếm laptop, PC, MacBook..."
              className="h-full flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setActiveTab('')
                }}
                className="text-xs font-bold text-[#00c6ff] hover:text-[#00d6ff]"
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
              <p className="text-sm text-white/50">
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
                    productType={item.product_type}
                    to={item.product_type === 'physical' ? '/laptops' : '/accounts'}
                  />
                ))
              ) : (
                <div className="col-span-full rounded-[26px] bg-[#1a1435]/60 backdrop-blur-md border border-white/5 p-8 text-center text-white/40 shadow-sm">
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
