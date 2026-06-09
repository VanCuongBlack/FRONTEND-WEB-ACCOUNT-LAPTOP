import { useState, useMemo } from 'react'
import {
  Search, Download, Plus, Edit3, Trash2,
  ChevronLeft, ChevronRight, Laptop, MousePointer, Cpu,
  AlertTriangle, Database, Truck, FileText, X
} from 'lucide-react'
import StaffLayout from '@/layouts/StaffLayout'

// ─── Interfaces & Mock Data ───────────────────────────────────────────────────

interface InventoryItem {
  sku: string
  name: string
  category: 'Laptop' | 'Phụ kiện' | 'Linh kiện'
  stock: number
  location: string
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
}

const INITIAL_ITEMS: InventoryItem[] = [
  { sku: 'LP-XPS-13-9310', name: 'Dell XPS 13 9310 i7 11th Gen', category: 'Laptop', stock: 42, location: 'Khu A - Kệ 04', status: 'IN_STOCK' },
  { sku: 'ACC-LOGI-MX3', name: 'Logitech MX Master 3S', category: 'Phụ kiện', stock: 5, location: 'Khu C - Kệ 12', status: 'LOW_STOCK' },
  { sku: 'RAM-KINGS-16GB', name: 'Kingston Fury 16GB DDR4', category: 'Linh kiện', stock: 0, location: 'Khu B - Kệ 01', status: 'OUT_OF_STOCK' },
  { sku: 'LP-MAC-M2-AIR', name: 'MacBook Air M2 8/256GB', category: 'Laptop', stock: 115, location: 'Khu A - Kệ 01', status: 'IN_STOCK' },
  { sku: 'LP-ROG-G16', name: 'ASUS ROG Strix G16 i7', category: 'Laptop', stock: 18, location: 'Khu A - Kệ 02', status: 'IN_STOCK' },
]

