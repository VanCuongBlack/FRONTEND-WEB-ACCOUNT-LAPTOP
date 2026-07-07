import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, ShoppingCart, Search } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Sinh Viên', href: '#sinhvien' },
  { label: 'Macbook',   href: '#macbook'  },
  { label: 'Tool AI',   href: '#toolai'   },
  { label: 'Cloud & VPS', href: '#cloudvps' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('accessToken')

  const openSearch = () => {
    setSearchOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setQuery('')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/?search=${encodeURIComponent(query.trim())}`)
    closeSearch()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Main row ── */}
        <div className="h-14 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow flex-shrink-0">
              <span className="text-white font-black text-sm">W</span>
            </div>
            <span className="hidden sm:block text-gray-900 font-bold text-sm lg:text-base whitespace-nowrap truncate">
              Hệ Thống Laptop &amp; Account
            </span>
            <span className="block sm:hidden text-gray-900 font-bold text-sm">
              WebACC
            </span>
          </Link>

          {/* Desktop nav — ẩn khi search mở */}
          {!searchOpen && (
            <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {NAV_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-150 font-medium whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Search bar inline — desktop, hiện khi searchOpen */}
          {searchOpen && (
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 items-center mx-3"
            >
              <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-blue-400 rounded-xl px-3 py-1.5 ring-2 ring-blue-100 transition-all">
                <Search className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm, tài khoản..."
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={closeSearch}
                className="ml-2 text-xs text-gray-500 hover:text-gray-800 whitespace-nowrap"
              >
                Huỷ
              </button>
            </form>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Search icon button — desktop */}
            <button
              onClick={searchOpen ? closeSearch : openSearch}
              className="hidden md:flex p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              aria-label="Tìm kiếm"
            >
              {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>

            {/* Auth — desktop */}
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="hidden md:flex items-center gap-1.5 text-sm text-gray-700 font-medium hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all"
              >
                <User className="w-4 h-4" />
                Tài khoản
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block text-sm text-gray-700 font-medium hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="hidden md:block text-sm text-white font-semibold bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-all"
                >
                  Đăng ký
                </Link>
              </>
            )}

            {/* Cart */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                0
              </span>
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Mở menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 pb-3">
            {/* Search — mobile */}
            <form onSubmit={handleSearch} className="pt-3 px-1">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                />
              </div>
            </form>

            {/* Nav links */}
            <div className="pt-2 flex flex-col gap-0.5">
              {NAV_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="pt-2 mt-1 border-t border-gray-100 flex gap-2">
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-gray-200"
                >
                  <User className="w-4 h-4" /> Tài khoản
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
  )
}
