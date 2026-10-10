import { useState, type FormEvent } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import type { Category, Product } from '../../types'
import { categories, categoryArt } from '../../data/products'
import { useCatalog } from '../../context/CatalogContext'
import { useToast } from '../../context/ToastContext'
import { formatPrice, slugify } from '../../lib/format'
import { Modal } from '../../components/Overlay'
import { ProductImage } from '../../components/ProductImage'
import { Field } from '../../components/ui'

interface Draft { name: string; category: Category; price: string; compareAt: string; stock: string; description: string }
const blank: Draft = { name: '', category: 'Bags', price: '', compareAt: '', stock: '', description: '' }

const defaultColor: Record<Category, string> = {
  Bags: '#9A5B34', Footwear: '#F2EFE8', Watches: '#B8BEC2', Eyewear: '#1E1E1E', Fragrance: '#8A4B2B', Home: '#4E6B58',
}

export default function Products() {
  const { allProducts, updateProduct, addProduct, removeProduct } = useCatalog()
  const { toast } = useToast()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<Category | 'All'>('All')
  const [editing, setEditing] = useState<Product | 'new' | null>(null)
  const [draft, setDraft] = useState<Draft>(blank)
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({})
  const [deleting, setDeleting] = useState<Product | null>(null)

  const rows = allProducts.filter(
    (p) => (cat === 'All' || p.category === cat) && (!q.trim() || `${p.name} ${p.sku}`.toLowerCase().includes(q.trim().toLowerCase())),
  )

  const openEdit = (p: Product | 'new') => {
    setErrors({})
    setDraft(p === 'new' ? blank : { name: p.name, category: p.category, price: String(p.price), compareAt: p.compareAtPrice ? String(p.compareAtPrice) : '', stock: String(p.stock), description: p.description })
    setEditing(p)
  }

  const save = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    const price = Number(draft.price), stock = Number(draft.stock), compare = draft.compareAt ? Number(draft.compareAt) : undefined
    if (draft.name.trim().length < 3) errs.name = 'Enter a product name'
    if (!Number.isFinite(price) || price <= 0) errs.price = 'Enter a price above 0'
    if (compare !== undefined && (!Number.isFinite(compare) || compare <= price)) errs.compareAt = 'Compare-at price must be higher than the price'
    if (!Number.isInteger(stock) || stock < 0) errs.stock = 'Enter a whole number, 0 or more'
    setErrors(errs)
    if (Object.keys(errs).length) return

    if (editing === 'new') {
      const id = `p${Date.now()}`
      addProduct({
        id, slug: slugify(draft.name) || id, sku: `HD-${1000 + allProducts.length + 1}`, name: draft.name.trim(), category: draft.category,
        price, compareAtPrice: compare, description: draft.description.trim() || 'New product description.', details: ['Add product details here'],
        images: ['art:0', 'art:1', 'art:2', 'art:3'], art: categoryArt[draft.category], tone: 'sand', artColor: defaultColor[draft.category],
        rating: 4.5, reviews: 0, popularity: 50, stock, createdAt: new Date().toISOString().slice(0, 10), isNew: true, active: true,
      })
      toast(`${draft.name.trim()} added to the catalogue`)
    } else if (editing) {
      updateProduct(editing.id, { name: draft.name.trim(), category: draft.category, price, compareAtPrice: compare, stock, description: draft.description.trim() })
      toast(`${draft.name.trim()} updated`)
    }
    setEditing(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or SKU" aria-label="Search products" className="input rounded-full py-2 pl-10" />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value as Category | 'All')} aria-label="Filter by category" className="input w-auto rounded-full py-2">
            <option value="All">All categories</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={() => openEdit('new')} className="btn btn-primary btn-sm py-2.5"><Plus size={15} /> Add product</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="px-5 py-3 font-medium">Product</th><th className="font-medium">Category</th><th className="font-medium">Price</th><th className="font-medium">Stock</th><th className="font-medium">Visible</th><th className="pr-5 text-right font-medium">Actions</th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">No products found.</td></tr>}
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-line/60 last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-10 shrink-0 overflow-hidden rounded-md"><ProductImage product={p} /></div>
                    <div><p className="font-medium">{p.name}</p><p className="text-xs text-muted">{p.sku}</p></div>
                  </div>
                </td>
                <td className="text-muted">{p.category}</td>
                <td>{formatPrice(p.price)}</td>
                <td>
                  <span className="inline-flex items-center gap-2">
                    <button onClick={() => updateProduct(p.id, { stock: Math.max(0, p.stock - 1) })} aria-label={`Decrease stock of ${p.name}`} className="grid h-6 w-6 place-items-center rounded-full border border-line text-muted hover:text-bone">-</button>
                    <span className={`w-8 text-center tabular-nums ${p.stock === 0 ? 'text-sale' : p.stock <= 8 ? 'text-amber-300' : ''}`}>{p.stock}</span>
                    <button onClick={() => updateProduct(p.id, { stock: p.stock + 1 })} aria-label={`Increase stock of ${p.name}`} className="grid h-6 w-6 place-items-center rounded-full border border-line text-muted hover:text-bone">+</button>
                  </span>
                </td>
                <td>
                  <button role="switch" aria-checked={p.active} aria-label={`${p.name} visible in store`}
                    onClick={() => { updateProduct(p.id, { active: !p.active }); toast(`${p.name} ${p.active ? 'hidden from' : 'visible in'} the store`, 'info') }}
                    className={`relative h-6 w-11 rounded-full transition ${p.active ? 'bg-accent' : 'bg-line'}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${p.active ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="pr-5">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(p)} aria-label={`Edit ${p.name}`} className="rounded-full p-2 text-muted transition hover:bg-raised hover:text-bone"><Pencil size={16} /></button>
                    <button onClick={() => setDeleting(p)} aria-label={`Delete ${p.name}`} className="rounded-full p-2 text-muted transition hover:bg-raised hover:text-sale"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">Changes here update the storefront live for this session. They reset when the page is reloaded.</p>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add product' : 'Edit product'}>
        <form onSubmit={save} noValidate className="space-y-4">
          <Field label="Name" error={errors.name}><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={`input ${errors.name ? 'input-error' : ''}`} autoFocus /></Field>
          <Field label="Category"><select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })} className="input">{categories.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (NGN)" error={errors.price}><input inputMode="numeric" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} className={`input ${errors.price ? 'input-error' : ''}`} /></Field>
            <Field label="Compare-at price" error={errors.compareAt} hint="Optional, shows a sale badge"><input inputMode="numeric" value={draft.compareAt} onChange={(e) => setDraft({ ...draft, compareAt: e.target.value })} className={`input ${errors.compareAt ? 'input-error' : ''}`} /></Field>
          </div>
          <Field label="Stock" error={errors.stock}><input inputMode="numeric" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} className={`input ${errors.stock ? 'input-error' : ''}`} /></Field>
          <Field label="Description"><textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="input" /></Field>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditing(null)} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary">{editing === 'new' ? 'Add product' : 'Save changes'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete product?" width="max-w-sm">
        <p className="text-sm text-muted">{deleting?.name} will be removed from the catalogue and the storefront.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setDeleting(null)} className="btn btn-outline">Keep it</button>
          <button onClick={() => { if (deleting) { removeProduct(deleting.id); toast(`${deleting.name} deleted`, 'info') } setDeleting(null) }} className="btn bg-sale text-white hover:brightness-110">Delete product</button>
        </div>
      </Modal>
    </div>
  )
}
