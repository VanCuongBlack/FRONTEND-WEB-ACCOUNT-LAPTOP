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
      ? ['ASUS', 'MSI', 'Acer', 'Apple']
      : ['OpenAI', 'Canva', 'Netflix']

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
    <aside className="w-full rounded-2xl bg-white p-5 shadow-sm lg:w-[280px]">
      <h2 className="text-lg font-bold text-black">Bộ lọc sản phẩm</h2>

      <div className="mt-6">
        <h3 className="mb-3 font-semibold text-black">Khoảng giá</h3>

        <div className="space-y-3 text-sm text-gray-700">
          {priceOptions.map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPrices.includes(value)}
                onChange={() => onTogglePrice(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 font-semibold text-black">
          {type === 'laptop' ? 'Thương hiệu' : 'Nền tảng'}
        </h3>

        <div className="space-y-3 text-sm text-gray-700">
          {categories.map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(item)}
                onChange={() => onToggleCategory(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onClearFilter}
        className="mt-8 h-[42px] w-full rounded-xl bg-[#3783EC] text-sm font-semibold text-white transition-colors hover:bg-[#206ed6]"
      >
        Xóa bộ lọc
      </button>
    </aside>
  )
}