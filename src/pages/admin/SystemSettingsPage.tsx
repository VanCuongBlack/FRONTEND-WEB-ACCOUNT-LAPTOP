import { useState } from 'react'
import {
  Save, Globe, CreditCard, Shield, Mail, Sliders,
  Plus, Trash2, Check, FileText, Image, RefreshCw, Key
} from 'lucide-react'
import AdminLayout from '@/layouts/AdminLayout'

interface SliderBanner {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  linkUrl: string
  isActive: boolean
}

interface PaymentMethod {
  id: string
  name: string
  accountName: string
  accountNumber: string
  isActive: boolean
  qrCode?: string
}

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'banners' | 'payments' | 'security' | 'mail'>('general')

  // --- General Settings ---
  const [siteName, setSiteName] = useState('Tài Khoản & Laptop')
  const [sitePhone, setSitePhone] = useState('1900 633 305')
  const [siteEmail, setSiteEmail] = useState('support@123.vn')
  const [seoTitle, setSeoTitle] = useState('Tài Khoản & Laptop - Tài Khoản Bản Quyền & Laptop Gaming Chính Hãng')
  const [seoDesc, setSeoDesc] = useState('Chuyên cung cấp tài khoản Netflix, Spotify, Premium Youtube giá rẻ và Laptop Gaming chính hãng, bảo hành 1 đổi 1 uy tín.')
  const [isMaintenance, setIsMaintenance] = useState(false)

  // --- Banners Settings ---
  const [banners, setBanners] = useState<SliderBanner[]>([
    { id: '1', title: 'Siêu Hội Gaming Laptop', subtitle: 'Giảm giá cực sâu tới 30% cho Dell Gaming, Legion 5', imageUrl: '/hero-1.png', linkUrl: '/laptops', isActive: true },
    { id: '2', title: 'Tài Khoản Netflix Premium', subtitle: 'Chỉ từ 45k/tháng, chất lượng 4K UHD cực nét', imageUrl: '/hero-2.png', linkUrl: '/accounts', isActive: true },
    { id: '3', title: 'Ưu đãi Spotify Premium', subtitle: 'Nghe nhạc lossless không giới hạn chỉ 19k', imageUrl: '/hero-3.png', linkUrl: '/accounts', isActive: false }
  ])
  const [newTitle, setNewTitle] = useState('')
  const [newSubtitle, setNewSubtitle] = useState('')
  const [newImg, setNewImg] = useState('')
  const [newLink, setNewLink] = useState('')

  const handleAddBanner = () => {
    if (!newTitle || !newImg) {
      alert('Vui lòng điền tiêu đề và đường dẫn hình ảnh!')
      return
    }
    const nb: SliderBanner = {
      id: Date.now().toString(),
      title: newTitle,
      subtitle: newSubtitle,
      imageUrl: newImg,
      linkUrl: newLink || '#',
      isActive: true
    }
    setBanners([...banners, nb])
    setNewTitle('')
    setNewSubtitle('')
    setNewImg('')
    setNewLink('')
    alert('Thêm banner thành công!')
  }

  const handleDeleteBanner = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa banner này không?')) {
      setBanners(banners.filter(b => b.id !== id))
    }
  }

  const handleToggleBanner = (id: string) => {
    setBanners(banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b))
  }

  // --- Payments Settings ---
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'pay-1', name: 'Ngân hàng MB Bank', accountName: 'CONG TY DIVINESHOP VIETNAM', accountNumber: '03882190001', isActive: true, qrCode: 'https://img.vietqr.io/image/MB-03882190001-compact.png' },
    { id: 'pay-2', name: 'Ví điện tử Momo', accountName: 'Nguyễn Văn Hưng', accountNumber: '0987654321', isActive: true },
    { id: 'pay-3', name: 'Ngân hàng Techcombank', accountName: 'CONG TY DIVINESHOP VIETNAM', accountNumber: '190367821101', isActive: false }
  ])

  const handleTogglePayment = (id: string) => {
    setPaymentMethods(paymentMethods.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p))
  }

  // --- Security Settings ---
  const [minPasswordLen, setMinPasswordLen] = useState(8)
  const [requireOtp, setRequireOtp] = useState(true)
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5)
  const [allowedIps, setAllowedIps] = useState('127.0.0.1\n192.168.1.*\n113.161.45.22')

  // --- Email SMTP ---
  const [smtpServer, setSmtpServer] = useState('smtp.gmail.com')
  const [smtpPort, setSmtpPort] = useState(587)
  const [smtpUser, setSmtpUser] = useState('noreply@divineshop.vn')
  const [smtpPass, setSmtpPass] = useState('••••••••••••••••')

  const handleSaveSettings = () => {
    alert('Đã lưu mọi cấu hình hệ thống thành công lên cơ sở dữ liệu!')
  }

  return (
    <AdminLayout title="Quản lý hệ thống" notificationCount={1}>
      <div className="space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800 pb-12">

        {/* Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý hệ thống</h1>
            <p className="text-sm text-slate-500 mt-1">Cấu hình các cài đặt chung, cổng thanh toán, bảo mật và banner của website.</p>
          </div>
          <div>
            <button
              onClick={handleSaveSettings}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white shadow-md hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Lưu tất cả thay đổi
            </button>
          </div>
        </div>

        {/* Outer container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

          {/* Settings Tabs Sidebar */}
          <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1 shadow-sm">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'general' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Globe className="w-4 h-4" />
              Cấu hình chung & SEO
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'banners' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Image className="w-4 h-4" />
              Banners & Hero Sliders
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'payments' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <CreditCard className="w-4 h-4" />
              Cổng thanh toán & Ví
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Shield className="w-4 h-4" />
              Bảo mật & Bảo trì
            </button>
            <button
              onClick={() => setActiveTab('mail')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'mail' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Mail className="w-4 h-4" />
              Cấu hình Mail (SMTP)
            </button>
          </div>

          {/* Settings Forms Main */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm min-h-[500px]">

            {/* Tab: General & SEO */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-600" />
                    Cấu hình chung & SEO thương hiệu
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Quản lý tên, số điện thoại liên lạc của thương hiệu cùng cấu hình tối ưu tìm kiếm Google.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Tên thương hiệu chính</label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={e => setSiteName(e.target.value)}
                      className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Hotline hỗ trợ</label>
                    <input
                      type="text"
                      value={sitePhone}
                      onChange={e => setSitePhone(e.target.value)}
                      className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 block mb-1">Email liên hệ hệ thống</label>
                    <input
                      type="email"
                      value={siteEmail}
                      onChange={e => setSiteEmail(e.target.value)}
                      className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 block mb-1">Meta Title SEO</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={e => setSeoTitle(e.target.value)}
                      className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 block mb-1">Meta Description SEO</label>
                    <textarea
                      value={seoDesc}
                      onChange={e => setSeoDesc(e.target.value)}
                      className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Banners */}
            {activeTab === 'banners' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-blue-600" />
                    Quản lý Banner & Slider Quảng cáo
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Cấu hình hiển thị các hình ảnh quảng cáo lớn (Vùng Hero) trên trang chủ.</p>
                </div>

                {/* Banner list */}
                <div className="space-y-3">
                  {banners.map((b) => (
                    <div key={b.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-16 h-10 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                          <img
                            src={b.imageUrl}
                            alt={b.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=120' }}
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate">{b.title}</h4>
                          <p className="text-[10px] text-slate-400 truncate">{b.subtitle}</p>
                          <p className="text-[9px] text-blue-500 font-semibold truncate mt-0.5">{b.linkUrl}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleToggleBanner(b.id)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${b.isActive
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                        >
                          {b.isActive ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(b.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Create Banner Form */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-6">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-blue-600" />
                    Thêm Banner Slider mới
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="md:col-span-2">
                      <label className="text-slate-500 font-semibold mb-1 block">Tiêu đề chính (Banner Title)</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        placeholder="Ví dụ: Siêu Sale Hè Rực Rỡ"
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-semibold mb-1 block">Mô tả phụ (Subtitle)</label>
                      <input
                        type="text"
                        value={newSubtitle}
                        onChange={e => setNewSubtitle(e.target.value)}
                        placeholder="Ví dụ: Voucher giảm giá tới 50k"
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-semibold mb-1 block">Đường dẫn liên kết (Link chuyển hướng)</label>
                      <input
                        type="text"
                        value={newLink}
                        onChange={e => setNewLink(e.target.value)}
                        placeholder="Ví dụ: /accounts"
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-slate-500 font-semibold mb-1 block">Đường dẫn Hình ảnh (Image URL)</label>
                      <input
                        type="text"
                        value={newImg}
                        onChange={e => setNewImg(e.target.value)}
                        placeholder="Ví dụ: /hero-1.png hoặc link online"
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleAddBanner}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Xác nhận thêm
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Tab: Payments */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    Cấu hình Cổng thanh toán & Ngân hàng
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Cấu hình thông tin chuyển khoản ngân hàng và các ví điện tử liên kết.</p>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((pm) => (
                    <div key={pm.id} className="p-4 border border-slate-200 rounded-xl hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{pm.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Tài khoản: <span className="font-semibold text-slate-700">{pm.accountName}</span> | Số: <span className="font-mono text-slate-800 font-bold">{pm.accountNumber}</span>
                          </p>
                          {pm.qrCode && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                              Có VietQR Tự động
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePayment(pm.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${pm.isActive
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                        >
                          {pm.isActive ? 'ĐANG HOẠT ĐỘNG' : 'TẠM KHÓA'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs text-slate-500 leading-relaxed">
                  <h4 className="font-bold text-slate-700 mb-1">💡 Hướng dẫn tích hợp tự động:</h4>
                  Mọi tài khoản ngân hàng MB Bank và Vietcombank được cài đặt với mã VietQR sẽ được hệ thống cronjob kiểm tra lịch sử giao dịch mỗi 15 giây để tự động cộng tiền hoặc xác nhận đơn hàng cho khách hàng của bạn.
                </div>
              </div>
            )}

            {/* Tab: Security & Maintenance */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Cài đặt Bảo mật & Trạng thái Bảo trì
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Cấu hình các tham số bảo mật của hệ thống bảo vệ tài khoản và chế độ bảo trì.</p>
                </div>

                <div className="space-y-4">
                  {/* Maintenance switch */}
                  <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Chế độ bảo trì hệ thống</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Bật chế độ này khách hàng sẽ không thể truy cập trang web, chỉ admin/staff xem được.</p>
                    </div>
                    <button
                      onClick={() => setIsMaintenance(!isMaintenance)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm ${isMaintenance
                          ? 'bg-amber-600 text-white hover:bg-amber-500'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                    >
                      {isMaintenance ? 'ĐANG BẬT BẢO TRÌ' : 'TẮT BẢO TRÌ'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Số ký tự tối thiểu của mật khẩu</label>
                      <input
                        type="number"
                        value={minPasswordLen}
                        onChange={e => setMinPasswordLen(parseInt(e.target.value))}
                        className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Số lần đăng nhập sai tối đa trước khi khóa</label>
                      <input
                        type="number"
                        value={maxLoginAttempts}
                        onChange={e => setMaxLoginAttempts(parseInt(e.target.value))}
                        className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-slate-700">Bắt buộc xác thực OTP khi thay đổi thông tin</span>
                        <input
                          type="checkbox"
                          checked={requireOtp}
                          onChange={e => setRequireOtp(e.target.checked)}
                          className="w-4.5 h-4.5 accent-blue-600 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 block mb-1">IP Whitelist được phép truy cập Admin panel (Mỗi IP một dòng)</label>
                      <textarea
                        value={allowedIps}
                        onChange={e => setAllowedIps(e.target.value)}
                        className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: SMTP Mail Server */}
            {activeTab === 'mail' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Cấu hình Mail SMTP Server
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Cấu hình máy chủ gửi email tự động (Đăng ký, Đặt hàng thành công, OTP, v.v.).</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Máy chủ SMTP (Mail Host)</label>
                    <input
                      type="text"
                      value={smtpServer}
                      onChange={e => setSmtpServer(e.target.value)}
                      className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Cổng SMTP (Port)</label>
                    <input
                      type="number"
                      value={smtpPort}
                      onChange={e => setSmtpPort(parseInt(e.target.value))}
                      className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Tài khoản Email SMTP</label>
                    <input
                      type="text"
                      value={smtpUser}
                      onChange={e => setSmtpUser(e.target.value)}
                      className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Mật khẩu ứng dụng Email</label>
                    <input
                      type="password"
                      value={smtpPass}
                      onChange={e => setSmtpPass(e.target.value)}
                      className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                  <button
                    onClick={() => alert('Đang kiểm tra kết nối với SMTP server...')}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Gửi mail thử nghiệm
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </AdminLayout>
  )
}
