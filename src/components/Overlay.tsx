import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

function useOverlay(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])
}

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  side?: 'left' | 'right'
  width?: string
  footer?: ReactNode
  children: ReactNode
}

export function Drawer({ open, onClose, title, side = 'right', width = 'max-w-md', footer, children }: DrawerProps) {
  useOverlay(open, onClose)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="anim-fade absolute inset-0 bg-black/60" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute top-0 flex h-full w-full ${width} flex-col border-line bg-surface shadow-2xl ${
          side === 'right' ? 'right-0 border-l anim-slide-r' : 'left-0 border-r anim-slide-l'
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-2xl">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-muted transition hover:bg-raised hover:text-bone">
            <X size={20} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer}
      </aside>
    </div>
  )
}

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  width?: string
  children: ReactNode
}

export function Modal({ open, onClose, title, width = 'max-w-lg', children }: ModalProps) {
  useOverlay(open, onClose)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="anim-fade absolute inset-0 bg-black/70" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className={`anim-pop relative max-h-[90vh] w-full ${width} overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-2xl`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-muted transition hover:bg-raised hover:text-bone">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
