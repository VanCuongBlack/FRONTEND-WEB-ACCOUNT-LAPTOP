const PROMO_ITEMS = [
  {
    id: 1,
    img: '/promo-banner-main.png',
    tag: 'HOT DEAL',
    title: 'Bứt phá giới hạn',
    subtitle: 'Laptop chính hãng · Hiệu năng cao · Giá tốt nhất',
    cta: 'Xem Laptop',
    href: '#macbook',
  },
  {
    id: 2,
    img: '/promo-banner-accounts.png',
    tag: 'PREMIUM',
    title: 'Tài khoản cao cấp',
    subtitle: 'Netflix · Adobe · Spotify · YouTube — Bảo hành trọn đời',
    cta: 'Mua ngay',
    href: '#products',
  },
]

export default function PromoBanners() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-4 sm:pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PROMO_ITEMS.map((item) => (
          <div
            key={item.id}
            className="relative rounded-2xl overflow-hidden min-h-[180px] sm:min-h-[220px] group cursor-pointer"
          >
            {/* Background image */}
            <img
              src={item.img}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center h-full min-h-[180px] sm:min-h-[220px] px-6 py-6 sm:px-8 sm:py-8">
              {/* Tag badge */}
              <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest mb-2 sm:mb-3">
                {item.tag}
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-1.5 sm:mb-2 drop-shadow">
                {item.title}
              </h2>
              <p className="text-white/75 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed max-w-[260px]">
                {item.subtitle}
              </p>

              <a
                href={item.href}
                className="inline-flex items-center gap-2 w-fit px-4 py-2 sm:px-5 sm:py-2 rounded-xl bg-white text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 active:scale-95 transition-all duration-200 shadow"
              >
                {item.cta} →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
