import type { Category, Product, ArtKind } from '../types'

/**
 * PRODUCT DATA: swap this file (or load it from an API later) to change the catalogue.
 * `images` accepts real photo URLs/paths. 'art:0'..'art:3' render the built-in generated artwork.
 */
export const categories: Category[] = ['Bags', 'Footwear', 'Watches', 'Eyewear', 'Fragrance', 'Home']

export const categoryArt: Record<Category, ArtKind> = {
  Bags: 'bag',
  Footwear: 'shoe',
  Watches: 'watch',
  Eyewear: 'eyewear',
  Fragrance: 'fragrance',
  Home: 'candle',
}

export const categoryBlurb: Record<Category, string> = {
  Bags: 'Full-grain leather, built to wear in',
  Footwear: 'Clean sneakers for long days',
  Watches: 'Automatic and quartz movements',
  Eyewear: 'Acetate frames, UV400 lenses',
  Fragrance: 'Small-batch scents, 30 to 100ml',
  Home: 'Candles and ceramics for the table',
}

const views = ['art:0', 'art:1', 'art:2', 'art:3']

type Seed = Omit<Product, 'images' | 'active' | 'sku'> & { images?: string[] }

const make = (seeds: Seed[]): Product[] =>
  seeds.map((s, i) => ({ images: views, active: true, sku: `HD-${1001 + i}`, ...s }))

