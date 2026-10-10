import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, TriangleAlert } from 'lucide-react'
import type { Order } from '../../types'
import { dailyRevenue } from '../../data/orders'
import { useCatalog } from '../../context/CatalogContext'
import { Link } from '../../lib/router'
import { formatDate, formatPrice } from '../../lib/format'
import { ProductImage } from '../../components/ProductImage'
import { StatusBadge } from './shared'

function Stat({ label, value, delta }: { label: string; value: string; delta: number }) {
  const up = delta >= 0
  return (
    <div className="card p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-4xl">{value}</p>
      <p className={`mt-2 inline-flex items-center gap-1 text-xs ${up ? 'text-emerald-300' : 'text-rose-300'}`}>
        {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{Math.abs(delta)}% vs previous period
      </p>
    </div>
  )
}

export default function Overview({ orders }: { orders: Order[] }) {
  const { allProducts } = useCatalog()
  const [range, setRange] = useState<7 | 14 | 30>(14)
  const [hover, setHover] = useState<number | null>(null)

  const series = dailyRevenue.slice(-range)
  const max = Math.max(...series.map((d) => d.value))
  const revenue = series.reduce((n, d) => n + d.value, 0)
  const orderCount = Math.round(revenue / 118000)
  const aov = Math.round(revenue / orderCount / 100) * 100

  const topProducts = useMemo(() => {
    const units = new Map<string, number>()
    orders.filter((o) => o.status !== 'Cancelled').forEach((o) => o.items.forEach((i) => units.set(i.productId, (units.get(i.productId) ?? 0) + i.quantity)))
    return [...units.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
      .flatMap(([id, n]) => { const p = allProducts.find((x) => x.id === id); return p ? [{ p, n }] : [] })
  }, [orders, allProducts])

  const low = allProducts.filter((p) => p.stock <= 8)
  const W = 640, H = 220, pad = 8
  const bw = (W - pad * 2) / series.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Revenue" value={formatPrice(revenue)} delta={12.4} />
        <Stat label="Orders" value={String(orderCount)} delta={8.1} />
        <Stat label="Average order" value={formatPrice(aov)} delta={3.2} />
        <Stat label="Conversion rate" value="3.4%" delta={-0.6} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl">Revenue</h2>
            <div className="flex gap-1 rounded-full border border-line p-1">
              {([7, 14, 30] as const).map((r) => (
                <button key={r} onClick={() => setRange(r)} aria-pressed={range === r} className={`rounded-full px-3 py-1 text-xs transition ${range === r ? 'bg-accent text-accent-ink' : 'text-muted hover:text-bone'}`}>{r} days</button>
              ))}
            </div>
          </div>
          <p className="mb-2 h-5 text-sm text-muted" aria-live="polite">
            {hover !== null ? `${series[hover].label}: ${formatPrice(series[hover].value)}` : 'Hover a bar to see the day'}
          </p>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Revenue bar chart, illustrative">
            {[0.25, 0.5, 0.75, 1].map((t) => <line key={t} x1="0" x2={W} y1={H - 20 - (H - 40) * t} y2={H - 20 - (H - 40) * t} stroke="rgb(var(--c-line))" strokeDasharray="3 5" />)}
            {series.map((d, i) => {
              const h = ((H - 40) * d.value) / max
              return (
                <g key={d.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0}>
                  <rect x={pad + i * bw} y="0" width={bw} height={H - 20} fill="transparent" />
                  <rect x={pad + i * bw + bw * 0.18} y={H - 20 - h} width={bw * 0.64} height={h} rx="4" fill="rgb(var(--c-accent))" opacity={hover === null || hover === i ? 1 : 0.35} />
                  {(range <= 14 || i % 5 === 0) && <text x={pad + i * bw + bw / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="rgb(var(--c-muted))">{d.label}</text>}
                </g>
              )
            })}
          </svg>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 text-2xl">Top products</h2>
          <ul className="space-y-3">
            {topProducts.map(({ p, n }) => (
              <li key={p.id} className="flex items-center gap-3">
                <div className="h-12 w-10 shrink-0 overflow-hidden rounded-md"><ProductImage product={p} /></div>
                <div className="min-w-0 flex-1 text-sm"><p className="truncate font-medium">{p.name}</p><p className="text-xs text-muted">{n} sold</p></div>
                <span className="text-sm">{formatPrice(p.price * n)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-3">
            <h2 className="text-2xl">Recent orders</h2>
            <Link to="/admin/orders" className="text-sm text-muted underline-offset-4 hover:text-bone hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead><tr className="border-y border-line text-left text-xs text-muted"><th className="px-5 py-2.5 font-medium">Order</th><th className="font-medium">Customer</th><th className="font-medium">Date</th><th className="font-medium">Total</th><th className="pr-5 font-medium">Status</th></tr></thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="border-b border-line/60 last:border-0">
                    <td className="px-5 py-3 font-medium">{o.id}</td><td>{o.customer}</td><td className="text-muted">{formatDate(o.date)}</td><td>{formatPrice(o.total)}</td><td className="pr-5"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-2xl"><TriangleAlert size={20} className="text-sale" /> Low stock</h2>
          {low.length === 0 ? <p className="text-sm text-muted">All products are well stocked.</p> : (
            <ul className="space-y-3">
              {low.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm"><span className="truncate pr-3">{p.name}</span><span className="shrink-0 rounded-full bg-sale/15 px-2.5 py-1 text-xs text-sale">{p.stock} left</span></li>
              ))}
            </ul>
          )}
          <Link to="/admin/products" className="btn btn-outline btn-sm mt-5 w-full">Manage inventory</Link>
        </section>
      </div>
    </div>
  )
}
