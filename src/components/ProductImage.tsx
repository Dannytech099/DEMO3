import { useState } from 'react'
import type { Product } from '../types'
import { ProductArt } from './ProductArt'

interface Props {
  product: Product
  index?: number
  /** Hex colour of the selected variant, tints the generated artwork. */
  colorHex?: string
  className?: string
}

/**
 * Renders a product image. Handles three cases:
 * 1. 'art:N' sources use the generated artwork,
 * 2. real URLs render as <img>,
 * 3. a failed real image falls back to the artwork, so nothing is ever broken.
 */
export function ProductImage({ product, index = 0, colorHex, className = 'h-full w-full' }: Props) {
  const [failed, setFailed] = useState<string | null>(null)
  const src = product.images[index] ?? product.images[0] ?? 'art:0'
  const color = colorHex ?? product.colors?.[0]?.hex ?? product.artColor

  if (src.startsWith('art:') || failed === src) {
    const view = src.startsWith('art:') ? Number(src.slice(4)) || 0 : index
    return <ProductArt kind={product.art} tone={product.tone} color={color} view={view} className={className} label={product.name} />
  }
  return (
    <img
      src={src}
      alt={product.name}
      loading="lazy"
      onError={() => setFailed(src)}
      className={`${className} object-cover`}
    />
  )
}
