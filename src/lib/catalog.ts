export type Product = {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  image: string;
  gallery: string[];
  price: number;
  description: string;
  descriptionBn: string;
  material: string;
  colors: string[];
  sizes: string[];
  label: string | null;
  sortOrder: number;
};

export const catalog: Product[] = [
  {
    id: "gulabi-tie-dye-kamiz", title: "Gulabi Tie-Dye Kamiz", titleBn: "গুলাবি টাই-ডাই কামিজ", category: "tops",
    image: "/images/tops.jpg", gallery: ["/images/tops.jpg", "/images/bottoms.jpg"], price: 2450,
    description: "A little pink, a little sunshine. Our Gulabi kamiz is hand-dyed in small batches, so every swirl tells its own story. A relaxed silhouette, soft cotton, and thoughtful side pockets make it your new everyday favourite.",
    descriptionBn: "একটু গোলাপি, একটু রোদ্দুর। হাতে রাঙানো গুলাবি কামিজের প্রতিটি নকশাই আলাদা। নরম সুতি কাপড় আর আরামদায়ক কাট—আপনার প্রতিদিনের প্রিয় পোশাক।",
    material: "100% breathable cotton", colors: ["Pink", "Orange"], sizes: ["S", "M", "L", "XL"], label: "BESTSELLER", sortOrder: 1,
  },
  {
    id: "neel-indigo-frock", title: "Neel Indigo Frock", titleBn: "নীল ইন্ডিগো ফ্রক", category: "tops",
    image: "/images/indigo.jpg", gallery: ["/images/indigo.jpg", "/images/indigo.jpg"], price: 3450,
    description: "Inspired by the quiet blue of a monsoon sky. This flowing cotton frock is hand-dyed with beautiful indigo washes, finished with soft full sleeves and a silhouette that moves with you.",
    descriptionBn: "বর্ষার আকাশের শান্ত নীল থেকে অনুপ্রাণিত। হাতে রাঙানো এই সুতি ফ্রকের কোমল কাপড় আর প্রশস্ত কাট আপনার প্রতিটি পদক্ষেপে দোলা দেয়।",
    material: "100% hand-dyed cotton", colors: ["Blue", "Cream"], sizes: ["S", "M", "L", "XL"], label: "NEW COLOUR", sortOrder: 2,
  },
  {
    id: "rong-tie-dye-lehenga", title: "Rong Tie-Dye Lehenga", titleBn: "রঙ টাই-ডাই লেহেঙ্গা", category: "bottoms",
    image: "/images/bottoms.jpg", gallery: ["/images/bottoms.jpg", "/images/satrang-hero.jpg"], price: 4950,
    description: "Made for the moments worth twirling in. A beautifully full, hand-dyed lehenga in rose, saffron, and sunshine, paired with a matching blouse and airy dupatta. A modern love letter to our heritage.",
    descriptionBn: "গোলাপি আর জাফরানি রঙে হাতে রাঙানো লেহেঙ্গা। সঙ্গে মানানসই ব্লাউজ ও হালকা ওড়না। আমাদের ঐতিহ্যের প্রতি ভালোবাসার এক আধুনিক প্রকাশ।",
    material: "Cotton lehenga, chiffon dupatta", colors: ["Pink", "Orange"], sizes: ["S", "M", "L", "XL"], label: "THE RONG EDIT", sortOrder: 3,
  },
  {
    id: "mati-woven-sandals", title: "Mati Woven Sandals", titleBn: "মাটি বোনা স্যান্ডেল", category: "footwear",
    image: "/images/footwear.jpg", gallery: ["/images/footwear.jpg", "/images/footwear.jpg"], price: 1850,
    description: "Grounded in craft, ready for wherever you wander. Handwoven leather straps, a softly cushioned sole, and a warm earthy shade make these sandals a companion for every colour in your wardrobe.",
    descriptionBn: "হাতে বোনা চামড়ার ফিতা আর আরামদায়ক সোল। মাটির উষ্ণ রঙে তৈরি এই স্যান্ডেল আপনার প্রতিটি পোশাকের সঙ্গী।",
    material: "Handwoven leather, cushioned footbed", colors: ["Tan"], sizes: ["36", "37", "38", "39", "40"], label: "HANDCRAFTED", sortOrder: 4,
  },
  {
    id: "roder-saffron-top", title: "Roder Saffron Top", titleBn: "রোদের জাফরানি টপ", category: "tops",
    image: "/images/saffron-top.jpg", gallery: ["/images/saffron-top.jpg", "/images/tops.jpg"], price: 1950,
    description: "Carry a little sunshine with you. This easy, artisan tie-dye top blends warm saffron and coral on the softest cotton. A beautiful everyday piece to wear your own way.",
    descriptionBn: "নরম সুতি কাপড়ে জাফরানি আর কোরালের মিশেল। প্রতিদিন নিজের মতো করে পরার জন্য আরামদায়ক একটি টপ।",
    material: "100% natural cotton", colors: ["Orange", "Pink"], sizes: ["S", "M", "L", "XL"], label: null, sortOrder: 5,
  },
  {
    id: "boshonto-three-piece", title: "Boshonto Three-Piece", titleBn: "বসন্ত থ্রি-পিস", category: "bottoms",
    image: "/images/satrang-hero.jpg", gallery: ["/images/satrang-hero.jpg", "/images/bottoms.jpg"], price: 4250,
    description: "The joyful spirit of spring, in three beautiful pieces. An artisan-dyed set with a comfortable top, flowing bottom, and feather-light dupatta. Designed to be loved together or styled separately.",
    descriptionBn: "বসন্তের আনন্দ তিনটি সুন্দর পোশাকে। হাতে রাঙানো আরামদায়ক টপ, বটম আর হালকা ওড়না। একসঙ্গে বা আলাদা—দুইভাবেই সুন্দর।",
    material: "Hand-dyed cotton and chiffon", colors: ["Pink", "Orange"], sizes: ["S", "M", "L", "XL"], label: "LIMITED BATCH", sortOrder: 6,
  },
  {
    id: "phool-embroidered-nagra", title: "Phool Embroidered Nagra", titleBn: "ফুল এমব্রয়ডারি নাগরা", category: "footwear",
    image: "/images/nagra.jpg", gallery: ["/images/nagra.jpg", "/images/nagra.jpg"], price: 2250,
    description: "A garden at your feet. Traditional nagras reimagined with delicate floral embroidery, a comfortable padded lining, and a soft rose hue. Every stitch is a small celebration of craft.",
    descriptionBn: "পায়ের কাছে এক টুকরো ফুলের বাগান। নরম গোলাপি রঙে ফুলের সূক্ষ্ম কারুকাজ আর আরামদায়ক আস্তরণে তৈরি ঐতিহ্যবাহী নাগরা।",
    material: "Embroidered cotton upper, leather sole", colors: ["Pink", "Cream"], sizes: ["36", "37", "38", "39", "40"], label: "ARTISAN MADE", sortOrder: 7,
  },
  {
    id: "neel-flowing-skirt", title: "Neel Flowing Skirt", titleBn: "নীল ফ্লোয়িং স্কার্ট", category: "bottoms",
    image: "/images/indigo.jpg", gallery: ["/images/indigo.jpg", "/images/bottoms.jpg"], price: 2850,
    description: "Soft swirls of indigo in a skirt made to move. A comfortable adjustable waistband and beautifully gathered cotton make this hand-dyed piece feel as lovely as it looks.",
    descriptionBn: "নীল রঙের কোমল ঢেউয়ে হাতে রাঙানো স্কার্ট। আরামদায়ক কোমরবন্ধ আর নরম সুতি কাপড়ে তৈরি—দেখতে যেমন সুন্দর, পরতেও তেমন।",
    material: "100% artisan-dyed cotton", colors: ["Blue", "Cream"], sizes: ["S", "M", "L", "XL"], label: null, sortOrder: 8,
  },
];

