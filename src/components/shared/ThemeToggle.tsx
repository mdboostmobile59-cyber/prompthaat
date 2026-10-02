"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
export default function ThemeToggle(){
  const [dark,setDark]=useState(true);
  useEffect(()=>{ const t=localStorage.getItem("prompthaat-theme"); const isDark=t?t==="dark":true; setDark(isDark); document.documentElement.classList.toggle("dark",isDark); },[]);
  const toggle=()=>{ const n=!dark; setDark(n); document.documentElement.classList.toggle("dark",n); localStorage.setItem("prompthaat-theme", n?"dark":"light"); };
  return <button onClick={toggle} aria-label="Toggle theme" className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:border-[#FF6B00] transition">{dark?<Sun className="w-4 h-4"/>:<Moon className="w-4 h-4"/>}</button>;
}
