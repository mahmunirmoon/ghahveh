import { useState, type FormEvent } from "react";
import { BeanIcon, CartIcon, ArrowRightIcon, GlobeIcon, TruckIcon, CalendarIcon, CupIcon } from "./Icons";
import { nextRoastDate } from "../data/products";

/* ---------------- ambient background ---------------- */
export function BackgroundFX() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bean-dots" />
      <div className="absolute -top-40 -left-40 w-[60vw] h-[60vw] glow-amber drift-a" />
      <div className="absolute top-1/3 -right-52 w-[52vw] h-[52vw] glow-cherry drift-b" />
      <div className="absolute -bottom-64 left-1/4 w-[55vw] h-[55vw] glow-amber opacity-70 drift-b" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, transparent 40%, rgba(10,6,3,0.55) 100%)",
        }}
      />
    </div>
  );
}

export function NoiseLayer() {
  return <div className="noise-layer" aria-hidden="true" />;
}

/* ---------------- roast-log ticker ---------------- */
const TICKER_ITEMS = [
  `Roast day — Tue ${nextRoastDate()}`,
  "Free shipping over $40",
  "Fresh crop · Ethiopia Guji landed",
  "Small batches · 12 kg drum",
  "Cupped & scored every Friday",
  "Direct trade · 6 farm partners",
  "Ships within 48h of roast",
];

export function Ticker() {
  const row = (hidden: boolean) => (
    <div className="flex items-center shrink-0" aria-hidden={hidden || undefined}>
      {TICKER_ITEMS.map((t, i) => (
        <span key={i} className="flex items-center gap-3 px-5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cream-500 whitespace-nowrap">
          <BeanIcon size={11} className="text-ember-500 shrink-0" />
          {t}
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative z-20 border-b border-cream-100/8 bg-roast-900/80 overflow-hidden">
      <div className="ticker-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/* ---------------- header ---------------- */
export function Header({
  cartCount,
  onCartOpen,
}: {
  cartCount: number;
  onCartOpen: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-100/8 bg-roast-950/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a href="#top" className="group flex items-center gap-3 min-w-0">
          <span className="grid place-items-center w-9 h-9 rounded-full border border-ember-500/40 bg-ember-500/10 text-ember-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105 shrink-0">
            <BeanIcon size={18} />
          </span>
          <span className="leading-none min-w-0">
            <span className="block font-display font-semibold text-cream-100 text-lg tracking-tight truncate">
              Ember <span className="text-ember-500">&amp;</span> Oak
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-cream-600 mt-0.5">
              Roasting Co. · PDX
            </span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7 font-mono text-[12px] uppercase tracking-[0.16em] text-cream-400">
          {[
            ["The Shelf", "#shelf"],
            ["Our Ledger", "#ledger"],
            ["Visit", "#visit"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="relative py-1 transition-colors hover:text-ember-400 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-ember-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          onClick={onCartOpen}
          className="relative flex items-center gap-2 rounded-full border border-cream-100/12 bg-roast-850 px-4 py-2 text-sm font-semibold text-cream-100 transition-all duration-300 hover:border-ember-500/60 hover:bg-roast-800 hover:-translate-y-px active:translate-y-0 cursor-pointer"
          aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
        >
          <CartIcon size={18} className="text-ember-400" />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span
              key={cartCount}
              className="badge-pop absolute -top-1.5 -right-1.5 grid place-items-center min-w-[20px] h-5 px-1 rounded-full bg-ember-500 text-roast-950 font-mono text-[11px] font-semibold"
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

/* ---------------- footer ---------------- */
export function Footer({ onToast }: { onToast: (msg: string) => void }) {
  const [email, setEmail] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onToast("You're on the roast list — first dispatch next Tuesday.");
    setEmail("");
  };

  return (
    <footer id="visit" className="relative z-10 mt-24 border-t border-cream-100/8 bg-roast-900/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <BeanIcon size={20} className="text-ember-500" />
              <span className="font-display text-2xl font-semibold text-cream-100">
                Ember <span className="text-ember-500">&amp;</span> Oak
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream-500 max-w-xs">
              A two-drum roastery in SE Portland. We buy from six farm partners we
              visit every harvest, and roast every bag to order — never to stock.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Direct trade", "B-Corp pending", "Compostable bags"].map((t) => (
                <span key={t} className="rounded-full border border-cream-100/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cream-500">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-500">Visit the roastery</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-400">
              <li>2140 SE Ankeny St<br />Portland, OR 97214</li>
              <li className="text-cream-500">Wed–Sun · 8:00–16:00</li>
              <li className="text-cream-500">Roast days: Tue &amp; Fri</li>
              <li><a href="tel:+15035550117" className="hover:text-ember-400 transition-colors">(503) 555-0117</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-500">Good to know</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                [TruckIcon, "Free shipping over $40"],
                [CalendarIcon, "Roasted to order, ships in 48h"],
                [CupIcon, "Brew support with every bag"],
                [GlobeIcon, "6 farm partners, 4 countries"],
              ].map(([Icon, label], i) => {
                const I = Icon as typeof TruckIcon;
                return (
                  <li key={i} className="flex items-center gap-2.5 text-cream-400">
                    <I size={16} className="text-ember-500/80 shrink-0" />
                    {label as string}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-500">The roast list</h4>
            <p className="mt-4 text-sm text-cream-500">
              One email when a fresh crop lands. No drip campaigns — just drips.
            </p>
            <form onSubmit={submit} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="field flex-1 !py-2.5 text-sm"
                aria-label="Email for the roast list"
              />
              <button
                type="submit"
                className="grid place-items-center rounded-[10px] bg-ember-500 px-3.5 text-roast-950 transition-all hover:bg-ember-400 active:scale-95 cursor-pointer"
                aria-label="Subscribe"
              >
                <ArrowRightIcon size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream-100/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream-700">
            © {new Date().getFullYear()} Ember &amp; Oak Roasting Co.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream-700">
            Demo storefront · no real orders are placed
          </p>
        </div>
      </div>
    </footer>
  );
}
