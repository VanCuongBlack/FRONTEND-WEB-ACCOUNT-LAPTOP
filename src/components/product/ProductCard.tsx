import { Link } from 'react-router-dom'
import { formatPrice } from '@/services/product.service'

interface ProductCardProps {
  id: string
  name: string
  price: number
  subtitle: string
  to: string
  image?: string
}

export default function ProductCard({
  id,
  name,
  price,
  subtitle,
  to,
  image,
}: ProductCardProps) {
  return (
    <Link
      to={`${to}/${id}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="overflow-hidden bg-[#d9d9d9]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105 md:h-48"
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center text-gray-500 md:h-48">
            HÌNH ẢNH
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="min-h-[44px] text-[15px] font-bold text-black">
          {name}
        </h3>

        <p className="mt-2 min-h-[36px] text-[12px] text-gray-500">
          {subtitle}
        </p>

        <p className="mt-4 text-[16px] font-bold text-[#27AE60]">
          {formatPrice(price)}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            alert('Đã thêm vào giỏ hàng')
          }}
          className="mt-4 h-[42px] w-full rounded-xl bg-[#3783EC] text-sm font-semibold text-white transition-colors hover:bg-[#206ed6]"
        >
          Thêm giỏ hàng
        </button>
      </div>
    </Link>
  )
}