import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Banner } from '@/services/landing.service'

const fallbackBanners: Banner[] = [
  {
    id: 'fallback-1',
    imageUrl: '/hero-2.png',
    imageGradient: 'from-[#00c6ff] to-[#0072ff]',
    title: 'Laptop & PC Đỉnh cao công nghệ',
    subtitle: 'Sở hữu ngay Dell, ThinkPad, MacBook cấu hình mạnh mẽ với chính sách bảo hành độc quyền chỉ có tại PCAcc.com.',
    ctaText: 'Khám phá ngay',
    ctaLink: '/laptops',
    isActive: true,
    order: 1,
    tag: 'CHÍNH HÃNG 100%',
  },
  {
    id: 'fallback-2',
    imageUrl: '/hero-1.png',
    imageGradient: 'from-[#6a1b9a] via-[#7b1fa2] to-[#8e24aa]',
    title: 'Tài khoản Premium giá tốt',
    subtitle: 'Netflix, YouTube, Spotify, Adobe bản quyền. Giao nhanh, bảo hành rõ ràng.',
    ctaText: 'Khám phá ngay',
    ctaLink: '/accounts',
    isActive: true,
    order: 2,
    tag: 'BÁN CHẠY',
  },
  {
    id: 'fallback-3',
    imageUrl: '/hero-3.png',
    imageGradient: 'from-[#00695c] via-[#00796b] to-[#00897b]',
    title: 'Dịch vụ số đỉnh cao',
    subtitle: 'Bản quyền chính hãng, kích hoạt ngay lập tức. Tiết kiệm chi phí lên đến 70%.',
    ctaText: 'Mua ngay',
    ctaLink: '/best-seller',
    isActive: true,
    order: 3,
    tag: 'HOT DEAL',
  },
]

interface Props {
  banners: Banner[]
}

