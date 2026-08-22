import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import {
  PRODUCTS,
  MASTHEAD_IMG,
  CATEGORIES,
  money,
  type Product,
  type Category,
} from "../data/products";
import { Reveal } from "../lib/hooks";
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
              <span>Roastery ledger</span>
              <span className="h-px w-8 bg-ember-500/50" />
              <span className="text-cream-600">SE Portland · est. 2017</span>
            </p>
          </Reveal>

          <h1 className="mt-6 font-display text-cream-100 font-semibold tracking-[-0.02em] leading-[0.99] text-[clamp(2.9rem,7.2vw,5.6rem)]">
            <span className="mask-line" style={{ "--d": "80ms" } as CSSProperties}>
              <span>Six coffees.</span>
            </span>
            <span className="mask-line" style={{ "--d": "220ms" } as CSSProperties}>
              <span>
                One <em className="font-light italic text-ember-400">12-kilo</em> drum.
              </span>
            </span>
            <span className="mask-line" style={{ "--d": "360ms" } as CSSProperties}>
              <span className="text-cream-400">Zero shortcuts.</span>
            </span>
          </h1>

          <Reveal delay={200}>
            <p className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-cream-500">
              We keep the shelf deliberately short. Every lot below was cupped last
              Friday, scored above 86, and will leave the roastery within 48 hours
              of the roast — because coffee is produce, not pantry filler.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <dl className="mt-9 grid grid-cols-2 sm:grid-cols-4 border-y border-cream-100/10 divide-x divide-cream-100/10 max-w-xl">
              {[
                ["12 kg", "batch drum"],
                ["92.4", "avg. score"],
                ["6", "farm partners"],
                ["48 h", "roast to ship"],
              ].map(([v, l]) => (
                <div key={l} className="py-4 pr-4 first:pl-0 pl-4 sm:pl-5">
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-2xl sm:text-[1.7rem] font-semibold text-cream-100">{v}</dd>
                  <dd className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cream-600">{l}</dd>
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
                Browse the shelf
                <ArrowRightIcon size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#ledger"
                className="inline-flex items-center gap-2 rounded-full border border-cream-100/15 px-6 py-3 text-sm font-semibold text-cream-300 transition-all duration-300 hover:border-ember-500/50 hover:text-ember-400"
              >
                How we buy
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
                alt="Pour-over coffee brewing on the bar at Ember & Oak"
                className="kenburns h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-roast-950 via-roast-950/35 to-roast-950/10" />
            </div>

            <Steam className="absolute right-6 top-5 h-14 w-14 text-cream-200/70" />

            <div className="absolute top-5 left-5 flex items-center gap-2 rounded-full bg-roast-950/70 backdrop-blur-sm border border-cream-100/12 px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ember-500" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-300">On the bar today</span>
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
                    Ticket №{String(idx + 1).padStart(2, "0")} · {current.category}
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
                <h3 className="mt-2.5 font-display text-2xl font-semibold text-cream-100">{current.name}</h3>
                <p className="mt-1.5 text-sm text-cream-500">
                  {current.notes.join(" · ")}
                </p>
                <div className="mt-3.5 flex items-center justify-between">
                  <span className="font-display text-lg font-semibold text-ember-400">{money(current.price)}</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream-400 group-hover:text-ember-400 transition-colors">
                    View ticket <ArrowRightIcon size={13} />
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
  category: "All" | Category;
  onCategory: (c: "All" | Category) => void;
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
            <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-600 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search beans, notes, origins… try “jasmine”"
              className="field !pl-10 !pr-9 !py-2.5 !rounded-full !text-sm"
              aria-label="Search coffees"
            />
            {query && (
              <button
                onClick={() => onQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 grid place-items-center w-6 h-6 rounded-full text-cream-500 hover:text-cream-100 hover:bg-cream-100/10 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <CloseIcon size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 md:ml-auto">
            <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.16em] text-cream-600">
              {total} of {PRODUCTS.length} coffees
            </span>
            <label className="relative inline-flex items-center">
              <SlidersIcon size={15} className="absolute left-3 text-cream-600 pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => onSort(e.target.value as SortKey)}
                className="field !w-auto !pl-9 !pr-8 !py-2 !rounded-full !text-[13px] appearance-none cursor-pointer"
                aria-label="Sort coffees"
              >
                <option value="featured">Sort · Featured</option>
                <option value="price-asc">Price · Low to high</option>
                <option value="price-desc">Price · High to low</option>
                <option value="roast">Roast · Light to dark</option>
              </select>
              <svg viewBox="0 0 12 8" className="absolute right-3 w-2.5 text-cream-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.6">
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
                {c === "All" ? "Everything" : c}
                <span className={`font-mono text-[10px] ${active ? "text-roast-950/70" : "text-cream-600"}`}>
                  {counts[c] ?? 0}
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
            alt={`${product.name} — coffee bag`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-roast-950/70 via-transparent to-roast-950/10" />

          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
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
                {product.badge.label}
              </span>
            )}
            {product.stock === "low" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-roast-950/75 backdrop-blur-sm border border-cherry-500/40 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-cherry-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cherry-400 animate-pulse" />
                Low stock
              </span>
            )}
          </div>

          <span className="absolute top-3 right-3 rounded-full bg-roast-950/75 backdrop-blur-sm border border-cream-100/12 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-cream-300">
            {product.roastName} roast
          </span>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-300">View details</span>
            <span className="grid place-items-center w-7 h-7 rounded-full bg-ember-500 text-roast-950">
              <ArrowRightIcon size={13} />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember-500/90">
            {product.category} · {product.origin.split(",")[0]}
          </p>
          <h3 className="mt-1.5 font-display text-[1.35rem] leading-tight font-semibold text-cream-100 transition-colors group-hover:text-ember-300">
            {product.name}
          </h3>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {product.notes.map((n) => (
              <span key={n} className="rounded-full border border-cream-100/10 bg-roast-900/60 px-2.5 py-0.5 text-[11.5px] text-cream-400">
                {n}
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
              <span className="ml-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cream-600">/ 250 g</span>
            </div>
            <button
              onClick={handleAdd}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-bold transition-all duration-300 cursor-pointer active:scale-95 ${
                pulsed
                  ? "add-pulse border-ember-500 bg-ember-500 text-roast-950"
                  : "border-ember-500/50 text-ember-400 hover:bg-ember-500 hover:text-roast-950"
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              {pulsed ? <CheckIcon size={14} /> : <PlusIcon size={14} />}
              {pulsed ? "Added" : "Add"}
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
  return (
    <section id="shelf" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 scroll-mt-36">
      <Reveal>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-ember-500">01 — The shelf</p>
            <h2 className="mt-2.5 font-display text-3xl sm:text-[2.6rem] font-semibold text-cream-100 tracking-tight leading-tight">
              This week on <em className="italic font-light text-ember-400">the shelf</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-cream-500 leading-relaxed">
            {filtered
              ? "Showing matches from this week's roast schedule."
              : "Six lots, roasted Tuesday, shipped by Thursday. When a lot sells through, it's gone until next harvest."}
          </p>
        </div>
      </Reveal>

      {products.length === 0 ? (
        <Reveal className="mt-10">
          <div className="rounded-[13px] border border-dashed border-cream-100/15 bg-roast-900/50 px-6 py-16 text-center">
            <CupIcon size={40} className="mx-auto text-cream-600" />
            <h3 className="mt-4 font-display text-2xl font-semibold text-cream-200">The pot came up empty</h3>
            <p className="mt-2 text-sm text-cream-500 max-w-sm mx-auto">
              No coffees match that combination. Try a tasting note like “cacao”, or clear the filters.
            </p>
            <button
              onClick={onReset}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2.5 text-sm font-bold text-roast-950 transition-all hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Clear search &amp; filters
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
const LEDGER_ROWS = [
  {
    n: "01",
    icon: FlameIcon,
    title: "Roasted to order",
    body: "Bags leave within 48 hours of the drum. Order Monday, taste Tuesday's roast by Thursday — with the roast date stamped, not hidden.",
  },
  {
    n: "02",
    icon: DropIcon,
    title: "Rested, never rushed",
    body: "Every lot is cupped blind on Friday and only shelved above 86 points. If a batch drifts, it becomes staff coffee — not your coffee.",
  },
  {
    n: "03",
    icon: GlobeIcon,
    title: "Paid at the farm gate",
    body: "We publish what we pay. This season's average was $3.85 per pound of green — roughly double the C-market — on multi-year contracts.",
  },
  {
    n: "04",
    icon: KettleIcon,
    title: "Brew support included",
    body: "A dial-in card ships in every bag, and our bar team answers brew questions within a day. Stuck at 1:16? We'll dial it together.",
  },
];

export function LedgerBand() {
  return (
    <section id="ledger" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="lg:sticky lg:top-40 lg:self-start">
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-ember-500">02 — Our ledger</p>
          <h2 className="mt-2.5 font-display text-3xl sm:text-[2.6rem] font-semibold text-cream-100 tracking-tight leading-[1.05]">
            The ledger we<br />
            keep <em className="italic font-light text-ember-400">honest</em>.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-cream-500">
            Specialty coffee asks you to trust a lot of adjectives. We'd rather show
            the arithmetic — four entries we balance every single season.
          </p>
          <div className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-cream-100/12 px-4 py-2 text-cream-400">
            <BeanIcon size={15} className="text-ember-500" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em]">Audited at every harvest</span>
          </div>
        </Reveal>

        <div className="border-t border-cream-100/10">
          {LEDGER_ROWS.map((row, i) => (
            <Reveal key={row.n} delay={i * 80}>
              <div className="group grid grid-cols-[auto_1fr_auto] items-start gap-4 sm:gap-6 border-b border-cream-100/10 py-6 sm:py-7 px-2 sm:px-4 transition-all duration-300 hover:bg-roast-875/80 hover:px-5 sm:hover:px-6 rounded-[10px]">
                <span className="font-mono text-sm text-ember-500 pt-1">{row.n}</span>
                <div>
                  <h3 className="font-display text-xl sm:text-[1.45rem] font-semibold text-cream-100 group-hover:text-ember-300 transition-colors">
                    {row.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-500 max-w-lg">{row.body}</p>
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
