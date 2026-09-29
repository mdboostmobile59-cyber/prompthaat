import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, ShoppingBag, Heart, LogOut, ShieldCheck } from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Banner */}
      <div className="bg-[#151B28] border border-gray-800 rounded-2xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
            User Account
          </span>
          <h1 className="text-3xl font-black text-white mt-1">
            Welcome, {user.name as string}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{user.email as string}</p>
        </div>

        <div className="flex items-center gap-3">
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </Link>
          )}

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-red-900/60 hover:text-red-200 text-gray-300 text-sm font-medium rounded-lg border border-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </form>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Purchases */}
        <div className="bg-[#151B28] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
          <div className="w-12 h-12 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Purchased Prompts</h3>
          <p className="text-sm text-gray-400 mt-1 mb-4">
            All your unlocked and purchased premium prompts.
          </p>
          <span className="text-xs text-brand-orange font-semibold">0 Items Unlocked</span>
        </div>

        {/* Card 2: Favorites */}
        <div className="bg-[#151B28] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
          <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Favorite Prompts</h3>
          <p className="text-sm text-gray-400 mt-1 mb-4">
            Saved prompts that you want to use later.
          </p>
          <span className="text-xs text-pink-500 font-semibold">0 Saved Prompts</span>
        </div>

        {/* Card 3: Account Security */}
        <div className="bg-[#151B28] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Account Details</h3>
          <p className="text-sm text-gray-400 mt-1 mb-2">
            Role: <span className="font-semibold text-white uppercase">{user.role as string}</span>
          </p>
          <span className="text-xs text-emerald-500 font-semibold">Active & Secure</span>
        </div>
      </div>
    </div>
  );
}
