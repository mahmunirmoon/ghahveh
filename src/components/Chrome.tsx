import { useState, type FormEvent } from "react";
import { BeanIcon, CartIcon, ArrowRightIcon, GlobeIcon, TruckIcon, CalendarIcon, CupIcon } from "./Icons";
import { nextRoastDate } from "../data/products";
import { useI18n, type Lang } from "../i18n";

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
export function Ticker() {
  const { t, lang } = useI18n();
  const items = [
    t("tickerRoast", { d: nextRoastDate(lang) }),
    t("tickerShip"),
    t("tickerCrop"),
    t("tickerBatch"),
    t("tickerCup"),
    t("tickerTrade"),
    t("tickerFast"),
  ];
  const row = (hidden: boolean) => (
    <div className="flex items-center shrink-0" aria-hidden={hidden || undefined}>
      {items.map((txt, i) => (
        <span key={i} className="flex items-center gap-3 px-5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cream-500 whitespace-nowrap">
          <BeanIcon size={11} className="text-ember-500 shrink-0" />
          {txt}
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

/* ---------------- language switch ---------------- */
export function LangSwitch() {
  const { lang, setLang } = useI18n();
  const opt = (l: Lang, label: string) => (
    <button
      onClick={() => setLang(l)}
      className={`px-2.5 py-1 rounded-full text-[11px] transition-all duration-300 cursor-pointer ${
        lang === l
          ? "bg-ember-500 text-roast-950 font-bold shadow-[0_2px_10px_-2px_rgba(225,154,56,0.7)]"
          : "text-cream-500 font-semibold hover:text-cream-200"
      }`}
      aria-pressed={lang === l}
      aria-label={l === "fa" ? "تغییر زبان به فارسی" : "Switch language to English"}
    >
      {label}
    </button>
  );
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-cream-100/12 bg-roast-850 p-0.5" role="group" aria-label="Language">
      {opt("en", "EN")}
      {opt("fa", "فارسی")}
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
  const { t, num } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-cream-100/8 bg-roast-950/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <a href="#top" className="group flex items-center gap-3 min-w-0">
          <span className="grid place-items-center w-9 h-9 rounded-full border border-ember-500/40 bg-ember-500/10 text-ember-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105 shrink-0">
            <BeanIcon size={18} />
          </span>
          <span className="leading-none min-w-0">
            <span className="block font-display font-semibold text-cream-100 text-lg tracking-tight truncate">
              Ember <span className="text-ember-500">&amp;</span> Oak
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-cream-600 mt-0.5">
              {t("brandSub")}
            </span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7 font-mono text-[12px] uppercase tracking-[0.16em] text-cream-400">
          {[
            [t("navShelf"), "#shelf"],
            [t("navLedger"), "#ledger"],
            [t("navVisit"), "#visit"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="relative py-1 transition-colors hover:text-ember-400 after:absolute after:start-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-ember-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <LangSwitch />
          <button
            onClick={onCartOpen}
            className="relative flex items-center gap-2 rounded-full border border-cream-100/12 bg-roast-850 px-4 py-2 text-sm font-semibold text-cream-100 transition-all duration-300 hover:border-ember-500/60 hover:bg-roast-800 hover:-translate-y-px active:translate-y-0 cursor-pointer"
            aria-label={t("openCartAria", { n: cartCount })}
          >
            <CartIcon size={18} className="text-ember-400" />
            <span className="hidden sm:inline">{t("cart")}</span>
            {cartCount > 0 && (
              <span
                key={cartCount}
                className="badge-pop absolute -top-1.5 -end-1.5 grid place-items-center min-w-[20px] h-5 px-1 rounded-full bg-ember-500 text-roast-950 font-mono text-[11px] font-semibold"
              >
                {num(cartCount)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------------- footer ---------------- */
export function Footer({ onToast }: { onToast: (msg: string) => void }) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onToast(t("fToast"));
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
            <p className="mt-4 text-sm leading-relaxed text-cream-500 max-w-xs">{t("fAbout")}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[t("fChipTrade"), t("fChipB"), t("fChipBags")].map((chip) => (
                <span key={chip} className="rounded-full border border-cream-100/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cream-500">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-500">{t("fVisitH")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-400">
              <li>2140 SE Ankeny St<br />Portland, OR 97214</li>
              <li className="text-cream-500">{t("fHours")}</li>
              <li className="text-cream-500">{t("fRoastDays")}</li>
              <li><a href="tel:+15035550117" dir="ltr" className="hover:text-ember-400 transition-colors">(503) 555-0117</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-500">{t("fKnowH")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                [TruckIcon, t("fKnow1")],
                [CalendarIcon, t("fKnow2")],
                [CupIcon, t("fKnow3")],
                [GlobeIcon, t("fKnow4")],
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
            <h4 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-500">{t("fListH")}</h4>
            <p className="mt-4 text-sm text-cream-500">{t("fListBody")}</p>
            <form onSubmit={submit} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("fListPh")}
                className="field flex-1 !py-2.5 text-sm"
                aria-label={t("fListAria")}
              />
              <button
                type="submit"
                className="grid place-items-center rounded-[10px] bg-ember-500 px-3.5 text-roast-950 transition-all hover:bg-ember-400 active:scale-95 cursor-pointer"
                aria-label={t("fSubAria")}
              >
                <ArrowRightIcon size={18} className="rtl:-scale-x-100" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream-100/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream-700">
            © {new Date().getFullYear()} Ember &amp; Oak Roasting Co.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream-700">
            {t("fDemo")}
          </p>
        </div>
      </div>
    </footer>
  );
}
