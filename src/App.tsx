import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PRODUCTS,
  priceFor,
  searchHay,
  type Product,
  type Weight,
  type Grind,
  type CartItem,
} from "./data/products";
import { useLocalStorage } from "./lib/hooks";
import { I18nProvider, useI18n } from "./i18n";
import { BackgroundFX, NoiseLayer, Ticker, Header, Footer } from "./components/Chrome";
import { Masthead, FilterBar, Shelf, LedgerBand, type SortKey, type CategorySel } from "./components/Shop";
import {
  ProductDetail,
  CartDrawer,
  CheckoutModal,
  Toasts,
  type CartLine,
  type Toast,
} from "./components/Overlays";

/** Normalizes a search query across both languages
 *  (Arabic yeh/kaf → Persian, drops ZWNJ & LRM/RLM marks). */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u200e\u200f]/g, "");
}

function Store() {
  const { t, bi } = useI18n();

  /* ---------- catalog state ---------- */
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategorySel>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  /* ---------- overlay state ---------- */
  const [detail, setDetail] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  /* ---------- cart ---------- */
  const [cart, setCart] = useLocalStorage<CartItem[]>("eo-crate-v2", []);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts.slice(-2), { id, msg }]);
    window.setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 2800);
  }, []);

  const lines = useMemo<CartLine[]>(
    () =>
      cart
        .map((item) => {
          const product = PRODUCTS.find((p) => p.id === item.id);
          if (!product) return null;
          return { item, product, unit: priceFor(product.price, item.weight) };
        })
        .filter((x): x is CartLine => x !== null),
    [cart],
  );

  const cartCount = lines.reduce((s, l) => s + l.item.qty, 0);

  const addToCart = useCallback(
    (product: Product, weight: Weight = 250, grind: Grind = "whole", qty = 1) => {
      const key = `${product.id}|${weight}|${grind}`;
      setCart((c) => {
        const existing = c.find((i) => i.key === key);
        if (existing) {
          return c.map((i) => (i.key === key ? { ...i, qty: Math.min(12, i.qty + qty) } : i));
        }
        return [...c, { key, id: product.id, weight, grind, qty }];
      });
      toast(t("toastAdded", { name: bi(product.name) }));
    },
    [setCart, toast, t, bi],
  );

  const setQty = useCallback(
    (key: string, qty: number) => {
      setCart((c) => (qty < 1 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty: Math.min(12, qty) } : i))));
    },
    [setCart],
  );

  const removeLine = useCallback(
    (key: string) => setCart((c) => c.filter((i) => i.key !== key)),
    [setCart],
  );

  /* ---------- filtering (searches both languages) ---------- */
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: PRODUCTS.length };
    PRODUCTS.forEach((p) => {
      c[p.category] = (c[p.category] ?? 0) + 1;
    });
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    const list = PRODUCTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return normalize(searchHay(p)).includes(q);
    });
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "roast":
        return [...list].sort((a, b) => a.roast - b.roast || a.name.en.localeCompare(b.name.en));
      default:
        return list;
    }
  }, [query, category, sort]);

  const isFiltered = query.trim() !== "" || category !== "all" || sort !== "featured";

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (checkoutOpen) return; // checkout modal handles its own Esc
      if (detail) setDetail(null);
      else if (drawerOpen) setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [checkoutOpen, detail, drawerOpen]);

  const openCheckout = () => {
    if (lines.length === 0) return;
    setDrawerOpen(false);
    setCheckoutOpen(true);
  };

  const checkoutDone = () => setCart([]);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setSort("featured");
  };

  return (
    <div id="top" className="relative min-h-screen">
      <BackgroundFX />
      <NoiseLayer />

      <div className="relative z-10">
        <Ticker />
        <Header cartCount={cartCount} onCartOpen={() => setDrawerOpen(true)} />

        <main>
          <Masthead onOpen={setDetail} />
          <FilterBar
            query={query}
            onQuery={setQuery}
            category={category}
            onCategory={setCategory}
            sort={sort}
            onSort={setSort}
            counts={counts}
            total={filtered.length}
          />
          <Shelf
            products={filtered}
            onOpen={setDetail}
            onAdd={(p) => addToCart(p)}
            onReset={resetFilters}
            filtered={isFiltered}
          />
          <LedgerBand />
        </main>

        <Footer onToast={toast} />
      </div>

      {/* overlays */}
      {detail && (
        <ProductDetail
          product={detail}
          onClose={() => setDetail(null)}
          onAdd={(p, w, g, q) => {
            addToCart(p, w, g, q);
            setDetail(null);
          }}
        />
      )}

      <CartDrawer
        open={drawerOpen}
        lines={lines}
        onClose={() => setDrawerOpen(false)}
        onQty={setQty}
        onRemove={removeLine}
        onCheckout={openCheckout}
      />

      <CheckoutModal
        open={checkoutOpen}
        lines={lines}
        onClose={() => setCheckoutOpen(false)}
        onComplete={checkoutDone}
      />

      <Toasts toasts={toasts} />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Store />
    </I18nProvider>
  );
}
