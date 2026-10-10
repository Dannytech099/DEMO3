import { brand } from '../config/brand'
import { categories } from '../data/products'
import { Link } from '../lib/router'
import { useToast } from '../context/ToastContext'
import { Logo } from './Logo'

export function Footer() {
  const { toast } = useToast()
  const demo = (label: string) => () => toast(`"${label}" is a placeholder page in this prototype`, 'info')

  const DemoLink = ({ label }: { label: string }) => (
    <li><button onClick={demo(label)} className="link-muted text-left">{label}</button></li>
  )

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted">{brand.tagline}. Made in small batches, delivered across Nigeria.</p>
          <address className="mt-5 space-y-1 text-sm not-italic text-muted">
            <p>{brand.contact.address}</p>
            <p>{brand.contact.email}</p>
            <p>{brand.contact.phone}</p>
          </address>
        </div>
        <div>
          <h3 className="mb-4 text-xl">Shop</h3>
          <ul className="space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c}><Link to={`/shop?category=${c}`} className="link-muted">{c}</Link></li>
            ))}
            <li><Link to="/shop?sale=1" className="link-muted">Sale</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-xl">Help</h3>
          <ul className="space-y-2.5 text-sm">
            <DemoLink label="Delivery information" />
            <DemoLink label="Returns and exchanges" />
            <DemoLink label="Size guide" />
            <DemoLink label="Contact us" />
            <DemoLink label="FAQs" />
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-xl">Company</h3>
          <ul className="space-y-2.5 text-sm">
            <DemoLink label="Our story" />
            <DemoLink label="Journal" />
            <DemoLink label="Stockists" />
            <li><Link to="/admin" className="link-muted">Admin preview</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {brand.name}. Demonstration store, no real orders are taken.</p>
          <div className="flex items-center gap-5">
            {['Instagram', 'TikTok', 'X'].map((s) => (
              <button key={s} onClick={demo(s)} className="transition hover:text-bone">{s}</button>
            ))}
            {brand.credit && <span>{brand.credit}</span>}
          </div>
        </div>
      </div>
    </footer>
  )
}
