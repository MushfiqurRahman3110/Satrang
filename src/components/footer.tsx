"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { BrandMark, Icon } from "./icons";
import { useStore } from "./store-provider";

export function Footer() {
  const { t, language, setLanguage } = useStore();
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [error, setError] = useState("");
  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending"); setError("");
    const form = event.currentTarget;
    const email = new FormData(form).get("email");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setStatus("success"); form.reset();
    } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); setStatus("idle"); }
  }
  return <>
    <section className="newsletter-section page-gutter" id="newsletter"><div><p className="eyebrow">{t("LET’S KEEP IN COLOUR", "রঙে রঙে সঙ্গে থাকুন")}</p><h2>{t("Good things come", "ভালো কিছু আসে")}<br /><em>{t("in colour.", "রঙের সঙ্গে।")}</em></h2></div><div className="newsletter-right"><p>{t("New colours. Small-batch drops. Stories worth sharing. A little Satrang, in your inbox.", "নতুন রঙ, নতুন কালেকশন আর নতুন গল্প। আপনার ইনবক্সে একটু সাত রঙ।")}</p>{status === "success" ? <div className="newsletter-success" role="status"><Icon name="check" size={22} />{t("You’re on the list. Welcome to our colourful little world.", "আপনি এখন আমাদের রঙিন পৃথিবীর অংশ। স্বাগতম!")}</div> : <form className="newsletter-form" onSubmit={subscribe}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" name="email" type="email" required maxLength={254} placeholder={t("Your email address", "আপনার ইমেইল")} /><button disabled={status === "sending"} aria-label="Subscribe to the newsletter">{status === "sending" ? "…" : <Icon name="arrow-up" size={24} />}</button></form>}{error && <p role="alert" className="newsletter-error">{error}</p>}<small>{t("Only the good stuff. Unsubscribe anytime.", "শুধু ভালো খবর। যেকোনো সময় আনসাবস্ক্রাইব করুন।")}</small></div><BrandMark size={250} className="newsletter-watermark" /></section>
    <footer className="site-footer page-gutter"><div className="footer-top"><div className="footer-brand"><Link href="/" className="brand-logo"><BrandMark size={44} /><span className="brand-type">SATRANG<span>সাত রঙ</span></span></Link><p>{t("Seven colours. A thousand stories.\nThoughtfully made in Bangladesh.", "সাত রঙ। হাজার গল্প।\nবাংলাদেশে ভালোবাসায় তৈরি।")}</p></div><div className="footer-link-column"><h3>{t("EXPLORE", "দেখুন")}</h3><Link href="/shop">{t("Shop all", "সব পোশাক")}</Link><Link href="/shop/tops">{t("Tops", "টপস")}</Link><Link href="/shop/bottoms">{t("Bottoms", "বটমস")}</Link><Link href="/shop/footwear">{t("Footwear", "জুতা")}</Link></div><div className="footer-link-column"><h3>{t("A LITTLE ABOUT US", "আমাদের কথা")}</h3><Link href="/about">{t("Our story", "আমাদের গল্প")}</Link><Link href="/contact">{t("Get in touch", "যোগাযোগ")}</Link><Link href="/contact#faq">{t("Shipping & returns", "ডেলিভারি ও রিটার্ন")}</Link><Link href="/contact#faq">{t("Care guide & FAQs", "যত্ন ও প্রশ্নোত্তর")}</Link></div><div className="footer-link-column"><h3>{t("FIND YOUR COLOUR", "আপনার রঙ খুঁজুন")}</h3><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram<Icon name="arrow-up" size={13} /></a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook<Icon name="arrow-up" size={13} /></a><a href="mailto:hello@satrang.studio">hello@satrang.studio</a><button className="footer-language" onClick={() => setLanguage(language === "en" ? "bn" : "en")}>EN / বাংলা<Icon name="arrow" size={14} /></button></div></div><div className="footer-wordmark" aria-hidden="true">satrang<span>®</span></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Satrang — সাত রঙ</span><span>{t("MADE SLOWLY. WORN HAPPILY.", "যত্নে গড়া। আনন্দে পরা।")}</span><a href="#top">{t("Back to top", "উপরে যান")}<Icon name="arrow-up" size={13} /></a></div></footer>
  </>;
}
