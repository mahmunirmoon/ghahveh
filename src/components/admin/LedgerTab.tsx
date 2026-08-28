import { useMemo, useState, type FormEvent } from "react";
import { useStore } from "../../lib/store";
import { PAYMENT_METHODS, TX_TYPES } from "../../data/business";
import { faDigits, formatDate, formatToman, toEnDigits } from "../../lib/format";
import { PlusIcon, TrashIcon, CloseIcon } from "../Icons";
import { DownloadIcon, WalletIcon, TrendUpIcon, AlertIcon } from "../AdminIcons";

export function LedgerTab() {
  const { transactions, deleteTx } = useStore();
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const rows = useMemo(() => {
    const asc = [...transactions].sort((a, b) => a.dateISO.localeCompare(b.dateISO));
    let bal = 0;
    const withBal = asc.map((t) => {
      bal += t.credit - t.debit;
      return { ...t, balance: bal };
    });
    return withBal.reverse(); // نمایش از جدیدترین
  }, [transactions]);

  const totals = useMemo(() => {
    const credit = transactions.reduce((s, t) => s + t.credit, 0);
    const debit = transactions.reduce((s, t) => s + t.debit, 0);
    const pending = transactions.filter((t) => t.status === "pending");
    return { credit, debit, balance: credit - debit, pendingCount: pending.length, pendingSum: pending.reduce((s, t) => s + t.debit - t.credit, 0) };
  }, [transactions]);

  const exportCsv = () => {
    const header = ["شماره سند", "تاریخ", "شرح", "نوع", "طرف حساب", "روش پرداخت", "بدهکار", "بستانکار", "مانده", "وضعیت"];
    const lines = rows.map((t) =>
      [t.docNo, formatDate(t.dateISO), t.desc, t.type, t.party, t.method, t.debit || "", t.credit || "", t.balance, t.status === "pending" ? "در انتظار تسویه" : "تسویه شده"].join(","),
    );
    const csv = "\uFEFF" + [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "daftar-hesab.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-5">
      {/* خلاصه */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-[12px] border border-leaf-500/25 bg-leaf-500/8 p-4">
          <p className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.12em] text-cream-600">
            <TrendUpIcon size={14} className="text-leaf-300" /> جمع بستانکار (ورودی)
          </p>
          <p className="mt-2 font-display text-[1.25rem] text-leaf-300">{formatToman(totals.credit)}</p>
        </div>
        <div className="rounded-[12px] border border-cherry-500/25 bg-cherry-500/6 p-4">
          <p className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.12em] text-cream-600">
            <AlertIcon size={14} className="text-cherry-400" /> جمع بدهکار (خروجی)
          </p>
          <p className="mt-2 font-display text-[1.25rem] text-cherry-400">{formatToman(totals.debit)}</p>
        </div>
        <div className="rounded-[12px] border border-ember-500/30 bg-ember-500/8 p-4">
          <p className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.12em] text-cream-600">
            <WalletIcon size={14} className="text-ember-400" /> ماندهٔ صندوق
          </p>
          <p className="mt-2 font-display text-[1.25rem] text-ember-400">{formatToman(totals.balance)}</p>
        </div>
        <div className="rounded-[12px] border border-cream-100/12 bg-roast-900/50 p-4">
          <p className="font-mono text-[10.5px] tracking-[0.12em] text-cream-600">اسناد در انتظار تسویه</p>
          <p className="mt-2 font-display text-[1.25rem] text-cream-200">
            {faDigits(totals.pendingCount)} سند
            <span className="block font-mono text-[10.5px] text-cream-600 mt-1">{formatToman(totals.pendingSum)}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2.5 text-sm font-bold text-roast-950 transition-all hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
          <PlusIcon size={15} />
          ثبت سند جدید
        </button>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full border border-cream-100/15 px-5 py-2.5 text-sm font-semibold text-cream-300 transition-all hover:border-ember-500/50 hover:text-ember-400 cursor-pointer">
          <DownloadIcon size={15} />
          خروجی CSV دفتر
        </button>
      </div>

      {/* جدول دفتر کل */}
      <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 overflow-x-auto">
        <table className="w-full min-w-[1020px] text-[13px]">
          <thead>
            <tr className="text-right font-mono text-[10px] tracking-[0.12em] text-cream-600 border-b border-cream-100/10 bg-roast-875/50">
              <th className="py-3 px-4 font-medium">سند</th>
              <th className="py-3 px-2 font-medium">تاریخ</th>
              <th className="py-3 px-2 font-medium">شرح</th>
              <th className="py-3 px-2 font-medium">نوع</th>
              <th className="py-3 px-2 font-medium">طرف حساب</th>
              <th className="py-3 px-2 font-medium">روش پرداخت</th>
              <th className="py-3 px-2 font-medium">بدهکار</th>
              <th className="py-3 px-2 font-medium">بستانکار</th>
              <th className="py-3 px-2 font-medium">مانده</th>
              <th className="py-3 px-2 font-medium">وضعیت</th>
              <th className="py-3 px-4 font-medium text-left">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-b border-cream-100/6 last:border-0 hover:bg-roast-875/60 transition-colors">
                <td className="py-2.5 px-4 font-mono text-ember-400 whitespace-nowrap">{faDigits(t.docNo)}</td>
                <td className="py-2.5 px-2 text-cream-500 whitespace-nowrap">{formatDate(t.dateISO)}</td>
                <td className="py-2.5 px-2 text-cream-200 max-w-[220px] truncate" title={t.desc}>{t.desc}</td>
                <td className="py-2.5 px-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${
                    t.credit > 0 ? "border-leaf-500/35 bg-leaf-500/8 text-leaf-300" : "border-cherry-500/35 bg-cherry-500/6 text-cherry-400"
                  }`}>
                    {t.type}
                  </span>
                </td>
                <td className="py-2.5 px-2 text-cream-400 whitespace-nowrap max-w-[160px] truncate">{t.party}</td>
                <td className="py-2.5 px-2 text-cream-500 whitespace-nowrap">{t.method}</td>
                <td className="py-2.5 px-2 font-mono text-cherry-400 whitespace-nowrap">{t.debit ? formatToman(t.debit) : "—"}</td>
                <td className="py-2.5 px-2 font-mono text-leaf-300 whitespace-nowrap">{t.credit ? formatToman(t.credit) : "—"}</td>
                <td className="py-2.5 px-2 font-mono text-cream-200 whitespace-nowrap">{formatToman(t.balance)}</td>
                <td className="py-2.5 px-2 whitespace-nowrap">
                  <span className={`font-mono text-[10.5px] ${t.status === "pending" ? "text-ember-400" : "text-cream-600"}`}>
                    {t.status === "pending" ? "در انتظار تسویه" : "تسویه شده"}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-left">
                  {confirmDelete === t.id ? (
                    <span className="inline-flex items-center gap-1.5">
                      <button onClick={() => { deleteTx(t.id); setConfirmDelete(null); }} className="rounded-full bg-cherry-500 px-2.5 py-1 text-[10.5px] font-bold text-cream-100 hover:bg-cherry-400 cursor-pointer">حذف</button>
                      <button onClick={() => setConfirmDelete(null)} className="rounded-full border border-cream-100/12 px-2.5 py-1 text-[10.5px] text-cream-400 cursor-pointer">انصراف</button>
                    </span>
                  ) : (
                    <button onClick={() => setConfirmDelete(t.id)} className="grid place-items-center w-8 h-8 rounded-md text-cream-600 hover:text-cherry-400 hover:bg-cherry-500/10 transition-all cursor-pointer" aria-label={`حذف سند ${faDigits(t.docNo)}`}>
                      <TrashIcon size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {creating && <TxModal onClose={() => setCreating(false)} />}
    </div>
  );
}

/* ---------------- مودال ثبت سند ---------------- */
function TxModal({ onClose }: { onClose: () => void }) {
  const { addTx } = useStore();
  const [f, setF] = useState({
    desc: "",
    type: TX_TYPES[0],
    party: "",
    method: PAYMENT_METHODS[0].label,
    amount: "",
    direction: "credit" as "credit" | "debit",
    status: "settled" as "settled" | "pending",
  });
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const amount = Math.max(0, parseInt(toEnDigits(f.amount).replace(/[^\d]/g, ""), 10) || 0);
    if (!f.desc.trim()) { setError("شرح سند الزامی است"); return; }
    if (amount <= 0) { setError("مبلغ را درست وارد کنید"); return; }
    addTx({
      dateISO: new Date().toISOString(),
      desc: f.desc.trim(),
      type: f.type,
      party: f.party.trim() || "متفرقه",
      method: f.method,
      debit: f.direction === "debit" ? amount : 0,
      credit: f.direction === "credit" ? amount : 0,
      status: f.status,
    });
    onClose();
  };

  const set = (k: keyof typeof f, v: string) => { setF((x) => ({ ...x, [k]: v })); setError(""); };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label="ثبت سند جدید">
      <div className="absolute inset-0 bg-roast-950/85 backdrop-blur-sm fade-in" onClick={onClose} />
      <form onSubmit={submit} className="modal-in relative w-full sm:max-w-xl max-h-[94vh] overflow-y-auto rounded-t-[18px] sm:rounded-[16px] border border-cream-100/12 bg-roast-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-cream-100">ثبت سند دفتر حساب</h2>
          <button type="button" onClick={onClose} className="grid place-items-center w-9 h-9 rounded-full border border-cream-100/14 text-cream-300 hover:border-ember-500/60 hover:text-ember-400 hover:rotate-90 transition-all duration-300 cursor-pointer" aria-label="بستن">
            <CloseIcon size={15} />
          </button>
        </div>

        <div className="mt-5 space-y-3.5">
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">شرح سند</label>
            <input className="field" value={f.desc} onChange={(e) => set("desc", e.target.value)} placeholder="مثلاً: فروش نقدی قهوه" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">نوع تراکنش</label>
              <select className="field cursor-pointer" value={f.type} onChange={(e) => set("type", e.target.value)}>
                {TX_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">طرف حساب</label>
              <input className="field" value={f.party} onChange={(e) => set("party", e.target.value)} placeholder="مشتری، تأمین‌کننده، …" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">روش پرداخت</label>
              <select className="field cursor-pointer" value={f.method} onChange={(e) => set("method", e.target.value)}>
                {PAYMENT_METHODS.map((m) => (<option key={m.key} value={m.label}>{m.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">مبلغ (تومان)</label>
              <input inputMode="numeric" dir="ltr" className="field text-end font-mono" value={f.amount} onChange={(e) => set("amount", e.target.value)} placeholder="3850000" />
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-2">جهت تراکنش</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => set("direction", "credit")} className={`rounded-[9px] border px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer ${f.direction === "credit" ? "border-leaf-500/60 bg-leaf-500/10 text-leaf-300" : "border-cream-100/12 text-cream-400"}`}>
                بستانکار (ورود پول)
              </button>
              <button type="button" onClick={() => set("direction", "debit")} className={`rounded-[9px] border px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer ${f.direction === "debit" ? "border-cherry-500/60 bg-cherry-500/10 text-cherry-400" : "border-cream-100/12 text-cream-400"}`}>
                بدهکار (خروج پول)
              </button>
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-2">وضعیت تسویه</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => set("status", "settled")} className={`rounded-[9px] border px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer ${f.status === "settled" ? "border-ember-500 bg-ember-500/12 text-ember-300" : "border-cream-100/12 text-cream-400"}`}>
                تسویه شده
              </button>
              <button type="button" onClick={() => set("status", "pending")} className={`rounded-[9px] border px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer ${f.status === "pending" ? "border-ember-500 bg-ember-500/12 text-ember-300" : "border-cream-100/12 text-cream-400"}`}>
                در انتظار تسویه
              </button>
            </div>
          </div>
        </div>

        {error && <p className="mt-3 font-mono text-[11px] text-cherry-400">{error}</p>}

        <button type="submit" className="mt-5 w-full rounded-full bg-ember-500 px-6 py-3.5 text-sm font-bold text-roast-950 transition-all hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
          ثبت سند
        </button>
      </form>
    </div>
  );
}
