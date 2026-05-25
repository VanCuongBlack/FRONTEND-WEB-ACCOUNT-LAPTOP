import api from './api'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Banner {
  id: string
  imageUrl?: string       // ảnh thực — ưu tiên hơn gradient
  imageGradient: string   // fallback gradient khi không có ảnh
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
  icon: string            // emoji icon
  color: string           // tailwind bg color
  href: string
}

/**
 * Product — khớp với response của backend API.
 *
 * Khi API trả về:
 * {
 *   _id: "...",
 *   name: "...",
 *   description: "...",
 *   price: 55000,
 *   stock: 10,
 *   imageUrl: "https://...",
 *   category: "account",     // hoặc "laptop"
 *   isActive: true,
 *   badge: "HOT",            // optional
 *   sold: 120,               // optional
 * }
 *
 * → map _id thành id trong normalizeProduct() bên dưới.
 */
export interface Product {
  id: string              // map từ _id
  name: string
  description?: string
  price: number
  originalPrice?: number
  stock?: number          // số lượng tồn kho
  imageUrl?: string       // ảnh từ server
  icon?: string           // emoji fallback nếu không có ảnh
  category?: string       // "laptop" | "account" | ...
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

// ─── Helper: chuẩn hoá response từ API ───────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProduct(raw: any): Product {
  return {
    id: raw._id ?? raw.id,
    name: raw.name,
    description: raw.description,
    price: raw.price,
    originalPrice: raw.originalPrice,
    stock: raw.stock,
    imageUrl: raw.imageUrl ?? raw.image ?? raw.thumbnail,
    icon: raw.icon,
    category: raw.category,
    badge: raw.badge,
    isActive: raw.isActive ?? true,
    tag: raw.tag ?? raw.category,
    sold: raw.sold,
  }
}

// ─── Mock Data (dùng khi chưa có API) ────────────────────────────────────────

export const mockBanners: Banner[] = [
  {
    id: '1',
    imageUrl: '/hero-1.png',
    imageGradient: 'from-[#0d47a1] via-[#1565c0] to-[#1976d2]',
    title: 'Quản lý tài khoản thông minh',
    subtitle: 'Bảo mật tuyệt đối · Đăng nhập một chạm · Quản lý đa nền tảng',
    ctaText: 'Đăng ký miễn phí',
    ctaLink: '/register',
    isActive: true,
    order: 1,
    tag: 'Mới ra mắt',
  },
  {
    id: '2',
    imageUrl: '/hero-2.png',
    imageGradient: 'from-[#6a1b9a] via-[#7b1fa2] to-[#8e24aa]',
    title: 'Xác thực 2 lớp (2FA)',
    subtitle: 'Bảo vệ tài khoản với OTP · Chống truy cập trái phép · An toàn tuyệt đối',
    ctaText: 'Tìm hiểu thêm',
    ctaLink: '/register',
    isActive: true,
    order: 2,
    tag: 'Bảo mật',
  },
  {
    id: '3',
    imageUrl: '/hero-3.png',
    imageGradient: 'from-[#00695c] via-[#00796b] to-[#00897b]',
    title: 'Tích hợp Google & Facebook',
    subtitle: 'Đăng nhập nhanh qua mạng xã hội · Không cần nhớ mật khẩu',
    ctaText: 'Khám phá ngay',
    ctaLink: '/register',
    isActive: true,
    order: 3,
    tag: 'SSO',
  },
]

export const mockProducts: Product[] = [
  { id: 'm1', name: 'Dell Latitude 7420 i7', icon: '💻', price: 22500000, stock: 3, isActive: true, category: 'laptop' },
  { id: 'm2', name: 'Netflix Premium 4K 1 Tháng', icon: '🎬', price: 55000, stock: 99, isActive: true, category: 'account', badge: 'HOT' },
  { id: 'm3', name: 'MacBook Pro 14" M3 2024', icon: '🍎', price: 39990000, stock: 2, isActive: true, category: 'laptop' },
  { id: 'm4', name: 'Adobe Creative Cloud 1 Năm', icon: '🎨', price: 350000, stock: 99, isActive: true, category: 'account' },
  { id: 'm5', name: 'Adobe Gia hạn chính chủ', icon: '🎨', price: 280000, stock: 50, isActive: true, category: 'account' },
  { id: 'm6', name: 'HP Envy 13 x360 Mới', icon: '💻', price: 18500000, stock: 7, isActive: true, category: 'laptop' },
  { id: 'm7', name: 'Spotify Premium 1 Năm', icon: '🎵', price: 290000, stock: 99, isActive: true, category: 'account', badge: 'SALE' },
  { id: 'm8', name: 'ThinkPad X1 Carbon Gen 10', icon: '💻', price: 32000000, stock: 2, isActive: true, category: 'laptop' },
]

export const mockPromoBanners: PromoBanner[] = [
  { id: '1', title: 'Bảo mật tài khoản', subtitle: 'Kích hoạt 2FA ngay hôm nay', gradient: 'from-blue-600 to-indigo-700', icon: '🔐', isActive: true },
  { id: '2', title: 'AI Account Tools', subtitle: 'Quản lý thông minh hơn với AI', gradient: 'from-purple-600 to-pink-600', icon: '🤖', isActive: true },
  { id: '3', title: 'Cloud Backup Pro', subtitle: 'Sao lưu dữ liệu tự động 24/7', gradient: 'from-teal-500 to-emerald-600', icon: '☁️', isActive: true },
  { id: '4', title: 'VPN & Proxy Service', subtitle: 'Truy cập an toàn mọi nơi', gradient: 'from-orange-500 to-rose-500', icon: '🛡️', isActive: true },
]

// ─── API Functions ─────────────────────────────────────────────────────────────

/**
 * Lấy danh sách sản phẩm nổi bật từ API.
 * Khi backend sẵn sàng, uncomment dòng API và comment dòng mock.
 *
 * Endpoint ví dụ: GET /api/v1/products?featured=true&limit=8
 */
export const getProducts = async (): Promise<Product[]> => {
  // ── MOCK (đang dùng) ──────────────────────────────
  return Promise.resolve(mockProducts)

  // ── REAL API (bật khi có backend) ─────────────────
  // const res = await api.get('/products', { params: { featured: true, limit: 8 } })
  // const raw = res.data?.data ?? res.data ?? []
  // return (Array.isArray(raw) ? raw : raw.products ?? []).map(normalizeProduct)
}

/**
 * Lấy toàn bộ data cho landing page.
 * Mở rộng thêm các endpoint khác (banners, categories...) khi backend có.
 */
export const getLandingData = async (): Promise<LandingData> => {
  // Chạy song song nếu có nhiều API
  const [products] = await Promise.all([
    getProducts(),
    // getBanners(),       // thêm sau
    // getCategories(),    // thêm sau
  ])

  return {
    banners: mockBanners,    // thay bằng await getBanners() khi có
    categories: [],             // thay bằng await getCategories() khi có
    products,
    promoBanners: mockPromoBanners,
  }
}

// ─── Hàm tiện ích dùng trực tiếp trong component ─────────────────────────────

/** Dùng trong LandingPage: chỉ lấy sản phẩm (không cần load toàn bộ) */
export { normalizeProduct }
export type { LandingData as default }
