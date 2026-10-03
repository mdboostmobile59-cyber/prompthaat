import Link from "next/link";
export default function Footer(){
  return <footer className="border-t border-gray-200 dark:border-gray-800 mt-20 bg-gray-50 dark:bg-[#080B11]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div><span className="text-2xl font-black">Prompt<span className="text-[#FF6B00]">Haat</span></span><p className="text-sm muted mt-3">Bangladesh-first AI Prompt Marketplace. Ready-to-use prompts for video, image & storytelling.</p></div>
      <div><h4 className="font-bold mb-3">Explore</h4><ul className="space-y-2 text-sm muted"><li><Link href="/browse">All Prompts</Link></li><li><Link href="/categories">Categories</Link></li><li><Link href="/premium">Premium</Link></li><li><Link href="/vip">VIP — All Access ৳999</Link></li></ul></div>
      <div><h4 className="font-bold mb-3">Account</h4><ul className="space-y-2 text-sm muted"><li><Link href="/login">Login</Link></li><li><Link href="/register">Create Account</Link></li><li><Link href="/dashboard">Dashboard</Link></li><li><Link href="/dashboard/favorites">My Favorites</Link></li></ul></div>
      <div><h4 className="font-bold mb-3">Sample Showcase</h4><p className="text-sm muted">Watch real AI outputs in our WhatsApp Community.</p><p className="text-sm muted mt-3">Follow us on <a href="https://www.facebook.com/profile.php?id=61594661417825" target="_blank" rel="noreferrer" className="text-[#FF6B00] font-semibold">Facebook — Prompt Haat</a> for daily free prompts & viral AI video ideas.</p></div>
    </div>
    <div className="border-t border-gray-200 dark:border-gray-800 py-5 text-center text-xs muted">© {new Date().getFullYear()} PromptHaat. All rights reserved.</div>
  </footer>;
}
