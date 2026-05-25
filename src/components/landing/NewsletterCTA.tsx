export default function NewsletterCTA() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-4 sm:pb-6">
      <div className="rounded-2xl bg-blue-50 border border-blue-100 px-6 py-8 sm:px-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">
            Bạn chưa có tài khoản?
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
            Đăng ký ngay để nhận thông tin ưu đãi độc quyền,
            tích điểm và mua sắm tiện lợi hơn.
          </p>
        </div>

        {/* Button — full width on mobile, auto on larger */}
        <a
          href="/register"
          className="w-full sm:w-auto flex-shrink-0 text-center px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md shadow-blue-200 whitespace-nowrap"
        >
          Đăng ký ngay
        </a>
      </div>
    </section>
  )
}
