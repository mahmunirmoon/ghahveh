import { useState, type FormEvent } from "react";
import { BeanIcon, CartIcon } from "./Icons";
import { PhoneIcon, MapPinIcon, CashIcon, TrendUpIcon, StoreIcon } from "./AdminIcons";
import { BUSINESS } from "../data/business";
import { faDigits } from "../lib/format";

export type ViewKey = "shop" | "admin";

/* ---------------- پس‌زمینهٔ محیطی ---------------- */
export function BackgroundFX() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bean-dots" />
      <div className="absolute -top-40 -right-40 w-[60vw] h-[60vw] glow-amber drift-a" />
      <div className="absolute top-1/3 -left-52 w-[52vw] h-[52vw] glow-cherry drift-b" />
      <div className="absolute -bottom-64 right-1/4 w-[55vw] h-[55vw] glow-amber opacity-70 drift-b" />
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

/* ---------------- نوار متحرک خبری ---------------- */
const TICKER_ITEMS = [
  "رست تازه هر هفته — دوشنبه و پنجشنبه",
  "ارسال در کاشان و حومه",
  "فروش عمده به کافه‌ها، رستوران‌ها و هتل‌ها",
  "جاده امیرکبیر، کاشان",
  "تماس: ۰۹۱۳۷۱۰۲۴۲۶",
  "تمام قیمت‌ها به تومان",
];

