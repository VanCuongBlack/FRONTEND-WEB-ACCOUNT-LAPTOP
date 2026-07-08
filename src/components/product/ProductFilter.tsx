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
    <aside className="w-full rounded-[22px] border border-[#3d63ff]/20 bg-[#211b42] p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.2)] lg:w-[280px]">
      <h2 className="text-lg font-black">Bộ lọc sản phẩm</h2>

      <div className="mt-6">
        <h3 className="mb-3 font-bold text-[#d9d6ee]">Khoảng giá</h3>

        <div className="space-y-3 text-sm text-[#b9b4d7]">
          {priceOptions.map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPrices.includes(value)}
                onChange={() => onTogglePrice(value)}
                className="accent-[#1677ff]"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 font-bold text-[#d9d6ee]">
          {type === 'laptop' ? 'Thương hiệu' : 'Nền tảng'}
        </h3>

        <div className="space-y-3 text-sm text-[#b9b4d7]">
          {categories.map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(item)}
                onChange={() => onToggleCategory(item)}
                className="accent-[#1677ff]"
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onClearFilter}
        className="mt-8 h-[42px] w-full rounded-xl bg-[#1677ff] text-sm font-black text-white transition-colors hover:bg-[#0f66df]"
      >
        Xóa bộ lọc
      </button>
    </aside>
  )
}
