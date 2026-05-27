import { Link } from "react-router-dom";

const INFO_LINKS = [
  { label: "Về chúng tôi", href: "/" },
  { label: "Chính sách bảo hành", href: "/warranty-policy" },
  { label: "Hướng dẫn mua hàng", href: "/purchase-guide" },
];

const SUPPORT_LINKS = [
  { label: "Điều khoản dịch vụ", href: "/" },
  { label: "Liên hệ hỗ trợ", href: "tel:19001234" },
  { label: "Hotline tự động: 1900 1234", href: "tel:19001234", highlighted: true },
];

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto" id="contact">
      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow">
                <span className="text-white font-black text-sm">W</span>
              </div>
              <span className="text-gray-900 font-extrabold text-lg">
                Hệ Thống Laptop &amp; Account
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Cung cấp laptop chính hãng và tài khoản số uy tín hàng đầu Việt Nam. Giao hàng siêu tốc, bảo hành rõ ràng, hỗ trợ 24/7.
            </p>
          </div>

          {/* THÔNG TIN */}
          <div>
            <h4 className="text-gray-900 text-xs font-bold uppercase tracking-wider mb-4">
              THÔNG TIN
            </h4>
            <ul className="space-y-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-500 text-sm hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* HỖ TRỢ */}
          <div>
            <h4 className="text-gray-900 text-xs font-bold uppercase tracking-wider mb-4">
              HỖ TRỢ &amp; ĐƯỜNG DÂY NÓNG
            </h4>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("tel:") ? (
                    <a
                      href={link.href}
                      className={`text-sm transition-colors ${
                        link.highlighted
                          ? "text-blue-600 font-semibold hover:text-blue-700"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-500 text-sm hover:text-blue-600 transition-colors"
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

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-200/50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 text-center sm:flex sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            © 2026 Hệ Thống Laptop &amp; Account. Tất cả quyền được bảo lưu.
          </p>
          <p className="text-xs text-gray-400 mt-1 sm:mt-0">
            Thiết kế bởi TechStore Team
          </p>
        </div>
      </div>
    </footer>
  );
}
