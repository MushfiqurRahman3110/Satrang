import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StoreProvider } from "@/components/store-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://satrang.studio"),
  icons: { icon: "/favicon.svg" },
  title: { default: "Satrang — সাত রঙ | Wear Your True Colours", template: "%s | Satrang — সাত রঙ" },
  description: "Seven colours. Endless ways to be you. Discover Satrang’s handcrafted tie-dye kamiz, lehengas, frocks, and traditional footwear, thoughtfully made in Bangladesh.",
  openGraph: { title: "Satrang — Wear Your True Colours", description: "Rooted in heritage. Reimagined for you.", images: ["/images/satrang-hero.jpg"], type: "website" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><head><link rel="stylesheet" href="/fonts/fonts.css" /></head><body id="top"><StoreProvider><a href="#main-content" className="skip-link">Skip to content</a><Header /><div id="main-content">{children}</div><Footer /><CartDrawer /></StoreProvider></body></html>;
}
