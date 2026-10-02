import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function AccountPage(){ const user:any=await getCurrentUser(); if(!user) redirect("/login");
  return <div className="max-w-2xl mx-auto px-4 py-10"><h1 className="text-3xl font-black">Account</h1><div className="card rounded-2xl p-6 mt-6 space-y-3 text-sm"><div><span className="muted">Name:</span> <b>{user.name}</b></div><div><span className="muted">Email:</span> <b>{user.email}</b></div><div><span className="muted">Role:</span> <b>{user.role}</b></div><form action="/api/auth/logout" method="POST"><button className="btn-orange mt-4">Logout</button></form></div></div>;
}
