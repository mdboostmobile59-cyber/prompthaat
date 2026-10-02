import Link from "next/link";
import { getCategories } from "@/lib/prompts";
export const dynamic="force-dynamic";
export default async function CategoriesPage(){ const cats=await getCategories();
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"><h1 className="text-3xl sm:text-4xl font-black">Categories</h1><p className="muted mt-1">Browse prompts by category</p>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">{cats.map(c=><Link key={c.slug} href={`/browse?category=${encodeURIComponent(c.name)}`} className="card rounded-2xl p-6 hover:border-[#FF6B00] transition"><h3 className="font-extrabold text-lg">{c.name}</h3><p className="text-sm muted mt-1">{c.description||"Explore prompts in this category"}</p><div className="text-xs font-bold text-[#FF6B00] mt-3">{c.count} prompts →</div></Link>)}</div></div>;
}
