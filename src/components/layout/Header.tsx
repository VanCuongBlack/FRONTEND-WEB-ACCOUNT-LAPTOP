import React from "react";

interface HeaderProps {
  pageLabel?: string;
  cartCount?: number;
  mobileCartRef?: React.Ref<HTMLAnchorElement>;
  desktopCartRef?: React.Ref<HTMLAnchorElement>;
  cartIconClassName?: string;
}

export default function Header({
  pageLabel,
  cartCount = 0,
  mobileCartRef,
  desktopCartRef,
  cartIconClassName = "",
}: HeaderProps) {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#3783EC] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>

              <span className="font-extrabold text-[24px] text-[#3783EC]">
                web_acc
              </span>
            </div>

            {pageLabel && (
              <>
                <div className="hidden sm:block w-[1.5px] h-6 bg-[#3783EC]/30"></div>
                <span className="hidden sm:block text-[20px] font-semibold text-black">
                  {pageLabel}
                </span>
              </>
            )}
          </a>

          <div className="flex lg:hidden items-center gap-4">
            <a href="/notification" className="relative cursor-pointer">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </a>

            <a href="/cart" ref={mobileCartRef} className="relative cursor-pointer">
              <svg
                className={`w-6 h-6 text-gray-700 ${cartIconClassName}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>

              <span className="absolute -top-2 -right-2 bg-[#EE4D2D] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </a>

            <a href="/profile" className="w-9 h-9 rounded-full overflow-hidden border">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            </a>
          </div>
        </div>

        <div className="hidden lg:flex w-full lg:w-[480px]">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full h-[42px] rounded-l border border-[#3783EC] border-r-0 px-4 focus:outline-none"
          />

          <button className="w-[55px] bg-[#3783EC] rounded-r flex items-center justify-center text-white">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <a
            href="/notification"
            className="relative cursor-pointer text-gray-700 hover:text-[#3783EC] transition-colors"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </a>

          <a
            href="/cart"
            ref={desktopCartRef}
            className="relative cursor-pointer text-gray-700 hover:text-[#3783EC] transition-colors"
          >
            <svg
              className={`w-7 h-7 ${cartIconClassName}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            <span className="absolute -top-2 -right-2 bg-[#EE4D2D] text-white text-[11px] font-bold px-1.5 min-w-[20px] h-[20px] rounded-full flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          </a>

          <a
            href="/profile"
            className="w-10 h-10 rounded-full overflow-hidden border hover:border-[#3783EC]"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
              className="w-full h-full object-cover"
              alt="Avatar"
            />
          </a>
        </div>
      </div>
    </header>
  );
}
