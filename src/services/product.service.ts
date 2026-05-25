import type { AccountProduct, LaptopProduct } from '@/types/product.type'

export const laptopProducts: LaptopProduct[] = [
  {
    id: '1',
    name: 'ASUS ROG Strix G16',
    price: 29990000,
    thumbnail: '',
    brand: 'ASUS',
    cpu: 'Intel Core i7 Gen 13',
    gpu: 'RTX 4060 8GB',
    ram: '16GB DDR5',
    ssd: '1TB NVMe',
    screen: '16 inch 165Hz',
    description: 'Laptop gaming hiệu năng cao dành cho game thủ và designer.',
  },
  {
    id: '2',
    name: 'MSI Katana',
    price: 24990000,
    thumbnail: '',
    brand: 'MSI',
    cpu: 'Intel Core i5',
    gpu: 'RTX 4050',
    ram: '16GB DDR5',
    ssd: '512GB NVMe',
    screen: '15.6 inch 144Hz',
    description: 'Laptop gaming tầm trung, cấu hình mạnh, giá tốt.',
  },
  {
    id: '3',
    name: 'Acer Nitro',
    price: 26990000,
    thumbnail: '',
    brand: 'Acer',
    cpu: 'Intel Core i7',
    gpu: 'RTX 4050',
    ram: '16GB DDR5',
    ssd: '512GB NVMe',
    screen: '15.6 inch 144Hz',
    description: 'Laptop gaming phổ biến, phù hợp học tập và chơi game.',
  },
]

export const accountProducts: AccountProduct[] = [
  {
    id: '1',
    name: 'ChatGPT Plus',
    price: 250000,
    thumbnail: '',
    platform: 'OpenAI',
    duration: '1 tháng',
    devices: '1 thiết bị',
    description: 'Tài khoản ChatGPT Plus dùng cá nhân, hỗ trợ học tập và làm việc.',
  },
  {
    id: '2',
    name: 'Canva Pro',
    price: 99000,
    thumbnail: '',
    platform: 'Canva',
    duration: '1 tháng',
    devices: '1 tài khoản',
    description: 'Tài khoản Canva Pro hỗ trợ thiết kế, học tập và marketing.',
  },
  {
    id: '3',
    name: 'Netflix Premium',
    price: 120000,
    thumbnail: '',
    platform: 'Netflix',
    duration: '1 tháng',
    devices: '1 profile',
    description: 'Tài khoản Netflix xem phim chất lượng cao.',
  },
]

export const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + 'đ'
}