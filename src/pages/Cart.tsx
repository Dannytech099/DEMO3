import { useState, type FormEvent } from 'react'
import { ShoppingBag, Tag, Trash2 } from 'lucide-react'
import { brand } from '../config/brand'
import { useStore } from '../context/StoreContext'
import { useCatalog } from '../context/CatalogContext'
import { Link } from '../lib/router'
import { formatPrice } from '../lib/format'
import { computeTotals } from '../lib/pricing'
import { ProductImage } from '../components/ProductImage'
import { ProductCard } from '../components/ProductCard'
import { EmptyState, QuantitySelector, SectionHeading } from '../components/ui'

export function PromoBox() {
  const { promo, applyPromo, clearPromo } = useStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return setError('Enter a code first')
    if (applyPromo(code)) { setCode(''); setError('') }
    else setError('That code is not valid. Try WELCOME10.')
  }

  if (promo) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-raised px-4 py-3 text-sm">
        <span className="flex items-center gap-2"><Tag size={16} className="text-accent" /> {promo} applied</span>
        <button onClick={clearPromo} className="text-muted underline underline-offset-4 hover:text-bone">Remove</button>
      </div>
    )
  }
  return (
    <form onSubmit={submit}>
      <div className="flex gap-2">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" aria-label="Discount code" className={`input py-2.5 ${error ? 'input-error' : ''}`} />
        <button type="submit" className="btn btn-outline btn-sm">Apply</button>
      </div>
      {error && <p role="alert" className="mt-1.5 text-xs text-sale">{error}</p>}
    </form>
  )
}

export default function CartPage() {
  const { lines, subtotal, discount, updateQty, removeItem } = useStore()
  const { products } = useCatalog()
  const totals = computeTotals(subtotal, discount)
  const remaining = Math.max(0, brand.freeShippingThreshold - (subtotal - discount))

  if (lines.length === 0) {
    const picks = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4)
    return (
      <div className="container-x py-12">
        <EmptyState icon={<ShoppingBag size={32} />} title="Your cart is empty" body="Looks like you have not added anything yet. Our bestsellers are a good place to start.">
          <Link to="/shop" className="btn btn-primary">Start shopping</Link>
          <Link to="/shop?sort=new" className="btn btn-outline">See new arrivals</Link>
        </EmptyState>
        <div className="pt-12">
          <SectionHeading title="Popular right now" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">{picks.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-x py-10 sm:py-14">
      <h1 className="mb-8 text-5xl sm:text-6xl">Your cart</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-line border-y border-line">
          {lines.map((l) => (
            <li key={l.id} className="flex gap-4 py-6 sm:gap-6">
              <Link to={`/product/${l.product.slug}`} className="h-32 w-24 shrink-0 overflow-hidden rounded-xl sm:h-40 sm:w-32">
                <ProductImage product={l.product} colorHex={l.product.colors?.find((c) => c.name === l.color)?.hex} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link to={`/product/${l.product.slug}`} className="font-medium transition hover:text-accent">{l.product.name}</Link>
                    <p className="mt-1 text-sm text-muted">{[l.color, l.size && `Size ${l.size}`].filter(Boolean).join(', ') || l.product.category}</p>
                    <p className="mt-1 text-sm text-muted">{formatPrice(l.unitPrice)} each</p>
                  </div>
                  <p className="font-semibold">{formatPrice(l.lineTotal)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <QuantitySelector value={l.quantity} onChange={(n) => updateQty(l.id, n)} max={Math.min(10, l.product.stock)} />
                  <button onClick={() => removeItem(l.id)} className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-sale"><Trash2 size={15} /> Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="card h-fit space-y-5 p-6 lg:sticky lg:top-24">
          <h2 className="text-3xl">Order summary</h2>
          <div className="rounded-xl bg-raised p-3 text-sm">
            {remaining > 0 ? <p>Add <b>{formatPrice(remaining)}</b> more for free delivery.</p> : <p className="text-accent">Free delivery unlocked.</p>}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${Math.min(100, ((subtotal - discount) / brand.freeShippingThreshold) * 100)}%` }} /></div>
          </div>
          <PromoBox />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
            {totals.discount > 0 && <div className="flex justify-between text-accent"><dt>Discount</dt><dd>-{formatPrice(totals.discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd></div>
            <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
          </dl>
          <Link to="/checkout" className="btn btn-primary w-full py-3.5">Go to checkout</Link>
          <Link to="/shop" className="block text-center text-sm text-muted underline-offset-4 hover:text-bone hover:underline">Continue shopping</Link>
        </aside>
      </div>
    </div>
  )
}
