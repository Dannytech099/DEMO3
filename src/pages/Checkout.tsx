import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, Info, ShoppingBag } from 'lucide-react'
import { brand } from '../config/brand'
import { nigerianStates } from '../data/storefront'
import { useStore } from '../context/StoreContext'
import { useToast } from '../context/ToastContext'
import { Link, navigate } from '../lib/router'
import { formatPrice } from '../lib/format'
import { computeTotals, type DeliveryMethod } from '../lib/pricing'
import { ProductImage } from '../components/ProductImage'
import { EmptyState, Field } from '../components/ui'
import { PromoBox } from './Cart'

interface Form { name: string; email: string; phone: string; address: string; city: string; state: string; notes: string }
type Errors = Partial<Record<keyof Form, string>>

const empty: Form = { name: '', email: '', phone: '', address: '', city: '', state: '', notes: '' }

function validate(f: Form): Errors {
  const e: Errors = {}
  if (f.name.trim().split(/\s+/).filter(Boolean).length < 2) e.name = 'Enter your first and last name'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email, like name@example.com'
  if (!/^(\+234|0)[789][01]\d{8}$/.test(f.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a Nigerian number, like 0803 123 4567'
  if (f.address.trim().length < 6) e.address = 'Enter your street address'
  if (f.city.trim().length < 2) e.city = 'Enter your city or town'
  if (!f.state) e.state = 'Choose your state'
  return e
}

const DEMO_BANNER = (
  <div role="note" className="mb-8 flex items-start gap-3 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm">
    <Info size={18} className="mt-0.5 shrink-0 text-accent" />
    <p><b>Demonstration checkout.</b> No payment is taken, no card details are collected and no order is placed. Use any sample details.</p>
  </div>
)

export default function Checkout() {
  const { lines, subtotal, discount, clearCart, setLastOrder } = useStore()
  const { toast } = useToast()
  const [form, setForm] = useState<Form>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>({})
  const [delivery, setDelivery] = useState<DeliveryMethod>('standard')
  const [payment, setPayment] = useState('card')
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const totals = computeTotals(subtotal, discount, delivery)

  const set = (k: keyof Form) => (v: string) => {
    const next = { ...form, [k]: v }
    setForm(next)
    if (touched[k]) setErrors((prev) => ({ ...prev, [k]: validate(next)[k] }))
  }
  const blur = (k: keyof Form) => () => {
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors((prev) => ({ ...prev, [k]: validate(form)[k] }))
  }
  const cls = (k: keyof Form) => `input ${errors[k] ? 'input-error' : ''}`

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    setTouched({ name: true, email: true, phone: true, address: true, city: true, state: true })
    const first = Object.keys(errs)[0]
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      toast('Please fix the highlighted fields', 'error')
      return
    }
    setSubmitting(true)
    window.setTimeout(() => {
      setLastOrder({
        ref: `DEMO-${Math.floor(10000 + Math.random() * 90000)}`,
        name: form.name.trim(), email: form.email.trim(), city: form.city.trim(), delivery,
        lines, subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, total: totals.total,
      })
      clearCart()
      navigate('/checkout/success')
    }, 1500)
  }

  if (lines.length === 0 && !submitting) {
    return (
      <div className="container-x py-12">
        <EmptyState icon={<ShoppingBag size={32} />} title="Nothing to check out" body="Your cart is empty. Add a few things and come back.">
          <Link to="/shop" className="btn btn-primary">Browse the shop</Link>
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="container-x py-10 sm:py-14">
      <h1 className="mb-6 text-5xl sm:text-6xl">Checkout</h1>
      {DEMO_BANNER}
      <form ref={formRef} onSubmit={submit} noValidate className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          <fieldset className="space-y-4">
            <legend className="mb-4 text-3xl">Contact</legend>
            <Field label="Full name" error={errors.name}>
              <input name="name" autoComplete="name" value={form.name} onChange={(e) => set('name')(e.target.value)} onBlur={blur('name')} aria-invalid={!!errors.name} className={cls('name')} placeholder="Adaeze Okafor" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" error={errors.email}>
                <input name="email" type="email" autoComplete="email" value={form.email} onChange={(e) => set('email')(e.target.value)} onBlur={blur('email')} aria-invalid={!!errors.email} className={cls('email')} placeholder="you@example.com" />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone')(e.target.value)} onBlur={blur('phone')} aria-invalid={!!errors.phone} className={cls('phone')} placeholder="0803 123 4567" />
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-4 text-3xl">Delivery address</legend>
            <Field label="Street address" error={errors.address}>
              <input name="address" autoComplete="street-address" value={form.address} onChange={(e) => set('address')(e.target.value)} onBlur={blur('address')} aria-invalid={!!errors.address} className={cls('address')} placeholder="12 Admiralty Way, Lekki Phase 1" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City or town" error={errors.city}>
                <input name="city" autoComplete="address-level2" value={form.city} onChange={(e) => set('city')(e.target.value)} onBlur={blur('city')} aria-invalid={!!errors.city} className={cls('city')} placeholder="Lagos" />
              </Field>
              <Field label="State" error={errors.state}>
                <select name="state" value={form.state} onChange={(e) => set('state')(e.target.value)} onBlur={blur('state')} aria-invalid={!!errors.state} className={cls('state')}>
                  <option value="">Select a state</option>
                  {nigerianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Delivery notes (optional)">
              <textarea name="notes" rows={2} value={form.notes} onChange={(e) => set('notes')(e.target.value)} className="input" placeholder="Landmark, gate code, or preferred time" />
            </Field>
          </fieldset>

          <fieldset>
            <legend className="mb-4 text-3xl">Delivery method</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {([['standard', 'Standard', '2 to 4 working days', totals.subtotal - totals.discount >= brand.freeShippingThreshold ? 'Free' : formatPrice(brand.shippingFee)], ['express', 'Express', 'Next working day', formatPrice(brand.expressFee)]] as const).map(([v, name, eta, cost]) => (
                <label key={v} className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${delivery === v ? 'border-accent bg-accent/10' : 'border-line hover:border-bone/40'}`}>
                  <span className="flex items-center gap-3">
                    <input type="radio" name="delivery" checked={delivery === v} onChange={() => setDelivery(v)} className="accent-[rgb(var(--c-accent))]" />
                    <span><span className="block font-medium">{name}</span><span className="text-xs text-muted">{eta}</span></span>
                  </span>
                  <span className="text-sm">{cost}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-4 text-3xl">Payment</legend>
            <div className="mb-3 flex flex-wrap gap-2">
              {[['card', 'Card'], ['transfer', 'Bank transfer'], ['cod', 'Pay on delivery']].map(([v, label]) => (
                <button key={v} type="button" onClick={() => setPayment(v)} aria-pressed={payment === v}
                  className={`rounded-full border px-4 py-2 text-sm transition ${payment === v ? 'border-accent bg-accent text-accent-ink' : 'border-line hover:border-bone/50'}`}>{label}</button>
              ))}
            </div>
            <div className="rounded-xl border border-dashed border-line p-5 text-sm text-muted">
              No payment details are collected in this demo. In the live store, {payment === 'card' ? 'Paystack or Flutterwave would securely collect card details here' : payment === 'transfer' ? 'a one-time bank account number would be shown after you place the order' : 'the order would be confirmed and paid in cash or by transfer on delivery'}.
            </div>
          </fieldset>
        </div>

        <aside className="card h-fit space-y-5 p-6 lg:sticky lg:top-24">
          <h2 className="text-3xl">Order summary</h2>
          <ul className="divide-y divide-line">
            {lines.map((l) => (
              <li key={l.id} className="flex gap-3 py-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg">
                  <ProductImage product={l.product} colorHex={l.product.colors?.find((c) => c.name === l.color)?.hex} />
                  <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-bl-lg bg-ink/90 px-1 text-[11px]">{l.quantity}</span>
                </div>
                <div className="min-w-0 flex-1 text-sm"><p className="truncate font-medium">{l.product.name}</p><p className="text-xs text-muted">{[l.color, l.size && `Size ${l.size}`].filter(Boolean).join(', ')}</p></div>
                <p className="text-sm">{formatPrice(l.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <PromoBox />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
            {totals.discount > 0 && <div className="flex justify-between text-accent"><dt>Discount</dt><dd>-{formatPrice(totals.discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd></div>
            <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
          </dl>
          <button type="submit" disabled={submitting} className="btn btn-primary w-full py-3.5">
            {submitting ? <><span className="spinner" /> Placing demo order</> : 'Place demo order'}
          </button>
          <p className="text-center text-xs text-muted">This is a simulation. Nothing is charged or shipped.</p>
        </aside>
      </form>
    </div>
  )
}

export function OrderSuccess() {
  const { lastOrder } = useStore()

  useEffect(() => {
    if (!lastOrder) navigate('/shop', { replace: true })
  }, [lastOrder])

  if (!lastOrder) return null
  const o = lastOrder

  return (
    <div className="container-x py-12 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="anim-pop mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-accent text-accent-ink"><Check size={38} strokeWidth={2.5} /></div>
        <h1 className="text-5xl sm:text-6xl">Thank you, {o.name.split(' ')[0]}</h1>
        <p className="mt-4 text-muted">Your demo order <b className="text-bone">{o.ref}</b> is confirmed. A confirmation would be sent to {o.email}.</p>
        <p className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm"><Info size={15} className="text-accent" /> Simulated confirmation. No order was placed and nothing was charged.</p>
      </div>

      <div className="card mx-auto mt-10 max-w-2xl p-6">
        <ul className="divide-y divide-line">
          {o.lines.map((l) => (
            <li key={l.id} className="flex items-center gap-4 py-3">
              <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg"><ProductImage product={l.product} colorHex={l.product.colors?.find((c) => c.name === l.color)?.hex} /></div>
              <div className="flex-1 text-sm"><p className="font-medium">{l.product.name}</p><p className="text-xs text-muted">Qty {l.quantity}{l.color ? `, ${l.color}` : ''}{l.size ? `, size ${l.size}` : ''}</p></div>
              <p className="text-sm">{formatPrice(l.lineTotal)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Delivering to</dt><dd>{o.city}, {o.delivery === 'express' ? 'express' : 'standard'}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{o.shipping === 0 ? 'Free' : formatPrice(o.shipping)}</dd></div>
          {o.discount > 0 && <div className="flex justify-between text-accent"><dt>Discount</dt><dd>-{formatPrice(o.discount)}</dd></div>}
          <div className="flex justify-between text-lg font-semibold"><dt>Total</dt><dd>{formatPrice(o.total)}</dd></div>
        </dl>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/shop" className="btn btn-primary">Continue shopping</Link>
        <Link to="/admin" className="btn btn-outline">See it in the admin preview</Link>
      </div>
    </div>
  )
}
