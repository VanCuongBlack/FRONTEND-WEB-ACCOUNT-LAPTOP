import { useMemo, useState } from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import AppModal from '@/components/common/AppModal'
import { Search, Plus, Edit3, Trash2 } from 'lucide-react'

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

  return (
    <AdminLayout title="Quản lý sản phẩm" notificationCount={3}>
      <div className="space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800">

        {/* Title & Actions Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý sản phẩm</h1>
            <p className="text-sm text-slate-500 mt-1">Xem, thêm, sửa, xóa các sản phẩm Laptop/PC và Account số trên hệ thống.</p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => {
                setActiveTab('laptop')
                setKeyword('')
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'laptop'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Laptop / PC
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('account')
                setKeyword('')
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'account'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Account số
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={
                  activeTab === 'laptop'
                    ? 'Tìm kiếm laptop / PC...'
                    : 'Tìm kiếm account số...'
                }
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            {/* Add Product Button */}
            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              Danh mục {activeTab === 'laptop' ? 'Laptop / PC' : 'Account số'}
            </h2>

            <button
              type="button"
              onClick={() => setOpenCategoryModal(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm danh mục
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {currentCategories.map((item) => (
              <span
                key={item}
                className="inline-flex px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/60 text-xs font-semibold text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Products Table Section */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              Danh sách sản phẩm {activeTab === 'laptop' ? 'Laptop / PC' : 'Account số'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Hình ảnh</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên sản phẩm</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex h-10 w-12 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-400 border border-slate-200/60">
                        IMG
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Sửa sản phẩm"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDeleteProduct(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400 font-medium">
                      Không tìm thấy sản phẩm nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer Section */}
        <p className="text-center text-xs text-slate-400 py-4 border-t border-slate-100">
          © 2024 Admin Panel. Hệ thống Quản lý Sản phẩm Laptop & Account Số.
        </p>

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

      </div>
    </AdminLayout>
  )
}