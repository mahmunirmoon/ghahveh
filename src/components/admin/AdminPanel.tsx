import { useState } from "react";
import { BUSINESS } from "../../data/business";
import { faDigits, formatDateLong } from "../../lib/format";
import { useStore } from "../../lib/store";
import {
  GridIcon, UsersIcon, BoxIcon, ReceiptIcon, ChartIcon, GearIcon, RefreshIcon, StoreIcon,
} from "../AdminIcons";
import { BeanIcon } from "../Icons";
import { Dashboard } from "./Dashboard";
import { OrdersTab } from "./OrdersTab";
import { CustomersTab } from "./CustomersTab";
import { ProductsTab } from "./ProductsTab";
import { LedgerTab } from "./LedgerTab";
import { ReportsTab } from "./ReportsTab";

export type TabKey =
  | "dashboard" | "orders" | "customers" | "products" | "ledger" | "reports" | "settings";

const TABS: { key: TabKey; label: string; icon: (p: { size?: number; className?: string }) => React.ReactNode }[] = [
  { key: "dashboard", label: "داشبورد", icon: GridIcon },
  { key: "orders", label: "سفارش‌ها", icon: StoreIcon },
  { key: "customers", label: "مشتریان", icon: UsersIcon },
  { key: "products", label: "محصولات و انبار", icon: BoxIcon },
  { key: "ledger", label: "دفتر حساب", icon: ReceiptIcon },
  { key: "reports", label: "گزارش‌ها و نمودارها", icon: ChartIcon },
  { key: "settings", label: "تنظیمات مجموعه", icon: GearIcon },
];

export function AdminPanel({ tab, onTab }: { tab: TabKey; onTab: (t: TabKey) => void }) {
  const { orders, resetAll } = useStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const newOrders = orders.filter((o) => o.status === "new").length;
  const active = TABS.find((t) => t.key === tab);

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-20">
      {/* سربرگ پنل */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-ember-500">پنل مدیریت {BUSINESS.name}</p>
          <h1 className="mt-2 font-display text-3xl sm:text-[2.2rem] text-cream-100 leading-tight">{active?.label}</h1>
        </div>
        <div className="text-start sm:text-end">
          <p className="font-mono text-[12px] text-cream-400">{formatDateLong(new Date())}</p>
          <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-cream-600">
            مدیریت: {BUSINESS.manager} · <span dir="ltr">{BUSINESS.phoneFa}</span>
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[225px_1fr]">
        {/* منوی کناری */}
        <aside>
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-2 lg:pb-0 lg:sticky lg:top-40">
            {TABS.map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => onTab(t.key)}
                  className={`group flex items-center gap-2.5 shrink-0 lg:shrink rounded-[10px] border px-3.5 py-2.5 text-[13.5px] font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "border-ember-500/60 bg-ember-500/12 text-ember-300"
                      : "border-cream-100/8 bg-roast-900/40 text-cream-400 hover:border-cream-100/20 hover:text-cream-200"
                  }`}
                  aria-pressed={isActive}
                >
                  <t.icon size={16} className={isActive ? "text-ember-400" : "text-cream-600 group-hover:text-cream-400"} />
                  {t.label}
                  {t.key === "orders" && newOrders > 0 && (
                    <span className="ms-auto grid place-items-center min-w-[20px] h-5 px-1 rounded-full bg-cherry-500 text-cream-100 font-mono text-[10px]">
                      {faDigits(newOrders)}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:block mt-4 rounded-[10px] border border-cream-100/8 bg-roast-900/40 p-3.5">
            <p className="font-mono text-[10px] tracking-[0.14em] text-cream-600">داده‌ها به‌صورت خودکار در مرورگر ذخیره می‌شوند.</p>
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-cream-100/12 px-3 py-1.5 text-[11.5px] font-semibold text-cream-400 transition-all hover:border-cherry-500/50 hover:text-cherry-400 cursor-pointer"
              >
                <RefreshIcon size={13} />
                بازنشانی دادهٔ نمونه
              </button>
            ) : (
              <div className="mt-3 space-y-2">
                <p className="text-[11px] text-cherry-400">همهٔ تغییرات پاک و دادهٔ نمونه برگردانده شود؟</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { resetAll(); setConfirmReset(false); }}
                    className="rounded-full bg-cherry-500 px-3 py-1.5 text-[11.5px] font-bold text-cream-100 hover:bg-cherry-400 transition-colors cursor-pointer"
                  >
                    بله، بازنشانی
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="rounded-full border border-cream-100/12 px-3 py-1.5 text-[11.5px] text-cream-400 hover:text-cream-200 cursor-pointer"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* محتوای تب */}
        <section className="min-w-0">
          {tab === "dashboard" && <Dashboard />}
          {tab === "orders" && <OrdersTab />}
          {tab === "customers" && <CustomersTab />}
          {tab === "products" && <ProductsTab />}
          {tab === "ledger" && <LedgerTab />}
          {tab === "reports" && <ReportsTab />}
          {tab === "settings" && <SettingsTab />}
        </section>
      </div>
    </main>
  );
}

