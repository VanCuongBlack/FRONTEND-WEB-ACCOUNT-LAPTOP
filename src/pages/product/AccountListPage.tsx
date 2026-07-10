import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import ProductFilter from '@/components/product/ProductFilter'
import { getProducts } from '@/services/product.service'

type AccountTab = '' | 'ChatGPT' | 'Canva' | 'Netflix' | 'Adobe' | 'Spotify'

function normalizeText(value: unknown) {
  return String(value ?? '').toLowerCase().trim()
}

function getAccountText(item: any) {
  return [
    item.name,
    item.description,
    item.platform,
    item.category,
    item.digital?.platform,
    item.digital?.category,
    item.digitalData?.platform,
    item.digitalData?.category,
  ]
    .map(normalizeText)
    .join(' ')
}

function getAccountPlatformLabel(item: any) {
  return (
    item.platform ||
    item.digital?.platform ||
    item.digitalData?.platform ||
    item.category ||
    item.digital?.category ||
    item.digitalData?.category ||
    'Account'
  )
}

function getAccountDuration(item: any) {
  return (
    item.duration_months ??
    item.digital?.duration_months ??
    item.digitalData?.duration_months ??
    item.duration ??
    'N/A'
  )
}

function matchesPlatform(item: any, platform: string) {
  const text = getAccountText(item)
  const value = normalizeText(platform)
  const aliases: Record<string, string[]> = {
    openai: ['openai', 'chatgpt', 'gpt'],
    chatgpt: ['openai', 'chatgpt', 'gpt'],
    canva: ['canva'],
    netflix: ['netflix'],
    steam: ['steam'],
    adobe: ['adobe'],
    spotify: ['spotify'],
  }

  return (aliases[value] ?? [value]).some((alias) => text.includes(alias))
}

export default function AccountListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<AccountTab>('ChatGPT')
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ product_type: 'digital' })
        setProducts(response.data?.data?.products || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

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

  const handleTabClick = (tab: AccountTab) => {
    setActiveTab(tab)
    setSearch(tab)
  }

  const tabClass = (tab: AccountTab) =>
    activeTab === tab
      ? 'bg-gradient-to-r from-[#36b8f2] via-[#2668ff] to-[#8b3df5] text-white border-none'
      : 'border border-[#1e3a62]/70 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const keyword = search.toLowerCase().trim()
      const accountText = getAccountText(item)

      const matchSearch =
        !keyword ||
        accountText.includes(keyword)

      const matchPlatform =
        selectedPlatforms.length === 0 ||
        selectedPlatforms.some((platform) => matchesPlatform(item, platform))

      const matchPrice =
        selectedPrices.length === 0 ||
        selectedPrices.some((price) => {
          if (price === 'low') return item.base_price < 150000
          if (price === 'middle') return item.base_price >= 150000 && item.base_price <= 250000
          if (price === 'high') return item.base_price > 250000
          return true
        })

      return matchSearch && matchPlatform && matchPrice
    })
  }, [products, search, selectedPrices, selectedPlatforms])

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

          {(['ChatGPT', 'Canva', 'Netflix', 'Adobe', 'Spotify'] as AccountTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`rounded-full px-5 py-3 font-bold transition-all duration-200 ${tabClass(tab)}`}
            >
              {tab}
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
            Account số
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-white leading-tight">
            {activeTab || 'Tài khoản số'}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/60">
            Tài khoản số phục vụ học tập, giải trí và làm việc. Giao nhanh sau thanh toán.
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
              placeholder="Tìm kiếm account..."
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
            type="account"
            selectedPrices={selectedPrices}
            selectedCategories={selectedPlatforms}
            onTogglePrice={(value) =>
              toggleValue(value, selectedPrices, setSelectedPrices)
            }
            onToggleCategory={(value) =>
              toggleValue(value, selectedPlatforms, setSelectedPlatforms)
            }
            onClearFilter={() => {
              setSearch('')
              setActiveTab('ChatGPT')
              setSelectedPrices([])
              setSelectedPlatforms([])
            }}
          />

          <section className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-white/50">
                {loading ? 'Đang tải...' : `Tìm thấy ${filteredProducts.length} account`}
              </p>
            </div>

            {loading ? (
              <div className="rounded-[26px] bg-[#0d1d34]/88 backdrop-blur-md border border-[#1e3a62]/70 p-8 text-center text-white/40 shadow-sm">
                Đang tải dữ liệu...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((item) => (
                    <ProductCard
                      key={item._id}
                      id={item._id}
                      name={item.name}
                      price={item.base_price}
                      subtitle={`${getAccountPlatformLabel(item)} • ${getAccountDuration(item)} tháng`}
                      to="/accounts"
                    />
                  ))
                ) : (
                  <div className="col-span-full rounded-[26px] bg-[#0d1d34]/88 backdrop-blur-md border border-[#1e3a62]/70 p-8 text-center text-white/40 shadow-sm">
                    Không tìm thấy account phù hợp.
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
