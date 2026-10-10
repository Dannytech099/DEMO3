import { useEffect, useMemo, useState } from 'react'
import { PackageSearch, Search, SlidersHorizontal, X } from 'lucide-react'
import { categories } from '../data/products'
import { useCatalog } from '../context/CatalogContext'
import { useStore } from '../context/StoreContext'
import { navigate, useLocation } from '../lib/router'
import { formatPrice } from '../lib/format'
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard'
import { Drawer } from '../components/Overlay'
import { EmptyState } from '../components/ui'

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'popular', label: 'Most popular' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'new', label: 'Newest' },
]

const PRICES = [
  { value: '', label: 'Any price', test: () => true },
  { value: 'u50', label: `Under ${formatPrice(50000)}`, test: (n: number) => n < 50000 },
  { value: '50-100', label: `${formatPrice(50000)} to ${formatPrice(100000)}`, test: (n: number) => n >= 50000 && n <= 100000 },
  { value: '100-200', label: `${formatPrice(100000)} to ${formatPrice(200000)}`, test: (n: number) => n > 100000 && n <= 200000 },
  { value: 'o200', label: `Over ${formatPrice(200000)}`, test: (n: number) => n > 200000 },
]

export default function Shop() {
  const { params } = useLocation()
  const { products } = useCatalog()
  const { wishlist } = useStore()

  const q = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const sort = params.get('sort') ?? 'featured'
  const price = params.get('price') ?? ''
  const onSale = params.get('sale') === '1'
  const savedOnly = params.get('saved') === '1'

  const [search, setSearch] = useState(q)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const setParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    const s = next.toString()
    navigate('/shop' + (s ? `?${s}` : ''), { replace: true })
  }

  // Keep the box in sync when the query changes from the navbar search.
  useEffect(() => setSearch(q), [q])
  // Debounce typing into the URL.
  useEffect(() => {
    if (search === q) return
    const t = window.setTimeout(() => setParams({ q: search.trim() || null }), 250)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // Brief skeleton on every filter change so the demo feels like a live store.
  const key = params.toString()
  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), 380)
    return () => window.clearTimeout(t)
  }, [key])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    const priceTest = PRICES.find((p) => p.value === price)?.test ?? (() => true)
    const list = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!term || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(term)) &&
        priceTest(p.price) &&
        (!onSale || !!p.compareAtPrice) &&
        (!savedOnly || wishlist.includes(p.id)),
    )
    const sorted = [...list]
    if (sort === 'popular') sorted.sort((a, b) => b.popularity - a.popularity)
    else if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    else if (sort === 'new') sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return sorted
  }, [products, q, category, price, onSale, savedOnly, sort, wishlist])

  const activeChips = [
    category && { label: category, clear: () => setParams({ category: null }) },
    q && { label: `"${q}"`, clear: () => setParams({ q: null }) },
    price && { label: PRICES.find((p) => p.value === price)?.label ?? '', clear: () => setParams({ price: null }) },
    onSale && { label: 'On sale', clear: () => setParams({ sale: null }) },
    savedOnly && { label: 'Saved items', clear: () => setParams({ saved: null }) },
  ].filter(Boolean) as { label: string; clear: () => void }[]

  const title = savedOnly ? 'Saved items' : onSale ? 'Sale' : category || (q ? 'Search results' : 'The shop')

  const panel = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-xl">Category</h3>
        <ul className="space-y-1">
          {['', ...categories].map((c) => {
            const n = c ? products.filter((p) => p.category === c).length : products.length
            const active = category === c
            return (
              <li key={c || 'all'}>
                <button onClick={() => setParams({ category: c || null })} aria-pressed={active}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${active ? 'bg-accent text-accent-ink' : 'text-muted hover:bg-raised hover:text-bone'}`}>
                  <span>{c || 'All products'}</span><span className="text-xs opacity-70">{n}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div>
        <h3 className="mb-3 text-xl">Price</h3>
        <div className="space-y-1">
          {PRICES.map((p) => (
            <label key={p.value} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-raised hover:text-bone">
              <input type="radio" name="price" checked={price === p.value} onChange={() => setParams({ price: p.value || null })} className="accent-[rgb(var(--c-accent))]" />
              {p.label}
            </label>
          ))}
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm">
        <input type="checkbox" checked={onSale} onChange={(e) => setParams({ sale: e.target.checked ? '1' : null })} className="h-4 w-4 accent-[rgb(var(--c-accent))]" />
        Show sale items only
      </label>
    </div>
  )

  return (
    <div className="container-x py-10 sm:py-14">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl">{title}</h1>
          <p className="mt-2 text-sm text-muted" aria-live="polite">{loading ? 'Loading products' : `${results.length} ${results.length === 1 ? 'product' : 'products'}`}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1 sm:flex-none">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the shop" aria-label="Search the shop" className="input rounded-full py-2.5 pl-10" />
          </div>
          <select value={sort} onChange={(e) => setParams({ sort: e.target.value === 'featured' ? null : e.target.value })} aria-label="Sort products" className="input w-auto rounded-full py-2.5 pr-8">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={() => setFiltersOpen(true)} className="btn btn-outline btn-sm py-2.5 lg:hidden"><SlidersHorizontal size={15} /> Filters</button>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {activeChips.map((c) => (
            <button key={c.label} onClick={c.clear} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs transition hover:border-bone/50">
              {c.label} <X size={13} />
            </button>
          ))}
          <button onClick={() => { setSearch(''); navigate('/shop', { replace: true }) }} className="ml-1 text-xs text-muted underline underline-offset-4 hover:text-bone">Clear all</button>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{panel}</aside>
        <div>
          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : results.length === 0 ? (
            <EmptyState icon={<PackageSearch size={32} />} title="No products found" body="Nothing matches those filters. Try a different search or clear the filters.">
              <button onClick={() => { setSearch(''); navigate('/shop', { replace: true }) }} className="btn btn-primary">Clear all filters</button>
            </EmptyState>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {results.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters" width="max-w-sm"
        footer={<div className="border-t border-line p-5"><button onClick={() => setFiltersOpen(false)} className="btn btn-primary w-full">Show {results.length} products</button></div>}>
        <div className="p-5">{panel}</div>
      </Drawer>
    </div>
  )
}
