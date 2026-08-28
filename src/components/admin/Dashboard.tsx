import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useStore } from "../../lib/store";
import { orderSubtotal, orderProfit } from "../../data/seeds";
import { ORDER_STATUSES, STATUS_LABEL, PAYMENT_LABEL, type PaymentKey } from "../../data/business";
import { faDigits, formatToman, formatTomanShort, monthKey, dayLabel, formatDate } from "../../lib/format";
import {
  WalletIcon, TrendUpIcon, UsersIcon, BoxIcon, AlertIcon, CashIcon, StoreIcon, ReceiptIcon,
} from "../AdminIcons";

const STATUS_COLORS: Record<string, string> = {
  new: "#E19A38",
  preparing: "#C24E2E",
  ready: "#E4D2B1",
  shipped: "#D0BA95",
  delivered: "#86966C",
  cancelled: "#73614A",
};

function Kpi({
  label, value, sub, icon, tone = "ember",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  tone?: "ember" | "leaf" | "cherry" | "cream";
}) {
  const tones: Record<string, string> = {
    ember: "text-ember-400 bg-ember-500/10 border-ember-500/25",
    leaf: "text-leaf-300 bg-leaf-500/10 border-leaf-500/25",
    cherry: "text-cherry-400 bg-cherry-500/10 border-cherry-500/25",
    cream: "text-cream-300 bg-cream-100/8 border-cream-100/15",
  };
  return (
    <div className="rounded-[12px] border border-cream-100/9 bg-roast-900/50 p-4 transition-all duration-300 hover:border-ember-500/30 hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10.5px] tracking-[0.12em] text-cream-600">{label}</p>
        <span className={`grid place-items-center w-8 h-8 rounded-[9px] border ${tones[tone]}`}>{icon}</span>
      </div>
      <p className="mt-2.5 font-display text-[1.35rem] leading-tight text-cream-100">{value}</p>
      {sub && <p className="mt-1 font-mono text-[10px] text-cream-600">{sub}</p>}
    </div>
  );
}

const tooltipStyle = {
  background: "#1a110b",
  border: "1px solid rgba(228,210,177,0.15)",
  borderRadius: 10,
  fontFamily: "Vazirmatn",
  fontSize: 12,
  direction: "rtl" as const,
};

