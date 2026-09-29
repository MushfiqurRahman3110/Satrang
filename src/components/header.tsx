"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandMark, Icon } from "./icons";
import { useStore } from "./store-provider";
import { useDialog } from "@/lib/use-dialog";
import { categories, formatPrice, type Product } from "@/lib/catalog";

export function Header() {
  const { t, language, setLanguage, cart, setCartOpen, cartPulse } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const pathname = usePathname();
  const dialogRef = useDialog(searchOpen, () => setSearchOpen(false));

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => {
    if (!searchOpen) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true); setSearchError("");
      try {
        const response = await fetch(`/api/products?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setResults(data.products);
      } catch (error) { if (!controller.signal.aborted) setSearchError(error instanceof Error ? error.message : "Search is unavailable. Please try again."); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 180);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [searchOpen, query]);

  return <>
    <header className="site-header">
      <div className="announcement-bar"><span className="announcement-side">{t("ROOTED IN BANGLADESH", "বাংলাদেশের ঐতিহ্যে")}</span><span><Icon name="flower" size={12} />{t("A little joy, delivered. Free shipping on orders ৳ 4,000+", "একটু আনন্দ, আপনার কাছে। ৳ ৪,০০০+ অর্ডারে ফ্রি ডেলিভারি")}<Icon name="flower" size={12} /></span><span className="announcement-side">{t("HANDCRAFTED. HEARTFELT.", "হাতে গড়া। হৃদয়ে রাঙা।")}</span></div>
      <div className="nav-main page-gutter">
        <nav className="desktop-nav" aria-label="Main navigation">
          <div className="shop-nav-wrap"><button className="nav-link" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{t("Shop", "শপ")}<Icon name="chevron" size={12} /></button>
            {menuOpen && <div className="shop-dropdown"><Link href="/shop">{t("Shop all colours", "সব রঙ দেখুন")}<Icon name="arrow-up" size={16} /></Link>{categories.map((category) => <Link key={category.id} href={`/shop/${category.id}`}>{t(category.title, category.titleBn)}<span>{category.number}</span></Link>)}</div>}
          </div>
          <Link href="/about" className={`nav-link ${pathname === "/about" ? "active" : ""}`}>{t("Our story", "আমাদের গল্প")}</Link>
        </nav>
        <button className="mobile-menu-button icon-button" aria-label="Open navigation" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}><Icon name={menuOpen ? "close" : "menu"} size={23} /></button>
        <Link href="/" className="brand-logo" aria-label="Satrang home"><BrandMark size={43} /><span className="brand-type">SATRANG<span>সাত রঙ</span></span></Link>
        <nav className="nav-actions" aria-label="Store tools">
          <button className="icon-button search-button" aria-label={t("Search the collection", "পোশাক খুঁজুন")} onClick={() => setSearchOpen(true)}><Icon name="search" size={21} /></button>
          <button className="language-toggle" onClick={() => setLanguage(language === "en" ? "bn" : "en")} aria-label="Switch between English and Bengali" aria-pressed={language === "bn"}><span className={language === "en" ? "selected" : ""}>EN</span><span className="language-divider">/</span><span className={language === "bn" ? "selected bangla" : "bangla"}>বাং</span></button>
          <button className={`bag-button ${cartPulse ? "bag-bounce" : ""}`} aria-label={`${t("Open shopping bag", "শপিং ব্যাগ খুলুন")} (${cart.totalQuantity})`} onClick={() => { setSearchOpen(false); setCartOpen(true); }}><Icon name="bag" size={21} /><span className="bag-label">{t("Bag", "ব্যাগ")}</span><span className="bag-count">{cart.totalQuantity}</span></button>
        </nav>
      </div>
      {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation"><Link href="/shop">{t("Shop all", "সব পোশাক")}</Link>{categories.map((category) => <Link key={category.id} href={`/shop/${category.id}`}>{t(category.title, category.titleBn)}</Link>)}<Link href="/about">{t("Our story", "আমাদের গল্প")}</Link><Link href="/contact">{t("Get in touch", "যোগাযোগ")}</Link><button onClick={() => { setMenuOpen(false); setSearchOpen(true); }}>{t("Search the collection", "পোশাক খুঁজুন")}<Icon name="search" size={19} /></button></nav>}
    </header>
    {searchOpen && <div className="modal-backdrop" onClick={() => setSearchOpen(false)}><div className="search-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-label="Search the collection" onClick={(event) => event.stopPropagation()}>
      <div className="search-input-row"><Icon name="search" size={25} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Find your next favourite…", "আপনার প্রিয় পোশাক খুঁজুন…")} aria-label="Search products" /><button className="icon-button" onClick={() => setSearchOpen(false)} aria-label="Close search"><Icon name="close" size={22} /></button></div>
      <div className="search-suggestions">{categories.map((category) => <Link key={category.id} href={`/shop/${category.id}`}>{t(category.title, category.titleBn)}<Icon name="arrow-up" size={13} /></Link>)}</div>
      <p className="eyebrow">{query ? t("YOUR COLOURFUL FINDS", "আপনার পছন্দের রঙ") : t("A FEW FAVOURITES", "কিছু প্রিয় পোশাক")}</p>
      {loading ? <p className="search-state">{t("Finding a little colour…", "রঙ খুঁজছি…")}</p> : searchError ? <p role="alert">{searchError}</p> : results.length ? <div className="search-results">{results.slice(0, 6).map((product) => <Link href={`/product/${product.id}`} key={product.id} className="search-result"><img src={product.image} alt={product.title} /><span><strong>{t(product.title, product.titleBn)}</strong><small>{formatPrice(product.price)}</small></span><Icon name="arrow-up" size={16} /></Link>)}</div> : <p className="search-state">{t("No matches just yet. Try “kamiz”, “pink”, or “sandals”.", "কিছু পাওয়া যায়নি। কামিজ, গোলাপি বা স্যান্ডেল খুঁজুন।")}</p>}
    </div></div>}
  </>;
}
