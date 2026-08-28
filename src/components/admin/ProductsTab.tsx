import { useMemo, useState, type FormEvent } from "react";
import { useStore } from "../../lib/store";
import {
  CATEGORIES, CATEGORY_LABEL,
  type Product, type ProductCategory,
} from "../../data/products";
import { SUPPLIERS, UNITS } from "../../data/business";
import { faDigits, formatDate, formatToman, toEnDigits } from "../../lib/format";
import { PlusIcon, TrashIcon, CloseIcon } from "../Icons";
import { PencilIcon, AlertIcon } from "../AdminIcons";

type SubTab = "all" | "drinks" | "inventory";

const DEFAULT_IMG: Record<ProductCategory, string> = {
  beans: "https://image.qwenlm.ai/generated-images/0010b6ed-f356-4651-a527-0111dbcebc58/_result.png",
  brew: "https://image.qwenlm.ai/generated-images/33413b83-ca41-4998-8f1c-247392c65f02/_result.png",
  syrup: "https://image.qwenlm.ai/generated-images/139f6130-5a70-479c-8c91-c76d6eccd980/_result.png",
  equip: "https://image.qwenlm.ai/generated-images/3ad3c9cd-d606-42fb-970b-db956f14529a/_result.png",
  drink: "https://image.qwenlm.ai/generated-images/ee8b6cef-59e7-4a40-b932-3e9ef3706ec7/_result.png",
};

