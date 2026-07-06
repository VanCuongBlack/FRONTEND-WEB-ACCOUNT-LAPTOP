import { useEffect, useState } from 'react'
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

  useEffect(() => {
    getLandingData()
      .then(data => {
        setBanners(data.banners)
        setProducts(data.products)
      })
      .finally(() => setProductsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Sticky Header from layout */}
      <Header />

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

      {/* Footer from layout */}
      <Footer />
    </div>
  )
}
