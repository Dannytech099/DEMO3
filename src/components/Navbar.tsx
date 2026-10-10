import { useState } from 'react'
import { Heart, Menu, Search, ShoppingBag } from 'lucide-react'
import { brand } from '../config/brand'
import { formatPrice } from '../lib/format'
import { Link } from '../lib/router'
import { categories } from '../data/products'
import { useStore } from '../context/StoreContext'
import { Drawer } from './Overlay'
import { Logo } from './Logo'
import { SearchBox } from './SearchBox'

const links = [
  { label: 'Shop', to: '/shop' },
  { label: 'New arrivals', to: '/shop?sort=new' },
  { label: 'Bestsellers', to: '/shop?sort=popular' },
  { label: 'Sale', to: '/shop?sale=1' },
]

export function Navbar() {
  const { count, wishlist, openDrawer } = useStore()
  const [menu, setMenu] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)

  return (
    <>
      <div className="bg-accent px-4 py-2 text-center text-xs font-medium text-accent-ink">
        <span>Free delivery on orders over {formatPrice(brand.freeShippingThreshold)}</span>
        {brand.preparedFor && <span className="hidden sm:inline"> &nbsp;|&nbsp; Concept prepared for {brand.preparedFor}</span>}
        <Link to="/admin" className="ml-4 hidden underline underline-offset-2 md:inline">Admin preview</Link>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-md">
        <div className="container-x flex h-16 items-center gap-4 lg:gap-8">
          <button onClick={() => setMenu(true)} aria-label="Open menu" className="-ml-2 rounded-full p-2 text-bone transition hover:bg-raised lg:hidden">
            <Menu size={22} />
          </button>
          <Link to="/" aria-label={`${brand.name} home`}><Logo /></Link>

          <nav className="hidden items-center gap-7 text-sm lg:flex" aria-label="Main">
            {links.map((l) => (
              <Link key={l.label} to={l.to} className={`link-muted ${l.label === 'Sale' ? '!text-sale' : ''}`}>{l.label}</Link>
            ))}
          </nav>

          <div className="ml-auto hidden w-full max-w-sm md:block"><SearchBox /></div>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <button onClick={() => setMobileSearch((s) => !s)} aria-label="Search" className="rounded-full p-2.5 text-bone transition hover:bg-raised md:hidden">
              <Search size={20} />
            </button>
            <Link to="/shop?saved=1" aria-label={`Saved items (${wishlist.length})`} className="relative rounded-full p-2.5 transition hover:bg-raised">
              <Heart size={20} />
              {wishlist.length > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-sale" />}
            </Link>
            <button onClick={openDrawer} aria-label={`Open cart, ${count} items`} className="relative rounded-full p-2.5 transition hover:bg-raised">
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-ink">{count}</span>
              )}
            </button>
          </div>
        </div>
        {mobileSearch && (
          <div className="container-x pb-3 md:hidden"><SearchBox autoFocus onDone={() => setMobileSearch(false)} /></div>
        )}
      </header>

      <Drawer open={menu} onClose={() => setMenu(false)} title="Menu" side="left" width="max-w-xs">
        <nav className="flex flex-col p-5" aria-label="Mobile">
          {links.map((l) => (
            <Link key={l.label} to={l.to} onClick={() => setMenu(false)} className="border-b border-line py-3.5 font-display text-3xl">{l.label}</Link>
          ))}
          <p className="mb-2 mt-8 text-sm text-muted">Categories</p>
          {categories.map((c) => (
            <Link key={c} to={`/shop?category=${c}`} onClick={() => setMenu(false)} className="py-2 text-bone/90">{c}</Link>
          ))}
          <Link to="/admin" onClick={() => setMenu(false)} className="btn btn-outline mt-8">Admin preview</Link>
        </nav>
      </Drawer>
    </>
  )
}
