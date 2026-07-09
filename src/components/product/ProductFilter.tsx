interface ProductFilterProps {
  type: 'laptop' | 'account'
  selectedPrices: string[]
  selectedCategories: string[]
  onTogglePrice: (value: string) => void
  onToggleCategory: (value: string) => void
  onClearFilter: () => void
}

export default function ProductFilter({
  type,
  selectedPrices,
  selectedCategories,
  onTogglePrice,
  onToggleCategory,
  onClearFilter,
}: ProductFilterProps) {
  const categories =
    type === 'laptop'
      ? ['Dell', 'Apple', 'ASUS', 'MSI', 'Acer', 'Lenovo']
      : ['OpenAI', 'Canva', 'Netflix', 'Steam', 'Adobe', 'Spotify']

  const priceOptions =
    type === 'laptop'
      ? [
          ['low', 'Dưới 15 triệu'],
          ['middle', '15 - 25 triệu'],
          ['high', 'Trên 25 triệu'],
        ]
      : [
          ['low', 'Dưới 150K'],
          ['middle', '150K - 250K'],
          ['high', 'Trên 250K'],
        ]

  return (
    <aside className="w-full rounded-[26px] border border-white/5 bg-gradient-to-b from-[#1c1739] to-[#120d2b] p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] lg:w-[280px]">
      <h2 className="text-lg font-black tracking-wide text-white">Bộ lọc sản phẩm</h2>

      <div className="mt-6">
        <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-[#00c6ff]">Khoảng giá</h3>

        <div className="space-y-3 text-sm text-white/60">
          {priceOptions.map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-3 hover:text-white transition-colors duration-150">
              <input
                type="checkbox"
                checked={selectedPrices.includes(value)}
                onChange={() => onTogglePrice(value)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#00c6ff] accent-[#00c6ff] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-[#00c6ff]">
          {type === 'laptop' ? 'Thương hiệu' : 'Nền tảng'}
        </h3>

        <div className="space-y-3 text-sm text-white/60">
          {categories.map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-3 hover:text-white transition-colors duration-150">
              <input
                type="checkbox"
                checked={selectedCategories.includes(item)}
                onChange={() => onToggleCategory(item)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#00c6ff] accent-[#00c6ff] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onClearFilter}
        className="mt-8 h-[42px] w-full rounded-xl bg-gradient-to-r from-[#00c6ff] to-[#8a2be2] text-xs font-black uppercase tracking-wider text-white hover:opacity-90 active:scale-95 transition-all duration-200 shadow-md"
      >
        Xóa bộ lọc
      </button>
    </aside>
  )
}
