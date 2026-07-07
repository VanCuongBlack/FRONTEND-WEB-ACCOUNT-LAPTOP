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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Hướng dẫn tạo tài khoản
          </h1>

          <GuideSection
            title="Bước 1: Chọn đăng ký"
            image="/TaoTKB1.png"
            imageAlt="Bước 1 tạo tài khoản"
          />

          <GuideSection
            title="Bước 2: Điền thông tin tài khoản"
            image="/TaoTKB2.png"
            imageAlt="Bước 2 tạo tài khoản"
          />

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 sm:text-2xl">Bước 3: Xác nhận</h2>
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 leading-relaxed text-slate-700 sm:p-6">
              <p>
                Bấm đăng ký. Nếu thông tin hợp lệ và chưa tồn tại trên hệ thống, tài khoản
                sẽ được tạo và bạn có thể đăng nhập để mua hàng.
              </p>
            </div>
          </section>
        </div>
      )
    }

    if (activeGuide === 'payment') {
      return (
        <div className="space-y-8 sm:space-y-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Hướng dẫn thanh toán
          </h1>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 leading-relaxed text-slate-700 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-800 sm:text-2xl">Phương thức hỗ trợ</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Chuyển khoản ngân hàng bằng QR do hệ thống tạo sau khi đặt đơn.</li>
              <li>Thanh toán khi nhận hàng chỉ áp dụng cho đơn PC/Laptop.</li>
              <li>Đơn mua tài khoản/account chỉ hỗ trợ chuyển khoản ngân hàng.</li>
            </ul>
          </div>

          <GuideSection
            title="Bước 1: Chọn sản phẩm và bấm mua"
            image="/ThanhToanB1.png"
            imageAlt="Bước 1 thanh toán"
          />

          <GuideSection
            title="Bước 2: Chọn phương thức thanh toán và xác nhận"
            image="/ThanhToanB2.png"
            imageAlt="Bước 2 thanh toán"
          />
        </div>
      )
    }

    return (
      <div className="space-y-8 sm:space-y-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Quản lý đơn hàng
        </h1>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 leading-relaxed text-slate-700 sm:p-6">
          <p>
            Bạn có thể xem lịch sử đơn hàng, trạng thái thanh toán, chi tiết sản phẩm
            và gửi yêu cầu hỗ trợ/hủy đơn nếu đơn còn ở trạng thái được phép.
          </p>
        </div>

        <GuideSection
          title="1. Danh sách đơn hàng"
          image="/LSDH.png"
          imageAlt="Danh sách đơn hàng"
        />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 sm:text-2xl">2. Bộ lọc tìm kiếm</h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 leading-relaxed text-slate-700 sm:p-6">
            <p>
              Dùng bộ lọc để tìm đơn theo mã đơn, tên sản phẩm hoặc trạng thái thanh toán.
            </p>
          </div>
        </section>

        <GuideSection
          title="3. Chi tiết đơn hàng"
          image="/CTDH.png"
          imageAlt="Chi tiết đơn hàng"
        />
      </div>
    )
  }, [activeGuide])

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f6]">
      <Header pageLabel="Hướng dẫn mua hàng" />

      <main className="w-full flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-[1840px] rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
            <aside className="lg:border-r lg:border-slate-200 lg:pr-6">
              <h2 className="mb-6 whitespace-nowrap text-lg font-bold text-slate-900 xl:text-xl">
                Hướng dẫn mua hàng
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
                        'w-full rounded-lg px-3 py-2.5 text-left text-base transition-colors',
                        isActive
                          ? 'bg-blue-50 font-semibold text-blue-600'
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

function GuideSection({
  title,
  image,
  imageAlt,
}: {
  title: string
  image: string
  imageAlt: string
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800 sm:text-2xl">{title}</h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <img
          src={image}
          alt={imageAlt}
          className="h-auto w-full object-cover"
          loading="lazy"
        />
      </div>
    </section>
  )
}
