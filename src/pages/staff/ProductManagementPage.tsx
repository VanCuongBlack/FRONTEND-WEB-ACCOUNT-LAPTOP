import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Edit3, Eye, EyeOff, Plus, Search, Settings2, Trash2 } from 'lucide-react'
import AppModal from '@/components/common/AppModal'
import ImageUploadField from '@/components/common/ImageUploadField'
import StaffLayout from '@/layouts/StaffLayout'
import { getProductById, type ProductItem } from '@/services/product.service'
import type { UploadedImage } from '@/services/upload.service'
import {
  createDigitalProduct,
  createPhysicalProduct,
  deactivateProduct,
  deleteProduct,
  getAllProducts,
  updateDigitalProduct,
  updateDigitalProductItem,
  updatePhysicalProduct,
  updatePhysicalProductItem,
} from '@/services/staff-product.service'

type ProductType = 'physical' | 'digital'
type ActionKind = 'activate' | 'deactivate' | 'delete'

interface ProductRow {
  id: string
  name: string
  description?: string
  price: number
  type: ProductType
  active: boolean
  brand?: string
  model?: string
  platform?: string
  category?: string
}

interface ProductForm {
  productType: ProductType
  name: string
  description: string
  basePrice: string
  brand: string
  model: string
  weightKg: string
  cpu: string
  gpu: string
  ram: string
  storage: string
  displayInches: string
  os: string
  conditionPercent: string
  warrantyMonths: string
  importantPrice: string
  physicalItemId: string
  serialNumber: string
  imageUrls: string
  imageAssets: UploadedImage[]
  physicalSalePrice: string
  platform: string
  category: string
  region: string
  durationMonths: string
  accountEmail: string
  accountPassword: string
  expiredAt: string
  digitalSalePrice: string
}

interface ItemForm {
  itemId: string
  productType: ProductType
  serialNumber: string
  imageUrls: string
  imageAssets: UploadedImage[]
  physicalStatus: 'available' | 'reserved' | 'sold'
  accountEmail: string
  accountPassword: string
  expiredAt: string
  digitalStatus: 'available' | 'sold' | 'expired'
  salePrice: string
}

const emptyProductForm: ProductForm = {
  productType: 'physical',
  name: '',
  description: '',
  basePrice: '',
  brand: '',
  model: '',
  weightKg: '',
  cpu: '',
  gpu: '',
  ram: '',
  storage: '',
  displayInches: '',
  os: '',
  conditionPercent: '',
  warrantyMonths: '',
  importantPrice: '',
  physicalItemId: '',
  serialNumber: '',
  imageUrls: '',
  imageAssets: [],
  physicalSalePrice: '',
  platform: '',
  category: '',
  region: 'VN',
  durationMonths: '',
  accountEmail: '',
  accountPassword: '',
  expiredAt: '',
  digitalSalePrice: '',
}

const emptyItemForm: ItemForm = {
  itemId: '',
  productType: 'physical',
  serialNumber: '',
  imageUrls: '',
  imageAssets: [],
  physicalStatus: 'available',
  accountEmail: '',
  accountPassword: '',
  expiredAt: '',
  digitalStatus: 'available',
  salePrice: '',
}

const inputClass =
  'h-[42px] w-full rounded-xl border border-white/10 bg-[#181B22] text-white px-3 text-sm outline-none focus:border-blue-600 focus:bg-[#181B22] transition-colors'
const textareaClass =
  'w-full resize-none rounded-xl border border-white/10 bg-[#181B22] text-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-[#181B22] transition-colors'

function formatPrice(price: number) {
  return `${(price ?? 0).toLocaleString('vi-VN')}đ`
}

function toNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : NaN
}

function splitUrls(value: string) {
  return value
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean)
}

function normalizeImageAssets(images?: Array<string | UploadedImage>): UploadedImage[] {
  return (images ?? [])
    .map((image) => {
      if (typeof image === 'string') return { url: image, public_id: `manual-${image}` }
      return image
    })
    .filter((image): image is UploadedImage => Boolean(image?.url))
}

function buildImagePayload(imageUrls: string, imageAssets: UploadedImage[]) {
  const uploadedByUrl = new Map(imageAssets.filter((image) => image.url).map((image) => [image.url, image]))
  return splitUrls(imageUrls).map((url) => uploadedByUrl.get(url) ?? { url, public_id: `manual-${url}` })
}

