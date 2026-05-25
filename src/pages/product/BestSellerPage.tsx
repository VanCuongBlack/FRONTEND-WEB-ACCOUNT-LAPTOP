import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

interface Product {
  id: number;
  name: string;
  specs: string;
  brand: string;
  category: string;
  accountType?: string;
  duration?: string;
  price: number;
  image: string;
}

interface FlyingItem {
  key: number;
  image: string;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
}

const bestSellers: Product[] = [
  {
    id: 1,
    name: "Dell XPS 13",
    specs: "Core i7 • 16GB • 512GB SSD",
    brand: "Dell",
    category: "Laptop",
    price: 25990000,
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600",
  },
  {
    id: 2,
    name: "MacBook Air M2",
    specs: "Apple M2 • 8GB • 256GB",
    brand: "Apple",
    category: "Laptop",
    price: 27500000,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=600",
  },
  {
    id: 3,
    name: "Lenovo Legion 5",
    specs: "Ryzen 7 • RTX 4060 • 16GB",
    brand: "Lenovo",
    category: "Laptop",
    price: 31990000,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
  },
  {
    id: 4,
    name: "ASUS ROG Zephyrus",
    specs: "Core i9 • RTX 4070 • 32GB",
    brand: "ASUS",
    category: "Laptop",
    price: 45990000,
    image:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600",
  },

  // ACCOUNT
  {
    id: 5,
    name: "Netflix Premium",
    specs: "4K • 4 Thiết bị • 1 Năm",
    brand: "Netflix",
    category: "Account",
    accountType: "Premium",
    duration: "1 Năm",
    price: 199000,
    image:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600",
  },
  {
    id: 6,
    name: "Spotify Premium",
    specs: "Không quảng cáo • Nghe Offline",
    brand: "Spotify",
    category: "Account",
    accountType: "Shared",
    duration: "1 Tháng",
    price: 59000,
    image:
      "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600",
  },
  {
    id: 7,
    name: "Microsoft 365",
    specs: "5TB Cloud • Full App",
    brand: "Microsoft",
    category: "Account",
    accountType: "Family",
    duration: "1 Năm",
    price: 499000,
    image:
      "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=600",
  },
  {
    id: 8,
    name: "Adobe Creative Cloud",
    specs: "Photoshop • Premiere • AI",
    brand: "Adobe",
    category: "Account",
    accountType: "Premium",
    duration: "6 Tháng",
    price: 899000,
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600",
  },
];

