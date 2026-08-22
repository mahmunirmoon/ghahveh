import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PRODUCTS,
  priceFor,
  type Product,
  type Category,
  type Weight,
  type Grind,
  type CartItem,
} from "./data/products";
import { useLocalStorage } from "./lib/hooks";
import { BackgroundFX, NoiseLayer, Ticker, Header, Footer } from "./components/Chrome";
import { Masthead, FilterBar, Shelf, LedgerBand, type SortKey } from "./components/Shop";
import {
  ProductDetail,
  CartDrawer,
  CheckoutModal,
  Toasts,
  type CartLine,
  type Toast,
} from "./components/Overlays";

export default function App() {
  /* ---------- catalog state ---------- */
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Category>("All");
  const [sort, setSort] = useState<SortKey>("featured");

  /* ---------- overlay state ---------- */
  const [detail, setDetail] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  /* ---------- cart ---------- */
  const [cart, setCart] = useLocalStorage<CartItem[]>("eo-crate-v1", []);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, msg }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
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
    (product: Product, weight: Weight = 250, grind: Grind = "Whole bean", qty = 1) => {
      const key = `${product.id}|${weight}|${grind}`;
      setCart((c) => {
        const existing = c.find((i) => i.key === key);
        if (existing) {
          return c.map((i) => (i.key === key ? { ...i, qty: Math.min(12, i.qty + qty) } : i));
        }
        return [...c, { key, id: product.id, weight, grind, qty }];
      });
      toast(`${product.name} · added to your crate`);
    },
    [setCart, toast],
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

  /* ---------- filtering ---------- */
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: PRODUCTS.length };
    PRODUCTS.forEach((p) => {
      c[p.category] = (c[p.category] ?? 0) + 1;
    });
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      const hay = [p.name, p.origin, p.category, p.process, p.roastName, p.producer, ...p.notes]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "roast":
        return [...list].sort((a, b) => a.roast - b.roast || a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [query, category, sort]);

  const isFiltered = query.trim() !== "" || category !== "All" || sort !== "featured";

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
    setCategory("All");
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
