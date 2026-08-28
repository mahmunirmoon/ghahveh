/* ─────────────────────────────────────────────────────────────
   محصولات مجموعه قهوه کاشان — ۲۰ محصول فروشگاهی + ۱۲ نوشیدنی کافه
   قیمت‌ها به تومان و از طریق پنل مدیریت قابل ویرایش‌اند.
   ───────────────────────────────────────────────────────────── */

export type ProductCategory = "beans" | "brew" | "syrup" | "equip" | "drink";

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  beans: "دانهٔ قهوه",
  brew: "پودر و دم‌کردنی",
  syrup: "سیروپ",
  equip: "تجهیزات",
  drink: "نوشیدنی کافه",
};

export const CATEGORIES: ("all" | ProductCategory)[] = [
  "all", "beans", "brew", "syrup", "equip", "drink",
];

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  pack: string;
  unit: string;
  price: number;        // قیمت فروش (تومان)
  purchasePrice: number; // قیمت خرید (تومان)
  stock: number;
  minStock: number;
  supplierId: string;
  img: string;
  desc: string;
  updatedAt: string; // ISO
}

const IMG = {
  a: "https://image.qwenlm.ai/generated-images/0010b6ed-f356-4651-a527-0111dbcebc58/_result.png",
  b: "https://image.qwenlm.ai/generated-images/e01d8f91-0ada-4ab2-9e53-b398933c844a/_result.png",
  c: "https://image.qwenlm.ai/generated-images/33413b83-ca41-4998-8f1c-247392c65f02/_result.png",
  d: "https://image.qwenlm.ai/generated-images/c5048cee-97a4-4b04-8921-f3315d599f08/_result.png",
  e: "https://image.qwenlm.ai/generated-images/3ad3c9cd-d606-42fb-970b-db956f14529a/_result.png",
  f: "https://image.qwenlm.ai/generated-images/139f6130-5a70-479c-8c91-c76d6eccd980/_result.png",
};

export const HERO_IMG =
  "https://image.qwenlm.ai/generated-images/ee8b6cef-59e7-4a40-b932-3e9ef3706ec7/_result.png";

const d = (days: number) => {
  const t = new Date();
  t.setDate(t.getDate() - days);
  return t.toISOString();
};

