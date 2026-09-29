"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "./icons";

export type CartItem = { id: string; productId: string; size: string; quantity: number; title: string; titleBn: string; image: string; price: number };
export type CartData = { items: CartItem[]; subtotal: number; delivery: number; totalQuantity: number };
const emptyCart: CartData = { items: [], subtotal: 0, delivery: 0, totalQuantity: 0 };

type StoreContextValue = {
  language: "en" | "bn";
  setLanguage: (language: "en" | "bn") => void;
  t: (en: string, bn: string) => string;
  cart: CartData;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  cartPending: boolean;
  addItem: (productId: string, size: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  notify: (message: string) => void;
  cartPulse: boolean;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<"en" | "bn">("en");
  const [cart, setCart] = useState<CartData>(emptyCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartPending, setCartPending] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [cartPulse, setCartPulse] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  function notify(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4200);
  }

  async function refreshCart() {
    const response = await fetch("/api/cart", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "We couldn't load your bag.");
    setCart(data);
  }

  useEffect(() => {
    refreshCart().catch(() => {});
    try {
      const storedLanguage = localStorage.getItem("satrang-language");
      if (storedLanguage === "bn") setLanguageState("bn");
      const storedWishlist = JSON.parse(localStorage.getItem("satrang-wishlist") || "[]");
      if (Array.isArray(storedWishlist)) setWishlist(storedWishlist.filter((id) => typeof id === "string"));
    } catch {}
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "bn" ? "bn" : "en";
    document.documentElement.dataset.language = language;
  }, [language]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  function setLanguage(next: "en" | "bn") {
    setLanguageState(next);
    try { localStorage.setItem("satrang-language", next); } catch {}
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>("h1, h2, h3, p, .nav-link, .category-tag, .product-label, .category-bangla, .hero-story-link, .hero-look, .button, .craft-stamp > span, .scroll-hint span, legend, label").forEach((element) => {
          element.animate([{ opacity: 0, translate: "0 5px" }, { opacity: 1, translate: "0 0" }], { duration: 420, easing: "cubic-bezier(.2,.7,.3,1)" });
        });
      });
    }
  }

  async function mutateCart(payload: Record<string, unknown>) {
    setCartPending(true);
    try {
      const response = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We couldn't update your bag.");
      setCart(data);
      return true;
    } catch (error) {
      notify(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      return false;
    } finally { setCartPending(false); }
  }

  async function addItem(productId: string, size: string, quantity = 1) {
    const success = await mutateCart({ action: "add", productId, size, quantity });
    if (success) {
      setCartPulse(true);
      setTimeout(() => { setCartPulse(false); setCartOpen(true); }, 650);
    }
    return success;
  }

  async function updateQuantity(itemId: string, quantity: number) { await mutateCart({ action: "update", itemId, quantity }); }
  async function removeItem(itemId: string) { await mutateCart({ action: "remove", itemId }); }

  function toggleWishlist(productId: string) {
    setWishlist((current) => {
      const next = current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId];
      try { localStorage.setItem("satrang-wishlist", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  return <StoreContext.Provider value={{ language, setLanguage, t: (en, bn) => language === "en" ? en : bn, cart, cartOpen, setCartOpen, cartPending, addItem, updateQuantity, removeItem, refreshCart, wishlist, toggleWishlist, notify, cartPulse }}>
    {children}
    {toast && <div className="toast" role="status"><Icon name="flower" size={20} /><span>{toast}</span><button onClick={() => setToast("")} aria-label="Dismiss notification"><Icon name="close" size={16} /></button></div>}
    {cartPulse && <div className="flying-bag" aria-hidden="true"><Icon name="bag" size={30} /></div>}
  </StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
