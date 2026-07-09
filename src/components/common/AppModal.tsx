import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface AppModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
  maxWidthClassName?: string
  theme?: 'light' | 'dark'
}

export default function AppModal({
  open,
  title,
  children,
  onClose,
  footer,
  maxWidthClassName = 'max-w-[520px]',
  theme = 'light',
}: AppModalProps) {
  if (!open) return null

  const isDark = theme === 'dark'

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6 backdrop-blur-sm ${
      isDark ? 'bg-black/60' : 'bg-black/45'
    }`}>
      <div className={`max-h-[88vh] w-full overflow-y-auto rounded-2xl shadow-2xl transition-all ${
        isDark ? 'bg-[#2A2F3B] text-white border border-white/10' : 'bg-white text-slate-800'
      } ${maxWidthClassName}`}>
        <div className={`sticky top-0 z-10 mb-2 flex items-center justify-between px-6 py-5 ${
          isDark ? 'border-b border-white/10 bg-[#2A2F3B]' : 'border-b border-gray-100 bg-white'
        }`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              isDark ? 'bg-[#181B22] text-slate-300 border border-white/10 hover:bg-slate-800 cursor-pointer' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6">{children}</div>

        {footer && (
          <div className={`sticky bottom-0 mt-2 flex justify-end gap-3 px-6 py-4 ${
            isDark ? 'border-t border-white/10 bg-[#2A2F3B]' : 'border-t border-gray-100 bg-white'
          }`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
