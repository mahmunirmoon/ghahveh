import { useEffect, useState, type FormEvent } from "react";
import {
  CATEGORY_LABEL,
  type Product,
} from "../data/products";
import { SUPPLIERS, PAYMENT_METHODS, type PaymentKey } from "../data/business";
import { faDigits, formatDate, formatToman, toEnDigits } from "../lib/format";
import { useBodyLock } from "../lib/hooks";
import { useStore } from "../lib/store";
import { Steam } from "./Shop";
import {
  CloseIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CartIcon,
  ArrowRightIcon,
  CheckIcon,
  TruckIcon,
  LockIcon,
  LeafIcon,
  BeanIcon,
} from "./Icons";

/* =============== سطرهای سبد =============== */
export interface CartLine {
  product: Product;
  qty: number;
}

export const FREE_SHIP_AT = 5_000_000;
export const FLAT_SHIP = 350_000;

export function totalsOf(lines: CartLine[]) {
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const ship = subtotal === 0 || subtotal >= FREE_SHIP_AT ? 0 : FLAT_SHIP;
  return { subtotal, ship, total: subtotal + ship };
}

function QtyStepper({
  qty,
  onChange,
  small = false,
}: {
  qty: number;
  onChange: (q: number) => void;
  small?: boolean;
}) {
  const btn = `grid place-items-center rounded-md border border-cream-100/14 text-cream-300 transition-all hover:border-ember-500/60 hover:text-ember-400 active:scale-90 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
    small ? "w-7 h-7" : "w-9 h-9"
  }`;
  return (
    <div className="inline-flex items-center gap-1.5">
      <button className={btn} onClick={() => onChange(qty - 1)} aria-label="کاهش تعداد">
        <MinusIcon size={13} />
      </button>
      <span key={qty} className={`ticket-swap text-center font-mono text-sm font-semibold text-cream-100 ${small ? "w-7" : "w-9"}`}>
        {faDigits(qty)}
      </span>
      <button className={btn} onClick={() => onChange(qty + 1)} aria-label="افزایش تعداد">
        <PlusIcon size={13} />
      </button>
    </div>
  );
}

