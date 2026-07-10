import { useEffect, useMemo, useState } from 'react'
import { Edit3, Plus, RefreshCw, Trash2 } from 'lucide-react'
import AdminLayout from '@/layouts/AdminLayout'
import AppModal from '@/components/common/AppModal'
import ImageUploadField from '@/components/common/ImageUploadField'
import {
  createBanner,
  deleteBanner,
  getAllBanners,
  updateBanner,
  type BannerPosition,
  type BannerRecord,
} from '@/services/banner.service'
import type { UploadedImage } from '@/services/upload.service'

interface BannerForm {
  title: string
  imageUrls: string
  imageAssets: UploadedImage[]
  linkUrl: string
  position: BannerPosition
  displayOrder: string
  isActive: boolean
  startDate: string
  endDate: string
}

const emptyForm: BannerForm = {
  title: '',
  imageUrls: '',
  imageAssets: [],
  linkUrl: '',
  position: 'home_top',
  displayOrder: '0',
  isActive: true,
  startDate: '',
  endDate: '',
}

const inputClass =
  'h-11 w-full rounded-xl border border-white/10 bg-[#181B22] text-white px-4 text-sm outline-none focus:border-blue-600 focus:bg-[#181B22] transition-colors'
const textareaClass =
  'w-full resize-none rounded-xl border border-white/10 bg-[#181B22] text-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:bg-[#181B22] transition-colors'

function toDateInput(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function formatDate(value?: string | null) {
  if (!value) return 'Không giới hạn'
  return new Date(value).toLocaleDateString('vi-VN')
}

function firstImageFromForm(form: BannerForm): UploadedImage | null {
  if (form.imageAssets[0]?.url && form.imageAssets[0]?.public_id) return form.imageAssets[0]
  const firstUrl = form.imageUrls
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean)[0]
  return firstUrl ? { url: firstUrl, public_id: `manual-${firstUrl}` } : null
}

