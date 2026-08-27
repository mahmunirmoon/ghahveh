import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import {
  PRODUCTS,
  MASTHEAD_IMG,
  CATEGORY_KEYS,
  priceFor,
  type Product,
  type CategoryKey,
} from "../data/products";
import { Reveal } from "../lib/hooks";
import { useI18n, type TKey } from "../i18n";
import {
  BeanIcon,
  ArrowRightIcon,
  SearchIcon,
  CloseIcon,
  PlusIcon,
  CheckIcon,
  StarIcon,
  FlameIcon,
  GlobeIcon,
  KettleIcon,
  DropIcon,
  SlidersIcon,
  RoastMeter,
  CupIcon,
} from "./Icons";

const CAT_LABEL: Record<CategoryKey, TKey> = {
  single: "catSingle",
  blend: "catBlend",
  espresso: "catEspresso",
  decaf: "catDecaf",
};

/* ---------------- animated steam ---------------- */
export function Steam({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={`steam ${className}`} fill="none" aria-hidden="true">
      <path d="M20 46c-3-5 3-8 0-14s3-9 0-14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M31 48c-3.5-6 3.5-9.5 0-16.5s3.5-10.5 0-16.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M42 46c-3-5 3-8 0-14s3-9 0-14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- masthead ---------------- */
export function Masthead({ onOpen }: { onOpen: (p: Product) => void }) {
  const { t, bi, money, lang, num } = useI18n();
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    timer.current = window.setInterval(() => setIdx((i) => (i + 1) % PRODUCTS.length), 4600);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  const current = PRODUCTS[idx];

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-14">
      <div className="grid items-stretch gap-8 lg:grid-cols-[1.12fr_0.88fr]">
        {/* left — the manifesto */}
        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.26em] text-ember-500">
              <span>{t("mEyebrow")}</span>
              <span className="h-px w-8 bg-ember-500/50" />
              <span className="text-cream-600">{t("mLoc")}</span>
            </p>
          </Reveal>

          <h1 className="mt-6 font-display text-cream-100 font-semibold tracking-[-0.02em] leading-[0.99] text-[clamp(2.9rem,7.2vw,5.6rem)]">
            <span className="mask-line" style={{ "--d": "80ms" } as CSSProperties}>
              <span>{t("mLine1")}</span>
            </span>
            <span className="mask-line" style={{ "--d": "220ms" } as CSSProperties}>
              <span>
                {lang === "en" ? (
                  <>One <em className="not-italic font-light italic text-ember-400">12-kilo</em> drum.</>
                ) : (
                  <>یک درام <em className="not-italic font-light text-ember-400">دوازده‌کیلویی</em>.</>
                )}
              </span>
            </span>
            <span className="mask-line" style={{ "--d": "360ms" } as CSSProperties}>
              <span className="text-cream-400">{t("mLine3")}</span>
            </span>
          </h1>

          <Reveal delay={200}>
            <p className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-cream-500">
              {t("mPara")}
            </p>
          </Reveal>

          <Reveal delay={320}>
            <dl className="mt-9 grid grid-cols-2 sm:grid-cols-4 border-y border-cream-100/10 divide-x divide-cream-100/10 rtl:divide-x-reverse max-w-xl">
              {([
                ["mStat1v", "mStat1l"],
                ["mStat2v", "mStat2l"],
                ["mStat3v", "mStat3l"],
                ["mStat4v", "mStat4l"],
              ] as [TKey, TKey][]).map(([v, l], i) => (
                <div key={l} className={`py-4 pe-4 ${i === 0 ? "ps-0" : "ps-4 sm:ps-5"}`}>
                  <dt className="sr-only">{t(l)}</dt>
                  <dd className="font-display text-2xl sm:text-[1.7rem] font-semibold text-cream-100">{t(v)}</dd>
                  <dd className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cream-600">{t(l)}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={430}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#shelf"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ember-500 px-6 py-3 text-sm font-bold text-roast-950 transition-all duration-300 hover:bg-ember-400 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(225,154,56,0.55)] active:translate-y-0"
              >
                {t("mCta1")}
                <ArrowRightIcon size={16} className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:-scale-x-100" />
              </a>
              <a
                href="#ledger"
                className="inline-flex items-center gap-2 rounded-full border border-cream-100/15 px-6 py-3 text-sm font-semibold text-cream-300 transition-all duration-300 hover:border-ember-500/50 hover:text-ember-400"
              >
                {t("mCta2")}
              </a>
            </div>
          </Reveal>
        </div>

        {/* right — on the bar */}
        <Reveal delay={250} className="h-full">
          <div className="group relative h-full min-h-[420px] lg:min-h-0 overflow-hidden rounded-[14px] border border-cream-100/10">
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={MASTHEAD_IMG}
                alt={bi({ en: "Pour-over coffee brewing on the bar at Ember & Oak", fa: "دم قهوه به روش کم‌اُور روی بار امبر و اوک" })}
                className="kenburns h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-roast-950 via-roast-950/35 to-roast-950/10" />
            </div>

            <Steam className="absolute end-6 top-5 h-14 w-14 text-cream-200/70" />

            <div className="absolute top-5 start-5 flex items-center gap-2 rounded-full bg-roast-950/70 backdrop-blur-sm border border-cream-100/12 px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ember-500" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-300">{t("barToday")}</span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <div
                key={current.id}
                className="ticket-swap cursor-pointer rounded-[12px] border border-cream-100/12 bg-roast-900/85 backdrop-blur-md p-4 sm:p-5 transition-colors hover:border-ember-500/50"
                onClick={() => onOpen(current)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onOpen(current)}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember-500">
                    {t("ticket")} {lang === "fa" ? num(idx + 1).padStart(2, "۰") : String(idx + 1).padStart(2, "0")} · {t(CAT_LABEL[current.category])}
                  </p>
                  <div className="flex gap-1.5" aria-hidden="true">
                    {PRODUCTS.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1 rounded-full transition-all duration-500 ${i === idx ? "w-5 bg-ember-500" : "w-2.5 bg-cream-100/25"}`}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="mt-2.5 font-display text-2xl font-semibold text-cream-100">{bi(current.name)}</h3>
                <p className="mt-1.5 text-sm text-cream-500">
                  {current.notes.map((n) => bi(n)).join(" · ")}
                </p>
                <div className="mt-3.5 flex items-center justify-between">
                  <span className="font-display text-lg font-semibold text-ember-400">{money(current.price)}</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream-400 group-hover:text-ember-400 transition-colors">
                    {t("viewTicket")} <ArrowRightIcon size={13} className="rtl:-scale-x-100" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- filter bar ---------------- */
export type SortKey = "featured" | "price-asc" | "price-desc" | "roast";
export type CategorySel = "all" | CategoryKey;

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
  const { t, num } = useI18n();
  return (
    <div className="sticky top-16 z-30 border-y border-cream-100/8 bg-roast-950/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <SearchIcon size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-cream-600 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder={t("searchPh")}
              className="field !ps-10 !pe-9 !py-2.5 !rounded-full !text-sm"
              aria-label={t("searchAria")}
            />
            {query && (
              <button
                onClick={() => onQuery("")}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 grid place-items-center w-6 h-6 rounded-full text-cream-500 hover:text-cream-100 hover:bg-cream-100/10 transition-colors cursor-pointer"
                aria-label={t("clearSearch")}
              >
                <CloseIcon size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 md:ms-auto">
            <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.16em] text-cream-600">
              {t("showing", { n: total, m: PRODUCTS.length })}
            </span>
            <label className="relative inline-flex items-center">
              <SlidersIcon size={15} className="absolute start-3 text-cream-600 pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => onSort(e.target.value as SortKey)}
                className="field !w-auto !ps-9 !pe-8 !py-2 !rounded-full !text-[13px] appearance-none cursor-pointer"
                aria-label={t("sortAria")}
              >
                <option value="featured">{t("sortFeatured")}</option>
                <option value="price-asc">{t("sortPriceAsc")}</option>
                <option value="price-desc">{t("sortPriceDesc")}</option>
                <option value="roast">{t("sortRoast")}</option>
              </select>
              <svg viewBox="0 0 12 8" className="absolute end-3 w-2.5 text-cream-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="m1 1.5 5 5 5-5" />
              </svg>
            </label>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-0.5">
          {(["all", ...CATEGORY_KEYS] as CategorySel[]).map((c) => {
            const active = category === c;
            const label = c === "all" ? t("catAll") : t(CAT_LABEL[c]);
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
                {label}
                <span className={`font-mono text-[10px] ${active ? "text-roast-950/70" : "text-cream-600"}`}>
                  {num(counts[c] ?? 0)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- product card ---------------- */
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
  const { t, bi, money } = useI18n();
  const [pulsed, setPulsed] = useState(false);

  const handleAdd = (e: ReactMouseEvent) => {
    e.stopPropagation();
    onAdd(product);
    setPulsed(true);
    window.setTimeout(() => setPulsed(false), 650);
  };

  return (
    <Reveal as="article" delay={(index % 3) * 90} className="h-full">
      <div
        className="group relative flex h-full flex-col overflow-hidden rounded-[13px] border border-cream-100/9 bg-roast-875 transition-all duration-500 hover:-translate-y-1.5 hover:border-ember-500/40 hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.7)] cursor-pointer"
        onClick={() => onOpen(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") onOpen(product);
        }}
      >
        <div className="relative aspect-[4/3.4] overflow-hidden">
          <img
            src={product.img}
            alt={`${bi(product.name)} — ${bi({ en: "coffee bag", fa: "بستهٔ قهوه" })}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-roast-950/70 via-transparent to-roast-950/10" />

          <div className="absolute top-3 start-3 flex flex-col items-start gap-1.5">
            {product.badge && (
              <span
                className={`rounded-full px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] font-medium ${
                  product.badge.tone === "leaf"
                    ? "bg-leaf-500/90 text-roast-950"
                    : product.badge.tone === "cherry"
                      ? "bg-cherry-500/90 text-cream-100"
                      : "bg-ember-500/95 text-roast-950"
                }`}
              >
                {bi(product.badge.label)}
              </span>
            )}
            {product.stock === "low" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-roast-950/75 backdrop-blur-sm border border-cherry-500/40 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-cherry-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cherry-400 animate-pulse" />
                {t("lowStock")}
              </span>
            )}
          </div>

          <span className="absolute top-3 end-3 rounded-full bg-roast-950/75 backdrop-blur-sm border border-cream-100/12 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-cream-300">
            {t("roastTag", { r: bi(product.roastName) })}
          </span>

          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-300">{t("viewDetails")}</span>
            <span className="grid place-items-center w-7 h-7 rounded-full bg-ember-500 text-roast-950">
              <ArrowRightIcon size={13} className="rtl:-scale-x-100" />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember-500/90">
            {t(CAT_LABEL[product.category])} · {bi(product.origin).split("،")[0].split(",")[0]}
          </p>
          <h3 className="mt-1.5 font-display text-[1.35rem] leading-tight font-semibold text-cream-100 transition-colors group-hover:text-ember-300">
            {bi(product.name)}
          </h3>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {product.notes.map((n) => (
              <span key={n.en} className="rounded-full border border-cream-100/10 bg-roast-900/60 px-2.5 py-0.5 text-[11.5px] text-cream-400">
                {bi(n)}
              </span>
            ))}
          </div>

          <div className="mt-3.5 flex items-center gap-2.5 text-ember-400">
            <RoastMeter level={product.roast} />
            <span className="flex items-center gap-1 text-cream-500 text-xs">
              <StarIcon size={12} className="text-ember-400" />
              {product.rating.toFixed(1)}
              <span className="text-cream-700">({product.reviews})</span>
            </span>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between">
            <div>
              <span className="font-display text-xl font-semibold text-cream-100">{money(product.price)}</span>
              <span className="ms-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cream-600">{t("per250")}</span>
            </div>
            <button
              onClick={handleAdd}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-bold transition-all duration-300 cursor-pointer active:scale-95 ${
                pulsed
                  ? "add-pulse border-ember-500 bg-ember-500 text-roast-950"
                  : "border-ember-500/50 text-ember-400 hover:bg-ember-500 hover:text-roast-950"
              }`}
              aria-label={t("addAria", { name: bi(product.name) })}
            >
              {pulsed ? <CheckIcon size={14} /> : <PlusIcon size={14} />}
              {pulsed ? t("added") : t("add")}
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- shelf section ---------------- */
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
  const { t } = useI18n();
  return (
    <section id="shelf" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 scroll-mt-36">
      <Reveal>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-ember-500">{t("sEyebrow")}</p>
            <h2 className="mt-2.5 font-display text-3xl sm:text-[2.6rem] font-semibold text-cream-100 tracking-tight leading-tight">
              {t("sTitleA")} <em className="italic font-light text-ember-400">{t("sTitleB")}</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-cream-500 leading-relaxed">
            {filtered ? t("sSideFiltered") : t("sSideDefault")}
          </p>
        </div>
      </Reveal>

      {products.length === 0 ? (
        <Reveal className="mt-10">
          <div className="rounded-[13px] border border-dashed border-cream-100/15 bg-roast-900/50 px-6 py-16 text-center">
            <CupIcon size={40} className="mx-auto text-cream-600" />
            <h3 className="mt-4 font-display text-2xl font-semibold text-cream-200">{t("emptyTitle")}</h3>
            <p className="mt-2 text-sm text-cream-500 max-w-sm mx-auto">{t("emptyBody")}</p>
            <button
              onClick={onReset}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2.5 text-sm font-bold text-roast-950 transition-all hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {t("emptyCta")}
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

/* ---------------- ledger band ---------------- */
const LEDGER_ROWS: { n: string; icon: typeof FlameIcon; title: TKey; body: TKey }[] = [
  { n: "01", icon: FlameIcon, title: "l1t", body: "l1b" },
  { n: "02", icon: DropIcon, title: "l2t", body: "l2b" },
  { n: "03", icon: GlobeIcon, title: "l3t", body: "l3b" },
  { n: "04", icon: KettleIcon, title: "l4t", body: "l4b" },
];

export function LedgerBand() {
  const { t, lang, num } = useI18n();
  return (
    <section id="ledger" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="lg:sticky lg:top-40 lg:self-start">
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-ember-500">{t("lEyebrow")}</p>
          <h2 className="mt-2.5 font-display text-3xl sm:text-[2.6rem] font-semibold text-cream-100 tracking-tight leading-[1.05]">
            {lang === "en" ? (
              <>The ledger we keep <em className="italic font-light text-ember-400">honest.</em></>
            ) : (
              <>دفتری که <em className="font-light text-ember-400">صادقانه</em> نگه می‌داریم.</>
            )}
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-cream-500">{t("lPara")}</p>
          <div className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-cream-100/12 px-4 py-2 text-cream-400">
            <BeanIcon size={15} className="text-ember-500" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em]">{t("lAudit")}</span>
          </div>
        </Reveal>

        <div className="border-t border-cream-100/10">
          {LEDGER_ROWS.map((row, i) => (
            <Reveal key={row.n} delay={i * 80}>
              <div className="group grid grid-cols-[auto_1fr_auto] items-start gap-4 sm:gap-6 border-b border-cream-100/10 py-6 sm:py-7 px-2 sm:px-4 transition-all duration-300 hover:bg-roast-875/80 hover:px-5 sm:hover:px-6 rounded-[10px]">
                <span className="font-mono text-sm text-ember-500 pt-1">{num(i + 1).padStart(2, lang === "fa" ? "۰" : "0")}</span>
                <div>
                  <h3 className="font-display text-xl sm:text-[1.45rem] font-semibold text-cream-100 group-hover:text-ember-300 transition-colors">
                    {t(row.title)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-500 max-w-lg">{t(row.body)}</p>
                </div>
                <span className="grid place-items-center w-11 h-11 rounded-full border border-cream-100/12 text-ember-400 transition-all duration-500 group-hover:border-ember-500/60 group-hover:bg-ember-500 group-hover:text-roast-950 group-hover:rotate-6 mt-1">
                  <row.icon size={19} />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
