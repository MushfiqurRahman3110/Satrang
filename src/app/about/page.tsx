import type { Metadata } from "next";
import { About } from "@/components/about";

export const metadata: Metadata = { title: "Our Story", description: "Meet Satrang. Seven colours, one beautiful story, and handcrafted South Asian clothing." };

export default function AboutPage() { return <About />; }
