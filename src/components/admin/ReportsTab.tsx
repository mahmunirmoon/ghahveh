import { useMemo } from "react";
import {
  ComposedChart, Bar, Line, PieChart, Pie, Cell, BarChart,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { useStore } from "../../lib/store";
import { orderSubtotal, orderProfit } from "../../data/seeds";
import { CATEGORY_LABEL, type ProductCategory } from "../../data/products";
import { STATUS_LABEL } from "../../data/business";
import { faDigits, formatToman, formatTomanShort, monthKey, monthLabel, jalaliDate } from "../../lib/format";

const tooltipStyle = {
  background: "#1a110b",
  border: "1px solid rgba(228,210,177,0.15)",
  borderRadius: 10,
  fontFamily: "Vazirmatn",
  fontSize: 12,
  direction: "rtl" as const,
};

const PIE_COLORS = ["#E19A38", "#C24E2E", "#86966C", "#E4D2B1", "#C67F24", "#A3B18A"];

export function ReportsTab() {
  const { products, orders, transactions } = useStore();

  const data = useMemo(() => {
    const valid = orders.filter((o) => o.status !== "cancelled");

    // ۶ ماه اخیر شمسی
    const months: { key: string; label: string }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 15);
      months.push({ key: monthKey(d), label: monthLabel(d) });
    }

    const monthly = months.map((m) => {
      const mOrders = valid.filter((o) => monthKey(o.dateISO) === m.key);
      const revenue = mOrders.reduce((s, o) => s + orderSubtotal(o, products), 0);
      const profit = mOrders.reduce((s, o) => s + orderProfit(o, products), 0);
      const cost = transactions
        .filter((t) => monthKey(t.dateISO) === m.key && (t.type === "هزینه" || t.type === "خرید"))
        .reduce((s, t) => s + t.debit, 0);
      return { label: m.label, revenue, cost, profit, count: mOrders.length };
    });

    // فروش بر اساس دسته
    const catMap = new Map<string, number>();
    valid.forEach((o) =>
      o.items.forEach((it) => {
        const p = products.find((x) => x.id === it.productId);
        if (!p) return;
        catMap.set(p.category, (catMap.get(p.category) ?? 0) + p.price * it.qty);
      }),
    );
    const byCategory = [...catMap.entries()]
      .map(([cat, total]) => ({ name: CATEGORY_LABEL[cat as ProductCategory], value: total }))
      .sort((a, b) => b.value - a.value);

    // پرفروش‌ها بر اساس تعداد
    const qtyMap = new Map<string, number>();
    valid.forEach((o) =>
      o.items.forEach((it) => qtyMap.set(it.productId, (qtyMap.get(it.productId) ?? 0) + it.qty)),
    );
    const top = [...qtyMap.entries()]
      .map(([id, qty]) => ({
        name: products.find((p) => p.id === id)?.name ?? id,
        qty,
        total: (products.find((p) => p.id === id)?.price ?? 0) * qty,
      }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8)
      .reverse(); // برای نمایش در نمودار افقی

    // وضعیت سفارش‌ها
    const statusData = (Object.keys(STATUS_LABEL) as (keyof typeof STATUS_LABEL)[]).map((k) => ({
      name: STATUS_LABEL[k],
      value: orders.filter((o) => o.status === k).length,
    })).filter((x) => x.value > 0);

    return { monthly, byCategory, top, statusData };
  }, [products, orders, transactions]);

  return (
    <div className="space-y-6">
      {/* درآمد و هزینهٔ ماهانه */}
      <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h3 className="font-display text-lg text-cream-100">درآمد، هزینه و سود — ۶ ماه اخیر</h3>
          <p className="font-mono text-[10.5px] text-cream-600">درآمد و سود از سفارش‌ها · هزینه از اسناد دفتر حساب</p>
        </div>
        <div dir="ltr" className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.monthly} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(228,210,177,0.07)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#947e5f", fontSize: 11, fontFamily: "Vazirmatn" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v: number) => formatTomanShort(v)} tick={{ fill: "#947e5f", fontSize: 10, fontFamily: "Vazirmatn" }} axisLine={false} tickLine={false} width={75} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [formatToman(Number(v)), String(n)]} labelStyle={{ color: "#E4D2B1" }} />
              <Legend wrapperStyle={{ fontFamily: "Vazirmatn", fontSize: 12, direction: "rtl" }} />
              <Bar name="درآمد فروش" dataKey="revenue" fill="#E19A38" radius={[5, 5, 0, 0]} barSize={18} />
              <Bar name="هزینه‌ها" dataKey="cost" fill="#C24E2E" radius={[5, 5, 0, 0]} barSize={18} />
              <Line name="سود خالص" type="monotone" dataKey="profit" stroke="#A3B18A" strokeWidth={2.4} dot={{ r: 3, fill: "#A3B18A" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {/* فروش بر اساس دسته */}
        <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 p-5">
          <h3 className="font-display text-lg text-cream-100">فروش بر اساس گروه محصول</h3>
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 mt-2">
            <div dir="ltr" className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.byCategory} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={3} stroke="none">
                    {data.byCategory.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [formatToman(Number(v)), String(n)]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2">
              {data.byCategory.map((c, i) => (
                <li key={c.name} className="flex items-center gap-2 text-[12px] text-cream-400">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {c.name}
                  <span className="font-mono text-cream-600">{formatTomanShort(c.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* وضعیت سفارش‌ها + جمع‌بندی */}
        <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 p-5">
          <h3 className="font-display text-lg text-cream-100">وضعیت سفارش‌ها</h3>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {data.statusData.map((s) => (
              <div key={s.name} className="rounded-[10px] border border-cream-100/10 bg-roast-875/60 px-3 py-3 text-center transition-all hover:border-ember-500/30">
                <p className="font-display text-2xl text-ember-400">{faDigits(s.value)}</p>
                <p className="mt-1 font-mono text-[10.5px] tracking-[0.08em] text-cream-500">{s.name}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12.5px] leading-relaxed text-cream-500">
            چرخهٔ هر سفارش: جدید ← در حال آماده‌سازی ← آماده ارسال ← ارسال شده ← تحویل شده.
            تغییر وضعیت از تب «سفارش‌ها» انجام می‌شود و فوراً در داشبورد و اینجا اثر می‌گذارد.
          </p>
        </div>
      </div>

      {/* پرفروش‌ها */}
      <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 p-5">
        <h3 className="font-display text-lg text-cream-100">محصولات پرفروش (بر اساس تعداد فروش)</h3>
        <div dir="ltr" className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.top} layout="vertical" margin={{ top: 0, right: 15, left: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(228,210,177,0.07)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#947e5f", fontSize: 10, fontFamily: "Vazirmatn" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={190}
                tick={{ fill: "#D0BA95", fontSize: 11, fontFamily: "Vazirmatn" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [n === "تعداد" ? faDigits(Number(v)) : formatToman(Number(v)), String(n)]} cursor={{ fill: "rgba(228,210,177,0.05)" }} />
              <Bar name="تعداد" dataKey="qty" fill="#C67F24" radius={[0, 6, 6, 0]} barSize={15} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* جدول خلاصهٔ ماهانه */}
      <div className="rounded-[13px] border border-cream-100/9 bg-roast-900/50 p-5 overflow-x-auto">
        <h3 className="font-display text-lg text-cream-100">خلاصهٔ ماهانه</h3>
        <table className="mt-3 w-full min-w-[620px] text-[13px]">
          <thead>
            <tr className="text-right font-mono text-[10px] tracking-[0.12em] text-cream-600 border-b border-cream-100/10">
              <th className="py-2.5 font-medium">ماه</th>
              <th className="py-2.5 font-medium">تعداد سفارش</th>
              <th className="py-2.5 font-medium">درآمد فروش</th>
              <th className="py-2.5 font-medium">هزینهٔ ثبت‌شده</th>
              <th className="py-2.5 font-medium">سود ناخالص فروش</th>
            </tr>
          </thead>
          <tbody>
            {[...data.monthly].reverse().map((m) => (
              <tr key={m.label} className="border-b border-cream-100/6 last:border-0 hover:bg-roast-875/60 transition-colors">
                <td className="py-2.5 text-cream-200 font-semibold">{m.label}</td>
                <td className="py-2.5 font-mono text-cream-400">{faDigits(m.count)}</td>
                <td className="py-2.5 font-mono text-cream-200">{formatToman(m.revenue)}</td>
                <td className="py-2.5 font-mono text-cherry-400">{formatToman(m.cost)}</td>
                <td className="py-2.5 font-mono text-leaf-300">{formatToman(m.profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 font-mono text-[10.5px] text-cream-700">
          سال جاری: {faDigits(jalaliDate(new Date()).jy)} — همهٔ مبالغ به تومان
        </p>
      </div>
    </div>
  );
}
