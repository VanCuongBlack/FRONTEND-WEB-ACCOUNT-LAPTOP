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

const marketplaceTabs = [
  'Bán chạy',
  'PC Gaming',
  'Laptop văn phòng',
  'MacBook',
  'Account AI',
  'Account giải trí',
]

export default function LandingPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    getLandingData()
      .then((data) => {
        setBanners(data.banners)
        setProducts(data.products)
      })
      .finally(() => setProductsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#09051f]">
      <Header />
      <HeroBanner banners={banners} />
      <CategoryBar />

      <section className="w-full px-4 pb-5 sm:px-6">
        <div className="flex gap-3 overflow-x-auto py-2">
          {marketplaceTabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`h-12 shrink-0 rounded-[22px] px-7 text-base font-black transition-colors ${
                index === 0
                  ? 'border border-[#3f75ff] bg-transparent text-white'
                  : 'bg-[#44405f] text-white hover:bg-[#565176]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <div className="flex w-full flex-col gap-5 sm:gap-6">
        <FeaturedProducts
          products={products}
          loading={productsLoading}
          title="Sản phẩm bán chạy"
          viewMoreUrl="/best-seller"
          accent="hot"
        />

        <FeaturedProducts
          products={products.filter((product) => product.category === 'account').slice(0, 4)}
          loading={productsLoading}
          title="Tài khoản Account riêng"
          viewMoreUrl="/accounts"
          accent="account"
        />

        <FeaturedProducts
          products={products.filter((product) => product.category === 'laptop').slice(0, 4)}
          loading={productsLoading}
          title="Laptop / PC riêng"
          viewMoreUrl="/laptops"
          accent="laptop"
        />
      </div>

      <PromoBanners />
      <NewsletterCTA />
      <Footer />
    </div>
  )
}
