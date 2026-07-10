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
      ? 'bg-gradient-to-r from-[#36b8f2] via-[#2668ff] to-[#8b3df5] text-white border-none'
      : 'border border-[#1e3a62]/70 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'

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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#071120] via-[#0a1628] to-[#050914] font-sans text-white">
      <Header />

      <main className="w-full max-w-none flex-1 px-3 py-6 sm:px-5 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          Quay lại
        </button>

        <nav className="flex flex-wrap items-center gap-3 rounded-[26px] bg-[#0d1d34]/88 backdrop-blur-md border border-[#1e3a62]/70 px-4 py-4 text-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-full border border-[#1e3a62]/70 bg-white/5 px-5 py-3 font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
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
            className="rounded-full bg-[#123b70]/65 border border-[#1e6fb7]/60 px-5 py-3 font-bold text-[#39bdf8] hover:bg-[#143459] transition-all duration-200"
          >
            Hotline: 1900 1234
          </button>
        </nav>

        <section className="mt-8">
          <span className="text-[#39bdf8] bg-[#123b70]/65 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            PC / Laptop
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-white leading-tight">
            {pageTitle}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/60">
            {pageDescription}
          </p>
        </section>

        <div className="mt-6 rounded-[26px] bg-[#0d1d34]/88 backdrop-blur-md border border-[#1e3a62]/70 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex h-[52px] items-center gap-3 rounded-2xl border border-[#1e3a62]/70 bg-white/5 px-4 focus-within:border-[#00c6ff]/50 transition-all duration-250">
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
                className="text-xs font-bold text-[#39bdf8] hover:text-[#00d6ff]"
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
                <div className="col-span-full rounded-[26px] bg-[#0d1d34]/88 backdrop-blur-md border border-[#1e3a62]/70 p-8 text-center text-white/40 shadow-sm">
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
