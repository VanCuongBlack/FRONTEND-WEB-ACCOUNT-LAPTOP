export interface LaptopProduct {
  id: string
  name: string
  price: number
  thumbnail: string
  brand: string
  cpu: string
  gpu: string
  ram: string
  ssd: string
  screen: string
  description: string
}

export interface AccountProduct {
  id: string
  name: string
  price: number
  thumbnail: string
  platform: string
  duration: string
  devices: string
  description: string
}