"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, formatPrice, type Product } from "@/lib/catalog";
import { useStore } from "./store-provider";
import { BrandMark, Icon, Sparkle } from "./icons";
import { CategoryCards } from "./category-cards";
import { ProductCard } from "./product-card";

const intros: Record<string, { title: string; titleBn: string; description: string; descriptionBn: string }> = {
  tops: { title: "Everyday, a little more colourful.", titleBn: "প্রতিদিন, একটু বেশি রঙিন।", description: "Easy silhouettes. Expressive colours. Kamiz, frocks, and tops that feel as good as they look.", descriptionBn: "আরামদায়ক কাট। প্রাণবন্ত রঙ। কামিজ, ফ্রক আর টপস—সৌন্দর্যে ও আরামে অনন্য।" },
  bottoms: { title: "Made for a little twirl.", titleBn: "একটু নাচের জন্য তৈরি।", description: "Flowing lehengas and beautiful three-pieces, hand-dyed for the moments you’ll want to remember.", descriptionBn: "স্মরণীয় মুহূর্তের জন্য হাতে রাঙানো লেহেঙ্গা আর সুন্দর থ্রি-পিস।" },
  footwear: { title: "Good things, underfoot.", titleBn: "প্রতি পদক্ষেপে সৌন্দর্য।", description: "Traditional craft. Everyday comfort. Sandals and nagras that take your colours a little further.", descriptionBn: "ঐতিহ্যের কারুকাজ। প্রতিদিনের আরাম। আপনার রঙের সঙ্গী স্যান্ডেল আর নাগরা।" },
};

