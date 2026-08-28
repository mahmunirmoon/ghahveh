/* ─────────────────────────────────────────────────────────────
   ابزارهای مرکزی فرمت: تومان، اعداد فارسی، تاریخ شمسی
   تمام برنامه فقط از همین توابع استفاده می‌کند.
   ───────────────────────────────────────────────────────────── */

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** تبدیل ارقام لاتین به فارسی */
export const faDigits = (v: string | number): string =>
  String(v).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);

/** تبدیل ارقام فارسی/عربی به لاتین (برای پردازش ورودی کاربر) */
export const toEnDigits = (v: string): string =>
  v
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));

/** جداکنندهٔ هزارگان فارسی: ۲٬۴۵۰٬۰۰۰ */
export const formatNumber = (n: number, maxFraction = 0): string =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: maxFraction }).format(n);

/** فرمت استاندارد تومان: formatToman(125000) => «۱۲۵٬۰۰۰ تومان» */
export const formatToman = (n: number): string =>
  `${formatNumber(Math.round(n))} تومان`;

/** فرمت فشرده برای نمودارها: ۲۳۸٫۵ میلیون */
export const formatTomanShort = (n: number): string => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000)
    return `${formatNumber(Math.round(n / 100_000_000) / 10, 1)} میلیارد`;
  if (abs >= 1_000_000)
    return `${formatNumber(Math.round(n / 100_000) / 10, 1)} میلیون`;
  return formatNumber(n);
};

/* ─────────────── تقویم شمسی (الگوریتم jalaali) ─────────────── */

export const JALALI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
] as const;

function g2j(gy: number, gm: number, gd: number): [number, number, number] {
  const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 + 365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd + gdm[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy, jm, jd];
}

export const jalaliDate = (d: Date) => {
  const [jy, jm, jd] = g2j(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return { jy, jm, jd };
};

const p2 = (n: number) => String(n).padStart(2, "0");
const toDate = (v: string | Date) => (typeof v === "string" ? new Date(v) : v);

/** ۱۴۰۵/۰۶/۰۵ */
export const formatDate = (v: string | Date): string => {
  const { jy, jm, jd } = jalaliDate(toDate(v));
  return faDigits(`${jy}/${p2(jm)}/${p2(jd)}`);
};

/** ۵ شهریور ۱۴۰۵ */
export const formatDateLong = (v: string | Date): string => {
  const { jy, jm, jd } = jalaliDate(toDate(v));
  return `${faDigits(jd)} ${JALALI_MONTHS[jm - 1]} ${faDigits(jy)}`;
};

/** نام ماه شمسی برای محور نمودارها */
export const monthLabel = (d: Date): string => {
  const { jm } = jalaliDate(d);
  return JALALI_MONTHS[jm - 1];
};

/** کلید یکتای ماه شمسی برای گروه‌بندی: 1404-6 */
export const monthKey = (v: string | Date): string => {
  const { jy, jm } = jalaliDate(toDate(v));
  return `${jy}-${jm}`;
};

/** برچسب کوتاه روز برای محور نمودار: ۱۵/۶ */
export const dayLabel = (v: string | Date): string => {
  const { jm, jd } = jalaliDate(toDate(v));
  return faDigits(`${jm}/${jd}`);
};

/** ISO تاریخِ n روز پیش با ساعت دلخواه — برای دادهٔ نمونه */
export const daysAgoISO = (days: number, hour = 11, minute = 0): string => {
  const t = new Date();
  t.setDate(t.getDate() - days);
  t.setHours(hour, minute, 0, 0);
  return t.toISOString();
};

export const uid = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
