import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Banner } from '@/services/landing.service'

interface Props {
  banners: Banner[]
}

export default function HeroBanner({ banners }: Props) {
  const active = banners.filter(b => b.isActive).sort((a, b) => a.order - b.order)
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
    <section className="max-w-[1840px] mx-auto px-4 sm:px-6 pt-3 sm:pt-4 pb-3 sm:pb-4">
      <div className="flex flex-col sm:flex-row gap-3">

        {/* ── Main banner slider ── */}
        <div className="flex-1 rounded-[26px] overflow-hidden relative h-[220px] sm:h-[280px] lg:h-[310px] bg-[#211b42] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">

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
                {slide.imageUrl ? (
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${slide.imageGradient}`} />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/35 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-8 lg:px-10">
                  {slide.tag && (
                    <span className="inline-flex w-fit items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest mb-2">
                      {slide.tag}
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-1.5 max-w-sm drop-shadow">
                    {slide.title}
                  </h2>
                  <p className="text-white/85 text-xs sm:text-sm mb-4 max-w-sm line-clamp-2 drop-shadow-sm">
                    {slide.subtitle}
                  </p>
                  <Link
                    to={slide.ctaLink}
                    className="inline-flex items-center gap-2 w-fit px-5 py-2.5 rounded-xl bg-[#1677ff] text-white font-black text-xs sm:text-sm hover:bg-[#0f66df] active:scale-95 transition-all duration-200 shadow"
                  >
                    {slide.ctaText}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          {active.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors z-20 backdrop-blur-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors z-20 backdrop-blur-sm"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
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

        {/* ── Right side cards ── */}
        <div className="hidden sm:flex flex-col gap-3 w-44 lg:w-56 flex-shrink-0 h-[280px] lg:h-[310px]">

          {/* Netflix card */}
          <div className="flex-1 rounded-[22px] overflow-hidden relative cursor-pointer group bg-[#211b42] shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
            <img
              src="/side-card-netflix.png"
              alt="Netflix Flash Sale"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <span className="inline-block bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg mb-1.5 w-fit">
                FLASH SALE
              </span>
              <h3 className="text-white font-black text-sm leading-snug drop-shadow">Netflix Premium</h3>
              <p className="text-white/80 text-[11px] mt-0.5 drop-shadow-sm">Từ 49k/tháng · Bảo hành</p>
            </div>
          </div>

          {/* MacBook card */}
          <div className="flex-1 rounded-[22px] overflow-hidden relative cursor-pointer group bg-[#211b42] shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
            <img
              src="/side-card-macbook.png"
              alt="MacBook Air M3"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <h3 className="text-white font-black text-sm leading-snug drop-shadow">MacBook Air M3</h3>
              <a
                href="#macbook"
                className="flex items-center gap-1 text-blue-300 font-semibold text-xs mt-1 hover:text-white transition-colors"
              >
                Xem ngay <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
