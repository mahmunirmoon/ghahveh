import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  WEIGHTS,
  GRINDS,
  FREE_SHIP_AT,
  FLAT_SHIP,
  money,
  priceFor,
  type Product,
  type Weight,
  type Grind,
  type CartItem,
} from "../data/products";
import { useBodyLock } from "../lib/hooks";
import { Steam } from "./Shop";
import {
  CloseIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CartIcon,
  ArrowRightIcon,
  StarIcon,
  CheckIcon,
  TruckIcon,
  LockIcon,
  LeafIcon,
  BeanIcon,
  RoastMeter,
} from "./Icons";

/* =============== helpers =============== */
export interface CartLine {
  item: CartItem;
  product: Product;
  unit: number;
}

export function totalsOf(lines: CartLine[]) {
  const subtotal = lines.reduce((s, l) => s + l.unit * l.item.qty, 0);
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
      <button className={btn} onClick={() => onChange(qty - 1)} aria-label="Decrease quantity">
        <MinusIcon size={13} />
      </button>
      <span key={qty} className={`ticket-swap text-center font-mono text-sm font-semibold text-cream-100 ${small ? "w-7" : "w-9"}`}>
        {qty}
      </span>
      <button className={btn} onClick={() => onChange(qty + 1)} aria-label="Increase quantity">
        <PlusIcon size={13} />
      </button>
    </div>
  );
}

