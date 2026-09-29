import { Home } from "@/components/home";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();
  return <Home products={products} />;
}
