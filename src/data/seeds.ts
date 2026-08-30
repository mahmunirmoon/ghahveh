/* ─────────────────────────────────────────────────────────────
   دادهٔ نمونه: سفارش‌ها و تراکنش‌های دفتر حساب
   تاریخ‌ها نسبت به امروز ساخته می‌شوند تا داشبورد همیشه زنده باشد.
   ───────────────────────────────────────────────────────────── */

import { daysAgoISO } from "../lib/format";
import { PRODUCTS, type Product } from "./products";
import type { OrderStatusKey, PaymentKey } from "./business";

export interface OrderItem {
  productId: string;
  qty: number;
}

export interface Order {
  id: number;
  dateISO: string;
  customerId: string;
  items: OrderItem[];
  payment: PaymentKey;
  status: OrderStatusKey;
  note?: string;
}

export function orderSubtotal(order: Order, products: Product[]): number {
  const map = new Map(products.map((p) => [p.id, p]));
  return order.items.reduce(
    (s, it) => s + (map.get(it.productId)?.price ?? 0) * it.qty,
    0,
  );
}

export function orderProfit(order: Order, products: Product[]): number {
  const map = new Map(products.map((p) => [p.id, p]));
  return order.items.reduce((s, it) => {
    const p = map.get(it.productId);
    return p ? s + (p.price - p.purchasePrice) * it.qty : s;
  }, 0);
}

const mk = (
  id: number,
  dateISO: string,
  customerId: string,
  items: [string, number][],
  payment: PaymentKey,
  status: OrderStatusKey,
  note?: string,
): Order => ({
  id,
  dateISO,
  customerId,
  items: items.map(([productId, qty]) => ({ productId, qty })),
  payment,
  status,
  note,
});

/** ۲۶ سفارش نمونهٔ ایرانی با مبالغ واقع‌بینانه */
export function seedOrders(): Order[] {
  return [
    // امروز
    mk(1042, daysAgoISO(0, 9, 40), "c7", [["esp70", 1], ["france", 1]], "pos", "new"),
    mk(1041, daysAgoISO(0, 10, 15), "c12", [["d-latte", 2], ["d-mocha", 1]], "cash", "preparing"),
    mk(1040, daysAgoISO(0, 11, 5), "c2", [["esp70", 8], ["robusta100", 4]], "transfer", "preparing", "تحویل هفتگی کافه سیلک"),
    mk(1039, daysAgoISO(0, 8, 30), "c16", [["arabica100", 1]], "card2card", "new"),
    // دیروز و روزهای قبل
    mk(1038, daysAgoISO(1, 18, 20), "c8", [["turk", 2], ["masala", 1]], "cash", "delivered"),
    mk(1037, daysAgoISO(1, 13, 10), "c1", [["esp50", 10], ["syrup-vanilla", 3]], "check", "shipped", "کافه خانه کاشان — هفتهٔ منتهی به پنجشنبه"),
    mk(1036, daysAgoISO(1, 9, 45), "c13", [["d-cappuccino", 2], ["d-hotchoc", 1]], "pos", "delivered"),
    mk(1035, daysAgoISO(2, 16, 30), "c3", [["esp70", 12], ["hotchoc", 2]], "transfer", "ready", "کافه باغ فین"),
    mk(1034, daysAgoISO(2, 11, 0), "c14", [["colombia", 1], ["filter", 1]], "online", "delivered"),
    mk(1033, daysAgoISO(3, 19, 15), "c9", [["france", 1]], "cash", "delivered"),
    mk(1032, daysAgoISO(3, 10, 40), "c4", [["robusta100", 6], ["tamper", 1]], "credit", "shipped", "کافه امیرکبیر — تسویه پایان ماه"),
    mk(1031, daysAgoISO(4, 17, 25), "c15", [["d-masala", 1], ["d-americano", 2]], "pos", "delivered"),
    mk(1030, daysAgoISO(5, 12, 50), "c6", [["esp50", 14], ["arabica100", 3], ["nescafe", 2]], "transfer", "delivered", "رستوران سنتی کاشان"),
    mk(1029, daysAgoISO(6, 15, 35), "c17", [["ethiopia", 1]], "card2card", "delivered"),
    mk(1028, daysAgoISO(7, 10, 20), "c10", [["esp70", 2]], "cash", "delivered"),
    mk(1027, daysAgoISO(8, 18, 5), "c5", [["syrup-caramel", 4], ["cappowder", 3]], "check", "ready", "کافه شهرزاد"),
    mk(1026, daysAgoISO(9, 14, 15), "c18", [["d-iced-latte", 3], ["d-mojito", 2]], "pos", "delivered"),
    mk(1025, daysAgoISO(11, 11, 30), "c11", [["brazil", 1], ["mochapowder", 1]], "online", "delivered"),
    mk(1024, daysAgoISO(13, 16, 45), "c19", [["nescafe", 1]], "cash", "delivered"),
    mk(1023, daysAgoISO(15, 9, 55), "c1", [["esp70", 9], ["syrup-hazelnut", 2]], "transfer", "delivered"),
    mk(1022, daysAgoISO(18, 13, 20), "c20", [["turk", 1], ["france", 1]], "card2card", "delivered"),
    mk(1021, daysAgoISO(21, 17, 40), "c3", [["esp50", 8], ["hotchoc", 3]], "credit", "delivered", "کافه باغ فین"),
    mk(1020, daysAgoISO(24, 10, 10), "c7", [["arabica100", 2]], "pos", "delivered"),
    mk(1019, daysAgoISO(28, 15, 25), "c4", [["robusta100", 5], ["filter", 2]], "transfer", "delivered"),
    mk(1018, daysAgoISO(33, 12, 35), "c12", [["colombia", 1], ["kenya", 1]], "online", "cancelled", "انصراف مشتری"),
    mk(1017, daysAgoISO(40, 18, 15), "c2", [["esp70", 10], ["syrup-vanilla", 2]], "transfer", "delivered"),
  ];
}

