import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "fa";

/** A bilingual string pair. */
export interface Bi {
  en: string;
  fa: string;
}

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Converts Latin digits to Persian digits. */
export const faDigits = (v: string | number): string =>
  String(v).replace(/\d/g, (d) => FA_DIGITS[+d]);

/* ------------------------------------------------------------------ */
/*  Dictionary                                                         */
/* ------------------------------------------------------------------ */
const DICT = {
  docTitle: {
    en: "Ember & Oak Roasting Co. — Small-Batch Specialty Coffee",
    fa: "امبر و اوک — رستری قهوهٔ تخصصی",
  },

  /* ---------- chrome ---------- */
  brandSub: { en: "Roasting Co. · PDX", fa: "رستری · پورتلند" },
  navShelf: { en: "The Shelf", fa: "قفسه" },
  navLedger: { en: "Our Ledger", fa: "دفتر ما" },
  navVisit: { en: "Visit", fa: "ملاقات" },
  cart: { en: "Cart", fa: "سبد" },
  openCartAria: { en: "Open cart, {n} items", fa: "باز کردن سبد، {n} قلم" },

  tickerRoast: { en: "Roast day — Tue {d}", fa: "روز رست — سه‌شنبه {d}" },
  tickerShip: { en: "Free shipping over $40", fa: "ارسال رایگان بالای ۴۰ دلار" },
  tickerCrop: { en: "Fresh crop · Ethiopia Guji landed", fa: "بار تازه · اتیوپی گوجی رسید" },
  tickerBatch: { en: "Small batches · 12 kg drum", fa: "بچ‌های کوچک · درام ۱۲ کیلویی" },
  tickerCup: { en: "Cupped & scored every Friday", fa: "کاپینگ و امتیازدهی، هر جمعه" },
  tickerTrade: { en: "Direct trade · 6 farm partners", fa: "تجارت مستقیم · ۶ مزرعهٔ همکار" },
  tickerFast: { en: "Ships within 48h of roast", fa: "ارسال تا ۴۸ ساعت پس از رست" },

  fAbout: {
    en: "A two-drum roastery in SE Portland. We buy from six farm partners we visit every harvest, and roast every bag to order — never to stock.",
    fa: "یک رستری دو درامه در جنوب‌شرق پورتلند. از شش مزرعهٔ همکار خرید می‌کنیم که هر برداشت به دیدن‌شان می‌رویم، و هر بسته را بر اساس سفارش رست می‌کنیم — هرگز برای انبار.",
  },
  fChipTrade: { en: "Direct trade", fa: "تجارت مستقیم" },
  fChipB: { en: "B-Corp pending", fa: "در مسیر بی‌کورپ" },
  fChipBags: { en: "Compostable bags", fa: "بسته‌های کمپوست‌پذیر" },
  fVisitH: { en: "Visit the roastery", fa: "بازدید از رستری" },
  fHours: { en: "Wed–Sun · 8:00–16:00", fa: "چهارشنبه تا یکشنبه · ۸ تا ۱۶" },
  fRoastDays: { en: "Roast days: Tue & Fri", fa: "روزهای رست: سه‌شنبه و جمعه" },
  fKnowH: { en: "Good to know", fa: "دانستنی‌ها" },
  fKnow1: { en: "Free shipping over $40", fa: "ارسال رایگان بالای ۴۰ دلار" },
  fKnow2: { en: "Roasted to order, ships in 48h", fa: "رست بر اساس سفارش، ارسال در ۴۸ ساعت" },
  fKnow3: { en: "Brew support with every bag", fa: "پشتیبانی دم، همراه هر بسته" },
  fKnow4: { en: "6 farm partners, 4 countries", fa: "۶ مزرعهٔ همکار، ۴ کشور" },
  fListH: { en: "The roast list", fa: "فهرست رست" },
  fListBody: {
    en: "One email when a fresh crop lands. No drip campaigns — just drips.",
    fa: "هر وقت بار تازه برسد، یک ایمیل. بدون کمپین خبرنامه‌ای — فقط قطره‌های قهوه.",
  },
  fListPh: { en: "you@example.com", fa: "شما@مثال.com" },
  fListAria: { en: "Email for the roast list", fa: "ایمیل برای فهرست رست" },
  fSubAria: { en: "Subscribe", fa: "عضویت" },
  fToast: {
    en: "You're on the roast list — first dispatch next Tuesday.",
    fa: "به فهرست رست پیوستید — اولین ارسال، سه‌شنبهٔ آینده.",
  },
  fDemo: { en: "Demo storefront · no real orders are placed", fa: "فروشگاه نمایشی · هیچ سفارش واقعی ثبت نمی‌شود" },

  /* ---------- masthead ---------- */
  mEyebrow: { en: "Roastery ledger", fa: "دفترچهٔ رستری" },
  mLoc: { en: "SE Portland · est. 2017", fa: "جنوب‌شرق پورتلند · تأسیس ۲۰۱۷" },
  mLine1: { en: "Six coffees.", fa: "شش قهوه." },
  m2a: { en: "One", fa: "یک" },
  m2em: { en: "12-kilo", fa: "دوازده‌کیلویی" },
  m2b: { en: "drum.", fa: "درام." },
  mLine3: { en: "Zero shortcuts.", fa: "صفر میان‌بر." },
  mPara: {
    en: "We keep the shelf deliberately short. Every lot below was cupped last Friday, scored above 86, and will leave the roastery within 48 hours of the roast — because coffee is produce, not pantry filler.",
    fa: "قفسه را عمداً کوتاه نگه می‌داریم. هر لاتِ زیر، جمعهٔ گذشته کاپینگ شده، بالای ۸۶ امتیاز گرفته و تا ۴۸ ساعت پس از رست از رستری بیرون می‌رود — چون قهوه یک محصول تازه است، نه پُرکنندهٔ کابینت.",
  },
  mStat1v: { en: "12 kg", fa: "۱۲ کیلو" },
  mStat1l: { en: "batch drum", fa: "درامِ بچ" },
  mStat2v: { en: "92.4", fa: "۹۲٫۴" },
  mStat2l: { en: "avg. score", fa: "میانگین امتیاز" },
  mStat3v: { en: "6", fa: "۶" },
  mStat3l: { en: "farm partners", fa: "مزرعهٔ همکار" },
  mStat4v: { en: "48 h", fa: "۴۸ ساعت" },
  mStat4l: { en: "roast to ship", fa: "از رست تا ارسال" },
  mCta1: { en: "Browse the shelf", fa: "دیدن قفسه" },
  mCta2: { en: "How we buy", fa: "روش خرید ما" },
  barToday: { en: "On the bar today", fa: "امروز روی بار" },
  ticket: { en: "Ticket", fa: "رسید" },
  viewTicket: { en: "View ticket", fa: "دیدن رسید" },

  /* ---------- filter bar ---------- */
  searchPh: {
    en: "Search beans, notes, origins… try “jasmine”",
    fa: "جست‌وجوی دانه، نت‌های طعمی، خاستگاه… مثلاً «یاس»",
  },
  searchAria: { en: "Search coffees", fa: "جست‌وجوی قهوه‌ها" },
  clearSearch: { en: "Clear search", fa: "پاک کردن جست‌وجو" },
  showing: { en: "{n} of {m} coffees", fa: "{n} از {m} قهوه" },
  sortAria: { en: "Sort coffees", fa: "مرتب‌سازی قهوه‌ها" },
  sortFeatured: { en: "Sort · Featured", fa: "مرتب‌سازی · پیشنهادی" },
  sortPriceAsc: { en: "Price · Low to high", fa: "قیمت · کم به زیاد" },
  sortPriceDesc: { en: "Price · High to low", fa: "قیمت · زیاد به کم" },
  sortRoast: { en: "Roast · Light to dark", fa: "رست · روشن به تیره" },
  catAll: { en: "Everything", fa: "همه" },
  catSingle: { en: "Single Origin", fa: "تک‌خاستگاه" },
  catBlend: { en: "Blend", fa: "ترکیبی" },
  catEspresso: { en: "Espresso", fa: "اسپرسو" },
  catDecaf: { en: "Decaf", fa: "بدون کافئین" },

  /* ---------- shelf ---------- */
  sEyebrow: { en: "01 — The shelf", fa: "۰۱ — قفسه" },
  sTitleA: { en: "This week on", fa: "این هفته روی" },
  sTitleB: { en: "the shelf", fa: "قفسه" },
  sSideFiltered: {
    en: "Showing matches from this week's roast schedule.",
    fa: "نتایج مطابق برنامهٔ رست این هفته.",
  },
  sSideDefault: {
    en: "Six lots, roasted Tuesday, shipped by Thursday. When a lot sells through, it's gone until next harvest.",
    fa: "شش لات؛ سه‌شنبه رست می‌شوند و تا پنجشنبه راهی می‌شوند. وقتی لات تمام شود، تا برداشت بعدی خبری نیست.",
  },
  emptyTitle: { en: "The pot came up empty", fa: "قهوه‌جوش خالی درآمد" },
  emptyBody: {
    en: "No coffees match that combination. Try a tasting note like “cacao”, or clear the filters.",
    fa: "قهوه‌ای با این ترکیب پیدا نشد. یک نت طعمی مثل «کاکائو» را امتحان کنید یا فیلترها را پاک کنید.",
  },
  emptyCta: { en: "Clear search & filters", fa: "پاک کردن جست‌وجو و فیلترها" },

  /* ---------- ledger ---------- */
  lEyebrow: { en: "02 — Our ledger", fa: "۰۲ — دفتر ما" },
  lTitleA: { en: "The ledger we keep", fa: "دفتری که" },
  lTitleEm: { en: "honest.", fa: "صادقانه" },
  lTitleB: { en: "", fa: "نگه می‌داریم." },
  lPara: {
    en: "Specialty coffee asks you to trust a lot of adjectives. We'd rather show the arithmetic — four entries we balance every single season.",
    fa: "قهوهٔ تخصصی از شما می‌خواهد به کلی صفت اعتماد کنید. ما ترجیح می‌دهیم حساب‌وکتاب را نشان دهیم — چهار قلمی که هر فصل تراز می‌کنیم.",
  },
  lAudit: { en: "Audited at every harvest", fa: "حسابرسی در هر برداشت" },
  l1t: { en: "Roasted to order", fa: "رست بر اساس سفارش" },
  l1b: {
    en: "Bags leave within 48 hours of the drum. Order Monday, taste Tuesday's roast by Thursday — with the roast date stamped, not hidden.",
    fa: "بسته‌ها تا ۴۸ ساعت بعد از درام راهی می‌شوند. دوشنبه سفارش بدهید، پنجشنبه رستِ سه‌شنبه را بنوشید — با تاریخ رستِ مهرشده، نه پنهان.",
  },
  l2t: { en: "Rested, never rushed", fa: "استراحت‌داده، نه عجله‌کرده" },
  l2b: {
    en: "Every lot is cupped blind on Friday and only shelved above 86 points. If a batch drifts, it becomes staff coffee — not your coffee.",
    fa: "هر لات، جمعه‌ها کور کاپینگ می‌شود و فقط بالای ۸۶ امتیاز روی قفسه می‌آید. اگر بچ‌ای از معیار فاصله بگیرد، قهوهٔ بچه‌های کارگاه می‌شود — نه قهوهٔ شما.",
  },
  l3t: { en: "Paid at the farm gate", fa: "پرداخت، دربِ مزرعه" },
  l3b: {
    en: "We publish what we pay. This season's average was $3.85 per pound of green — roughly double the C-market — on multi-year contracts.",
    fa: "مبلغ خرید را منتشر می‌کنیم. میانگین این فصل، ۳٫۸۵ دلار برای هر پوند سبز بود — حدود دو برابر بازار جهانی — با قراردادهای چندساله.",
  },
  l4t: { en: "Brew support included", fa: "همراه با پشتیبانی دم" },
  l4b: {
    en: "A dial-in card ships in every bag, and our bar team answers brew questions within a day. Stuck at 1:16? We'll dial it together.",
    fa: "در هر بسته یک کارت دستور دم هست و تیم بار، ظرف یک روز به سؤال‌های دم پاسخ می‌دهد. روی ۱:۱۶ گیر کرده‌اید؟ با هم تنظیمش می‌کنیم.",
  },

  /* ---------- product card ---------- */
  roastTag: { en: "{r} roast", fa: "رست {r}" },
  lowStock: { en: "Low stock", fa: "موجودی کم" },
  viewDetails: { en: "View details", fa: "دیدن جزئیات" },
  per250: { en: "/ 250 g", fa: "/ ۲۵۰ گرم" },
  add: { en: "Add", fa: "افزودن" },
  added: { en: "Added", fa: "اضافه شد" },
  addAria: { en: "Add {name} to cart", fa: "افزودن {name} به سبد" },

  /* ---------- product detail ---------- */
  closeDetails: { en: "Close details", fa: "بستن جزئیات" },
  lotLine: { en: "{cat} · Lot №{lot}", fa: "{cat} · لات شمارهٔ {lot}" },
  cupsLogged: { en: "cups logged", fa: "فنجان ثبت‌شده" },
  specOrigin: { en: "Origin", fa: "خاستگاه" },
  specProducer: { en: "Producer", fa: "تولیدکننده" },
  specProcess: { en: "Process", fa: "فرآوری" },
  specAltitude: { en: "Altitude", fa: "ارتفاع" },
  specVarietal: { en: "Varietal", fa: "واریته" },
  specDialIn: { en: "Dial-in", fa: "دستور دم" },
  tastesLike: { en: "Tastes like", fa: "طعم‌هایی مثل" },
  bagSize: { en: "Bag size", fa: "اندازهٔ بسته" },
  w250: { en: "250 g", fa: "۲۵۰ گرم" },
  w1000: { en: "1 kg", fa: "۱ کیلوگرم" },
  grindL: { en: "Grind", fa: "آسیاب" },
  gWhole: { en: "Whole bean", fa: "دانهٔ کامل" },
  gFilter: { en: "Filter", fa: "فیلتر" },
  gEspresso: { en: "Espresso", fa: "اسپرسو" },
  addToCart: { en: "Add to cart — {m}", fa: "افزودن به سبد — {m}" },
  detailFoot: {
    en: "Compostable bag · roasted this Tuesday · ships in 48h",
    fa: "بستهٔ کمپوست‌پذیر · رستِ این سه‌شنبه · ارسال در ۴۸ ساعت",
  },
  decAria: { en: "Decrease quantity", fa: "کاهش تعداد" },
  incAria: { en: "Increase quantity", fa: "افزایش تعداد" },

  /* ---------- cart drawer ---------- */
  yourCrate: { en: "Your crate", fa: "سبد شما" },
  nItems: { en: "{n} items", fa: "{n} قلم" },
  closeCart: { en: "Close cart", fa: "بستن سبد" },
  shipUnlocked: { en: "Free shipping unlocked", fa: "ارسال رایگان فعال شد" },
  shipAwayPre: { en: "", fa: "تا ارسال رایگان " },
  shipAwaySuf: { en: " away from free shipping", fa: " مانده" },
  shipGoal: { en: "{m} goal", fa: "هدف: {m}" },
  cartEmptyTitle: { en: "Nothing brewing yet", fa: "هنوز چیزی دم نشده" },
  cartEmptyBody: {
    en: "Your crate is empty. The shelf, however, is full.",
    fa: "سبدتان خالی است؛ ولی قفسه پر است.",
  },
  backToShelf: { en: "Back to the shelf", fa: "بازگشت به قفسه" },
  each: { en: "each", fa: "هر کدام" },
  removeAria: { en: "Remove {name}", fa: "حذف {name}" },
  subtotal: { en: "Subtotal", fa: "جمع جزء" },
  shipping: { en: "Shipping", fa: "ارسال" },
  free: { en: "Free", fa: "رایگان" },
  total: { en: "Total", fa: "جمع کل" },
  checkoutCta: { en: "Simulated checkout — {m}", fa: "پرداخت آزمایشی — {m}" },
  demoNote: { en: "Demo · no card is ever charged", fa: "نمایشی · هیچ کارتی شارژ نمی‌شود" },
  cartAria: { en: "Shopping cart", fa: "سبد خرید" },

  /* ---------- checkout ---------- */
  coEyebrow: { en: "Simulated checkout", fa: "پرداخت آزمایشی" },
  coTitle: { en: "Settle the tab", fa: "تسویهٔ حساب" },
  coClose: { en: "Close checkout", fa: "بستن صفحهٔ پرداخت" },
  coAria: { en: "Checkout", fa: "پرداخت" },
  coShipFree: { en: "· free", fa: "· رایگان" },
  lbName: { en: "Full name", fa: "نام و نام خانوادگی" },
  lbEmail: { en: "Email", fa: "ایمیل" },
  lbAddress: { en: "Street address", fa: "نشانی" },
  lbCity: { en: "City", fa: "شهر" },
  lbZip: { en: "ZIP", fa: "کد پستی" },
  lbCard: { en: "Card number", fa: "شمارهٔ کارت" },
  lbExp: { en: "Expiry", fa: "انقضا" },
  lbCvc: { en: "CVC", fa: "CVC" },
  phName: { en: "Frankie Bean", fa: "سارا محمدی" },
  phAddress: { en: "2140 SE Ankeny St", fa: "خیابان ولیعصر، پلاک ۱۲" },
  phCity: { en: "Portland", fa: "تهران" },
  phZip: { en: "97214", fa: "۱۴۳۵۸۶۴۷۱۱" },
  errRequired: { en: "Required", fa: "الزامی" },
  errEmail: { en: "Valid email needed", fa: "ایمیل معتبر لازم است" },
  err16: { en: "16 digits", fa: "۱۶ رقم" },
  errExp: { en: "MM/YY", fa: "MM/YY" },
  errCvc: { en: "3–4 digits", fa: "۳ تا ۴ رقم" },
  payCta: { en: "Pay {m} — it's pretend", fa: "پرداخت {m} — نمایشی" },
  payNote: {
    en: "Demo checkout · nothing is charged or stored",
    fa: "پرداخت نمایشی · هیچ چیزی شارژ یا ذخیره نمی‌شود",
  },
  pm1: { en: "Warming up the grinder…", fa: "در حال گرم کردن آسیاب…" },
  pm2: { en: "Contacting the bank…", fa: "در حال تماس با بانک…" },
  pm3: { en: "Reserving your roast slot…", fa: "در حال رزرو نوبت رست…" },
  pm4: { en: "Stamping the bag…", fa: "در حال مهر زدن روی بسته…" },
  coOrderLine: { en: "Order {id} · {n} items", fa: "سفارش {id} · {n} قلم" },
  doneTitle: { en: "Order's on the drum.", fa: "سفارش رفت روی درام." },
  yourInbox: { en: "your inbox", fa: "صندوق ورودی‌تان" },
  chip1: { en: "Roast day: Tuesday", fa: "روز رست: سه‌شنبه" },
  chip2: { en: "Ships within 48h", fa: "ارسال تا ۴۸ ساعت" },
  chip3: { en: "Dial-in card included", fa: "کارت دستور دم، همراه بسته" },

  /* ---------- app toasts ---------- */
  toastAdded: { en: "{name} · added to your crate", fa: "{name} · به سبد اضافه شد" },
} satisfies Record<string, Bi>;