export default function BestSellerPage() {
  const [cartCount, setCartCount] = useState(2);
  const [addedProductIds, setAddedProductIds] = useState<number[]>([]);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [isCartBumping, setIsCartBumping] = useState(false);

  const productImageRefs = useRef<Record<number, HTMLImageElement | null>>({});
  const desktopCartRef = useRef<HTMLAnchorElement | null>(null);
  const mobileCartRef = useRef<HTMLAnchorElement | null>(null);
  const timeoutIdsRef = useRef<number[]>([]);

  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAccountTypes, setSelectedAccountTypes] = useState<string[]>(
    []
  );
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((id) => {
        window.clearTimeout(id);
      });
    };
  }, []);

  const toggleValue = (
    value: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const filteredProducts = useMemo(() => {
    return bestSellers.filter((product) => {
      // PRICE
      const matchPrice =
        selectedPrices.length === 0 ||
        selectedPrices.some((price) => {
          if (price === "under500" && product.price < 500000) return true;
          if (
            price === "500to2m" &&
            product.price >= 500000 &&
            product.price <= 2000000
          )
            return true;
          if (
            price === "2to10m" &&
            product.price >= 2000000 &&
            product.price <= 10000000
          )
            return true;
          if (price === "10mplus" && product.price > 10000000) return true;

          return false;
        });

      // BRAND
      const matchBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(product.brand);

      // ACCOUNT TYPE
      const matchAccountType =
        selectedAccountTypes.length === 0 ||
        selectedAccountTypes.includes(product.accountType || "");

      // DURATION
      const matchDuration =
        selectedDurations.length === 0 ||
        selectedDurations.includes(product.duration || "");

      return (
        matchPrice &&
        matchBrand &&
        matchAccountType &&
        matchDuration
      );
    });
  }, [
    selectedPrices,
    selectedBrands,
    selectedAccountTypes,
    selectedDurations,
  ]);

  const getVisibleCartElement = () => {
    const cartElements = [
      desktopCartRef.current,
      mobileCartRef.current,
    ];

    return cartElements.find((element) => {
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
  };

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: Product
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const isNewProduct = !addedProductIds.includes(item.id);

    const imageElement = productImageRefs.current[item.id];
    const cartElement = getVisibleCartElement();

    if (imageElement && cartElement) {
      const imageRect = imageElement.getBoundingClientRect();
      const cartRect = cartElement.getBoundingClientRect();
      const startX = imageRect.left + imageRect.width / 2;
      const startY = imageRect.top + imageRect.height / 2;
      const endX = cartRect.left + cartRect.width / 2;
      const endY = cartRect.top + cartRect.height / 2;
      const flyKey = Date.now() + item.id;

      setFlyingItems((prev) => [
        ...prev,
        {
          key: flyKey,
          image: item.image,
          startX,
          startY,
          deltaX: endX - startX,
          deltaY: endY - startY,
        },
      ]);

      const removeTimeoutId = window.setTimeout(() => {
        setFlyingItems((prev) =>
          prev.filter((flyItem) => flyItem.key !== flyKey)
        );
      }, 780);

      timeoutIdsRef.current.push(removeTimeoutId);
    }

    setIsCartBumping(true);
    const bumpTimeoutId = window.setTimeout(() => {
      setIsCartBumping(false);
    }, 240);
    timeoutIdsRef.current.push(bumpTimeoutId);

    if (isNewProduct) {
      setAddedProductIds((prev) => [...prev, item.id]);
      setCartCount((prev) => prev + 1);
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")}đ`;
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F5F5F5] font-['Inter',sans-serif] text-black">
      <style>
        {`
          @keyframes flyToCart {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
              opacity: 1;
            }
            85% {
              opacity: 1;
            }
            100% {
              transform: translate3d(var(--delta-x), var(--delta-y), 0) scale(0.25);
              opacity: 0;
            }
          }

          @keyframes cartBump {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.14);
            }
          }

          .fly-item {
            position: fixed;
            width: 56px;
            height: 56px;
            border-radius: 12px;
            pointer-events: none;
            object-fit: cover;
            box-shadow: 0 10px 24px rgba(55, 131, 236, 0.35);
            z-index: 70;
            animation: flyToCart 780ms cubic-bezier(0.18, 0.75, 0.25, 1) forwards;
          }

          .cart-bump {
            animation: cartBump 240ms ease;
          }
        `}
      </style>

      <div className="pointer-events-none fixed inset-0 z-[70]">
        {flyingItems.map((flyItem) => (
          <img
            key={flyItem.key}
            src={flyItem.image}
            alt=""
            className="fly-item"
            style={
              {
                left: `${flyItem.startX - 28}px`,
                top: `${flyItem.startY - 28}px`,
                "--delta-x": `${flyItem.deltaX}px`,
                "--delta-y": `${flyItem.deltaY}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <Header
        cartCount={cartCount}
        mobileCartRef={mobileCartRef}
        desktopCartRef={desktopCartRef}
        cartIconClassName={isCartBumping ? "cart-bump" : ""}
      />
      <div className="w-full max-w-[1200px] mx-auto px-4 pt-4 flex justify-end">
        <button
          onClick={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");

            alert("Đăng xuất thành công");

            window.location.href = "/login";
          }}
          className="h-[42px] rounded-xl border border-red-500 px-5 text-sm font-semibold text-red-500 transition-all hover:bg-red-500 hover:text-white"
        >
          Đăng xuất
        </button>
      </div>

      {/* BODY */}
      <main className="w-full max-w-[1200px] mx-auto px-4 py-6 flex-1">

        <h1 className="text-3xl font-bold mb-2">
          Sản phẩm bán chạy
        </h1>

        <p className="text-gray-500 mb-8">
          Top những sản phẩm được mua nhiều nhất trong thang qua. Cập nhật liên tục để bạn không bỏ lỡ cơ hội sở hữu những món hời!
        </p>

        <div className="flex gap-6">

          {/* FILTER */}
          <aside className="hidden lg:block w-[280px] bg-white p-5 rounded-2xl shadow-sm h-fit">

            <h2 className="font-bold text-lg mb-5">
              Bộ lọc sản phẩm
            </h2>

            <div className="space-y-6">

              {/* PRICE */}
              <div>
                <p className="font-semibold mb-3">
                  Khoảng giá
                </p>

                <div className="space-y-2 text-[14px]">

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes("under500")}
                      onChange={() =>
                        toggleValue(
                          "under500",
                          selectedPrices,
                          setSelectedPrices
                        )
                      }
                    />
                    Dưới 500K
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes("500to2m")}
                      onChange={() =>
                        toggleValue(
                          "500to2m",
                          selectedPrices,
                          setSelectedPrices
                        )
                      }
                    />
                    500K - 2 Triệu
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes("2to10m")}
                      onChange={() =>
                        toggleValue(
                          "2to10m",
                          selectedPrices,
                          setSelectedPrices
                        )
                      }
                    />
                    2 Triệu - 10 Triệu
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes("10mplus")}
                      onChange={() =>
                        toggleValue(
                          "10mplus",
                          selectedPrices,
                          setSelectedPrices
                        )
                      }
                    />
                    10 Triệu trở lên
                  </label>
                </div>
              </div>

              {/* BRAND */}
              <div>
                <p className="font-semibold mb-3">
                  Thương hiệu
                </p>

                <div className="space-y-2 text-[14px]">
                  {[
                    "Dell",
                    "Apple",
                    "Lenovo",
                    "ASUS",
                    "Netflix",
                    "Spotify",
                    "Microsoft",
                    "Adobe",
                  ].map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() =>
                          toggleValue(
                            brand,
                            selectedBrands,
                            setSelectedBrands
                          )
                        }
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>

              {/* ACCOUNT */}
              <div>
                <p className="font-semibold mb-3">
                  Loại account
                </p>

                <div className="space-y-2 text-[14px]">
                  {["Premium", "Shared", "Family"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAccountTypes.includes(type)}
                        onChange={() =>
                          toggleValue(
                            type,
                            selectedAccountTypes,
                            setSelectedAccountTypes
                          )
                        }
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* DURATION */}
              <div>
                <p className="font-semibold mb-3">
                  Thời hạn sử dụng
                </p>

                <div className="space-y-2 text-[14px]">
                  {["1 Tháng", "6 Tháng", "1 Năm"].map((time) => (
                    <label
                      key={time}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDurations.includes(time)}
                        onChange={() =>
                          toggleValue(
                            time,
                            selectedDurations,
                            setSelectedDurations
                          )
                        }
                      />
                      {time}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCTS */}
          <section className="flex-1">

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">

              {filteredProducts.map((item) => (
                <a
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden group"
                >
                  <div className="overflow-hidden">
                    <img
                      ref={(element) => {
                        productImageRefs.current[item.id] = element;
                      }}
                      src={item.image}
                      alt={item.name}
                      className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4">

                    <h3 className="font-bold text-[15px] line-clamp-2 min-h-[44px]">
                      {item.name}
                    </h3>

                    <p className="text-[12px] text-gray-500 mt-2 line-clamp-2 min-h-[36px]">
                      {item.specs}
                    </p>

                    <div className="flex items-center justify-between mt-4">

                      <span className="text-[#27AE60] font-bold text-[16px]">
                        {formatPrice(item.price)}
                      </span>

                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        className="w-10 h-10 rounded-xl bg-[#3783EC] text-white flex items-center justify-center hover:bg-[#206ed6] transition-colors"
                        aria-label={`Thêm ${item.name} vào giỏ hàng`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3h2l.4 2M7 13h9l3-6H6.4M7 13L5.4 5M7 13l-1.5 1.5a1 1 0 00.7 1.7H17m-8 2a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={(e) => e.preventDefault()}
                      className="w-full mt-4 h-[42px] rounded-xl bg-[#3783EC] text-white font-semibold hover:bg-[#206ed6] transition-colors"
                    >
                      Mua ngay
                    </button>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}