/* ─────────────── تراکنش‌های دفتر حساب ─────────────── */

export interface Tx {
  id: string;
  docNo: number;
  dateISO: string;
  desc: string;
  type: string;
  party: string;
  method: string;
  debit: number;  // خروج پول
  credit: number; // ورود پول
  status: "settled" | "pending";
}

const tx = (
  docNo: number,
  dateISO: string,
  desc: string,
  type: string,
  party: string,
  method: string,
  debit: number,
  credit: number,
  status: "settled" | "pending" = "settled",
): Tx => ({ id: `tx-${docNo}`, docNo, dateISO, desc, type, party, method, debit, credit, status });

export function seedTransactions(): Tx[] {
  return [
    tx(2018, daysAgoISO(1, 12), "فروش نقدی قهوه", "فروش", "مشتریان خرده", "نقدی", 0, 3_850_000),
    tx(2017, daysAgoISO(2, 11), "فروش عمده به کافه باغ فین", "فروش", "کافه باغ فین", "انتقال بانکی", 0, 12_400_000),
    tx(2016, daysAgoISO(3, 16), "خرید دانهٔ قهوه (قسط دوم)", "خرید", "بازرگانی قهوه تهران", "کارت به کارت", 15_900_000, 0, "pending"),
    tx(2015, daysAgoISO(4, 10), "خرید بسته‌بندی", "خرید", "تأمین‌کنندهٔ محصولات کافه ایران", "کارت‌خوان", 4_800_000, 0, "pending"),
    tx(2014, daysAgoISO(5, 14), "فروش به مشتری عمده", "فروش", "رستوران سنتی کاشان", "انتقال بانکی", 0, 26_500_000),
    tx(2013, daysAgoISO(6, 9), "هزینهٔ حمل بار", "هزینه", "باربری امین", "نقدی", 1_200_000, 0),
    tx(2012, daysAgoISO(8, 13), "خرید تجهیزات (تمپر و پورتافیلتر)", "خرید", "پخش تجهیزات کافی‌شاپ سپهر", "چک", 7_700_000, 0, "pending"),
    tx(2011, daysAgoISO(10, 11), "هزینهٔ آب و برق", "هزینه", "ادارات خدماتی کاشان", "انتقال بانکی", 3_750_000, 0),
    tx(2010, daysAgoISO(12, 15), "فروش هفتگی کافه سیلک", "فروش", "کافه سیلک", "انتقال بانکی", 0, 18_200_000),
    tx(2009, daysAgoISO(14, 10), "پرداخت اجارهٔ مغازه", "هزینه", "مالک ملک", "انتقال بانکی", 18_000_000, 0),
    tx(2008, daysAgoISO(16, 12), "خرید دانهٔ قهوه (محمولهٔ مهر)", "خرید", "پخش قهوه اصفهان", "کارت به کارت", 12_500_000, 0),
    tx(2007, daysAgoISO(18, 17), "فروش عمده کافه خانه کاشان", "فروش", "کافه خانه کاشان", "چک", 0, 21_800_000),
    tx(2006, daysAgoISO(20, 9), "هزینهٔ اینترنت و تلفن", "هزینه", "مخابرات", "پرداخت آنلاین", 950_000, 0),
    tx(2005, daysAgoISO(23, 14), "پرداخت حقوق پرسنل", "هزینه", "پرسنل مجموعه", "انتقال بانکی", 38_000_000, 0),
    tx(2004, daysAgoISO(26, 11), "فروش نقدی هفته", "فروش", "مشتریان خرده", "کارت‌خوان", 0, 32_400_000),
    tx(2003, daysAgoISO(30, 10), "تبلیغات محلی اینستاگرام", "هزینه", "آژانس تبلیغاتی", "پرداخت آنلاین", 2_500_000, 0),
    tx(2002, daysAgoISO(35, 13), "دریافت مطالبات کافه شهرزاد", "دریافت مطالبات", "کافه شهرزاد", "کارت به کارت", 0, 9_600_000),
    tx(2001, daysAgoISO(42, 12), "پرداخت بدهی پخش قهوه اصفهان", "پرداخت بدهی", "پخش قهوه اصفهان", "انتقال بانکی", 11_300_000, 0),
    tx(2000, daysAgoISO(48, 9), "واریز سرمایهٔ جاری", "سرمایه‌گذاری", "هستی صدرایی", "انتقال بانکی", 0, 60_000_000),
    tx(1999, daysAgoISO(55, 15), "فروش نقدی هفته", "فروش", "مشتریان خرده", "نقدی", 0, 27_350_000),
  ];
}