export function Ticker() {
  const row = (hidden: boolean) => (
    <div className="flex items-center shrink-0" aria-hidden={hidden || undefined}>
      {TICKER_ITEMS.map((txt, i) => (
        <span
          key={i}
          className="flex items-center gap-3 px-5 py-1.5 font-mono text-[11px] tracking-[0.14em] text-cream-500 whitespace-nowrap"
        >
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

/* ---------------- هدر ---------------- */
export function Header({
  view,
  onView,
  cartCount,
  onCartOpen,
}: {
  view: ViewKey;
  onView: (v: ViewKey) => void;
  cartCount: number;
  onCartOpen: () => void;
}) {
  const goShopSection = (id: string) => {
    if (view !== "shop") {
      onView("shop");
      window.setTimeout(
        () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
        80,
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-cream-100/8 bg-roast-950/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <a href="#top" className="group flex items-center gap-3 min-w-0">
          <span className="grid place-items-center w-9 h-9 rounded-full border border-ember-500/40 bg-ember-500/10 text-ember-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105 shrink-0">
            <BeanIcon size={18} />
          </span>
          <span className="leading-none min-w-0">
            <span className="block font-display text-cream-100 text-lg leading-tight truncate">
              {BUSINESS.name}
            </span>
            <span className="block font-mono text-[10px] tracking-[0.18em] text-cream-600 mt-1">
              مدیریت: {BUSINESS.manager}
            </span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-7 font-mono text-[12px] tracking-[0.12em] text-cream-400">
          <a
            href="#shelf"
            onClick={() => goShopSection("shelf")}
            className="relative py-1 transition-colors hover:text-ember-400 after:absolute after:right-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-ember-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            قفسهٔ محصولات
          </a>
          <a
            href="#ledger"
            onClick={() => goShopSection("ledger")}
            className="relative py-1 transition-colors hover:text-ember-400 after:absolute after:right-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-ember-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            چرا ما
          </a>
          <a
            href="#visit"
            onClick={() => goShopSection("visit")}
            className="relative py-1 transition-colors hover:text-ember-400 after:absolute after:right-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-ember-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            تماس و آدرس
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          {/* سوئیچ فروشگاه / پنل مدیریت */}
          <div className="flex items-center rounded-full border border-cream-100/12 bg-roast-850 p-1">
            <button
              onClick={() => onView("shop")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 text-[12.5px] font-bold transition-all duration-300 cursor-pointer ${
                view === "shop" ? "bg-ember-500 text-roast-950" : "text-cream-400 hover:text-cream-200"
              }`}
            >
              <StoreIcon size={14} />
              <span className="hidden xs:inline sm:inline">فروشگاه</span>
            </button>
            <button
              onClick={() => onView("admin")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 text-[12.5px] font-bold transition-all duration-300 cursor-pointer ${
                view === "admin" ? "bg-ember-500 text-roast-950" : "text-cream-400 hover:text-cream-200"
              }`}
            >
              <TrendUpIcon size={14} />
              <span className="hidden xs:inline sm:inline">پنل مدیریت</span>
            </button>
          </div>

          {view === "shop" && (
            <button
              onClick={onCartOpen}
              className="relative grid place-items-center w-10 h-10 rounded-full border border-cream-100/12 bg-roast-850 text-cream-100 transition-all duration-300 hover:border-ember-500/60 hover:bg-roast-800 hover:-translate-y-px active:translate-y-0 cursor-pointer"
              aria-label={`سبد خرید، ${faDigits(cartCount)} قلم`}
            >
              <CartIcon size={18} className="text-ember-400" />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="badge-pop absolute -top-1.5 -left-1.5 grid place-items-center min-w-[20px] h-5 px-1 rounded-full bg-ember-500 text-roast-950 font-mono text-[11px] font-semibold"
                >
                  {faDigits(cartCount)}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---------------- فوتر ---------------- */
export function Footer({ onToast }: { onToast: (msg: string) => void }) {
  const [email, setEmail] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onToast("عضویت شما ثبت شد — اولین اطلاعیهٔ رست هفتهٔ آینده ارسال می‌شود.");
    setEmail("");
  };

  return (
    <footer id="visit" className="relative z-10 mt-24 border-t border-cream-100/8 bg-roast-900/60 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <BeanIcon size={20} className="text-ember-500" />
              <span className="font-display text-2xl text-cream-100">{BUSINESS.name}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream-500 max-w-xs">
              مجموعهٔ تخصصی فروش، رست و پخش قهوه در کاشان؛ تأمین‌کنندهٔ دانهٔ تازه برای
              کافه‌ها، رستوران‌ها و خانه‌های کاشانی. خرید به‌صورت حضوری و تلفنی نیز امکان‌پذیر است.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["فروش عمده", "رست تازهٔ هفتگی", "ارسال در کاشان"].map((t) => (
                <span key={t} className="rounded-full border border-cream-100/10 px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-cream-500">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[11px] tracking-[0.18em] text-ember-500">اطلاعات تماس</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-400">
              <li>مدیریت: {BUSINESS.manager}</li>
              <li className="flex items-center gap-2">
                <PhoneIcon size={15} className="text-ember-500/80 shrink-0" />
                <a href={BUSINESS.phoneHref} dir="ltr" className="hover:text-ember-400 transition-colors font-mono">
                  {BUSINESS.phoneFa}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPinIcon size={15} className="text-ember-500/80 shrink-0 mt-0.5" />
                <span>{BUSINESS.addressFull}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] tracking-[0.18em] text-ember-500">ساعت کاری</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-400">
              <li>{BUSINESS.hoursWeek}</li>
              <li>{BUSINESS.hoursFriday}</li>
              <li className="text-cream-500">{BUSINESS.roastDays}</li>
              <li className="flex items-center gap-2 text-cream-500">
                <CashIcon size={15} className="text-ember-500/80 shrink-0" />
                پرداخت: نقدی، کارت‌خوان، کارت به کارت
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] tracking-[0.18em] text-ember-500">خبرنامهٔ رست</h4>
            <p className="mt-4 text-sm text-cream-500">
              هر هفته، هم‌زمان با رست تازه، یک پیام کوتاه دریافت کنید.
            </p>
            <form onSubmit={submit} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ایمیل شما"
                className="field flex-1 !py-2.5 text-sm"
                aria-label="ایمیل برای خبرنامه"
              />
              <button
                type="submit"
                className="rounded-[10px] bg-ember-500 px-4 text-sm font-bold text-roast-950 transition-all hover:bg-ember-400 active:scale-95 cursor-pointer"
              >
                عضویت
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream-100/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[11px] tracking-[0.12em] text-cream-700">
            © {faDigits(1404)} {BUSINESS.name} — تمام حقوق محفوظ است.
          </p>
          <p className="font-mono text-[11px] tracking-[0.12em] text-cream-700">
            نسخهٔ نمایشی · <span className="text-ember-500">Kashan Coffee v2</span> · داده‌ها آزمایشی و قابل ویرایش از پنل مدیریت هستند
          </p>
        </div>
      </div>
    </footer>
  );
}
