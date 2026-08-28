import { useMemo, useState, type FormEvent } from "react";
import { useStore } from "../../lib/store";
import { orderSubtotal } from "../../data/seeds";
import { CUSTOMER_TYPE_LABEL, type Customer, type CustomerType } from "../../data/business";
import { faDigits, formatToman } from "../../lib/format";
import { PlusIcon, TrashIcon, CloseIcon } from "../Icons";
import { PencilIcon } from "../AdminIcons";

const EMPTY = { name: "", phone: "", address: "", type: "retail" as CustomerType, business: "" };

export function CustomersTab() {
  const { customers, orders, products, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | CustomerType>("all");
  const [editing, setEditing] = useState<Customer | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const stats = useMemo(() => {
    const m = new Map<string, { count: number; total: number }>();
    orders.forEach((o) => {
      if (o.status === "cancelled") return;
      const s = m.get(o.customerId) ?? { count: 0, total: 0 };
      s.count += 1;
      s.total += orderSubtotal(o, products);
      m.set(o.customerId, s);
    });
    return m;
  }, [orders, products]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return customers
      .filter((c) => c.id !== "c0")
      .filter((c) => (typeFilter === "all" ? true : c.type === typeFilter))
      .filter((c) => !q || c.name.includes(q) || (c.business ?? "").includes(q) || c.phone.includes(q));
  }, [customers, query, typeFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جست‌وجوی نام، کسب‌وکار یا تلفن…"
          className="field !rounded-full !py-2.5 !text-sm max-w-xs"
          aria-label="جست‌وجوی مشتریان"
        />
        <div className="flex gap-2">
          {(["all", "retail", "wholesale"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-all cursor-pointer ${
                typeFilter === t
                  ? "border-ember-500 bg-ember-500 text-roast-950"
                  : "border-cream-100/12 text-cream-400 hover:border-ember-500/50 hover:text-ember-400"
              }`}
            >
              {t === "all" ? "همه" : CUSTOMER_TYPE_LABEL[t]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setCreating(true)}
          className="md:mr-auto inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2.5 text-sm font-bold text-roast-950 transition-all hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <PlusIcon size={15} />
          مشتری جدید
        </button>
      </div>

      <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 overflow-x-auto">
        <table className="w-full min-w-[860px] text-[13px]">
          <thead>
            <tr className="text-right font-mono text-[10px] tracking-[0.12em] text-cream-600 border-b border-cream-100/10 bg-roast-875/50">
              <th className="py-3 px-4 font-medium">مشتری</th>
              <th className="py-3 px-2 font-medium">نوع</th>
              <th className="py-3 px-2 font-medium">تلفن</th>
              <th className="py-3 px-2 font-medium">آدرس</th>
              <th className="py-3 px-2 font-medium">خریدها</th>
              <th className="py-3 px-2 font-medium">جمع خرید</th>
              <th className="py-3 px-4 font-medium text-left">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const st = stats.get(c.id);
              return (
                <tr key={c.id} className="border-b border-cream-100/6 last:border-0 hover:bg-roast-875/60 transition-colors">
                  <td className="py-3 px-4">
                    <p className="text-cream-200 font-semibold">{c.business ?? c.name}</p>
                    {c.business && <p className="font-mono text-[10.5px] text-cream-600 mt-0.5">طرف حساب: {c.name}</p>}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                      c.type === "wholesale"
                        ? "border-ember-500/40 bg-ember-500/10 text-ember-300"
                        : "border-cream-100/15 bg-cream-100/5 text-cream-400"
                    }`}>
                      {CUSTOMER_TYPE_LABEL[c.type]}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-mono text-cream-400 whitespace-nowrap" dir="ltr">{faDigits(c.phone)}</td>
                  <td className="py-3 px-2 text-cream-500 max-w-[240px] truncate" title={c.address}>{c.address}</td>
                  <td className="py-3 px-2 font-mono text-cream-400">{st ? faDigits(st.count) : "—"}</td>
                  <td className="py-3 px-2 font-mono text-cream-200 whitespace-nowrap">{st ? formatToman(st.total) : "—"}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditing(c)}
                        className="grid place-items-center w-8 h-8 rounded-md text-cream-500 transition-all hover:text-ember-400 hover:bg-ember-500/10 cursor-pointer"
                        aria-label={`ویرایش ${c.name}`}
                      >
                        <PencilIcon size={15} />
                      </button>
                      {confirmDelete === c.id ? (
                        <span className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => { deleteCustomer(c.id); setConfirmDelete(null); }}
                            className="rounded-full bg-cherry-500 px-2.5 py-1 text-[10.5px] font-bold text-cream-100 hover:bg-cherry-400 cursor-pointer"
                          >
                            حذف
                          </button>
                          <button onClick={() => setConfirmDelete(null)} className="rounded-full border border-cream-100/12 px-2.5 py-1 text-[10.5px] text-cream-400 cursor-pointer">
                            انصراف
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(c.id)}
                          className="grid place-items-center w-8 h-8 rounded-md text-cream-600 transition-all hover:text-cherry-400 hover:bg-cherry-500/10 cursor-pointer"
                          aria-label={`حذف ${c.name}`}
                        >
                          <TrashIcon size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-cream-600 text-sm">مشتری‌ای با این مشخصات پیدا نشد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <CustomerModal
          initial={editing ?? undefined}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSave={(data) => {
            if (editing) updateCustomer(editing.id, data);
            else addCustomer({ ...data, business: data.type === "wholesale" ? data.business : undefined });
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function CustomerModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: Customer;
  onClose: () => void;
  onSave: (data: { name: string; phone: string; address: string; type: CustomerType; business: string }) => void;
}) {
  const [f, setF] = useState({
    name: initial?.name ?? EMPTY.name,
    phone: initial?.phone ?? EMPTY.phone,
    address: initial?.address ?? EMPTY.address,
    type: initial?.type ?? EMPTY.type,
    business: initial?.business ?? EMPTY.business,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = "نام الزامی است";
    if (!f.phone.trim()) er.phone = "تلفن الزامی است";
    if (!f.address.trim()) er.address = "آدرس الزامی است";
    if (f.type === "wholesale" && !f.business.trim()) er.business = "نام کسب‌وکار الزامی است";
    setErrors(er);
    if (Object.keys(er).length > 0) return;
    onSave(f);
  };

  const set = (k: keyof typeof f, v: string) => {
    setF((x) => ({ ...x, [k]: v }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label={initial ? "ویرایش مشتری" : "مشتری جدید"}>
      <div className="absolute inset-0 bg-roast-950/85 backdrop-blur-sm fade-in" onClick={onClose} />
      <form onSubmit={submit} className="modal-in relative w-full sm:max-w-lg max-h-[94vh] overflow-y-auto rounded-t-[18px] sm:rounded-[16px] border border-cream-100/12 bg-roast-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-cream-100">{initial ? "ویرایش مشتری" : "مشتری جدید"}</h2>
          <button type="button" onClick={onClose} className="grid place-items-center w-9 h-9 rounded-full border border-cream-100/14 text-cream-300 hover:border-ember-500/60 hover:text-ember-400 hover:rotate-90 transition-all duration-300 cursor-pointer" aria-label="بستن">
            <CloseIcon size={15} />
          </button>
        </div>

        <div className="mt-5">
          <p className="font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-2">نوع مشتری</p>
          <div className="grid grid-cols-2 gap-2">
            {(["retail", "wholesale"] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => set("type", t)}
                className={`rounded-[9px] border px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                  f.type === t ? "border-ember-500 bg-ember-500/12 text-ember-300" : "border-cream-100/12 text-cream-400 hover:border-cream-100/30"
                }`}
              >
                {CUSTOMER_TYPE_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3.5">
          {f.type === "wholesale" && (
            <div>
              <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">نام کسب‌وکار (کافه، رستوران، هتل…)</label>
              <input className={`field ${errors.business ? "field-error" : ""}`} value={f.business} onChange={(e) => set("business", e.target.value)} placeholder="مثلاً: کافه شهرزاد" />
              {errors.business && <p className="mt-1 font-mono text-[10px] text-cherry-400">{errors.business}</p>}
            </div>
          )}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">نام و نام خانوادگی</label>
            <input className={`field ${errors.name ? "field-error" : ""}`} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="مثلاً: رضا قاسمی" />
            {errors.name && <p className="mt-1 font-mono text-[10px] text-cherry-400">{errors.name}</p>}
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">تلفن همراه</label>
            <input dir="ltr" className={`field text-end ${errors.phone ? "field-error" : ""}`} value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="0913 xxx xxxx" />
            {errors.phone && <p className="mt-1 font-mono text-[10px] text-cherry-400">{errors.phone}</p>}
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">آدرس (کاشان)</label>
            <textarea rows={2} className={`field resize-none ${errors.address ? "field-error" : ""}`} value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="کاشان، خیابان بهشتی، کوچه ۵، پلاک ۹" />
            {errors.address && <p className="mt-1 font-mono text-[10px] text-cherry-400">{errors.address}</p>}
          </div>
        </div>

        <button type="submit" className="mt-5 w-full rounded-full bg-ember-500 px-6 py-3.5 text-sm font-bold text-roast-950 transition-all hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
          {initial ? "ذخیرهٔ تغییرات" : "افزودن مشتری"}
        </button>
      </form>
    </div>
  );
}
