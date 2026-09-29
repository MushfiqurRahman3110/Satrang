import { db } from "@/db";
import { subscribers } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.email !== "string" || body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    await db.insert(subscribers).values({ email: body.email.trim().toLowerCase() }).onConflictDoNothing();
    return Response.json({ success: true });
  } catch (error) {
    console.error("Newsletter subscription failed", error);
    return Response.json({ error: "We couldn't add you to the list. Please try again." }, { status: 500 });
  }
}
