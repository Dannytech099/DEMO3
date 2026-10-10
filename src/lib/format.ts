import { brand } from '../config/brand'

const fmt = new Intl.NumberFormat(brand.currency.locale, {
  style: 'currency',
  currency: brand.currency.code,
  maximumFractionDigits: 0,
})

export const formatPrice = (n: number) => fmt.format(n)

export const discountPercent = (price: number, compareAt?: number) =>
  compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
