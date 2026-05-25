import { Link } from 'react-router-dom'
import { formatPrice } from '@/services/product.service'

interface ProductCardProps {
  id: string
  name: string
  price: number
  subtitle: string
  to: string
}

export default function ProductCard({ id, name, price, subtitle, to }: ProductCardProps) {
  return (
    <Link
      to={`${to}/${id}`}
      className="w-full rounded-[24px] bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-4 h-[140px] w-full rounded-[18px] bg-[#d9d9d9]" />

      <h3 className="text-[18px] font-bold text-black">{name}</h3>
      <p className="mt-2 text-[14px] text-gray-500">{subtitle}</p>
      <p className="mt-2 text-[16px] font-bold text-green-600">{formatPrice(price)}</p>
    </Link>
  )
}