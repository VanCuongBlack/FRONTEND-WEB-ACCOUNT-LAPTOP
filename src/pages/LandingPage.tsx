import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getLandingData } from '@/services/landing.service'
import type { Banner, Product } from '@/services/landing.service'
import Header from '@/components/layout/Header'
import HeroBanner from '@/components/landing/HeroBanner'
import CategoryBar from '@/components/landing/CategoryBar'
import FeaturedProducts from '@/components/landing/FeaturedProducts'
import PromoBanners from '@/components/landing/PromoBanners'
import NewsletterCTA from '@/components/landing/NewsletterCTA'
import Footer from '@/components/layout/Footer'

export default function LandingPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    getLandingData()
      .then(data => {
        setBanners(data.banners)
        setProducts(data.products)
      })
      .finally(() => setProductsLoading(false))
  }, [])

  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase().trim()
    return (
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.tag && p.tag.toLowerCase().includes(q))
    )
  })

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Sticky Header from layout */}
      <Header />

      {searchQuery ? (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[60vh]">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Kết quả tìm kiếm cho: <span className="text-blue-600">"{searchQuery}"</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Tìm thấy {filteredProducts.length} sản phẩm phù hợp
              </p>
            </div>
            <button
              onClick={() => setSearchParams({})}
              className="self-start sm:self-center text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer border border-transparent"
            >
              Xóa tìm kiếm
            </button>
          </div>

          <FeaturedProducts
            products={filteredProducts}
            loading={productsLoading}
            title="Sản phẩm tìm thấy"
          />
        </div>
      ) : (
        <>
          {/* Hero Slider + right promo cards */}
          <HeroBanner banners={banners} />

          {/* Category icons: Sinh Viên / Macbook / Tool AI / Cloud & VPS */}
          <CategoryBar />

          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Section 1: Sản phẩm bán chạy */}
            <FeaturedProducts
              products={products}
              loading={productsLoading}
              title="Sản phẩm bán chạy"
              viewMoreUrl="/best-seller"
            />

            {/* Section 2: Tài khoản Account riêng */}
            <FeaturedProducts
              products={products.filter(p => p.category === 'account').slice(0, 4)}
              loading={productsLoading}
              title="Tài khoản Account riêng"
              viewMoreUrl="/accounts"
            />

            {/* Section 3: Laptop / PC riêng */}
            <FeaturedProducts
              products={products.filter(p => p.category === 'laptop').slice(0, 4)}
              loading={productsLoading}
              title="Laptop / PC riêng"
              viewMoreUrl="/laptops"
            />
          </div>

          {/* "Bứt phá" promo banner */}
          <PromoBanners />

          {/* Newsletter / Register CTA */}
          <NewsletterCTA />
        </>
      )}

      {/* Footer from layout */}
      <Footer />
    </div>
  )
}
