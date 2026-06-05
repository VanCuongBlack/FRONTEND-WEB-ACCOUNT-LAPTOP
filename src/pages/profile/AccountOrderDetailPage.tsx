import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

type AccountOrderStatus = "paid" | "processing";

interface AccountOrderDetail {
  id: string;
  status: AccountOrderStatus;
  purchaseDate: string;
  totalPrice: number;
  productName: string;
  productType: string;
  duration: string;
  warrantyMonths: number;
  accountEmail: string;
  accountPassword: string;
  profileSlot: string;
  pinCode: string;
  productPrice: number;
  discountPercent: number;
  usageGuide: string[];
  warrantyGuide: string[];
}

const ACCOUNT_ORDERS: Record<string, AccountOrderDetail> = {
  "ACC-20260514": {
    id: "ACC-20260514",
    status: "paid",
    purchaseDate: "01/06/2026",
    totalPrice: 200000,
    productName: "Canva Pro (Gói 1 năm)",
    productType: "Account số",
    duration: "1 năm",
    warrantyMonths: 12,
    accountEmail: "taikhoan.canva.email@gmail.com",
    accountPassword: "CanvaDoiMoi2026",
    profileSlot: "CV_user1",
    pinCode: "31335",
    productPrice: 220000,
    discountPercent: 9,
    usageGuide: [
      "Bước 1: Đăng nhập vào đúng ứng dụng và website chính thức.",
      "Bước 2: Chọn đúng profile đã được cấp (nếu có).",
      "Bước 3: Tuyệt đối không thay đổi mật khẩu hoặc email hệ thống trên tài khoản đã cấp.",
      "Bước 4: Không đăng nhập quá số lượng thiết bị cho phép."
    ],
    warrantyGuide: [
      "Bảo hành 1 đổi 1 trong 365 ngày theo đúng điều kiện sử dụng nếu lỗi phát sinh từ hệ thống.",
      "Từ chối bảo hành nếu chia sẻ trái phép, đổi mail hoặc thay đổi thông tin đăng nhập không được phép.",
      "Hỗ trợ kỹ thuật mỗi ngày qua kênh chăm sóc khách hàng."
    ]
  },
  "ACC-20260513": {
    id: "ACC-20260513",
    status: "paid",
    purchaseDate: "13/05/2026",
    totalPrice: 475000,
    productName: "Canva Pro (Gói 1 năm)",
    productType: "Account số",
    duration: "1 năm",
    warrantyMonths: 2,
    accountEmail: "abcde@gmail.com",
    accountPassword: "12345",
    profileSlot: "CV_user1",
    pinCode: "31335",
    productPrice: 500000,
    discountPercent: 5,
    usageGuide: [
      "Bước 1: Đăng nhập vào đúng ứng dụng và website chính thức.",
      "Bước 2: Chọn đúng profile đã được cấp (nếu có).",
      "Bước 3: Tuyệt đối không thay đổi mật khẩu hoặc email hệ thống trên tài khoản đã cấp.",
      "Bước 4: Không đăng nhập quá số lượng thiết bị cho phép."
    ],
    warrantyGuide: [
      "Bảo hành 1 đổi 1 hoặc hoàn tiền theo thời gian sử dụng nếu tài khoản bị lỗi.",
      "Từ chối bảo hành nếu chia sẻ trái phép, đổi mail hoặc vi phạm chính sách nền tảng.",
      "Hỗ trợ kỹ thuật trong suốt thời hạn bảo hành."
    ]
  }
};

const formatCurrency = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

export default function AccountOrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const order = useMemo(() => {
    if (!id) {
      return ACCOUNT_ORDERS["ACC-20260514"];
    }

    return ACCOUNT_ORDERS[id] ?? ACCOUNT_ORDERS["ACC-20260514"];
  }, [id]);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard can fail in some browser contexts; silently ignore for now.
    }
  };

  const statusLabel = order.status === "paid" ? "Đã thanh toán" : "Đang xử lý";

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] py-4 md:py-10 px-3 md:px-6 text-slate-800">
      <div className="max-w-[1100px] mx-auto bg-white border border-slate-200 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile/history")}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-700"
            aria-label="Quay lại lịch sử đơn hàng"
          >
            <ChevronLeft size={20} />
          </button>

          <h1 className="text-xl md:text-3xl font-bold text-slate-900">Mã đơn: #{order.id}</h1>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-slate-300 rounded-2xl px-4 py-3 text-sm">
          <p>
            Trạng thái: <span className="font-semibold text-slate-900">{statusLabel}</span>
          </p>
          <p>
            Ngày mua: <span className="font-semibold text-slate-900">{order.purchaseDate}</span>
          </p>
          <p>
            Tổng tiền: <span className="font-semibold text-slate-900">{formatCurrency(order.totalPrice)}</span>
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <section className="border border-slate-300 rounded-3xl p-5">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-800">Thông tin tài khoản</h2>
            <p className="mt-1 text-2xl font-bold text-slate-900">{order.productName}</p>

            <div className="mt-4 space-y-1 text-sm text-slate-700">
              <p>Loại: {order.productType}</p>
              <p>Thời hạn: {order.duration}</p>
              <p>Bảo hành: {order.warrantyMonths} tháng</p>
            </div>

            <div className="mt-4 border border-slate-300 rounded-2xl p-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">Tài khoản (Email):</p>
                  <p className="text-sm font-medium text-slate-900 break-all">{order.accountEmail}</p>
                </div>
                <button
                  onClick={() => handleCopy(order.accountEmail)}
                  className="shrink-0 px-3 py-1.5 rounded-full border border-slate-300 text-xs hover:bg-slate-100"
                >
                  Copy
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">Mật khẩu:</p>
                  <p className="text-sm font-medium text-slate-900 break-all">
                    {isPasswordVisible ? order.accountPassword : "********"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    className="p-2 rounded-full border border-slate-300 hover:bg-slate-100"
                    aria-label="Hiện ẩn mật khẩu"
                  >
                    {isPasswordVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => handleCopy(order.accountPassword)}
                    className="px-3 py-1.5 rounded-full border border-slate-300 text-xs hover:bg-slate-100"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 border border-slate-300 rounded-2xl p-3 space-y-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">Ghi chú profile và mã pin</p>
              <p className="text-sm text-slate-700">Profile của bạn: <span className="font-semibold">{order.profileSlot}</span></p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-700">Mã pin: <span className="font-semibold">{order.pinCode}</span></p>
                <button
                  onClick={() => handleCopy(order.pinCode)}
                  className="px-3 py-1.5 rounded-full border border-slate-300 text-xs hover:bg-slate-100"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Giá sản phẩm:</span>
                <span>{formatCurrency(order.productPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Giảm giá:</span>
                <span>{order.discountPercent}%</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-slate-900">
                <span>Tổng:</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </section>

          <section className="border border-slate-300 rounded-3xl p-5 flex flex-col">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-800">Hướng dẫn và bảo hành</h2>

            <h3 className="mt-4 text-2xl font-semibold text-slate-900">Hướng dẫn sử dụng</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-700 leading-relaxed">
              {order.usageGuide.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>

            <h3 className="mt-6 text-2xl font-semibold text-slate-900">Chính sách bảo hành</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-700 leading-relaxed">
              {order.warrantyGuide.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-medium">
                Gửi yêu cầu hỗ trợ
              </button>
              <button className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-medium">
                Đánh giá và phản hồi
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
