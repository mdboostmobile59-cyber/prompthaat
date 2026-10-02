"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, Heart, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
const nav=[["Home","/"],["Browse Prompts","/browse"],["Categories","/categories"],["Premium","/premium"],["VIP","/vip"]];
export default function Header(){
  const [open,setOpen]=useState(false);
  return <header className="sticky top-0 z-50 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-[#0B0F17]/90">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16 gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-black">✦</span>
          <span className="text-xl font-black tracking-tight">Prompt<span className="text-[#FF6B00]">Haat</span></span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1 bg-gray-100 dark:bg-[#151B28] p-1 rounded-full border border-gray-200 dark:border-gray-800">
          {nav.map(([n,h])=><Link key={h} href={h} className="px-4 py-2 rounded-full text-sm font-semibold hover:text-[#FF6B00]">{n}</Link>)}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link href="/browse" aria-label="Search" className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center"><Search className="w-4 h-4"/></Link>
          <ThemeToggle/>
          <Link href="/dashboard/favorites" aria-label="Favorites" className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center"><Heart className="w-4 h-4"/></Link>
          <Link href="/login" className="text-sm font-bold px-2">Login</Link>
          <Link href="/register" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold text-white bg-[#FF6B00] hover:bg-[#E05E00]"><Sparkles className="w-4 h-4"/>Sign Up</Link>
        </div>
        <div className="flex md:hidden items-center gap-2"><ThemeToggle/><button onClick={()=>setOpen(!open)} className="p-2" aria-label="Menu">{open?<X className="w-6 h-6"/>:<Menu className="w-6 h-6"/>}</button></div>
      </div>
    </div>
    {open && <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151B28] px-4 py-4 space-y-1">
      {nav.map(([n,h])=><Link key={h} href={h} onClick={()=>setOpen(false)} className="block px-3 py-2.5 rounded-lg font-semibold">{n}</Link>)}
      <Link href="/dashboard/favorites" onClick={()=>setOpen(false)} className="block px-3 py-2.5 rounded-lg font-semibold">❤️ Favorites</Link>
      <Link href="/dashboard" onClick={()=>setOpen(false)} className="block px-3 py-2.5 rounded-lg font-semibold">Dashboard</Link>
      <div className="flex gap-2 pt-2"><Link href="/login" className="flex-1 text-center px-4 py-2.5 rounded-lg border font-bold">Login</Link><Link href="/register" className="flex-1 text-center px-4 py-2.5 rounded-lg bg-[#FF6B00] text-white font-bold">Sign Up</Link></div>
    </div>}
  </header>;
}
