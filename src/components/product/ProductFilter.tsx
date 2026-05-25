interface ProductFilterProps {
  type: 'laptop' | 'account'
  onPriceFilter?: (value: string) => void
  onCategoryFilter?: (value: string) => void
  onClearFilter?: () => void
}

export default function ProductFilter({
  type,
  onPriceFilter,
  onCategoryFilter,
  onClearFilter,
}: ProductFilterProps) {
  const categories =
    type === 'laptop'
      ? ['ASUS', 'MSI', 'Acer']
      : ['ChatGPT', 'Canva', 'Netflix']

  return (
    <aside className="w-full rounded-[24px] bg-white p-6 lg:w-[260px]">
      <h2 className="text-[22px] font-bold text-black">Bộ lọc sản phẩm</h2>

      <div className="mt-8">
        <h3 className="text-[16px] font-bold text-black">Theo giá</h3>

        <div className="mt-4 flex flex-col gap-3">
          <button onClick={() => onPriceFilter?.('low')} className="rounded-[10px] bg-[#f0f0f0] px-4 py-3 text-left text-sm text-gray-600 hover:bg-[#e5e5e5]">
            Dưới 15 triệu
          </button>
          <button onClick={() => onPriceFilter?.('middle')} className="rounded-[10px] bg-[#f0f0f0] px-4 py-3 text-left text-sm text-gray-600 hover:bg-[#e5e5e5]">
            15 - 25 triệu
          </button>
          <button onClick={() => onPriceFilter?.('high')} className="rounded-[10px] bg-[#f0f0f0] px-4 py-3 text-left text-sm text-gray-600 hover:bg-[#e5e5e5]">
            Trên 25 triệu
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-[16px] font-bold text-black">
          {type === 'laptop' ? 'Theo thương hiệu' : 'Theo nền tảng'}
        </h3>

        <div className="mt-4 flex flex-col gap-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => onCategoryFilter?.(item)}
              className="rounded-[10px] bg-[#f0f0f0] px-4 py-3 text-left text-sm text-gray-600 hover:bg-[#e5e5e5]"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onClearFilter}
        className="mt-8 w-full rounded-[10px] bg-black px-4 py-3 text-sm text-white hover:opacity-90"
      >
        Xóa bộ lọc
      </button>
    </aside>
  )
}