import { useProductStore } from '@/store/productStore'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const useProduct = () => {
  const store = useProductStore()

  useEffect(() => {
    // Fetch products on mount
    store.fetchProducts().catch((error) => {
      console.error('Failed to fetch products:', error)
    })
  }, [])

  const getProduct = async (productId: string) => {
    try {
      await store.fetchProductById(productId)
    } catch (error) {
      toast.error('Lỗi tải thông tin sản phẩm')
    }
  }

  const getLaptops = async (params?: any) => {
    try {
      await store.fetchPhysicalProducts(params)
    } catch (error) {
      toast.error('Lỗi tải danh sách laptop')
    }
  }

  const getAccounts = async (params?: any) => {
    try {
      await store.fetchDigitalProducts(params)
    } catch (error) {
      toast.error('Lỗi tải danh sách tài khoản')
    }
  }

  const searchProducts = async (query: string) => {
    try {
      await store.fetchProducts({ search: query })
    } catch (error) {
      toast.error('Lỗi tìm kiếm sản phẩm')
    }
  }

  return {
    products: store.products,
    laptops: store.laptops,
    accounts: store.accounts,
    currentProduct: store.currentProduct,
    isLoading: store.isLoading,
    error: store.error,
    total: store.total,
    page: store.page,
    limit: store.limit,
    getProduct,
    getLaptops,
    getAccounts,
    searchProducts,
  }
}
