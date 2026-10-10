import { useMemo, useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { useCatalog } from '../context/CatalogContext'
import { formatPrice } from '../lib/format'
import { ProductImage } from './ProductImage'

export function SearchBox({ onDone, autoFocus = false }: { onDone?: () => void; autoFocus?: boolean }) {
  const { products } = useCatalog()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return []
    return products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(term)).slice(0, 5)
  }, [q, products])

  const finish = () => {
    setQ('')
    setOpen(false)
    onDone?.()
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    if (!term) return
    navigate(`/shop?q=${encodeURIComponent(term)}`)
    finish()
  }

  return (
    <div
      className="relative w-full"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
      }}
    >
      <form onSubmit={submit} role="search" className="relative">
        <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => { setQ(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search bags, sneakers, watches"
          aria-label="Search products"
          className="w-full rounded-full border border-line bg-surface py-2.5 pl-11 pr-4 text-sm transition placeholder:text-muted/70 focus:border-accent focus:outline-none"
        />
      </form>

      {open && q.trim() && (
        <div onMouseDown={(e) => e.preventDefault()} className="anim-pop absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
          {results.length === 0 ? (
            <p className="px-4 py-5 text-sm text-muted">No products match "{q.trim()}". Try "leather" or "watch".</p>
          ) : (
            <>
              <ul>
                {results.map((p) => (
                  <li key={p.id}>
                    <Link to={`/product/${p.slug}`} onClick={finish} className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-raised">
                      <span className="h-12 w-10 shrink-0 overflow-hidden rounded-md"><ProductImage product={p} /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{p.name}</span>
                        <span className="text-xs text-muted">{p.category}</span>
                      </span>
                      <span className="text-sm">{formatPrice(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button onClick={submit} className="w-full border-t border-line px-4 py-3 text-left text-sm text-accent transition hover:bg-raised">
                See all results for "{q.trim()}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
