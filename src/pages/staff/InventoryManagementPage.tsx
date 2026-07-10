import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  AlertTriangle,
  Clock3,
  Database,
  FileClock,
  History,
  KeyRound,
  Laptop,
  PackagePlus,
  RefreshCw,
  Search,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import StaffLayout from '@/layouts/StaffLayout'
import ImageUploadField from '@/components/common/ImageUploadField'
import {
  getInventoryLogs,
  getLowStockAlerts,
  getStockSummary,
  stockInDigital,
  stockInPhysical,
  type InventoryLog,
  type StockSummaryItem,
} from '@/services/inventory.service'
import type { UploadedImage } from '@/services/upload.service'

type InventoryTab = 'stock' | 'stock-in' | 'history'
type ProductTypeFilter = 'all' | 'physical' | 'digital'

const inputClass =
  'h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-sky-500'
const textareaClass =
  'w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500'

interface StockInForm {
  productId: string
  productType: 'physical' | 'digital'
  salePrice: string
  note: string
  serialNumber: string
  imageUrls: string
  imageAssets: UploadedImage[]
  accountEmail: string
  accountPassword: string
  expiredAt: string
}

function emptyStockInForm(productType: 'physical' | 'digital' = 'physical'): StockInForm {
  return {
    productId: '',
    productType,
    salePrice: '',
    note: '',
    serialNumber: '',
    imageUrls: '',
    imageAssets: [],
    accountEmail: '',
    accountPassword: '',
    expiredAt: '',
  }
}

function getStockItems(data: any): StockSummaryItem[] {
  if (!data) return []
  const normalize = (item: StockSummaryItem): StockSummaryItem => ({
    ...item,
    available: item.available ?? item.stock?.available ?? 0,
    reserved: item.reserved ?? item.stock?.reserved ?? 0,
    sold: item.sold ?? item.stock?.sold ?? 0,
    total: item.total ?? item.stock?.total,
    min_sale_price: item.min_sale_price ?? item.base_price,
    max_sale_price: item.max_sale_price ?? item.base_price,
  })
  if (Array.isArray(data.items)) return data.items.map(normalize)
  if (Array.isArray(data.data)) return data.data.map(normalize)
  if (Array.isArray(data.products)) return data.products.map(normalize)
  if (data.physical || data.digital) {
    return [
      ...getStockItems(data.physical).map((item) => ({
        ...item,
        product_type: 'physical' as const,
      })),
      ...getStockItems(data.digital).map((item) => ({
        ...item,
        product_type: 'digital' as const,
      })),
    ]
  }
  return []
}

function itemName(item: StockSummaryItem) {
  return item.name || item.product_name || 'Sản phẩm'
}

function itemId(item: StockSummaryItem) {
  return item.product_id || item._id || itemName(item)
}

function refId(value: unknown) {
  if (!value) return 'N/A'
  if (typeof value === 'string') return value
  if (typeof value === 'object' && '_id' in value) {
    const id = (value as { _id?: unknown })._id
    return typeof id === 'string' ? id : 'N/A'
  }
  return 'N/A'
}

function productLogName(log: InventoryLog) {
  const product = log.product_id
  if (product && typeof product === 'object') {
    return product.name || refId(product)
  }
  return refId(product)
}

function itemTotal(item: StockSummaryItem) {
  return item.total ?? (item.available ?? 0) + (item.reserved ?? 0) + (item.sold ?? 0)
}

function stockItemKind(item: StockSummaryItem): 'physical' | 'digital' {
  return item.product_type === 'digital' ? 'digital' : 'physical'
}

function stockItemPrice(item?: StockSummaryItem) {
  return item?.min_sale_price ?? item?.max_sale_price ?? item?.base_price ?? ''
}

