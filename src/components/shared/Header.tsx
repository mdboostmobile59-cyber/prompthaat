"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, User } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F17]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-white">
              Prompt<span className="text-brand-orange">Haat</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-white hover:text-brand-orange transition-colors">
              Home
            </Link>
            <Link href="/browse" className="text-sm font-medium text-gray-300 hover:text-brand-orange transition-colors">
              Browse Prompts
            </Link>
            <Link href="/categories" className="text-sm font-medium text-gray-300 hover:text-brand-orange transition-colors">
              Categories
            </Link>
            <Link href="/premium" className="text-sm font-medium text-gray-300 hover:text-brand-orange transition-colors">
              Premium
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-brand-orange transition-colors">
              Dashboard
            </Link>
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-orange hover:bg-brand-orangeHover transition-all shadow-md shadow-brand-orange/20"
            >
              <Sparkles className="w-4 h-4" />
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#151B28] border-b border-gray-800 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
          >
            Home
          </Link>
          <Link
            href="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
          >
            Browse Prompts
          </Link>
          <Link
            href="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
          >
            Categories
          </Link>
          <Link
            href="/premium"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
          >
            Premium
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
          >
            Dashboard
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-orange hover:bg-brand-orangeHover"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
