import { useMemo, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AppModal from '@/components/common/AppModal'

type ProductType = 'laptop' | 'account'

interface Product {
  id: number
  name: string
  category: string
  price: number
  type: ProductType
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'ASUS ROG Strix G16',
    category: 'Gaming',
    price: 29990000,
    type: 'laptop',
  },
  {
    id: 2,
    name: 'Macbook Pro M3',
    category: 'Macbook',
    price: 42990000,
    type: 'laptop',
  },
  {
    id: 3,
    name: 'Dell Inspiron',
    category: 'Văn Phòng',
    price: 18990000,
    type: 'laptop',
  },
  {
    id: 4,
    name: 'ChatGPT Plus 1 Tháng',
    category: 'ChatGPT',
    price: 490000,
    type: 'account',
  },
  {
    id: 5,
    name: 'Canva Pro 1 Năm',
    category: 'Canva',
    price: 299000,
    type: 'account',
  },
  {
    id: 6,
    name: 'Netflix Premium',
    category: 'Netflix',
    price: 189000,
    type: 'account',
  },
  {
    id: 7,
    name: 'Spotify Premium',
    category: 'Spotify',
    price: 99000,
    type: 'account',
  },
  {
    id: 8,
    name: 'Adobe Creative Cloud',
    category: 'Adobe',
    price: 699000,
    type: 'account',
  },
]

const laptopCategories = ['Gaming', 'Văn Phòng', 'Macbook']
const accountCategories = ['ChatGPT', 'Canva', 'Netflix', 'Spotify', 'Adobe']

