/* ─────────────────────────────────────────────────────────────
   اطلاعات ثابت کسب‌وکار، تأمین‌کنندگان، مشتریان، روش‌های پرداخت
   ───────────────────────────────────────────────────────────── */

export const BUSINESS = {
  name: "مجموعه قهوه کاشان",
  shortName: "قهوه کاشان",
  tagline: "فروش، رست و پخش قهوه در کاشان",
  manager: "هستی صدرایی",
  phone: "09137102426",
  phoneFa: "۰۹۱۳۷۱۰۲۴۲۶",
  phoneIntl: "+98 913 710 2426",
  phoneHref: "tel:+989137102426",
  country: "ایران",
  province: "اصفهان",
  city: "کاشان",
  address: "کاشان، جاده امیرکبیر",
  addressFull: "ایران، استان اصفهان، کاشان، جاده امیرکبیر",
  hoursWeek: "شنبه تا پنجشنبه · ۸:۰۰ تا ۲۱:۰۰",
  hoursFriday: "جمعه · ۱۶:۰۰ تا ۲۱:۰۰",
  roastDays: "روزهای رست: دوشنبه و پنجشنبه",
} as const;

/* ─────────────── تأمین‌کنندگان ─────────────── */

export interface Supplier {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  supply: string;
}

export const SUPPLIERS: Supplier[] = [
  { id: "sup-teh", name: "بازرگانی قهوه تهران", city: "تهران", address: "تهران، خیابان جمهوری، مجتمع علاءالدین، واحد ۲۱۴", phone: "09121145578", supply: "دانهٔ قهوه" },
  { id: "sup-isf", name: "پخش قهوه اصفهان", city: "اصفهان", address: "اصفهان، خیابان چهارباغ بالا، کوچه نرگس، پلاک ۸", phone: "09131148890", supply: "دانهٔ قهوه و مواد اولیه" },
  { id: "sup-kashan", name: "قهوه مرکزی کاشان", city: "کاشان", address: "کاشان، خیابان بهشتی، پاساژ نور، طبقه ۲", phone: "09134451123", supply: "دانهٔ قهوه" },
  { id: "sup-pars", name: "تأمین دانه پارس", city: "تهران", address: "تهران، بازار بزرگ، راسته قنادان، پلاک ۳۶", phone: "09122218745", supply: "دانهٔ سبز" },
  { id: "sup-sabz", name: "بازرگانی دانه سبز", city: "اصفهان", address: "اصفهان، خیابان آپادانا، کوچه سوم، پلاک ۱۲", phone: "09133321907", supply: "دانهٔ سبز وارداتی" },
  { id: "sup-sepehr", name: "پخش تجهیزات کافی‌شاپ سپهر", city: "قم", address: "قم، بلوار امین، مجتمع تجاری مهتاب، واحد ۵", phone: "09125569034", supply: "تجهیزات و ملزومات" },
  { id: "sup-iran", name: "تأمین‌کنندهٔ محصولات کافه ایران", city: "تهران", address: "تهران، خیابان ولیعصر، نرسیده به پارک‌وی، پلاک ۴۱۰", phone: "09127783345", supply: "پودرها، سیروپ و ملزومات" },
];

/* ─────────────── مشتریان نمونه ─────────────── */

export type CustomerType = "retail" | "wholesale";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  type: CustomerType;
  business?: string;
}

export const CUSTOMER_TYPE_LABEL: Record<CustomerType, string> = {
  retail: "خرده‌فروشی",
  wholesale: "عمده‌فروشی",
};

