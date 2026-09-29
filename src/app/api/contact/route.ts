import { db } from "@/db";
import { contactMessages } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.name !== "string" || body.name.trim().length < 2 || body.name.length > 120 || typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) || body.email.length > 254 || typeof body.message !== "string" || body.message.trim().length < 20 || body.message.length > 5000) {
      return Response.json({ error: "Please enter your name, a valid email, and a message of at least 20 characters." }, { status: 400 });
    }
    const [message] = await db.insert(contactMessages).values({ name: body.name.trim(), email: body.email.trim().toLowerCase(), subject: typeof body.subject === "string" ? body.subject.slice(0, 120) : "General inquiry", message: body.message.trim() }).returning({ id: contactMessages.id });
    return Response.json({ success: true, reference: message.id.slice(0, 8).toUpperCase() }, { status: 201 });
  } catch (error) {
    console.error("Contact submission failed", error);
    return Response.json({ error: "We couldn't send your message. Please try again." }, { status: 500 });
  }
}
