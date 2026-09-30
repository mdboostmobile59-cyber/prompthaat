import { prisma } from "@/lib/prisma";
import { Layers, ShoppingBag, Users, DollarSign } from "lucide-react";

export default async function AdminDashboardPage() {
  // ডাটাবেজ থেকে আসল পরিসংখ্যান গণনা
  const totalPrompts = await prisma.prompt.count();
  const freePrompts = await prisma.prompt.count({ where: { isPremium: false } });
  const premiumPrompts = await prisma.prompt.count({ where: { isPremium: true } });
  const totalUsers = await prisma.user.count();
  const purchases = await prisma.purchase.findMany({ select: { amount: true } });

  const totalRevenue = purchases.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const stats = [
    { label: "Total Prompts", value: totalPrompts, icon: Layers, color: "text-brand-orange" },
    { label: "Free Prompts", value: freePrompts, icon: Layers, color: "text-emerald-400" },
    { label: "Premium Prompts", value: premiumPrompts, icon: Layers, color: "text-amber-400" },
    { label: "Total Users", value: totalUsers, icon: Users, color: "text-blue-400" },
    { label: "Total Revenue", value: `৳${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
          Admin Control Center
        </span>
        <h1 className="text-3xl font-black text-white mt-1">PromptHaat Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">
          Monitor your prompt marketplace, users, sales, and platform settings.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#151B28] border border-gray-800 rounded-2xl p-6 flex items-center justify-between shadow-lg"
            >
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                <h3 className="text-2xl font-black text-white mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-black/40 border border-white/5 ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
