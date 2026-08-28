import { useCallback, useEffect, useMemo, useState } from "react";
import { searchHay, type Product } from "./data/products";
import { toEnDigits, faDigits } from "./lib/format";
import { useLocalStorage } from "./lib/hooks";
import { AppStoreProvider, useStore } from "./lib/store";
import { BackgroundFX, NoiseLayer, Ticker, Header, Footer, type ViewKey } from "./components/Chrome";
import {
  Masthead, FilterBar, Shelf, AboutBand,
  type SortKey, type CategorySel,
} from "./components/Shop";
import {
  ProductDetail, CartDrawer, CheckoutModal, Toasts,
  type CartLine, type Toast,
} from "./components/Overlays";
import { AdminPanel, type TabKey } from "./components/admin/AdminPanel";

interface CartItem {
  id: string;
  qty: number;
}

/** نرمال‌سازی جست‌وجو: ارقام، ی/ک عربی، نیم‌فاصله */
function normalize(s: string): string {
  return toEnDigits(s)
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u200e\u200f]/g, "");
}

function Storefront({
  cart,
  setCart,
  drawerOpen,
  setDrawerOpen,
  onAdmin,
}: {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  onAdmin: () => void;
}) {
  const { products } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategorySel>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [detail, setDetail] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
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
          const product = products.find((p) => p.id === item.id);
          return product ? { product, qty: item.qty } : null;
        })
        .filter((x): x is CartLine => x !== null),
    [cart, products],
  );

  const addToCart = useCallback(
    (product: Product, qty = 1) => {
      setCart((c) => {
        const existing = c.find((i) => i.id === product.id);
        if (existing) {
          return c.map((i) => (i.id === product.id ? { ...i, qty: Math.min(12, i.qty + qty) } : i));
        }
        return [...c, { id: product.id, qty }];
      });
      toast(`«${product.name}» به سبد اضافه شد (${faDigits(qty)} عدد)`);
    },
    [setCart, toast],
  );

  const setQty = useCallback(
    (id: string, qty: number) => {
      setCart((c) =>
        qty < 1 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty: Math.min(12, qty) } : i)),
      );
    },
    [setCart],
  );

  const removeLine = useCallback((id: string) => setCart((c) => c.filter((i) => i.id !== id)), [setCart]);

  /* ---------- فیلتر و جست‌وجو ---------- */
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      c[p.category] = (c[p.category] ?? 0) + 1;
    });
    return c;
  }, [products]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    const list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return normalize(searchHay(p)).includes(q);
    });
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      default:
        return list;
    }
  }, [products, query, category, sort]);

  const isFiltered = query.trim() !== "" || category !== "all" || sort !== "featured";

  /* ---------- کیبورد ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (checkoutOpen) return;
      if (detail) setDetail(null);
      else if (drawerOpen) setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [checkoutOpen, detail, drawerOpen, setDrawerOpen]);

  const openCheckout = () => {
    if (lines.length === 0) return;
    setDrawerOpen(false);
    setCheckoutOpen(true);
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setSort("featured");
  };

  return (
    <>
      <main>
        <Masthead onOpen={setDetail} onAdmin={onAdmin} />
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
        <AboutBand />
      </main>

      <Footer onToast={toast} />

      {detail && (
        <ProductDetail
          product={detail}
          onClose={() => setDetail(null)}
          onAdd={(p, q) => {
            addToCart(p, q);
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
        onPlaced={() => setCart([])}
      />

      <Toasts toasts={toasts} />
    </>
  );
}

function Shell() {
  const [view, setView] = useState<ViewKey>(() =>
    window.location.hash.includes("ledger") || window.location.hash.includes("admin") ? "admin" : "shop",
  );
  const [adminTab, setAdminTab] = useState<TabKey>(() =>
    window.location.hash.includes("ledger") ? "ledger" : "dashboard",
  );
  const [cart, setCart] = useLocalStorage<CartItem[]>("kashan-cart-v2", []);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  return (
    <div id="top" className="relative min-h-screen">
      <BackgroundFX />
      <NoiseLayer />

      <div className="relative z-10">
        <Ticker />
        <Header
          view={view}
          onView={setView}
          cartCount={cartCount}
          onCartOpen={() => setDrawerOpen(true)}
        />

        {view === "shop" ? (
          <Storefront
            cart={cart}
            setCart={setCart}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            onAdmin={() => {
              setAdminTab("dashboard");
              setView("admin");
            }}
          />
        ) : (
          <AdminPanel tab={adminTab} onTab={setAdminTab} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppStoreProvider>
      <Shell />
    </AppStoreProvider>
  );
}
