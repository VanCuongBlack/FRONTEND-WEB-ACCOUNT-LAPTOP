import { ExternalLink, MessageCircle } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const zaloUrl = import.meta.env.VITE_ZALO_URL || 'https://zalo.me'
const facebookUrl = import.meta.env.VITE_FACEBOOK_URL || 'https://facebook.com'

const links = [
  {
    label: 'Zalo',
    href: zaloUrl,
    className: 'bg-[#0068ff] text-white hover:bg-[#0056d6]',
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    label: 'Facebook',
    href: facebookUrl,
    className: 'bg-[#1877f2] text-white hover:bg-[#1264cf]',
    icon: <span className="text-lg font-black leading-none">f</span>,
  },
]

export default function FloatingSocialLinks() {
  const { pathname } = useLocation()
  const hiddenPrefixes = ['/admin', '/staff']

  if (hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Mở ${link.label}`}
          title={link.label}
          className={`group flex h-12 items-center gap-3 rounded-full px-4 text-sm font-black shadow-[0_14px_34px_rgba(0,0,0,0.35)] ring-1 ring-white/15 transition hover:-translate-y-0.5 ${link.className}`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/16">
            {link.icon}
          </span>
          <span className="hidden sm:inline">{link.label}</span>
          <ExternalLink className="hidden h-4 w-4 opacity-70 transition group-hover:opacity-100 sm:block" />
        </a>
      ))}
    </div>
  )
}
