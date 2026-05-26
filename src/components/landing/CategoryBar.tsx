// Category icons with responsive sizing
const STITCH_CATEGORIES = [
  {
    id: 'sinhvien',
    label: 'Sinh Viên',
    href: '#sinhvien',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 sm:w-6 sm:h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    id: 'macbook',
    label: 'Macbook',
    href: '#macbook',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 sm:w-6 sm:h-6">
        <rect x="2" y="4" width="20" height="13" rx="2" strokeLinecap="round" />
        <path strokeLinecap="round" d="M1 20h22" />
        <path strokeLinecap="round" d="M9 20l1-3h4l1 3" />
      </svg>
    ),
  },
  {
    id: 'toolai',
    label: 'Tool AI',
    href: '#toolai',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 sm:w-6 sm:h-6">
        <circle cx="12" cy="8" r="3" />
        <path strokeLinecap="round" d="M6.5 19a5.5 5.5 0 0111 0" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'cloudvps',
    label: 'Cloud & VPS',
    href: '#cloudvps',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 sm:w-6 sm:h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
]

export default function CategoryBar() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-4 sm:pb-6">
      {/* Scrollable on very small screens, centered on larger */}
      <div className="flex items-center justify-around sm:justify-center sm:gap-10 lg:gap-16 overflow-x-auto scrollbar-hide pb-1">
        {STITCH_CATEGORIES.map(cat => (
          <a
            key={cat.id}
            href={cat.href}
            className="flex flex-col items-center gap-1.5 sm:gap-2 group cursor-pointer flex-shrink-0 px-2"
          >
            {/* Circle icon */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-600 shadow-sm group-hover:shadow-md group-hover:border-blue-300 group-hover:bg-blue-50 transition-all duration-200">
              {cat.icon}
            </div>
            <span className="text-[11px] sm:text-xs text-gray-700 font-medium group-hover:text-blue-600 transition-colors whitespace-nowrap">
              {cat.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