function normalizeBannerLink(value: string) {
  const link = value.trim()
  if (!link) return null
  if (link.startsWith('/')) return `${window.location.origin}${link}`
  return link
}

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<BannerRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [position, setPosition] = useState<BannerPosition | 'all'>('all')
  const [openModal, setOpenModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<BannerRecord | null>(null)
  const [form, setForm] = useState<BannerForm>(emptyForm)

  const filteredBanners = useMemo(() => {
    if (position === 'all') return banners
    return banners.filter((banner) => banner.position === position)
  }, [banners, position])

  const loadBanners = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAllBanners(position === 'all' ? undefined : { position })
      setBanners(Array.isArray(res.data.data) ? res.data.data : [])
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải danh sách banner.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBanners()
  }, [position])

  const openCreate = () => {
    setEditingBanner(null)
    setForm(emptyForm)
    setError('')
    setSuccess('')
    setOpenModal(true)
  }

  const openEdit = (banner: BannerRecord) => {
    setEditingBanner(banner)
    setForm({
      title: banner.title || '',
      imageUrls: banner.image?.url || '',
      imageAssets: banner.image?.url && banner.image?.public_id ? [banner.image] : [],
      linkUrl: banner.link_url || '',
      position: banner.position || 'home_top',
      displayOrder: String(banner.display_order ?? 0),
      isActive: banner.is_active !== false,
      startDate: toDateInput(banner.start_date),
      endDate: toDateInput(banner.end_date),
    })
    setError('')
    setSuccess('')
    setOpenModal(true)
  }

  const saveBanner = async () => {
    const firstImg = firstImageFromForm(form)
    if (!form.title.trim()) {
      setError('Vui lòng nhập tên banner.')
      return
    }
    if (!firstImg) {
      setError('Vui lòng tải lên hoặc dán URL ảnh banner.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')
    try {
      if (editingBanner) {
        await updateBanner(editingBanner._id, {
          title: form.title.trim(),
          image: firstImg,
          link_url: normalizeBannerLink(form.linkUrl),
          position: form.position,
          display_order: Number(form.displayOrder) || 0,
          is_active: form.isActive,
          start_date: form.startDate || null,
          end_date: form.endDate || null,
        })
        setSuccess('Cập nhật banner thành công!')
      } else {
        await createBanner({
          title: form.title.trim(),
          image: firstImg,
          link_url: normalizeBannerLink(form.linkUrl),
          position: form.position,
          display_order: Number(form.displayOrder) || 0,
          is_active: form.isActive,
          start_date: form.startDate || null,
          end_date: form.endDate || null,
        })
        setSuccess('Tạo banner mới thành công!')
      }
      setOpenModal(false)
      await loadBanners()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể lưu banner.')
    } finally {
      setSaving(false)
    }
  }

  const removeBanner = async (banner: BannerRecord) => {
    if (!window.confirm(`Xác nhận xóa banner: "${banner.title}"?`)) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await deleteBanner(banner._id)
      setSuccess('Đã xóa banner thành công.')
      await loadBanners()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể xóa banner.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Quản lý banner" notificationCount={0}>
      <div className="mx-auto w-full max-w-[1840px] space-y-6 font-sans text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mt-1 text-2xl font-black text-white">Quản lý banner</h1>
            <p className="mt-1 text-sm text-slate-400">
              Tạo banner, upload ảnh Cloudinary và bật/tắt hiển thị theo API BE.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={position} onChange={(event) => setPosition(event.target.value as BannerPosition | 'all')} className={inputClass}>
              <option value="all">Tất cả vị trí</option>
              <option value="home_top">Trang chủ - trên</option>
              <option value="home_middle">Trang chủ - giữa</option>
              <option value="category_page">Trang danh mục</option>
              <option value="popup">Popup</option>
            </select>
            <button type="button" onClick={loadBanners} className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-[#181B22] px-4 text-sm font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer">
              <RefreshCw className="h-4 w-4" />
              Tải lại
            </button>
            <button type="button" onClick={openCreate} className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-black text-white hover:bg-blue-500 cursor-pointer">
              <Plus className="h-4 w-4" />
              Thêm banner
            </button>
          </div>
        </div>

        {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200">{error}</div>}
        {success && <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">{success}</div>}

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#2A2F3B] shadow-sm">
          <div className="grid grid-cols-[1.2fr_1fr_120px_120px_120px] gap-4 border-b border-white/10 bg-[#181B22] px-5 py-3 text-xs font-black uppercase text-slate-300">
            <span>Banner</span>
            <span>Link</span>
            <span>Vị trí</span>
            <span>Trạng thái</span>
            <span>Thao tác</span>
          </div>
          {loading ? (
            <div className="p-6 text-sm text-slate-400 bg-[#1E2229]/20">Đang tải banner...</div>
          ) : filteredBanners.length ? (
            filteredBanners.map((banner) => (
              <div key={banner._id} className="grid grid-cols-[1.2fr_1fr_120px_120px_120px] items-center gap-4 border-b border-white/5 bg-[#1E2229]/20 px-5 py-4 last:border-b-0">
                <div className="flex items-center gap-4">
                  <img src={banner.image?.url} alt={banner.title} className="h-16 w-28 rounded-xl object-cover border border-white/5" />
                  <div>
                    <p className="font-black text-white">{banner.title}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Thứ tự {banner.display_order} • {formatDate(banner.start_date)} - {formatDate(banner.end_date)}
                    </p>
                  </div>
                </div>
                <span className="truncate text-sm text-slate-355">{banner.link_url || 'Không có'}</span>
                <span className="text-sm font-bold text-slate-300">{banner.position}</span>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${banner.is_active ? 'bg-emerald-955/40 text-emerald-300 border border-emerald-500/20' : 'bg-slate-800 text-[#909AAB] border border-white/5'}`}>
                  {banner.is_active ? 'Đang bật' : 'Đã tắt'}
                </span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => openEdit(banner)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-blue-400 cursor-pointer" title="Sửa banner">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button type="button" disabled={saving} onClick={() => removeBanner(banner)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-rose-400 cursor-pointer" title="Xóa banner">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-sm text-slate-400 bg-[#1E2229]/20">Chưa có banner nào.</div>
          )}
        </section>
      </div>

      <AppModal
        open={openModal}
        theme="dark"
        title={editingBanner ? 'Sửa banner' : 'Thêm banner'}
        onClose={() => setOpenModal(false)}
        footer={
          <>
            <button type="button" onClick={() => setOpenModal(false)} className="h-11 rounded-xl border border-white/10 bg-[#181B22] text-slate-300 hover:bg-slate-800 cursor-pointer px-5 text-sm font-bold">
              Hủy
            </button>
            <button type="button" disabled={saving} onClick={saveBanner} className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-black text-white hover:bg-blue-500 disabled:opacity-60 cursor-pointer">
              {saving ? 'Đang lưu...' : 'Lưu banner'}
            </button>
          </>
        }
      >
        <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1">
          <Field label="Tên banner">
            <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} className={inputClass} />
          </Field>
          <Field label="Ảnh banner">
            <ImageUploadField
              value={form.imageUrls}
              images={form.imageAssets}
              folder="banners"
              rows={2}
              textareaClassName={textareaClass}
              onChange={(imageUrls, imageAssets) => setForm((prev) => ({ ...prev, imageUrls, imageAssets }))}
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Link khi bấm">
              <input value={form.linkUrl} onChange={(event) => setForm((prev) => ({ ...prev, linkUrl: event.target.value }))} placeholder="/accounts hoặc https://..." className={inputClass} />
            </Field>
            <Field label="Vị trí">
              <select value={form.position} onChange={(event) => setForm((prev) => ({ ...prev, position: event.target.value as BannerPosition }))} className={inputClass}>
                <option value="home_top">Trang chủ - trên</option>
                <option value="home_middle">Trang chủ - giữa</option>
                <option value="category_page">Trang danh mục</option>
                <option value="popup">Popup</option>
              </select>
            </Field>
            <Field label="Thứ tự">
              <input type="number" value={form.displayOrder} onChange={(event) => setForm((prev) => ({ ...prev, displayOrder: event.target.value }))} className={inputClass} />
            </Field>
            <Field label="Trạng thái">
              <select value={form.isActive ? 'true' : 'false'} onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.value === 'true' }))} className={inputClass}>
                <option value="true">Đang bật</option>
                <option value="false">Tắt</option>
              </select>
            </Field>
            <Field label="Ngày bắt đầu">
              <input type="date" value={form.startDate} onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))} className={inputClass} />
            </Field>
            <Field label="Ngày kết thúc">
              <input type="date" value={form.endDate} onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))} className={inputClass} />
            </Field>
          </div>
        </div>
      </AppModal>
    </AdminLayout>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-300">{label}</span>
      {children}
    </label>
  )
}
