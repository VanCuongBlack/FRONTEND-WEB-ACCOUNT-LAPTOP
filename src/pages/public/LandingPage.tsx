import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
  { label: 'Bán chạy', href: '/best-seller' },
  { label: 'Laptop / PC', href: '/laptops' },
  { label: 'Account số', href: '/accounts' },
]

export default function LandingPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') ?? ''
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

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
    <div className="min-h-screen bg-[#09051f]">
      <Header />
      <HeroBanner banners={banners} />
      <CategoryBar />

      <section className="w-full px-4 pb-5 sm:px-6">
        <div className="flex gap-3 overflow-x-auto py-2">
          {marketplaceTabs.map((tab, index) => (
            <Link
              key={tab.label}
              to={tab.href}
              className={`h-12 shrink-0 rounded-[22px] px-7 text-base font-black transition-colors ${
                index === 0
                  ? 'border border-[#3f75ff] bg-transparent text-white'
                  : 'bg-[#44405f] text-white hover:bg-[#565176]'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="flex w-full flex-col gap-5 sm:gap-6">
        {searchQuery ? (
          <FeaturedProducts
            products={searchResults}
            loading={searchLoading}
            title={`Kết quả tìm kiếm cho: "${searchQuery}"`}
            viewMoreUrl=""
            accent="hot"
          />
        ) : (
          <>
            <FeaturedProducts
              products={filteredProducts}
              loading={productsLoading}
              title="Sản phẩm bán chạy"
              viewMoreUrl="/best-seller"
              accent="hot"
              showEyebrow={false}
            />

            <FeaturedProducts
              products={filteredProducts.filter((product) => product.category === 'account').slice(0, 4)}
              loading={productsLoading}
              title="Tài khoản Account riêng"
              viewMoreUrl="/accounts"
              accent="account"
            />

            <FeaturedProducts
              products={filteredProducts.filter((product) => product.category === 'laptop').slice(0, 4)}
              loading={productsLoading}
              title="Laptop / PC riêng"
              viewMoreUrl="/laptops"
              accent="laptop"
            />
          </>
        )}
      </div>

      <PromoBanners />
      <NewsletterCTA />
      <Footer />
    </div>
  )
}
