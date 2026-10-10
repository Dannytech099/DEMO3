export type Category = 'Bags' | 'Footwear' | 'Watches' | 'Eyewear' | 'Fragrance' | 'Home'
export type ArtKind = 'bag' | 'wallet' | 'shoe' | 'watch' | 'eyewear' | 'fragrance' | 'candle' | 'vase'
export type Tone = 'sand' | 'clay' | 'sage' | 'mist' | 'blush' | 'stone' | 'deep'

export interface ColorOption {
  name: string
  hex: string
}

export interface Product {
  id: string
  slug: string
  sku: string
  name: string
  category: Category
  price: number
  compareAtPrice?: number
  description: string
  details: string[]
  /** Image sources. Use 'art:0'..'art:3' for generated artwork, or real URLs like '/products/tote-1.jpg'. */
  images: string[]
  art: ArtKind
  tone: Tone
  artColor: string
  colors?: ColorOption[]
  sizes?: string[]
  rating: number
  reviews: number
  popularity: number
  stock: number
  createdAt: string
  isNew?: boolean
  active: boolean
}

export interface CartLine {
  id: string
  productId: string
  quantity: number
  color?: string
  size?: string
}

export interface ResolvedLine extends CartLine {
  product: Product
  unitPrice: number
  lineTotal: number
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Refunded'

export interface Order {
  id: string
  customer: string
  email: string
  city: string
  date: string
  items: { productId: string; quantity: number }[]
  total: number
  status: OrderStatus
  payment: PaymentStatus
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  city: string
  productSlug: string
}

export interface PlacedOrder {
  ref: string
  name: string
  email: string
  city: string
  delivery: 'standard' | 'express'
  lines: ResolvedLine[]
  subtotal: number
  discount: number
  shipping: number
  total: number
}
