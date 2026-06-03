import { useMemo, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface Product {
  id: number
  name: string
  category: string
  price: number
}

const initialProducts: Product[] = [
  { id: 1, name: 'ASUS ROG Strix G16', category: 'Gaming', price: 29990000 },
  { id: 2, name: 'Macbook Pro M3', category: 'Macbook', price: 42990000 },
  { id: 3, name: 'Dell Inspiron', category: 'Văn Phòng', price: 18990000 },
]

const initialCategories = ['Gaming', 'Văn Phòng', 'Macbook']

function formatPrice(price: number) {
  return `${price.toLocaleString('vi-VN')}đ`
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [keyword, setKeyword] = useState('')

  const filteredProducts = useMemo(() => {
    return products.filter((item) =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    )
  }, [products, keyword])

  const handleAddCategory = () => {
    const name = prompt('Nhập tên danh mục mới:')

    if (!name?.trim()) return

    setCategories((prev) => [...prev, name.trim()])
  }

  const handleAddProduct = () => {
    const name = prompt('Nhập tên sản phẩm:')

    if (!name?.trim()) return

    const newProduct: Product = {
      id: Date.now(),
      name: name.trim(),
      category: categories[0] || 'Khác',
      price: 0,
    }

    setProducts((prev) => [...prev, newProduct])
  }

  const handleEditProduct = (id: number) => {
    const product = products.find((item) => item.id === id)
    if (!product) return

    const newName = prompt('Sửa tên sản phẩm:', product.name)

    if (!newName?.trim()) return

    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, name: newName.trim() } : item
      )
    )
  }

  const handleDeleteProduct = (id: number) => {
    const confirmDelete = confirm('Bạn có chắc muốn xóa sản phẩm này không?')

    if (!confirmDelete) return

    setProducts((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] font-['Inter',sans-serif] text-black">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <section className="rounded-3xl bg-white p-7 shadow-sm">
          <header className="mb-7 flex items-center justify-between rounded-2xl bg-[#F3F4F6] px-7 py-5">
            <h1 className="text-[28px] font-bold">Quản lý sản phẩm</h1>
            <span className="text-sm text-gray-600">👤 Admin</span>
          </header>

          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="🔍 Tìm kiếm sản phẩm..."
              className="h-[46px] w-full rounded-xl bg-[#F3F4F6] px-5 text-sm outline-none md:w-[360px]"
            />

            <button
              type="button"
              onClick={handleAddProduct}
              className="h-[46px] rounded-xl bg-[#2563EB] px-8 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
            >
              + Thêm sản phẩm
            </button>
          </div>

          <section className="mb-7 rounded-3xl bg-[#F9FAFB] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">CRUD Danh mục</h2>

              <button
                type="button"
                onClick={handleAddCategory}
                className="h-[46px] rounded-xl bg-[#10B981] px-8 text-sm font-semibold text-white hover:bg-[#059669]"
              >
                + Thêm danh mục
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="h-[38px] min-w-[140px] rounded-xl bg-[#E5E7EB] px-5 text-sm text-gray-700"
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-[#F9FAFB] p-6">
            <h2 className="mb-5 text-xl font-bold">CRUD Sản phẩm</h2>

            <div className="overflow-hidden rounded-2xl bg-white">
              <div className="grid grid-cols-[120px_1fr_160px_160px_160px] bg-[#E5E7EB] px-6 py-4 text-sm font-bold">
                <span>Hình ảnh</span>
                <span>Tên sản phẩm</span>
                <span>Danh mục</span>
                <span>Giá</span>
                <span>Thao tác</span>
              </div>

              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[120px_1fr_160px_160px_160px] items-center border-b border-gray-100 px-6 py-5 text-sm"
                >
                  <div className="h-[48px] w-[56px] rounded-lg bg-[#D1D5DB]" />

                  <span>{item.name}</span>

                  <span className="text-gray-600">{item.category}</span>

                  <span className="font-semibold text-[#10B981]">
                    {formatPrice(item.price)}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditProduct(item.id)}
                      className="rounded-lg bg-[#2563EB] px-4 py-2 text-white hover:bg-[#1D4ED8]"
                    >
                      Sửa
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(item.id)}
                      className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-500">
                  Không tìm thấy sản phẩm.
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}