export function Dashboard() {
  const { products, customers, orders, transactions } = useStore();

  const calc = useMemo(() => {
    const valid = orders.filter((o) => o.status !== "cancelled");
    const todayStr = new Date().toDateString();
    const mk = monthKey(new Date());
    const sameDay = (iso: string) => new Date(iso).toDateString() === todayStr;
    const inMonth = (iso: string) => monthKey(iso) === mk;

    const salesToday = valid.filter((o) => sameDay(o.dateISO)).reduce((s, o) => s + orderSubtotal(o, products), 0);
    const salesMonth = valid.filter((o) => inMonth(o.dateISO)).reduce((s, o) => s + orderSubtotal(o, products), 0);
    const profitMonth = valid.filter((o) => inMonth(o.dateISO)).reduce((s, o) => s + orderProfit(o, products), 0);
    const ordersToday = orders.filter((o) => sameDay(o.dateISO)).length;
    const receivables = orders
      .filter((o) => o.payment === "credit" && o.status !== "delivered" && o.status !== "cancelled")
      .reduce((s, o) => s + orderSubtotal(o, products), 0);
    const payables = transactions
      .filter((t) => t.status === "pending")
      .reduce((s, t) => s + t.debit - t.credit, 0);
    const cash = transactions.reduce((s, t) => s + t.credit - t.debit, 0);
    const inventoryValue = products
      .filter((p) => p.category !== "drink")
      .reduce((s, p) => s + p.stock * p.purchasePrice, 0);
    const lowStock = products.filter((p) => p.category !== "drink" && p.stock <= p.minStock);
    const activeCustomers = new Set(valid.map((o) => o.customerId)).size;

    // فروش ۱۴ روز اخیر
    const days: { label: string; total: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const total = valid
        .filter((o) => new Date(o.dateISO).toDateString() === key)
        .reduce((s, o) => s + orderSubtotal(o, products), 0);
      days.push({ label: dayLabel(d), total });
    }

    const statusData = ORDER_STATUSES.map((s) => ({
      name: s.label,
      key: s.key,
      value: orders.filter((o) => o.status === s.key).length,
    })).filter((x) => x.value > 0);

    const payData = (Object.keys(PAYMENT_LABEL) as PaymentKey[])
      .map((k) => ({
        name: PAYMENT_LABEL[k],
        total: valid.filter((o) => o.payment === k).reduce((s, o) => s + orderSubtotal(o, products), 0),
      }))
      .filter((x) => x.total > 0)
      .sort((a, b) => b.total - a.total);

    return {
      salesToday, salesMonth, profitMonth, ordersToday, receivables, payables,
      cash, inventoryValue, lowStock, activeCustomers, days, statusData, payData,
      recent: [...orders].sort((a, b) => b.dateISO.localeCompare(a.dateISO)).slice(0, 6),
    };
  }, [products, customers, orders, transactions]);

  const cName = (id: string) => customers.find((c) => c.id === id);

  return (
    <div className="space-y-6">
      {/* کارت‌های شاخص */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        <Kpi label="فروش امروز" value={formatToman(calc.salesToday)} sub={`${faDigits(calc.ordersToday)} سفارش امروز`} icon={<CashIcon size={16} />} />
        <Kpi label="فروش این ماه" value={formatToman(calc.salesMonth)} icon={<TrendUpIcon size={16} />} />
        <Kpi label="سود این ماه" value={formatToman(calc.profitMonth)} sub="بر اساس قیمت خرید" tone="leaf" icon={<TrendUpIcon size={16} />} />
        <Kpi label="مطالبات مشتریان" value={formatToman(calc.receivables)} sub="فروش اعتباری باز" tone="cherry" icon={<ReceiptIcon size={16} />} />
        <Kpi label="بدهی به تأمین‌کنندگان" value={formatToman(calc.payables)} sub="اسناد در انتظار تسویه" tone="cherry" icon={<WalletIcon size={16} />} />
        <Kpi label="موجودی نقدی صندوق" value={formatToman(calc.cash)} sub="ماندهٔ دفتر حساب" tone="leaf" icon={<WalletIcon size={16} />} />
        <Kpi label="ارزش موجودی انبار" value={formatToman(calc.inventoryValue)} sub="به قیمت خرید" icon={<BoxIcon size={16} />} />
        <Kpi label="مشتریان فعال" value={faDigits(calc.activeCustomers)} sub="خرید از مجموعه" tone="cream" icon={<UsersIcon size={16} />} />
        <Kpi label="محصولات کم‌موجودی" value={faDigits(calc.lowStock.length)} sub="نیازمند سفارش خرید" tone={calc.lowStock.length > 0 ? "cherry" : "leaf"} icon={<AlertIcon size={16} />} />
        <Kpi label="سفارش‌های امروز" value={faDigits(calc.ordersToday)} icon={<StoreIcon size={16} />} />
      </div>

      {/* نمودارها */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 p-5">
          <h3 className="font-display text-lg text-cream-100">روند فروش ۱۴ روز اخیر</h3>
          <div dir="ltr" className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calc.days} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSale" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E19A38" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#E19A38" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(228,210,177,0.07)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#947e5f", fontSize: 11, fontFamily: "Vazirmatn" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v: number) => formatTomanShort(v)} tick={{ fill: "#947e5f", fontSize: 10, fontFamily: "Vazirmatn" }} axisLine={false} tickLine={false} width={70} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => [formatToman(Number(v)), "فروش"]}
                  labelStyle={{ color: "#E4D2B1" }}
                />
                <Area type="monotone" dataKey="total" stroke="#E19A38" strokeWidth={2.2} fill="url(#gSale)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 p-5">
          <h3 className="font-display text-lg text-cream-100">وضعیت سفارش‌ها</h3>
          <div className="grid grid-cols-2 items-center gap-2 mt-2">
            <div dir="ltr" className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={calc.statusData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={70} paddingAngle={3} stroke="none">
                    {calc.statusData.map((s) => (
                      <Cell key={s.key} fill={STATUS_COLORS[s.key]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [faDigits(Number(v)), n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-1.5">
              {calc.statusData.map((s) => (
                <li key={s.key} className="flex items-center gap-2 text-[12px] text-cream-400">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: STATUS_COLORS[s.key] }} />
                  {s.name}
                  <span className="font-mono text-cream-600">({faDigits(s.value)})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        {/* آخرین سفارش‌ها */}
        <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 p-5 overflow-x-auto">
          <h3 className="font-display text-lg text-cream-100">آخرین سفارش‌ها</h3>
          <table className="mt-3 w-full min-w-[520px] text-[13px]">
            <thead>
              <tr className="text-right font-mono text-[10px] tracking-[0.12em] text-cream-600 border-b border-cream-100/10">
                <th className="py-2 font-medium">شماره</th>
                <th className="py-2 font-medium">تاریخ</th>
                <th className="py-2 font-medium">مشتری</th>
                <th className="py-2 font-medium">وضعیت</th>
                <th className="py-2 font-medium text-left">مبلغ</th>
              </tr>
            </thead>
            <tbody>
              {calc.recent.map((o) => {
                const c = cName(o.customerId);
                return (
                  <tr key={o.id} className="border-b border-cream-100/6 last:border-0 hover:bg-roast-875/60 transition-colors">
                    <td className="py-2.5 font-mono text-ember-400">{faDigits(o.id)}</td>
                    <td className="py-2.5 text-cream-500">{formatDate(o.dateISO)}</td>
                    <td className="py-2.5 text-cream-300">{c?.business ?? c?.name ?? "—"}</td>
                    <td className="py-2.5 text-cream-400">{STATUS_LABEL[o.status]}</td>
                    <td className="py-2.5 text-left font-mono text-cream-200">{formatToman(orderSubtotal(o, products))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* روش‌های پرداخت */}
        <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 p-5">
          <h3 className="font-display text-lg text-cream-100">روش‌های پرداخت</h3>
          <div dir="ltr" className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calc.payData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(228,210,177,0.07)" horizontal={false} />
                <XAxis type="number" tickFormatter={(v: number) => formatTomanShort(v)} tick={{ fill: "#947e5f", fontSize: 10, fontFamily: "Vazirmatn" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={85} tick={{ fill: "#D0BA95", fontSize: 11, fontFamily: "Vazirmatn" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatToman(Number(v)), "مجموع"]} cursor={{ fill: "rgba(228,210,177,0.05)" }} />
                <Bar dataKey="total" fill="#C67F24" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* کم‌موجودی‌ها */}
      {calc.lowStock.length > 0 && (
        <div className="rounded-[13px] border border-cherry-500/25 bg-cherry-500/6 p-5">
          <h3 className="flex items-center gap-2 font-display text-lg text-cherry-400">
            <AlertIcon size={17} />
            نیازمند سفارش خرید
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {calc.lowStock.map((p) => (
              <span key={p.id} className="rounded-full border border-cherry-500/30 bg-roast-900/60 px-3.5 py-1.5 text-[12.5px] text-cream-300">
                {p.name}
                <span className="font-mono text-[11px] text-cherry-400 ms-2">موجودی: {faDigits(p.stock)} {p.unit}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
