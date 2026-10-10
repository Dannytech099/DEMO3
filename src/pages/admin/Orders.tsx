import { useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'
import type { Order, OrderStatus } from '../../types'
import { useCatalog } from '../../context/CatalogContext'
import { useToast } from '../../context/ToastContext'
import { formatDate, formatPrice } from '../../lib/format'
import { Drawer } from '../../components/Overlay'
import { PaymentText, STATUSES, StatusBadge } from './shared'

interface Props {
  orders: Order[]
  onStatus: (id: string, status: OrderStatus) => void
}

export default function Orders({ orders, onStatus }: Props) {
  const { allProducts } = useCatalog()
  const { toast } = useToast()
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All')
  const [q, setQ] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: orders.length }
    STATUSES.forEach((s) => (c[s] = orders.filter((o) => o.status === s).length))
    return c
  }, [orders])

  const rows = orders.filter(
    (o) => (filter === 'All' || o.status === filter) && (!q.trim() || `${o.id} ${o.customer} ${o.city}`.toLowerCase().includes(q.trim().toLowerCase())),
  )
  const open = orders.find((o) => o.id === openId)

  const exportCsv = () => {
    const header = 'Order,Customer,Email,City,Date,Total,Status,Payment'
    const body = rows.map((o) => [o.id, o.customer, o.email, o.city, o.date.slice(0, 10), o.total, o.status, o.payment].join(','))
    const blob = new Blob([[header, ...body].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'demo-orders.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast(`Exported ${rows.length} demo orders`)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          {(['All', ...STATUSES] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} aria-pressed={filter === s}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition ${filter === s ? 'border-accent bg-accent text-accent-ink' : 'border-line text-muted hover:text-bone'}`}>
              {s} <span className="opacity-70">{counts[s]}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search orders" aria-label="Search orders" className="input rounded-full py-2 pl-10" />
          </div>
          <button onClick={exportCsv} className="btn btn-outline btn-sm"><Download size={14} /> Export</button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="px-5 py-3 font-medium">Order</th><th className="font-medium">Customer</th><th className="font-medium">City</th><th className="font-medium">Date</th><th className="font-medium">Total</th><th className="font-medium">Payment</th><th className="pr-5 font-medium">Status</th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-muted">No orders match that filter.</td></tr>}
            {rows.map((o) => (
              <tr key={o.id} onClick={() => setOpenId(o.id)} className="cursor-pointer border-b border-line/60 transition last:border-0 hover:bg-raised">
                <td className="px-5 py-3.5"><button onClick={() => setOpenId(o.id)} className="font-medium underline-offset-4 hover:underline">{o.id}</button></td>
                <td>{o.customer}</td><td className="text-muted">{o.city}</td><td className="text-muted">{formatDate(o.date)}</td><td>{formatPrice(o.total)}</td>
                <td><PaymentText payment={o.payment} /></td><td className="pr-5"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer open={!!open} onClose={() => setOpenId(null)} title={open?.id ?? 'Order'} width="max-w-md">
        {open && (
          <div className="space-y-6 p-5">
            <div className="flex items-center justify-between"><StatusBadge status={open.status} /><PaymentText payment={open.payment} /></div>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Customer</dt><dd>{open.customer}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Email</dt><dd>{open.email}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">City</dt><dd>{open.city}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Placed</dt><dd>{formatDate(open.date)}</dd></div>
            </dl>
            <div>
              <h3 className="mb-2 text-xl">Items</h3>
              <ul className="divide-y divide-line text-sm">
                {open.items.map((i) => {
                  const p = allProducts.find((x) => x.id === i.productId)
                  return <li key={i.productId} className="flex justify-between py-2.5"><span>{i.quantity} x {p?.name ?? 'Removed product'}</span><span>{p ? formatPrice(p.price * i.quantity) : ''}</span></li>
                })}
              </ul>
              <p className="mt-3 flex justify-between border-t border-line pt-3 font-semibold"><span>Total</span><span>{formatPrice(open.total)}</span></p>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Update status</span>
              <select value={open.status} onChange={(e) => { onStatus(open.id, e.target.value as OrderStatus); toast(`${open.id} marked as ${e.target.value}`) }} className="input">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <button onClick={() => toast(`Invoice for ${open.id} would download here`, 'info')} className="btn btn-outline w-full">Download invoice</button>
          </div>
        )}
      </Drawer>
    </div>
  )
}
