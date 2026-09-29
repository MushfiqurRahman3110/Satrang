import { cookies } from "next/headers";
import { db } from "@/db";
import { carts, cartItems, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function getSessionCart() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("satrang_cart")?.value;
  if (!sessionId || !/^[a-f0-9-]{36}$/.test(sessionId)) {
    sessionId = randomUUID();
    cookieStore.set("satrang_cart", sessionId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  }
  const [existing] = await db.select().from(carts).where(eq(carts.sessionId, sessionId)).limit(1);
  if (existing) return existing;
  const [created] = await db.insert(carts).values({ sessionId }).onConflictDoUpdate({ target: carts.sessionId, set: { sessionId } }).returning();
  return created;
}

export async function getCartSnapshot(cartId: string) {
  const items = await db.select({
    id: cartItems.id,
    productId: cartItems.productId,
    size: cartItems.size,
    quantity: cartItems.quantity,
    title: products.title,
    titleBn: products.titleBn,
    image: products.image,
    price: products.price,
  }).from(cartItems).innerJoin(products, eq(cartItems.productId, products.id)).where(eq(cartItems.cartId, cartId));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { items, subtotal, delivery: subtotal === 0 || subtotal >= 4000 ? 0 : 100, totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0) };
}
