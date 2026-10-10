import { useEffect, useState } from 'react'
import { ArrowLeft, Boxes, ClipboardList, Info, LayoutDashboard } from 'lucide-react'
import { brand } from '../../config/brand'
import { initialOrders } from '../../data/orders'
import { useStore } from '../../context/StoreContext'
import { useToast } from '../../context/ToastContext'
import { Link, useLocation } from '../../lib/router'
import type { Order, OrderStatus } from '../../types'
import { Logo } from '../../components/Logo'
import Overview from './Overview'
import Orders from './Orders'
import Products from './Products'

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/products', label: 'Products', icon: Boxes },
]

export default function Admin() {
  const { path } = useLocation()
  const { lastOrder } = useStore()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>(initialOrders)

  // Show an order placed through the demo checkout at the top of the list.
  useEffect(() => {
    if (!lastOrder) return
    setOrders((prev) =>
      prev.some((o) => o.id === `#${lastOrder.ref}`)
        ? prev
        : [{
            id: `#${lastOrder.ref}`, customer: lastOrder.name, email: lastOrder.email, city: lastOrder.city, date: new Date().toISOString(),
            items: lastOrder.lines.map((l) => ({ productId: l.productId, quantity: l.quantity })), total: lastOrder.total, status: 'Pending', payment: 'Unpaid',
          }, ...prev],
    )
  }, [lastOrder])

  const setStatus = (id: string, status: OrderStatus) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))

  const section = path.startsWith('/admin/orders') ? 'orders' : path.startsWith('/admin/products') ? 'products' : 'overview'
  const title = { overview: 'Overview', orders: 'Orders', products: 'Products' }[section]

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:block lg:py-6">
          <Link to="/" aria-label="Back to store"><Logo /></Link>
          <p className="mt-0 text-xs text-muted lg:mt-2">Admin preview</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0" aria-label="Admin">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === '/admin' ? section === 'overview' : path.startsWith(to)
            return (
              <Link key={to} to={to} aria-current={active ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${active ? 'bg-accent text-accent-ink' : 'text-muted hover:bg-raised hover:text-bone'}`}>
                <Icon size={17} /> {label}
              </Link>
            )
          })}
          <Link to="/" className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted transition hover:bg-raised hover:text-bone lg:mt-6"><ArrowLeft size={17} /> Back to store</Link>
        </nav>
      </aside>

      <div className="min-w-0">
        <div role="note" className="flex items-start gap-2 bg-accent px-5 py-2.5 text-xs font-medium text-accent-ink">
          <Info size={15} className="mt-px shrink-0" />
          <p>Demo dashboard{brand.preparedFor ? ` for ${brand.preparedFor}` : ''}. All sales figures, orders and customers shown here are illustrative sample data.</p>
        </div>
        <div className="px-5 py-8 sm:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-5xl">{title}</h1>
            <button onClick={() => toast('Notifications are not part of this prototype', 'info')} className="btn btn-outline btn-sm">Notifications</button>
          </div>
          {section === 'overview' && <Overview orders={orders} />}
          {section === 'orders' && <Orders orders={orders} onStatus={setStatus} />}
          {section === 'products' && <Products />}
        </div>
      </div>
    </div>
  )
}
