import { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

interface CartItem {
  id: string;
  name: string;
  description: string;
  originalPrice?: number;
  price: number;
  discountLabel?: string;
  quantity: number;
  image: string;
  checked: boolean;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Dell XPS 13",
      description: "Core i7, 16GB RAM, 512GB SSD",
      originalPrice: 28000000,
      price: 25000000,
      discountLabel: "-10%",
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200",
      checked: true,
    },
    {
      id: "2",
      name: "Microsoft 365 Premium",
      description: "Account bản quyền chính chủ 1 năm",
      price: 1500000,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=200",
      checked: true,
    },
    {
      id: "3",
      name: "Adobe Creative Cloud",
      description: "Full App Premium • 1 năm",
      originalPrice: 2000000,
      price: 1500000,
      discountLabel: "-25%",
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=200",
      checked: false,
    },
  ]);

  const handleToggleCheckbox = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  };

  const handleSelectAll = () => {
    const allChecked = cartItems.every(
      (item) => item.checked
    );

    setCartItems((prev) =>
      prev.map((item) => ({
        ...item,
        checked: !allChecked,
      }))
    );
  };

  const updateQuantity = (
    id: string,
    delta: number
  ) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + delta,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleDeleteItem = (id: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => {
      return item.checked
        ? sum + item.price * item.quantity
        : sum;
    },
    0
  );

  const selectedCount = cartItems.filter(
    (item) => item.checked
  ).length;

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F5F5F5]">
      <Header pageLabel="Giỏ Hàng" cartCount={cartItems.length} />

      {/* ================= BODY ================= */}
      <main className="w-full max-w-[1200px] mx-auto py-6 px-4 flex-1">
        {/* DESKTOP TABLE */}
        <div className="hidden md:flex bg-white rounded-xl shadow-sm flex-col overflow-hidden">
          {/* HEADER */}
          <div className="flex items-center py-4 px-4 border-b font-medium text-[14px] text-gray-500">
            <div className="flex-1 pl-[50px]">
              Sản Phẩm
            </div>

            <div className="w-[140px] text-center">
              Đơn Giá
            </div>

            <div className="w-[130px] text-center">
              Số Lượng
            </div>

            <div className="w-[130px] text-center">
              Số Tiền
            </div>

            <div className="w-[80px] text-center">
              Thao Tác
            </div>
          </div>

          {/* ITEMS */}
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center py-5 px-4 border-b hover:bg-gray-50 transition-colors"
            >
              <div className="w-[50px] flex justify-center">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() =>
                    handleToggleCheckbox(item.id)
                  }
                  className="accent-[#3783EC] w-4 h-4"
                />
              </div>

              <div className="flex-1 flex gap-4 items-center">
                <img
                  src={item.image}
                  alt=""
                  className="w-[80px] h-[80px] object-cover rounded-lg border"
                />

                <div>
                  <h3 className="text-[15px] font-semibold text-gray-800">
                    {item.name}
                  </h3>

                  <p className="text-[13px] text-gray-500 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="w-[140px] text-center">
                {item.originalPrice && (
                  <p className="line-through text-gray-400 text-[12px]">
                    {item.originalPrice.toLocaleString()}đ
                  </p>
                )}

                <div className="font-semibold text-gray-800">
                  {item.price.toLocaleString()}đ

                  {item.discountLabel && (
                    <span className="text-red-500 text-[11px] ml-1">
                      {item.discountLabel}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-[130px] flex justify-center">
                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, -1)
                    }
                    className="w-8 h-8 hover:bg-gray-100"
                  >
                    −
                  </button>

                  <input
                    type="text"
                    value={item.quantity}
                    readOnly
                    className="w-10 text-center border-x text-[14px]"
                  />

                  <button
                    onClick={() =>
                      updateQuantity(item.id, 1)
                    }
                    className="w-8 h-8 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="w-[130px] text-center font-bold text-[#3783EC]">
                {(
                  item.price * item.quantity
                ).toLocaleString()}
                đ
              </div>

              <div className="w-[80px] text-center">
                <button
                  onClick={() =>
                    handleDeleteItem(item.id)
                  }
                  className="text-red-500 hover:underline"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MOBILE */}
        <div className="flex flex-col gap-4 md:hidden">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm p-4"
            >
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() =>
                    handleToggleCheckbox(item.id)
                  }
                  className="accent-[#3783EC] w-4 h-4 mt-1"
                />

                <img
                  src={item.image}
                  alt=""
                  className="w-[90px] h-[90px] rounded-lg object-cover border"
                />

                <div className="flex-1">
                  <h3 className="text-[14px] font-semibold line-clamp-2">
                    {item.name}
                  </h3>

                  <p className="text-[12px] text-gray-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-2">
                    {item.originalPrice && (
                      <p className="line-through text-gray-400 text-[11px]">
                        {item.originalPrice.toLocaleString()}đ
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#3783EC]">
                        {item.price.toLocaleString()}đ
                      </span>

                      {item.discountLabel && (
                        <span className="text-red-500 text-[10px] font-bold">
                          {item.discountLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex border rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, -1)
                        }
                        className="w-8 h-8"
                      >
                        −
                      </button>

                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-10 text-center border-x text-[14px]"
                      />

                      <button
                        onClick={() =>
                          updateQuantity(item.id, 1)
                        }
                        className="w-8 h-8"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        handleDeleteItem(item.id)
                      }
                      className="text-red-500 text-[13px]"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAYMENT */}
        <div className="bg-white rounded-2xl shadow-sm mt-6 p-4 md:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                cartItems.length > 0 &&
                cartItems.every(
                  (item) => item.checked
                )
              }
              onChange={handleSelectAll}
              className="accent-[#3783EC] w-4 h-4"
            />

            <span className="text-[15px]">
              Chọn tất cả ({cartItems.length})
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex items-center gap-3">
              <span className="text-gray-600">
                Tổng ({selectedCount}):
              </span>

              <span className="text-[28px] font-bold text-[#3783EC]">
                {totalAmount.toLocaleString()}đ
              </span>
            </div>

            <button className="w-full sm:w-auto h-[46px] px-10 bg-[#3783EC] text-white font-bold rounded-xl hover:bg-[#206ed6] transition-colors">
              MUA HÀNG
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}