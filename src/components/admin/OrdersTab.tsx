import { useMemo, useState } from "react";
import { useStore } from "../../lib/store";
import { orderSubtotal } from "../../data/seeds";
import {
  ORDER_STATUSES, STATUS_LABEL, STATUS_TONE,
  PAYMENT_METHODS, PAYMENT_LABEL,
  type OrderStatusKey, type PaymentKey,
} from "../../data/business";
import { faDigits, formatDate, formatToman, toEnDigits } from "../../lib/format";
import { PlusIcon, TrashIcon, CloseIcon } from "../Icons";

export function OrdersTab() {
  const { orders, customers, products, updateOrderStatus, deleteOrder, addOrder } = useStore();
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatusKey>("all");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const cName = (id: string) => {
    const c = customers.find((x) => x.id === id);
    return c?.business ?? c?.name ?? "نامشخص";
  };

  const filtered = useMemo(() => {
    const q = query.trim();
    return [...orders]
      .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
      .filter((o) => (statusFilter === "all" ? true : o.status === statusFilter))
      .filter((o) => {
        if (!q) return true;
        return cName(o.customerId).includes(q) || String(o.id).includes(toEnDigits(q));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, statusFilter, query, customers]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    orders.forEach((o) => (c[o.status] = (c[o.status] ?? 0) + 1));
    return c;
  }, [orders]);

  return (
    <div className="space-y-5">
      {/* فیلترها */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جست‌وجوی مشتری یا شمارهٔ سفارش…"
          className="field !rounded-full !py-2.5 !text-sm max-w-xs"
          aria-label="جست‌وجوی سفارش‌ها"
        />
        <button
          onClick={() => setCreating(true)}
          className="md:mr-auto inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2.5 text-sm font-bold text-roast-950 transition-all hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <PlusIcon size={15} />
          ثبت سفارش جدید
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
        {(["all", ...ORDER_STATUSES.map((s) => s.key)] as const).map((k) => {
          const active = statusFilter === k;
          return (
            <button
              key={k}
              onClick={() => setStatusFilter(k)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-[12.5px] font-semibold transition-all duration-300 cursor-pointer ${
                active
                  ? "border-ember-500 bg-ember-500 text-roast-950"
                  : "border-cream-100/12 text-cream-400 hover:border-ember-500/50 hover:text-ember-400"
              }`}
            >
              {k === "all" ? "همه" : STATUS_LABEL[k]}
              <span className={`font-mono text-[10px] ms-1.5 ${active ? "text-roast-950/70" : "text-cream-600"}`}>
                {faDigits(counts[k] ?? 0)}
              </span>
            </button>
          );
        })}
      </div>

      {/* جدول */}
      <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 overflow-x-auto">
        <table className="w-full min-w-[820px] text-[13px]">
          <thead>
            <tr className="text-right font-mono text-[10px] tracking-[0.12em] text-cream-600 border-b border-cream-100/10 bg-roast-875/50">
              <th className="py-3 px-4 font-medium">شماره</th>
              <th className="py-3 px-2 font-medium">تاریخ</th>
              <th className="py-3 px-2 font-medium">مشتری</th>
              <th className="py-3 px-2 font-medium">اقلام</th>
              <th className="py-3 px-2 font-medium">پرداخت</th>
              <th className="py-3 px-2 font-medium">مبلغ</th>
              <th className="py-3 px-2 font-medium">وضعیت</th>
              <th className="py-3 px-4 font-medium text-left">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-cream-100/6 last:border-0 hover:bg-roast-875/60 transition-colors">
                <td className="py-3 px-4 font-mono text-ember-400">{faDigits(o.id)}</td>
                <td className="py-3 px-2 text-cream-500 whitespace-nowrap">{formatDate(o.dateISO)}</td>
                <td className="py-3 px-2 text-cream-300">{cName(o.customerId)}</td>
                <td className="py-3 px-2 text-cream-400 whitespace-nowrap">
                  {faDigits(o.items.reduce((s, i) => s + i.qty, 0))} قلم
                </td>
                <td className="py-3 px-2 text-cream-400 whitespace-nowrap">{PAYMENT_LABEL[o.payment]}</td>
                <td className="py-3 px-2 font-mono text-cream-200 whitespace-nowrap">{formatToman(orderSubtotal(o, products))}</td>
                <td className="py-3 px-2">
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatusKey)}
                    className={`rounded-full border px-2.5 py-1.5 text-[11.5px] font-semibold bg-transparent cursor-pointer appearance-none ${STATUS_TONE[o.status]}`}
                    aria-label={`تغییر وضعیت سفارش ${faDigits(o.id)}`}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s.key} value={s.key} className="bg-roast-900 text-cream-200">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4 text-left">
                  {confirmDelete === o.id ? (
                    <span className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => { deleteOrder(o.id); setConfirmDelete(null); }}
                        className="rounded-full bg-cherry-500 px-3 py-1 text-[11px] font-bold text-cream-100 hover:bg-cherry-400 cursor-pointer"
                      >
                        حذف شود
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="rounded-full border border-cream-100/12 px-3 py-1 text-[11px] text-cream-400 cursor-pointer"
                      >
                        انصراف
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(o.id)}
                      className="grid place-items-center w-8 h-8 rounded-md text-cream-600 transition-all hover:text-cherry-400 hover:bg-cherry-500/10 cursor-pointer"
                      aria-label={`حذف سفارش ${faDigits(o.id)}`}
                    >
                      <TrashIcon size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-cream-600 text-sm">
                  سفارشی با این فیلترها پیدا نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {creating && (
        <NewOrderModal
          onClose={() => setCreating(false)}
          onCreate={(customerId, items, payment, note) => {
            addOrder({ customerId, items, payment, status: "new", note });
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

/* ---------------- مودال ثبت سفارش ---------------- */
function NewOrderModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (
    customerId: string,
    items: { productId: string; qty: number }[],
    payment: PaymentKey,
    note?: string,
  ) => void;
}) {
  const { customers, products } = useStore();
  const [customerId, setCustomerId] = useState(customers[1]?.id ?? customers[0]?.id ?? "c0");
  const [payment, setPayment] = useState<PaymentKey>("cash");
  const [note, setNote] = useState("");
  const [lines, setLines] = useState<{ productId: string; qty: number }[]>([]);
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  const sellable = products;
  const total = lines.reduce((s, l) => {
    const p = products.find((x) => x.id === l.productId);
    return p ? s + p.price * l.qty : s;
  }, 0);

  const addLine = () => {
    if (!productId) return;
    setLines((ls) => {
      const ex = ls.find((l) => l.productId === productId);
      if (ex) return ls.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l));
      return [...ls, { productId, qty }];
    });
    setQty(1);
  };

  const submit = () => {
    if (lines.length === 0) {
      setError("حداقل یک قلم به سفارش اضافه کنید");
      return;
    }
    onCreate(customerId, lines, payment, note.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label="ثبت سفارش جدید">
      <div className="absolute inset-0 bg-roast-950/85 backdrop-blur-sm fade-in" onClick={onClose} />
      <div className="modal-in relative w-full sm:max-w-2xl max-h-[94vh] overflow-y-auto rounded-t-[18px] sm:rounded-[16px] border border-cream-100/12 bg-roast-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-cream-100">ثبت سفارش جدید</h2>
          <button onClick={onClose} className="grid place-items-center w-9 h-9 rounded-full border border-cream-100/14 text-cream-300 hover:border-ember-500/60 hover:text-ember-400 hover:rotate-90 transition-all duration-300 cursor-pointer" aria-label="بستن">
            <CloseIcon size={15} />
          </button>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">مشتری</label>
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="field cursor-pointer">
              {customers.filter((c) => c.id !== "c0").map((c) => (
                <option key={c.id} value={c.id}>
                  {c.business ? `${c.business} (${c.name})` : c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">روش پرداخت</label>
            <select value={payment} onChange={(e) => setPayment(e.target.value as PaymentKey)} className="field cursor-pointer">
              {PAYMENT_METHODS.map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* افزودن قلم */}
        <div className="mt-4 rounded-[11px] border border-cream-100/10 bg-roast-875/70 p-4">
          <p className="font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-2">اقلام سفارش</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <select value={productId} onChange={(e) => setProductId(e.target.value)} className="field flex-1 cursor-pointer !py-2.5">
              {sellable.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatToman(p.price)}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={99}
                dir="ltr"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
                className="field !w-20 text-center"
                aria-label="تعداد"
              />
              <button onClick={addLine} className="rounded-[10px] bg-ember-500 px-4 text-sm font-bold text-roast-950 hover:bg-ember-400 active:scale-95 transition-all cursor-pointer">
                افزودن
              </button>
            </div>
          </div>

          {lines.length > 0 && (
            <ul className="mt-3 space-y-2">
              {lines.map((l) => {
                const p = products.find((x) => x.id === l.productId);
                if (!p) return null;
                return (
                  <li key={l.productId} className="flex items-center justify-between gap-3 text-[13px] bg-roast-900/70 rounded-[9px] px-3 py-2">
                    <span className="text-cream-300 truncate">{p.name}</span>
                    <span className="flex items-center gap-2.5 shrink-0">
                      <span className="font-mono text-cream-500">{faDigits(l.qty)} × {formatToman(p.price)}</span>
                      <span className="font-mono text-ember-400">{formatToman(p.price * l.qty)}</span>
                      <button
                        onClick={() => setLines((ls) => ls.filter((x) => x.productId !== l.productId))}
                        className="text-cream-600 hover:text-cherry-400 transition-colors cursor-pointer"
                        aria-label={`حذف ${p.name}`}
                      >
                        <CloseIcon size={13} />
                      </button>
                    </span>
                  </li>
                );
              })}
              <li className="flex justify-between pt-2 border-t border-cream-100/10 text-sm">
                <span className="font-semibold text-cream-100">جمع سفارش</span>
                <span className="font-display text-lg text-ember-400">{formatToman(total)}</span>
              </li>
            </ul>
          )}
        </div>

        <div className="mt-4">
          <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">یادداشت (اختیاری)</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} className="field" placeholder="مثلاً: تحویل هفتگی، بسته‌بندی عمده" />
        </div>

        {error && <p className="mt-3 font-mono text-[11px] text-cherry-400">{error}</p>}

        <button
          onClick={submit}
          className="mt-5 w-full rounded-full bg-ember-500 px-6 py-3.5 text-sm font-bold text-roast-950 transition-all hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          ثبت سفارش — {formatToman(total)}
        </button>
      </div>
    </div>
  );
}
