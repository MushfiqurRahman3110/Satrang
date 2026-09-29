"use client";

import Link from "next/link";
import { categories } from "@/lib/catalog";
import { Icon } from "./icons";
import { useStore } from "./store-provider";

export function CategoryCards() {
  const { t } = useStore();
  return <div className="category-grid">{categories.map((category, index) => <Link href={`/shop/${category.id}`} key={category.id} className={`category-card category-${category.id} reveal`} style={{ animationDelay: `${index * 100}ms` }}><div className="category-media"><img src={category.image} alt={category.subtitle} loading="lazy" /><span className="category-number">{category.number}</span><span className="category-tag">{t(category.note, category.noteBn)}</span></div><div className="category-card-heading"><div><h3>{t(category.title, category.titleBn)}<span className="category-bangla">{t(category.titleBn, category.title)}</span></h3><p>{t(category.subtitle, category.subtitleBn)}</p></div><span className="circle-arrow"><Icon name="arrow-up" size={22} /></span></div></Link>)}</div>;
}
