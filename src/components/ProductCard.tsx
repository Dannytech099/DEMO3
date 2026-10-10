import { Heart, ShoppingBag } from 'lucide-react'
import type { Product } from '../types'
import { Link, navigate } from '../lib/router'
import { discountPercent } from '../lib/format'
import { useStore } from '../context/StoreContext'
import { ProductImage } from './ProductImage'
import { Price, Stars } from './ui'

export function ProductCard({ product }: { product: Product }) {
  const { addItem, toggleWishlist, wishlist } = useStore()
  const saved = wishlist.includes(product.id)
  const pct = discountPercent(product.price, product.compareAtPrice)
  const soldOut = product.stock <= 0
  const needsChoice = !!product.sizes?.length

  const quickAdd = () => {
    if (needsChoice) navigate(`/product/${product.slug}`)
    else addItem(product.id, 1, { color: product.colors?.[0]?.name })
  }

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-raised">
        <Link to={`/product/${product.slug}`} aria-label={product.name} className="block h-full w-full">
          <div className="h-full w-full transition duration-500 group-hover:scale-[1.04]">
            <ProductImage product={product} />
          </div>
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {pct > 0 && <span className="rounded-full bg-sale px-2.5 py-1 text-xs font-semibold text-white">{pct}% off</span>}
          {product.isNew && <span className="rounded-full bg-ink/85 px-2.5 py-1 text-xs font-semibold text-bone">New</span>}
          {soldOut && <span className="rounded-full bg-bone px-2.5 py-1 text-xs font-semibold text-ink">Sold out</span>}
        </div>

        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={saved ? 'Remove from saved items' : 'Save item'}
          aria-pressed={saved}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink/70 text-bone backdrop-blur transition hover:bg-ink"
        >
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} className={saved ? 'text-sale' : ''} />
        </button>

        <button
          onClick={quickAdd}
          disabled={soldOut}
          className="btn btn-primary btn-sm absolute inset-x-3 bottom-3 translate-y-0 shadow-lg transition duration-300 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
        >
          <ShoppingBag size={14} />
          {soldOut ? 'Sold out' : needsChoice ? 'Choose size' : 'Add to cart'}
        </button>
      </div>

      <div className="mt-3 px-1">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/product/${product.slug}`} className="font-medium leading-snug transition hover:text-accent">
            {product.name}
          </Link>
          <Price price={product.price} compareAt={product.compareAtPrice} />
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted">
          <Stars rating={product.rating} size={12} />
          <span>({product.reviews})</span>
          {product.colors && product.colors.length > 1 && (
            <span className="ml-auto flex items-center gap-1" aria-label={`${product.colors.length} colours`}>
              {product.colors.map((c) => (
                <span key={c.name} title={c.name} className="h-3 w-3 rounded-full border border-bone/20" style={{ background: c.hex }} />
              ))}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[4/5] rounded-2xl" />
      <div className="skeleton mt-3 h-4 w-3/4 rounded" />
      <div className="skeleton mt-2 h-3 w-1/3 rounded" />
    </div>
  )
}
