import type { Bi, Lang } from "../i18n";

export type CategoryKey = "single" | "blend" | "espresso" | "decaf";

export interface Product {
  id: string;
  name: Bi;
  origin: Bi;
  category: CategoryKey;
  process: Bi;
  altitude: Bi;
  varietal: Bi;
  producer: Bi;
  roast: 1 | 2 | 3 | 4 | 5;
  roastName: Bi;
  notes: Bi[];
  price: number; // per 250g
  rating: number;
  reviews: number;
  badge?: { label: Bi; tone: "ember" | "cherry" | "leaf" };
  img: string;
  desc: Bi;
  brew: Bi;
  stock: "in" | "low";
}

export const PRODUCTS: Product[] = [
  {
    id: "ethiopia-guji",
    name: { en: "Ethiopia Guji Highlands", fa: "اتیوپی، ارتفاعات گوجی" },
    origin: { en: "Guji Zone, Ethiopia", fa: "منطقهٔ گوجی، اتیوپی" },
    category: "single",
    process: { en: "Washed", fa: "شسته" },
    altitude: { en: "1,950–2,100 masl", fa: "۱٬۹۵۰ تا ۲٬۱۰۰ متر از سطح دریا" },
    varietal: { en: "Heirloom 74110", fa: "ارلوم ۷۴۱۱۰" },
    producer: { en: "Dimtu Tero smallholders", fa: "خرده‌مالکان دیمتو ترو" },
    roast: 2,
    roastName: { en: "Light", fa: "روشن" },
    notes: [
      { en: "Bergamot", fa: "ترنج" },
      { en: "Jasmine", fa: "یاس" },
      { en: "Apricot", fa: "زردآلو" },
    ],
    price: 19.5,
    rating: 4.9,
    reviews: 214,
    badge: { label: { en: "Fresh crop", fa: "بار تازه" }, tone: "leaf" },
    img: "https://image.qwenlm.ai/generated-images/0010b6ed-f356-4651-a527-0111dbcebc58/_result.png",
    desc: {
      en: "A luminous washed heirloom from the Guji highlands. Florals hit first — jasmine and bergamot — before a soft apricot sweetness carries the finish. We roast it gently to keep the cup tea-like and sparkling.",
      fa: "یک ارلومِ شستهٔ درخشان از ارتفاعات گوجی. اول گل‌ها می‌رسند — یاس و ترنج — و بعد شیرینی ملایم زردآلو فینیش را جلو می‌برد. آرام رست می‌کنیم تا فنجان، چای‌مانند و شفاف بماند.",
    },
    brew: { en: "V60 · 1:16 · 94°C · 2:45", fa: "V60 · ۱:۱۶ · ۹۴°C · ۲:۴۵" },
    stock: "in",
  },
  {
    id: "colombia-huila",
    name: { en: "Colombia Finca La Cima", fa: "کلمبیا، فینکا لاسیما" },
    origin: { en: "Huila, Colombia", fa: "هویلا، کلمبیا" },
    category: "single",
    process: { en: "Honey", fa: "هانی" },
    altitude: { en: "1,750 masl", fa: "۱٬۷۵۰ متر از سطح دریا" },
    varietal: { en: "Pink Bourbon", fa: "پینک بوربون" },
    producer: { en: "Familia Rojas", fa: "خانوادهٔ روخاس" },
    roast: 3,
    roastName: { en: "Medium", fa: "متوسط" },
    notes: [
      { en: "Panela", fa: "پانلا" },
      { en: "Red apple", fa: "سیب قرمز" },
      { en: "Cacao nib", fa: "کاکائو نیب" },
    ],
    price: 17.0,
    rating: 4.8,
    reviews: 187,
    img: "https://image.qwenlm.ai/generated-images/e01d8f91-0ada-4ab2-9e53-b398933c844a/_result.png",
    desc: {
      en: "Pink Bourbon from the Rojas family, rested through a red-honey process that wraps every sip in raw-sugar sweetness. Balanced and comforting — red apple brightness over a panela and cacao base.",
      fa: "پینک بوربونِ خانوادهٔ روخاس، با فرآوری رد-هانی که هر جرعه را در شیرینی شکر خام می‌پوشاند. متعادل و دلگرم‌کننده — روشنی سیب قرمز روی پایه‌ای از پانلا و کاکائو.",
    },
    brew: { en: "Batch brew · 1:15 · 93°C · 4:00", fa: "بچ‌برو · ۱:۱۵ · ۹۳°C · ۴:۰۰" },
    stock: "in",
  },
  {
    id: "sumatra-mandheling",
    name: { en: "Sumatra Mandheling", fa: "سوماترا ماندلینگ" },
    origin: { en: "North Sumatra, Indonesia", fa: "سوماترای شمالی، اندونزی" },
    category: "single",
    process: { en: "Wet-hulled", fa: "وت‌هالد" },
    altitude: { en: "1,400–1,600 masl", fa: "۱٬۴۰۰ تا ۱٬۶۰۰ متر از سطح دریا" },
    varietal: { en: "Ateng, Jember", fa: "آتنگ، جمبر" },
    producer: { en: "Lintong co-operative", fa: "تعاونی لینتونگ" },
    roast: 5,
    roastName: { en: "Dark", fa: "تیره" },
    notes: [
      { en: "Cedar", fa: "سدر" },
      { en: "Molasses", fa: "ملاس" },
      { en: "Dark chocolate", fa: "شکلات تلخ" },
    ],
    price: 18.25,
    rating: 4.6,
    reviews: 158,
    badge: { label: { en: "Cup of the week", fa: "فنجان هفته" }, tone: "cherry" },
    img: "https://image.qwenlm.ai/generated-images/33413b83-ca41-4998-8f1c-247392c65f02/_result.png",
    desc: {
      en: "Deep, syrupy and unapologetically earthy. The wet-hulled process gives it that classic Mandheling weight — cedar and molasses with a long dark-chocolate finish. Built for milk, glorious black.",
      fa: "عمیق، شربت‌مانند و بی‌پروا خاکی. فرآوری وت‌هالد همان وزن کلاسیک ماندلینگ را به آن می‌دهد — سدر و ملاس با فینیشی بلند از شکلات تلخ. برای شیر ساخته شده، ولی سیاه‌اش هم باشکوه است.",
    },
    brew: { en: "French press · 1:14 · 96°C · 4:00", fa: "فرنچ‌پرس · ۱:۱۴ · ۹۶°C · ۴:۰۰" },
    stock: "in",
  },
  {
    id: "ember-blend",
    name: { en: "Ember Blend No. 4", fa: "ترکیب امبر شمارهٔ ۴" },
    origin: { en: "Brazil + Guatemala", fa: "برزیل + گواتمالا" },
    category: "blend",
    process: { en: "Natural + Washed", fa: "طبیعی + شسته" },
    altitude: { en: "1,200–1,800 masl", fa: "۱٬۲۰۰ تا ۱٬۸۰۰ متر از سطح دریا" },
    varietal: { en: "Mundo Novo, Caturra", fa: "موندونووو، کاتورا" },
    producer: { en: "Two-farm partnership", fa: "مشارکت دو مزرعه" },
    roast: 4,
    roastName: { en: "Medium-dark", fa: "متوسط رو به تیره" },
    notes: [
      { en: "Caramel", fa: "کارامل" },
      { en: "Hazelnut", fa: "فندق" },
      { en: "Brown sugar", fa: "شکر قهوه‌ای" },
    ],
    price: 15.5,
    rating: 4.7,
    reviews: 342,
    img: "https://image.qwenlm.ai/generated-images/c5048cee-97a4-4b04-8921-f3315d599f08/_result.png",
    desc: {
      en: "Our flagship house blend, tuned for the morning ritual. A natural Brazilian base brings hazelnut and brown-sugar body; a washed Guatemalan lifts it with soft caramel. Forgiving on any brewer.",
      fa: "ترکیب اصلی خانه، کوک‌شده برای آیین صبح. پایهٔ طبیعیِ برزیلی، بدنه‌ای از فندق و شکر قهوه‌ای می‌آورد؛ و گواتمالای شسته با کاراملی نرم بلندش می‌کند. با هر دمی کنار می‌آید.",
    },
    brew: { en: "Any brewer · 1:15 · 93°C", fa: "هر دمی · ۱:۱۵ · ۹۳°C" },
    stock: "in",
  },
  {
    id: "night-shift",
    name: { en: "Night Shift Espresso", fa: "اسپرسوی شیفت شب" },
    origin: { en: "Brazil + Ethiopia", fa: "برزیل + اتیوپی" },
    category: "espresso",
    process: { en: "Natural + Washed", fa: "طبیعی + شسته" },
    altitude: { en: "1,150–1,900 masl", fa: "۱٬۱۵۰ تا ۱٬۹۰۰ متر از سطح دریا" },
    varietal: { en: "Catuaí, Heirloom", fa: "کاتوآیی، ارلوم" },
    producer: { en: "Roaster's cut", fa: "انتخاب رُستر" },
    roast: 4,
    roastName: { en: "Medium-dark", fa: "متوسط رو به تیره" },
    notes: [
      { en: "Bittersweet cacao", fa: "کاکائوی تلخ‌وشیرین" },
      { en: "Toasted almond", fa: "بادام برشته" },
      { en: "Orange zest", fa: "پوست پرتقال" },
    ],
    price: 16.75,
    rating: 4.8,
    reviews: 269,
    badge: { label: { en: "Bar favourite", fa: "محبوبِ بار" }, tone: "ember" },
    img: "https://image.qwenlm.ai/generated-images/3ad3c9cd-d606-42fb-970b-db956f14529a/_result.png",
    desc: {
      en: "Dialed for the machine. Pulls a syrupy shot of bittersweet cacao and toasted almond, with a flicker of orange zest from the Ethiopian component keeping it alive. Cuts through milk beautifully.",
      fa: "برای دستگاه کوک شده. شاتی شربت‌مانند از کاکائوی تلخ‌وشیرین و بادام برشته می‌دهد، با جرقه‌ای از پوست پرتقال که از بخش اتیوپیایی می‌آید و زنده‌اش نگه می‌دارد. از شیر به‌خوبی عبور می‌کند.",
    },
    brew: { en: "Espresso · 1:2 · 93°C · 27s", fa: "اسپرسو · ۱:۲ · ۹۳°C · ۲۷ ثانیه" },
    stock: "low",
  },
  {
    id: "moonlight-decaf",
    name: { en: "Moonlight Decaf", fa: "دیکافِ مهتاب" },
    origin: { en: "Cauca, Colombia", fa: "کاوکا، کلمبیا" },
    category: "decaf",
    process: { en: "Sugarcane E.A.", fa: "اتیل‌استات نیشکر" },
    altitude: { en: "1,700 masl", fa: "۱٬۷۰۰ متر از سطح دریا" },
    varietal: { en: "Castillo, Colombia", fa: "کاستیلو، کلمبیا" },
    producer: { en: "Smallholder group", fa: "گروه خرده‌مالکان" },
    roast: 3,
    roastName: { en: "Medium", fa: "متوسط" },
    notes: [
      { en: "Honey", fa: "عسل" },
      { en: "Milk chocolate", fa: "شکلات شیری" },
      { en: "Almond", fa: "بادام" },
    ],
    price: 17.25,
    rating: 4.7,
    reviews: 121,
    img: "https://image.qwenlm.ai/generated-images/139f6130-5a70-479c-8c91-c76d6eccd980/_result.png",
    desc: {
      en: "A sugarcane-process decaf that tastes like coffee should — none of the flat, papery notes. Honeyed and round, with milk chocolate and almond. Late nights, early starts, no compromises.",
      fa: "دیکافی با فرآوری نیشکر که طعم قهوهٔ واقعی می‌دهد — خبری از نت‌های تخت و کاغذی نیست. عسلی و گِرد، با شکلات شیری و بادام. برای شب‌های دیر و صبح‌های زود، بدون مصالحه.",
    },
    brew: { en: "V60 or pot · 1:15 · 92°C", fa: "V60 یا قهوه‌جوش · ۱:۱۵ · ۹۲°C" },
    stock: "in",
  },
];

