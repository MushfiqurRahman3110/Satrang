import type { Metadata } from "next";
import { Shop } from "@/components/shop";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "The Collection", description: "Explore hand-dyed tops, flowing lehengas, and traditional handcrafted footwear from Satrang." };

export default async function ShopPage() {
  const products = await getProducts();
  return <Shop products={products} allProducts={products} />;
}
