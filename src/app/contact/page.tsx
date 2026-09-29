import type { Metadata } from "next";
import { Contact } from "@/components/contact";

export const metadata: Metadata = { title: "Get in Touch & FAQs", description: "Say hello to Satrang. Find answers about delivery, returns, sizing, and caring for your handcrafted clothing." };

export default function ContactPage() { return <Contact />; }
