import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useUser } from "@/hooks/useUser";
import { useOrder } from "@/hooks/useOrder";
import { useAuthStore } from "@/store/authStore";
import {
  getMyTickets,
  type SupportTicket,
  type SupportTicketStatus,
} from "@/services/support.service";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuthStore();
  const { user: profileUser, getProfile } = useUser();
  const { orders, fetchOrders, isLoading: ordersLoading } = useOrder();
  const [supportRequests, setSupportRequests] = useState<SupportTicket[]>([]);
  const [supportLoading, setSupportLoading] = useState(false);
  const [activeStatusKey, setActiveStatusKey] = useState<
    "pending" | "shipping" | "review" | null
  >(null);

  useEffect(() => {
    getProfile();
    fetchOrders();

    setSupportLoading(true);
    getMyTickets({ limit: 5 })
      .then((res) => {
        setSupportRequests(res.data?.data?.tickets ?? []);
      })
      .catch(() => {
        setSupportRequests([]);
      })
      .finally(() => {
        setSupportLoading(false);
      });
  }, []);

  const displayUser = profileUser || authUser;

  const orderStatusCards = [
    {
      key: "pending" as const,
      title: "Chờ xác nhận",
      status: "pending",
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
      status: "processing",
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
      status: "completed",
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

  const filteredOrders = activeStatusCard 
    ? orders.filter(order => order.status === activeStatusCard.status)
    : [];

  const handleOpenOrderDetail = (orderId: string) => {
    setActiveStatusKey(null);
    navigate(`/profile/history/${orderId}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const statusMap: Record<
    SupportTicketStatus,
    { label: string; dotColor: string }
  > = {
    open: { label: "Chờ tiếp nhận", dotColor: "bg-amber-400" },
    in_progress: { label: "Đang xử lý", dotColor: "bg-blue-500" },
    waiting_customer: { label: "Chờ phản hồi", dotColor: "bg-blue-400" },
    resolved: { label: "Đã phản hồi", dotColor: "bg-emerald-500" },
    closed: { label: "Đã đóng", dotColor: "bg-slate-400" },
    cancelled: { label: "Đã hủy", dotColor: "bg-red-400" },
    reopened: { label: "Đã mở lại", dotColor: "bg-purple-400" },
  };

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString("vi-VN");

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#09051f] text-white">
      <Header pageLabel="Hồ sơ của tôi" cartCount={2} />

      <main className="w-full max-w-7xl mx-auto px-4 py-6 flex-1">
        {/* PROFILE */}
        <div className="bg-[#211b42] rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.18)] p-5 md:p-7 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#3783EC]/10 shadow-[0_18px_40px_rgba(0,0,0,0.18)] bg-gray-200 flex items-center justify-center">
              {displayUser?.avatar ? (
                <img
                  src={displayUser.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">👤</span>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-[24px] font-bold text-white">
                {displayUser?.fullname || displayUser?.email || "Người dùng"}
              </h2>

              <p className="text-[14px] text-[#b9b4d7] mt-1">
                {displayUser?.email}
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
                  onClick={handleLogout}
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
            <h3 className="text-[20px] font-bold text-white">
              Đơn hàng của tôi
            </h3>

            <Link
              to="/profile/history"
              className="text-[#3783EC] text-[14px] hover:underline"
            >
              Xem lịch sử mua hàng →
            </Link>
          </div>

          {ordersLoading ? (
            <div className="text-center py-8">
              <p className="text-[#b9b4d7]">Đang tải đơn hàng...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {orderStatusCards.map((item) => {
                const ordersForStatus = orders.filter(order => order.status === item.status);
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveStatusKey(item.key)}
                    className="bg-[#211b42] rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.18)] p-4 sm:p-6 flex flex-col items-center hover:shadow-md transition-all cursor-pointer text-center"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#3783EC]/10 flex items-center justify-center">
                      {item.icon}
                    </div>

                    <span className="mt-3 sm:mt-4 text-[14px] sm:text-[15px] font-semibold text-white leading-tight">
                      {item.title}
                    </span>

                    <span className="mt-2 text-[20px] font-bold text-[#3783EC]">
                      {ordersForStatus.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {activeStatusCard && filteredOrders.length > 0 && (
            <div className="mt-4 bg-[#211b42] rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.18)] p-4 sm:p-6">
              <h4 className="text-[16px] font-bold text-white mb-4">
                {activeStatusCard.title}
              </h4>

              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    onClick={() => handleOpenOrderDetail(order._id)}
                    className="p-4 border border-[#3d63ff]/20 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-white">
                          Mã đơn: {order._id}
                        </p>
                        <p className="text-[14px] text-[#b9b4d7] mt-1">
                          {order.items.length} sản phẩm
                        </p>
                      </div>
                      <p className="font-bold text-[#3783EC]">
                        {order.total_amount.toLocaleString()}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SUPPORT */}
        <section>
          <h3 className="text-[20px] font-bold text-white mb-4">
            Yêu cầu hỗ trợ
          </h3>

          <div className="flex flex-col gap-4">
            {supportLoading && (
              <div className="bg-[#211b42] border border-dashed border-[#3d63ff]/20 rounded-2xl p-5 text-[14px] text-[#b9b4d7]">
                Đang tải yêu cầu hỗ trợ...
              </div>
            )}

            {!supportLoading && supportRequests.map((req) => {
              const requestStatus =
                statusMap[req.status] ?? {
                  label: req.status,
                  dotColor: "bg-slate-400",
                };

              return (
                <div
                  key={req._id}
                  className="bg-[#211b42] border border-[#3d63ff]/20 rounded-2xl p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] hover:shadow-md transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-[15px] text-white">
                      {req.product_name || req.title} • {req.ticket_code || `#${req._id}`}
                    </p>

                    <p className="text-[13px] text-[#b9b4d7] mt-2 line-clamp-2">
                      {req.description || "Khách hàng chưa bổ sung mô tả chi tiết."}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#b9b4d7] mt-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${requestStatus.dotColor}`}></span>
                      <span>{requestStatus.label}</span>
                      <span>•</span>
                      <span>{req.createdAt ? formatDate(req.createdAt) : "Chưa có ngày"}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/profile/support/${req._id}`)}
                    className="h-[42px] px-5 rounded-xl bg-[#3783EC]/10 text-[#3783EC] font-medium text-[14px] hover:bg-[#3783EC] hover:text-white transition-all"
                  >
                    Chi tiết yêu cầu
                  </button>
                </div>
              );
            })}

            {!supportLoading && supportRequests.length === 0 && (
              <div className="bg-[#211b42] border border-dashed border-[#3d63ff]/20 rounded-2xl p-5 text-[14px] text-[#b9b4d7]">
                Chưa có yêu cầu hỗ trợ nào.
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
