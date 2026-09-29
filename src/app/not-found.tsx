import Link from "next/link";
import { BrandMark, Icon } from "@/components/icons";

export default function NotFound() {
  return <main className="not-found-page page-gutter"><BrandMark size={80} /><p className="eyebrow">404 · A LITTLE OFF THE COLOUR CHART</p><h1>This colour hasn’t been mixed yet.</h1><p>Let’s take you back to something beautiful.</p><Link href="/shop" className="button button-black">Explore the collection<Icon name="arrow" size={18} /></Link></main>;
}