function toDateInput(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function hasInvalidUrl(urls: string[]) {
  return urls.some((url) => {
    try {
      new URL(url)
      return false
    } catch {
      return true
    }
  })
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [items, setItems] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<ProductType>('physical')
  const [keyword, setKeyword] = useState('')
  const [openProductModal, setOpenProductModal] = useState(false)
  const [openItemModal, setOpenItemModal] = useState(false)
  const [openActionModal, setOpenActionModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null)
  const [actionKind, setActionKind] = useState<ActionKind>('deactivate')
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm)
  const [itemForm, setItemForm] = useState<ItemForm>(emptyItemForm)
  const [error, setError] = useState('')

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAllProducts({ limit: 200 })
      const rows: ProductRow[] =
        res.data.data?.products?.map((item: any) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          price: item.base_price ?? 0,
          type: (item.product_type === 'physical' ? 'physical' : 'digital') as ProductType,
          active: item.is_active !== false,
          brand: item.physical?.brand ?? item.brand,
          model: item.physical?.model ?? item.model,
          platform: item.digital?.platform ?? item.platform,
          category: item.digital?.category ?? item.category,
        })) ?? []
      setProducts(rows)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải sản phẩm.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const search = keyword.toLowerCase().trim()
    return products.filter((item) => {
      const matchType = item.type === activeTab
      const matchSearch =
        !search ||
        `${item.name} ${item.description ?? ''} ${item.brand ?? ''} ${item.model ?? ''} ${item.platform ?? ''} ${item.category ?? ''}`
          .toLowerCase()
          .includes(search)
      return matchType && matchSearch
    })
  }, [products, keyword, activeTab])

  const updateProductForm = (patch: Partial<ProductForm>) => {
    setProductForm((prev) => ({ ...prev, ...patch }))
  }

  const updateItemForm = (patch: Partial<ItemForm>) => {
    setItemForm((prev) => ({ ...prev, ...patch }))
  }

  const openAddProduct = () => {
    setEditingProduct(null)
    setProductForm({ ...emptyProductForm, productType: activeTab })
    setError('')
    setOpenProductModal(true)
  }

  const openEditProduct = async (product: ProductRow) => {
    setSaving(true)
    setError('')
    try {
      const res = await getProductById(product.id)
      const detail = res.data.data
      const firstItem = detail?.items?.[0]
      const imageAssets = normalizeImageAssets(firstItem?.images_urls)
      setEditingProduct(product)
      setProductForm({
        ...emptyProductForm,
        productType: product.type,
        name: detail?.product?.name ?? product.name,
        description: detail?.product?.description ?? product.description ?? '',
        basePrice: String(detail?.product?.base_price ?? product.price),
        brand: detail?.physical?.brand ?? product.brand ?? '',
        model: detail?.physical?.model ?? product.model ?? '',
        weightKg: String(detail?.physical?.weight_kg ?? ''),
        cpu: detail?.physical?.cpu ?? '',
        gpu: detail?.physical?.gpu ?? '',
        ram: detail?.physical?.ram ?? '',
        storage: detail?.physical?.storage ?? '',
        displayInches: String(detail?.physical?.display_inches ?? ''),
        os: detail?.physical?.os ?? '',
        conditionPercent: String(detail?.physical?.condition_percent ?? ''),
        warrantyMonths: String(detail?.physical?.warranty_months ?? ''),
        importantPrice: String(detail?.physical?.important_price ?? ''),
        physicalItemId: firstItem?._id ?? '',
        serialNumber: firstItem?.serial_number ?? '',
        physicalSalePrice: String(firstItem?.sale_price ?? ''),
        imageUrls: imageAssets.map((image) => image.url).join('\n'),
        imageAssets,
        platform: detail?.digital?.platform ?? product.platform ?? '',
        category: detail?.digital?.category ?? product.category ?? '',
        region: detail?.digital?.region ?? 'VN',
        durationMonths: String(detail?.digital?.duration_months ?? ''),
      })
      setOpenProductModal(true)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải chi tiết sản phẩm.')
    } finally {
      setSaving(false)
    }
  }

  const openEditItem = async (product: ProductRow) => {
    setSaving(true)
    setError('')
    try {
      const res = await getProductById(product.id)
      const detailItems = res.data.data?.items ?? []
      const firstItem = detailItems[0]
      setItems(detailItems)
      setSelectedProduct(product)
      const imageAssets = normalizeImageAssets(firstItem?.images_urls)
      setItemForm({
        ...emptyItemForm,
        productType: product.type,
        itemId: firstItem?._id ?? '',
        serialNumber: firstItem?.serial_number ?? '',
        imageUrls: imageAssets.map((image) => image.url).join('\n'),
        imageAssets,
        physicalStatus:
          firstItem?.status === 'reserved' || firstItem?.status === 'sold'
            ? firstItem.status
            : 'available',
        accountEmail: firstItem?.account_email ?? '',
        accountPassword: '',
        expiredAt: toDateInput(firstItem?.expired_at),
        digitalStatus:
          firstItem?.status === 'sold' || firstItem?.status === 'expired'
            ? firstItem.status
            : 'available',
        salePrice: String(firstItem?.sale_price ?? ''),
      })
      setOpenItemModal(true)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải item sản phẩm.')
    } finally {
      setSaving(false)
    }
  }

  const handleSelectItem = (itemId: string) => {
    const item = items.find((row) => row._id === itemId)
    if (!item) {
      updateItemForm({ itemId })
      return
    }

    const imageAssets = normalizeImageAssets(item.images_urls)
    setItemForm((prev) => ({
      ...prev,
      itemId,
      serialNumber: item.serial_number ?? '',
      imageUrls: imageAssets.map((image) => image.url).join('\n'),
      imageAssets,
      physicalStatus:
        item.status === 'reserved' || item.status === 'sold' ? item.status : 'available',
      accountEmail: item.account_email ?? '',
      accountPassword: '',
      expiredAt: toDateInput(item.expired_at),
      digitalStatus: item.status === 'sold' || item.status === 'expired' ? item.status : 'available',
      salePrice: String(item.sale_price ?? ''),
    }))
  }

  const validateCommonProduct = () => {
    const basePrice = toNumber(productForm.basePrice)
    if (productForm.name.trim().length < 3) return 'Tên sản phẩm cần ít nhất 3 ký tự.'
    if (Number.isNaN(basePrice) || basePrice < 0) return 'Giá niêm yết phải là số không âm.'
    return ''
  }

  const saveProduct = async () => {
    const commonError = validateCommonProduct()
    if (commonError) {
      setError(commonError)
      return
    }

    const basePrice = toNumber(productForm.basePrice)
    setSaving(true)
    setError('')

    try {
      if (editingProduct) {
        if (editingProduct.type === 'physical') {
          const urls = splitUrls(productForm.imageUrls)
          const images = buildImagePayload(productForm.imageUrls, productForm.imageAssets)
          if (hasInvalidUrl(urls)) {
            setError('Link ảnh phải là URL hợp lệ, mỗi dòng một URL.')
            return
          }

          await updatePhysicalProduct(editingProduct.id, {
            productData: {
              name: productForm.name.trim(),
              description: productForm.description.trim(),
              base_price: basePrice,
            },
            physicalData: {
              ...(productForm.brand.trim() ? { brand: productForm.brand.trim() } : {}),
              ...(productForm.model.trim() ? { model: productForm.model.trim() } : {}),
              ...(productForm.weightKg ? { weight_kg: toNumber(productForm.weightKg) } : {}),
              ...(productForm.cpu.trim() ? { cpu: productForm.cpu.trim() } : {}),
              ...(productForm.gpu.trim() ? { gpu: productForm.gpu.trim() } : {}),
              ...(productForm.ram.trim() ? { ram: productForm.ram.trim() } : {}),
              ...(productForm.storage.trim() ? { storage: productForm.storage.trim() } : {}),
              ...(productForm.displayInches
                ? { display_inches: toNumber(productForm.displayInches) }
                : {}),
              ...(productForm.os.trim() ? { os: productForm.os.trim() } : {}),
              ...(productForm.conditionPercent
                ? { condition_percent: toNumber(productForm.conditionPercent) }
                : {}),
              ...(productForm.warrantyMonths
                ? { warranty_months: toNumber(productForm.warrantyMonths) }
                : {}),
              ...(productForm.importantPrice
                ? { important_price: toNumber(productForm.importantPrice) }
              : {}),
            },
          })

          if (productForm.physicalItemId) {
            const salePrice = toNumber(productForm.physicalSalePrice)
            await updatePhysicalProductItem(productForm.physicalItemId, {
              ...(productForm.serialNumber.trim() ? { serial_number: productForm.serialNumber.trim() } : {}),
              images_urls: images,
              ...(Number.isNaN(salePrice) || salePrice < 0 ? {} : { sale_price: salePrice }),
            })
          }
        } else {
          await updateDigitalProduct(editingProduct.id, {
            productData: {
              name: productForm.name.trim(),
              description: productForm.description.trim(),
              base_price: basePrice,
            },
            digitalData: {
              ...(productForm.platform.trim() ? { platform: productForm.platform.trim() } : {}),
              ...(productForm.category.trim() ? { category: productForm.category.trim() } : {}),
              ...(productForm.region.trim() ? { region: productForm.region.trim() } : {}),
              ...(productForm.durationMonths
                ? { duration_months: toNumber(productForm.durationMonths) }
                : {}),
            },
          })
        }
      } else if (productForm.productType === 'physical') {
        const urls = splitUrls(productForm.imageUrls)
        const images = buildImagePayload(productForm.imageUrls, productForm.imageAssets)
        const numbers = {
          weight_kg: toNumber(productForm.weightKg),
          display_inches: toNumber(productForm.displayInches),
          condition_percent: toNumber(productForm.conditionPercent),
          warranty_months: toNumber(productForm.warrantyMonths),
          important_price: toNumber(productForm.importantPrice),
          sale_price: toNumber(productForm.physicalSalePrice),
        }

        if (
          !productForm.brand.trim() ||
          !productForm.model.trim() ||
          !productForm.cpu.trim() ||
          !productForm.gpu.trim() ||
          !productForm.ram.trim() ||
          !productForm.storage.trim() ||
          !productForm.os.trim() ||
          !productForm.serialNumber.trim()
        ) {
          setError('Laptop/PC cần đủ thương hiệu, model, CPU, GPU, RAM, ổ cứng, hệ điều hành và số serial.')
          return
        }

        if (
          Object.values(numbers).some((value) => Number.isNaN(value) || value < 0) ||
          numbers.condition_percent > 100
        ) {
          setError('Các trường số của laptop/PC phải hợp lệ; condition_percent từ 0 đến 100.')
          return
        }

        if (hasInvalidUrl(urls)) {
          setError('Link ảnh phải là URL hợp lệ, mỗi dòng một URL.')
          return
        }

        await createPhysicalProduct({
          productData: {
            name: productForm.name.trim(),
            description: productForm.description.trim(),
            base_price: basePrice,
          },
          physicalData: {
            brand: productForm.brand.trim(),
            model: productForm.model.trim(),
            weight_kg: numbers.weight_kg,
            cpu: productForm.cpu.trim(),
            gpu: productForm.gpu.trim(),
            ram: productForm.ram.trim(),
            storage: productForm.storage.trim(),
            display_inches: numbers.display_inches,
            os: productForm.os.trim(),
            condition_percent: numbers.condition_percent,
            warranty_months: numbers.warranty_months,
            important_price: numbers.important_price,
          },
          itemData: {
            serial_number: productForm.serialNumber.trim(),
            images_urls: images,
            status: 'available',
            sale_price: numbers.sale_price,
          },
        })
      } else {
        const durationMonths = toNumber(productForm.durationMonths)
        const salePrice = toNumber(productForm.digitalSalePrice)

        if (
          !productForm.platform.trim() ||
          !productForm.category.trim() ||
          !productForm.region.trim() ||
          !productForm.accountEmail.trim() ||
          !productForm.accountPassword
        ) {
          setError('Account cần đủ platform, category, region, email và mật khẩu.')
          return
        }

        if (Number.isNaN(durationMonths) || durationMonths < 1 || Number.isNaN(salePrice) || salePrice < 0) {
          setError('Thời hạn phải từ 1 tháng trở lên và giá bán không được âm.')
          return
        }

        await createDigitalProduct({
          productData: {
            name: productForm.name.trim(),
            description: productForm.description.trim(),
            base_price: basePrice,
          },
          digitalData: {
            platform: productForm.platform.trim(),
            category: productForm.category.trim(),
            region: productForm.region.trim(),
            duration_months: durationMonths,
          },
          itemData: {
            account_email: productForm.accountEmail.trim(),
            account_password: productForm.accountPassword,
            ...(productForm.expiredAt ? { expired_at: productForm.expiredAt } : {}),
            status: 'available',
            sale_price: salePrice,
          },
        })
      }

      setOpenProductModal(false)
      setProductForm(emptyProductForm)
      setEditingProduct(null)
      await loadProducts()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể lưu sản phẩm.')
    } finally {
      setSaving(false)
    }
  }

  const saveItem = async () => {
    if (!itemForm.itemId.trim()) {
      setError('Cần itemId để cập nhật item.')
      return
    }

    const salePrice = toNumber(itemForm.salePrice)
    if (Number.isNaN(salePrice) || salePrice < 0) {
      setError('Giá bán phải là số không âm.')
      return
    }

    setSaving(true)
    setError('')
    try {
      if (itemForm.productType === 'physical') {
        const urls = splitUrls(itemForm.imageUrls)
        const images = buildImagePayload(itemForm.imageUrls, itemForm.imageAssets)
        if (hasInvalidUrl(urls)) {
          setError('Link ảnh phải là URL hợp lệ, mỗi dòng một URL.')
          return
        }

        await updatePhysicalProductItem(itemForm.itemId.trim(), {
          ...(itemForm.serialNumber.trim() ? { serial_number: itemForm.serialNumber.trim() } : {}),
          images_urls: images,
          status: itemForm.physicalStatus,
          sale_price: salePrice,
        })
      } else {
        await updateDigitalProductItem(itemForm.itemId.trim(), {
          ...(itemForm.accountEmail.trim() ? { account_email: itemForm.accountEmail.trim() } : {}),
          ...(itemForm.accountPassword ? { account_password: itemForm.accountPassword } : {}),
          expired_at: itemForm.expiredAt || null,
          status: itemForm.digitalStatus,
          sale_price: salePrice,
        })
      }

      setOpenItemModal(false)
      setSelectedProduct(null)
      setItems([])
      setItemForm(emptyItemForm)
      await loadProducts()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể cập nhật item.')
    } finally {
      setSaving(false)
    }
  }

  const openAction = (product: ProductRow, kind: ActionKind) => {
    setSelectedProduct(product)
    setActionKind(kind)
    setOpenActionModal(true)
  }

  const confirmAction = async () => {
    if (!selectedProduct) return
    setSaving(true)
    setError('')
    try {
      if (actionKind === 'deactivate') {
        await deactivateProduct(selectedProduct.id)
      } else if (actionKind === 'activate') {
        const payload = { productData: { is_active: true } }
        if (selectedProduct.type === 'physical') {
          await updatePhysicalProduct(selectedProduct.id, payload)
        } else {
          await updateDigitalProduct(selectedProduct.id, payload)
        }
      } else {
        await deleteProduct(selectedProduct.id)
      }
      setOpenActionModal(false)
      setSelectedProduct(null)
      await loadProducts()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể cập nhật sản phẩm.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <StaffLayout title="Quản lý sản phẩm" notificationCount={0}>
      <div className="mx-auto w-full max-w-[1840px] space-y-6 font-sans text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-blue-400">Kho sản phẩm</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white">
              Quản lý sản phẩm
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Tạo, chỉnh sửa, ẩn sản phẩm và quản lý từng item trong kho.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddProduct}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-500 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Thêm sản phẩm
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#2A2F3B] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex w-fit flex-wrap gap-1 rounded-xl bg-[#181B22] p-1 border border-white/5">
            <TabButton active={activeTab === 'physical'} onClick={() => setActiveTab('physical')}>
              Laptop / PC
            </TabButton>
            <TabButton active={activeTab === 'digital'} onClick={() => setActiveTab('digital')}>
              Account số
            </TabButton>
          </div>

          <div className="relative flex-1 md:max-w-[420px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#909AAB]" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full rounded-xl border border-white/10 bg-[#181B22] py-2 pl-9 pr-4 text-sm text-white transition-colors focus:border-blue-600 focus:outline-none placeholder:text-[#909AAB]"
            />
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#2A2F3B] shadow-sm">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-[#181B22]">
            <h2 className="text-sm font-bold text-white">
              {loading ? 'Đang tải sản phẩm...' : `Danh sách (${filteredProducts.length})`}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-white">
              <thead>
                <tr className="border-b border-white/5 bg-[#181B22]">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-300">Tên sản phẩm</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-300">Loại</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-300">Nhóm</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-300">Giá nền</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-300">Trạng thái</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-300">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#2A2F3B]">
                {filteredProducts.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-[#202530] text-white">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      <p className="mt-0.5 max-w-[360px] truncate text-xs text-[#909AAB]">{item.id}</p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                      {item.type === 'physical' ? 'Laptop / PC' : 'Account'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                      {item.type === 'physical' ? item.brand || '-' : item.platform || item.category || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-emerald-400">
                      {formatPrice(item.price)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-bold ${
                          item.active ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-white/5 text-[#909AAB]'
                        }`}
                      >
                        {item.active ? 'Đang bán' : 'Đã ẩn'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <IconButton title="Sửa sản phẩm" onClick={() => openEditProduct(item)}>
                          <Edit3 className="h-4 w-4" />
                        </IconButton>
                        <IconButton title="Sửa item" onClick={() => openEditItem(item)}>
                          <Settings2 className="h-4 w-4" />
                        </IconButton>
                        {item.active ? (
                          <IconButton title="Ẩn sản phẩm" onClick={() => openAction(item, 'deactivate')}>
                            <EyeOff className="h-4 w-4" />
                          </IconButton>
                        ) : (
                          <IconButton title="Mở bán lại" onClick={() => openAction(item, 'activate')}>
                            <Eye className="h-4 w-4" />
                          </IconButton>
                        )}
                        <IconButton title="Xóa hẳn" danger onClick={() => openAction(item, 'delete')}>
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm font-medium text-slate-400">
                      Không tìm thấy sản phẩm phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <ProductModal
          open={openProductModal}
          editingProduct={editingProduct}
          form={productForm}
          saving={saving}
          onClose={() => setOpenProductModal(false)}
          onSave={saveProduct}
          updateForm={updateProductForm}
        />

        <ItemModal
          open={openItemModal}
          product={selectedProduct}
          items={items}
          form={itemForm}
          saving={saving}
          onClose={() => setOpenItemModal(false)}
          onSave={saveItem}
          onSelectItem={handleSelectItem}
          updateForm={updateItemForm}
        />

        <AppModal
          open={openActionModal}
          theme="dark"
          title={
            actionKind === 'activate'
              ? 'Mở bán lại sản phẩm'
              : actionKind === 'deactivate'
                ? 'Ẩn sản phẩm'
                : 'Xóa hẳn sản phẩm'
          }
          onClose={() => setOpenActionModal(false)}
          footer={
            <>
              <button
                type="button"
                onClick={() => setOpenActionModal(false)}
                className="h-[42px] rounded-xl border border-white/10 bg-[#181B22] text-slate-300 hover:bg-slate-800 cursor-pointer px-6 text-sm font-semibold"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={confirmAction}
                className={`h-[42px] rounded-xl px-6 text-sm font-semibold text-white disabled:opacity-60 cursor-pointer ${
                  actionKind === 'activate'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : actionKind === 'deactivate'
                      ? 'bg-slate-600 hover:bg-slate-500'
                      : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {saving
                  ? 'Đang xử lý...'
                  : actionKind === 'activate'
                    ? 'Mở bán lại'
                    : actionKind === 'deactivate'
                      ? 'Ẩn sản phẩm'
                      : 'Xóa hẳn'}
              </button>
            </>
          }
        >
          <p className="text-sm leading-6 text-slate-300">
            {actionKind === 'activate'
              ? 'Sản phẩm sẽ được hiển thị lại cho khách xem và mua nếu còn hàng.'
              : actionKind === 'deactivate'
                ? 'Sản phẩm sẽ ngừng hiển thị để khách mua, nhưng dữ liệu vẫn được giữ lại.'
                : 'Sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống. Chỉ dùng khi thật sự cần.'}
          </p>
        </AppModal>
      </div>
    </StaffLayout>
  )
}

function ProductModal({
  open,
  editingProduct,
  form,
  saving,
  onClose,
  onSave,
  updateForm,
}: {
  open: boolean
  editingProduct: ProductRow | null
  form: ProductForm
  saving: boolean
  onClose: () => void
  onSave: () => void
  updateForm: (patch: Partial<ProductForm>) => void
}) {
  const productType = editingProduct?.type ?? form.productType

  return (
    <AppModal
      open={open}
      theme="dark"
      title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="h-[42px] rounded-xl border border-white/10 bg-[#181B22] text-slate-300 hover:bg-slate-800 cursor-pointer px-6 text-sm font-semibold"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className="h-[42px] rounded-xl bg-blue-600 hover:bg-blue-500 cursor-pointer px-6 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </>
      }
    >
      <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
        {!editingProduct && (
          <Field label="Loại sản phẩm">
            <select
              value={form.productType}
              onChange={(event) => updateForm({ productType: event.target.value as ProductType })}
              className={inputClass}
            >
              <option value="physical">Laptop / PC</option>
              <option value="digital">Account số</option>
            </select>
          </Field>
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Tên sản phẩm">
            <input value={form.name} onChange={(event) => updateForm({ name: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Giá niêm yết">
            <input type="number" min="0" value={form.basePrice} onChange={(event) => updateForm({ basePrice: event.target.value })} className={inputClass} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Mô tả sản phẩm">
              <textarea value={form.description} onChange={(event) => updateForm({ description: event.target.value })} rows={3} className={textareaClass} />
            </Field>
          </div>
        </div>

        {productType === 'physical' ? (
          <PhysicalFields form={form} updateForm={updateForm} editing={Boolean(editingProduct)} />
        ) : (
          <DigitalFields form={form} updateForm={updateForm} editing={Boolean(editingProduct)} />
        )}
      </div>
    </AppModal>
  )
}

function ItemModal({
  open,
  product,
  items,
  form,
  saving,
  onClose,
  onSave,
  onSelectItem,
  updateForm,
}: {
  open: boolean
  product: ProductRow | null
  items: ProductItem[]
  form: ItemForm
  saving: boolean
  onClose: () => void
  onSave: () => void
  onSelectItem: (itemId: string) => void
  updateForm: (patch: Partial<ItemForm>) => void
}) {
  return (
    <AppModal
      open={open}
      theme="dark"
      title={`Sửa item${product ? ` - ${product.name}` : ''}`}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="h-[42px] rounded-xl border border-white/10 bg-[#181B22] text-slate-300 hover:bg-slate-800 cursor-pointer px-6 text-sm font-semibold"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className="h-[42px] rounded-xl bg-blue-600 hover:bg-blue-500 cursor-pointer px-6 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Đang lưu...' : 'Lưu item'}
          </button>
        </>
      }
    >
      <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        {items.length > 0 ? (
          <Field label="Chọn item trong kho">
            <select value={form.itemId} onChange={(event) => onSelectItem(event.target.value)} className={inputClass}>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item._id} - {item.status ?? 'unknown'} - {formatPrice(item.sale_price ?? 0)}
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">
            Chưa tìm thấy item cho sản phẩm này. Bạn có thể nhập mã item thủ công nếu đã biết.
          </div>
        )}

        <Field label="Mã item">
          <input value={form.itemId} onChange={(event) => updateForm({ itemId: event.target.value })} className={inputClass} />
        </Field>

        {form.productType === 'physical' ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Số serial">
              <input value={form.serialNumber} onChange={(event) => updateForm({ serialNumber: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Giá bán">
              <input type="number" min="0" value={form.salePrice} onChange={(event) => updateForm({ salePrice: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Trạng thái">
              <select
                value={form.physicalStatus}
                onChange={(event) => updateForm({ physicalStatus: event.target.value as ItemForm['physicalStatus'] })}
                className={inputClass}
              >
                <option value="available">Còn hàng</option>
                <option value="reserved">Đã giữ hàng</option>
                <option value="sold">Đã bán</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Link ảnh sản phẩm">
                <ImageUploadField
                  value={form.imageUrls}
                  images={form.imageAssets}
                  rows={4}
                  textareaClassName={textareaClass}
                  onChange={(imageUrls, imageAssets) => updateForm({ imageUrls, imageAssets })}
                />
              </Field>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Email đăng nhập">
              <input type="email" value={form.accountEmail} onChange={(event) => updateForm({ accountEmail: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Mật khẩu">
              <input value={form.accountPassword} onChange={(event) => updateForm({ accountPassword: event.target.value })} placeholder="Để trống nếu không đổi" className={inputClass} />
            </Field>
            <Field label="Ngày hết hạn">
              <input type="date" value={form.expiredAt} onChange={(event) => updateForm({ expiredAt: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Giá bán">
              <input type="number" min="0" value={form.salePrice} onChange={(event) => updateForm({ salePrice: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Trạng thái">
              <select
                value={form.digitalStatus}
                onChange={(event) => updateForm({ digitalStatus: event.target.value as ItemForm['digitalStatus'] })}
                className={inputClass}
              >
                <option value="available">Còn hàng</option>
                <option value="sold">Đã bán</option>
                <option value="expired">Hết hạn</option>
              </select>
            </Field>
          </div>
        )}
      </div>
    </AppModal>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
        active ? 'bg-[#2A2F3B] text-white shadow-sm border border-white/5' : 'text-[#909AAB] hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

function IconButton({
  title,
  danger,
  onClick,
  children,
}: {
  title: string
  danger?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
        danger
          ? 'text-slate-400 hover:bg-rose-500/10 hover:text-rose-400'
          : 'text-slate-400 hover:bg-blue-500/10 hover:text-blue-400'
      }`}
      title={title}
    >
      {children}
    </button>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-300">{label}</span>
      {children}
    </label>
  )
}

function PhysicalFields({
  form,
  updateForm,
  editing,
}: {
  form: ProductForm
  updateForm: (patch: Partial<ProductForm>) => void
  editing: boolean
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-black text-white">Thông số Laptop / PC</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Thương hiệu"><input value={form.brand} onChange={(event) => updateForm({ brand: event.target.value })} className={inputClass} /></Field>
        <Field label="Model"><input value={form.model} onChange={(event) => updateForm({ model: event.target.value })} className={inputClass} /></Field>
        <Field label="Trọng lượng (kg)"><input type="number" min="0" value={form.weightKg} onChange={(event) => updateForm({ weightKg: event.target.value })} className={inputClass} /></Field>
        <Field label="cpu"><input value={form.cpu} onChange={(event) => updateForm({ cpu: event.target.value })} className={inputClass} /></Field>
        <Field label="gpu"><input value={form.gpu} onChange={(event) => updateForm({ gpu: event.target.value })} className={inputClass} /></Field>
        <Field label="ram"><input value={form.ram} onChange={(event) => updateForm({ ram: event.target.value })} className={inputClass} /></Field>
        <Field label="Ổ cứng"><input value={form.storage} onChange={(event) => updateForm({ storage: event.target.value })} className={inputClass} /></Field>
        <Field label="Màn hình (inch)"><input type="number" min="0" value={form.displayInches} onChange={(event) => updateForm({ displayInches: event.target.value })} className={inputClass} /></Field>
        <Field label="Hệ điều hành"><input value={form.os} onChange={(event) => updateForm({ os: event.target.value })} className={inputClass} /></Field>
        <Field label="Tình trạng máy (%)"><input type="number" min="0" max="100" value={form.conditionPercent} onChange={(event) => updateForm({ conditionPercent: event.target.value })} className={inputClass} /></Field>
        <Field label="Bảo hành (tháng)"><input type="number" min="0" value={form.warrantyMonths} onChange={(event) => updateForm({ warrantyMonths: event.target.value })} className={inputClass} /></Field>
        <Field label="Giá nhập / giá quan trọng"><input type="number" min="0" value={form.importantPrice} onChange={(event) => updateForm({ importantPrice: event.target.value })} className={inputClass} /></Field>
        {!editing && (
          <>
            <Field label="Số serial"><input value={form.serialNumber} onChange={(event) => updateForm({ serialNumber: event.target.value })} className={inputClass} /></Field>
            <Field label="Giá bán"><input type="number" min="0" value={form.physicalSalePrice} onChange={(event) => updateForm({ physicalSalePrice: event.target.value })} className={inputClass} /></Field>
          </>
        )}
        {editing && !form.physicalItemId && (
          <div className="md:col-span-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-300">
            Sản phẩm này chưa có item kho nên chưa thể cập nhật ảnh tại đây. Hãy nhập kho item trước.
          </div>
        )}
        {(!editing || form.physicalItemId) && (
          <div className="md:col-span-2">
            <Field label={editing ? 'Ảnh sản phẩm của item đầu tiên' : 'Link ảnh sản phẩm'}>
              <ImageUploadField
                value={form.imageUrls}
                images={form.imageAssets}
                rows={3}
                textareaClassName={textareaClass}
                onChange={(imageUrls, imageAssets) => updateForm({ imageUrls, imageAssets })}
              />
            </Field>
          </div>
        )}
      </div>
    </div>
  )
}

function DigitalFields({
  form,
  updateForm,
  editing,
}: {
  form: ProductForm
  updateForm: (patch: Partial<ProductForm>) => void
  editing: boolean
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-black text-white">Thông tin account</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Nền tảng"><input value={form.platform} onChange={(event) => updateForm({ platform: event.target.value })} className={inputClass} /></Field>
        <Field label="Danh mục"><input value={form.category} onChange={(event) => updateForm({ category: event.target.value })} className={inputClass} /></Field>
        <Field label="Khu vực"><input value={form.region} onChange={(event) => updateForm({ region: event.target.value })} className={inputClass} /></Field>
        <Field label="Thời hạn (tháng)"><input type="number" min="1" value={form.durationMonths} onChange={(event) => updateForm({ durationMonths: event.target.value })} className={inputClass} /></Field>
        {!editing && (
          <>
            <Field label="Email đăng nhập"><input type="email" value={form.accountEmail} onChange={(event) => updateForm({ accountEmail: event.target.value })} className={inputClass} /></Field>
            <Field label="Mật khẩu"><input value={form.accountPassword} onChange={(event) => updateForm({ accountPassword: event.target.value })} className={inputClass} /></Field>
            <Field label="Ngày hết hạn"><input type="date" value={form.expiredAt} onChange={(event) => updateForm({ expiredAt: event.target.value })} className={inputClass} /></Field>
            <Field label="Giá bán"><input type="number" min="0" value={form.digitalSalePrice} onChange={(event) => updateForm({ digitalSalePrice: event.target.value })} className={inputClass} /></Field>
          </>
        )}
      </div>
    </div>
  )
}