/* =============== product detail =============== */
export function ProductDetail({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: (p: Product, w: Weight, g: Grind, qty: number) => void;
}) {
  const [weight, setWeight] = useState<Weight>(250);
  const [grind, setGrind] = useState<Grind>("Whole bean");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setWeight(250);
    setGrind("Whole bean");
    setQty(1);
  }, [product.id]);

  useBodyLock(true);
  const unit = priceFor(product.price, weight);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label={product.name}>
      <div className="absolute inset-0 bg-roast-950/80 backdrop-blur-sm fade-in" onClick={onClose} />
      <div className="modal-in relative w-full sm:max-w-4xl max-h-[92vh] overflow-y-auto rounded-t-[18px] sm:rounded-[16px] border border-cream-100/12 bg-roast-900 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 grid place-items-center w-9 h-9 rounded-full border border-cream-100/14 bg-roast-950/60 text-cream-300 transition-all hover:border-ember-500/60 hover:text-ember-400 hover:rotate-90 duration-300 cursor-pointer"
          aria-label="Close details"
        >
          <CloseIcon size={16} />
        </button>

        <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
          <div className="relative h-64 sm:h-auto sm:min-h-[520px] overflow-hidden">
            <img src={product.img} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-roast-900 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-roast-900" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              {product.badge && (
                <span className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${
                  product.badge.tone === "leaf" ? "bg-leaf-500 text-roast-950" : product.badge.tone === "cherry" ? "bg-cherry-500 text-cream-100" : "bg-ember-500 text-roast-950"
                }`}>
                  {product.badge.label}
                </span>
              )}
              {product.stock === "low" && (
                <span className="rounded-full bg-roast-950/75 border border-cherry-500/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cherry-400">
                  Low stock
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember-500">
              {product.category} · Lot №{product.id.slice(0, 6).toUpperCase()}
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-cream-100 tracking-tight leading-[1.05]">
              {product.name}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-cream-500">
              <span className="inline-flex items-center gap-1.5">
                <StarIcon size={13} className="text-ember-400" />
                <strong className="text-cream-200 font-semibold">{product.rating.toFixed(1)}</strong>
                ({product.reviews} cups logged)
              </span>
              <span className="inline-flex items-center gap-2 text-ember-400">
                <RoastMeter level={product.roast} />
                <span className="text-cream-500 text-[13px]">{product.roastName}</span>
              </span>
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-cream-400">{product.desc}</p>

            <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2.5 rounded-[11px] border border-cream-100/10 bg-roast-875/70 p-4 text-[13px]">
              {[
                ["Origin", product.origin],
                ["Producer", product.producer],
                ["Process", product.process],
                ["Altitude", product.altitude],
                ["Varietal", product.varietal],
                ["Dial-in", product.brew],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-cream-600">{k}</p>
                  <p className="mt-0.5 text-cream-300">{v}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-600 mr-1">Tastes like</span>
              {product.notes.map((n) => (
                <span key={n} className="rounded-full border border-ember-500/30 bg-ember-500/8 px-3 py-1 text-[12.5px] text-ember-300">
                  {n}
                </span>
              ))}
            </div>

            {/* weight + grind */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-600 mb-2">Bag size</p>
                <div className="grid grid-cols-2 gap-2">
                  {WEIGHTS.map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeight(w)}
                      className={`rounded-[9px] border px-3 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        weight === w
                          ? "border-ember-500 bg-ember-500/12 text-ember-300"
                          : "border-cream-100/12 text-cream-400 hover:border-cream-100/30"
                      }`}
                      aria-pressed={weight === w}
                    >
                      {w === 250 ? "250 g" : "1 kg"}
                      <span className="block font-mono text-[10.5px] font-normal text-cream-600 mt-0.5">{money(priceFor(product.price, w))}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-600 mb-2">Grind</p>
                <div className="grid grid-cols-3 gap-2">
                  {GRINDS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGrind(g)}
                      className={`rounded-[9px] border px-2 py-2.5 text-[12.5px] font-semibold transition-all duration-200 cursor-pointer ${
                        grind === g
                          ? "border-ember-500 bg-ember-500/12 text-ember-300"
                          : "border-cream-100/12 text-cream-400 hover:border-cream-100/30"
                      }`}
                      aria-pressed={grind === g}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* add row */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <QtyStepper qty={qty} onChange={(q) => setQty(Math.max(1, Math.min(12, q)))} />
              <button
                onClick={() => onAdd(product, weight, grind, qty)}
                className="group flex-1 min-w-[220px] inline-flex items-center justify-center gap-2.5 rounded-full bg-ember-500 px-6 py-3.5 text-sm font-bold text-roast-950 transition-all duration-300 hover:bg-ember-400 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-12px_rgba(225,154,56,0.6)] active:translate-y-0 cursor-pointer"
              >
                <CartIcon size={17} />
                Add to cart — {money(unit * qty)}
                <ArrowRightIcon size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <p className="mt-4 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-cream-600">
              <LeafIcon size={13} className="text-leaf-400" />
              Compostable bag · roasted this Tuesday · ships in 48h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============== cart drawer =============== */
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
  onQty: (key: string, qty: number) => void;
  onRemove: (key: string) => void;
  onCheckout: () => void;
}) {
  useBodyLock(open);
  if (!open) return null;

  const { subtotal, ship, total } = totalsOf(lines);
  const remaining = Math.max(0, FREE_SHIP_AT - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP_AT) * 100);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 bg-roast-950/70 backdrop-blur-sm fade-in" onClick={onClose} />
      <aside className="drawer-in absolute right-0 top-0 h-full w-full max-w-md flex flex-col border-l border-cream-100/12 bg-roast-900 shadow-[-30px_0_80px_-30px_rgba(0,0,0,0.8)]">
        <header className="flex items-center justify-between px-5 py-4 border-b border-cream-100/10">
          <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold text-cream-100">
            <CartIcon size={19} className="text-ember-400" />
            Your crate
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream-600">
              {lines.reduce((s, l) => s + l.item.qty, 0)} items
            </span>
          </h2>
          <button
            onClick={onClose}
            className="grid place-items-center w-9 h-9 rounded-full border border-cream-100/14 text-cream-300 transition-all hover:border-ember-500/60 hover:text-ember-400 hover:rotate-90 duration-300 cursor-pointer"
            aria-label="Close cart"
          >
            <CloseIcon size={15} />
          </button>
        </header>

        {/* free shipping meter */}
        <div className="px-5 py-3.5 border-b border-cream-100/10 bg-roast-875/60">
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="inline-flex items-center gap-2 text-cream-400">
              <TruckIcon size={15} className={remaining === 0 ? "text-leaf-400" : "text-ember-400"} />
              {remaining === 0 ? (
                <span className="text-leaf-300 font-semibold">Free shipping unlocked</span>
              ) : (
                <>
                  <strong className="text-cream-200">{money(remaining)}</strong> away from free shipping
                </>
              )}
            </span>
            <span className="font-mono text-[10px] text-cream-600">${FREE_SHIP_AT} goal</span>
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
                <h3 className="mt-5 font-display text-xl font-semibold text-cream-200">Nothing brewing yet</h3>
                <p className="mt-2 text-sm text-cream-500 max-w-[240px] mx-auto">
                  Your crate is empty. The shelf, however, is full.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2.5 text-sm font-bold text-roast-950 transition-all hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Back to the shelf <ArrowRightIcon size={15} />
                </button>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map(({ item, product, unit }) => (
                <li key={item.key} className="ticket-swap flex gap-3.5 rounded-[11px] border border-cream-100/8 bg-roast-875/60 p-3">
                  <img src={product.img} alt={product.name} className="w-[74px] h-[88px] object-cover rounded-[8px] border border-cream-100/8" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-display text-[15.5px] font-semibold text-cream-100 leading-snug truncate">{product.name}</h4>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cream-600">
                          {item.weight === 250 ? "250 g" : "1 kg"} · {item.grind}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemove(item.key)}
                        className="shrink-0 grid place-items-center w-7 h-7 rounded-md text-cream-600 transition-all hover:text-cherry-400 hover:bg-cherry-500/10 cursor-pointer"
                        aria-label={`Remove ${product.name}`}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <QtyStepper small qty={item.qty} onChange={(q) => onQty(item.key, q)} />
                      <div className="text-right">
                        <p className="font-display text-[15px] font-semibold text-ember-400">{money(unit * item.qty)}</p>
                        {item.qty > 1 && (
                          <p className="font-mono text-[9.5px] text-cream-700">{money(unit)} each</p>
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
                <dt>Subtotal</dt>
                <dd className="font-mono">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-cream-400">
                <dt>Shipping</dt>
                <dd className={`font-mono ${ship === 0 ? "text-leaf-300" : ""}`}>{ship === 0 ? "Free" : money(ship)}</dd>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-cream-100/10">
                <dt className="font-semibold text-cream-100">Total</dt>
                <dd className="font-display text-2xl font-semibold text-cream-100">{money(total)}</dd>
              </div>
            </dl>
            <button
              onClick={onCheckout}
              className="mt-4 w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-ember-500 px-6 py-3.5 text-sm font-bold text-roast-950 transition-all duration-300 hover:bg-ember-400 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-12px_rgba(225,154,56,0.6)] active:translate-y-0 cursor-pointer"
            >
              <LockIcon size={16} />
              Simulated checkout — {money(total)}
            </button>
            <p className="mt-2.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-cream-700">
              Demo · no card is ever charged
            </p>
          </footer>
        )}
      </aside>
    </div>
  );
}

/* =============== checkout =============== */
type Step = "form" | "processing" | "done";

const PROCESSING_MSGS = [
  "Warming up the grinder…",
  "Contacting the bank…",
  "Reserving your roast slot…",
  "Stamping the bag…",
];

interface FormState {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  card: string;
  expiry: string;
  cvc: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  address: "",
  city: "",
  zip: "",
  card: "",
  expiry: "",
  cvc: "",
};

export function CheckoutModal({
  open,
  lines,
  onClose,
  onComplete,
}: {
  open: boolean;
  lines: CartLine[];
  onClose: () => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [msgIdx, setMsgIdx] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [snap, setSnap] = useState<{ total: number; count: number }>({ total: 0, count: 0 });
  const timers = useRef<number[]>([]);

  const { subtotal, ship, total } = totalsOf(lines);
  const count = lines.reduce((s, l) => s + l.item.qty, 0);

  useEffect(() => {
    if (open) {
      setStep("form");
      setErrors({});
      setMsgIdx(0);
    }
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "processing") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  useBodyLock(open);
  if (!open) return null;

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email needed";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    if (form.card.replace(/\s/g, "").length !== 16) e.card = "16 digits";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) e.expiry = "MM/YY";
    if (!/^\d{3,4}$/.test(form.cvc)) e.cvc = "3–4 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSnap({ total, count });
    setStep("processing");
    setOrderId(`EO-${Math.random().toString(36).slice(2, 7).toUpperCase()}`);
    PROCESSING_MSGS.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setMsgIdx(i), i * 620));
    });
    timers.current.push(
      window.setTimeout(() => {
        setStep("done");
        onComplete();
      }, PROCESSING_MSGS.length * 620 + 500),
    );
  };

  const field = (k: keyof FormState) => (errors[k] ? "field field-error" : "field");
  const err = (k: keyof FormState) =>
    errors[k] ? <p className="mt-1 font-mono text-[10px] text-cherry-400">{errors[k]}</p> : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label="Checkout">
      <div className="absolute inset-0 bg-roast-950/85 backdrop-blur-sm fade-in" onClick={step === "processing" ? undefined : onClose} />
      <div className="modal-in relative w-full sm:max-w-xl max-h-[94vh] overflow-y-auto rounded-t-[18px] sm:rounded-[16px] border border-cream-100/12 bg-roast-900 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
        {step === "form" && (
          <>
            <header className="flex items-center justify-between px-6 pt-6">
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ember-500">Simulated checkout</p>
                <h2 className="mt-1 font-display text-2xl sm:text-[1.7rem] font-semibold text-cream-100">Settle the tab</h2>
              </div>
              <button
                onClick={onClose}
                className="grid place-items-center w-9 h-9 rounded-full border border-cream-100/14 text-cream-300 transition-all hover:border-ember-500/60 hover:text-ember-400 hover:rotate-90 duration-300 cursor-pointer"
                aria-label="Close checkout"
              >
                <CloseIcon size={15} />
              </button>
            </header>

            <div className="px-6 mt-4">
              <div className="rounded-[11px] border border-cream-100/10 bg-roast-875/70 p-4">
                <ul className="space-y-2">
                  {lines.map(({ item, product, unit }) => (
                    <li key={item.key} className="flex justify-between gap-3 text-[13.5px]">
                      <span className="text-cream-400 truncate">
                        <strong className="text-cream-200 font-semibold">{item.qty}×</strong> {product.name}
                        <span className="text-cream-600 font-mono text-[11px] ml-1.5">
                          {item.weight === 250 ? "250 g" : "1 kg"} · {item.grind}
                        </span>
                      </span>
                      <span className="font-mono text-cream-300 shrink-0">{money(unit * item.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-cream-100/10 flex justify-between text-sm">
                  <span className="text-cream-500">Shipping {ship === 0 && <span className="text-leaf-300">· free</span>}</span>
                  <span className="font-mono text-cream-300">{ship === 0 ? "$0.00" : money(ship)}</span>
                </div>
                <div className="mt-1.5 flex justify-between items-baseline">
                  <span className="font-semibold text-cream-100 text-sm">Total</span>
                  <span className="font-display text-xl font-semibold text-ember-400">{money(total)}</span>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="px-6 py-5 grid grid-cols-2 gap-x-3 gap-y-3.5" noValidate>
              <div className="col-span-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-cream-600 mb-1.5" htmlFor="co-name">Full name</label>
                <input id="co-name" className={field("name")} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Frankie Bean" autoComplete="name" />
                {err("name")}
              </div>
              <div className="col-span-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-cream-600 mb-1.5" htmlFor="co-email">Email</label>
                <input id="co-email" type="email" className={field("email")} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="frankie@brewmail.com" autoComplete="email" />
                {err("email")}
              </div>
              <div className="col-span-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-cream-600 mb-1.5" htmlFor="co-address">Street address</label>
                <input id="co-address" className={field("address")} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="2140 SE Ankeny St" autoComplete="street-address" />
                {err("address")}
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-cream-600 mb-1.5" htmlFor="co-city">City</label>
                <input id="co-city" className={field("city")} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Portland" />
                {err("city")}
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-cream-600 mb-1.5" htmlFor="co-zip">ZIP</label>
                <input id="co-zip" className={field("zip")} value={form.zip} onChange={(e) => set("zip", e.target.value.replace(/[^\d-]/g, "").slice(0, 10))} placeholder="97214" autoComplete="postal-code" />
                {err("zip")}
              </div>
              <div className="col-span-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-cream-600 mb-1.5" htmlFor="co-card">Card number</label>
                <input id="co-card" inputMode="numeric" className={field("card")} value={form.card} onChange={(e) => set("card", formatCard(e.target.value))} placeholder="4242 4242 4242 4242" />
                {err("card")}
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-cream-600 mb-1.5" htmlFor="co-exp">Expiry</label>
                <input id="co-exp" inputMode="numeric" className={field("expiry")} value={form.expiry} onChange={(e) => set("expiry", formatExpiry(e.target.value))} placeholder="08/27" />
                {err("expiry")}
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-cream-600 mb-1.5" htmlFor="co-cvc">CVC</label>
                <input id="co-cvc" inputMode="numeric" className={field("cvc")} value={form.cvc} onChange={(e) => set("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" />
                {err("cvc")}
              </div>
              <div className="col-span-2 pt-1">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-ember-500 px-6 py-3.5 text-sm font-bold text-roast-950 transition-all duration-300 hover:bg-ember-400 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-12px_rgba(225,154,56,0.6)] active:translate-y-0 cursor-pointer"
                >
                  <LockIcon size={16} />
                  Pay {money(total)} — it's pretend
                </button>
                <p className="mt-2.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-cream-700">
                  Demo checkout · nothing is charged or stored
                </p>
              </div>
            </form>
          </>
        )}

        {step === "processing" && (
          <div className="px-6 py-20 text-center">
            <div className="spinner mx-auto" />
            <p key={msgIdx} className="ticket-swap mt-6 font-display text-xl font-semibold text-cream-100">
              {PROCESSING_MSGS[msgIdx]}
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-cream-600">
              Order {orderId} · {count} item{count === 1 ? "" : "s"}
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
            <h2 className="mt-6 font-display text-3xl font-semibold text-cream-100">Order's on the drum.</h2>
            <p className="mt-3 text-[15px] text-cream-500 max-w-sm mx-auto leading-relaxed">
              Order <strong className="text-ember-400 font-mono text-sm">{orderId}</strong> is confirmed —{" "}
              {snap.count} item{snap.count === 1 ? "" : "s"} for <strong className="text-cream-200">{money(snap.total)}</strong>.
              A pretend confirmation is headed to <strong className="text-cream-200">{form.email || "your inbox"}</strong>,
              and your beans will be roasted Tuesday.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["Roast day: Tuesday", "Ships within 48h", "Dial-in card included"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-cream-100/12 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream-400">
                  <CheckIcon size={11} className="text-leaf-400" /> {t}
                </span>
              ))}
            </div>
            <button
              onClick={onClose}
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-ember-500 px-7 py-3.5 text-sm font-bold text-roast-950 transition-all duration-300 hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Back to the shelf <ArrowRightIcon size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =============== toasts =============== */
export interface Toast {
  id: number;
  msg: string;
}

export function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-5 left-4 sm:left-6 z-[80] flex flex-col gap-2 max-w-[calc(100vw-2rem)]" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast-in flex items-center gap-3 rounded-[11px] border border-ember-500/30 bg-roast-850/95 backdrop-blur-md pl-3.5 pr-4 py-3 shadow-[0_16px_40px_-14px_rgba(0,0,0,0.8)]">
          <span className="grid place-items-center w-7 h-7 shrink-0 rounded-full bg-ember-500 text-roast-950">
            <CheckIcon size={14} />
          </span>
          <p className="text-[13.5px] font-semibold text-cream-200">{t.msg}</p>
        </div>
      ))}
    </div>
  );
}
