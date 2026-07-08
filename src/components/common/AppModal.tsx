import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface AppModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
  maxWidthClassName?: string
}

export default function AppModal({
  open,
  title,
  children,
  onClose,
  footer,
  maxWidthClassName = 'max-w-[520px]',
}: AppModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <div className={`max-h-[88vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl ${maxWidthClassName}`}>
        <div className="sticky top-0 z-10 mb-2 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
          <h2 className="text-xl font-bold text-black">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6">{children}</div>

        {footer && (
          <div className="sticky bottom-0 mt-2 flex justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
