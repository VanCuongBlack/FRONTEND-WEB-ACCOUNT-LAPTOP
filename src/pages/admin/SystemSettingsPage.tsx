import { useState } from 'react'
import { Save, Trash2, Image, Globe, CreditCard, Shield, Mail } from 'lucide-react'
import AdminLayout from '@/layouts/AdminLayout'
import AppModal from '@/components/common/AppModal'

type SettingTab = 'general' | 'banner' | 'payment' | 'security' | 'mail'

interface BannerItem {
  id: number
  title: string
  subtitle: string
  imageUrl: string
  link: string
  active: boolean
}

const initialBanners: BannerItem[] = [
  {
    id: 1,
    title: 'Siêu Hội Gaming Laptop',
    subtitle: 'Giảm giá cực sâu tới 30% cho Dell Gaming, Legion 5',
    imageUrl: '/laptops',
    link: '/laptops',
    active: true,
  },
  {
    id: 2,
    title: 'Tài Khoản Netflix Premium',
    subtitle: 'Chỉ từ 45k/tháng, chất lượng 4K UHD cực nét',
    imageUrl: '/accounts',
    link: '/accounts',
    active: true,
  },
]

const tabs = [
  { key: 'general' as SettingTab, label: 'Cấu hình chung & SEO', icon: Globe },
  { key: 'banner' as SettingTab, label: 'Banners & Hero Sliders', icon: Image },
  { key: 'payment' as SettingTab, label: 'Cổng thanh toán & Ví', icon: CreditCard },
  { key: 'security' as SettingTab, label: 'Bảo mật & Bảo trì', icon: Shield },
  { key: 'mail' as SettingTab, label: 'Cấu hình Mail (SMTP)', icon: Mail },
]

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingTab>('banner')
  const [banners, setBanners] = useState<BannerItem[]>(initialBanners)

  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    link: '',
  })

  const [openNoticeModal, setOpenNoticeModal] = useState(false)
  const [noticeMessage, setNoticeMessage] = useState('')

  const showNotice = (message: string) => {
    setNoticeMessage(message)
    setOpenNoticeModal(true)
  }

  const handleAddBanner = () => {
    if (!newBanner.title.trim() || !newBanner.imageUrl.trim()) {
      showNotice('Vui lòng điền tiêu đề và đường dẫn hình ảnh!')
      return
    }

    const banner: BannerItem = {
      id: Date.now(),
      title: newBanner.title,
      subtitle: newBanner.subtitle,
      imageUrl: newBanner.imageUrl,
      link: newBanner.link || '/',
      active: true,
    }

    setBanners((prev) => [...prev, banner])
    setNewBanner({
      title: '',
      subtitle: '',
      imageUrl: '',
      link: '',
    })

    showNotice('Thêm banner thành công!')
  }

  const handleSaveAll = () => {
    showNotice('Đã lưu tất cả thay đổi hệ thống!')
  }

  const handleDeleteBanner = (id: number) => {
    setBanners((prev) => prev.filter((item) => item.id !== id))
    showNotice('Đã xóa banner!')
  }

  const handleToggleBanner = (id: number) => {
    setBanners((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    )
  }

  return (
    <AdminLayout title="Quản lý hệ thống">
      <section className="mx-auto max-w-[1200px] space-y-6 font-sans">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý hệ thống</h1>
            <p className="mt-1 text-sm text-gray-500">
              Cấu hình cài đặt chung, banner, thanh toán, bảo mật và email hệ thống.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveAll}
            className="flex h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Save size={18} />
            Lưu tất cả thay đổi
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit rounded-2xl bg-white p-4 shadow-sm">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const active = activeTab === tab.key

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex h-[48px] w-full items-center gap-3 rounded-xl px-4 text-left text-sm font-semibold transition-all ${
                      active
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </aside>

          <main className="rounded-2xl bg-white p-6 shadow-sm">
            {activeTab === 'banner' && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Quản lý Banner & Slider quảng cáo
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Cấu hình hình ảnh quảng cáo lớn hiển thị ở trang chủ.
                  </p>
                </div>

                <div className="space-y-4">
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-20 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                          IMG
                        </div>

                        <div>
                          <h3 className="font-bold text-gray-900">{banner.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">{banner.subtitle}</p>
                          <p className="mt-1 text-xs text-blue-600">{banner.link}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleBanner(banner.id)}
                          className={`rounded-lg px-3 py-2 text-xs font-bold ${
                            banner.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {banner.active ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <h3 className="mb-4 font-bold text-gray-900">+ Thêm banner slider mới</h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      value={newBanner.title}
                      onChange={(e) =>
                        setNewBanner((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="Tiêu đề chính"
                      className="h-[46px] rounded-xl border border-gray-300 px-4 text-sm outline-none"
                    />

                    <input
                      value={newBanner.subtitle}
                      onChange={(e) =>
                        setNewBanner((prev) => ({ ...prev, subtitle: e.target.value }))
                      }
                      placeholder="Mô tả phụ"
                      className="h-[46px] rounded-xl border border-gray-300 px-4 text-sm outline-none"
                    />

                    <input
                      value={newBanner.imageUrl}
                      onChange={(e) =>
                        setNewBanner((prev) => ({ ...prev, imageUrl: e.target.value }))
                      }
                      placeholder="Đường dẫn hình ảnh"
                      className="h-[46px] rounded-xl border border-gray-300 px-4 text-sm outline-none"
                    />

                    <input
                      value={newBanner.link}
                      onChange={(e) =>
                        setNewBanner((prev) => ({ ...prev, link: e.target.value }))
                      }
                      placeholder="Link chuyển hướng"
                      className="h-[46px] rounded-xl border border-gray-300 px-4 text-sm outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddBanner}
                    className="mt-4 h-[44px] rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Thêm banner
                  </button>
                </div>
              </section>
            )}

            {activeTab !== 'banner' && (
              <div className="rounded-2xl bg-gray-50 p-10 text-center">
                <p className="font-semibold text-gray-700">
                  Khu vực cấu hình đang mô phỏng giao diện.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Khi có API BE, phần này sẽ lưu cấu hình thật vào hệ thống.
                </p>
              </div>
            )}
          </main>
        </div>

        <AppModal
          open={openNoticeModal}
          title="Thông báo"
          onClose={() => setOpenNoticeModal(false)}
          footer={
            <button
              type="button"
              onClick={() => setOpenNoticeModal(false)}
              className="h-[42px] rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Đã hiểu
            </button>
          }
        >
          <p className="text-sm text-gray-600">{noticeMessage}</p>
        </AppModal>
      </section>
    </AdminLayout>
  )
}