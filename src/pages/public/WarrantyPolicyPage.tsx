import {
  AlertOctagon,
  Award,
  CheckCircle2,
  Clock,
  HelpCircle,
  Laptop,
  MessageSquare,
  PhoneCall,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const laptopTerms = [
  'Sản phẩm còn trong thời hạn bảo hành được ghi nhận trên hệ thống hoặc phiếu bảo hành đi kèm.',
  'Tem bảo hành của cửa hàng và nhà sản xuất còn nguyên vẹn, không bị rách, tẩy xóa hoặc dán đè.',
  'Hư hỏng được xác định do lỗi kỹ thuật phát sinh từ nhà sản xuất.',
]

const rejectTerms = [
  'Sản phẩm hư hỏng do rơi vỡ, va đập, vào nước hoặc tác động ngoại lực.',
  'Người dùng tự ý tháo mở, sửa chữa hoặc thay thế linh kiện tại nơi không được ủy quyền.',
  'Hư hại do thiên tai, hỏa hoạn, ẩm mốc kéo dài hoặc sử dụng sai điện áp.',
]

const processSteps = [
  {
    title: 'Liên hệ yêu cầu',
    text: 'Gửi yêu cầu qua hotline, fanpage hoặc trực tiếp tại cửa hàng kèm video/hình ảnh lỗi thực tế.',
  },
  {
    title: 'Kiểm tra kỹ thuật',
    text: 'Kỹ thuật viên tiếp nhận và kiểm định tình trạng sản phẩm trong 24 - 48 giờ làm việc.',
  },
  {
    title: 'Đổi trả hoặc hoàn tiền',
    text: 'Sau khi xác nhận lỗi, cửa hàng đổi mới sản phẩm tương đương hoặc hoàn tiền theo chính sách.',
  },
]

export default function WarrantyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] font-sans">
      <Header pageLabel="Chính sách bảo hành" />

      <section className="border-b border-slate-800 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 py-12 text-white sm:px-6 sm:py-16 md:px-8">
        <div className="mx-auto grid max-w-[1840px] grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Chính sách bảo hành <br />& Đổi trả
            </h1>
            <p className="max-w-2xl text-sm font-medium leading-relaxed text-slate-300 sm:text-base">
              Cam kết đem lại sự an tâm cho khách hàng với quy trình xử lý minh bạch,
              nhanh chóng và phù hợp cho cả laptop, PC lẫn tài khoản số.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex min-w-[200px] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Award className="h-10 w-10 rounded-xl bg-sky-500/20 p-2 text-sky-400" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Chính hãng</h4>
                  <p className="mt-0.5 text-sm font-extrabold text-white">100% cam kết</p>
                </div>
              </div>
              <div className="flex min-w-[200px] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <RefreshCw className="h-10 w-10 rounded-xl bg-emerald-500/20 p-2 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Xử lý nhanh</h4>
                  <p className="mt-0.5 text-sm font-extrabold text-white">Tối đa 7 ngày</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-700/50 bg-slate-950/70 p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Warranty Board</span>
                <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-300">
                  Đang xử lý
                </span>
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> Mã yêu cầu: #TK-88219
                </p>
                <p className="flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-sky-400" /> Thiết bị đã bàn giao
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" /> Dự kiến phản hồi trong 24 giờ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1840px] flex-1 space-y-8 px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <ShieldCheck className="h-10 w-10 rounded-xl bg-blue-50 p-2 text-blue-600" />
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Bảo hành Laptop / PC</h2>
                <p className="text-xs font-semibold text-slate-400">Áp dụng cho laptop, PC và phần cứng.</p>
              </div>
            </div>

            <h3 className="mb-3 text-sm font-bold text-slate-900">Điều kiện áp dụng</h3>
            <ul className="space-y-3 text-sm leading-6 text-slate-600">
              {laptopTerms.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="mb-3 mt-6 text-sm font-bold text-slate-900">Điều kiện từ chối</h3>
            <ul className="space-y-3 text-sm leading-6 text-slate-600">
              {rejectTerms.map((item) => (
                <li key={item} className="flex gap-2">
                  <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <RotateCcw className="h-10 w-10 rounded-xl bg-violet-50 p-2 text-violet-600" />
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Bảo hành Account</h2>
                <p className="text-xs font-semibold text-slate-400">Áp dụng cho tài khoản, khóa phần mềm và dịch vụ số.</p>
              </div>
            </div>

            <div className="space-y-4 text-sm leading-6 text-slate-600">
              <p>
                Tài khoản được bảo hành 1 đổi 1 trong thời gian đăng ký nếu lỗi phát sinh
                từ phía hệ thống hoặc thông tin bàn giao không đúng.
              </p>
              <p>
                Không hỗ trợ bảo hành khi khách hàng tự ý thay đổi email, mật khẩu,
                chia sẻ tài khoản trái quy định hoặc vi phạm điều khoản của nhà phát hành.
              </p>
              <p>
                Mọi thông tin đăng nhập và dữ liệu cá nhân được cam kết bảo mật trong
                suốt quá trình sử dụng dịch vụ.
              </p>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Quy trình đổi trả</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              3 bước đơn giản để gửi yêu cầu bảo hành hoặc đổi trả.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <div key={step.title} className="rounded-2xl bg-slate-50 p-5">
                <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                  {index + 1}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-[#0f172a] p-6 text-white">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-extrabold">Bạn vẫn còn thắc mắc?</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Liên hệ trực tiếp với đội ngũ hỗ trợ để được kiểm tra và hướng dẫn xử lý.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900" href="tel:19000000">
                <PhoneCall className="h-4 w-4" /> Hotline
              </a>
              <a className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white" href="/support">
                <MessageSquare className="h-4 w-4" /> Hỗ trợ
              </a>
              <a className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white" href="/purchase-guide">
                <HelpCircle className="h-4 w-4" /> Hướng dẫn
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