export const MASTHEAD_IMG =
  "https://image.qwenlm.ai/generated-images/ee8b6cef-59e7-4a40-b932-3e9ef3706ec7/_result.png";

export const CATEGORY_KEYS: CategoryKey[] = ["single", "blend", "espresso", "decaf"];

export type Weight = 250 | 1000;
export type Grind = "whole" | "filter" | "espresso";

export const WEIGHTS: Weight[] = [250, 1000];
export const GRINDS: Grind[] = ["whole", "filter", "espresso"];

export function priceFor(base: number, weight: Weight): number {
  return weight === 250 ? base : Math.round(base * 3.4 * 2) / 2;
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

export function nextRoastDate(lang: Lang): string {
  const d = new Date();
  d.setDate(d.getDate() + ((2 - d.getDay() + 7) % 7 || 7)); // next Tuesday
  return d.toLocaleDateString(lang === "fa" ? "fa-IR" : "en-US", {
    month: "short",
    day: "numeric",
  });
}

/** All searchable text of a product, in both languages. */
export function searchHay(p: Product): string {
  return [
    p.name.en, p.name.fa, p.origin.en, p.origin.fa,
    p.process.en, p.process.fa, p.roastName.en, p.roastName.fa,
    p.producer.en, p.producer.fa, p.category,
    ...p.notes.map((n) => `${n.en} ${n.fa}`),
  ].join(" ");
}
