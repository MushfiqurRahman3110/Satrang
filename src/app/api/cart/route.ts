import { db } from "@/db";
import { cartItems } from "@/db/schema";
import { getSessionCart, getCartSnapshot } from "@/lib/cart";
import { getProduct } from "@/lib/products";
import { and, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cart = await getSessionCart();
    return Response.json(await getCartSnapshot(cart.id));
  } catch (error) {
    console.error("Cart retrieval failed", error);
    return Response.json({ error: "Your bag is temporarily unavailable. Please try again." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cart = await getSessionCart();
    if (body.action === "add") {
      if (typeof body.productId !== "string" || typeof body.size !== "string") return Response.json({ error: "Choose a product and size." }, { status: 400 });
      const product = await getProduct(body.productId);
      if (!product || !product.sizes.includes(body.size)) return Response.json({ error: "This product or size is unavailable." }, { status: 400 });
      const quantity = Number(body.quantity ?? 1);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) return Response.json({ error: "Quantity must be between 1 and 10." }, { status: 400 });
      await db.insert(cartItems).values({ cartId: cart.id, productId: product.id, size: body.size, quantity }).onConflictDoUpdate({
        target: [cartItems.cartId, cartItems.productId, cartItems.size],
        set: { quantity: sql`least(10, ${cartItems.quantity} + ${quantity})` },
      });
    } else if (body.action === "update" || body.action === "remove") {
      if (typeof body.itemId !== "string" || !/^[a-f0-9-]{36}$/.test(body.itemId)) return Response.json({ error: "Invalid bag item." }, { status: 400 });
      const condition = and(eq(cartItems.id, body.itemId), eq(cartItems.cartId, cart.id));
      if (body.action === "remove") await db.delete(cartItems).where(condition);
      else {
        const quantity = Number(body.quantity);
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) return Response.json({ error: "Quantity must be between 1 and 10." }, { status: 400 });
        await db.update(cartItems).set({ quantity }).where(condition);
      }
    } else {
      return Response.json({ error: "Unknown bag action." }, { status: 400 });
    }
    return Response.json(await getCartSnapshot(cart.id));
  } catch (error) {
    console.error("Cart update failed", error);
    return Response.json({ error: "We couldn't update your bag. Please try again." }, { status: 500 });
  }
}
