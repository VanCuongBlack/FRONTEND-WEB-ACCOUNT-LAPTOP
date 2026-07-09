import { useMemo, useState } from 'react'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

type GuideKey = 'create-account' | 'payment' | 'order-management'

interface GuideItem {
  key: GuideKey
  label: string
}

const GUIDE_ITEMS: GuideItem[] = [
  { key: 'create-account', label: 'Hướng dẫn tạo tài khoản' },
  { key: 'payment', label: 'Hướng dẫn thanh toán' },
  { key: 'order-management', label: 'Quản lý đơn hàng' },
]

export default function PurchaseGuidePage() {
  const [activeGuide, setActiveGuide] = useState<GuideKey>('create-account')

  const content = useMemo(() => {
    if (activeGuide === 'create-account') {
      return (
        <div className="space-y-8 sm:space-y-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Hướng dẫn tạo tài khoản
          </h1>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
              Bước 1: Ở giao diện trang chủ, click vào đăng ký
            </h2>
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <img
                src="/TaoTKB1.png"
                alt="Bước 1 tạo tài khoản"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
              Bước 2: Điền đầy đủ các thông tin được yêu cầu
            </h2>
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <img
                src="/TaoTKB2.png"
                alt="Bước 2 tạo tài khoản"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">Bước 3</h2>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 text-slate-700 leading-relaxed space-y-4">
              <p>
                Click vào nút Đăng ký. Nếu thông tin bạn điền là chính xác và chưa tồn tại trên hệ thống, bạn sẽ được chuyển đến trang chủ.
              </p>
              <p>
                Như vậy là bạn đã tạo tài khoản thành công và sẵn sàng mua hàng rồi đó.
              </p>
            </div>
          </section>
        </div>
      )
    }

    if (activeGuide === 'payment') {
      return (
        <div className="space-y-8 sm:space-y-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Hướng dẫn thanh toán
          </h1>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-slate-700 leading-relaxed space-y-4">
            

            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">Tổng quan</h2>
              <p>
                Hiện tại hệ thống hỗ trợ thanh toán đúng theo loại sản phẩm trong đơn hàng.
              </p>
              <p>Các hình thức thanh toán đang hỗ trợ:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Chuyển khoản ngân hàng bằng mã QR.</li>
                <li>Thanh toán khi nhận hàng cho đơn PC/Laptop.</li>
                <li>Đơn mua account số chỉ hỗ trợ chuyển khoản ngân hàng.</li>
              </ul>
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
              Bước 1: Chọn sản phẩm cần thanh toán ⇒ Chọn Mua ngay
            </h2>
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <img
                src="/ThanhToanB1.png"
                alt="Bước 1 thanh toán"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
              Bước 2: Sau khi đến trang thanh toán, bạn hãy chọn 1 trong các hình thức thanh toán phù hợp và thuận tiện với mình và bấm xác nhận thanh toán
            </h2>
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <img
                src="/ThanhToanB2.png"
                alt="Bước 2 thanh toán"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </section>
        </div>
      )
    }

    return (
      <div className="space-y-8 sm:space-y-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Quản lý đơn hàng
        </h1>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-slate-700 leading-relaxed space-y-4">
          <p>
            Tại đây bạn sẽ xem được tất cả các đơn hàng bạn đã mua trên Hệ Thống Laptop &amp; Account
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <img
            src="/LSDH.png"
            alt="Danh sách đơn hàng"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">1. Bộ lọc tìm kiếm</h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-slate-700 leading-relaxed">
            <p>
              Giúp bạn tìm kiếm các đơn hàng theo những điều kiện khác nhau như: Mã đơn hàng và tên sản phẩm
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">2. Danh sách các đơn hàng</h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-slate-700 leading-relaxed space-y-3">
            <p>Đây là danh sách chi tiết các đơn hàng của bạn.</p>
            <p>
              Nhìn qua đây, các bạn có thể thấy được các thông tin cơ bản của đơn hàng như: ngày mua, sản phẩm mua, giá trị đơn hàng.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">3. Chi tiết đơn hàng</h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-slate-700 leading-relaxed space-y-3">
            <p>Để biết thêm các thông tin chi tiết của đơn hàng như:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tình trạng đơn hàng</li>
              <li>Key tài khoản</li>
              <li>Hướng dẫn sử dụng</li>
            </ul>
          </div>
        </section>

        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <img
            src="/CTDH.png"
            alt="Chi tiết đơn hàng"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      </div>
    )
  }, [activeGuide])

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      <Header pageLabel="Hướng dẫn mua hàng" />

      <main className="w-full flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="max-w-[1200px] mx-auto bg-[#f8fafc] border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
            <aside className="lg:border-r lg:border-slate-200 lg:pr-6">
              <h2 className="text-lg xl:text-xl font-bold text-slate-900 mb-6 whitespace-nowrap">
                HƯỚNG DẪN MUA HÀNG
              </h2>
              <nav className="flex flex-col gap-1.5">
                {GUIDE_ITEMS.map((item) => {
                  const isActive = item.key === activeGuide

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveGuide(item.key)}
                      className={[
                        'w-full text-left px-3 py-2.5 rounded-lg transition-colors text-base',
                        isActive
                          ? 'text-blue-600 bg-blue-50 font-semibold'
                          : 'text-slate-700 hover:bg-slate-100',
                      ].join(' ')}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </nav>
            </aside>

            <section className="min-w-0">{content}</section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