export const PRODUCTS: Product[] = [
  /* ── دانهٔ قهوه ── */
  { id: "esp70", name: "قهوه اسپرسو ۷۰٪ روبوستا ۳۰٪ عربیکا", category: "beans", pack: "۲۵۰ گرمی", unit: "بسته", price: 890_000, purchasePrice: 615_000, stock: 46, minStock: 12, supplierId: "sup-teh", img: IMG.c, desc: "پرکافئین و پرکرما؛ انتخاب اول کافه‌ها و علاقه‌مندان به اسپرسوی قوی. رست مدیوم-دارک با تلخی متعادل و ماندگاری طعم بالا.", updatedAt: d(2) },
  { id: "esp50", name: "قهوه اسپرسو ۵۰٪ عربیکا ۵۰٪ روبوستا", category: "beans", pack: "۲۵۰ گرمی", unit: "بسته", price: 980_000, purchasePrice: 690_000, stock: 38, minStock: 12, supplierId: "sup-isf", img: IMG.a, desc: "تعادل کلاسیک عطر عربیکا و غلظت روبوستا؛ مناسب اسپرسوساز خانگی و موکاپات. کرما طلایی و عطر شکلاتی.", updatedAt: d(2) },
  { id: "arabica100", name: "قهوه ۱۰۰٪ عربیکا", category: "beans", pack: "۲۵۰ گرمی", unit: "بسته", price: 1_350_000, purchasePrice: 985_000, stock: 24, minStock: 10, supplierId: "sup-teh", img: IMG.b, desc: "عربیکای مرغوب با اسیدیتهٔ زنده و عطر گل و مرکبات؛ مناسب کمکس و V60. رست لایت برای حفظ ظرافت دانه.", updatedAt: d(4) },
  { id: "robusta100", name: "قهوه ۱۰۰٪ روبوستا", category: "beans", pack: "۲۵۰ گرمی", unit: "بسته", price: 850_000, purchasePrice: 570_000, stock: 52, minStock: 12, supplierId: "sup-kashan", img: IMG.d, desc: "روبوستای درجه‌یک با کافئین بالا و بدنهٔ سنگین؛ پایهٔ عالی برای ترکیب‌های اسپرسو و قهوه‌های انرژی‌بخش.", updatedAt: d(6) },
  { id: "turk", name: "قهوه ترک", category: "beans", pack: "۲۵۰ گرمی", unit: "بسته", price: 790_000, purchasePrice: 540_000, stock: 9, minStock: 10, supplierId: "sup-kashan", img: IMG.f, desc: "آسیاب فوق‌ریز مخصوص جذوه با عطر هل؛ آمادهٔ دم برای قهوهٔ ترک اصیل. قابل سفارش با هل بیشتر.", updatedAt: d(1) },
  { id: "france", name: "قهوه فرانسه", category: "beans", pack: "۲۵۰ گرمی", unit: "بسته", price: 920_000, purchasePrice: 640_000, stock: 31, minStock: 10, supplierId: "sup-isf", img: IMG.a, desc: "ترکیب نرم و ملایم با رست مدیوم؛ مناسب فرنچ‌پرس و قهوهٔ روزانه. طعم فندقی و پایان شیرین.", updatedAt: d(5) },
  { id: "colombia", name: "قهوه کلمبیا", category: "beans", pack: "۲۵۰ گرمی", unit: "بسته", price: 1_490_000, purchasePrice: 1_105_000, stock: 18, minStock: 8, supplierId: "sup-teh", img: IMG.b, desc: "تک‌خاستگاه از منطقهٔ هویلا؛ بدنهٔ متوسط، شیرینی کاراملی و اسیدیتهٔ سیبی. یکی از محبوب‌ترین دانه‌های مجموعه.", updatedAt: d(3) },
  { id: "brazil", name: "قهوه برزیل", category: "beans", pack: "۲۵۰ گرمی", unit: "بسته", price: 1_290_000, purchasePrice: 950_000, stock: 27, minStock: 8, supplierId: "sup-pars", img: IMG.d, desc: "طبیعی و کم‌اسیدیته با نت‌های فندوق و شکلات شیری؛ پایهٔ بسیاری از ترکیب‌های اسپرسوی کافه‌ها.", updatedAt: d(8) },
  { id: "ethiopia", name: "قهوه اتیوپی", category: "beans", pack: "۲۵۰ گرمی", unit: "بسته", price: 1_550_000, purchasePrice: 1_160_000, stock: 14, minStock: 8, supplierId: "sup-teh", img: IMG.b, desc: "یریگاچف شسته با عطر یاس و برگاموت و شیرینی زردآلو؛ برای دم‌های دمی و علاقهمندان به قهوه‌های روشن.", updatedAt: d(3) },
  { id: "kenya", name: "قهوه کنیا", category: "beans", pack: "۲۵۰ گرمی", unit: "بسته", price: 1_650_000, purchasePrice: 1_240_000, stock: 7, minStock: 8, supplierId: "sup-sabz", img: IMG.a, desc: "اسیدیتهٔ انگورفرنگی سیاه و بدنهٔ آبدار؛ قهوه‌ای خاص برای ذائقه‌های جست‌وجوگر. بار محدود هر فصل.", updatedAt: d(10) },

  /* ── پودر و دم‌کردنی ── */
  { id: "nescafe", name: "نسکافه گلد", category: "brew", pack: "۲۰۰ گرمی", unit: "بسته", price: 1_350_000, purchasePrice: 1_030_000, stock: 20, minStock: 8, supplierId: "sup-iran", img: IMG.f, desc: "قهوهٔ فوری گلد با عطر و طعم نزدیک به قهوهٔ دم؛ انتخاب سریع و مطمئن برای محل کار و سفر.", updatedAt: d(7) },
  { id: "hotchoc", name: "هات چاکلت", category: "brew", pack: "۵۰۰ گرمی", unit: "بسته", price: 750_000, purchasePrice: 520_000, stock: 33, minStock: 10, supplierId: "sup-iran", img: IMG.c, desc: "پودر هات‌چاکلت غلیظ با ۳۴٪ کاکائو؛ کافی‌شاپی، کم‌شکر و با بافت مخملی. مناسب ۲۵ فنجان.", updatedAt: d(4) },
  { id: "cappowder", name: "پودر کاپوچینو", category: "brew", pack: "۵۰۰ گرمی", unit: "بسته", price: 850_000, purchasePrice: 600_000, stock: 26, minStock: 10, supplierId: "sup-iran", img: IMG.e, desc: "پودر کاپوچینو آماده با فوم پایدار؛ فقط شیر داغ لازم است. مناسب خانه و محیط کار.", updatedAt: d(9) },
  { id: "masala", name: "چای ماسالا", category: "brew", pack: "۵۰۰ گرمی", unit: "بسته", price: 690_000, purchasePrice: 470_000, stock: 41, minStock: 10, supplierId: "sup-iran", img: IMG.c, desc: "ترکیب اصیل چای سیاه و ادویه‌های دارچین، هل و زنجبیل؛ با شیر سرو می‌شود و طرفداران زیادی در کاشان دارد.", updatedAt: d(6) },
  { id: "mochapowder", name: "پودر موکا", category: "brew", pack: "۵۰۰ گرمی", unit: "بسته", price: 790_000, purchasePrice: 555_000, stock: 17, minStock: 10, supplierId: "sup-iran", img: IMG.e, desc: "ترکیب آمادهٔ قهوه و کاکائو برای موکای خانگی؛ تلخی متعادل و عطر شکلات تلخ.", updatedAt: d(12) },

  /* ── سیروپ‌ها ── */
  { id: "syrup-caramel", name: "سیروپ کارامل", category: "syrup", pack: "۷۵۰ میلی‌لیتر", unit: "بطری", price: 590_000, purchasePrice: 410_000, stock: 22, minStock: 8, supplierId: "sup-iran", img: IMG.f, desc: "سیروپ کارامل غلیظ برای کارامل ماکیاتو، لاته و دسر؛ شیرینی یکنواخت و عطر کره‌ای.", updatedAt: d(15) },
  { id: "syrup-vanilla", name: "سیروپ وانیل", category: "syrup", pack: "۷۵۰ میلی‌لیتر", unit: "بطری", price: 590_000, purchasePrice: 410_000, stock: 5, minStock: 8, supplierId: "sup-iran", img: IMG.b, desc: "وانیل طبیعی مادگاسکار؛ مکمل همیشگی لاته و کاپوچینو. پرمصرف‌ترین سیروپ مجموعه.", updatedAt: d(1) },
  { id: "syrup-hazelnut", name: "سیروپ فندق", category: "syrup", pack: "۷۵۰ میلی‌لیتر", unit: "بطری", price: 620_000, purchasePrice: 435_000, stock: 13, minStock: 8, supplierId: "sup-iran", img: IMG.d, desc: "عطر فندق برشته برای لاته و موهیتوهای سرد؛ غلظت استاندارد کافی‌شاپی.", updatedAt: d(18) },

  /* ── تجهیزات ── */
  { id: "filter", name: "فیلتر قهوه", category: "equip", pack: "بستهٔ ۱۰۰ عددی", unit: "بسته", price: 180_000, purchasePrice: 110_000, stock: 60, minStock: 15, supplierId: "sup-sepehr", img: IMG.a, desc: "فیلتر کاغذی مخروطی سایز ۲ بدون سفیدکنندهٔ شیمیایی؛ برای کمکس و V60.", updatedAt: d(20) },
  { id: "tamper", name: "تمپر قهوه", category: "equip", pack: "سایز ۵۸ میلی‌متر", unit: "عدد", price: 850_000, purchasePrice: 590_000, stock: 11, minStock: 5, supplierId: "sup-sepehr", img: IMG.e, desc: "تمپر استیل با دستهٔ چوبی، کف تخت و وزن استاندارد؛ فشرده‌سازی یکنواخت برای عصاره‌گیری دقیق.", updatedAt: d(25) },

  /* ── منوی نوشیدنی کافه ── */
  { id: "d-single", name: "اسپرسو سینگل", category: "drink", pack: "یک شات", unit: "فنجان", price: 85_000, purchasePrice: 18_000, stock: 999, minStock: 0, supplierId: "sup-teh", img: HERO_IMG, desc: "یک شات اسپرسو با دانهٔ رست‌شدهٔ همان هفته؛ کرما طلایی و عصاره‌گیری دقیق.", updatedAt: d(0) },
  { id: "d-double", name: "اسپرسو دبل", category: "drink", pack: "دو شات", unit: "فنجان", price: 110_000, purchasePrice: 36_000, stock: 999, minStock: 0, supplierId: "sup-teh", img: HERO_IMG, desc: "دبل شات برای روزهای شلوغ؛ همان دانهٔ تازه با عصاره‌گیری دوگانه.", updatedAt: d(0) },
  { id: "d-americano", name: "آمریکانو", category: "drink", pack: "۲۴۰ میلی‌لیتر", unit: "فنجان", price: 110_000, purchasePrice: 25_000, stock: 999, minStock: 0, supplierId: "sup-teh", img: HERO_IMG, desc: "اسپرسو رقیق‌شده با آب داغ؛ سبک، شفاف و مناسب همراهی با کار.", updatedAt: d(0) },
  { id: "d-cappuccino", name: "کاپوچینو", category: "drink", pack: "۱۸۰ میلی‌لیتر", unit: "فنجان", price: 130_000, purchasePrice: 38_000, stock: 999, minStock: 0, supplierId: "sup-teh", img: HERO_IMG, desc: "یک‌سوم اسپرسو، یک‌سوم شیر بخارپز، یک‌سوم فوم؛ کلاسیک ایتالیایی با دانهٔ اسپرسوی مجموعه.", updatedAt: d(0) },
  { id: "d-latte", name: "لاته", category: "drink", pack: "۲۴۰ میلی‌لیتر", unit: "فنجان", price: 140_000, purchasePrice: 42_000, stock: 999, minStock: 0, supplierId: "sup-teh", img: HERO_IMG, desc: "شیر ابریشمی بیشتر، قهوهٔ ملایم‌تر؛ محبوب‌ترین نوشیدنی گرم مجموعه.", updatedAt: d(0) },
  { id: "d-mocha", name: "موکا", category: "drink", pack: "۲۴۰ میلی‌لیتر", unit: "فنجان", price: 150_000, purchasePrice: 48_000, stock: 999, minStock: 0, supplierId: "sup-teh", img: HERO_IMG, desc: "اسپرسو، شیر و سس شکلات تلخ خانگی؛ با خامه در صورت تمایل.", updatedAt: d(0) },
  { id: "d-caramel", name: "کارامل ماکیاتو", category: "drink", pack: "۲۴۰ میلی‌لیتر", unit: "فنجان", price: 160_000, purchasePrice: 52_000, stock: 999, minStock: 0, supplierId: "sup-teh", img: HERO_IMG, desc: "وانیل، شیر بخارپز، اسپرسو و سس کارامل روی آن؛ لایه‌لایه و خوش‌عطر.", updatedAt: d(0) },
  { id: "d-hotchoc", name: "هات چاکلت", category: "drink", pack: "۲۴۰ میلی‌لیتر", unit: "فنجان", price: 140_000, purchasePrice: 45_000, stock: 999, minStock: 0, supplierId: "sup-teh", img: HERO_IMG, desc: "شکلات ۳۴٪ آب‌شده با شیر پرچرب؛ غلیظ و گرم، مناسب روزهای کویری سرد.", updatedAt: d(0) },
  { id: "d-masala", name: "چای ماسالا", category: "drink", pack: "۲۴۰ میلی‌لیتر", unit: "فنجان", price: 145_000, purchasePrice: 40_000, stock: 999, minStock: 0, supplierId: "sup-teh", img: HERO_IMG, desc: "ماسالای خانگی با شیر تازه و ادویهٔ تازه‌کوب؛ تند و گرم.", updatedAt: d(0) },
  { id: "d-iced-latte", name: "آیس لاته", category: "drink", pack: "۳۵۰ میلی‌لیتر", unit: "فنجان", price: 150_000, purchasePrice: 45_000, stock: 999, minStock: 0, supplierId: "sup-teh", img: HERO_IMG, desc: "دبل اسپرسو روی شیر سرد و یخ؛ تازه و پرانرژی.", updatedAt: d(0) },
  { id: "d-iced-americano", name: "آیس آمریکانو", category: "drink", pack: "۳۵۰ میلی‌لیتر", unit: "فنجان", price: 125_000, purchasePrice: 30_000, stock: 999, minStock: 0, supplierId: "sup-teh", img: HERO_IMG, desc: "اسپرسو، آب خنک و یخ؛ سبک‌ترین انتخاب تابستان.", updatedAt: d(0) },
  { id: "d-mojito", name: "موهیتو", category: "drink", pack: "۳۵۰ میلی‌لیتر", unit: "فنجان", price: 160_000, purchasePrice: 50_000, stock: 999, minStock: 0, supplierId: "sup-teh", img: HERO_IMG, desc: "نعناع تازه، لیموترش و سودا با سیروپ دلخواه؛ خنک و گوارا.", updatedAt: d(0) },
];

/* متن جست‌وجو — هم فارسی */
export function searchHay(p: Product): string {
  const sup = SUP_NAME[p.supplierId] ?? "";
  return [p.name, CATEGORY_LABEL[p.category], p.pack, p.unit, p.desc, sup].join(" ");
}

const SUP_NAME: Record<string, string> = {
  "sup-teh": "بازرگانی قهوه تهران",
  "sup-isf": "پخش قهوه اصفهان",
  "sup-kashan": "قهوه مرکزی کاشان",
  "sup-pars": "تأمین دانه پارس",
  "sup-sabz": "بازرگانی دانه سبز",
  "sup-sepehr": "پخش تجهیزات کافی‌شاپ سپهر",
  "sup-iran": "تأمین‌کنندهٔ محصولات کافه ایران",
};