export const CUSTOMERS: Customer[] = [
  { id: "c0", name: "مشتری فروشگاه اینترنتی", phone: "-", address: "کاشان و حومه", type: "retail" },
  { id: "c1", name: "سید امیر موسوی", phone: "09131145522", address: "کاشان، بلوار قطب راوندی، کوچه ۱۲، پلاک ۱۸", type: "wholesale", business: "کافه خانه کاشان" },
  { id: "c2", name: "میلاد صادقی", phone: "09132218736", address: "کاشان، منطقه سیلک، خیابان اصلی، پلاک ۴۵", type: "wholesale", business: "کافه سیلک" },
  { id: "c3", name: "پریسا محمودی", phone: "09133321904", address: "کاشان، حوالی باغ فین، کوچه گلشن، پلاک ۷", type: "wholesale", business: "کافه باغ فین" },
  { id: "c4", name: "حامد باقری", phone: "09124451189", address: "کاشان، خیابان امیرکبیر، مجتمع تجاری آفتاب، واحد ۳", type: "wholesale", business: "کافه امیرکبیر" },
  { id: "c5", name: "الهام عباسی", phone: "09911223344", address: "کاشان، میدان کمال‌الملک، کوچه شهید بهشتی، پلاک ۲۱", type: "wholesale", business: "کافه شهرزاد" },
  { id: "c6", name: "محمدرضا جعفری", phone: "09135569012", address: "کاشان، خیابان محتشم، نبش کوچه ۸، پلاک ۳۴", type: "wholesale", business: "رستوران سنتی کاشان" },
  { id: "c7", name: "علی رضایی", phone: "09131147789", address: "کاشان، خیابان رجایی، کوچه ۵، پلاک ۱۲", type: "retail" },
  { id: "c8", name: "محمد احمدی", phone: "09132214456", address: "کاشان، خیابان ۲۲ بهمن، کوچه لاله، پلاک ۹", type: "retail" },
  { id: "c9", name: "رضا قاسمی", phone: "09123318890", address: "کاشان، بلوار امام رضا، مجتمع نگین، بلوک ب، واحد ۴", type: "retail" },
  { id: "c10", name: "حسین کریمی", phone: "09134459911", address: "کاشان، شهرک ناجی‌آباد، فاز ۲، بلوک ۱۴، واحد ۳", type: "retail" },
  { id: "c11", name: "مهدی اکبری", phone: "09912238845", address: "کاشان، فین کاشان، خیابان باغ، کوچه ۳، پلاک ۱۶", type: "retail" },
  { id: "c12", name: "سارا محمدی", phone: "09135561123", address: "کاشان، خیابان آیت‌الله کاشانی، کوچه شهید رجایی، پلاک ۲۷", type: "retail" },
  { id: "c13", name: "نگار حسینی", phone: "09126674450", address: "کاشان، میدان پانزده خرداد، کوچه ارغوان، پلاک ۵", type: "retail" },
  { id: "c14", name: "مریم امیری", phone: "09137781129", address: "کاشان، خیابان بابا افضل، کوچه ۱۰، پلاک ۲۳", type: "retail" },
  { id: "c15", name: "زهرا رحیمی", phone: "09913345567", address: "کاشان، راوند، خیابان اصلی، کوچه شهید احمدی، پلاک ۸", type: "retail" },
  { id: "c16", name: "علیرضا نادری", phone: "09138891134", address: "کاشان، خیابان ملا حبیب‌الله شریف، کوچه ۶، پلاک ۳۱", type: "retail" },
  { id: "c17", name: "آرمان یوسفی", phone: "09129914478", address: "کاشان، جاده قمصر، کیلومتر ۳، مجتمع باغ‌شهر، ویلا ۱۲", type: "retail" },
  { id: "c18", name: "امیرحسین رستمی", phone: "09131140023", address: "کاشان، جاده نوش‌آباد، شهرک صنعتی، بلوک اداری، واحد ۲", type: "retail" },
  { id: "c19", name: "فاطمه مرادی", phone: "09914457789", address: "کاشان، خیابان بهشتی، کوچه یاس، پلاک ۱۹", type: "retail" },
  { id: "c20", name: "سعید کاظمی", phone: "09132219956", address: "کاشان، بلوار قطب راوندی، کوچه ۴، پلاک ۲۶", type: "retail" },
];

/* ─────────────── روش‌های پرداخت ─────────────── */

export const PAYMENT_METHODS = [
  { key: "cash", label: "نقدی" },
  { key: "pos", label: "کارت‌خوان" },
  { key: "card2card", label: "کارت به کارت" },
  { key: "transfer", label: "انتقال بانکی" },
  { key: "online", label: "پرداخت آنلاین" },
  { key: "credit", label: "اعتباری" },
  { key: "check", label: "چک" },
] as const;

export type PaymentKey = (typeof PAYMENT_METHODS)[number]["key"];

export const PAYMENT_LABEL: Record<PaymentKey, string> = PAYMENT_METHODS.reduce(
  (acc, m) => ({ ...acc, [m.key]: m.label }),
  {} as Record<PaymentKey, string>,
);

export const BANKS = [
  "بانک ملت", "بانک ملی", "بانک صادرات",
  "بانک تجارت", "بانک سپه", "بانک پاسارگاد",
];

/* ─────────────── وضعیت‌های سفارش ─────────────── */

export const ORDER_STATUSES = [
  { key: "new", label: "جدید" },
  { key: "preparing", label: "در حال آماده‌سازی" },
  { key: "ready", label: "آماده ارسال" },
  { key: "shipped", label: "ارسال شده" },
  { key: "delivered", label: "تحویل شده" },
  { key: "cancelled", label: "لغو شده" },
] as const;

export type OrderStatusKey = (typeof ORDER_STATUSES)[number]["key"];

export const STATUS_LABEL: Record<OrderStatusKey, string> = ORDER_STATUSES.reduce(
  (acc, s) => ({ ...acc, [s.key]: s.label }),
  {} as Record<OrderStatusKey, string>,
);

export const STATUS_TONE: Record<OrderStatusKey, string> = {
  new: "bg-ember-500/12 text-ember-300 border-ember-500/40",
  preparing: "bg-cherry-500/12 text-cherry-400 border-cherry-500/40",
  ready: "bg-cream-100/8 text-cream-300 border-cream-100/25",
  shipped: "bg-cream-100/8 text-cream-400 border-cream-100/25",
  delivered: "bg-leaf-500/12 text-leaf-300 border-leaf-500/40",
  cancelled: "bg-roast-800 text-cream-600 border-cream-100/10",
};

/* ─────────────── دسته‌بندی هزینه‌ها ─────────────── */

export const EXPENSE_CATEGORIES = [
  "خرید قهوه", "مواد اولیه", "بسته‌بندی", "اجاره", "حقوق",
  "آب", "برق", "گاز", "اینترنت", "حمل‌ونقل", "تبلیغات",
  "تعمیر تجهیزات", "خرید تجهیزات", "مالیات", "سایر هزینه‌ها",
];

/* ─────────────── انواع تراکنش دفتر حساب ─────────────── */

export const TX_TYPES = [
  "فروش", "خرید", "هزینه", "دریافت مطالبات", "پرداخت بدهی", "سرمایه‌گذاری",
];

export const UNITS = ["کیلوگرم", "گرم", "بسته", "عدد", "بطری", "کارتن", "فنجان"];
