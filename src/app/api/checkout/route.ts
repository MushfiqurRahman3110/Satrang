import { db } from "@/db";
import { cartItems, orders, products } from "@/db/schema";
import { getSessionCart } from "@/lib/cart";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fields = ["name", "email", "phone", "address", "city"] as const;
    if (fields.some((field) => typeof body[field] !== "string" || body[field].trim().length < 2 || body[field].length > 500)) {
      return Response.json({ error: "Please complete all delivery details." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) || !/^[+\d\s()-]{8,20}$/.test(body.phone)) {
      return Response.json({ error: "Please enter a valid email and phone number." }, { status: 400 });
    }
    const cart = await getSessionCart();
    const result = await db.transaction(async (tx) => {
      await tx.execute(sql`select id from carts where id = ${cart.id} for update`);
      const lines = await tx.select({ productId: cartItems.productId, title: products.title, size: cartItems.size, quantity: cartItems.quantity, price: products.price })
        .from(cartItems).innerJoin(products, eq(cartItems.productId, products.id)).where(eq(cartItems.cartId, cart.id));
      if (!lines.length) return null;
      const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
      const delivery = subtotal >= 4000 ? 0 : 100;
      const number = `SAT-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
      const [order] = await tx.insert(orders).values({
        number, customerName: body.name.trim(), email: body.email.trim().toLowerCase(), phone: body.phone.trim(), address: body.address.trim(), city: body.city.trim(),
        items: lines, subtotal, delivery, total: subtotal + delivery,
      }).returning({ number: orders.number, total: orders.total });
      await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));
      return order;
    });
    if (!result) return Response.json({ error: "Your bag is empty. Add something colourful first." }, { status: 400 });
    return Response.json({ order: result }, { status: 201 });
  } catch (error) {
    console.error("Checkout failed", error);
    return Response.json({ error: "We couldn't place your order. Please try again." }, { status: 500 });
  }
}
