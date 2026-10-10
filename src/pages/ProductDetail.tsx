import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronDown, Heart, PackageX, Ruler, Truck } from 'lucide-react'
import { useCatalog } from '../context/CatalogContext'
import { useStore } from '../context/StoreContext'
import { useToast } from '../context/ToastContext'
import { Link } from '../lib/router'
import { discountPercent } from '../lib/format'
import { ProductImage } from '../components/ProductImage'
import { ProductCard } from '../components/ProductCard'
import { Modal } from '../components/Overlay'
import { EmptyState, Price, QuantitySelector, SectionHeading, Stars } from '../components/ui'

const SIZE_GUIDE = [
  ['40', '25.5 cm', 'UK 6'], ['41', '26.0 cm', 'UK 7'], ['42', '26.7 cm', 'UK 8'],
  ['43', '27.5 cm', 'UK 9'], ['44', '28.3 cm', 'UK 10'], ['45', '29.0 cm', 'UK 11'], ['46', '29.7 cm', 'UK 12'],
]

export default function ProductDetail({ slug }: { slug: string }) {
  const { products } = useCatalog()
  const { addItem, openDrawer, toggleWishlist, wishlist } = useStore()
  const { toast } = useToast()
  const product = products.find((p) => p.slug === slug)

  const [imgIndex, setImgIndex] = useState(0)
  const [color, setColor] = useState<string | undefined>()
  const [size, setSize] = useState<string | undefined>()
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [adding, setAdding] = useState(false)
  const [guide, setGuide] = useState(false)
  const [openSection, setOpenSection] = useState<'details' | 'delivery' | null>('details')

  // Reset selections when moving between products.
  useEffect(() => {
    setImgIndex(0)
    setColor(product?.colors?.[0]?.name)
    setSize(undefined)
    setQty(1)
    setSizeError(false)
  }, [product?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const related = useMemo(() => {
    if (!product) return []
    const same = products.filter((p) => p.category === product.category && p.id !== product.id)
    const rest = products.filter((p) => p.category !== product.category && p.id !== product.id)
    return [...same, ...rest].slice(0, 4)
  }, [products, product])

  if (!product) {
    return (
      <div className="container-x py-20">
        <EmptyState icon={<PackageX size={32} />} title="Product not found" body="This product may have been removed or the link is wrong.">
          <Link to="/shop" className="btn btn-primary">Back to the shop</Link>
        </EmptyState>
      </div>
    )
  }

  const colorHex = product.colors?.find((c) => c.name === color)?.hex
  const pct = discountPercent(product.price, product.compareAtPrice)
  const saved = wishlist.includes(product.id)
  const soldOut = product.stock <= 0
  const maxQty = Math.min(10, product.stock)

  const handleAdd = () => {
    if (product.sizes && !size) {
      setSizeError(true)
      toast('Choose a size first', 'error')
      return
    }
    setAdding(true)
    window.setTimeout(() => {
      addItem(product.id, qty, { color, size })
      setAdding(false)
      openDrawer()
    }, 450)
  }

  const Section = ({ id, title, children }: { id: 'details' | 'delivery'; title: string; children: React.ReactNode }) => {
    const open = openSection === id
    return (
      <div className="border-b border-line">
        <button onClick={() => setOpenSection(open ? null : id)} aria-expanded={open} className="flex w-full items-center justify-between py-4 text-left font-medium">
          {title}<ChevronDown size={18} className={`transition ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && <div className="anim-fade pb-5 text-sm text-muted">{children}</div>}
      </div>
    )
  }

  return (
    <div className="container-x py-8 sm:py-12">
      <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
        <Link to="/shop" className="hover:text-bone">Shop</Link> / <Link to={`/shop?category=${product.category}`} className="hover:text-bone">{product.category}</Link> / <span className="text-bone">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="grid gap-3 md:grid-cols-[84px_1fr]">
          <div className="order-2 flex gap-3 md:order-1 md:flex-col">
            {product.images.map((_, i) => (
              <button key={i} onClick={() => setImgIndex(i)} aria-label={`Show image ${i + 1}`} aria-current={i === imgIndex}
                className={`aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl border-2 transition md:w-full ${i === imgIndex ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                <ProductImage product={product} index={i} colorHex={colorHex} />
              </button>
            ))}
          </div>
          <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-3xl md:order-2">
            <ProductImage key={imgIndex + (colorHex ?? '')} product={product} index={imgIndex} colorHex={colorHex} />
            {pct > 0 && <span className="absolute left-4 top-4 rounded-full bg-sale px-3 py-1 text-xs font-semibold text-white">{pct}% off</span>}
          </div>
        </div>

        <div className="lg:pt-4">
          <h1 className="text-5xl leading-none sm:text-6xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted">
            <Stars rating={product.rating} /> <span>{product.rating} ({product.reviews} reviews)</span>
          </div>
          <div className="mt-5"><Price price={product.price} compareAt={product.compareAtPrice} size="lg" /></div>
          <p className="mt-5 max-w-prose leading-relaxed text-muted">{product.description}</p>

          {product.colors && (
            <div className="mt-7">
              <p className="mb-3 text-sm font-medium">Colour: <span className="font-normal text-muted">{color}</span></p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button key={c.name} onClick={() => setColor(c.name)} aria-label={c.name} aria-pressed={color === c.name} title={c.name}
                    className={`grid h-10 w-10 place-items-center rounded-full border-2 transition ${color === c.name ? 'border-accent' : 'border-line hover:border-bone/50'}`}>
                    <span className="h-7 w-7 rounded-full border border-bone/20" style={{ background: c.hex }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && (
            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between text-sm">
                <p className="font-medium">Size{size && <span className="font-normal text-muted">: {size}</span>}</p>
                {product.category === 'Footwear' && (
                  <button onClick={() => setGuide(true)} className="inline-flex items-center gap-1.5 text-muted underline-offset-4 hover:text-bone hover:underline"><Ruler size={14} /> Size guide</button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => { setSize(s); setSizeError(false) }} aria-pressed={size === s}
                    className={`min-w-12 rounded-full border px-4 py-2.5 text-sm transition ${size === s ? 'border-accent bg-accent text-accent-ink' : sizeError ? 'border-sale' : 'border-line hover:border-bone/50'}`}>
                    {s}
                  </button>
                ))}
              </div>
              {sizeError && <p role="alert" className="mt-2 text-xs text-sale">Select a size to continue</p>}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuantitySelector value={qty} onChange={setQty} max={Math.max(1, maxQty)} />
            <button onClick={handleAdd} disabled={soldOut || adding} className="btn btn-primary min-w-[200px] flex-1 py-3.5">
              {adding ? <span className="spinner" /> : soldOut ? 'Sold out' : 'Add to cart'}
            </button>
            <button onClick={() => toggleWishlist(product.id)} aria-pressed={saved} aria-label={saved ? 'Remove from saved items' : 'Save item'} className="grid h-12 w-12 place-items-center rounded-full border border-line transition hover:bg-raised">
              <Heart size={19} fill={saved ? 'currentColor' : 'none'} className={saved ? 'text-sale' : ''} />
            </button>
          </div>
          {product.stock > 0 && product.stock <= 8 && <p className="mt-3 text-sm text-sale">Only {product.stock} left in stock</p>}

          <div className="mt-8 border-t border-line">
            <Section id="details" title="Details and care">
              <ul className="space-y-2">
                {product.details.map((d) => <li key={d} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-accent" />{d}</li>)}
              </ul>
              <p className="mt-3 text-xs">SKU {product.sku}</p>
            </Section>
            <Section id="delivery" title="Delivery and returns">
              <p className="flex gap-2"><Truck size={16} className="mt-0.5 shrink-0 text-accent" /> Delivered in 2 to 4 working days. Express next-day delivery is available in Lagos and Abuja.</p>
              <p className="mt-3">Not right? Return or exchange within 14 days, unworn and in original packaging.</p>
            </Section>
          </div>
        </div>
      </div>

      <section className="pt-20">
        <SectionHeading title="You may also like" action={{ label: 'View all', to: '/shop' }} />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <Modal open={guide} onClose={() => setGuide(false)} title="Size guide">
        <p className="mb-4 text-sm text-muted">Measure your foot from heel to longest toe and match it to the table. Between sizes? Go up.</p>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-line text-left text-muted"><th className="py-2 font-medium">EU</th><th className="font-medium">Foot length</th><th className="font-medium">UK</th></tr></thead>
          <tbody>{SIZE_GUIDE.map(([eu, cm, uk]) => <tr key={eu} className="border-b border-line/60"><td className="py-2">{eu}</td><td>{cm}</td><td>{uk}</td></tr>)}</tbody>
        </table>
      </Modal>
    </div>
  )
}
