import { useEffect, useMemo, useRef, useState } from "react";
import {
  HERO_IMG,
  CATEGORIES,
  CATEGORY_LABEL,
  type Product,
  type ProductCategory,
} from "../data/products";
import { BUSINESS, SUPPLIERS, CUSTOMERS } from "../data/business";
import { faDigits, formatToman } from "../lib/format";
import { Reveal } from "../lib/hooks";
import { useStore } from "../lib/store";
import {
  BeanIcon,
  ArrowRightIcon,
  SearchIcon,
  CloseIcon,
  PlusIcon,
  CheckIcon,
  FlameIcon,
  GlobeIcon,
  KettleIcon,
  DropIcon,
  SlidersIcon,
  CupIcon,
} from "./Icons";
import { AlertIcon, PencilIcon, PhoneIcon } from "./AdminIcons";

/* ---------------- بخار متحرک ---------------- */
export function Steam({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={`steam ${className}`} fill="none" aria-hidden="true">
      <path d="M20 46c-3-5 3-8 0-14s3-9 0-14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M31 48c-3.5-6 3.5-9.5 0-16.5s3.5-10.5 0-16.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M42 46c-3-5 3-8 0-14s3-9 0-14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- سرصفحه ---------------- */
export function Masthead({ onOpen, onAdmin }: { onOpen: (p: Product) => void; onAdmin: () => void }) {
  const { products } = useStore();
  const featured = useMemo(
    () => products.filter((p) => p.category !== "drink").slice(0, 8),
    [products],
  );
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (featured.length === 0) return;
    timer.current = window.setInterval(() => setIdx((i) => (i + 1) % featured.length), 4600);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [featured.length]);

  const current = featured[idx % Math.max(1, featured.length)];

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-14">
      <div className="grid items-stretch gap-8 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.2em] text-ember-500">
              <span>{BUSINESS.name}</span>
              <span className="h-px w-8 bg-ember-500/50" />
              <span className="text-cream-600">جاده امیرکبیر، کاشان</span>
            </p>
          </Reveal>

          <h1 className="mt-6 font-display text-cream-100 leading-[1.25] text-[clamp(2.15rem,8.5vw,5rem)]">
            <span className="mask-line" style={{ "--d": "80ms" } as React.CSSProperties}>
              <span>دانهٔ مرغوب،</span>
            </span>
            <span className="mask-line" style={{ "--d": "220ms" } as React.CSSProperties}>
              <span>
                رستِ <em className="not-italic text-ember-400">تازه</em>،
              </span>
            </span>
            <span className="mask-line" style={{ "--d": "360ms" } as React.CSSProperties}>
              <span className="text-cream-400">به سبکِ کاشان.</span>
            </span>
          </h1>

          <Reveal delay={200}>
            <p className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-cream-500">
              از دانهٔ سبز تا فنجان شما؛ دانه‌ها هر هفته در مجموعه رست می‌شوند و همان
              روز به دست مشتری می‌رسند. فروش خرده برای خانه و فروش عمده برای کافه‌ها،
              رستوران‌ها و هتل‌های کاشان.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <dl className="mt-9 grid grid-cols-2 sm:grid-cols-4 border-y border-cream-100/10 divide-x divide-x-reverse divide-cream-100/10 max-w-xl">
              {[
                [faDigits(products.length), "محصول فعال"],
                [faDigits(SUPPLIERS.length), "تأمین‌کننده"],
                [faDigits(CUSTOMERS.filter((c) => c.type === "wholesale").length), "مشتری عمده"],
                ["همان روز", "ارسال در کاشان"],
              ].map(([v, l]) => (
                <div key={l} className="py-4 ps-4 sm:ps-5 first:ps-0">
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-2xl sm:text-[1.6rem] text-cream-100">{v}</dd>
                  <dd className="mt-0.5 font-mono text-[10px] tracking-[0.14em] text-cream-600">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={430}>
            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
              <a
                href="#shelf"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-ember-500 px-6 py-3.5 min-h-[48px] text-sm font-bold text-roast-950 transition-all duration-300 hover:bg-ember-400 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(225,154,56,0.55)] active:translate-y-0"
              >
                مشاهدهٔ محصولات
                <ArrowRightIcon size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
              </a>
              <button
                onClick={onAdmin}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-100/15 px-6 py-3.5 min-h-[48px] text-sm font-semibold text-cream-300 transition-all duration-300 hover:border-ember-500/50 hover:text-ember-400 cursor-pointer"
              >
                پنل مدیریت مجموعه
              </button>
            </div>
          </Reveal>
        </div>

        {/* پیشنهاد امروز */}
        <Reveal delay={250} className="h-full">
          <div className="group relative h-full min-h-[420px] lg:min-h-0 overflow-hidden rounded-[14px] border border-cream-100/10">
            <div className="absolute inset-0 overflow-hidden">
              <img src={HERO_IMG} alt="آماده‌سازی قهوه در مجموعه قهوه کاشان" className="kenburns h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-roast-950 via-roast-950/35 to-roast-950/10" />
            </div>

            <Steam className="absolute left-6 top-5 h-14 w-14 text-cream-200/70" />

            <div className="absolute top-5 right-5 flex items-center gap-2 rounded-full bg-roast-950/70 backdrop-blur-sm border border-cream-100/12 px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ember-500" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.16em] text-cream-300">پیشنهاد امروز</span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              {current && (
                <div
                  key={current.id}
                  className="ticket-swap cursor-pointer rounded-[12px] border border-cream-100/12 bg-roast-900/85 backdrop-blur-md p-4 sm:p-5 transition-colors hover:border-ember-500/50"
                  onClick={() => onOpen(current)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && onOpen(current)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[10px] tracking-[0.18em] text-ember-500">
                      {CATEGORY_LABEL[current.category]} · {current.pack}
                    </p>
                    <div className="flex gap-1.5" aria-hidden="true">
                      {featured.map((_, i) => (
                        <span
                          key={i}
                          className={`h-1 rounded-full transition-all duration-500 ${i === idx % featured.length ? "w-5 bg-ember-500" : "w-2.5 bg-cream-100/25"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <h3 className="mt-2.5 font-display text-2xl text-cream-100">{current.name}</h3>
                  <p className="mt-1.5 text-sm text-cream-500 line-clamp-2">{current.desc}</p>
                  <div className="mt-3.5 flex items-center justify-between">
                    <span className="font-display text-lg text-ember-400">{formatToman(current.price)}</span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] text-cream-400 transition-colors group-hover:text-ember-400">
                      مشاهدهٔ محصول <ArrowRightIcon size={13} />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- نوار فیلتر ---------------- */
export type SortKey = "featured" | "price-asc" | "price-desc";
export type CategorySel = "all" | ProductCategory;

export function FilterBar({
  query,
  onQuery,
  category,
  onCategory,
  sort,
  onSort,
  counts,
  total,
}: {
  query: string;
  onQuery: (q: string) => void;
  category: CategorySel;
  onCategory: (c: CategorySel) => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  counts: Record<string, number>;
  total: number;
}) {
  return (
    <div className="sticky top-16 z-30 border-y border-cream-100/8 bg-roast-950/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <SearchIcon size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-600 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="جست‌وجوی محصول… مثلاً «عربیکا» یا «سیروپ»"
              className="field !pr-10 !pl-9 !py-2.5 !rounded-full !text-sm"
              aria-label="جست‌وجوی محصولات"
            />
            {query && (
              <button
                onClick={() => onQuery("")}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 grid place-items-center w-6 h-6 rounded-full text-cream-500 hover:text-cream-100 hover:bg-cream-100/10 transition-colors cursor-pointer"
                aria-label="پاک کردن جست‌وجو"
              >
                <CloseIcon size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 md:mr-auto">
            <span className="hidden sm:inline font-mono text-[11px] tracking-[0.12em] text-cream-600">
              {faDigits(total)} از {faDigits(counts.all ?? 0)} محصول
            </span>
            <label className="relative inline-flex items-center">
              <SlidersIcon size={15} className="absolute right-3 text-cream-600 pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => onSort(e.target.value as SortKey)}
                className="field !w-auto !pr-9 !pl-8 !py-2 !rounded-full !text-[13px] appearance-none cursor-pointer"
                aria-label="مرتب‌سازی محصولات"
              >
                <option value="featured">مرتب‌سازی: پیش‌فرض</option>
                <option value="price-asc">ارزان‌ترین</option>
                <option value="price-desc">گران‌ترین</option>
              </select>
              <svg viewBox="0 0 12 8" className="absolute left-3 w-2.5 text-cream-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="m1 1.5 5 5 5-5" />
              </svg>
            </label>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-0.5">
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => onCategory(c)}
                className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-all duration-300 cursor-pointer ${
                  active
                    ? "border-ember-500 bg-ember-500 text-roast-950 shadow-[0_4px_18px_-6px_rgba(225,154,56,0.6)]"
                    : "border-cream-100/12 text-cream-400 hover:border-ember-500/50 hover:text-ember-400 hover:-translate-y-px"
                }`}
                aria-pressed={active}
              >
                {c === "all" ? "همه" : CATEGORY_LABEL[c]}
                <span className={`font-mono text-[10px] ${active ? "text-roast-950/70" : "text-cream-600"}`}>
                  {faDigits(counts[c] ?? 0)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- کارت محصول ---------------- */
export function ProductCard({
  product,
  onOpen,
  onAdd,
  index,
}: {
  product: Product;
  onOpen: (p: Product) => void;
  onAdd: (p: Product) => void;
  index: number;
}) {
  const [pulsed, setPulsed] = useState(false);
  const out = product.category !== "drink" && product.stock <= 0;
  const low = product.category !== "drink" && !out && product.stock <= product.minStock;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (out) return;
    onAdd(product);
    setPulsed(true);
    window.setTimeout(() => setPulsed(false), 650);
  };

  return (
    <Reveal as="article" delay={(index % 3) * 90} className="h-full">
      <div
        className={`group relative flex h-full flex-col overflow-hidden rounded-[13px] border border-cream-100/9 bg-roast-875 transition-all duration-500 hover:-translate-y-1.5 hover:border-ember-500/40 hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.7)] cursor-pointer ${out ? "opacity-70" : ""}`}
        onClick={() => onOpen(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") onOpen(product);
        }}
      >
        <div className="relative aspect-[4/3.1] overflow-hidden">
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-roast-950/70 via-transparent to-roast-950/10" />

          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            <span className="rounded-full bg-roast-950/75 backdrop-blur-sm border border-cream-100/12 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.1em] text-cream-300">
              {CATEGORY_LABEL[product.category]}
            </span>
            {low && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-roast-950/75 backdrop-blur-sm border border-cherry-500/40 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.1em] text-cherry-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cherry-400 animate-pulse" />
                رو به اتمام
              </span>
            )}
            {out && (
              <span className="rounded-full bg-roast-950/80 border border-cream-100/15 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.1em] text-cream-400">
                ناموجود
              </span>
            )}
          </div>

          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <span className="font-mono text-[10px] tracking-[0.14em] text-cream-300">جزئیات محصول</span>
            <span className="grid place-items-center w-7 h-7 rounded-full bg-ember-500 text-roast-950">
              <ArrowRightIcon size={13} />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="font-mono text-[10px] tracking-[0.16em] text-ember-500/90">
            {product.pack} · {product.unit}
          </p>
          <h3 className="mt-1.5 font-display text-[1.3rem] leading-tight text-cream-100 transition-colors group-hover:text-ember-300">
            {product.name}
          </h3>

          <p className="mt-2 text-[12.5px] leading-relaxed text-cream-500 line-clamp-2">{product.desc}</p>

          <div className="mt-auto pt-4 flex items-center justify-between">
            <div>
              <span className="font-display text-xl text-cream-100">{formatToman(product.price)}</span>
            </div>
            <button
              onClick={handleAdd}
              disabled={out}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-bold transition-all duration-300 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                pulsed
                  ? "add-pulse border-ember-500 bg-ember-500 text-roast-950"
                  : "border-ember-500/50 text-ember-400 hover:bg-ember-500 hover:text-roast-950"
              }`}
              aria-label={`افزودن ${product.name} به سبد`}
            >
              {pulsed ? <CheckIcon size={14} /> : <PlusIcon size={14} />}
              {pulsed ? "اضافه شد" : "افزودن"}
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- قفسهٔ محصولات ---------------- */
export function Shelf({
  products,
  onOpen,
  onAdd,
  onReset,
  filtered,
}: {
  products: Product[];
  onOpen: (p: Product) => void;
  onAdd: (p: Product) => void;
  onReset: () => void;
  filtered: boolean;
}) {
  return (
    <section id="shelf" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 scroll-mt-36">
      <Reveal>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-ember-500">۰۱ — قفسهٔ فروشگاه</p>
            <h2 className="mt-2.5 font-display text-3xl sm:text-[2.4rem] text-cream-100 leading-tight">
              محصولات <em className="text-ember-400">این هفته</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-cream-500 leading-relaxed">
            {filtered
              ? "نتایج جست‌وجو و فیلترهای شما از میان محصولات مجموعه."
              : "دانه‌های تازهٔ رست، پودرهای آماده، سیروپ و تجهیزات — همه با قیمت تومان و ارسال در کاشان."}
          </p>
        </div>
      </Reveal>

      {products.length === 0 ? (
        <Reveal className="mt-10">
          <div className="rounded-[13px] border border-dashed border-cream-100/15 bg-roast-900/50 px-6 py-16 text-center">
            <CupIcon size={40} className="mx-auto text-cream-600" />
            <h3 className="mt-4 font-display text-2xl text-cream-200">چیزی پیدا نشد</h3>
            <p className="mt-2 text-sm text-cream-500 max-w-sm mx-auto">
              محصولی با این مشخصات در قفسه نیست. عبارت دیگری مثل «عربیکا» را امتحان کنید یا فیلترها را پاک کنید.
            </p>
            <button
              onClick={onReset}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2.5 text-sm font-bold text-roast-950 transition-all hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              پاک کردن جست‌وجو و فیلترها
            </button>
          </div>
        </Reveal>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onOpen={onOpen} onAdd={onAdd} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- چرا ما (دفتر افتخارات مجموعه) ---------------- */
const REASONS = [
  {
    n: "۰۱",
    icon: FlameIcon,
    title: "رست تازهٔ هفتگی",
    body: "دانه‌ها هر دوشنبه و پنجشنبه رست می‌شوند و تاریخ رست روی هر بسته درج می‌شود؛ قهوهٔ مانده در کار ما نیست.",
  },
  {
    n: "۰۲",
    icon: DropIcon,
    title: "تأمین مستقیم و شفاف",
    body: "با هفت بازرگانی معتبر در تهران، اصفهان و کاشان کار می‌کنیم و دانهٔ هر فصل را پیش از خرید، کاپینگ می‌کنیم.",
  },
  {
    n: "۰۳",
    icon: GlobeIcon,
    title: "فروش عمده به کافه‌ها",
    body: "برای کافه‌ها، رستوران‌ها، هتل‌ها و فروشگاه‌های کاشان قیمت عمده، ارسال منظم و پشتیبانی دم‌آوری داریم.",
  },
  {
    n: "۰۴",
    icon: KettleIcon,
    title: "همراهی بعد از خرید",
    body: "تنظیم آسیاب، نسبت دم و روش درست هر نوشیدنی را رایگان آموزش می‌دهیم؛ تلفنی یا حضوری در مجموعه.",
  },
];

export function AboutBand() {
  return (
    <section id="ledger" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="lg:sticky lg:top-40 lg:self-start">
          <p className="font-mono text-[11px] tracking-[0.2em] text-ember-500">۰۲ — چرا مجموعه قهوه کاشان؟</p>
          <h2 className="mt-2.5 font-display text-3xl sm:text-[2.4rem] text-cream-100 leading-[1.2]">
            دفتری که رویش
            <br />
            <em className="text-ember-400">حساب</em> می‌شود.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-cream-500">
            قهوه برای ما فقط کالا نیست؛ اعتبار ماست. چهار اصلی که از روز اولِ راه‌اندازی
            در جاده امیرکبیر، زیرشان را امضا کرده‌ایم.
          </p>
          <div className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-cream-100/12 px-4 py-2 text-cream-400">
            <BeanIcon size={15} className="text-ember-500" />
            <span className="font-mono text-[11px] tracking-[0.14em]">مدیریت: {BUSINESS.manager}</span>
          </div>
        </Reveal>

        <div className="border-t border-cream-100/10">
          {REASONS.map((row, i) => (
            <Reveal key={row.n} delay={i * 80}>
              <div className="group grid grid-cols-[auto_1fr_auto] items-start gap-4 sm:gap-6 border-b border-cream-100/10 py-6 sm:py-7 px-2 sm:px-4 transition-all duration-300 hover:bg-roast-875/80 hover:px-5 sm:hover:px-6 rounded-[10px]">
                <span className="font-mono text-sm text-ember-500 pt-1">{row.n}</span>
                <div>
                  <h3 className="font-display text-xl sm:text-[1.35rem] text-cream-100 group-hover:text-ember-300 transition-colors">
                    {row.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-500 max-w-lg">{row.body}</p>
                </div>
                <span className="grid place-items-center w-11 h-11 rounded-full border border-cream-100/12 text-ember-400 transition-all duration-500 group-hover:border-ember-500/60 group-hover:bg-ember-500 group-hover:text-roast-950 group-hover:-rotate-6 mt-1">
                  <row.icon size={19} />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* نوار تأمین‌کنندگان */}
      <Reveal className="mt-14">
        <div className="rounded-[13px] border border-cream-100/10 bg-roast-900/50 p-5 sm:p-6">
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-cream-500">
            <AlertIcon size={14} className="text-ember-500" />
            تأمین‌کنندگان رسمی مجموعه
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {SUPPLIERS.map((s) => (
              <span
                key={s.id}
                className="rounded-full border border-cream-100/12 bg-roast-875/70 px-4 py-1.5 text-[12.5px] text-cream-400 transition-colors hover:border-ember-500/40 hover:text-ember-300"
              >
                {s.name} <span className="text-cream-700">· {s.city}</span>
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- درباره ما ---------------- */
export function AboutUs() {
  return (
    <section id="about" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
        {/* کارت اعتبار طراحی — سمت راست */}
        <Reveal>
          <div className="group relative overflow-hidden rounded-[16px] border border-ember-500/25 bg-roast-900/70 p-5 sm:p-9 transition-all duration-500 hover:border-ember-500/50 hover:-translate-y-1">
            {/* هالهٔ نور پس‌زمینه */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-ember-500/10 blur-3xl transition-all duration-700 group-hover:bg-ember-500/16" />

            <div className="relative flex items-start gap-3.5 sm:gap-4">
              <span className="grid place-items-center w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full border border-ember-500/40 bg-ember-500/10 text-ember-400 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                <PencilIcon size={22} />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[11px] tracking-[0.2em] text-ember-500">طراحی و توسعه</p>
                <h3 className="mt-2 font-display text-xl sm:text-2xl lg:text-[1.7rem] text-cream-100 leading-[1.5] sm:leading-snug">
                  این سایت توسط هستی صدرایی، از شاگردان خانم دکتر ماه منیر آقایی، طراحی شده است.
                </h3>
              </div>
            </div>

            <div className="relative mt-6 sm:mt-7 border-t border-dashed border-cream-100/12 pt-5 sm:pt-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-[15px] leading-relaxed text-cream-400">
                  با تشکر از آموزش‌های خوبتان.
                </p>
                <div className="flex items-center gap-3 shrink-0">
                  <Steam className="w-8 h-8 text-ember-500/70" />
                  <div className="text-left">
                    <p className="font-display text-lg text-ember-300 leading-tight">هستی صدرایی</p>
                    <p className="font-mono text-[10px] tracking-[0.14em] text-cream-600 mt-0.5">
                      شاگرد خانم دکتر ماه منیر آقایی
                    </p>
                  </div>
                </div>
              </div>

              {/* شماره تماس استاد — قابل لمس برای تماس مستقیم */}
              <a
                href="tel:+971551544988"
                className="group/phone flex items-center justify-between gap-3 rounded-[12px] border border-ember-500/25 bg-ember-500/[0.07] px-4 py-3 transition-all duration-300 hover:border-ember-500/60 hover:bg-ember-500/[0.14] hover:-translate-y-0.5 active:translate-y-0"
                aria-label="تماس با استاد: 00971551544988"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="grid place-items-center w-10 h-10 shrink-0 rounded-full border border-ember-500/40 bg-ember-500/10 text-ember-400 transition-transform duration-300 group-hover/phone:scale-110 group-hover/phone:-rotate-6">
                    <PhoneIcon size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] tracking-[0.16em] text-cream-500">
                      شماره تماس استاد
                    </span>
                    <span dir="ltr" className="block text-left font-mono text-[15px] sm:text-base font-semibold text-cream-100 tracking-[0.04em] mt-0.5 truncate">
                      00971551544988
                    </span>
                  </span>
                </span>
                <span className="shrink-0 rounded-full border border-ember-500/30 bg-ember-500/12 px-3.5 py-1.5 font-mono text-[10.5px] tracking-[0.12em] text-ember-300 transition-colors duration-300 group-hover/phone:bg-ember-500 group-hover/phone:text-roast-950">
                  تماس
                </span>
              </a>
            </div>
          </div>
        </Reveal>

        {/* ستون عنوان — سمت چپ */}
        <Reveal delay={120} className="lg:sticky lg:top-40 lg:self-start">
          <p className="font-mono text-[11px] tracking-[0.2em] text-ember-500">۰۳ — درباره ما</p>
          <h2 className="mt-2.5 font-display text-3xl sm:text-[2.4rem] text-cream-100 leading-[1.2]">
            پشتِ هر فنجان،
            <br />
            یک <em className="text-ember-400">دست</em> و یک دل.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-cream-500">
            مجموعه قهوه کاشان از جاده امیرکبیر شروع شد؛ جایی که عطر دانهٔ تازه با
            مهمان‌نوازی کاشانی گره خورد. این صفحه، تقدیم به کسانی است که این مسیر را
            ممکن کردند.
          </p>
          <div className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-cream-100/12 px-4 py-2 text-cream-400">
            <CupIcon size={16} className="text-ember-500" />
            <span className="font-mono text-[11px] tracking-[0.14em]">با عشق، از کاشان</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
