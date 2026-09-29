import { pgTable, text, integer, jsonb, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  titleBn: text("title_bn").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  gallery: jsonb("gallery").$type<string[]>().notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  descriptionBn: text("description_bn").notNull(),
  material: text("material").notNull(),
  colors: jsonb("colors").$type<string[]>().notNull(),
  sizes: jsonb("sizes").$type<string[]>().notNull(),
  label: text("label"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  cartId: uuid("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id),
  size: text("size").notNull(),
  quantity: integer("quantity").notNull().default(1),
}, (table) => [uniqueIndex("cart_product_size_unique").on(table.cartId, table.productId, table.size)]);

export type OrderLine = { productId: string; title: string; size: string; quantity: number; price: number };

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  number: text("number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  items: jsonb("items").$type<OrderLine[]>().notNull(),
  subtotal: integer("subtotal").notNull(),
  delivery: integer("delivery").notNull(),
  total: integer("total").notNull(),
  status: text("status").notNull().default("confirmed"),
  paymentMethod: text("payment_method").notNull().default("cash_on_delivery"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