export type TKey = keyof typeof DICT;

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */
interface I18nValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  /** Translate a dictionary key, substituting `{var}` placeholders. */
  t: (key: TKey, vars?: Record<string, string | number>) => string;
  /** Pick the current-language value from a bilingual pair. */
  bi: (b: Bi) => string;
  /** Format a USD amount: `$19.50` / `۱۹٫۵ دلار` */
  money: (n: number) => string;
  /** Format a plain number, Persian digits under `fa`. */
  num: (n: number) => string;
}

const Ctx = createContext<I18nValue | null>(null);

function detectLang(): Lang {
  try {
    const stored = window.localStorage.getItem("eo-lang");
    if (stored === "fa" || stored === "en") return stored;
  } catch {
    /* ignore */
  }
  return typeof navigator !== "undefined" &&
    navigator.language?.toLowerCase().startsWith("fa")
    ? "fa"
    : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectLang);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "fa" ? "rtl" : "ltr";
    document.title = DICT.docTitle[lang];
    try {
      window.localStorage.setItem("eo-lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const t: I18nValue["t"] = (key, vars) => {
    let s: string = DICT[key][lang];
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.split(`{${k}}`).join(lang === "fa" && typeof v === "number" ? faDigits(v) : String(v));
      }
    }
    return s;
  };

  const bi: I18nValue["bi"] = (b) => b[lang];

  const money: I18nValue["money"] = (n) => {
    if (lang === "en") return `$${n.toFixed(2)}`;
    const s =
      n % 1 === 0 ? String(n) : n.toFixed(2).replace(/0$/, "").replace(/\.$/, "");
    return `${faDigits(s.replace(".", "٫"))} دلار`;
  };

  const num: I18nValue["num"] = (n) => (lang === "fa" ? faDigits(n) : String(n));

  return (
    <Ctx.Provider value={{ lang, dir: lang === "fa" ? "rtl" : "ltr", setLang, t, bi, money, num }}>
      {children}
    </Ctx.Provider>
  );
}

export function useI18n(): I18nValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside <I18nProvider>");
  return v;
}