function BannerImage({ src, alt, fallbackSrc, fallbackGradient }: { src?: string; alt: string; fallbackSrc: string; fallbackGradient: string }) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc)
    setHasError(false)
  }, [src, fallbackSrc])

  if (hasError) {
    return <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient}`} />
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc)
        } else {
          setHasError(true)
        }
      }}
      className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000"
    />
  )
}

export default function HeroBanner({ banners }: Props) {
  let active = banners.filter(b => b.isActive && b.title).sort((a, b) => a.order - b.order)
  if (active.length === 0) {
    active = fallbackBanners.filter(b => b.isActive).sort((a, b) => a.order - b.order)
  }
  const [cur, setCur] = useState(0)
  const [sliding, setSliding] = useState(false)

  const go = (idx: number) => {
    if (sliding || idx === cur) return
    setSliding(true)
    setCur(idx)
    setTimeout(() => setSliding(false), 500)
  }
  const prev = () => go((cur - 1 + active.length) % active.length)
  const next = () => go((cur + 1) % active.length)

  useEffect(() => {
    if (active.length <= 1) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [active.length, cur])

  if (active.length === 0) return null

  return (
    <section className="w-full max-w-none px-3 sm:px-5 lg:px-8 pt-4 pb-4 relative z-10">
      <div className="grid w-full gap-4 lg:grid-cols-[minmax(0,2.65fr)_minmax(340px,0.95fr)]">

        {/* ── Main banner slider ── */}
        <div className="w-full rounded-[26px] overflow-hidden relative h-[360px] sm:h-[460px] lg:h-[560px] bg-[#0a1628] border border-[#1e3a62] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">

          {/* Slides Container using premium absolute fade transition */}
          <div className="relative w-full h-full">
            {active.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  idx === cur
                    ? 'opacity-100 translate-x-0 z-10'
                    : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background */}
                <BannerImage
                  src={slide.imageUrl}
                  alt={slide.title}
                  fallbackSrc={idx % 3 === 0 ? '/hero-2.png' : idx % 3 === 1 ? '/hero-1.png' : '/hero-3.png'}
                  fallbackGradient={slide.imageGradient}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#050914]/95 via-[#071120]/50 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16">
                  {slide.tag && (
                    <span className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3.5 shadow-md ${
                      slide.tag.includes('CHÍNH HÃNG')
                        ? 'bg-[#00b4a8] text-white'
                        : 'bg-[#00e3d2]/10 border border-[#00e3d2]/25 text-[#39bdf8]'
                    }`}>
                      {slide.tag}
                    </span>
                  )}
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3 max-w-lg drop-shadow-md whitespace-pre-line">
                    {slide.title.replace(' & ', ' & \n')}
                  </h2>
                  <p className="text-white/70 text-xs sm:text-sm lg:text-base mb-6 max-w-sm sm:max-w-md line-clamp-2 drop-shadow-sm leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-col gap-2.5 w-fit">
                    <Link
                      to={slide.ctaLink}
                      className="inline-flex items-center justify-center gap-2 w-[180px] py-3.5 rounded-xl bg-gradient-to-r from-[#36b8f2] via-[#2668ff] to-[#8b3df5] hover:brightness-110 text-white font-black text-xs sm:text-sm active:scale-95 transition-all duration-200 shadow-[0_4px_15px_rgba(0,198,255,0.25)]"
                    >
                      {slide.ctaText}
                    </Link>
                    <a
                      href="#products"
                      className="inline-flex items-center justify-center gap-2 w-[180px] py-3.5 rounded-xl bg-transparent hover:bg-white/5 text-white font-black text-xs sm:text-sm border border-white/20 active:scale-95 transition-all duration-200"
                    >
                      Xem bảng giá
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          {active.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-20 backdrop-blur-sm border border-[#1e3a62]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-20 backdrop-blur-sm border border-[#1e3a62]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {active.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === cur ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Side promo cards ── */}
        <div className="grid w-full gap-4 lg:h-[560px] lg:grid-rows-2">

          {/* Netflix card */}
          <Link
            to="/accounts"
            className="group relative flex min-h-[150px] w-full cursor-pointer flex-col overflow-hidden rounded-[26px] border border-[#1e3a62] bg-[#0a1628] shadow-[0_15px_35px_rgba(0,0,0,0.35)] sm:min-h-[170px] md:flex-row lg:min-h-0"
          >
            <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 z-10">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-black uppercase tracking-widest mb-2 w-fit">
                FLASH SALE
              </span>
              <h3 className="text-white font-black text-xl sm:text-2xl drop-shadow">Gói Netflix Premium</h3>
              <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-md">Chỉ từ 49k/tháng — Bảo hành trọn đời</p>
            </div>
            <div className="relative w-full md:w-[45%] lg:w-[40%] h-[140px] md:h-auto overflow-hidden">
              <img
                src="/side-card-netflix.png"
                alt="Netflix Flash Sale"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#15122e] via-[#15122e]/40 to-transparent md:block hidden" />
            </div>
          </Link>

          {/* MacBook card */}
          <Link
            to="/laptops"
            className="group relative flex min-h-[150px] w-full cursor-pointer flex-col overflow-hidden rounded-[26px] border border-[#1e3a62] bg-[#0a1628] shadow-[0_15px_35px_rgba(0,0,0,0.35)] sm:min-h-[170px] md:flex-row lg:min-h-0"
          >
            <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 z-10">
              <h3 className="text-white font-black text-xl sm:text-2xl drop-shadow">MacBook Air M3</h3>
              <p className="text-[#39bdf8] font-black text-xs sm:text-sm mt-1 hover:text-white transition-colors duration-200 flex items-center gap-1">
                Sức mạnh không giới hạn <ChevronRight className="w-3.5 h-3.5" />
              </p>
            </div>
            <div className="relative w-full md:w-[45%] lg:w-[40%] h-[140px] md:h-auto overflow-hidden">
              <img
                src="/side-card-macbook.png"
                alt="MacBook Air M3"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#15122e] via-[#15122e]/40 to-transparent md:block hidden" />
            </div>
          </Link>

        </div>

      </div>
    </section>
  )
}
