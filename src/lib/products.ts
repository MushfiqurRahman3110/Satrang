import { cache } from "react";
import { db } from "@/db";
import { products } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { catalog } from "./catalog";

export const ensureCatalog = cache(async () => {
  await db.insert(products).values(catalog).onConflictDoNothing();
});

export const getProducts = cache(async (category?: string) => {
  await ensureCatalog();
  const query = db.select().from(products);
  return category
    ? query.where(eq(products.category, category)).orderBy(asc(products.sortOrder))
    : query.orderBy(asc(products.sortOrder));
});

export const getProduct = cache(async (id: string) => {
  await ensureCatalog();
  const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return product ?? null;
});
