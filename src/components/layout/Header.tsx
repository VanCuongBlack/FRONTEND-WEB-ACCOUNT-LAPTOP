import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Bell,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getUnreadNotificationCount } from '@/services/notification.service'

interface HeaderProps {
  pageLabel?: string
  cartCount?: number
  mobileCartRef?: React.Ref<HTMLAnchorElement>
  desktopCartRef?: React.Ref<HTMLAnchorElement>
  cartIconClassName?: string
}

export default function Header({
  cartCount = 0,
  mobileCartRef,
  desktopCartRef,
  cartIconClassName = '',
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const logout = useAuthStore((state) => state.logout)
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const isLoggedIn = Boolean(user && accessToken)
  const userInitial = (user?.fullname || user?.email || 'U').charAt(0).toUpperCase()

  useEffect(() => {
    setQuery(searchParams.get('search') ?? '')
  }, [searchParams])

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadNotifications(0)
      return
    }

    getUnreadNotificationCount()
      .then((res) => setUnreadNotifications(res.data?.data?.unread_count ?? 0))
      .catch(() => setUnreadNotifications(0))
  }, [isLoggedIn])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    const trimmed = value.trim()
    const isHome = window.location.pathname === '/'

    if (trimmed) {
      navigate(`/?search=${encodeURIComponent(trimmed)}`, { replace: isHome })
    } else {
      navigate('/', { replace: isHome })
    }
  }

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    setMobileOpen(false)
  }

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#09051f]/90 backdrop-blur-md text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-6">
        <div className="flex h-[70px] items-center justify-between gap-4">
          
          {/* Logo and Search bar on the left */}
          <div className="flex flex-1 items-center gap-6">
            <Link to="/" className="flex shrink-0 items-baseline gap-0.5 group">
              <span className="text-2xl font-black tracking-tight text-white transition-transform duration-200">PCAcc</span>
              <span className="text-sm font-black text-[#00d6ff]">.com</span>
            </Link>

            <form onSubmit={handleSearch} className="hidden flex-1 max-w-[420px] md:flex">
              <div className="flex h-[42px] w-full items-center gap-2.5 rounded-full bg-white/5 border border-white/10 px-4 text-[#c3bddb] focus-within:border-[#00d6ff]/40 focus-within:bg-white/10 transition-all duration-300">
                <Search className="h-4.5 w-4.5 text-white/40" />
                <input
                  value={query}
                  onChange={(event) => handleQueryChange(event.target.value)}
                  placeholder="Tìm kiếm Laptop, PC, Netflix, Adobe..."
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white placeholder:text-white/30 focus:outline-none"
                />
                {query && (
                  <button type="button" onClick={() => handleQueryChange('')} className="text-[#c3bddb] hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right side items (nav links, cart, auth) */}
          <div className="flex shrink-0 items-center gap-2 md:gap-4">
            <nav className="hidden items-center gap-6 text-sm font-bold text-[#c8c1e8] md:flex mr-2">
              <Link to="/laptops" className="hover:text-white transition-colors">
                PC/Laptop
              </Link>
              <Link to="/accounts" className="hover:text-white transition-colors">
                Account
              </Link>
              <Link to="/best-seller" className="hover:text-white transition-colors">
                Bán chạy
              </Link>
            </nav>

            <Link
              to={isLoggedIn ? '/notification' : '/login'}
              className="relative hidden rounded-xl p-2 text-[#c8c1e8] transition-colors hover:bg-white/10 hover:text-white md:block"
              title="Thông báo"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              ref={desktopCartRef}
              className="relative rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              title="Giỏ hàng"
            >
              <ShoppingCart className={`h-5 w-5 ${cartIconClassName}`} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#00d6ff] text-[9px] font-black text-[#040214] shadow-[0_0_8px_rgba(0,214,255,0.4)]">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  to="/profile"
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-[#3d63ff] text-xs font-black text-white"
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
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/10 px-3 text-xs font-black text-[#d9d4f2] transition-colors hover:bg-white/15 hover:text-white"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="hidden items-center md:flex">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-black text-[#09051f] hover:bg-gray-100 transition-colors active:scale-95 shadow-lg"
                >
                  Đăng nhập
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
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#00d6ff] px-1 text-[10px] font-black text-[#040214]">
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
                  onChange={(event) => handleQueryChange(event.target.value)}
                  placeholder="Tìm PC, laptop, account..."
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white placeholder:text-[#9b95b8] focus:outline-none"
                />
                {query ? (
                  <button type="button" onClick={() => handleQueryChange('')} className="text-[#c3bddb] hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <Search className="h-5 w-5 text-[#c3bddb]" />
                )}
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
                  <Link to="/notification" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2 hover:bg-white/10">
                    <span className="inline-flex items-center gap-2">
                      <Bell className="h-4 w-4" /> Thông báo
                      {unreadNotifications > 0 && (
                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] text-white">
                          {unreadNotifications > 9 ? '9+' : unreadNotifications}
                        </span>
                      )}
                    </span>
                  </Link>
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
                    <Đăng nhập></Đăng nhập>
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