export default function InventoryManagementPage() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedSku, setSelectedSku] = useState<string[]>([])

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  // Form States
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Laptop' as InventoryItem['category'],
    stock: 0,
    location: '',
  })

  // Action: Add Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.sku || !formData.name) {
      alert('Vui lòng nhập đầy đủ SKU và Tên sản phẩm.')
      return
    }

    const status: InventoryItem['status'] =
      formData.stock === 0
        ? 'OUT_OF_STOCK'
        : formData.stock <= 10
        ? 'LOW_STOCK'
        : 'IN_STOCK'

    const newItem: InventoryItem = {
      sku: formData.sku,
      name: formData.name,
      category: formData.category,
      stock: formData.stock,
      location: formData.location || 'Khu D - Kệ 01',
      status,
    }

    setItems(prev => [newItem, ...prev])
    setShowAddModal(false)
    setFormData({ sku: '', name: '', category: 'Laptop', stock: 0, location: '' })
    alert('Đã nhập kho sản phẩm mới thành công!')
  }

  // Action: Edit Item
  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setFormData({
      sku: item.sku,
      name: item.name,
      category: item.category,
      stock: item.stock,
      location: item.location,
    })
    setShowEditModal(true)
  }

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    const status: InventoryItem['status'] =
      formData.stock === 0
        ? 'OUT_OF_STOCK'
        : formData.stock <= 10
        ? 'LOW_STOCK'
        : 'IN_STOCK'

    setItems(prev =>
      prev.map(item =>
        item.sku === editingItem.sku
          ? {
              ...item,
              name: formData.name,
              category: formData.category,
              stock: formData.stock,
              location: formData.location,
              status,
            }
          : item
      )
    )
    setShowEditModal(false)
    setEditingItem(null)
    setFormData({ sku: '', name: '', category: 'Laptop', stock: 0, location: '' })
    alert('Đã cập nhật thông tin sản phẩm tồn kho!')
  }

  // Action: Delete Item
  const handleDeleteItem = (sku: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm có SKU: ${sku} khỏi danh sách tồn kho?`)) {
      setItems(prev => prev.filter(item => item.sku !== sku))
      setSelectedSku(prev => prev.filter(s => s !== sku))
    }
  }

  const handleToggleSelectAll = () => {
    if (selectedSku.length === filteredItems.length) {
      setSelectedSku([])
    } else {
      setSelectedSku(filteredItems.map(item => item.sku))
    }
  }

  const handleToggleSelectOne = (sku: string) => {
    setSelectedSku(prev =>
      prev.includes(sku) ? prev.filter(s => s !== sku) : [...prev, sku]
    )
  }

  // Filter Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch =
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase())

      const matchCategory = categoryFilter === 'ALL' || item.category === categoryFilter
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter

      return matchSearch && matchCategory && matchStatus
    })
  }, [items, search, categoryFilter, statusFilter])

  // Count Statistics
  const countStats = useMemo(() => {
    return {
      totalItems: 1284, // Stat hardcoded from screenshot
      lowStock: items.filter(item => item.status === 'LOW_STOCK').length + 16, // Matching screenshot 18
      totalValue: '4.2B', // Matching screenshot
      importRequests: 12, // Matching screenshot
    }
  }, [items])

  return (
    <StaffLayout title="Quản lý kho" notificationCount={3}>
      <div className="space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800 relative">
        
        {/* Title & Actions Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý kho</h1>
            <p className="text-sm text-slate-500 mt-1">Theo dõi số lượng, vị trí và trạng thái tồn kho thiết bị.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Đang tạo báo cáo xuất kho định dạng PDF/Excel...')}
              className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Nhập kho
            </button>
          </div>
        </div>

        {/* ─── Metrics Row (4 Cards) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Tổng số mặt hàng */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số mặt hàng</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{countStats.totalItems}</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-2 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                +12% vs mo
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Sản phẩm sắp hết hàng */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sản phẩm sắp hết hàng</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{countStats.lowStock}</h3>
              <p className="text-[11px] text-rose-600 font-bold mt-2 bg-rose-50 px-2 py-0.5 rounded w-fit">
                Cần xử lý
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Giá trị kho hàng */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Giá trị kho hàng</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{countStats.totalValue} <span className="text-xs text-slate-500 font-medium">VND</span></h3>
              <p className="text-xs text-slate-400 font-semibold mt-2">Dựa trên giá gốc nhập</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Yêu cầu nhập kho */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Yêu cầu nhập kho</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{countStats.importRequests}</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-2 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                5 Đang đến
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ─── Filters & Search ─── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {/* Category Select Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả danh mục</option>
              <option value="Laptop">Laptop</option>
              <option value="Phụ kiện">Phụ kiện</option>
              <option value="Linh kiện">Linh kiện</option>
            </select>

            {/* Status Select Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="IN_STOCK">Còn hàng</option>
              <option value="LOW_STOCK">Sắp hết hàng</option>
              <option value="OUT_OF_STOCK">Hết hàng</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, SKU..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              Hiển thị 1-{filteredItems.length} trong số {countStats.totalItems} sản phẩm
            </span>
          </div>
        </div>

        {/* ─── Inventory Table ─── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={filteredItems.length > 0 && selectedSku.length === filteredItems.length}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã SKU</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên sản phẩm</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Số lượng tồn</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vị trí kho</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-400 font-medium">
                      Không tìm thấy sản phẩm tồn kho nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => {
                    let Icon = Laptop
                    if (item.category === 'Phụ kiện') Icon = MousePointer
                    if (item.category === 'Linh kiện') Icon = Cpu

                    return (
                      <tr key={item.sku} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedSku.includes(item.sku)}
                            onChange={() => handleToggleSelectOne(item.sku)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                              <Icon className="w-4 h-4" />
                            </span>
                            <span className="text-sm font-bold text-slate-800">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                          {item.stock < 10 ? `0${item.stock}` : item.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">{item.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.status === 'IN_STOCK' && (
                            <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                              Còn hàng
                            </span>
                          )}
                          {item.status === 'LOW_STOCK' && (
                            <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                              Sắp hết hàng
                            </span>
                          )}
                          {item.status === 'OUT_OF_STOCK' && (
                            <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                              Hết hàng
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Chỉnh sửa vị trí/số lượng"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.sku)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Xóa tồn kho"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-xs font-semibold text-slate-500">
              Hiển thị 1 - {filteredItems.length} trong số {filteredItems.length} sản phẩm lọc được
            </span>

            <div className="flex items-center gap-1.5">
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 cursor-pointer" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold">1</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 font-bold">2</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 font-bold">3</button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 font-bold">12</button>
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Footer Section ─── */}
        <p className="text-center text-xs text-slate-400 py-4 border-t border-slate-100">
          © 2024 Admin Panel. Hệ thống Quản lý Kho Laptop Toàn diện.
        </p>

        {/* ─── ADD STOCK MODAL ─── */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Nhập sản phẩm vào kho</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddItem} className="p-5 space-y-4 text-xs font-semibold text-slate-600">
                <div>
                  <label className="block mb-1.5">Mã SKU *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: LP-XPS-13"
                    value={formData.sku}
                    onChange={e => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Dell XPS 13"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white text-xs font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5">Danh mục</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as InventoryItem['category'] }))}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white text-xs font-semibold"
                    >
                      <option>Laptop</option>
                      <option>Phụ kiện</option>
                      <option>Linh kiện</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5">Số lượng tồn</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.stock}
                      onChange={e => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white text-xs font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5">Vị trí kho</label>
                  <input
                    type="text"
                    placeholder="VD: Khu A - Kệ 01"
                    value={formData.location}
                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white text-xs font-medium"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 font-bold transition-colors text-center"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow transition-colors text-center"
                  >
                    Xác nhận nhập
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── EDIT STOCK MODAL ─── */}
        {showEditModal && editingItem && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Chỉnh sửa tồn kho: {editingItem.sku}</h3>
                <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateItem} className="p-5 space-y-4 text-xs font-semibold text-slate-600">
                <div>
                  <label className="block mb-1.5">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white text-xs font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5">Danh mục</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as InventoryItem['category'] }))}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white text-xs font-semibold"
                    >
                      <option>Laptop</option>
                      <option>Phụ kiện</option>
                      <option>Linh kiện</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5">Số lượng tồn</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.stock}
                      onChange={e => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white text-xs font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5">Vị trí kho</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white text-xs font-medium"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 font-bold transition-colors text-center"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow transition-colors text-center"
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </StaffLayout>
  )
}
