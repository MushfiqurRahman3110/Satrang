import type { CSSProperties } from "react";

type IconName = "arrow" | "arrow-up" | "bag" | "search" | "heart" | "close" | "plus" | "minus" | "chevron" | "menu" | "check" | "thread" | "leaf" | "truck" | "flower" | "instagram";

export function Icon({ name, size = 20, className = "", style }: { name: IconName; size?: number; className?: string; style?: CSSProperties }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M4 12h16M14 6l6 6-6 6" /></>,
    "arrow-up": <><path d="M5 19 19 5M5 5h14v14" /></>,
    bag: <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
    close: <path d="m5 5 14 14M19 5 5 19" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    check: <path d="m5 12 4 4L19 6" />,
    thread: <><path d="m14 3 6 6-13 13-6-6L14 3Z" /><path d="m13 4 6 6M3 14l6 6M8 9l7 7M10 7l7 7M6 11l7 7" /><path d="M20 9c4 8-3 3-3 9" /></>,
    leaf: <><path d="M20 3C6 1 2 8 5 15c6 8 16 0 15-12Z" /><path d="M3 21 16 8M8 16v-5M8 16h5" /></>,
    truck: <><path d="M2 5h12v12H2V5ZM14 9h4l4 4v4h-8" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    flower: <><path d="M12 3c3-5 6 1 4 5 6-2 8 4 3 6 4 4-1 8-5 5-1 6-7 5-7 0-5 3-8-3-4-6-5-3-1-8 4-5-2-5 3-9 5-5Z" /><circle cx="12" cy="12" r="2.5" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={style}>{paths[name]}</svg>;
}

export function BrandMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" className={className}>
    {Array.from({ length: 12 }, (_, i) => <path key={i} d="M50 3 57 27 50 44 43 27Z" transform={`rotate(${i * 30} 50 50)`} />)}
    {Array.from({ length: 12 }, (_, i) => <path key={i} d="M50 22 55 38 50 47 45 38Z" transform={`rotate(${i * 30 + 15} 50 50)`} />)}
    <circle cx="50" cy="50" r="6" />
  </svg>;
}

export function Sparkle({ className = "", size = 52 }: { className?: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" className={className} aria-hidden="true"><path d="M32 2c0 23 7 30 30 30-23 0-30 7-30 30 0-23-7-30-30-30 23 0 30-7 30-30Z" /><path d="m10 10 44 44M54 10 10 54" /></svg>;
}