function makeSerialNumber() {
  const now = new Date()
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('')
  const time = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('')
  return `LP-${stamp}-${time}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

function formatDate(value?: string) {
  if (!value) return 'Chưa có thời gian'
  return new Date(value).toLocaleString('vi-VN')
}

function formatAction(action?: string) {
  if (action === 'stock_in') return 'Nhập kho'
  if (action === 'stock_out') return 'Xuất kho'
  if (action === 'adjustment') return 'Điều chỉnh'
  return action || 'Không rõ'
}

function parseUrls(value: string) {
  return value
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean)
}

function buildImageObjects(imageUrls: string, imageAssets: UploadedImage[]) {
  const uploadedImages = imageAssets
    .filter((image) => image.url && image.public_id)
    .map((image) => ({ url: image.url, public_id: image.public_id }))
  const manualImages = parseUrls(imageUrls).map((url) => ({
    url,
    public_id: `manual-${url}`,
  }))
  const images = [...uploadedImages, ...manualImages]
  const seen = new Set<string>()
  return images.filter((image) => {
    if (seen.has(image.url)) return false
    seen.add(image.url)
    return true
  })
}

function hasInvalidUrl(images: Array<{ url: string }>) {
  return images.some((image) => {
    try {
      new URL(image.url)
      return false
    } catch {
      return true
    }
  })
}

export default function InventoryManagementPage() {
  const [activeTab, setActiveTab] = useState<InventoryTab>('stock')
  const [items, setItems] = useState<StockSummaryItem[]>([])
  const [logs, setLogs] = useState<InventoryLog[]>([])
  const [lowStockCount, setLowStockCount] = useState(0)
  const [search, setSearch] = useState('')
  const [type, setType] = useState<ProductTypeFilter>('all')
  const [logAction, setLogAction] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [stockInForm, setStockInForm] = useState<StockInForm>(() => emptyStockInForm())

  const apiProductType = type === 'all' ? undefined : type

  const loadInventory = async () => {
    setIsLoading(true)
    setError('')
    try {
      const [stockRes, lowRes] = await Promise.all([
        getStockSummary({
          product_type: apiProductType,
          search: search.trim() || undefined,
          limit: 100,
        }),
        getLowStockAlerts({
          threshold: 5,
          product_type: apiProductType,
        }),
      ])
      setItems(getStockItems(stockRes.data?.data))
      setLowStockCount(lowRes.data?.data?.total_alerts ?? 0)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải dữ liệu kho.')
      setItems([])
      setLowStockCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  const loadLogs = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await getInventoryLogs({
        product_type: apiProductType,
        action: logAction || undefined,
        page: 1,
        limit: 30,
      })
      setLogs(res.data?.data?.logs ?? [])
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải lịch sử kho.')
      setLogs([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [type])

  useEffect(() => {
    if (activeTab === 'history') loadLogs()
  }, [activeTab, type, logAction])

  const makeStockInForm = (productType: 'physical' | 'digital'): StockInForm => {
    const candidate = items.find((item) => stockItemKind(item) === productType)
    return {
      ...emptyStockInForm(productType),
      productId: candidate ? String(itemId(candidate)) : '',
      salePrice: candidate ? String(stockItemPrice(candidate)) : '',
      serialNumber: productType === 'physical' ? makeSerialNumber() : '',
    }
  }

  useEffect(() => {
    if (activeTab !== 'stock-in') return

    setStockInForm((prev) => {
      const candidate = items.find((item) => stockItemKind(item) === prev.productType)
      const shouldFillProduct = !prev.productId.trim() && Boolean(candidate)
      const shouldFillSerial = prev.productType === 'physical' && !prev.serialNumber.trim()

      if (!shouldFillProduct && !shouldFillSerial) return prev

      return {
        ...prev,
        productId: shouldFillProduct && candidate ? String(itemId(candidate)) : prev.productId,
        salePrice: shouldFillProduct && candidate && !prev.salePrice.trim() ? String(stockItemPrice(candidate)) : prev.salePrice,
        serialNumber: shouldFillSerial ? makeSerialNumber() : prev.serialNumber,
      }
    })
  }, [activeTab, items, stockInForm.productType])

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return items
    return items.filter((item) =>
      `${itemName(item)} ${item.product_id ?? ''} ${item._id ?? ''} ${item.category ?? ''} ${item.brand ?? ''}`
        .toLowerCase()
        .includes(keyword)
    )
  }, [items, search])

  const totals = useMemo<{ total: number; available: number; reserved: number; sold: number }>(() => {
    return filteredItems.reduce<{ total: number; available: number; reserved: number; sold: number }>(
      (sum, item) => ({
        total: sum.total + itemTotal(item),
        available: sum.available + (item.available ?? 0),
        reserved: sum.reserved + (item.reserved ?? 0),
        sold: sum.sold + (item.sold ?? 0),
      }),
      { total: 0, available: 0, reserved: 0, sold: 0 }
    )
  }, [filteredItems])

  const statCards: Array<[string, number, LucideIcon, string, string]> = [
    ['Tổng item', totals.total, Database, 'bg-sky-50 text-sky-600', 'Tất cả item đang theo dõi'],
    ['Còn sẵn', totals.available, ShieldCheck, 'bg-emerald-50 text-emerald-600', 'Có thể bán ngay'],
    ['Đang giữ', totals.reserved, Clock3, 'bg-amber-50 text-amber-600', 'Đã tạo đơn, chờ xử lý'],
    ['Sắp hết hàng', lowStockCount, AlertTriangle, 'bg-rose-50 text-rose-600', 'Theo ngưỡng 5 item'],
  ]

  const handlePickProduct = (item: StockSummaryItem) => {
    const productType = stockItemKind(item)
    setStockInForm((prev) => ({
      ...prev,
      productId: String(itemId(item)),
      productType,
      salePrice: String(stockItemPrice(item)),
      serialNumber: productType === 'physical' ? makeSerialNumber() : '',
    }))
    setActiveTab('stock-in')
    setSuccess('')
  }

  const handleStockIn = async () => {
    const productId = stockInForm.productId.trim()
    const salePrice = Number(stockInForm.salePrice)

    if (!productId || Number.isNaN(salePrice) || salePrice < 0) {
      setError('Vui lòng chọn sản phẩm và nhập giá bán hợp lệ.')
      return
    }

    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      if (stockInForm.productType === 'physical') {
        const imageUrls = buildImageObjects(stockInForm.imageUrls, stockInForm.imageAssets)
        if (!stockInForm.serialNumber.trim()) {
          setError('Số serial là bắt buộc cho Laptop/PC.')
          return
        }
        if (hasInvalidUrl(imageUrls)) {
          setError('Link ảnh phải là URL hợp lệ, mỗi dòng một URL.')
          return
        }
        await stockInPhysical(productId, {
          serial_number: stockInForm.serialNumber.trim(),
          ...(imageUrls[0] ? { image: imageUrls[0] } : {}),
          sale_price: salePrice,
          status: 'available',
          note: stockInForm.note.trim() || undefined,
        })
      } else {
        if (!stockInForm.accountEmail.trim() || !stockInForm.accountPassword.trim()) {
          setError('Email đăng nhập và mật khẩu là bắt buộc cho account số.')
          return
        }
        await stockInDigital(productId, {
          account_email: stockInForm.accountEmail.trim(),
          account_password: stockInForm.accountPassword,
          expired_at: stockInForm.expiredAt || null,
          sale_price: salePrice,
          status: 'available',
          note: stockInForm.note.trim() || undefined,
        })
      }

      setSuccess('Nhập kho thành công.')
      setStockInForm(makeStockInForm(stockInForm.productType))
      await Promise.all([loadInventory(), loadLogs()])
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể nhập kho.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <StaffLayout title="Quản lý kho" notificationCount={lowStockCount}>
      <div className="mx-auto max-w-[1840px] space-y-6 font-sans text-white">
        <section className="overflow-hidden rounded-2xl bg-[#2A2F3B] border border-white/10 shadow-sm">
          <div className="grid gap-5 bg-[#181B22] px-5 py-6 text-white lg:grid-cols-[1.4fr_1fr] lg:px-7 border-b border-white/10">
            <div>
              <p className="text-xs font-bold uppercase text-blue-400">Kho hàng</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight">
                Quản lý tồn kho laptop và account
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Theo dõi tồn kho, nhập item mới và xem lịch sử thay đổi số lượng.
              </p>
            </div>
            <div className="flex flex-wrap items-end justify-start gap-2 lg:justify-end">
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'history') loadLogs()
                  else loadInventory()
                }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2A2F3B] border border-white/10 px-4 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                Tải lại
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stock-in')}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer"
              >
                <PackagePlus className="h-4 w-4" />
                Nhập kho
              </button>
            </div>
          </div>

          <div className="border-b border-white/10 bg-[#2A2F3B] px-4 py-3">
            <div className="flex flex-wrap gap-2">
              <TabButton active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} icon={<Database className="h-4 w-4" />}>
                Tồn kho
              </TabButton>
              <TabButton active={activeTab === 'stock-in'} onClick={() => setActiveTab('stock-in')} icon={<PackagePlus className="h-4 w-4" />}>
                Nhập kho
              </TabButton>
              <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History className="h-4 w-4" />}>
                Lịch sử kho
              </TabButton>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(([label, value, Icon, color, note]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-[#2A2F3B] p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-[#181B22] border border-white/5 px-2.5 py-1 text-[11px] font-bold text-[#909AAB]">Đang đồng bộ</span>
              </div>
              <p className="mt-4 text-xs font-bold uppercase text-[#909AAB]">{label}</p>
              <h3 className="mt-1 text-3xl font-black text-white">{value.toLocaleString('vi-VN')}</h3>
              <p className="mt-1 text-xs text-slate-400">{note}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#2A2F3B] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <select
            value={type}
            onChange={(event) => setType(event.target.value as ProductTypeFilter)}
            className="h-10 rounded-xl border border-white/10 bg-[#181B22] px-4 text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả loại sản phẩm</option>
            <option value="physical">Laptop / sản phẩm vật lý</option>
            <option value="digital">Account số</option>
          </select>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#909AAB]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && loadInventory()}
              placeholder="Tìm tên, mã sản phẩm..."
              className="h-10 w-full rounded-xl border border-white/10 bg-[#181B22] pl-9 pr-4 text-xs focus:border-blue-600 focus:outline-none text-white placeholder:text-[#909AAB]"
            />
          </div>
        </div>

        {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200">{error}</div>}
        {success && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-255">{success}</div>}

        {activeTab === 'stock' && (
          <StockTable isLoading={isLoading} items={filteredItems} onPickProduct={handlePickProduct} />
        )}

        {activeTab === 'stock-in' && (
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-2xl border border-white/10 bg-[#2A2F3B] p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-black text-white">Nhập kho mới</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Nhập thêm hàng vào kho. Hình ảnh hiện dùng link ảnh hợp lệ.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 text-xs font-bold text-emerald-400">available</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Mã sản phẩm">
                  <input value={stockInForm.productId} onChange={(event) => setStockInForm((prev) => ({ ...prev, productId: event.target.value }))} placeholder="Tự điền từ sản phẩm đầu tiên trong tồn kho" className={inputClass} />
                </Field>

                <Field label="Loại sản phẩm">
                  <select value={stockInForm.productType} onChange={(event) => setStockInForm(makeStockInForm(event.target.value as 'physical' | 'digital'))} className={inputClass}>
                    <option value="physical">Laptop / PC</option>
                    <option value="digital">Account số</option>
                  </select>
                </Field>

                <Field label="Giá bán">
                  <input value={stockInForm.salePrice} onChange={(event) => setStockInForm((prev) => ({ ...prev, salePrice: event.target.value }))} type="number" min="0" placeholder="VD: 15000000" className={inputClass} />
                </Field>

                {stockInForm.productType === 'physical' ? (
                  <>
                    <Field label="Số serial">
                      <input value={stockInForm.serialNumber} onChange={(event) => setStockInForm((prev) => ({ ...prev, serialNumber: event.target.value }))} placeholder="Tự tạo khi chọn Laptop / PC" className={inputClass} />
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="Link ảnh sản phẩm">
                        <ImageUploadField
                          value={stockInForm.imageUrls}
                          images={stockInForm.imageAssets}
                          rows={4}
                          textareaClassName={textareaClass}
                          onChange={(imageUrls, imageAssets) => setStockInForm((prev) => ({ ...prev, imageUrls, imageAssets }))}
                        />
                      </Field>
                    </div>
                  </>
                ) : (
                  <>
                    <Field label="Email đăng nhập">
                      <input value={stockInForm.accountEmail} onChange={(event) => setStockInForm((prev) => ({ ...prev, accountEmail: event.target.value }))} placeholder="account@example.com" className={inputClass} />
                    </Field>
                    <Field label="Mật khẩu">
                      <input value={stockInForm.accountPassword} onChange={(event) => setStockInForm((prev) => ({ ...prev, accountPassword: event.target.value }))} placeholder="Mật khẩu account" className={inputClass} />
                    </Field>
                    <Field label="Ngày hết hạn">
                      <input value={stockInForm.expiredAt} onChange={(event) => setStockInForm((prev) => ({ ...prev, expiredAt: event.target.value }))} type="date" className={inputClass} />
                    </Field>
                  </>
                )}

                <div className="md:col-span-2">
                  <Field label="Ghi chú nhập kho">
                    <textarea value={stockInForm.note} onChange={(event) => setStockInForm((prev) => ({ ...prev, note: event.target.value }))} rows={3} placeholder="VD: Nhập lô hàng tháng này" className={textareaClass} />
                  </Field>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button type="button" onClick={() => setStockInForm(makeStockInForm(stockInForm.productType))} className="h-11 rounded-xl border border-white/10 bg-[#181B22] px-5 text-sm font-bold text-slate-300 hover:bg-slate-800 cursor-pointer">
                  Làm mới
                </button>
                <button type="button" disabled={isSaving} onClick={handleStockIn} className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-black text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:opacity-50 cursor-pointer">
                  {isSaving ? 'Đang nhập kho...' : 'Xác nhận nhập kho'}
                </button>
              </div>
            </section>

            <aside className="space-y-4">
              <InfoBox icon={<Laptop className="h-8 w-8 text-blue-400" />} title="Laptop / vật lý">
                Cần mã sản phẩm, số serial, giá bán và có thể thêm link ảnh dạng URL.
              </InfoBox>
              <InfoBox icon={<KeyRound className="h-8 w-8 text-violet-400" />} title="Account số">
                Cần mã sản phẩm, email, mật khẩu, giá bán và ngày hết hạn nếu có.
              </InfoBox>
            </aside>
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryTable logs={logs} isLoading={isLoading} logAction={logAction} setLogAction={setLogAction} />
        )}
      </div>
    </StaffLayout>
  )
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: ReactNode; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all cursor-pointer ${
        active ? 'bg-blue-600 text-white shadow' : 'bg-[#181B22] text-[#909AAB] border border-white/5 hover:bg-[#2A2F3B] hover:text-white'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-1.5 flex flex-col">
      <span className="text-xs font-bold text-slate-300">{label}</span>
      {children}
    </label>
  )
}

function InfoBox({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  const isPhysical = title.toLowerCase().includes('laptop')
  return (
    <div className={`rounded-2xl border p-5 ${
      isPhysical ? 'bg-blue-950/20 border-blue-500/20' : 'bg-violet-950/20 border-violet-500/20'
    }`}>
      {icon}
      <h3 className="mt-4 text-sm font-black text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{children}</p>
    </div>
  )
}

function StockTable({
  isLoading,
  items,
  onPickProduct,
}: {
  isLoading: boolean
  items: StockSummaryItem[]
  onPickProduct: (item: StockSummaryItem) => void
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#2A2F3B] shadow-sm text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-[#181B22]">
        <div>
          <h2 className="text-sm font-black text-white">Danh sách tồn kho</h2>
          <p className="mt-1 text-xs text-[#909AAB]">Chọn nhanh một dòng để nhập thêm item cho sản phẩm.</p>
        </div>
        <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">{items.length} sản phẩm</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead className="bg-[#181B22] text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/5">
            <tr>
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-6 py-4">Loại</th>
              <th className="px-6 py-4">Còn sẵn</th>
              <th className="px-6 py-4">Đang giữ</th>
              <th className="px-6 py-4">Đã bán</th>
              <th className="px-6 py-4">Tổng</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400 bg-[#2A2F3B]">Đang tải dữ liệu kho...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400 bg-[#2A2F3B]">Chưa có dữ liệu tồn kho phù hợp.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={itemId(item)} className="hover:bg-[#202530] transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white">{itemName(item)}</p>
                    <p className="text-xs text-[#909AAB]">{itemId(item)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${
                      item.product_type === 'digital' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    }`}>
                      {item.product_type === 'digital' ? 'Account' : 'Laptop'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-emerald-400">{item.available ?? 0}</td>
                  <td className="px-6 py-4 text-sm font-black text-amber-400">{item.reserved ?? 0}</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-300">{item.sold ?? 0}</td>
                  <td className="px-6 py-4 text-sm font-black text-white">{itemTotal(item)}</td>
                  <td className="px-6 py-4 text-right">
                    <button type="button" onClick={() => onPickProduct(item)} className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer">
                      Nhập thêm
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function HistoryTable({
  logs,
  isLoading,
  logAction,
  setLogAction,
}: {
  logs: InventoryLog[]
  isLoading: boolean
  logAction: string
  setLogAction: (value: string) => void
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#2A2F3B] shadow-sm text-white">
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between bg-[#181B22]">
        <div>
          <h2 className="text-sm font-black text-white">Lịch sử thay đổi tồn kho</h2>
          <p className="mt-1 text-xs text-[#909AAB]">Theo dõi các lần nhập, xuất và điều chỉnh tồn kho.</p>
        </div>
        <select value={logAction} onChange={(event) => setLogAction(event.target.value)} className="h-10 rounded-xl border border-white/10 bg-[#181B22] text-white px-4 text-xs font-semibold focus:outline-none focus:border-blue-600 cursor-pointer transition-colors">
          <option value="">Tất cả hành động</option>
          <option value="stock_in">Nhập kho</option>
          <option value="stock_out">Xuất kho</option>
          <option value="adjustment">Điều chỉnh</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[#181B22] text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/5">
            <tr>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-6 py-4">Loại</th>
              <th className="px-6 py-4">Hành động</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Ghi chú</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400 bg-[#2A2F3B]">Đang tải lịch sử kho...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400 bg-[#2A2F3B]">Chưa có lịch sử kho phù hợp.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-[#202530] transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-300"><div className="flex items-center gap-2"><FileClock className="h-4 w-4 text-[#909AAB]" />{formatDate(log.createdAt)}</div></td>
                  <td className="px-6 py-4"><p className="text-sm font-bold text-white">{productLogName(log)}</p><p className="text-xs text-[#909AAB]">{refId(log.product_id)}</p></td>
                  <td className="px-6 py-4 text-sm text-slate-300">{log.product_type === 'digital' ? 'Account' : 'Laptop'}</td>
                  <td className="px-6 py-4"><span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">{formatAction(log.action)}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-300">{`${log.status_before ?? 'null'} -> ${log.status_after ?? 'null'}`}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{log.note || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
