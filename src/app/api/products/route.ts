import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const q = (searchParams.get("q") || "").trim().toLowerCase().slice(0, 100);
    const products = await getProducts(category);
    return Response.json({ products: q ? products.filter((product) => `${product.title} ${product.titleBn} ${product.category} ${product.colors.join(" ")}`.toLowerCase().includes(q)) : products });
  } catch (error) {
    console.error("Product search failed", error);
    return Response.json({ error: "We couldn't load the collection. Please try again." }, { status: 500 });
  }
}
