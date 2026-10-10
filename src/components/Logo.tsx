import { brand } from '../config/brand'

export function Logo() {
  if (brand.logoUrl) return <img src={brand.logoUrl} alt={brand.name} className="h-8 w-auto" />
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-accent font-display text-xl leading-none text-accent-ink">
        {brand.name.charAt(0)}
      </span>
      <span className="font-display text-3xl leading-none tracking-tight">{brand.name}</span>
    </span>
  )
}
