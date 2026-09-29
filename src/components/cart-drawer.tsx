"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useStore } from "./store-provider";
import { BrandMark, Icon } from "./icons";
import { useDialog } from "@/lib/use-dialog";
import { formatPrice } from "@/lib/catalog";

export function CartDrawer() {
  const { t, cart, cartOpen, setCartOpen, cartPending, updateQuantity, removeItem, refreshCart } = useStore();
  const [step, setStep] = useState<"bag" | "checkout" | "success">("bag");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<{ number: string; total: number } | null>(null);
  const dialogRef = useDialog(cartOpen, () => setCartOpen(false));
  useEffect(() => { if (cartOpen) { setStep("bag"); setError(""); } }, [cartOpen]);

  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPlacing(true); setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setOrder(result.order); setStep("success");
      await refreshCart();
    } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); }
    finally { setPlacing(false); }
  }

  if (!cartOpen) return null;
  return <div className="modal-backdrop cart-backdrop" onClick={() => setCartOpen(false)}><div className="cart-drawer" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="bag-heading" onClick={(event) => event.stopPropagation()}>
    <div className="drawer-heading"><div><p className="eyebrow">{t("A LITTLE COLOUR, ALL YOURS", "আপনার নিজের কিছু রঙ")}</p><h2 id="bag-heading">{step === "checkout" ? t("The final stitch.", "শেষ সেলাই।") : step === "success" ? t("Oh, happy colours!", "আনন্দের রঙ!") : t("Your shopping bag", "আপনার শপিং ব্যাগ")}{step === "bag" && <sup>({cart.totalQuantity})</sup>}</h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close shopping bag"><Icon name="close" size={23} /></button></div>
    {step === "success" && order ? <div className="order-success"><BrandMark size={100} /><h3>{t("Made for you. On its way.", "আপনার জন্য তৈরি।")}</h3><p>{t("Your order is confirmed. We’ll get your colours ready for delivery in 2–5 business days.", "আপনার অর্ডার নিশ্চিত হয়েছে। ২–৫ কর্মদিবসের মধ্যে পৌঁছে যাবে।")}</p><div className="order-number"><span>{t("ORDER REFERENCE", "অর্ডার নম্বর")}</span><strong>{order.number}</strong><p>{formatPrice(order.total)} · {t("Cash on delivery", "ক্যাশ অন ডেলিভারি")}</p></div><button className="button button-black" onClick={() => setCartOpen(false)}>{t("Keep exploring", "আরও দেখুন")}<Icon name="arrow" size={18} /></button></div>
    : step === "checkout" ? <div className="checkout-content"><button className="text-link" onClick={() => setStep("bag")}><span>←</span>{t("Back to your bag", "ব্যাগে ফিরে যান")}</button><form className="checkout-form" onSubmit={checkout}>
      <label>{t("Full name", "পুরো নাম")}<input name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder="Your name" /></label>
      <label>{t("Email", "ইমেইল")}<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" /></label>
      <label>{t("Phone", "ফোন")}<input name="phone" type="tel" required minLength={8} maxLength={20} autoComplete="tel" placeholder="01XXXXXXXXX" /></label>
      <label>{t("Delivery address", "ডেলিভারির ঠিকানা")}<textarea name="address" required minLength={5} maxLength={500} autoComplete="street-address" placeholder="House, road, area" rows={2} /></label>
      <label>{t("City / district", "শহর / জেলা")}<input name="city" required minLength={2} maxLength={100} autoComplete="address-level2" placeholder="Dhaka" /></label>
      <div className="payment-note"><Icon name="check" size={19} /><span>{t("Cash on delivery · Bangladesh only", "ক্যাশ অন ডেলিভারি · শুধু বাংলাদেশে")}</span></div>
      <div className="checkout-total"><span>{t("Total, including delivery", "ডেলিভারিসহ মোট")}</span><strong>{formatPrice(cart.subtotal + cart.delivery)}</strong></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-black full-width" disabled={placing || cart.items.length === 0}>{placing ? t("Placing your order…", "অর্ডার করছি…") : t("Place my order", "অর্ডার করুন")}<Icon name="arrow" size={19} /></button><p className="checkout-terms">{t("By placing your order, you agree to our 7-day return policy. No online payment required.", "অর্ডার করার মাধ্যমে আপনি আমাদের ৭ দিনের রিটার্ন নীতিতে সম্মত হচ্ছেন। অনলাইনে পেমেন্টের প্রয়োজন নেই।")}</p>
    </form></div>
    : cart.items.length ? <><div className="delivery-progress"><p>{cart.subtotal >= 4000 ? t("Your colours come with free delivery!", "আপনার অর্ডারে ফ্রি ডেলিভারি!") : t(`You’re ${formatPrice(4000 - cart.subtotal)} away from free delivery.`, `আর ${formatPrice(4000 - cart.subtotal)} অর্ডারে ফ্রি ডেলিভারি।`)}</p><div><span style={{ width: `${Math.min(100, cart.subtotal / 4000 * 100)}%` }} /></div></div><div className="cart-items">{cart.items.map((item) => <article className="cart-item" key={item.id}><Link href={`/product/${item.productId}`} onClick={() => setCartOpen(false)}><img src={item.image} alt={item.title} /></Link><div className="cart-item-info"><Link href={`/product/${item.productId}`} onClick={() => setCartOpen(false)}>{t(item.title, item.titleBn)}</Link><p>{t("Size", "সাইজ")}: {item.size}</p><strong>{formatPrice(item.price * item.quantity)}</strong><div className="cart-item-actions"><div className="quantity-control"><button aria-label={`Decrease quantity of ${item.title}`} disabled={cartPending || item.quantity <= 1} onClick={() => updateQuantity(item.id, item.quantity - 1)}><Icon name="minus" size={13} /></button><span>{item.quantity}</span><button aria-label={`Increase quantity of ${item.title}`} disabled={cartPending || item.quantity >= 10} onClick={() => updateQuantity(item.id, item.quantity + 1)}><Icon name="plus" size={13} /></button></div><button className="remove-button" disabled={cartPending} onClick={() => removeItem(item.id)}>{t("Remove", "সরান")}</button></div></div></article>)}</div><div className="cart-summary"><div><span>{t("Subtotal", "সাবটোটাল")}</span><strong>{formatPrice(cart.subtotal)}</strong></div><div><span>{t("Delivery", "ডেলিভারি")}</span><span>{cart.delivery ? formatPrice(cart.delivery) : t("On us", "ফ্রি")}</span></div><button className="button button-black full-width" disabled={cartPending} onClick={() => setStep("checkout")}>{t("Continue to checkout", "চেকআউট করুন")}<Icon name="arrow" size={18} /></button><p>{t("Handcrafted with love. Securely yours.", "ভালোবাসায় হাতে গড়া। নিরাপদে আপনার কাছে।")}</p></div></>
    : <div className="empty-bag"><BrandMark size={90} /><h3>{t("A world of colour awaits.", "রঙের এক পৃথিবী অপেক্ষায়।")}</h3><p>{t("Your bag is a blank canvas. Let’s make it a little more you.", "আপনার ব্যাগ এখনও খালি। আপনার প্রিয় রঙ বেছে নিন।")}</p><Link className="button button-black" href="/shop" onClick={() => setCartOpen(false)}>{t("Explore the collection", "কালেকশন দেখুন")}<Icon name="arrow" size={18} /></Link></div>}
  </div></div>;
}
