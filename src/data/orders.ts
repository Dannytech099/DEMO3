import type { Order, OrderStatus, PaymentStatus } from '../types'
import { products } from './products'

/** ILLUSTRATIVE DATA ONLY. These orders and figures are made up for the demo dashboard. */
const price = (id: string) => products.find((p) => p.id === id)?.price ?? 0
const day = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()

type Row = [string, string, string, number, [string, number][], OrderStatus, PaymentStatus]

const rows: Row[] = [
  ['Adaeze Okafor', 'Lagos', 'adaeze@example.com', 0, [['p01', 1], ['p03', 1]], 'Pending', 'Unpaid'],
  ['Ibrahim Musa', 'Abuja', 'ibrahim@example.com', 0, [['p10', 1]], 'Processing', 'Paid'],
  ['Ngozi Eze', 'Enugu', 'ngozi@example.com', 1, [['p16', 2]], 'Processing', 'Paid'],
  ['Tunde Bakare', 'Lagos', 'tunde@example.com', 1, [['p05', 1], ['p20', 2]], 'Shipped', 'Paid'],
  ['Halima Yusuf', 'Kano', 'halima@example.com', 2, [['p02', 1]], 'Shipped', 'Paid'],
  ['Chidi Nwosu', 'Port Harcourt', 'chidi@example.com', 3, [['p11', 1], ['p13', 1]], 'Delivered', 'Paid'],
  ['Bisi Adeyemi', 'Ibadan', 'bisi@example.com', 3, [['p19', 2]], 'Delivered', 'Paid'],
  ['Kelechi Obi', 'Lagos', 'kelechi@example.com', 4, [['p07', 1]], 'Cancelled', 'Refunded'],
  ['Funmi Ajayi', 'Abeokuta', 'funmi@example.com', 5, [['p17', 1], ['p20', 1]], 'Delivered', 'Paid'],
  ['Segun Alade', 'Lagos', 'segun@example.com', 6, [['p04', 1]], 'Delivered', 'Paid'],
  ['Amina Bello', 'Kaduna', 'amina@example.com', 7, [['p14', 1]], 'Delivered', 'Paid'],
  ['Obinna Chukwu', 'Owerri', 'obinna@example.com', 8, [['p09', 1], ['p06', 1]], 'Delivered', 'Paid'],
  ['Yetunde Cole', 'Lagos', 'yetunde@example.com', 9, [['p12', 1]], 'Delivered', 'Paid'],
  ['Musa Danjuma', 'Abuja', 'musa@example.com', 10, [['p18', 1], ['p15', 1]], 'Delivered', 'Paid'],
  ['Ifeoma Nnadi', 'Benin City', 'ifeoma@example.com', 11, [['p08', 2]], 'Cancelled', 'Refunded'],
  ['Dayo Ogunleye', 'Ilorin', 'dayo@example.com', 12, [['p03', 2], ['p21', 1]], 'Delivered', 'Paid'],
]

export const initialOrders: Order[] = rows.map(([customer, city, email, ago, items, status, payment], i) => ({
  id: `#HD-${1048 - i}`,
  customer,
  email,
  city,
  date: day(ago),
  items: items.map(([productId, quantity]) => ({ productId, quantity })),
  total: items.reduce((sum, [id, q]) => sum + price(id) * q, 0),
  status,
  payment,
}))

/** 30 days of illustrative revenue, oldest first. Deterministic so the chart is stable. */
export const dailyRevenue: { label: string; value: number }[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.now() - (29 - i) * 86_400_000)
  const base = 260000 + Math.sin(i / 2.3) * 70000 + (i % 7 === 5 ? 120000 : 0) + i * 4500
  return {
    label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    value: Math.round(base / 1000) * 1000,
  }
})
