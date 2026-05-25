const INFO_LINKS = ['Về chúng tôi', 'Chính sách bảo hành']
const SUPPORT_LINKS = ['Điều khoản dịch vụ', 'Liên hệ hỗ trợ']

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-2" id="contact">
      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">

          {/* Brand */}
          <div className="sm:col-span-1">
            <h3 className="text-gray-900 font-semibold text-sm sm:text-base mb-2 sm:mb-3">
              Hệ Thống Laptop &amp; Account
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-xs">
              Cung cấp laptop chính hãng và tài khoản số uy tín.
              Giao hàng nhanh chóng, bảo hành rõ ràng.
            </p>
          </div>

          {/* THÔNG TIN */}
          <div>
            <h4 className="text-gray-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
              THÔNG TIN
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {INFO_LINKS.map(link => (
                <li key={link}>
                  <a href="#" className="text-gray-500 text-xs sm:text-sm hover:text-gray-900 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* HỖ TRỢ */}
          <div>
            <h4 className="text-gray-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
              HỖ TRỢ
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {SUPPORT_LINKS.map(link => (
                <li key={link}>
                  <a href="#" className="text-gray-500 text-xs sm:text-sm hover:text-gray-900 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 text-center">
          <p className="text-[11px] sm:text-xs text-gray-400">
            Thiết kế bởi TechStore Team • 2024
          </p>
        </div>
      </div>
    </footer>
  )
}
