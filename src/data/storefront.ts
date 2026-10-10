import type { Testimonial } from '../types'

/** Products shown in the hero collage (matched by slug). */
export const heroSlugs = ['ayo-leather-tote', 'meridian-automatic', 'lagos-court-sneaker']

/** Sample reviews. Replace with the prospect's real customer feedback before any live use. */
export const testimonials: Testimonial[] = [
  { id: 't1', name: 'Chioma A.', city: 'Lagos', productSlug: 'ayo-leather-tote',
    quote: 'I use the tote every single day and it already looks better than when it arrived. The leather has softened and picked up a lovely colour.' },
  { id: 't2', name: 'Emeka O.', city: 'Abuja', productSlug: 'lagos-court-sneaker',
    quote: 'Ordered on Monday, delivered on Wednesday. The sneakers fit true to size and I have had more compliments in a week than in a year.' },
  { id: 't3', name: 'Folake B.', city: 'Ibadan', productSlug: 'oud-noir-50ml',
    quote: 'The scent lasts all day and the bottle is beautiful enough to leave on display. I have already bought a second one as a gift.' },
  { id: 't4', name: 'Tobi A.', city: 'Port Harcourt', productSlug: 'meridian-automatic',
    quote: 'Looks like a watch three times the price. Packaging was excellent and support answered my sizing question within minutes.' },
  { id: 't5', name: 'Zainab M.', city: 'Kano', productSlug: 'cedar-fig-candle',
    quote: 'The candle fills the whole room without being heavy. I keep the jar for my pens when it is finished.' },
]

export const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta',
  'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

export const promoCodes: Record<string, number> = { WELCOME10: 0.1 }
