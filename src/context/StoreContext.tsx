import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { CartLine, PlacedOrder, ResolvedLine } from '../types'
import { brand } from '../config/brand'
import { promoCodes } from '../data/storefront'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useCatalog } from './CatalogContext'
import { useToast } from './ToastContext'

interface Variant { color?: string; size?: string }

interface Ctx {
  lines: ResolvedLine[]
  count: number
  subtotal: number
  discount: number
  promo: string | null
  applyPromo: (code: string) => boolean
  clearPromo: () => void
  addItem: (productId: string, quantity?: number, variant?: Variant) => void
  updateQty: (lineId: string, quantity: number) => void
  removeItem: (lineId: string) => void
  clearCart: () => void
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  lastOrder: PlacedOrder | null
  setLastOrder: (o: PlacedOrder | null) => void
}

const StoreCtx = createContext<Ctx | null>(null)
const MAX_QTY = 10

export function StoreProvider({ children }: { children: ReactNode }) {
  const { products } = useCatalog()
  const { toast } = useToast()
  const [raw, setRaw] = useLocalStorage<CartLine[]>(`${brand.storagePrefix}-cart`, [])
  const [promo, setPromo] = useLocalStorage<string | null>(`${brand.storagePrefix}-promo`, null)
  const [wishlist, setWishlist] = useLocalStorage<string[]>(`${brand.storagePrefix}-wishlist`, [])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null)

  const lines = useMemo<ResolvedLine[]>(
    () =>
      raw.flatMap((l) => {
        const product = products.find((p) => p.id === l.productId)
        return product ? [{ ...l, product, unitPrice: product.price, lineTotal: product.price * l.quantity }] : []
      }),
    [raw, products],
  )

  const count = lines.reduce((n, l) => n + l.quantity, 0)
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0)
  const discount = promo && promoCodes[promo] ? Math.round(subtotal * promoCodes[promo]) : 0

  const addItem = useCallback(
    (productId: string, quantity = 1, variant: Variant = {}) => {
      const product = products.find((p) => p.id === productId)
      if (!product || product.stock <= 0) {
        toast('That item is sold out', 'error')
        return
      }
      const id = [productId, variant.color ?? '', variant.size ?? ''].join('|')
      const cap = Math.min(MAX_QTY, product.stock)
      setRaw((prev) => {
        const existing = prev.find((l) => l.id === id)
        if (existing) return prev.map((l) => (l.id === id ? { ...l, quantity: Math.min(cap, l.quantity + quantity) } : l))
        return [...prev, { id, productId, quantity: Math.min(cap, quantity), ...variant }]
      })
      toast(`${product.name} added to your cart`)
    },
    [products, setRaw, toast],
  )

  const updateQty = useCallback(
    (lineId: string, quantity: number) => {
      setRaw((prev) =>
        prev.map((l) => {
          if (l.id !== lineId) return l
          const stock = products.find((p) => p.id === l.productId)?.stock ?? MAX_QTY
          return { ...l, quantity: Math.max(1, Math.min(quantity, MAX_QTY, stock)) }
        }),
      )
    },
    [products, setRaw],
  )

  const removeItem = useCallback(
    (lineId: string) => {
      setRaw((prev) => prev.filter((l) => l.id !== lineId))
      toast('Item removed from your cart', 'info')
    },
    [setRaw, toast],
  )

  const clearCart = useCallback(() => {
    setRaw([])
    setPromo(null)
  }, [setRaw, setPromo])

  const applyPromo = useCallback(
    (code: string) => {
      const key = code.trim().toUpperCase()
      if (promoCodes[key]) {
        setPromo(key)
        toast(`Code ${key} applied`)
        return true
      }
      return false
    },
    [setPromo, toast],
  )

  const clearPromo = useCallback(() => setPromo(null), [setPromo])

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const has = prev.includes(productId)
        toast(has ? 'Removed from saved items' : 'Saved for later', has ? 'info' : 'success')
        return has ? prev.filter((id) => id !== productId) : [...prev, productId]
      })
    },
    [setWishlist, toast],
  )

  const value = useMemo<Ctx>(
    () => ({
      lines, count, subtotal, discount, promo, applyPromo, clearPromo, addItem, updateQty, removeItem, clearCart,
      wishlist, toggleWishlist, drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      lastOrder, setLastOrder,
    }),
    [lines, count, subtotal, discount, promo, applyPromo, clearPromo, addItem, updateQty, removeItem, clearCart, wishlist, toggleWishlist, drawerOpen, lastOrder],
  )
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