/* ---------------- تنظیمات مجموعه ---------------- */
function SettingsTab() {
  const info: [string, string][] = [
    ["نام مجموعه", BUSINESS.name],
    ["مدیریت", BUSINESS.manager],
    ["شماره تماس (فارسی)", BUSINESS.phoneFa],
    ["شماره تماس (بین‌المللی)", BUSINESS.phoneIntl],
    ["کشور", BUSINESS.country],
    ["استان", BUSINESS.province],
    ["شهر", BUSINESS.city],
    ["آدرس", BUSINESS.address],
    ["آدرس کامل", BUSINESS.addressFull],
    ["ساعت کاری هفته", BUSINESS.hoursWeek],
    ["ساعت کاری جمعه", BUSINESS.hoursFriday],
    ["روزهای رست", BUSINESS.roastDays],
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 p-5 sm:p-6">
        <h3 className="flex items-center gap-2.5 font-display text-xl text-cream-100">
          <BeanIcon size={18} className="text-ember-400" />
          پروفایل کسب‌وکار
        </h3>
        <dl className="mt-4 space-y-2.5">
          {info.map(([k, v]) => (
            <div key={k} className="flex items-start justify-between gap-4 border-b border-cream-100/6 pb-2.5 last:border-0">
              <dt className="font-mono text-[11px] tracking-[0.1em] text-cream-600 shrink-0 pt-0.5">{k}</dt>
              <dd className="text-sm text-cream-300 text-end">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="space-y-5">
        <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 p-5 sm:p-6">
          <h3 className="font-display text-xl text-cream-100">دربارهٔ این نسخه</h3>
          <p className="mt-3 text-sm leading-relaxed text-cream-500">
            این سامانه شامل فروشگاه آنلاین، ثبت سفارش، مدیریت مشتریان، محصولات و انبار،
            دفتر حساب (بدهکار/بستانکار با ماندهٔ زنده) و گزارش‌های نموداری است.
            همهٔ داده‌ها نمونهٔ قابل ویرایش‌اند و در مرورگر همین دستگاه ذخیره می‌شوند.
          </p>
        </div>
        <div className="rounded-[13px] border border-cherry-500/25 bg-cherry-500/6 p-5 sm:p-6">
          <h3 className="font-display text-xl text-cherry-400">یادآوری امنیتی</h3>
          <ul className="mt-3 space-y-2 text-sm text-cream-500 list-disc pr-5">
            <li>شمارهٔ کارت، شبا و کد ملی واقعی در سامانه وارد نکنید.</li>
            <li>تنها شمارهٔ تماس نمایشی رسمی: <span dir="ltr" className="font-mono text-cream-300">{BUSINESS.phoneFa}</span></li>
            <li>تمام مبالغ به تومان است؛ دادهٔ ارزی خارجی وجود ندارد.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
