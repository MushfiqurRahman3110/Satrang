import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shop } from "@/components/shop";
import { getProducts } from "@/lib/products";
import { categories } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const entry = categories.find((item) => item.id === category);
  return { title: entry?.title || "Collection", description: entry?.subtitle };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!categories.some((entry) => entry.id === category)) notFound();
  const [products, allProducts] = await Promise.all([getProducts(category), getProducts()]);
  return <Shop products={products} allProducts={allProducts} category={category} />;
}
