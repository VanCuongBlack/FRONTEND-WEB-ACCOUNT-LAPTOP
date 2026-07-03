import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface HeaderProps {
  pageLabel?: string
  cartCount?: number
  mobileCartRef?: React.Ref<HTMLAnchorElement>
  desktopCartRef?: React.Ref<HTMLAnchorElement>
  cartIconClassName?: string
}

export default function Header({
  pageLabel,
  cartCount = 0,
  mobileCartRef,
  desktopCartRef,
  cartIconClassName = '',
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const isLoggedIn = Boolean(user && accessToken)
  const userInitial = (user?.fullname || user?.email || 'U').charAt(0).toUpperCase()

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    navigate(`/laptops?search=${encodeURIComponent(value)}`)
    setMobileOpen(false)
  }

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09051f] text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="hidden border-b border-white/10 bg-[#0d0828] md:block">
        <div className="mx-auto flex h-11 max-w-[1840px] items-center justify-between px-4 text-sm text-[#b9b4d7] sm:px-6">
          <nav className="flex items-center gap-7">
            <Link to="/best-seller" className="hover:text-white">
              Tin PC
            </Link>
            <Link to="/warranty-policy" className="hover:text-white">
              Bảo hành
            </Link>
            <Link to="/purchase-guide" className="hover:text-white">
              Hướng dẫn mua hàng
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-black text-yellow-300">
              VN
            </span>
            <span>Tiếng Việt</span>
            <span className="h-5 w-10 rounded-full bg-white/20 p-0.5">
              <span className="block h-4 w-4 rounded-full bg-white" />
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1840px] px-4 sm:px-6">
        <div className="flex h-[76px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-7">
            <Link to="/" className="flex shrink-0 items-baseline gap-1">
              <span className="text-3xl font-black tracking-tight text-white">PCAcc</span>
              <span className="text-sm font-black text-white">.com</span>
            </Link>

            <nav className="hidden items-center gap-7 text-base font-bold text-[#c8c1e8] md:flex">
              <Link to="/laptops" className="inline-flex items-center gap-1 hover:text-white">
                PC/Laptop <ChevronDown className="h-4 w-4" />
              </Link>
              <Link to="/accounts" className="hover:text-white">
                Account
              </Link>
              <Link to="/best-seller" className="hover:text-white">
                Bán chạy
              </Link>
              {pageLabel && <span className="text-sm text-white/60">{pageLabel}</span>}
            </nav>
          </div>

          <form onSubmit={handleSearch} className="hidden flex-1 justify-end md:flex">
            <div className="flex h-[54px] w-full max-w-[395px] items-center gap-3 rounded-[22px] bg-[#37335f] px-5 text-[#c3bddb] ring-1 ring-white/5 focus-within:ring-[#6aa8ff]">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm PC, laptop, account..."
                className="min-w-0 flex-1 bg-transparent text-base font-semibold text-white placeholder:text-[#9b95b8] focus:outline-none"
              />
              {query ? (
                <button type="button" onClick={() => setQuery('')} className="text-[#c3bddb] hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              ) : (
                <Search className="h-6 w-6 text-[#c3bddb]" />
              )}
            </div>
          </form>

          <div className="flex shrink-0 items-center gap-2 md:gap-4">
            <Link
              to={isLoggedIn ? '/notification' : '/login'}
              className="hidden rounded-xl p-2 text-[#c8c1e8] transition-colors hover:bg-white/10 hover:text-white md:block"
              title="Thông báo"
            >
              <Bell className="h-5 w-5" />
            </Link>

            <Link
              to="/cart"
              ref={desktopCartRef}
              className="relative hidden rounded-xl p-2 text-white transition-colors hover:bg-white/10 md:block"
              title="Giỏ hàng"
            >
              <ShoppingBag className={`h-7 w-7 ${cartIconClassName}`} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  to="/profile"
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-[#3d63ff] text-sm font-black text-white"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    userInitial
                  )}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-sm font-black text-[#d9d4f2] transition-colors hover:bg-white/15 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-1 text-base font-black text-[#d9d4f2] md:flex">
                <Link to="/login" className="hover:text-white">
                  Đăng nhập
                </Link>
                <span>/</span>
                <Link to="/register" className="hover:text-white">
                  Đăng ký
                </Link>
              </div>
            )}

            <Link
              to="/cart"
              ref={mobileCartRef}
              className="relative rounded-xl p-2 text-white md:hidden"
              title="Giỏ hàng"
            >
              <ShoppingCart className={`h-5 w-5 ${cartIconClassName}`} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="rounded-xl p-2 text-white hover:bg-white/10 md:hidden"
              aria-label="Mở menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 pb-4 md:hidden">
            <form onSubmit={handleSearch} className="py-3">
              <div className="flex h-12 items-center gap-3 rounded-2xl bg-[#37335f] px-4">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm PC, laptop, account..."
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white placeholder:text-[#9b95b8] focus:outline-none"
                />
                <Search className="h-5 w-5 text-[#c3bddb]" />
              </div>
            </form>

            <div className="grid gap-2 text-sm font-bold text-[#c8c1e8]">
              <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2 hover:bg-white/10">
                Trang chủ
              </Link>
              <Link to="/laptops" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2 hover:bg-white/10">
                PC / Laptop
              </Link>
              <Link to="/accounts" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2 hover:bg-white/10">
                Account
              </Link>
              {isLoggedIn ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2 hover:bg-white/10">
                    <span className="inline-flex items-center gap-2">
                      <User className="h-4 w-4" /> Tài khoản
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl px-3 py-2 text-left hover:bg-white/10"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LogOut className="h-4 w-4" /> Đăng xuất
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2 hover:bg-white/10">
                    Đăng nhập
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2 hover:bg-white/10">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
