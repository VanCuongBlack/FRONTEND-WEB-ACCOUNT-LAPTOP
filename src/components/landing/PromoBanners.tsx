import { Link } from 'react-router-dom'

export default function PromoBanners() {
  return (
    <section className="w-full max-w-none px-3 sm:px-5 lg:px-8 pb-4 sm:pb-6 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Promo Card */}
        <Link
          to="/laptops"
          className="relative rounded-[26px] overflow-hidden block border border-[#1e3a62] shadow-[0_15px_35px_rgba(0,0,0,0.3)] group h-[180px] sm:h-[220px]"
        >
          <img
            src="/promo-banner-main.png"
            alt="Bứt phá giới hạn"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Right Promo Card */}
        <Link
          to="/accounts"
          className="relative rounded-[26px] overflow-hidden block border border-[#1e3a62] shadow-[0_15px_35px_rgba(0,0,0,0.3)] group h-[180px] sm:h-[220px]"
        >
          <img
            src="/promo-banner-accounts.png"
            alt="Giải trí vô tận"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

      </div>
    </section>
  )
}
