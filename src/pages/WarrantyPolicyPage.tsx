import {
  Laptop, ShieldCheck, CheckCircle2, RotateCcw, AlertOctagon, HelpCircle,
  PhoneCall, MessageSquare, ShieldAlert, Award, RefreshCw, Clock, Lock
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function WarrantyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Existing layout Header */}
      <Header pageLabel="Chính sách bảo hành" />

      {/* ─── Hero / Header Section ─── */}
      <section className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white py-12 sm:py-16 px-4 sm:px-6 md:px-8 border-b border-slate-800 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Hero Left */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent">
              Chính sách bảo hành <br />&amp; Đổi trả
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              Cam kết đem lại sự an tâm tuyệt đối cho khách hàng với quy trình xử lý chuyên nghiệp, minh bạch và nhanh chóng. Chúng tôi luôn đồng hành cùng bạn trong suốt quá trình sử dụng sản phẩm.
            </p>

            {/* Micro badges */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm min-w-[200px]">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chính hãng</h4>
                  <p className="text-sm font-extrabold text-white mt-0.5">100% Cam kết</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm min-w-[200px]">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Xử lý nhanh</h4>
                  <p className="text-sm font-extrabold text-white mt-0.5">Tối đa 7 ngày</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right: SVG mockup representing admin workflow */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[420px] bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-4">
                {/* Simulated Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider">WARRANTY STATUS BOARD</span>
                </div>
                {/* Simulated Dashboard content */}
                <div className="space-y-3">
                  <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800/80 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mã yêu cầu</p>
                      <p className="text-xs font-bold text-white mt-0.5">#TK-88219</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      Đang xử lý
                    </span>
                  </div>

                  <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                      <span>Thiết bị bàn giao</span>
                      <span className="text-emerald-400">Đã nhận máy</span>
                    </div>
                    <p className="text-xs font-bold text-slate-200">Dell Gaming G15 - Core i7</p>
                  </div>

                  {/* Tech assigned mockup */}
                  <div className="bg-sky-950/20 rounded-lg p-3 border border-sky-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-sky-500/15 flex items-center justify-center text-sky-400">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400">Kỹ thuật viên chỉ định</p>
                        <p className="text-[11px] font-bold text-slate-200">Trần Văn A</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-sky-400 font-bold">15 phút nữa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Two-Column Warranty Policies ─── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Card: Laptop Warranty */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-6">
            {/* Title with Laptop Icon */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-inner">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Bảo hành Laptop</h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Áp dụng cho các sản phẩm Laptop, PC &amp; Phần cứng</p>
              </div>
            </div>

            {/* Conditions 1 */}
            <div className="space-y-3">
              <span className="inline-flex px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold tracking-wider uppercase">
                Điều kiện áp dụng
              </span>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4.5 h-4.5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                    Sản phẩm còn trong thời hạn bảo hành được ghi nhận trên hệ thống hoặc phiếu bảo hành đi kèm.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4.5 h-4.5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                    Tem bảo hành của cửa hàng và nhà sản xuất phải còn nguyên vẹn, không có bất kỳ dấu hiệu rách nát, tẩy xóa hay dán đè.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4.5 h-4.5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                    Hư hỏng được xác định do lỗi kỹ thuật phát sinh từ phía nhà sản xuất (Bàn phím kẹt, hỏng màn hình hiển thị, lỗi pin chai đột ngột, hỏng linh kiện trên Mainboard).
                  </p>
                </li>
              </ul>
            </div>

            {/* Refusal Conditions */}
            <div className="space-y-3 pt-2">
              <span className="inline-flex px-3 py-1 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold tracking-wider uppercase">
                Điều kiện từ chối
              </span>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <AlertOctagon className="w-4.5 h-4.5 text-rose-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                    Sản phẩm bị hư hỏng do ngoại lực bên ngoài: Rơi vỡ, va đập gây biến dạng móp méo, trầy xước nặng, hoặc có dấu vết của chất lỏng xâm nhập vào bên trong linh kiện.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <AlertOctagon className="w-4.5 h-4.5 text-rose-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                    Người dùng tự ý tháo mở vỏ máy, nâng cấp thay thế phần cứng hoặc đem máy đi bảo dưỡng sửa chữa tại các cơ sở, trung tâm không nằm trong danh mục ủy quyền chính thức.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <AlertOctagon className="w-4.5 h-4.5 text-rose-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                    Hư hại gây ra bởi sự cố thiên tai, hỏa hoạn, ẩm mốc kéo dài, hoặc sử dụng sai điện áp định mức gây chập cháy linh kiện.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Card: Account Warranty */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-6">
            {/* Title with Account Icon */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Bảo hành Account</h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Áp dụng cho các loại tài khoản, khóa phần mềm &amp; cloud</p>
              </div>
            </div>

            {/* Description Info block */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-5 space-y-4">
              <p className="text-xs text-slate-500 italic font-semibold leading-relaxed">
                * Áp dụng cho các dịch vụ phần mềm, tài khoản bản quyền (Netflix, Adobe, Microsoft, v.v.) và dịch vụ lưu trữ đám mây cung cấp bởi cửa hàng.
              </p>

              {/* Multi grid stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold">Thời gian lỗi</span>
                  </div>
                  <p className="text-xs text-slate-600 font-extrabold">Bảo hành 1 đổi 1 suốt thời gian đăng ký.</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-xs font-bold">Tốc độ xử lý</span>
                  </div>
                  <p className="text-xs text-slate-600 font-extrabold">Khắc phục hoặc đổi mới tài khoản trong 2-4 giờ.</p>
                </div>
              </div>
            </div>

            {/* Rules list */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Quy định cụ thể:</span>

              <div className="space-y-3.5">
                <div className="flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Không vi phạm điều khoản sử dụng</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1 font-semibold">
                      Không hỗ trợ bảo hành trong trường hợp khách hàng vi phạm các điều khoản hoạt động của nhà phát hành (Netflix, Microsoft...), tự ý chia sẻ tài khoản hoặc thay đổi thông tin liên lạc (Email, Password) mà không được thông báo trước.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Lock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Cam kết bảo mật thông tin</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1 font-semibold">
                      Chúng tôi cam kết bảo mật tuyệt đối các thông tin đăng nhập, hồ sơ dữ liệu cá nhân của khách hàng trong suốt thời gian bảo hành và sử dụng dịch vụ.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ─── Return Process Section ─── */}
      <section className="bg-white border-y border-slate-200 py-12 md:py-16 px-4">
        <div className="max-w-[1200px] mx-auto text-center space-y-12">
          
          {/* Header */}
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Quy trình đổi trả</h2>
            <p className="text-sm text-slate-500 font-semibold">Sơ đồ 3 bước đơn giản để thực hiện yêu cầu đổi trả hoặc bảo hành sản phẩm của bạn.</p>
          </div>

          {/* Process Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 group relative z-10">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 border-2 border-blue-500/20 flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform duration-300">
                <PhoneCall className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow">1</span>
              </div>
              <div className="space-y-1.5 px-4">
                <h4 className="text-sm font-bold text-slate-900">Liên hệ yêu cầu</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Gửi yêu cầu qua Hotline, Fanpage hoặc đến trực tiếp tại cửa hàng kèm đầy đủ video/hình ảnh lỗi thực tế.
                </p>
              </div>
            </div>

            {/* Connecting Line 1 (Hidden on Mobile) */}
            <div className="hidden md:block absolute top-8 left-[23%] right-[57%] h-0.5 bg-slate-200 -z-0"></div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 group relative z-10">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 border-2 border-blue-500/20 flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform duration-300">
                <HelpCircle className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow">2</span>
              </div>
              <div className="space-y-1.5 px-4">
                <h4 className="text-sm font-bold text-slate-900">Kiểm tra kỹ thuật</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Đội ngũ kỹ thuật viên của chúng tôi tiếp nhận và kiểm định tình trạng sản phẩm trong vòng 24 - 48 giờ làm việc.
                </p>
              </div>
            </div>

            {/* Connecting Line 2 (Hidden on Mobile) */}
            <div className="hidden md:block absolute top-8 left-[57%] right-[23%] h-0.5 bg-slate-200 -z-0"></div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 group relative z-10">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 border-2 border-blue-500/20 flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform duration-300">
                <RotateCcw className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow">3</span>
              </div>
              <div className="space-y-1.5 px-4">
                <h4 className="text-sm font-bold text-slate-900">Đổi trả/Hoàn tiền</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Sau khi xác nhận lỗi của thiết bị, chúng tôi tiến hành đổi mới sản phẩm tương đương hoặc hoàn tiền theo yêu cầu.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── Bottom CTA / Need help? ─── */}
      <section className="max-w-[1200px] mx-auto w-full px-4 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

          <div className="space-y-2 relative z-10 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">Bạn vẫn còn thắc mắc?</h3>
            <p className="text-sm text-blue-100 font-semibold leading-relaxed max-w-xl">
              Đừng ngần ngại liên hệ trực tiếp với đội ngũ hỗ trợ kỹ thuật của chúng tôi. Chúng tôi luôn ở đây để đồng hành và sẵn sàng giải đáp mọi vấn đề của bạn.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 relative z-10 flex-shrink-0">
            <a
              href="tel:19001234"
              className="px-6 py-3 bg-white hover:bg-slate-50 text-blue-700 rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              1900 1234
            </a>
            <button
              onClick={() => alert('Mở khung chat hỗ trợ trực tuyến...')}
              className="px-6 py-3 border border-white/30 hover:bg-white/10 rounded-xl font-bold text-xs text-white transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Chat ngay
            </button>
          </div>
        </div>
      </section>

      {/* Existing layout Footer */}
      <Footer />
    </div>
  )
}