export function ProductsTab() {
  const { products } = useStore();
  const [sub, setSub] = useState<SubTab>("all");
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState<"all" | ProductCategory>("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { deleteProduct } = useStore();

  const filtered = useMemo(() => {
    const q = query.trim();
    return products
      .filter((p) => (catFilter === "all" ? true : p.category === catFilter))
      .filter((p) => !q || p.name.includes(q) || CATEGORY_LABEL[p.category].includes(q));
  }, [products, query, catFilter]);

  const supName = (id: string) => SUPPLIERS.find((s) => s.id === id)?.name ?? "—";
  const drinks = products.filter((p) => p.category === "drink");
  const goods = products.filter((p) => p.category !== "drink");
  const inventoryValue = goods.reduce((s, p) => s + p.stock * p.purchasePrice, 0);

  return (
    <div className="space-y-5">
      {/* زیربخش‌ها */}
      <div className="flex flex-wrap gap-2">
        {([
          ["all", "همهٔ محصولات"],
          ["drinks", "منوی نوشیدنی کافه"],
          ["inventory", "انبار"],
        ] as [SubTab, string][]).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setSub(k)}
            className={`rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-all cursor-pointer ${
              sub === k
                ? "border-ember-500 bg-ember-500 text-roast-950"
                : "border-cream-100/12 text-cream-400 hover:border-ember-500/50 hover:text-ember-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {sub !== "drinks" && (
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جست‌وجوی محصول…"
            className="field !rounded-full !py-2.5 !text-sm max-w-xs"
            aria-label="جست‌وجوی محصولات"
          />
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value as "all" | ProductCategory)}
            className="field !w-auto !py-2 !rounded-full !text-[13px] cursor-pointer"
            aria-label="فیلتر دسته‌بندی"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === "all" ? "همهٔ دسته‌ها" : CATEGORY_LABEL[c]}</option>
            ))}
          </select>
          {sub === "all" && (
            <button
              onClick={() => setCreating(true)}
              className="md:mr-auto inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2.5 text-sm font-bold text-roast-950 transition-all hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <PlusIcon size={15} />
              محصول جدید
            </button>
          )}
        </div>
      )}

      {/* همهٔ محصولات */}
      {sub === "all" && (
        <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 overflow-x-auto">
          <table className="w-full min-w-[880px] text-[13px]">
            <thead>
              <tr className="text-right font-mono text-[10px] tracking-[0.12em] text-cream-600 border-b border-cream-100/10 bg-roast-875/50">
                <th className="py-3 px-4 font-medium">محصول</th>
                <th className="py-3 px-2 font-medium">دسته</th>
                <th className="py-3 px-2 font-medium">موجودی</th>
                <th className="py-3 px-2 font-medium">قیمت خرید</th>
                <th className="py-3 px-2 font-medium">قیمت فروش</th>
                <th className="py-3 px-2 font-medium">تأمین‌کننده</th>
                <th className="py-3 px-4 font-medium text-left">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const low = p.category !== "drink" && p.stock <= p.minStock;
                return (
                  <tr key={p.id} className={`border-b border-cream-100/6 last:border-0 hover:bg-roast-875/60 transition-colors ${low ? "bg-cherry-500/4" : ""}`}>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.img} alt="" className="w-11 h-11 rounded-[8px] object-cover border border-cream-100/10" />
                        <div className="min-w-0">
                          <p className="text-cream-200 font-semibold truncate max-w-[260px]">{p.name}</p>
                          <p className="font-mono text-[10px] text-cream-600 mt-0.5">{p.pack} · {p.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-cream-400 whitespace-nowrap">{CATEGORY_LABEL[p.category]}</td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      {p.category === "drink" ? (
                        <span className="text-cream-500">—</span>
                      ) : (
                        <span className={`font-mono ${low ? "text-cherry-400" : "text-cream-300"}`}>
                          {faDigits(p.stock)} {p.unit}
                          {low && <span className="block font-mono text-[9.5px] text-cherry-400">کم‌موجود</span>}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-cream-400 whitespace-nowrap">{formatToman(p.purchasePrice)}</td>
                    <td className="py-2.5 px-2 font-mono text-cream-200 whitespace-nowrap">{formatToman(p.price)}</td>
                    <td className="py-2.5 px-2 text-cream-500 whitespace-nowrap max-w-[160px] truncate">{supName(p.supplierId)}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(p)} className="grid place-items-center w-8 h-8 rounded-md text-cream-500 hover:text-ember-400 hover:bg-ember-500/10 transition-all cursor-pointer" aria-label={`ویرایش ${p.name}`}>
                          <PencilIcon size={15} />
                        </button>
                        {confirmDelete === p.id ? (
                          <span className="inline-flex items-center gap-1.5">
                            <button onClick={() => { deleteProduct(p.id); setConfirmDelete(null); }} className="rounded-full bg-cherry-500 px-2.5 py-1 text-[10.5px] font-bold text-cream-100 hover:bg-cherry-400 cursor-pointer">حذف</button>
                            <button onClick={() => setConfirmDelete(null)} className="rounded-full border border-cream-100/12 px-2.5 py-1 text-[10.5px] text-cream-400 cursor-pointer">انصراف</button>
                          </span>
                        ) : (
                          <button onClick={() => setConfirmDelete(p.id)} className="grid place-items-center w-8 h-8 rounded-md text-cream-600 hover:text-cherry-400 hover:bg-cherry-500/10 transition-all cursor-pointer" aria-label={`حذف ${p.name}`}>
                            <TrashIcon size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* منوی نوشیدنی */}
      {sub === "drinks" && <DrinksEditor />}

      {/* انبار */}
      {sub === "inventory" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div className="rounded-[12px] border border-cream-100/9 bg-roast-900/50 p-4">
              <p className="font-mono text-[10.5px] tracking-[0.12em] text-cream-600">ارزش کل موجودی</p>
              <p className="mt-2 font-display text-[1.3rem] text-cream-100">{formatToman(inventoryValue)}</p>
            </div>
            <div className="rounded-[12px] border border-cream-100/9 bg-roast-900/50 p-4">
              <p className="font-mono text-[10.5px] tracking-[0.12em] text-cream-600">تعداد اقلام انبار</p>
              <p className="mt-2 font-display text-[1.3rem] text-cream-100">{faDigits(goods.length)} قلم</p>
            </div>
            <div className="rounded-[12px] border border-cream-100/9 bg-roast-900/50 p-4 col-span-2 lg:col-span-1">
              <p className="font-mono text-[10.5px] tracking-[0.12em] text-cream-600">کم‌موجودی‌ها</p>
              <p className="mt-2 font-display text-[1.3rem] text-cherry-400">
                {faDigits(goods.filter((p) => p.stock <= p.minStock).length)} قلم
              </p>
            </div>
          </div>

          <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 overflow-x-auto">
            <table className="w-full min-w-[980px] text-[13px]">
              <thead>
                <tr className="text-right font-mono text-[10px] tracking-[0.12em] text-cream-600 border-b border-cream-100/10 bg-roast-875/50">
                  <th className="py-3 px-4 font-medium">نام محصول</th>
                  <th className="py-3 px-2 font-medium">دسته</th>
                  <th className="py-3 px-2 font-medium">موجودی</th>
                  <th className="py-3 px-2 font-medium">واحد</th>
                  <th className="py-3 px-2 font-medium">حداقل</th>
                  <th className="py-3 px-2 font-medium">قیمت خرید</th>
                  <th className="py-3 px-2 font-medium">قیمت فروش</th>
                  <th className="py-3 px-2 font-medium">ارزش موجودی</th>
                  <th className="py-3 px-2 font-medium">تأمین‌کننده</th>
                  <th className="py-3 px-4 font-medium text-left">بروزرسانی</th>
                </tr>
              </thead>
              <tbody>
                {goods.map((p) => {
                  const low = p.stock <= p.minStock;
                  return (
                    <tr key={p.id} className={`border-b border-cream-100/6 last:border-0 hover:bg-roast-875/60 transition-colors ${low ? "bg-cherry-500/4" : ""}`}>
                      <td className="py-2.5 px-4 text-cream-200 font-semibold">
                        <span className="inline-flex items-center gap-2">
                          {low && <AlertIcon size={13} className="text-cherry-400 shrink-0" />}
                          {p.name}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-cream-400 whitespace-nowrap">{CATEGORY_LABEL[p.category]}</td>
                      <td className={`py-2.5 px-2 font-mono ${low ? "text-cherry-400" : "text-cream-300"}`}>{faDigits(p.stock)}</td>
                      <td className="py-2.5 px-2 text-cream-500">{p.unit}</td>
                      <td className="py-2.5 px-2 font-mono text-cream-500">{faDigits(p.minStock)}</td>
                      <td className="py-2.5 px-2 font-mono text-cream-400 whitespace-nowrap">{formatToman(p.purchasePrice)}</td>
                      <td className="py-2.5 px-2 font-mono text-cream-300 whitespace-nowrap">{formatToman(p.price)}</td>
                      <td className="py-2.5 px-2 font-mono text-cream-200 whitespace-nowrap">{formatToman(p.stock * p.purchasePrice)}</td>
                      <td className="py-2.5 px-2 text-cream-500 whitespace-nowrap max-w-[150px] truncate">{supName(p.supplierId)}</td>
                      <td className="py-2.5 px-4 text-left font-mono text-cream-500 whitespace-nowrap">{formatDate(p.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {(creating || editing) && (
        <ProductModal
          initial={editing ?? undefined}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

/* ---------------- ویرایشگر سریع منوی کافه ---------------- */
function DrinksEditor() {
  const { products, updateProduct } = useStore();
  const drinks = products.filter((p) => p.category === "drink");
  const [savedId, setSavedId] = useState<string | null>(null);

  const setPrice = (p: Product, raw: string) => {
    const v = Math.max(0, parseInt(toEnDigits(raw).replace(/[^\d]/g, ""), 10) || 0);
    updateProduct(p.id, { price: v });
    setSavedId(p.id);
    window.setTimeout(() => setSavedId((s) => (s === p.id ? null : s)), 1200);
  };

  return (
    <div>
      <p className="text-sm text-cream-500">قیمت هر نوشیدنی را مستقیم ویرایش کنید؛ تغییرات فوراً در فروشگاه و گزارش‌ها اعمال می‌شود.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {drinks.map((p) => (
          <div key={p.id} className="rounded-[12px] border border-cream-100/9 bg-roast-900/50 p-4 flex items-center gap-3.5 transition-all hover:border-ember-500/30">
            <img src={p.img} alt="" className="w-12 h-12 rounded-[9px] object-cover border border-cream-100/10" />
            <div className="flex-1 min-w-0">
              <p className="text-cream-200 font-semibold text-[13.5px] truncate">{p.name}</p>
              <p className="font-mono text-[10px] text-cream-600 mt-0.5">{p.pack}</p>
            </div>
            <div className="text-end shrink-0">
              <div className="flex items-center gap-1.5" dir="ltr">
                <input
                  type="text"
                  inputMode="numeric"
                  defaultValue={String(p.price)}
                  key={p.id + p.price}
                  onBlur={(e) => setPrice(p, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  }}
                  className="field !w-[105px] !py-1.5 !px-2 text-center font-mono !text-[13px]"
                  aria-label={`قیمت ${p.name} به تومان`}
                />
                <span className="text-[10.5px] text-cream-600 w-9 text-right">تومان</span>
              </div>
              <p className={`mt-1 font-mono text-[9.5px] transition-opacity ${savedId === p.id ? "text-leaf-300 opacity-100" : "opacity-0"}`}>
                ذخیره شد ✓
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- مودال محصول ---------------- */
function ProductModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: Product;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { addProduct, updateProduct } = useStore();
  const [f, setF] = useState({
    name: initial?.name ?? "",
    category: (initial?.category ?? "beans") as ProductCategory,
    pack: initial?.pack ?? "۲۵۰ گرمی",
    unit: initial?.unit ?? "بسته",
    price: initial ? String(initial.price) : "",
    purchasePrice: initial ? String(initial.purchasePrice) : "",
    stock: initial ? String(initial.stock) : "0",
    minStock: initial ? String(initial.minStock) : "5",
    supplierId: initial?.supplierId ?? SUPPLIERS[0].id,
    desc: initial?.desc ?? "",
  });
  const [error, setError] = useState("");

  const num = (v: string) => Math.max(0, parseInt(toEnDigits(v).replace(/[^\d]/g, ""), 10) || 0);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) { setError("نام محصول الزامی است"); return; }
    if (num(f.price) <= 0) { setError("قیمت فروش را درست وارد کنید"); return; }
    const data = {
      name: f.name.trim(),
      category: f.category,
      pack: f.pack.trim() || "—",
      unit: f.unit,
      price: num(f.price),
      purchasePrice: num(f.purchasePrice),
      stock: num(f.stock),
      minStock: num(f.minStock),
      supplierId: f.supplierId,
      desc: f.desc.trim() || "توضیحاتی ثبت نشده است.",
      img: initial?.img ?? DEFAULT_IMG[f.category],
    };
    if (initial) updateProduct(initial.id, data);
    else addProduct({ ...data, id: `p-${Date.now().toString(36)}`, updatedAt: new Date().toISOString() });
    onSaved();
  };

  const set = (k: keyof typeof f, v: string) => { setF((x) => ({ ...x, [k]: v })); setError(""); };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label={initial ? "ویرایش محصول" : "محصول جدید"}>
      <div className="absolute inset-0 bg-roast-950/85 backdrop-blur-sm fade-in" onClick={onClose} />
      <form onSubmit={submit} className="modal-in relative w-full sm:max-w-2xl max-h-[94vh] overflow-y-auto rounded-t-[18px] sm:rounded-[16px] border border-cream-100/12 bg-roast-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-cream-100">{initial ? "ویرایش محصول" : "محصول جدید"}</h2>
          <button type="button" onClick={onClose} className="grid place-items-center w-9 h-9 rounded-full border border-cream-100/14 text-cream-300 hover:border-ember-500/60 hover:text-ember-400 hover:rotate-90 transition-all duration-300 cursor-pointer" aria-label="بستن">
            <CloseIcon size={15} />
          </button>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">نام محصول</label>
            <input className="field" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="مثلاً: قهوه اسپرسو ۷۰٪ روبوستا" />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">دسته‌بندی</label>
            <select className="field cursor-pointer" value={f.category} onChange={(e) => set("category", e.target.value)}>
              {(CATEGORIES.filter((c) => c !== "all") as ProductCategory[]).map((c) => (
                <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">تأمین‌کننده</label>
            <select className="field cursor-pointer" value={f.supplierId} onChange={(e) => set("supplierId", e.target.value)}>
              {SUPPLIERS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">بسته‌بندی</label>
            <input className="field" value={f.pack} onChange={(e) => set("pack", e.target.value)} placeholder="۲۵۰ گرمی" />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">واحد</label>
            <select className="field cursor-pointer" value={f.unit} onChange={(e) => set("unit", e.target.value)}>
              {UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">قیمت فروش (تومان)</label>
            <input inputMode="numeric" dir="ltr" className="field text-end font-mono" value={f.price} onChange={(e) => set("price", e.target.value)} placeholder="890000" />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">قیمت خرید (تومان)</label>
            <input inputMode="numeric" dir="ltr" className="field text-end font-mono" value={f.purchasePrice} onChange={(e) => set("purchasePrice", e.target.value)} placeholder="615000" />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">موجودی انبار</label>
            <input inputMode="numeric" dir="ltr" className="field text-end font-mono" value={f.stock} onChange={(e) => set("stock", e.target.value)} />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">حداقل موجودی (هشدار)</label>
            <input inputMode="numeric" dir="ltr" className="field text-end font-mono" value={f.minStock} onChange={(e) => set("minStock", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-mono text-[10px] tracking-[0.14em] text-cream-600 mb-1.5">توضیحات</label>
            <textarea rows={2} className="field resize-none" value={f.desc} onChange={(e) => set("desc", e.target.value)} placeholder="معرفی کوتاه محصول…" />
          </div>
        </div>

        {error && <p className="mt-3 font-mono text-[11px] text-cherry-400">{error}</p>}

        <button type="submit" className="mt-5 w-full rounded-full bg-ember-500 px-6 py-3.5 text-sm font-bold text-roast-950 transition-all hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
          {initial ? "ذخیرهٔ تغییرات" : "افزودن محصول"}
        </button>
      </form>
    </div>
  );
}
