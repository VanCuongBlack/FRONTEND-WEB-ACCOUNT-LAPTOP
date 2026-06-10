import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getStoredUserProfile } from "@/utils/profileStorage";
import {
  getStoredSupportRequests,
  type SupportRequestStatus,
} from "@/utils/supportRequestStorage";

export default function ProfilePage() {
  const navigate = useNavigate();
  const profile = getStoredUserProfile();
  const [activeStatusKey, setActiveStatusKey] = useState<
    "pending" | "shipping" | "review" | null
  >(null);

  const orderStatusCards = [
    {
      key: "pending" as const,
      title: "Chờ xác nhận",
      orders: [
        {
          id: "LAP-20260601",
          name: "MacBook Air M2 13 inch",
          price: "27.500.000đ",
          type: "laptop" as const,
        },
        {
          id: "LAP-20260602",
          name: "ASUS Vivobook 15 OLED",
          price: "18.900.000đ",
          type: "laptop" as const,
        },
      ],
      icon: (
        <svg
          className="w-8 h-8 text-[#3783EC]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3"
          />
          <circle
            cx="12"
            cy="12"
            r="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "shipping" as const,
      title: "Đang giao hàng",
      orders: [
        {
          id: "ACC-20260513",
          name: "Dell XPS 13 9310 (Cũ 99%)",
          price: "12.000.000đ",
          type: "laptop" as const,
        },
        {
          id: "LAP-20260604",
          name: "Lenovo ThinkPad X1 Carbon Gen 9",
          price: "22.500.000đ",
          type: "laptop" as const,
        },
      ],
      icon: (
        <svg
          className="w-8 h-8 text-[#3783EC]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17H6a2 2 0 01-2-2V7a2 2 0 012-2h9a2 2 0 012 2v2"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 9h3l3 3v3h-2"
          />

          <circle cx="7.5" cy="17.5" r="1.5" />
          <circle cx="17.5" cy="17.5" r="1.5" />
        </svg>
      ),
    },
    {
      key: "review" as const,
      title: "Đánh giá",
      orders: [
        {
          id: "LAP-20260605",
          name: "Lenovo Legion 5",
          price: "31.990.000đ",
          type: "laptop" as const,
        },
        {
          id: "ACC-20260514",
          name: "Tài khoản Microsoft 365 Family",
          price: "499.000đ",
          type: "account" as const,
        },
      ],
      icon: (
        <svg
          className="w-8 h-8 text-[#3783EC]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.959a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.447a1 1 0 00-.364 1.118l1.287 3.958c.3.922-.755 1.688-1.54 1.118l-3.366-2.447a1 1 0 00-1.176 0l-3.366 2.447c-.785.57-1.84-.196-1.54-1.118l1.287-3.958a1 1 0 00-.364-1.118L2.98 9.386c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.369-3.959z"
          />
        </svg>
      ),
    },
  ];

  const activeStatusCard = orderStatusCards.find(
    (item) => item.key === activeStatusKey
  );

  const handleOpenOrderDetail = (order: {
    id: string;
    type: "laptop" | "account";
  }) => {
    setActiveStatusKey(null);

    if (order.type === "laptop") {
      navigate(`/profile/history/laptop/${order.id}`);
      return;
    }

    navigate(`/profile/history/account/${order.id}`);
  };

  const supportRequests = getStoredSupportRequests();

  const statusMap: Record<
    SupportRequestStatus,
    { label: string; dotColor: string }
  > = {
    pending: { label: "Chờ tiếp nhận", dotColor: "bg-amber-400" },
    in_progress: { label: "Đang xử lý", dotColor: "bg-blue-500" },
    responded: { label: "Đã phản hồi", dotColor: "bg-emerald-500" },
  };

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString("vi-VN");

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F5F5F5] text-black">
      <Header pageLabel="Hồ Sơ" cartCount={2} />

      {/* ================= BODY ================= */}
      <main className="w-full max-w-[1000px] mx-auto py-6 px-4 flex-1">
        {/* PROFILE */}
        <div className="bg-white rounded-2xl shadow-sm p-5 md:p-7 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#3783EC]/10 shadow-sm">
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-[24px] font-bold text-gray-900">
                {profile.fullName}
              </h2>

              <p className="text-[14px] text-gray-500 mt-1">
                Thành viên từ {profile.memberSince}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/profile/edit")}
                  className="h-[40px] px-5 rounded-lg border border-[#3783EC] text-[#3783EC] hover:bg-[#3783EC] hover:text-white transition-all text-[14px] font-medium"
                >
                  Sửa hồ sơ
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("user");

                    alert("Đăng xuất thành công");

                    window.location.href = "/login";
                  }}
                  className="h-[40px] px-5 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[14px] font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ORDERS */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[20px] font-bold text-gray-900">
              Đơn hàng của tôi
            </h3>

            <Link
              to="/profile/history"
              className="text-[#3783EC] text-[14px] hover:underline"
            >
              Xem lịch sử mua hàng →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {orderStatusCards.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveStatusKey(item.key)}
                className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col items-center hover:shadow-md transition-all cursor-pointer text-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#3783EC]/10 flex items-center justify-center">
                  {item.icon}
                </div>

                <span className="mt-3 sm:mt-4 text-[14px] sm:text-[15px] font-semibold text-gray-800 leading-tight">
                  {item.title}
                </span>

                <p className="mt-2 text-[12px] sm:text-[13px] text-gray-500 leading-snug">
                  {item.orders.length} đơn hàng
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* SUPPORT */}
        <section>
          <h3 className="text-[20px] font-bold text-gray-900 mb-4">
            Yêu cầu hỗ trợ
          </h3>

          <div className="flex flex-col gap-4">
            {supportRequests.map((req) => {
              const requestStatus = statusMap[req.status];

              return (
                <div
                  key={req.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-[15px] text-gray-800">
                      {req.productName} • #{req.id}
                    </p>

                    <p className="text-[13px] text-gray-600 mt-2 line-clamp-2">
                      {req.description || "Khách hàng chưa bổ sung mô tả chi tiết."}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[13px] text-gray-500 mt-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${requestStatus.dotColor}`}></span>
                      <span>{requestStatus.label}</span>
                      <span>•</span>
                      <span>{formatDate(req.createdAt)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/profile/support/${req.id}`)}
                    className="h-[42px] px-5 rounded-xl bg-[#3783EC]/10 text-[#3783EC] font-medium text-[14px] hover:bg-[#3783EC] hover:text-white transition-all"
                  >
                    Chi tiết yêu cầu
                  </button>
                </div>
              );
            })}

            {supportRequests.length === 0 && (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-5 text-[14px] text-gray-500">
                Chưa có yêu cầu hỗ trợ nào.
              </div>
            )}
          </div>
        </section>

        {activeStatusCard && (
          <div
            className="fixed inset-0 z-50 bg-black/40 px-4 py-6 flex items-center justify-center"
            onClick={() => setActiveStatusKey(null)}
          >
            <div
              className="w-full max-w-[520px] bg-white rounded-2xl border border-gray-200 shadow-xl p-4 sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-[18px] sm:text-[20px] font-bold text-gray-900">
                  {activeStatusCard.title}
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveStatusKey(null)}
                  className="h-9 px-3 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-100"
                >
                  Đóng
                </button>
              </div>

              <p className="mt-1 text-[13px] text-gray-500">
                Danh sách đơn hàng trong trạng thái này
              </p>

              <div className="mt-4 space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {activeStatusCard.orders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => handleOpenOrderDetail(order)}
                    className="w-full text-left rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 hover:border-[#3783EC] hover:bg-[#3783EC]/5 transition-all"
                  >
                    <p className="text-[12px] text-gray-500 font-mono">
                      Mã đơn: #{order.id}
                    </p>
                    <p className="mt-1 text-[14px] font-semibold text-gray-800">
                      {order.name}
                    </p>
                    <p className="mt-1 text-[13px] text-[#3783EC] font-semibold">
                      {order.price}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}