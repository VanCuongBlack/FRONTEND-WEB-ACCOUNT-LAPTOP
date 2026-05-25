export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <p className="text-[18px] font-extrabold text-[#3783EC]">web_acc</p>
          <p className="text-[13px] text-gray-500 mt-1">
            Nền tảng mua laptop và tài khoản số uy tín.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-[14px] text-gray-600">
          <a href="/warranty-policy" className="hover:text-[#3783EC] transition-colors">
            Chính sách bảo hành / đổi trả
          </a>
          <a href="/purchase-guide" className="hover:text-[#3783EC] transition-colors">
            Hướng dẫn mua hàng
          </a>
          <a href="tel:19001234" className="hover:text-[#3783EC] transition-colors font-semibold text-[#3783EC]">
            Hotline tự động: 1900 1234
          </a>
          <a
            href="https://facebook.com/web_acc"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#3783EC] transition-colors"
          >
            Facebook: facebook.com/web_acc
          </a>
        </div>

        <p className="text-[12px] text-gray-400">© 2026 web_acc</p>
      </div>
    </footer>
  );
}