export const categories = [
  { id: "tops", title: "Tops", titleBn: "টপস", subtitle: "Kamiz, frocks & everyday favourites", subtitleBn: "কামিজ, ফ্রক ও প্রতিদিনের প্রিয় পোশাক", image: "/images/tops.jpg", number: "01", note: "THE EVERYDAY EDIT", noteBn: "প্রতিদিনের কালেকশন" },
  { id: "bottoms", title: "Bottoms", titleBn: "বটমস", subtitle: "Lehengas, three-pieces & a little twirl", subtitleBn: "লেহেঙ্গা, থ্রি-পিস ও একটু আনন্দ", image: "/images/bottoms.jpg", number: "02", note: "MADE TO MOVE", noteBn: "আপনার সঙ্গে চলার জন্য" },
  { id: "footwear", title: "Footwear", titleBn: "জুতা", subtitle: "Handcrafted steps, wherever you go", subtitleBn: "প্রতিটি পদক্ষেপে হাতের কারুকাজ", image: "/images/footwear.jpg", number: "03", note: "GROUNDED IN CRAFT", noteBn: "হাতের কারুকাজে গড়া" },
];

export function bengaliLabel(label: string) {
  const labels: Record<string, string> = {
    "BESTSELLER": "সবচেয়ে প্রিয়", "NEW COLOUR": "নতুন রঙ", "THE RONG EDIT": "রঙ কালেকশন", "HANDCRAFTED": "হাতে গড়া", "LIMITED BATCH": "সীমিত আয়োজন", "ARTISAN MADE": "শিল্পীর হাতে তৈরি",
    "Pink": "গোলাপি", "Orange": "কমলা", "Blue": "নীল", "Tan": "বাদামি", "Cream": "ক্রিম",
  };
  return labels[label] || label;
}

export function formatPrice(value: number) {
  return `৳ ${new Intl.NumberFormat("en-BD").format(value)}`;
}
