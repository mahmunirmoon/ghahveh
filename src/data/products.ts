export type Category = "Single Origin" | "Blend" | "Espresso" | "Decaf";

export interface Product {
  id: string;
  name: string;
  origin: string;
  category: Category;
  process: string;
  altitude: string;
  varietal: string;
  producer: string;
  roast: 1 | 2 | 3 | 4 | 5;
  roastName: string;
  notes: string[];
  price: number; // per 250g
  rating: number;
  reviews: number;
  badge?: { label: string; tone: "ember" | "cherry" | "leaf" };
  img: string;
  desc: string;
  brew: string;
  stock: "in" | "low";
}

export const PRODUCTS: Product[] = [
  {
    id: "ethiopia-guji",
    name: "Ethiopia Guji Highlands",
    origin: "Guji Zone, Ethiopia",
    category: "Single Origin",
    process: "Washed",
    altitude: "1,950–2,100 masl",
    varietal: "Heirloom 74110",
    producer: "Dimtu Tero smallholders",
    roast: 2,
    roastName: "Light",
    notes: ["Bergamot", "Jasmine", "Apricot"],
    price: 19.5,
    rating: 4.9,
    reviews: 214,
    badge: { label: "Fresh crop", tone: "leaf" },
    img: "https://image.qwenlm.ai/generated-images/0010b6ed-f356-4651-a527-0111dbcebc58/_result.png",
    desc: "A luminous washed heirloom from the Guji highlands. Florals hit first — jasmine and bergamot — before a soft apricot sweetness carries the finish. We roast it gently to keep the cup tea-like and sparkling.",
    brew: "V60 · 1:16 · 94°C · 2:45",
    stock: "in",
  },
  {
    id: "colombia-huila",
    name: "Colombia Finca La Cima",
    origin: "Huila, Colombia",
    category: "Single Origin",
    process: "Honey",
    altitude: "1,750 masl",
    varietal: "Pink Bourbon",
    producer: "Familia Rojas",
    roast: 3,
    roastName: "Medium",
    notes: ["Panela", "Red apple", "Cacao nib"],
    price: 17.0,
    rating: 4.8,
    reviews: 187,
    img: "https://image.qwenlm.ai/generated-images/e01d8f91-0ada-4ab2-9e53-b398933c844a/_result.png",
    desc: "Pink Bourbon from the Rojas family, rested through a red-honey process that wraps every sip in raw-sugar sweetness. Balanced and comforting — red apple brightness over a panela and cacao base.",
    brew: "Batch brew · 1:15 · 93°C · 4:00",
    stock: "in",
  },
  {
    id: "sumatra-mandheling",
    name: "Sumatra Mandheling",
    origin: "North Sumatra, Indonesia",
    category: "Single Origin",
    process: "Wet-hulled",
    altitude: "1,400–1,600 masl",
    varietal: "Ateng, Jember",
    producer: "Lintong co-operative",
    roast: 5,
    roastName: "Dark",
    notes: ["Cedar", "Molasses", "Dark chocolate"],
    price: 18.25,
    rating: 4.6,
    reviews: 158,
    badge: { label: "Cup of the week", tone: "cherry" },
    img: "https://image.qwenlm.ai/generated-images/33413b83-ca41-4998-8f1c-247392c65f02/_result.png",
    desc: "Deep, syrupy and unapologetically earthy. The wet-hulled process gives it that classic Mandheling weight — cedar and molasses with a long dark-chocolate finish. Built for milk, glorious black.",
    brew: "French press · 1:14 · 96°C · 4:00",
    stock: "in",
  },
  {
    id: "ember-blend",
    name: "Ember Blend No. 4",
    origin: "Brazil + Guatemala",
    category: "Blend",
    process: "Natural + Washed",
    altitude: "1,200–1,800 masl",
    varietal: "Mundo Novo, Caturra",
    producer: "Two-farm partnership",
    roast: 4,
    roastName: "Medium-dark",
    notes: ["Caramel", "Hazelnut", "Brown sugar"],
    price: 15.5,
    rating: 4.7,
    reviews: 342,
    img: "https://image.qwenlm.ai/generated-images/c5048cee-97a4-4b04-8921-f3315d599f08/_result.png",
    desc: "Our flagship house blend, tuned for the morning ritual. A natural Brazilian base brings hazelnut and brown-sugar body; a washed Guatemalan lifts it with soft caramel. Forgiving on any brewer.",
    brew: "Any brewer · 1:15 · 93°C",
    stock: "in",
  },
  {
    id: "night-shift",
    name: "Night Shift Espresso",
    origin: "Brazil + Ethiopia",
    category: "Espresso",
    process: "Natural + Washed",
    altitude: "1,150–1,900 masl",
    varietal: "Catuaí, Heirloom",
    producer: "Roaster's cut",
    roast: 4,
    roastName: "Medium-dark",
    notes: ["Bittersweet cacao", "Toasted almond", "Orange zest"],
    price: 16.75,
    rating: 4.8,
    reviews: 269,
    badge: { label: "Bar favourite", tone: "ember" },
    img: "https://image.qwenlm.ai/generated-images/3ad3c9cd-d606-42fb-970b-db956f14529a/_result.png",
    desc: "Dialed for the machine. Pulls a syrupy shot of bittersweet cacao and toasted almond, with a flicker of orange zest from the Ethiopian component keeping it alive. Cuts through milk beautifully.",
    brew: "Espresso · 1:2 · 93°C · 27s",
    stock: "low",
  },
  {
    id: "moonlight-decaf",
    name: "Moonlight Decaf",
    origin: "Cauca, Colombia",
    category: "Decaf",
    process: "Sugarcane E.A.",
    altitude: "1,700 masl",
    varietal: "Castillo, Colombia",
    producer: "Smallholder group",
    roast: 3,
    roastName: "Medium",
    notes: ["Honey", "Milk chocolate", "Almond"],
    price: 17.25,
    rating: 4.7,
    reviews: 121,
    img: "https://image.qwenlm.ai/generated-images/139f6130-5a70-479c-8c91-c76d6eccd980/_result.png",
    desc: "A sugarcane-process decaf that tastes like coffee should — none of the flat, papery notes. Honeyed and round, with milk chocolate and almond. Late nights, early starts, no compromises.",
    brew: "V60 or pot · 1:15 · 92°C",
    stock: "in",
  },
];

export const MASTHEAD_IMG =
  "https://image.qwenlm.ai/generated-images/ee8b6cef-59e7-4a40-b932-3e9ef3706ec7/_result.png";

export const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Single Origin",
  "Blend",
  "Espresso",
  "Decaf",
];

export type Weight = 250 | 1000;
export type Grind = "Whole bean" | "Filter" | "Espresso";

export const WEIGHTS: Weight[] = [250, 1000];
export const GRINDS: Grind[] = ["Whole bean", "Filter", "Espresso"];

export function priceFor(base: number, weight: Weight): number {
  return weight === 250 ? base : Math.round(base * 3.4 * 2) / 2;
}

export function money(n: number): string {
  return `$${n.toFixed(2)}`;
}

export interface CartItem {
  key: string;
  id: string;
  weight: Weight;
  grind: Grind;
  qty: number;
}

export const FREE_SHIP_AT = 40;
export const FLAT_SHIP = 5.5;

export function nextRoastDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + ((2 - d.getDay() + 7) % 7 || 7)); // next Tuesday
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