export const products: Product[] = make([
  {
    id: 'p01', slug: 'ayo-leather-tote', name: 'Ayo Leather Tote', category: 'Bags',
    price: 148000, art: 'bag', tone: 'sand', artColor: '#9A5B34',
    description: 'A structured everyday tote in vegetable-tanned leather with a suede-lined interior. Fits a 14-inch laptop, a water bottle and everything else.',
    details: ['Full-grain vegetable-tanned leather', '38 x 30 x 14 cm, 1.1 kg', 'Interior zip pocket and key leash', 'Wipe with a damp cloth, condition twice a year'],
    colors: [{ name: 'Cognac', hex: '#9A5B34' }, { name: 'Black', hex: '#232323' }, { name: 'Sage', hex: '#7F8F78' }],
    rating: 4.9, reviews: 312, popularity: 98, stock: 14, createdAt: '2026-05-10',
  },
  {
    id: 'p02', slug: 'sade-crossbody', name: 'Sade Crossbody', category: 'Bags',
    price: 96000, compareAtPrice: 120000, art: 'bag', tone: 'clay', artColor: '#B98A5E',
    description: 'A compact crossbody with a magnetic flap and an adjustable strap. Light enough to forget you are carrying it.',
    details: ['Italian calf leather', '24 x 17 x 8 cm, 480 g', 'Adjustable strap, 60 to 120 cm', 'Brass hardware'],
    colors: [{ name: 'Tan', hex: '#B98A5E' }, { name: 'Forest', hex: '#2F4A3D' }, { name: 'Plum', hex: '#5B3A4A' }],
    rating: 4.7, reviews: 188, popularity: 84, stock: 22, createdAt: '2026-06-02',
  },
  {
    id: 'p03', slug: 'kemi-card-holder', name: 'Kemi Card Holder', category: 'Bags',
    price: 28500, art: 'wallet', tone: 'stone', artColor: '#6B2A2A',
    description: 'Slim enough for a front pocket, with four card slots and a centre pocket for folded notes.',
    details: ['Saffiano leather', '10 x 7.5 cm', 'Four card slots, one note pocket', 'Hand-stitched edges'],
    colors: [{ name: 'Oxblood', hex: '#6B2A2A' }, { name: 'Black', hex: '#232323' }, { name: 'Tan', hex: '#B98A5E' }],
    rating: 4.8, reviews: 421, popularity: 92, stock: 60, createdAt: '2026-03-18',
  },
  {
    id: 'p04', slug: 'tunde-weekender', name: 'Tunde Weekender', category: 'Bags',
    price: 210000, art: 'bag', tone: 'deep', artColor: '#C9A25D',
    description: 'Two nights, one bag. Waxed canvas body with leather trims, a padded shoulder strap and a shoe compartment.',
    details: ['Waxed cotton canvas, leather trims', '52 x 28 x 24 cm, 1.6 kg', 'Separate shoe compartment', 'Fits airline cabin limits'],
    colors: [{ name: 'Brass', hex: '#C9A25D' }, { name: 'Olive', hex: '#5E6B45' }],
    rating: 4.8, reviews: 96, popularity: 71, stock: 8, createdAt: '2026-09-14', isNew: true,
  },
  {
    id: 'p05', slug: 'lagos-court-sneaker', name: 'Lagos Court Sneaker', category: 'Footwear',
    price: 78000, art: 'shoe', tone: 'clay', artColor: '#F2EFE8',
    description: 'A clean court sneaker in smooth leather with a cushioned insole and a stitched rubber sole.',
    details: ['Smooth leather upper', 'Cushioned insole, rubber cupsole', 'True to size, order your usual', 'Wipe clean'],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'White', hex: '#F2EFE8' }, { name: 'Black', hex: '#232323' }, { name: 'Sand', hex: '#CDB892' }],
    rating: 4.8, reviews: 540, popularity: 96, stock: 40, createdAt: '2026-02-20',
  },
  {
    id: 'p06', slug: 'marina-runner', name: 'Marina Runner', category: 'Footwear',
    price: 92000, art: 'shoe', tone: 'sage', artColor: '#7C9A8B',
    description: 'A lightweight runner for the commute and the weekend, with a breathable knit upper and a responsive foam sole.',
    details: ['Recycled knit upper', 'Foam midsole, 280 g per shoe', 'Reflective heel tab', 'Machine washable insole'],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'Seafoam', hex: '#7C9A8B' }, { name: 'Slate', hex: '#4B5B66' }, { name: 'Clay', hex: '#C58F6E' }],
    rating: 4.6, reviews: 207, popularity: 80, stock: 33, createdAt: '2026-07-01',
  },
  {
    id: 'p07', slug: 'ikoyi-leather-sneaker', name: 'Ikoyi Leather Sneaker', category: 'Footwear',
    price: 110000, art: 'shoe', tone: 'blush', artColor: '#D9C7B0',
    description: 'Our dressiest sneaker. Burnished calf leather, tonal laces and a hand-finished sole you can wear to the office.',
    details: ['Burnished calf leather', 'Leather-lined', 'Made in Portugal', 'Resoleable'],
    sizes: ['40', '41', '42', '43', '44', '45', '46'],
    colors: [{ name: 'Oat', hex: '#D9C7B0' }, { name: 'Espresso', hex: '#4A3426' }],
    rating: 4.9, reviews: 143, popularity: 77, stock: 18, createdAt: '2026-09-28', isNew: true,
  },
  {
    id: 'p08', slug: 'surulere-canvas-low', name: 'Surulere Canvas Low', category: 'Footwear',
    price: 54000, compareAtPrice: 68000, art: 'shoe', tone: 'stone', artColor: '#3C5A4E',
    description: 'An easy canvas low-top with a vulcanised sole. Gets better with every wash.',
    details: ['Organic cotton canvas', 'Vulcanised rubber sole', 'Padded collar', 'Machine washable at 30 degrees'],
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: [{ name: 'Pine', hex: '#3C5A4E' }, { name: 'Ecru', hex: '#E8E0CF' }],
    rating: 4.5, reviews: 266, popularity: 68, stock: 52, createdAt: '2026-01-15',
  },
  {
    id: 'p09', slug: 'eko-trainer', name: 'Eko Trainer', category: 'Footwear',
    price: 84000, art: 'shoe', tone: 'clay', artColor: '#C58F6E',
    description: 'A retro trainer with suede overlays and a gum sole. Comfortable from the first wear.',
    details: ['Suede and mesh upper', 'Gum rubber outsole', 'Cushioned heel', 'Spot clean only'],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'Terracotta', hex: '#C58F6E' }, { name: 'Grey', hex: '#8E9599' }],
    rating: 4.7, reviews: 118, popularity: 73, stock: 27, createdAt: '2026-08-12', isNew: true,
  },
  {
    id: 'p10', slug: 'meridian-automatic', name: 'Meridian Automatic', category: 'Watches',
    price: 385000, art: 'watch', tone: 'deep', artColor: '#B8BEC2',
    description: 'A 40mm automatic with a sapphire crystal and a 42-hour power reserve. A watch to hand down.',
    details: ['40mm stainless steel case', 'Automatic movement, 42h reserve', 'Sapphire crystal, 50m water resistant', 'Italian leather strap'],
    colors: [{ name: 'Steel', hex: '#B8BEC2' }, { name: 'Gold', hex: '#C9A25D' }, { name: 'Black', hex: '#2A3135' }],
    rating: 4.9, reviews: 74, popularity: 88, stock: 6, createdAt: '2026-04-09',
  },
  {
    id: 'p11', slug: 'orbit-minimal', name: 'Orbit Minimal', category: 'Watches',
    price: 165000, art: 'watch', tone: 'mist', artColor: '#2A3135',
    description: 'A slim 36mm quartz watch with a plain dial and a mesh or leather strap. Goes with everything.',
    details: ['36mm brushed steel case', 'Japanese quartz movement', 'Mineral crystal, 30m water resistant', '2-year warranty'],
    colors: [{ name: 'Black', hex: '#2A3135' }, { name: 'Steel', hex: '#B8BEC2' }],
    rating: 4.6, reviews: 159, popularity: 79, stock: 21, createdAt: '2026-06-22',
  },
  {
    id: 'p12', slug: 'field-chronograph', name: 'Field Chronograph', category: 'Watches',
    price: 245000, compareAtPrice: 290000, art: 'watch', tone: 'sand', artColor: '#C9A25D',
    description: 'A sporty chronograph with a tachymeter bezel and a 100m water rating.',
    details: ['42mm steel case, gold-tone finish', 'Quartz chronograph', '100m water resistant', 'Screw-down crown'],
    colors: [{ name: 'Gold', hex: '#C9A25D' }, { name: 'Steel', hex: '#B8BEC2' }],
    rating: 4.7, reviews: 88, popularity: 66, stock: 12, createdAt: '2026-03-30',
  },
  {
    id: 'p13', slug: 'aster-round', name: 'Aster Round', category: 'Eyewear',
    price: 62000, art: 'eyewear', tone: 'blush', artColor: '#3B2A22',
    description: 'Round acetate frames with a keyhole bridge. Polarised UV400 lenses.',
    details: ['Italian acetate', 'Polarised UV400 lenses', 'Lens width 49 mm', 'Hard case and cloth included'],
    colors: [{ name: 'Tortoise', hex: '#6B4A32' }, { name: 'Black', hex: '#1E1E1E' }, { name: 'Olive', hex: '#4C5A3F' }],
    rating: 4.7, reviews: 202, popularity: 75, stock: 35, createdAt: '2026-05-25',
  },
  {
    id: 'p14', slug: 'lekki-aviator', name: 'Lekki Aviator', category: 'Eyewear',
    price: 74000, compareAtPrice: 88000, art: 'eyewear', tone: 'sage', artColor: '#C9A25D',
    description: 'A lightweight metal aviator with adjustable nose pads and gradient lenses.',
    details: ['Titanium-blend frame, 19 g', 'Gradient UV400 lenses', 'Adjustable nose pads', 'Hard case included'],
    colors: [{ name: 'Gold', hex: '#C9A25D' }, { name: 'Gunmetal', hex: '#4B5358' }],
    rating: 4.6, reviews: 131, popularity: 70, stock: 29, createdAt: '2026-04-28',
  },
  {
    id: 'p15', slug: 'wren-square', name: 'Wren Square', category: 'Eyewear',
    price: 58000, art: 'eyewear', tone: 'mist', artColor: '#1E1E1E',
    description: 'Soft-square frames in a bold acetate. Sits comfortably all day.',
    details: ['Bio-acetate frame', 'UV400 lenses', 'Spring hinges', 'Hard case and cloth included'],
    colors: [{ name: 'Black', hex: '#1E1E1E' }, { name: 'Smoke', hex: '#6E7377' }],
    rating: 4.5, reviews: 64, popularity: 58, stock: 40, createdAt: '2026-10-01', isNew: true,
  },
  {
    id: 'p16', slug: 'oud-noir-50ml', name: 'Oud Noir', category: 'Fragrance',
    price: 98000, art: 'fragrance', tone: 'deep', artColor: '#8A4B2B',
    description: 'Smoked oud, black pepper and warm amber. Strong, lasting and worn by everyone.',
    details: ['Eau de parfum', 'Top: pepper, saffron. Base: oud, amber', 'Lasts 8 to 10 hours', 'Refillable bottle'],
    sizes: ['30ml', '50ml', '100ml'],
    rating: 4.9, reviews: 355, popularity: 94, stock: 31, createdAt: '2026-02-05',
  },
  {
    id: 'p17', slug: 'neroli-dusk-50ml', name: 'Neroli Dusk', category: 'Fragrance',
    price: 86000, art: 'fragrance', tone: 'sand', artColor: '#D8B968',
    description: 'Orange blossom, bergamot and white musk. A bright scent for evenings that start early.',
    details: ['Eau de parfum', 'Top: bergamot, neroli. Base: white musk', 'Lasts 6 to 8 hours', 'Refillable bottle'],
    sizes: ['30ml', '50ml', '100ml'],
    rating: 4.7, reviews: 176, popularity: 82, stock: 26, createdAt: '2026-07-19',
  },
  {
    id: 'p18', slug: 'vetiver-rain-100ml', name: 'Vetiver Rain', category: 'Fragrance',
    price: 124000, art: 'fragrance', tone: 'sage', artColor: '#6E8F6A',
    description: 'Vetiver, green tea and wet stone. Cool, clean and quiet.',
    details: ['Eau de parfum', 'Top: green tea. Base: vetiver, cedar', 'Lasts 6 to 8 hours', 'Refillable bottle'],
    sizes: ['30ml', '50ml', '100ml'],
    rating: 4.8, reviews: 91, popularity: 69, stock: 15, createdAt: '2026-09-20', isNew: true,
  },
  {
    id: 'p19', slug: 'ridge-vase', name: 'Ridge Vase', category: 'Home',
    price: 38000, art: 'vase', tone: 'blush', artColor: '#B8826A',
    description: 'A hand-thrown stoneware vase with a ribbed finish. Holds a single stem or a full bunch.',
    details: ['Hand-thrown stoneware', '28 cm tall, 14 cm wide', 'Glazed inside, holds water', 'Each piece varies slightly'],
    colors: [{ name: 'Clay', hex: '#B8826A' }, { name: 'Bone', hex: '#E4DCCB' }, { name: 'Moss', hex: '#6F7F5E' }],
    rating: 4.8, reviews: 112, popularity: 72, stock: 19, createdAt: '2026-08-30', isNew: true,
  },
  {
    id: 'p20', slug: 'cedar-fig-candle', name: 'Cedar & Fig Candle', category: 'Home',
    price: 24500, art: 'candle', tone: 'sand', artColor: '#4E6B58',
    description: 'A hand-poured soy wax candle in a reusable ceramic jar. Burns for 45 hours.',
    details: ['Soy wax, cotton wick', '300 g, 45 hour burn time', 'Reusable ceramic jar', 'Notes: cedar, fig leaf, vanilla'],
    colors: [{ name: 'Pine', hex: '#4E6B58' }, { name: 'Ash', hex: '#8E9599' }],
    rating: 4.9, reviews: 498, popularity: 90, stock: 74, createdAt: '2026-01-22',
  },
  {
    id: 'p21', slug: 'terra-bud-vase', name: 'Terra Bud Vase', category: 'Home',
    price: 22000, compareAtPrice: 28000, art: 'vase', tone: 'mist', artColor: '#C58F6E',
    description: 'A small terracotta bud vase for a single stem. Looks good on a shelf, empty or full.',
    details: ['Glazed terracotta', '16 cm tall', 'Water-tight', 'Each piece varies slightly'],
    colors: [{ name: 'Terracotta', hex: '#C58F6E' }, { name: 'Sage', hex: '#8FA38A' }],
    rating: 4.6, reviews: 57, popularity: 55, stock: 3, createdAt: '2026-06-12',
  },
])
