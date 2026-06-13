import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Laptop,
  ShieldCheck,
  MapPin,
  Calendar,
  ClipboardCheck,
  Phone,
  User,
  CheckCircle2,
  PackageCheck,
  Truck,
  House,
} from 'lucide-react';

export default function LaptopOrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Lấy mã ID đơn hàng động từ URL hệ thống

  // Giả lập dữ liệu đổ từ Backend khớp chuẩn xác các trường nội dung mẫu trên hình ảnh của bạn
  const orderDetail = {
    id: id || "ACC-20260513",
    productName: "Laptop Dell XPS 13 9310 (Cũ 99%)",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
    totalPrice: 12000000,
    status: "Đã bàn giao",
    purchaseDate: "16:45 - 01/06/2026",
    paymentMethod: "Chuyển khoản ngân hàng (VNPAY)",
    shippingProvider: "Giao Hàng Tiết Kiệm (GHTK)",
    trackingNumber: "GHTK-XPS9310-99812",
    shippingTimeline: [
      {
        label: "Đặt hàng thành công",
        time: "16:45 - 01/06/2026",
        state: "done",
      },
      {
        label: "Đang kiểm tra & đóng gói",
        time: "18:20 - 01/06/2026",
        state: "done",
      },
      {
        label: "Đang giao hàng",
        time: "09:10 - 02/06/2026",
        state: "current",
      },
      {
        label: "Giao hàng thành công",
        time: "Dự kiến: 03/06/2026",
        state: "upcoming",
      },
    ],
    
    // Khối thông số kỹ thuật (Cực kỳ quan trọng đối với luồng sản phẩm laptop vật lý)
    specs: {
      cpu: "Intel Core i7-1165G7 (Up to 4.7GHz, 12MB Cache)",
      ram: "16GB LPDDR4x 4267MHz (Onboard)",
      storage: "512GB NVMe PCIe M.2 SSD",
      serialNumber: "DELL-XPS-9310-XYZ123-2026", // Mã định danh duy nhất của thiết bị
      condition: "Máy cũ ngoại hình 99%, nguyên bản chưa qua sửa chữa, pin sạc zin theo máy"
    },
    
    // Thông tin chính sách hậu mãi
    warranty: {
      period: "06 Tháng phần cứng",
      supportHotline: "1900.XXXX (Nhánh 2 - Kỹ thuật)",
      policy: "Lỗi 1 đổi 1 trong vòng 30 ngày đầu nếu phát sinh lỗi nguồn hoặc màn hình từ nhà sản xuất."
    },

    // Thông tin người nhận bàn giao thiết bị
    shippingAddress: {
      fullName: "Nguyễn Văn Khách Hàng",
      phoneNumber: "090.XXXX.XXX",
      fullAddress: "Số 123 Đường Pắc Bó, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh"
    }
  };

  return (
    // BỘ KHUNG NỀN TỔNG: Đệm cách lề linh hoạt tùy theo độ rộng thiết bị (Web lớn px-6, Mobile px-4)
    <div className="w-full min-h-screen bg-[#F8F9FA] py-6 md:py-12 px-4 md:px-6 font-sans antialiased text-slate-800">
      <div className="max-w-[850px] mx-auto bg-white rounded-2xl md:rounded-3xl p-5 md:p-10 shadow-sm border border-slate-100 space-y-8">
        
        {/* THANH ĐIỀU HƯỚNG TRÊN CÙNG (HEADER) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/profile/history')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-700 shrink-0"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-mono">Mã đơn: #{orderDetail.id}</h1>
            </div>
          </div>
          {/* Nhãn hiển thị trạng thái đơn hàng */}
          <span className="w-fit text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 shadow-2xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {orderDetail.status}
          </span>
        </div>

        {/* KHỐI 1: KHUNG THÔNG TIN TỔNG QUAN SẢN PHẨM PHÍA TRÊN */}
        <div className="flex flex-col md:flex-row gap-6 items-start bg-slate-50/50 p-4 md:p-6 rounded-2xl border border-slate-100">
          <div className="w-full md:w-[220px] h-40 md:h-[140px] rounded-xl overflow-hidden bg-white flex-shrink-0 border border-slate-200">
            <img src={orderDetail.image} alt={orderDetail.productName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-3 w-full">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Laptop className="text-[#3786EC]" size={22} />
              {orderDetail.productName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-500">
              <p className="flex items-center gap-2"><Calendar size={14} /> <span className="font-medium text-slate-700">{orderDetail.purchaseDate}</span></p>
              <p className="flex items-center gap-2"><ClipboardCheck size={14} /> HTVC: <span className="font-medium text-slate-700">{orderDetail.shippingProvider}</span></p>
            </div>
            <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-400">Thành tiền thanh toán:</span>
              <span className="text-xl md:text-2xl font-extrabold text-[#3786EC]">{orderDetail.totalPrice.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        </div>

        {/* KHỐI 2: THÔNG SỐ CẤU HÌNH CHI TIẾT CỦA MÁY (Bố cục dạng bảng lưới sạch sẽ) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>📋 Thông số kỹ thuật & Cấu hình bàn giao</span>
          </h3>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs text-sm">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-100"><td className="p-3.5 text-slate-500 font-medium bg-slate-50/60 w-1/3 sm:w-1/4">Vi xử lý (CPU)</td><td className="p-3.5 font-semibold text-slate-800">{orderDetail.specs.cpu}</td></tr>
                <tr className="border-b border-slate-100"><td className="p-3.5 text-slate-500 font-medium bg-slate-50/60">Bộ nhớ (RAM)</td><td className="p-3.5 font-semibold text-slate-800">{orderDetail.specs.ram}</td></tr>
                <tr className="border-b border-slate-100"><td className="p-3.5 text-slate-500 font-medium bg-slate-50/60">Ổ cứng (Storage)</td><td className="p-3.5 font-semibold text-slate-800">{orderDetail.specs.storage}</td></tr>
                <tr className="border-b border-slate-100"><td className="p-3.5 text-slate-500 font-medium bg-slate-50/60">Tình trạng thực tế</td><td className="p-3.5 font-normal text-slate-600 italic">{orderDetail.specs.condition}</td></tr>
                <tr className="bg-orange-50/30"><td className="p-3.5 text-orange-700 font-bold bg-orange-50/50">Mã Số Định Danh (Serial S/N)</td><td className="p-3.5 font-mono font-bold text-orange-600 select-all">{orderDetail.specs.serialNumber}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Thông tin vận chuyển & lộ trình
          </h3>

          <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
            <div className="space-y-4">
              {orderDetail.shippingTimeline.map((step, index) => {
                const isDone = step.state === 'done';
                const isCurrent = step.state === 'current';

                const Icon = isCurrent
                  ? Truck
                  : index === 0
                    ? CheckCircle2
                    : index === 1
                      ? PackageCheck
                      : House;

                return (
                  <div key={step.label} className="relative flex items-start gap-3">
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white">
                      <Icon
                        size={18}
                        className={
                          isDone
                            ? 'text-emerald-500'
                            : isCurrent
                              ? 'text-[#3786EC]'
                              : 'text-slate-400'
                        }
                      />
                    </div>

                    {index !== orderDetail.shippingTimeline.length - 1 && (
                      <span className="absolute left-[19px] top-10 h-6 w-px bg-slate-300"></span>
                    )}

                    <div className="pt-1">
                      <p
                        className={`text-[15px] font-semibold ${
                          isDone
                            ? 'text-emerald-700'
                            : isCurrent
                              ? 'text-[#1E5FBF]'
                              : 'text-slate-600'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{step.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* KHỐI 3: CHÍNH SÁCH BẢO HÀNH & ĐỊA CHỈ NHẬN HÀNG (Chia 2 cột dọc trên máy tính, 1 cột trên điện thoại) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Cột trái: Thông tin bảo hành */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="text-emerald-500" size={16} />
              Chế độ bảo hành thiết bị
            </h4>
            <div className="space-y-2 text-sm text-slate-600">
              <p>• <span className="font-semibold text-slate-800">Thời hạn:</span> {orderDetail.warranty.period}</p>
              <p>• <span className="font-semibold text-slate-800">Tổng đài hỗ trợ:</span> {orderDetail.warranty.supportHotline}</p>
              <p className="text-xs text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                {orderDetail.warranty.policy}
              </p>
            </div>
          </div>

          {/* Cột phải: Địa chỉ và thông tin giao nhận hàng */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin className="text-rose-500" size={16} />
              Thông tin nhận hàng
            </h4>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2"><User size={14} className="text-slate-400" /> <span className="font-semibold text-slate-800">{orderDetail.shippingAddress.fullName}</span></p>
              <p className="flex items-center gap-2"><Phone size={14} className="text-slate-400" /> <span className="font-mono">{orderDetail.shippingAddress.phoneNumber}</span></p>
              <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-50 mt-1">
                {orderDetail.shippingAddress.fullAddress}
              </p>
            </div>
          </div>

        </div>

        {/* KHỐI CƠ CHẾ THANH TOÁN & ĐIỀU HƯỚNG FOOTER */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-400">
          <p>Phương thức thanh toán: <span className="font-medium text-slate-600">{orderDetail.paymentMethod}</span></p>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/profile/history')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto text-center"
            >
              Quay lại danh sách
            </button>
            <button
              onClick={() =>
                navigate(`/profile/history/support/laptop/${orderDetail.id}`, {
                  state: { productName: orderDetail.productName },
                })
              }
              className="px-4 py-2.5 rounded-xl bg-[#3786EC] text-white font-semibold hover:bg-[#3786EC]/90 transition-all text-center shadow-xs w-full sm:w-auto block"
            >
              Yêu cầu hỗ trợ kỹ thuật
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}