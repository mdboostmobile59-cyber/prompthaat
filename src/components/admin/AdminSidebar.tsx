"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  FolderTree,
  ShoppingBag,
  Users,
  Settings,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Prompts", href: "/admin/prompts", icon: Layers },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders & Sales", href: "/admin/orders", icon: ShoppingBag },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "WhatsApp Settings", href: "/admin/settings/whatsapp", icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-[#080B11] border-r border-gray-800 flex flex-col justify-between h-screen sticky top-0">
      <div className="p-6 space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-white">
            Prompt<span className="text-brand-orange">Haat</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
            ADMIN
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20"
                    : "text-gray-400 hover:text-white hover:bg-[#151B28]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Back to main website */}
      <div className="p-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-850 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Main Site</span>
        </Link>
      </div>
    </aside>
  );
}
