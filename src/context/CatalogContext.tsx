import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Product } from '../types'
import { products as seed } from '../data/products'

interface Ctx {
  /** Active products only: what the storefront shows. */
  products: Product[]
  /** Every product including drafts: used by the admin preview. */
  allProducts: Product[]
  updateProduct: (id: string, patch: Partial<Product>) => void
  addProduct: (p: Product) => void
  removeProduct: (id: string) => void
}

const CatalogCtx = createContext<Ctx | null>(null)

/**
 * Holds the catalogue in memory. Replace the initial state with an API call
 * when you move to a real backend; the rest of the UI will not change.
 */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [all, setAll] = useState<Product[]>(seed)

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setAll((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])
  const addProduct = useCallback((p: Product) => setAll((prev) => [p, ...prev]), [])
  const removeProduct = useCallback((id: string) => setAll((prev) => prev.filter((p) => p.id !== id)), [])

  const value = useMemo<Ctx>(
    () => ({ products: all.filter((p) => p.active), allProducts: all, updateProduct, addProduct, removeProduct }),
    [all, updateProduct, addProduct, removeProduct],
  )
  return <CatalogCtx.Provider value={value}>{children}</CatalogCtx.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogCtx)
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider')
  return ctx
}
