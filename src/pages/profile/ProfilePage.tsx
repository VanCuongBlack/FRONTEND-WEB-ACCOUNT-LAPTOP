
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function ProfilePage() {
  const supportRequests = [
    {
      id: 1,
      title: "Lỗi đăng nhập Account Netflix",
      date: "12/05/2026",
      status: "Đang xử lý",
    },
    {
      id: 2,
      title: "Không thể kích hoạt Microsoft 365",
      date: "10/05/2026",
      status: "Đã phản hồi",
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F5F5F5] text-black font-['Inter',_sans-serif]">
      <Header pageLabel="Hồ Sơ" cartCount={2} />

      {/* ================= BODY ================= */}
      <main className="w-full max-w-[1000px] mx-auto py-6 px-4 flex-1">
        {/* PROFILE */}
        <div className="bg-white rounded-2xl shadow-sm p-5 md:p-7 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#3783EC]/10 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-[24px] font-bold text-gray-900">
                Kim Ngân
              </h2>

              <p className="text-[14px] text-gray-500 mt-1">
                Thành viên từ 2026
              </p>

              <button className="mt-4 h-[40px] px-5 rounded-lg border border-[#3783EC] text-[#3783EC] hover:bg-[#3783EC] hover:text-white transition-all text-[14px] font-medium">
                Sửa hồ sơ
              </button>
              <div className="mt-4 flex flex-wrap gap-3">
              <button className="h-[40px] px-5 rounded-lg border border-[#3783EC] text-[#3783EC] hover:bg-[#3783EC] hover:text-white transition-all text-[14px] font-medium">
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

            <a
              href="#"
              className="text-[#3783EC] text-[14px] hover:underline"
            >
              Xem lịch sử mua hàng →
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                title: "Chờ xác nhận",
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
                title: "Đang giao hàng",
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
                title: "Đánh giá",
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
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl shadow-sm p-3 sm:p-6 flex flex-col items-center justify-center hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#3783EC]/10 flex items-center justify-center">
                  {item.icon}
                </div>

                <span className="mt-3 sm:mt-4 text-[13px] sm:text-[15px] text-center font-semibold text-gray-800 leading-tight">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* SUPPORT */}
        <section>
          <h3 className="text-[20px] font-bold text-gray-900 mb-4">
            Yêu cầu hỗ trợ
          </h3>

          <div className="flex flex-col gap-4">
            {supportRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-[15px] text-gray-800">
                    {req.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[13px] text-gray-500 mt-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>

                    <span>{req.status}</span>

                    <span>•</span>

                    <span>{req.date}</span>
                  </div>
                </div>

                <button className="h-[42px] px-5 rounded-xl bg-[#3783EC]/10 text-[#3783EC] font-medium text-[14px] hover:bg-[#3783EC] hover:text-white transition-all">
                  Chi tiết yêu cầu
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}