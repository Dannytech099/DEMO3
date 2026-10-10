import { useMemo, useRef, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Headset, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { brand } from '../config/brand'
import { categories, categoryBlurb } from '../data/products'
import { heroSlugs, testimonials } from '../data/storefront'
import { useCatalog } from '../context/CatalogContext'
import { Link } from '../lib/router'
import { formatPrice } from '../lib/format'
import type { Product } from '../types'
import { ProductImage } from '../components/ProductImage'
import { ProductCard } from '../components/ProductCard'
import { SectionHeading, Stars } from '../components/ui'
import { Newsletter } from '../components/Newsletter'

function HeroTile({ product, className, delay }: { product: Product; className: string; delay: number }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className={`anim-rise group absolute overflow-hidden rounded-3xl shadow-2xl ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-full w-full transition duration-700 group-hover:scale-105"><ProductImage product={product} /></div>
      <span className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full bg-ink/85 px-4 py-2 text-xs backdrop-blur">
        <span className="truncate font-medium">{product.name}</span>
        <span className="ml-2 shrink-0 text-muted">{formatPrice(product.price)}</span>
      </span>
    </Link>
  )
}

const tileSpans = ['md:col-span-5', 'md:col-span-4', 'md:col-span-3', 'md:col-span-3', 'md:col-span-4', 'md:col-span-5']

export default function Home() {
  const { products } = useCatalog()
  const scroller = useRef<HTMLDivElement>(null)
  const [quote, setQuote] = useState(0)

  const hero = useMemo(
    () => heroSlugs.map((s) => products.find((p) => p.slug === s)).filter((p): p is Product => !!p),
    [products],
  )
  const bestsellers = useMemo(() => [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4), [products])
  const arrivals = useMemo(() => [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8), [products])
  const saleItems = useMemo(() => products.filter((p) => p.compareAtPrice).slice(0, 2), [products])

  const t = testimonials[quote]
  const quoted = products.find((p) => p.slug === t.productSlug)
  const step = (dir: number) => setQuote((q) => (q + dir + testimonials.length) % testimonials.length)

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden">
        <div className="container-x grid items-center gap-14 pb-16 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-16">
          <div>
            <h1 className="anim-rise text-[clamp(3.2rem,8vw,6.5rem)] leading-[0.92]">{brand.hero.headline}</h1>
            <p className="anim-rise mt-7 max-w-md text-lg text-muted" style={{ animationDelay: '120ms' }}>{brand.hero.subline}</p>
            <div className="anim-rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '220ms' }}>
              <Link to="/shop" className="btn btn-primary px-8 py-4">Shop now <ArrowRight size={16} /></Link>
              <Link to="/shop?sort=new" className="btn btn-outline px-8 py-4">See new arrivals</Link>
            </div>
            <div className="anim-rise mt-8 flex items-center gap-3 text-sm text-muted" style={{ animationDelay: '320ms' }}>
              <Stars rating={5} /> <span>{brand.hero.proof}</span>
            </div>
          </div>

          <div className="relative mx-auto aspect-[5/5.2] w-full max-w-[540px]">
            {hero[0] && <HeroTile product={hero[0]} className="left-0 top-0 aspect-[4/5] w-[62%]" delay={150} />}
            {hero[1] && <HeroTile product={hero[1]} className="right-0 top-0 aspect-[4/5] w-[42%]" delay={300} />}
            {hero[2] && <HeroTile product={hero[2]} className="bottom-0 right-0 aspect-square w-[37%] border-4 border-ink" delay={450} />}
          </div>
        </div>

        <div className="border-y border-line">
          <div className="container-x grid grid-cols-2 gap-6 py-6 text-sm lg:grid-cols-4">
            {[
              { icon: Truck, title: 'Fast delivery', body: '2 to 4 days nationwide' },
              { icon: RotateCcw, title: '14-day returns', body: 'Free exchanges on size' },
              { icon: ShieldCheck, title: 'Secure checkout', body: 'Cards, transfer, pay on delivery' },
              { icon: Headset, title: 'Real support', body: 'Chat or call, 8am to 8pm' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-center gap-3">
                <Icon size={22} className="shrink-0 text-accent" />
                <div><p className="font-medium">{title}</p><p className="text-xs text-muted">{body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-x py-16 sm:py-24">
        <SectionHeading title="Shop by category" action={{ label: 'View everything', to: '/shop' }} />
        <div className="grid grid-cols-12 gap-3 sm:gap-4">
          {categories.map((c, i) => {
            const rep = products.find((p) => p.category === c)
            return (
              <Link key={c} to={`/shop?category=${c}`} className={`group relative col-span-6 h-64 overflow-hidden rounded-2xl sm:h-80 ${tileSpans[i]}`}>
                {rep && <div className="h-full w-full transition duration-700 group-hover:scale-105"><ProductImage product={rep} index={i % 2 === 0 ? 0 : 2} /></div>}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-white">
                  <p className="font-display text-3xl leading-none">{c}</p>
                  <p className="mt-1 hidden text-xs text-white/80 sm:block">{categoryBlurb[c]}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="container-x pb-16 sm:pb-24">
        <SectionHeading title="Bestsellers" action={{ label: 'Shop bestsellers', to: '/shop?sort=popular' }} />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Promo */}
      <section className="container-x pb-16 sm:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-accent text-accent-ink">
          <div className="grid items-center gap-8 p-8 sm:p-14 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="text-5xl leading-none sm:text-7xl">The season edit</h2>
              <p className="mt-5 max-w-md text-lg opacity-80">Up to 30% off selected bags, sneakers, watches and eyewear. While stock lasts.</p>
              <Link to="/shop?sale=1" className="btn btn-dark mt-8 px-8 py-4">Shop the sale <ArrowRight size={16} /></Link>
            </div>
            <div className="relative hidden h-72 lg:block">
              {saleItems[0] && <div className="absolute left-4 top-0 h-64 w-48 -rotate-6 overflow-hidden rounded-2xl shadow-2xl"><ProductImage product={saleItems[0]} /></div>}
              {saleItems[1] && <div className="absolute right-4 top-8 h-64 w-48 rotate-6 overflow-hidden rounded-2xl shadow-2xl"><ProductImage product={saleItems[1]} index={2} /></div>}
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="pb-16 sm:pb-24">
        <div className="container-x">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl">New arrivals</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => scroller.current?.scrollBy({ left: -320, behavior: 'smooth' })} aria-label="Scroll left" className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:bg-raised"><ChevronLeft size={18} /></button>
              <button onClick={() => scroller.current?.scrollBy({ left: 320, behavior: 'smooth' })} aria-label="Scroll right" className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:bg-raised"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
        <div ref={scroller} className="no-scrollbar flex snap-x gap-4 overflow-x-auto px-5 sm:px-8 lg:px-[max(2rem,calc((100vw-1280px)/2+2rem))]">
          {arrivals.map((p) => (
            <div key={p.id} className="w-[240px] shrink-0 snap-start sm:w-[290px]"><ProductCard product={p} /></div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-line bg-surface">
        <div className="container-x grid gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="text-4xl sm:text-5xl">What customers say</h2>
            <div className="mt-8 flex items-center gap-2">
              <button onClick={() => step(-1)} aria-label="Previous review" className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:bg-raised"><ChevronLeft size={18} /></button>
              <button onClick={() => step(1)} aria-label="Next review" className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:bg-raised"><ChevronRight size={18} /></button>
              <span className="ml-3 text-sm text-muted">{quote + 1} of {testimonials.length}</span>
            </div>
          </div>
          <figure key={t.id} className="anim-pop">
            <Stars rating={5} size={18} />
            <blockquote className="mt-5 font-display text-3xl leading-tight sm:text-4xl">{t.quote}</blockquote>
            <figcaption className="mt-6 text-sm text-muted">
              <span className="text-bone">{t.name}</span>, {t.city}
              {quoted && <> &nbsp;bought <Link to={`/product/${quoted.slug}`} className="underline underline-offset-4 transition hover:text-bone">{quoted.name}</Link></>}
            </figcaption>
          </figure>
        </div>
      </section>

      <Newsletter />
    </>
  )
}
