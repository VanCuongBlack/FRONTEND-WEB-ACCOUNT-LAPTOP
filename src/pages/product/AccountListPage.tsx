import { useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import ProductFilter from '@/components/product/ProductFilter'
import { accountProducts } from '@/services/product.service'

type AccountTab = '' | 'ChatGPT' | 'Canva' | 'Netflix'

export default function AccountListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<AccountTab>('ChatGPT')
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const toggleValue = (
    value: string,
    list: string[],
    setter: (value: string[]) => void
  ) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value])
  }

  const handleTabClick = (tab: AccountTab) => {
    setActiveTab(tab)
    setSearch(tab)
  }

  const tabClass = (tab: AccountTab) =>
    activeTab === tab ? 'font-bold text-black' : 'text-gray-600 hover:text-black'

  const filteredProducts = useMemo(() => {
    return accountProducts.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchPlatform =
        selectedPlatforms.length === 0 || selectedPlatforms.includes(item.platform)

      const matchPrice =
        selectedPrices.length === 0 ||
        selectedPrices.some((price) => {
          if (price === 'low') return item.price < 150000
          if (price === 'middle') return item.price >= 150000 && item.price <= 250000
          if (price === 'high') return item.price > 250000
          return true
        })

      return matchSearch && matchPlatform && matchPrice
    })
  }, [search, selectedPrices, selectedPlatforms])

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] font-['Inter',sans-serif] text-black">
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
          <button onClick={() => navigate('/')}>Trang chủ</button>

          <button onClick={() => handleTabClick('ChatGPT')} className={tabClass('ChatGPT')}>
            ChatGPT
          </button>

          <button onClick={() => handleTabClick('Canva')} className={tabClass('Canva')}>
            Canva
          </button>

          <button onClick={() => handleTabClick('Netflix')} className={tabClass('Netflix')}>
            Netflix
          </button>

          <button onClick={() => alert('Hotline: 1900 xxxx')} className="text-[#00A651]">
            ☎ Hotline: 1900 xxxx
          </button>
        </nav>

        <section className="mt-6">
          <h1 className="text-[30px] font-bold text-black">
            {activeTab || 'Account Số'}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Tài khoản số phục vụ học tập, giải trí và làm việc.
          </p>
        </section>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <ProductFilter
            type="account"
            selectedPrices={selectedPrices}
            selectedCategories={selectedPlatforms}
            onTogglePrice={(value) => toggleValue(value, selectedPrices, setSelectedPrices)}
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
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}