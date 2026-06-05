import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Dùng để chuyển hướng mượt mà sang trang Profile
import { ChevronLeft, Search, Laptop, Key, Eye, X, ExternalLink } from 'lucide-react';
import { getStoredUserProfile } from '@/utils/profileStorage';

interface Order {
  id: string;
  type: 'account' | 'laptop';
  productName: string;
  image: string;
  totalPrice: number;
  status: 'completed' | 'processing';
  purchaseDate: string;
  details: {
    specificationDetail: string; 
    warrantyPeriod: string;
    accountCredentials?: {       
      email: string;
      pass: string;
      slotInfo?: string;
    };
    laptopHardware?: {           
      serialNumber: string;
      condition: string;
    };
  };
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const profile = getStoredUserProfile();
  const [orders] = useState<Order[]>([
    {
      id: "ACC-20260513",
      type: "laptop",
      productName: "Laptop Dell XPS 13 9310 (Cũ 99%)",
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300", 
      totalPrice: 12000000,
      status: "completed",
      purchaseDate: "28/05/2026",
      details: {
        specificationDetail: "Cấu hình: Intel Core i7 / RAM 16GB / SSD 512GB",
        warrantyPeriod: "06 Tháng phần cứng tại cửa hàng",
        laptopHardware: {
          serialNumber: "DELL-XPS-9310-XYZ123",
          condition: "Nguyên bản 100%, sạc zin đi kèm"
        }
      }
    },
    {
      id: "ACC-20260514",
      type: "account",
      productName: "Tài khoản Canva Pro",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300",
      totalPrice: 200000,
      status: "completed",
      purchaseDate: "01/06/2026",
      details: {
        specificationDetail: "Loại tài khoản: Gói Premium gia hạn chính chủ 1 Năm",
        warrantyPeriod: "365 Ngày (Lỗi 1 đổi 1 tự động)",
        accountCredentials: {
          email: "canvapro_khachhang@gmail.com",
          pass: "CanvaDoiMoi2026",
          slotInfo: "Gia nhập Đội nhóm thành viên số 04"
        }
      }
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredOrders = orders.filter((order) => {
    if (!normalizedQuery) {
      return true;
    }

    return (
      order.productName.toLowerCase().includes(normalizedQuery) ||
      order.id.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    // TOÀN BỘ KHUNG NỀN: Tự động co giãn Padding tùy theo kích thước màn hình (px-4 trên điện thoại, px-6 trên máy tính)
    <div className="w-full min-h-screen bg-[#F8F9FA] py-6 md:py-12 px-4 md:px-6 font-sans antialiased text-slate-800">
      <div className="max-w-[1000px] mx-auto bg-white rounded-2xl md:rounded-3xl p-5 md:p-10 shadow-sm border border-slate-100">
        
        {/* HEADER TRANG */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              to="/profile"
              className="p-1.5 md:p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-700"
              aria-label="Quay lại trang cá nhân"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
            </Link>
            {/* Tiêu đề linh hoạt: Kích thước text-2xl trên Mobile và text-[36px] trên Web */}
            <h1 className="text-2xl md:text-[36px] font-bold tracking-tight text-slate-900 leading-tight">
              Lịch sử đơn hàng
            </h1>
          </div>

          {/* SỬA ĐỔI: Thay chữ U thành nút Profile chuyển hướng thực tế */}
          <Link 
            to="/profile" 
            className="block rounded-full overflow-hidden border-2 border-slate-200 hover:border-[#3786EC] transition-all shadow-xs"
            aria-label="Về trang cá nhân"
          >
            <img
              src={profile.avatarUrl}
              alt="Avatar"
              className="w-11 h-11 object-cover"
            />
          </Link>
        </div>

        {/* THANH TÌM KIẾM BO TRÒN: Chiều rộng w-full trên mobile, tự giới hạn max-w-md trên máy tính */}
        <div className="w-full md:max-w-md bg-[#EEF0F2] rounded-full px-5 py-2.5 flex items-center gap-3 mb-6 md:mb-10 border border-transparent focus-within:border-slate-300 focus-within:bg-white transition-all">
          <Search className="text-slate-400 shrink-0" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm đơn hàng, tên sản phẩm..." 
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* DANH SÁCH THẺ ĐƠN HÀNG LỚN (Cách đều dọc 24px) */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div 
              key={order.id}
              className="w-full bg-white rounded-2xl md:rounded-[32px] border border-slate-200 p-5 md:p-8 flex flex-col gap-5 relative shadow-sm hover:border-slate-300 transition-all"
            >
              {/* Dòng thông tin trạng thái đỉnh thẻ */}
              <div className="flex justify-between items-center w-full pb-3 border-b border-slate-100 md:border-none md:pb-0">
                <span className="text-xs md:text-sm font-medium text-slate-800 font-mono">
                  Mã đơn: #{order.id}
                </span>
                <span className={`text-[11px] md:text-xs font-semibold px-2.5 py-1 rounded-full ${
                  order.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {order.status === 'completed' ? 'Thành công' : 'Đang xử lý'}
                </span>
              </div>

              {/* Khối thân nội dung: Chuyển hàng dọc trên mobile (flex-col), hàng ngang trên web (md:flex-row) */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full">
                
                {/* Ảnh sản phẩm co giãn tỷ lệ */}
                <div className="w-full md:w-[180px] h-40 md:h-[120px] rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                  <img src={order.image} alt={order.productName} className="w-full h-full object-cover" />
                </div>

                {/* Khối chữ */}
                <div className="flex-1 space-y-2 w-full">
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-900 flex items-center gap-2">
                    {order.type === 'laptop' ? <Laptop size={20} className="text-blue-500 shrink-0" /> : <Key size={20} className="text-emerald-500 shrink-0" />}
                    {order.productName}
                  </h3>
                  
                  <p className={`text-xs md:text-sm font-medium px-3 py-1 rounded-lg w-fit ${
                    order.type === 'laptop' ? 'text-blue-600 bg-blue-50/70' : 'text-emerald-600 bg-emerald-50/70'
                  }`}>
                    {order.details.specificationDetail}
                  </p>
                </div>

                {/* Khối giá tiền */}
                <div className="text-left md:text-right flex-shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t border-slate-100 md:border-none">
                  <span className="text-xs text-slate-400 md:block">Tổng tiền:</span>
                  <p className="text-xl md:text-2xl font-bold text-[#3786EC] inline-block md:block ml-1 md:ml-0">
                    {order.totalPrice.toLocaleString('vi-VN')} đ
                  </p>
                  <span className="text-xs text-slate-400 block mt-0.5">Ngày mua: {order.purchaseDate}</span>
                </div>
              </div>

              {/* KHU VỰC NÚT BẤM TƯƠNG TÁC (Tự kéo dài 100% trên điện thoại để dễ ngón tay chạm bấm) */}
              <div className="w-full flex justify-center pt-2">
                <button 
                  onClick={() => {
                    if (order.type === 'laptop') {
                      navigate(`/profile/history/laptop/${order.id}`);
                      return;
                    }

                    navigate(`/profile/history/account/${order.id}`);
                  }}
                  className="h-[52px] w-full md:max-w-[400px] text-sm font-semibold rounded-[20px] bg-[#E0E2E5] text-slate-800 hover:bg-[#3786EC] hover:text-white active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Eye size={16} />
                  Xem chi tiết đơn hàng
                </button>
              </div>

            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              Không tìm thấy đơn hàng phù hợp với tên sản phẩm hoặc mã đơn.
            </div>
          )}
        </div>

      </div>

      {/* COMPONENT MODAL CHI TIẾT (Tương thích kích thước màn hình nhỏ) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end md:items-center justify-center z-50 p-0 md:p-4 animate-fade-in">
          <div className="bg-white rounded-t-2xl md:rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-none">
            
            {/* Header Pop-up */}
            <div className="p-5 md:p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-base md:text-lg font-bold text-slate-900">Thông tin bàn giao sản phẩm</h2>
                <p className="text-xs text-slate-400 mt-0.5">Mã đơn: #{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-xs transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Thân nội dung Pop-up (Cho phép cuộn trên màn hình điện thoại thấp) */}
            <div className="p-5 md:p-6 space-y-5 overflow-y-auto flex-1">
              
              {selectedOrder.type === 'account' && selectedOrder.details.accountCredentials && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Thông tin đăng nhập</h4>
                  <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3 font-mono text-xs md:text-sm overflow-x-auto">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1 border-b border-indigo-50 gap-1">
                      <span className="text-slate-500 font-sans">Tài khoản (Email):</span>
                      <span className="font-semibold text-slate-900 break-all select-all">{selectedOrder.details.accountCredentials.email}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1 border-b border-indigo-50 gap-1">
                      <span className="text-slate-500 font-sans">Mật khẩu (Password):</span>
                      <span className="font-semibold text-rose-600 break-all select-all">{selectedOrder.details.accountCredentials.pass}</span>
                    </div>
                    {selectedOrder.details.accountCredentials.slotInfo && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-500 font-sans">Vị trí Profile:</span>
                        <span className="font-semibold text-indigo-600 font-sans bg-indigo-100 px-2 py-0.5 rounded text-xs">{selectedOrder.details.accountCredentials.slotInfo}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedOrder.type === 'laptop' && selectedOrder.details.laptopHardware && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Thông tin thiết bị</h4>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs md:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Mã Số Serial:</span>
                      <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 select-all">{selectedOrder.details.laptopHardware.serialNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Tình trạng máy:</span>
                      <span className="font-medium text-slate-800 text-right">{selectedOrder.details.laptopHardware.condition}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Thời hạn bảo hành</h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs md:text-sm flex justify-between items-center">
                  <span className="text-slate-500">Chính sách áp dụng:</span>
                  <span className="font-semibold text-slate-900 text-right">{selectedOrder.details.warrantyPeriod}</span>
                </div>
              </div>

            </div>

            {/* Footer Pop-up */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors flex-1 md:flex-none"
              >
                Đóng
              </button>
              {selectedOrder.type === 'account' && (
                <button className="px-4 py-2.5 text-sm font-medium text-white bg-[#3786EC] rounded-xl hover:bg-[#3786EC]/90 transition-all flex items-center justify-center gap-1.5 shadow-sm flex-1 md:flex-none">
                  Truy cập <ExternalLink size={14} />
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}