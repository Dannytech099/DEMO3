import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, TriangleAlert } from 'lucide-react'

type Kind = 'success' | 'info' | 'error'
interface ToastItem { id: number; message: string; kind: Kind }
interface Ctx { toast: (message: string, kind?: Kind) => void }

const ToastCtx = createContext<Ctx | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const toast = useCallback((message: string, kind: Kind = 'success') => {
    const id = nextId.current++
    setItems((prev) => [...prev.slice(-2), { id, message, kind }])
    window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3400)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])
  const icon = (k: Kind) =>
    k === 'success' ? <CheckCircle2 size={18} className="text-accent" /> :
    k === 'error' ? <TriangleAlert size={18} className="text-sale" /> :
    <Info size={18} className="text-muted" />

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end">
        {items.map((t) => (
          <div key={t.id} className="anim-pop pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl border border-line bg-raised px-4 py-3 text-sm shadow-2xl">
            {icon(t.kind)}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
