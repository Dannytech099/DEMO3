import type { ReactNode } from 'react'
import { Minus, Plus, Star } from 'lucide-react'
import { Link } from '../lib/router'
import { formatPrice as formatNaira } from '../lib/format'

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-accent" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} fill={i <= Math.round(rating) ? 'currentColor' : 'none'} strokeWidth={1.5} />
      ))}
    </span>
  )
}

export function QuantitySelector({
  value, onChange, min = 1, max = 10, size = 'md',
}: { value: number; onChange: (n: number) => void; min?: number; max?: number; size?: 'sm' | 'md' }) {
  const pad = size === 'sm' ? 'h-8 w-8' : 'h-11 w-11'
  return (
    <div className="inline-flex items-center rounded-full border border-line">
      <button type="button" aria-label="Decrease quantity" disabled={value <= min} onClick={() => onChange(value - 1)} className={`${pad} grid place-items-center rounded-full text-muted transition hover:text-bone disabled:opacity-30`}>
        <Minus size={size === 'sm' ? 14 : 16} />
      </button>
      <span className={`${size === 'sm' ? 'w-6 text-sm' : 'w-8'} text-center font-medium tabular-nums`} aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)} className={`${pad} grid place-items-center rounded-full text-muted transition hover:text-bone disabled:opacity-30`}>
        <Plus size={size === 'sm' ? 14 : 16} />
      </button>
    </div>
  )
}

export function SectionHeading({ title, action }: { title: string; action?: { label: string; to: string } }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <h2 className="text-4xl sm:text-5xl">{title}</h2>
      {action && (
        <Link to={action.to} className="shrink-0 text-sm text-muted underline-offset-4 transition hover:text-bone hover:underline">
          {action.label}
        </Link>
      )}
    </div>
  )
}

export function EmptyState({ icon, title, body, children }: { icon: ReactNode; title: string; body: string; children?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div className="mb-6 grid h-20 w-20 place-items-center rounded-full border border-line bg-surface text-accent">{icon}</div>
      <h2 className="text-4xl">{title}</h2>
      <p className="mt-3 text-muted">{body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
    </div>
  )
}

export function Field({
  label, error, children, hint,
}: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error ? (
        <span role="alert" className="mt-1.5 block text-xs text-sale">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  )
}

export function Price({ price, compareAt, size = 'md' }: { price: number; compareAt?: number; size?: 'md' | 'lg' }) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={`${size === 'lg' ? 'text-2xl' : 'text-sm'} font-semibold`}>{formatNaira(price)}</span>
      {compareAt && compareAt > price && (
        <span className={`${size === 'lg' ? 'text-base' : 'text-xs'} text-muted line-through`}>{formatNaira(compareAt)}</span>
      )}
    </span>
  )
}
