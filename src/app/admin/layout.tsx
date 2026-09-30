import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user: any = await getCurrentUser();

  // নিরাপত্তা: শুধুমাত্র ADMIN রোলের ইউজার ঢুকতে পারবে
  if (!user || user.role !== "ADMIN") {
    redirect("/login?error=admin_only");
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] flex">
      {/* বামপাশে সাইডবার মেন্যু */}
      <AdminSidebar />

      {/* মূল কন্টেন্ট এরিয়া */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
