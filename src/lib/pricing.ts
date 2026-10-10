import { brand } from '../config/brand'

export type DeliveryMethod = 'standard' | 'express'

export function computeTotals(subtotal: number, discount: number, method: DeliveryMethod = 'standard') {
  const after = subtotal - discount
  let shipping = 0
  if (subtotal > 0) {
    if (method === 'express') shipping = brand.expressFee
    else shipping = after >= brand.freeShippingThreshold ? 0 : brand.shippingFee
  }
  return { subtotal, discount, shipping, total: after + shipping }
}
