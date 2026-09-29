import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#080B11] border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 md:col-span-1">
            <span className="text-2xl font-black tracking-tight text-white">
              Prompt<span className="text-brand-orange">Haat</span>
            </span>
            <p className="text-sm text-gray-400">
              Bangladesh-first AI Prompt Marketplace. Discover ready-to-use AI prompts for video, image, and storytelling.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/browse" className="hover:text-brand-orange transition-colors">
                  All Prompts
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-brand-orange transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/premium" className="hover:text-brand-orange transition-colors">
                  Premium Library
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Account
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/login" className="hover:text-brand-orange transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-brand-orange transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-orange transition-colors">
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Sample Showcase
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Watch real AI video outputs in our official WhatsApp Community.
            </p>
            <div className="inline-block px-3 py-1.5 text-xs font-medium rounded border border-brand-orange/30 text-brand-orange bg-brand-orange/10">
              WhatsApp Community Powered
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} PromptHaat. All rights reserved. Built for creative creators.</p>
        </div>
      </div>
    </footer>
  );
}
