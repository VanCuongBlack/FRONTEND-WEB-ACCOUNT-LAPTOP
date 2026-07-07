import api from './api'
import { getActiveBanners, type BannerRecord } from './banner.service'

export interface Banner {
  id: string
  imageUrl?: string
  imageGradient: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  isActive: boolean
  order: number
  tag?: string
}

export interface Category {
  id: string
  label: string
  icon: string
  color: string
  href: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  stock?: number
  imageUrl?: string
  icon?: string
  category?: string
  product_type?: 'physical' | 'digital' | string
  brand?: string
  badge?: 'HOT' | 'NEW' | 'SALE' | 'OUT'
  isActive: boolean
  tag?: string
  sold?: number
}

export interface PromoBanner {
  id: string
  title: string
  subtitle: string
  gradient: string
  icon: string
  isActive: boolean
}

export interface LandingData {
  banners: Banner[]
  categories: Category[]
  products: Product[]
  promoBanners: PromoBanner[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProduct(raw: any): Product {
  const productType = raw.product_type ?? raw.category
  const firstImage = raw.images?.[0]
  const firstImageUrl = typeof firstImage === 'string' ? firstImage : firstImage?.url

  return {
    id: raw._id ?? raw.id,
    name: raw.name,
    description: raw.description,
    price: raw.price ?? raw.sale_price ?? raw.base_price ?? 0,
    originalPrice: raw.originalPrice,
    stock: raw.stock ?? raw.stock_quantity,
    imageUrl: raw.imageUrl ?? raw.image ?? raw.thumbnail ?? firstImageUrl,
    icon: raw.icon,
    category:
      productType === 'physical' ? 'laptop' : productType === 'digital' ? 'account' : productType,
    product_type: raw.product_type,
    brand: raw.brand,
    badge: raw.badge,
    isActive: raw.isActive ?? raw.is_active ?? true,
    tag: raw.tag ?? raw.category ?? raw.product_type,
    sold: raw.sold,
  }
}

// BE hiện chưa có API banner/promo, nên chỉ phần marketing dùng dữ liệu tĩnh.
export const marketingBanners: Banner[] = [
  {
    id: '1',
    imageUrl: '/hero-1.png',
    imageGradient: 'from-[#0d47a1] via-[#1565c0] to-[#1976d2]',
    title: 'Tài khoản Premium giá tốt',
    subtitle: 'Netflix, YouTube, Spotify, Adobe bản quyền. Giao nhanh, bảo hành rõ ràng.',
    ctaText: 'Mua tài khoản',
    ctaLink: '/accounts',
    isActive: true,
    order: 1,
    tag: 'BÁN CHẠY',
  },
  {
    id: '2',
    imageUrl: '/hero-2.png',
    imageGradient: 'from-[#6a1b9a] via-[#7b1fa2] to-[#8e24aa]',
    title: 'Laptop & PC chính hãng',
    subtitle: 'Dell, ThinkPad, HP, MacBook cấu hình mạnh. Bảo hành theo từng sản phẩm.',
    ctaText: 'Xem Laptop',
    ctaLink: '/laptops',
    isActive: true,
    order: 2,
    tag: 'CHÍNH HÃNG',
  },
  {
    id: '3',
    imageUrl: '/hero-3.png',
    imageGradient: 'from-[#00695c] via-[#00796b] to-[#00897b]',
    title: 'PC gaming và account số',
    subtitle: 'Một nơi cho cả máy tính, laptop và tài khoản giải trí/học tập.',
    ctaText: 'Xem ưu đãi',
    ctaLink: '/best-seller',
    isActive: true,
    order: 3,
    tag: 'HOT DEAL',
  },
]

export const marketingPromoBanners: PromoBanner[] = [
  {
    id: '1',
    title: 'Bảo mật tài khoản',
    subtitle: 'Ưu tiên account có thông tin rõ ràng',
    gradient: 'from-blue-600 to-indigo-700',
    icon: '🔐',
    isActive: true,
  },
  {
    id: '2',
    title: 'Account AI',
    subtitle: 'Công cụ học tập và làm việc',
    gradient: 'from-purple-600 to-pink-600',
    icon: '🤖',
    isActive: true,
  },
  {
    id: '3',
    title: 'Laptop văn phòng',
    subtitle: 'Máy bền, cấu hình ổn định',
    gradient: 'from-teal-500 to-emerald-600',
    icon: '💻',
    isActive: true,
  },
  {
    id: '4',
    title: 'PC gaming',
    subtitle: 'Hiệu năng tốt cho game và đồ họa',
    gradient: 'from-orange-500 to-rose-500',
    icon: '🎮',
    isActive: true,
  },
]

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await api.get('/product', {
      params: {
        is_active: true,
        limit: 12,
      },
    })
    const data = res.data?.data
    if (!data) return []
    const items = Array.isArray(data.products) ? data.products : Array.isArray(data) ? data : []
    return items.map(normalizeProduct)
  } catch (error) {
    console.error('Error fetching products from API:', error)
    return []
  }
}

function normalizeBanner(raw: BannerRecord): Banner {
  return {
    id: raw._id,
    imageUrl: raw.image?.url,
    imageGradient: 'from-[#0d47a1] via-[#1565c0] to-[#1976d2]',
    title: raw.title,
    subtitle: '',
    ctaText: 'Xem ngay',
    ctaLink: raw.link_url || '/',
    isActive: raw.is_active,
    order: raw.display_order ?? 0,
    tag: raw.position,
  }
}

export const getBanners = async (): Promise<Banner[]> => {
  try {
    const res = await getActiveBanners('home_top')
    const items = Array.isArray(res.data.data) ? res.data.data : []
    return items.length ? items.map(normalizeBanner) : marketingBanners
  } catch (error) {
    console.error('Error fetching banners from API:', error)
    return marketingBanners
  }
}

export const getLandingData = async (): Promise<LandingData> => {
  const [products, banners] = await Promise.all([getProducts(), getBanners()])

  return {
    banners,
    categories: [],
    products,
    promoBanners: marketingPromoBanners,
  }
}

export { normalizeProduct }
export type { LandingData as default }
