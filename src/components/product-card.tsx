"use client";

import Link from "next/link";
import { useState } from "react";
import { bengaliLabel, formatPrice, type Product } from "@/lib/catalog";
import { Icon } from "./icons";
import { useStore } from "./store-provider";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { t, wishlist, toggleWishlist, addItem, cartPending } = useStore();
  const [adding, setAdding] = useState(false);
  const saved = wishlist.includes(product.id);
  async function quickAdd() {
    setAdding(true);
    await addItem(product.id, product.sizes.includes("M") ? "M" : product.sizes.includes("38") ? "38" : product.sizes[0]);
    setAdding(false);
  }
  return <article className="product-card reveal" style={{ animationDelay: `${index * 70}ms` }}>
    <div className="product-media"><Link href={`/product/${product.id}`} className="product-image-link"><img src={product.image} alt={product.title} loading="lazy" /></Link>{product.label && <span className="product-label">{t(product.label, bengaliLabel(product.label))}</span>}<button className={`wishlist-button ${saved ? "is-saved" : ""}`} aria-label={`${saved ? "Remove" : "Save"} ${product.title} ${saved ? "from" : "to"} favourites`} aria-pressed={saved} onClick={() => toggleWishlist(product.id)}><Icon name="heart" size={18} /></button><button className="quick-add" disabled={adding || cartPending} onClick={quickAdd}>{adding ? t("Adding a little colour…", "ব্যাগে যোগ করছি…") : t("Quick add", "ব্যাগে যোগ করুন")}<Icon name="plus" size={17} /></button></div>
    <div className="product-info"><Link href={`/product/${product.id}`}><h3>{t(product.title, product.titleBn)}</h3></Link><span>{formatPrice(product.price)}</span></div><p className="product-caption">{t("Handcrafted. No two alike.", "হাতে গড়া। প্রতিটি আলাদা।")}<span className="product-color-dots">{product.colors.map((color) => <i key={color} title={t(color, bengaliLabel(color))} className={`swatch-${color.toLowerCase()}`} />)}</span></p>
  </article>;
}
