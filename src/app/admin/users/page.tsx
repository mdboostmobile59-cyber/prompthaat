"use client";
import { useEffect, useState } from "react";
export default function AdminUsers(){ const [users,setUsers]=useState<any[]>([]); const [q,setQ]=useState(""); const [filter,setFilter]=useState("All");
  useEffect(()=>{ fetch(`/api/admin/users?q=${encodeURIComponent(q)}`).then(r=>r.json()).then(d=>setUsers(d.users||[])); },[q]);
  const shown=users.filter(u=>filter==="All"||(filter==="Premium"?u.isPremiumUser:!u.isPremiumUser));
  return <div className="space-y-6"><h1 className="text-3xl font-black">Users</h1>
    <div className="flex gap-3 flex-wrap"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name/email" className="input max-w-sm"/><div className="flex gap-1">{["All","Free","Premium"].map(f=><button key={f} onClick={()=>setFilter(f)} className={`px-4 py-2 rounded-lg font-bold ${filter===f?"bg-[#FF6B00] text-white":"card"}`}>{f}</button>)}</div></div>
    <div className="card rounded-2xl overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr className="border-b border-gray-700"><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Type</th><th className="p-4">Purchases</th><th className="p-4">Total Spent</th><th className="p-4">Joined</th></tr></thead><tbody>{shown.map(u=><tr key={u.id} className="border-b border-gray-800"><td className="p-4 font-bold">{u.name} {u.isVip && <span className="text-amber-500">👑 VIP</span>}</td><td className="p-4">{u.email}</td><td className="p-4">{u.isPremiumUser?"Premium":"Free"}</td><td className="p-4">{u.purchasedCount}</td><td className="p-4">৳{u.totalSpent}</td><td className="p-4">{String(u.createdAt).slice(0,10)}</td></tr>)}</tbody></table>{!shown.length && <p className="p-8 text-center muted">No users found.</p>}</div></div>;
}
