import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getLandingData } from '@/services/landing.service'
import type { Banner, Product } from '@/services/landing.service'
import { getProducts } from '@/services/product.service'
import Header from '@/components/layout/Header'
import HeroBanner from '@/components/landing/HeroBanner'
import CategoryBar from '@/components/landing/CategoryBar'
import FeaturedProducts from '@/components/landing/FeaturedProducts'
import PromoBanners from '@/components/landing/PromoBanners'
import NewsletterCTA from '@/components/landing/NewsletterCTA'
import Footer from '@/components/layout/Footer'

const marketplaceTabs = [
  { id: 'all', label: 'Tất cả' },
  { id: 'laptop', label: 'Laptop / PC' },
  { id: 'account', label: 'Account số' },
] as const

export default function LandingPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') ?? ''
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'laptop' | 'account'>('all')

  useEffect(() => {
    getLandingData()
      .then((data) => {
        setBanners(data.banners)
        setProducts(data.products)
      })
      .finally(() => setProductsLoading(false))
  }, [])

  // Live database search for all products matching search query
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([])
      return
    }

    const keyword = searchQuery.toLowerCase().trim()
    const params: any = { is_active: true, limit: 100 }
    
    if (keyword === 'laptop' || keyword === 'laptops' || keyword === 'pc') {
      params.product_type = 'physical'
    } else if (keyword === 'account' || keyword === 'accounts' || keyword === 'tài khoản' || keyword === 'tk') {
      params.product_type = 'digital'
    } else {
      params.search = searchQuery
    }

    setSearchLoading(true)
    getProducts(params)
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          const list = res.data.data.products || []
          setSearchResults(list.map((p: any) => ({
            id: p._id,
            name: p.name,
            description: p.description || '',
            price: p.sale_price || p.base_price,
            originalPrice: p.base_price,
            imageUrl: p.thumbnail || p.images?.[0] || '',
            category: p.product_type === 'physical' ? 'laptop' : 'account',
            badge: p.sale_price && p.sale_price < p.base_price ? 'SALE' : undefined,
            isActive: p.is_active !== false,
            stock: p.stock_quantity || 0
          })))
        }
      })
      .catch((err) => console.error('Failed to search database:', err))
      .finally(() => setSearchLoading(false))
  }, [searchQuery])

  // Live filter products as the user types
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true
    
    const keyword = searchQuery.toLowerCase().trim()
    
    // If user searches "laptop" or "pc", match all laptop products
    if (keyword === 'laptop' || keyword === 'laptops' || keyword === 'pc') {
      return product.category === 'laptop' || product.product_type === 'physical'
    }
    
    // If user searches "account" or "tài khoản", match all account products
    if (keyword === 'account' || keyword === 'accounts' || keyword === 'tài khoản' || keyword === 'tk') {
      return product.category === 'account' || product.product_type === 'digital'
    }

    return (
      product.name.toLowerCase().includes(keyword) ||
      (product.description || '').toLowerCase().includes(keyword) ||
      (product.brand || '').toLowerCase().includes(keyword)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0726] via-[#150e3d] to-[#040214] relative overflow-hidden text-white">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[45%] h-[45%] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <HeroBanner banners={banners} />
        <CategoryBar />
        
        <div className="flex w-full flex-col gap-8 relative z-10">
          {searchQuery ? (
            <FeaturedProducts
              products={searchResults}
              loading={searchLoading}
              title={`Kết quả tìm kiếm cho: "${searchQuery}"`}
              viewMoreUrl=""
              accent="hot"
              showEyebrow={false}
            />
          ) : activeTab === 'all' ? (
            <>
              <FeaturedProducts
                products={filteredProducts}
                loading={productsLoading}
                title="Sản phẩm bán chạy"
                viewMoreUrl="/best-seller"
                accent="hot"
                showEyebrow={false}
                headerRight={
                  <div className="flex gap-2 overflow-x-auto">
                    {marketplaceTabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`h-8 shrink-0 rounded-full px-4 text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-[#00d6ff] text-[#040214] shadow-[0_4px_15px_rgba(0,214,255,0.3)]'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/5 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                }
              />

              <FeaturedProducts
                products={filteredProducts.filter((product) => product.category === 'account').slice(0, 4)}
                loading={productsLoading}
                title="Tài khoản Premium"
                viewMoreUrl="/accounts"
                accent="account"
              />

              <FeaturedProducts
                products={filteredProducts.filter((product) => product.category === 'laptop').slice(0, 4)}
                loading={productsLoading}
                title="Laptop & PC"
                viewMoreUrl="/laptops"
                accent="laptop"
              />
            </>
          ) : activeTab === 'laptop' ? (
            <FeaturedProducts
              products={filteredProducts.filter((product) => product.category === 'laptop')}
              loading={productsLoading}
              title="Danh sách Laptop / PC"
              viewMoreUrl="/laptops"
              accent="laptop"
              showEyebrow={false}
              headerRight={
                <div className="flex gap-2 overflow-x-auto">
                  {marketplaceTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`h-8 shrink-0 rounded-full px-4 text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-[#00d6ff] text-[#040214] shadow-[0_4px_15px_rgba(0,214,255,0.3)]'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/5 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              }
            />
          ) : (
            <FeaturedProducts
              products={filteredProducts.filter((product) => product.category === 'account')}
              loading={productsLoading}
              title="Danh sách Tài khoản Account"
              viewMoreUrl="/accounts"
              accent="account"
              showEyebrow={false}
              headerRight={
                <div className="flex gap-2 overflow-x-auto">
                  {marketplaceTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`h-8 shrink-0 rounded-full px-4 text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-[#00d6ff] text-[#040214] shadow-[0_4px_15px_rgba(0,214,255,0.3)]'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/5 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              }
            />
          )}
        </div>

        <PromoBanners />
        <NewsletterCTA />
        <Footer />
      </div>
    </div>
  )
}