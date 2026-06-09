import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, ShoppingCart, Search, Bell } from "lucide-react";
import { getStoredUserProfile } from "@/utils/profileStorage";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const isProfileSection = location.pathname.startsWith("/profile");
  const shouldShowUserAvatar = isLoggedIn || isProfileSection;
  const userAvatarUrl = getStoredUserProfile().avatarUrl;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/?search=${encodeURIComponent(query.trim())}`);
    setMobileOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* ── Main Row ── */}
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Logo & pageLabel */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow flex-shrink-0">
                <span className="text-white font-black text-base">W</span>
              </div>
              <span className="hidden sm:block text-gray-900 font-bold text-sm lg:text-base whitespace-nowrap">
                Hệ Thống Laptop &amp; Account
              </span>
              <span className="block sm:hidden text-gray-900 font-bold text-sm">
                WebACC
              </span>
            </Link>

            {pageLabel && (
              <>
                <div className="hidden sm:block w-[1.5px] h-6 bg-gray-300 mx-2"></div>
                <span className="hidden sm:block text-[15px] font-semibold text-gray-800">
                  {pageLabel}
                </span>
              </>
            )}
          </div>

          {/* Desktop Search Bar (Permanent & Center-aligned) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-[420px] mx-4 items-center"
          >
            <div className="w-full flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search className="w-4.5 h-4.5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm, tài khoản..."
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Notification Bell */}
            <Link
              to="/notification"
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Thông báo"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>

            {/* Shopping Cart (Mobile) */}
            <Link
              to="/cart"
              ref={mobileCartRef}
              className="relative md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Giỏ hàng"
            >
              <ShoppingCart className={`w-5 h-5 ${cartIconClassName}`} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border border-white leading-none">
                {cartCount}
              </span>
            </Link>

            {/* Shopping Cart (Desktop) */}
            <Link
              to="/cart"
              ref={desktopCartRef}
              className="hidden md:relative md:block p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Giỏ hàng"
            >
              <ShoppingCart className={`w-5 h-5 ${cartIconClassName}`} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border border-white leading-none">
                {cartCount}
              </span>
            </Link>

            {/* User Account State (Desktop) */}
            <div className="hidden md:flex items-center gap-2 ml-1">
              {shouldShowUserAvatar ? (
                <Link
                  to="/profile"
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all flex-shrink-0"
                >
                  <img
                    src={userAvatarUrl}
                    className="w-full h-full object-cover"
                    alt="Avatar"
                  />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-all shadow-sm"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Mở menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Dropdown ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 pb-4">
            {/* Search Input (Mobile) */}
            <form onSubmit={handleSearch} className="pt-3 px-1">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm, tài khoản..."
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                />
              </div>
            </form>

            {/* Quick Links */}
            <div className="pt-3 flex flex-col gap-0.5">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                Trang chủ
              </Link>
              <Link
                to="/best-seller"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                Sản phẩm bán chạy
              </Link>
              <Link
                to="/accounts"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                Tài khoản Account
              </Link>
              <Link
                to="/laptops"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                Laptop / PC
              </Link>
            </div>

            {/* Auth Buttons (Mobile) */}
            <div className="pt-3 mt-1 border-t border-gray-100 flex gap-2">
              {shouldShowUserAvatar ? (
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-gray-200"
                >
                  <User className="w-4 h-4" /> Cá nhân
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-center"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-center font-semibold"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
