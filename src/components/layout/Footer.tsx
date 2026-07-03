import { Link } from 'react-router-dom'

const INFO_LINKS = [
  { label: 'Về chúng tôi', href: '/' },
  { label: 'Chính sách bảo hành', href: '/warranty-policy' },
  { label: 'Hướng dẫn mua hàng', href: '/purchase-guide' },
]

const SUPPORT_LINKS = [
  { label: 'Điều khoản dịch vụ', href: '/' },
  { label: 'Liên hệ hỗ trợ', href: 'tel:19001234' },
  { label: 'Hotline tự động: 1900 1234', href: 'tel:19001234', highlighted: true },
]

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#2d2852] bg-[#0d0826]" id="contact">
      <div className="mx-auto max-w-[1840px] px-4 pb-8 pt-10 sm:px-6">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1677ff] shadow">
                <span className="text-sm font-black text-white">PC</span>
              </div>
              <span className="text-lg font-extrabold text-white">
                PCAcc<span className="text-sm">.com</span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#b9b4d7]">
              Cung cấp PC, laptop và tài khoản số uy tín. Giao hàng nhanh, bảo hành rõ ràng, hỗ trợ 24/7.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              Thông tin
            </h4>
            <ul className="space-y-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#b9b4d7] transition-colors hover:text-[#79a7ff]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              Hỗ trợ &amp; đường dây nóng
            </h4>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('tel:') ? (
                    <a
                      href={link.href}
                      className={`text-sm transition-colors ${
                        link.highlighted
                          ? 'font-semibold text-[#79a7ff] hover:text-white'
                          : 'text-[#b9b4d7] hover:text-[#79a7ff]'
                      }`}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-[#b9b4d7] transition-colors hover:text-[#79a7ff]"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2d2852] bg-[#09051f]">
        <div className="mx-auto max-w-[1840px] px-4 py-4 text-center sm:flex sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-[#b9b4d7]">
            © 2026 PCAcc.com. Tất cả quyền được bảo lưu.
          </p>
          <p className="mt-1 text-xs text-[#827ca9] sm:mt-0">
            Thiết kế cho cửa hàng PC và account số
          </p>
        </div>
      </div>
    </footer>
  )
}