export function Shop({ products, allProducts, category }: { products: Product[]; allProducts: Product[]; category?: string }) {
  const { t, wishlist } = useStore();
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState("featured");
  const [savedOnly, setSavedOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const currentCategory = categories.find((entry) => entry.id === category);
  const intro = category ? intros[category] : undefined;
  const visible = useMemo(() => {
    let list = products.filter((product) => product.price <= maxPrice && (!sizes.length || sizes.some((size) => product.sizes.includes(size))) && (!colors.length || colors.some((color) => product.colors.includes(color))) && (!savedOnly || wishlist.includes(product.id)));
    if (sort === "price-low") list = list.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") list = list.sort((a, b) => b.price - a.price);
    else if (sort === "name") list = list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "newest") list = list.sort((a, b) => b.sortOrder - a.sortOrder);
    return list;
  }, [products, maxPrice, sizes, colors, savedOnly, wishlist, sort]);
  const availableSizes = category === "footwear" ? ["36", "37", "38", "39", "40"] : category ? ["S", "M", "L", "XL"] : ["S", "M", "L", "XL", "36", "37", "38", "39", "40"];
  const filterCount = sizes.length + colors.length + Number(maxPrice < 5000) + Number(savedOnly);
  function toggle(value: string, selected: string[], set: (values: string[]) => void) { set(selected.includes(value) ? selected.filter((entry) => entry !== value) : [...selected, value]); }
  function clearFilters() { setSizes([]); setColors([]); setMaxPrice(5000); setSavedOnly(false); }

  return <main className={`shop-page ${category ? `shop-${category}` : "shop-all"}`}>
    <div className="breadcrumbs page-gutter"><Link href="/">{t("Home", "হোম")}</Link><span>/</span>{category ? <><Link href="/shop">{t("The collection", "কালেকশন")}</Link><span>/</span><span>{t(currentCategory?.title || "", currentCategory?.titleBn || "")}</span></> : <span>{t("The collection", "কালেকশন")}</span>}</div>
    {category && category !== "tops" ? <section className={`category-feature page-gutter ${category === "footwear" ? "footwear-feature" : ""}`}><div className="category-feature-image"><img src={currentCategory?.image} alt={currentCategory?.subtitle} /><div className="feature-image-note"><BrandMark size={22} /><span>{t("HERITAGE IN EVERY THREAD", "প্রতিটি সুতায় ঐতিহ্য")}</span></div></div><div className="category-feature-copy"><p className="eyebrow">{currentCategory?.number} / {t(currentCategory?.title || "", currentCategory?.titleBn || "").toUpperCase()}</p><h1>{t(intro?.title || "", intro?.titleBn || "")}</h1><p>{t(intro?.description || "", intro?.descriptionBn || "")}</p><a href="#pieces" className="button button-black">{t("Find your favourites", "প্রিয় পোশাক খুঁজুন")}<Icon name="arrow" size={18} /></a><Sparkle className="feature-sparkle" size={56} /></div></section>
    : <section className="collection-intro page-gutter"><div><p className="eyebrow">{category ? `01 / ${t("THE EVERYDAY EDIT", "প্রতিদিনের কালেকশন")}` : t("THE SATRANG WARDROBE", "সাত রঙের পোশাক")}</p><h1>{category ? t(intro?.title || "", intro?.titleBn || "") : t("A colour for every you.", "আপনার প্রতিটি রূপে এক রঙ।")}</h1></div><div className="collection-intro-aside"><BrandMark size={46} /><p>{category ? t(intro?.description || "", intro?.descriptionBn || "") : t("A wardrobe rooted in heritage, made for the way you live. Find a little something that feels like you.", "ঐতিহ্যে গড়া, আপনার জীবনযাপনের জন্য তৈরি। নিজের মতো কিছু খুঁজে নিন।")}</p></div></section>}
    {!category && <section className="shop-category-section page-gutter"><CategoryCards /></section>}
    <section className="shop-products-section page-gutter" id="pieces"><div className="shop-section-title"><div><p className="eyebrow">{t("THOUGHTFULLY MADE. HAPPILY WORN.", "যত্নে তৈরি। আনন্দে পরা।")}</p><h2>{category ? t(`Explore ${currentCategory?.title.toLowerCase()}`, `${currentCategory?.titleBn} দেখুন`) : t("All the good colours.", "সব সুন্দর রঙ।")}</h2></div><button className={`saved-filter ${savedOnly ? "active" : ""}`} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Icon name="heart" size={16} />{t("My favourites", "আমার প্রিয়")} ({wishlist.length})</button></div>
      <div className="collection-tabs">{[{ id: "", title: "All pieces", titleBn: "সব পোশাক" }, ...categories].map((entry) => <Link className={(category || "") === entry.id ? "active" : ""} key={entry.id} href={entry.id ? `/shop/${entry.id}` : "/shop"}>{t(entry.title, entry.titleBn)}<small>{allProducts.filter((product) => !entry.id || product.category === entry.id).length}</small></Link>)}</div>
      <div className="shop-layout"><aside className={`filter-sidebar ${filtersOpen ? "filters-open" : ""}`}><button className="mobile-filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}>{t("Filter the colours", "ফিল্টার করুন")} {filterCount > 0 && `(${filterCount})`}<Icon name="plus" size={16} /></button><div className="filter-inner"><div className="filter-heading"><h3>{t("Filter by", "ফিল্টার")}</h3><button onClick={clearFilters}>{t("Reset", "রিসেট")}</button></div><fieldset><legend>{t("SIZE", "সাইজ")}</legend><div className="size-filter">{availableSizes.map((size) => <button key={size} aria-pressed={sizes.includes(size)} className={sizes.includes(size) ? "selected" : ""} onClick={() => toggle(size, sizes, setSizes)}>{size}</button>)}</div></fieldset><fieldset><legend>{t("COLOUR", "রঙ")}</legend>{["Pink", "Orange", "Blue", "Tan", "Cream"].map((color, index) => <label className="color-filter" key={color}><input type="checkbox" checked={colors.includes(color)} onChange={() => toggle(color, colors, setColors)} /><i className={`swatch-${color.toLowerCase()}`} /><span>{t(color, ["গোলাপি", "কমলা", "নীল", "বাদামি", "ক্রিম"][index])}</span><small>{products.filter((product) => product.colors.includes(color)).length}</small></label>)}</fieldset><fieldset><legend>{t("PRICE RANGE", "মূল্য")}</legend><input className="price-range" type="range" min="1000" max="5000" step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Maximum price" /><div className="price-range-labels"><span>৳ 1,000</span><span>{formatPrice(maxPrice)}</span></div><p className="filter-price-note">{t("A little something for every budget.", "প্রতিটি বাজেটের জন্য কিছু সুন্দর।")}</p></fieldset><div className="filter-brand-note"><BrandMark size={37} /><p>{t("Slowly made.\nUniquely yours.", "যত্নে তৈরি।\nএকান্তই আপনার।")}</p></div></div></aside>
        <div className="shop-results"><div className="results-toolbar"><p>{visible.length} {t(visible.length === 1 ? "thoughtfully made piece" : "thoughtfully made pieces", "যত্নে গড়া পোশাক")}{filterCount > 0 && <button onClick={clearFilters}>{t("Clear filters", "ফিল্টার মুছুন")}<Icon name="close" size={12} /></button>}</p><label>{t("Sort by", "সাজান")}<select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">{t("Featured", "বিশেষ")}</option><option value="newest">{t("Newest first", "নতুন আগে")}</option><option value="price-low">{t("Price: low to high", "মূল্য: কম থেকে বেশি")}</option><option value="price-high">{t("Price: high to low", "মূল্য: বেশি থেকে কম")}</option><option value="name">{t("Name: A–Z", "নাম: এ–জেড")}</option></select><Icon name="chevron" size={13} /></label></div>{visible.length ? <div className="shop-product-grid">{visible.map((product, index) => <ProductCard product={product} index={index} key={product.id} />)}</div> : <div className="no-results"><BrandMark size={65} /><h3>{t("No colours here just yet.", "এখানে এখনও কোনো রঙ নেই।")}</h3><p>{savedOnly ? t("Tap the heart on a piece you love to save it here.", "পছন্দের পোশাকের হার্টে ক্লিক করে এখানে রাখুন।") : t("Try a different filter. Your next favourite is waiting.", "অন্য ফিল্টার দিয়ে দেখুন। আপনার প্রিয় পোশাক অপেক্ষায়।")}</p><button className="button button-black" onClick={clearFilters}>{t("See all the colours", "সব রঙ দেখুন")}<Icon name="arrow" size={18} /></button></div>}</div>
      </div>
    </section>
  </main>;
}
