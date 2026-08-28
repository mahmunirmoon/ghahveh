/* ─────────────────────────────────────────────────────────────
   استور مرکزی برنامه — محصولات، مشتریان، سفارش‌ها، دفتر حساب
   با ذخیرهٔ خودکار در localStorage و امکان بازنشانی دادهٔ نمونه
   ───────────────────────────────────────────────────────────── */

import {
  createContext, useContext, useEffect, useMemo, useState, type ReactNode,
} from "react";
import { PRODUCTS, type Product } from "../data/products";
import { CUSTOMERS, type Customer } from "../data/business";
import type { OrderStatusKey } from "../data/business";
import { seedOrders, seedTransactions, type Order, type Tx } from "../data/seeds";
import { uid } from "./format";

export interface AppState {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  transactions: Tx[];
}

const KEY = "kashan-coffee-state-v2";

function fresh(): AppState {
  return {
    products: PRODUCTS.map((p) => ({ ...p })),
    customers: CUSTOMERS.map((c) => ({ ...c })),
    orders: seedOrders(),
    transactions: seedTransactions(),
  };
}

function load(): AppState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as AppState;
      if (s && Array.isArray(s.products) && s.products.length > 0 && Array.isArray(s.orders)) {
        return s;
      }
    }
  } catch {
    /* دادهٔ خراب — بازگشت به نمونه */
  }
  return fresh();
}

interface StoreApi extends AppState {
  updateProduct: (id: string, patch: Partial<Product>) => void;
  addProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addCustomer: (c: Omit<Customer, "id">) => Customer;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addOrder: (o: Omit<Order, "id" | "dateISO">) => number;
  updateOrderStatus: (id: number, status: OrderStatusKey) => void;
  deleteOrder: (id: number) => void;
  addTx: (t: Omit<Tx, "id" | "docNo">) => void;
  deleteTx: (id: string) => void;
  resetAll: () => void;
}

const Ctx = createContext<StoreApi | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* حالت خصوصی مرورگر */
    }
  }, [state]);

  const api = useMemo<StoreApi>(() => {
    return {
      ...state,
      updateProduct: (id, patch) =>
        setState((s) => ({
          ...s,
          products: s.products.map((p) =>
            p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p,
          ),
        })),
      addProduct: (p) =>
        setState((s) => ({ ...s, products: [{ ...p, updatedAt: new Date().toISOString() }, ...s.products] })),
      deleteProduct: (id) =>
        setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) })),

      addCustomer: (c) => {
        const full: Customer = { ...c, id: `c-${uid()}` };
        setState((s) => ({ ...s, customers: [...s.customers, full] }));
        return full;
      },
      updateCustomer: (id, patch) =>
        setState((s) => ({
          ...s,
          customers: s.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteCustomer: (id) =>
        setState((s) => ({ ...s, customers: s.customers.filter((c) => c.id !== id) })),

      addOrder: (o) => {
        const id = Math.max(1000, ...state.orders.map((x) => x.id)) + 1;
        const full: Order = { ...o, id, dateISO: new Date().toISOString() };
        setState((s) => ({ ...s, orders: [full, ...s.orders] }));
        // کاهش موجودی انبار هنگام ثبت سفارش
        setState((s) => ({
          ...s,
          products: s.products.map((p) => {
            const it = o.items.find((i) => i.productId === p.id);
            if (!it || p.category === "drink") return p;
            return { ...p, stock: Math.max(0, p.stock - it.qty) };
          }),
        }));
        return id;
      },
      updateOrderStatus: (id, status) =>
        setState((s) => ({
          ...s,
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      deleteOrder: (id) =>
        setState((s) => ({ ...s, orders: s.orders.filter((o) => o.id !== id) })),

      addTx: (t) => {
        const docNo = Math.max(1998, ...state.transactions.map((x) => x.docNo)) + 1;
        const full: Tx = { ...t, id: `tx-${uid()}`, docNo };
        setState((s) => ({ ...s, transactions: [full, ...s.transactions] }));
      },
      deleteTx: (id) =>
        setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) })),

      resetAll: () => setState(fresh()),
    };
  }, [state]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore(): StoreApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore باید داخل AppStoreProvider استفاده شود");
  return v;
}
