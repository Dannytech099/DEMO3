import type { OrderStatus, PaymentStatus } from '../../types'

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-amber-500/15 text-amber-300',
  Processing: 'bg-sky-500/15 text-sky-300',
  Shipped: 'bg-violet-500/15 text-violet-300',
  Delivered: 'bg-emerald-500/15 text-emerald-300',
  Cancelled: 'bg-rose-500/15 text-rose-300',
}
const PAY_STYLES: Record<PaymentStatus, string> = {
  Paid: 'text-emerald-300',
  Unpaid: 'text-amber-300',
  Refunded: 'text-rose-300',
}

export const STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>{status}</span>
}

export function PaymentText({ payment }: { payment: PaymentStatus }) {
  return <span className={`text-xs ${PAY_STYLES[payment]}`}>{payment}</span>
}
