import { ShoppingBag } from 'lucide-react'
import { brand } from '../config/brand'
import { formatPrice } from '../lib/format'
import { Link } from '../lib/router'
import { useStore } from '../context/StoreContext'
import { Drawer } from './Overlay'
import { ProductImage } from './ProductImage'
import { QuantitySelector } from './ui'

export function CartDrawer() {
  const { drawerOpen, closeDrawer, lines, subtotal, updateQty, removeItem } = useStore()
  const remaining = Math.max(0, brand.freeShippingThreshold - subtotal)

  return (
    <Drawer
      open={drawerOpen}
      onClose={closeDrawer}
      title="Your cart"
      footer={
        lines.length > 0 ? (
          <div className="space-y-3 border-t border-line p-5">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-muted">Delivery and discounts are calculated at checkout.</p>
            <Link to="/checkout" onClick={closeDrawer} className="btn btn-primary w-full">Checkout</Link>
            <Link to="/cart" onClick={closeDrawer} className="btn btn-outline w-full">View full cart</Link>
          </div>
        ) : undefined
      }
    >
      {lines.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <ShoppingBag size={40} className="text-accent" />
          <p className="mt-4 font-display text-3xl">Nothing here yet</p>
          <p className="mt-2 text-sm text-muted">Add something you like and it will show up here.</p>
          <Link to="/shop" onClick={closeDrawer} className="btn btn-primary mt-6">Browse the shop</Link>
        </div>
      ) : (
        <div className="p-5">
          <div className="mb-5 rounded-xl bg-raised p-3 text-sm">
            {remaining > 0 ? (
              <p>Add <b>{formatPrice(remaining)}</b> more for free delivery.</p>
            ) : (
              <p className="text-accent">You have unlocked free delivery.</p>
            )}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / brand.freeShippingThreshold) * 100)}%` }} />
            </div>
          </div>
          <ul className="divide-y divide-line">
            {lines.map((l) => (
              <li key={l.id} className="flex gap-4 py-4">
                <Link to={`/product/${l.product.slug}`} onClick={closeDrawer} className="h-24 w-20 shrink-0 overflow-hidden rounded-lg">
                  <ProductImage product={l.product} colorHex={l.product.colors?.find((c) => c.name === l.color)?.hex} />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="font-medium leading-snug">{l.product.name}</p>
                  <p className="text-xs text-muted">{[l.color, l.size && `Size ${l.size}`].filter(Boolean).join(', ')}</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <QuantitySelector size="sm" value={l.quantity} onChange={(n) => updateQty(l.id, n)} max={Math.min(10, l.product.stock)} />
                    <span className="text-sm font-semibold">{formatPrice(l.lineTotal)}</span>
                  </div>
                  <button onClick={() => removeItem(l.id)} className="mt-2 self-start text-xs text-muted underline-offset-2 transition hover:text-sale hover:underline">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  )
}