/* =============== جزئیات محصول =============== */
export function ProductDetail({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: (p: Product, qty: number) => void;
}) {
  const [qty, setQty] = useState(1);
  useEffect(() => setQty(1), [product.id]);
  useBodyLock(true);

  const supplier = SUPPLIERS.find((s) => s.id === product.supplierId);
  const isDrink = product.category === "drink";
  const out = !isDrink && product.stock <= 0;
  const low = !isDrink && !out && product.stock <= product.minStock;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label={product.name}>
      <div className="absolute inset-0 bg-roast-950/80 backdrop-blur-sm fade-in" onClick={onClose} />
      <div className="modal-in relative w-full sm:max-w-4xl max-h-[92vh] overflow-y-auto rounded-t-[18px] sm:rounded-[16px] border border-cream-100/12 bg-roast-900 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 grid place-items-center w-9 h-9 rounded-full border border-cream-100/14 bg-roast-950/60 text-cream-300 transition-all hover:border-ember-500/60 hover:text-ember-400 hover:rotate-90 duration-300 cursor-pointer"
          aria-label="بستن جزئیات"
        >
          <CloseIcon size={16} />
        </button>

        <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
          <div className="relative h-64 sm:h-auto sm:min-h-[520px] overflow-hidden">
            <img src={product.img} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-roast-900 via-transparent to-transparent sm:bg-gradient-to-l sm:from-transparent sm:via-transparent sm:to-roast-900" />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <span className="rounded-full bg-ember-500 px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-roast-950">
                {CATEGORY_LABEL[product.category]}
              </span>
              {low && (
                <span className="rounded-full bg-roast-950/75 border border-cherry-500/40 px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-cherry-400">
                  رو به اتمام
                </span>
              )}
              {out && (
                <span className="rounded-full bg-roast-950/80 border border-cream-100/15 px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-cream-400">
                  ناموجود
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <p className="font-mono text-[11px] tracking-[0.18em] text-ember-500">
              {CATEGORY_LABEL[product.category]} · {product.pack}
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl text-cream-100 leading-[1.2]">
              {product.name}
            </h2>

            <p className="mt-4 text-[15px] leading-relaxed text-cream-400">{product.desc}</p>

            <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2.5 rounded-[11px] border border-cream-100/10 bg-roast-875/70 p-4 text-[13px]">
              {([
                ["تأمین‌کننده", supplier?.name ?? "—"],
                ["واحد فروش", product.unit],
                ["بسته‌بندی", product.pack],
                ["موجودی", isDrink ? "همیشه موجود" : `${faDigits(product.stock)} ${product.unit}`],
                ["قیمت خرید مجموعه", formatToman(product.purchasePrice)],
                ["آخرین بروزرسانی", formatDate(product.updatedAt)],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k}>
                  <p className="font-mono text-[9.5px] tracking-[0.14em] text-cream-600">{k}</p>
                  <p className="mt-0.5 text-cream-300">{v}</p>
                </div>
              ))}
            </div>

            {/* افزودن به سبد */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <QtyStepper qty={qty} onChange={(q) => setQty(Math.max(1, Math.min(12, q)))} />
              <button
                onClick={() => onAdd(product, qty)}
                disabled={out}
                className="group flex-1 min-w-[220px] inline-flex items-center justify-center gap-2.5 rounded-full bg-ember-500 px-6 py-3.5 text-sm font-bold text-roast-950 transition-all duration-300 hover:bg-ember-400 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-12px_rgba(225,154,56,0.6)] active:translate-y-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <CartIcon size={17} />
                افزودن به سبد — {formatToman(product.price * qty)}
                <ArrowRightIcon size={15} className="transition-transform group-hover:-translate-x-1" />
              </button>
            </div>

            <p className="mt-4 flex items-center gap-2 font-mono text-[10.5px] tracking-[0.1em] text-cream-600">
              <LeafIcon size={13} className="text-leaf-400" />
              ارسال در کاشان · پرداخت نقدی و کارت‌خوان در محل امکان‌پذیر است
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============== سبد خرید =============== */
export function CartDrawer({
  open,
  lines,
  onClose,
  onQty,
  onRemove,
  onCheckout,
}: {
  open: boolean;
  lines: CartLine[];
  onClose: () => void;
  onQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) {
  useBodyLock(open);
  if (!open) return null;

  const { subtotal, ship, total } = totalsOf(lines);
  const remaining = Math.max(0, FREE_SHIP_AT - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP_AT) * 100);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="سبد خرید">
      <div className="absolute inset-0 bg-roast-950/70 backdrop-blur-sm fade-in" onClick={onClose} />
      <aside className="drawer-in absolute left-0 top-0 h-full w-full max-w-md flex flex-col border-e border-cream-100/12 bg-roast-900 shadow-[30px_0_80px_-30px_rgba(0,0,0,0.8)]">
        <header className="flex items-center justify-between px-5 py-4 border-b border-cream-100/10">
          <h2 className="flex items-center gap-2.5 font-display text-xl text-cream-100">
            <CartIcon size={19} className="text-ember-400" />
            سبد خرید شما
            <span className="font-mono text-[11px] tracking-[0.1em] text-cream-600">
              {faDigits(count)} قلم
            </span>
          </h2>
          <button
            onClick={onClose}
            className="grid place-items-center w-9 h-9 rounded-full border border-cream-100/14 text-cream-300 transition-all hover:border-ember-500/60 hover:text-ember-400 hover:rotate-90 duration-300 cursor-pointer"
            aria-label="بستن سبد خرید"
          >
            <CloseIcon size={15} />
          </button>
        </header>

        {/* نوار ارسال رایگان */}
        <div className="px-5 py-3.5 border-b border-cream-100/10 bg-roast-875/60">
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="inline-flex items-center gap-2 text-cream-400">
              <TruckIcon size={15} className={remaining === 0 ? "text-leaf-400" : "text-ember-400"} />
              {remaining === 0 ? (
                <span className="text-leaf-300 font-semibold">ارسال رایگان فعال شد</span>
              ) : (
                <span>
                  تا ارسال رایگان: <strong className="text-cream-200">{formatToman(remaining)}</strong> مانده
                </span>
              )}
            </span>
            <span className="font-mono text-[10px] text-cream-600">سقف: {formatToman(FREE_SHIP_AT)}</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-roast-950/80 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${remaining === 0 ? "bg-leaf-400" : "bg-ember-500"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="h-full grid place-items-center text-center py-10">
              <div>
                <div className="relative mx-auto w-20 h-20 grid place-items-center rounded-full border border-cream-100/12 bg-roast-875">
                  <BeanIcon size={30} className="text-cream-600" />
                  <Steam className="absolute -top-5 h-8 w-8 text-cream-600/70" />
                </div>
                <h3 className="mt-5 font-display text-xl text-cream-200">سبد شما خالی است</h3>
                <p className="mt-2 text-sm text-cream-500 max-w-[240px] mx-auto">
                  هنوز قهوه‌ای انتخاب نکرده‌اید؛ قفسهٔ ما اما پر است.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2.5 text-sm font-bold text-roast-950 transition-all hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  بازگشت به فروشگاه <ArrowRightIcon size={15} />
                </button>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="ticket-swap flex gap-3.5 rounded-[11px] border border-cream-100/8 bg-roast-875/60 p-3">
                  <img src={product.img} alt={product.name} className="w-[74px] h-[88px] object-cover rounded-[8px] border border-cream-100/8" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-display text-[15px] text-cream-100 leading-snug truncate">{product.name}</h4>
                        <p className="mt-0.5 font-mono text-[10px] tracking-[0.1em] text-cream-600">
                          {product.pack} · {product.unit}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemove(product.id)}
                        className="shrink-0 grid place-items-center w-7 h-7 rounded-md text-cream-600 transition-all hover:text-cherry-400 hover:bg-cherry-500/10 cursor-pointer"
                        aria-label={`حذف ${product.name}`}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <QtyStepper small qty={qty} onChange={(q) => onQty(product.id, q)} />
                      <div className="text-end">
                        <p className="font-display text-[15px] text-ember-400">{formatToman(product.price * qty)}</p>
                        {qty > 1 && (
                          <p className="font-mono text-[9.5px] text-cream-700">هر عدد {formatToman(product.price)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-cream-100/10 px-5 py-4 bg-roast-875/70">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between text-cream-400">
                <dt>جمع اقلام</dt>
                <dd className="font-mono">{formatToman(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-cream-400">
                <dt>هزینهٔ ارسال</dt>
                <dd className={`font-mono ${ship === 0 ? "text-leaf-300" : ""}`}>{ship === 0 ? "رایگان" : formatToman(ship)}</dd>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-cream-100/10">
                <dt className="font-semibold text-cream-100">مبلغ قابل پرداخت</dt>
                <dd className="font-display text-2xl text-cream-100">{formatToman(total)}</dd>
              </div>
            </dl>
            <button
              onClick={onCheckout}
              className="mt-4 w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-ember-500 px-6 py-3.5 text-sm font-bold text-roast-950 transition-all duration-300 hover:bg-ember-400 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-12px_rgba(225,154,56,0.6)] active:translate-y-0 cursor-pointer"
            >
              <LockIcon size={16} />
              ادامه و ثبت سفارش — {formatToman(total)}
            </button>
            <p className="mt-2.5 text-center font-mono text-[10px] tracking-[0.1em] text-cream-700">
              نسخهٔ نمایشی — هیچ مبلغی واقعاً کسر نمی‌شود
            </p>
          </footer>
        )}
      </aside>
    </div>
  );
}

/* =============== پرداخت و ثبت سفارش =============== */
type Step = "form" | "processing" | "done";

const PROCESSING_MSGS = [
  "در حال ثبت سفارش…",
  "بررسی موجودی انبار…",
  "صدور فاکتور…",
  "ارسال به واحد آماده‌سازی…",
];

const ONLINE_PAYMENTS: PaymentKey[] = ["cash", "pos", "card2card", "online"];

export function CheckoutModal({
  open,
  lines,
  onClose,
  onPlaced,
}: {
  open: boolean;
  lines: CartLine[];
  onClose: () => void;
  onPlaced: (orderId: number) => void;
}) {
  const { addOrder } = useStore();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentKey>("cash");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msgIdx, setMsgIdx] = useState(0);
  const [placedId, setPlacedId] = useState(0);

  useEffect(() => {
    if (open) {
      setStep("form");
      setErrors({});
      setMsgIdx(0);
    }
  }, [open]);

  useBodyLock(open);
  if (!open) return null;

  const { ship, total } = totalsOf(lines);

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "نام الزامی است";
    const ph = toEnDigits(phone).replace(/\s/g, "");
    if (!/^09\d{9}$/.test(ph)) e.phone = "شمارهٔ موبایل باید مانند ۰۹۱۳۷۱۰۲۴۲۶ باشد";
    if (!address.trim()) e.address = "آدرس الزامی است";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setStep("processing");
    PROCESSING_MSGS.forEach((_, i) => {
      window.setTimeout(() => setMsgIdx(i), i * 620);
    });
    window.setTimeout(() => {
      const id = addOrder({
        customerId: "c0",
        items: lines.map((l) => ({ productId: l.product.id, qty: l.qty })),
        payment,
        status: "new",
        note: note.trim() || `${name.trim()} — ${address.trim()}`,
      });
      setPlacedId(id);
      setStep("done");
      onPlaced(id);
    }, PROCESSING_MSGS.length * 620 + 500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label="ثبت سفارش">
      <div className="absolute inset-0 bg-roast-950/85 backdrop-blur-sm fade-in" onClick={step === "processing" ? undefined : onClose} />
      <div className="modal-in relative w-full sm:max-w-xl max-h-[94vh] overflow-y-auto rounded-t-[18px] sm:rounded-[16px] border border-cream-100/12 bg-roast-900 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
        {step === "form" && (
          <>
            <header className="flex items-center justify-between px-6 pt-6">
              <div>
                <p className="font-mono text-[10.5px] tracking-[0.18em] text-ember-500">تکمیل اطلاعات ارسال</p>
                <h2 className="mt-1 font-display text-2xl sm:text-[1.6rem] text-cream-100">ثبت سفارش</h2>
              </div>
              <button
                onClick={onClose}
                className="grid place-items-center w-9 h-9 rounded-full border border-cream-100/14 text-cream-300 transition-all hover:border-ember-500/60 hover:text-ember-400 hover:rotate-90 duration-300 cursor-pointer"
                aria-label="بستن"
              >
                <CloseIcon size={15} />
              </button>
            </header>

            <div className="px-6 mt-4">
              <div className="rounded-[11px] border border-cream-100/10 bg-roast-875/70 p-4">
                <ul className="space-y-2">
                  {lines.map(({ product, qty }) => (
                    <li key={product.id} className="flex justify-between gap-3 text-[13.5px]">
                      <span className="text-cream-400 truncate">
                        <strong className="text-cream-200 font-semibold">{faDigits(qty)}×</strong> {product.name}
                        <span className="text-cream-600 font-mono text-[11px] ms-1.5">{product.pack}</span>
                      </span>
                      <span className="font-mono text-cream-300 shrink-0">{formatToman(product.price * qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-cream-100/10 flex justify-between text-sm">
                  <span className="text-cream-500">
                    ارسال {ship === 0 && <span className="text-leaf-300">· رایگان</span>}
                  </span>
                  <span className="font-mono text-cream-300">{ship === 0 ? formatToman(0) : formatToman(ship)}</span>
                </div>
                <div className="mt-1.5 flex justify-between items-baseline">
                  <span className="font-semibold text-cream-100 text-sm">مبلغ قابل پرداخت</span>
                  <span className="font-display text-xl text-ember-400">{formatToman(total)}</span>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="px-6 py-5 space-y-3.5" noValidate>
              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5" htmlFor="co-name">نام و نام خانوادگی</label>
                <input id="co-name" className={`field ${errors.name ? "field-error" : ""}`} value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: علی رضایی" />
                {errors.name && <p className="mt-1 font-mono text-[10px] text-cherry-400">{errors.name}</p>}
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5" htmlFor="co-phone">شمارهٔ موبایل</label>
                <input
                  id="co-phone"
                  inputMode="tel"
                  dir="ltr"
                  className={`field text-end ${errors.phone ? "field-error" : ""}`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0913 xxx xxxx"
                />
                {errors.phone && <p className="mt-1 font-mono text-[10px] text-cherry-400">{errors.phone}</p>}
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5" htmlFor="co-address">آدرس تحویل (کاشان و حومه)</label>
                <textarea
                  id="co-address"
                  rows={2}
                  className={`field resize-none ${errors.address ? "field-error" : ""}`}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="کاشان، بلوار قطب راوندی، کوچه ۱۲، پلاک ۱۸"
                />
                {errors.address && <p className="mt-1 font-mono text-[10px] text-cherry-400">{errors.address}</p>}
              </div>

              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-2">روش پرداخت</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PAYMENT_METHODS.filter((m) => ONLINE_PAYMENTS.includes(m.key)).map((m) => (
                    <button
                      type="button"
                      key={m.key}
                      onClick={() => setPayment(m.key)}
                      className={`rounded-[9px] border px-2 py-2.5 text-[12.5px] font-semibold transition-all duration-200 cursor-pointer ${
                        payment === m.key
                          ? "border-ember-500 bg-ember-500/12 text-ember-300"
                          : "border-cream-100/12 text-cream-400 hover:border-cream-100/30"
                      }`}
                      aria-pressed={payment === m.key}
                    >
                      {m.label === "نقدی" ? "نقدی (در محل)" : m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5" htmlFor="co-note">توضیحات (اختیاری)</label>
                <input id="co-note" className="field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="مثلاً: لطفاً آسیاب‌شده برای موکاپات" />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-ember-500 px-6 py-3.5 text-sm font-bold text-roast-950 transition-all duration-300 hover:bg-ember-400 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-12px_rgba(225,154,56,0.6)] active:translate-y-0 cursor-pointer"
                >
                  <LockIcon size={16} />
                  ثبت نهایی سفارش — {formatToman(total)}
                </button>
                <p className="mt-2.5 text-center font-mono text-[10px] tracking-[0.1em] text-cream-700">
                  نسخهٔ نمایشی — هیچ مبلغی کسر نمی‌شود و اطلاعاتی ذخیرهٔ خارجی نمی‌شود
                </p>
              </div>
            </form>
          </>
        )}

        {step === "processing" && (
          <div className="px-6 py-20 text-center">
            <div className="spinner mx-auto" />
            <p key={msgIdx} className="ticket-swap mt-6 font-display text-xl text-cream-100">
              {PROCESSING_MSGS[msgIdx]}
            </p>
            <p className="mt-2 font-mono text-[11px] tracking-[0.14em] text-cream-600">
              مجموعه قهوه کاشان · {formatToman(total)}
            </p>
          </div>
        )}

        {step === "done" && (
          <div className="px-6 py-14 text-center">
            <div className="ring-grow mx-auto grid place-items-center w-20 h-20 rounded-full border-2 border-leaf-400/60 bg-leaf-500/10">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-leaf-300)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path className="check-draw" d="m5 12.5 4.5 4.5L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 font-display text-3xl text-cream-100">سفارش شما ثبت شد</h2>
            <p className="mt-3 text-[15px] text-cream-500 max-w-sm mx-auto leading-relaxed">
              شمارهٔ سفارش <strong className="text-ember-400 font-mono text-sm">{faDigits(placedId)}</strong> —{" "}
              همکاران ما به‌زودی با شمارهٔ <strong className="text-cream-200" dir="ltr">{faDigits(phone)}</strong> تماس
              می‌گیرند و سفارش همان روز در کاشان ارسال می‌شود.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["آماده‌سازی همان روز", "ارسال در کاشان", "پرداخت امن"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-cream-100/12 px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] text-cream-400">
                  <CheckIcon size={11} className="text-leaf-400" /> {t}
                </span>
              ))}
            </div>
            <button
              onClick={onClose}
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-ember-500 px-7 py-3.5 text-sm font-bold text-roast-950 transition-all duration-300 hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              بازگشت به فروشگاه <ArrowRightIcon size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =============== اعلان‌ها =============== */
export interface Toast {
  id: number;
  msg: string;
}

export function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-[80] flex flex-col gap-2 max-w-[calc(100vw-2rem)]" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast-in flex items-center gap-3 rounded-[11px] border border-ember-500/30 bg-roast-850/95 backdrop-blur-md pr-3.5 pl-4 py-3 shadow-[0_16px_40px_-14px_rgba(0,0,0,0.8)]">
          <span className="grid place-items-center w-7 h-7 shrink-0 rounded-full bg-ember-500 text-roast-950">
            <CheckIcon size={14} />
          </span>
          <p className="text-[13.5px] font-semibold text-cream-200">{t.msg}</p>
        </div>
      ))}
    </div>
  );
}