function formatPrice(price: number) {
  return `${price.toLocaleString('vi-VN')}đ`
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [activeTab, setActiveTab] = useState<ProductType>('laptop')
  const [keyword, setKeyword] = useState('')
  const [laptopCategoryList, setLaptopCategoryList] =
    useState<string[]>(laptopCategories)
  const [accountCategoryList, setAccountCategoryList] =
    useState<string[]>(accountCategories)

  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const [openProductModal, setOpenProductModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const [categoryName, setCategoryName] = useState('')
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  )

  const currentCategories =
    activeTab === 'laptop' ? laptopCategoryList : accountCategoryList

  const filteredProducts = useMemo(() => {
    const search = keyword.toLowerCase().trim()

    return products.filter((item) => {
      const matchType = item.type === activeTab

      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search)

      return matchType && matchSearch
    })
  }, [products, keyword, activeTab])

  const resetProductForm = () => {
    setProductName('')
    setProductPrice('')
    setSelectedCategory('')
    setEditingProduct(null)
  }

  const handleSaveCategory = () => {
    const name = categoryName.trim()

    if (!name) return

    if (activeTab === 'laptop') {
      setLaptopCategoryList((prev) =>
        prev.includes(name) ? prev : [...prev, name]
      )
    } else {
      setAccountCategoryList((prev) =>
        prev.includes(name) ? prev : [...prev, name]
      )
    }

    setCategoryName('')
    setOpenCategoryModal(false)
  }

  const handleOpenAddProduct = () => {
    resetProductForm()
    setSelectedCategory(currentCategories[0] || '')
    setOpenProductModal(true)
  }

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductName(product.name)
    setProductPrice(String(product.price))
    setSelectedCategory(product.category)
    setOpenProductModal(true)
  }

  const handleSaveProduct = () => {
    const name = productName.trim()
    const price = Number(productPrice)

    if (!name) return
    if (Number.isNaN(price) || price < 0) return

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id
            ? {
                ...item,
                name,
                price,
                category: selectedCategory || currentCategories[0] || 'Khác',
              }
            : item
        )
      )
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name,
        category: selectedCategory || currentCategories[0] || 'Khác',
        price,
        type: activeTab,
      }

      setProducts((prev) => [...prev, newProduct])
    }

    resetProductForm()
    setOpenProductModal(false)
  }

  const handleOpenDeleteProduct = (id: number) => {
    setSelectedProductId(id)
    setOpenDeleteModal(true)
  }

  const handleConfirmDeleteProduct = () => {
    if (selectedProductId === null) return

    setProducts((prev) =>
      prev.filter((item) => item.id !== selectedProductId)
    )

    setSelectedProductId(null)
    setOpenDeleteModal(false)
  }

  const tabClass = (tab: ProductType) =>
    activeTab === tab
      ? 'bg-[#2563EB] text-white'
      : 'bg-[#E5E7EB] text-gray-700 hover:bg-[#D1D5DB]'

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] font-['Inter',sans-serif] text-black">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <section className="mx-auto max-w-[1160px] rounded-3xl bg-white p-7 shadow-sm">
          <header className="mb-7 flex items-center justify-between rounded-2xl bg-[#F3F4F6] px-7 py-5">
            <h1 className="text-[28px] font-bold">Quản lý sản phẩm</h1>
            <span className="text-sm text-gray-600">👤 Admin</span>
          </header>

          <div className="mb-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveTab('laptop')
                setKeyword('')
              }}
              className={`h-[44px] rounded-xl px-8 text-sm font-semibold transition-all ${tabClass(
                'laptop'
              )}`}
            >
              Laptop / PC
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('account')
                setKeyword('')
              }}
              className={`h-[44px] rounded-xl px-8 text-sm font-semibold transition-all ${tabClass(
                'account'
              )}`}
            >
              Account số
            </button>
          </div>

          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={
                activeTab === 'laptop'
                  ? '🔍 Tìm kiếm laptop / PC...'
                  : '🔍 Tìm kiếm account số...'
              }
              className="h-[46px] w-full rounded-xl bg-[#F3F4F6] px-5 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20 md:w-[360px]"
            />

            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="h-[46px] rounded-xl bg-[#2563EB] px-8 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
            >
              + Thêm sản phẩm
            </button>
          </div>

          <section className="mb-7 rounded-3xl bg-[#F9FAFB] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                CRUD Danh mục{' '}
                {activeTab === 'laptop' ? 'Laptop / PC' : 'Account số'}
              </h2>

              <button
                type="button"
                onClick={() => setOpenCategoryModal(true)}
                className="h-[46px] rounded-xl bg-[#10B981] px-8 text-sm font-semibold text-white hover:bg-[#059669]"
              >
                + Thêm danh mục
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              {currentCategories.map((item) => (
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
            <h2 className="mb-5 text-xl font-bold">
              CRUD Sản phẩm{' '}
              {activeTab === 'laptop' ? 'Laptop / PC' : 'Account số'}
            </h2>

            <div className="overflow-x-auto">
              <div className="min-w-[960px] overflow-hidden rounded-2xl bg-white">
                <div className="grid grid-cols-[120px_1fr_160px_160px_180px] bg-[#E5E7EB] px-6 py-4 text-sm font-bold">
                  <span>Hình ảnh</span>
                  <span>Tên sản phẩm</span>
                  <span>Danh mục</span>
                  <span>Giá</span>
                  <span>Thao tác</span>
                </div>

                {filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[120px_1fr_160px_160px_180px] items-center border-b border-gray-100 px-6 py-5 text-sm"
                  >
                    <div className="flex h-[48px] w-[56px] items-center justify-center rounded-lg bg-[#D1D5DB] text-xs text-gray-600">
                      IMG
                    </div>

                    <span>{item.name}</span>

                    <span className="text-gray-600">{item.category}</span>

                    <span className="font-semibold text-[#10B981]">
                      {formatPrice(item.price)}
                    </span>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProduct(item)}
                        className="rounded-lg bg-[#2563EB] px-4 py-2 text-white hover:bg-[#1D4ED8]"
                      >
                        Sửa
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDeleteProduct(item.id)}
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
            </div>
          </section>
        </section>

        <AppModal
          open={openCategoryModal}
          title="Thêm danh mục"
          onClose={() => {
            setCategoryName('')
            setOpenCategoryModal(false)
          }}
          footer={
            <>
              <button
                type="button"
                onClick={() => {
                  setCategoryName('')
                  setOpenCategoryModal(false)
                }}
                className="h-[42px] rounded-xl border border-gray-300 px-6 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleSaveCategory}
                className="h-[42px] rounded-xl bg-[#10B981] px-6 text-sm font-semibold text-white hover:bg-[#059669]"
              >
                Thêm
              </button>
            </>
          }
        >
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder={
              activeTab === 'laptop'
                ? 'Nhập danh mục laptop / PC'
                : 'Nhập danh mục account số'
            }
            className="h-[46px] w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#2563EB]"
          />
        </AppModal>

        <AppModal
          open={openProductModal}
          title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
          onClose={() => {
            resetProductForm()
            setOpenProductModal(false)
          }}
          footer={
            <>
              <button
                type="button"
                onClick={() => {
                  resetProductForm()
                  setOpenProductModal(false)
                }}
                className="h-[42px] rounded-xl border border-gray-300 px-6 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleSaveProduct}
                className="h-[42px] rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
              >
                {editingProduct ? 'Lưu' : 'Thêm'}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Tên sản phẩm"
              className="h-[46px] w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#2563EB]"
            />

            <input
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Giá sản phẩm"
              type="number"
              className="h-[46px] w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#2563EB]"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-[46px] w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#2563EB]"
            >
              {currentCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </AppModal>

        <AppModal
          open={openDeleteModal}
          title="Xác nhận xóa"
          onClose={() => setOpenDeleteModal(false)}
          footer={
            <>
              <button
                type="button"
                onClick={() => setOpenDeleteModal(false)}
                className="h-[42px] rounded-xl border border-gray-300 px-6 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
                className="h-[42px] rounded-xl bg-red-500 px-6 text-sm font-semibold text-white hover:bg-red-600"
              >
                Xóa
              </button>
            </>
          }
        >
          <p className="text-sm text-gray-600">
            Bạn có chắc muốn xóa sản phẩm này không? Hành động này chỉ đang mô
            phỏng ở FE.
          </p>
        </AppModal>
      </main>
    </div>
  )
}