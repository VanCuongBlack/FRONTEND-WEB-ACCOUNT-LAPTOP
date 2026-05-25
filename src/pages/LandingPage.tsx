import { useEffect, useState } from 'react'
import { getLandingData } from '@/services/landing.service'
import type { Banner, Product } from '@/services/landing.service'
import Navbar from '@/components/landing/Navbar'
import HeroBanner from '@/components/landing/HeroBanner'
import CategoryBar from '@/components/landing/CategoryBar'
import FeaturedProducts from '@/components/landing/FeaturedProducts'
import PromoBanners from '@/components/landing/PromoBanners'
import NewsletterCTA from '@/components/landing/NewsletterCTA'
import Footer from '@/components/landing/Footer'

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
      {/* Sticky Navbar */}
      <Navbar />

      {/* Hero Slider + right promo cards */}
      <HeroBanner banners={banners} />

      {/* Category icons: Sinh Viên / Macbook / Tool AI / Cloud & VPS */}
      <CategoryBar />

      {/* Featured products grid — hiển thị skeleton khi đang tải */}
      <FeaturedProducts products={products} loading={productsLoading} />

      {/* "Bứt phá" promo banner */}
      <PromoBanners />

      {/* Newsletter / Register CTA */}
      <NewsletterCTA />

      {/* Footer */}
      <Footer />
    </div>
  )
}
