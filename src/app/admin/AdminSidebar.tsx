"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, Settings, LogOut, ExternalLink, Sparkles } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Templates CMS", href: "/admin/templates", icon: LayoutGrid },
    { label: "Premium Requests", href: "/admin/premium-requests", icon: Sparkles },
    { label: "Orders & Sales", href: "/admin/orders", icon: Package },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gold-medium/15 flex flex-col justify-between p-6 shrink-0 hidden md:flex shadow-sm">
        <div className="flex flex-col gap-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gold-light border border-gold-medium/30 flex items-center justify-center text-gold-dark group-hover:scale-105 transition-transform shadow-xs">
              <Sparkles className="w-5 h-5 text-gold-dark" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base font-bold text-luxury-dark tracking-wide">Varnam CMS</span>
              <span className="text-[9px] uppercase tracking-widest text-gold-dark/80 font-bold">Admin Panel</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-luxury-dark text-gold-light border border-gold-medium/20 shadow-md"
                      : "text-foreground/60 hover:text-luxury-dark hover:bg-gold-light/40"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-gold-light" : "text-gold-dark"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-3 pt-6 border-t border-gold-medium/10">
          <Link
            href="/templates"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-foreground/70 hover:text-gold-dark hover:bg-gold-light/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-gold-dark" />
              View Public Site
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <header className="h-16 bg-white border-b border-gold-medium/15 px-6 flex items-center justify-between md:hidden shrink-0 shadow-xs">
        <Link href="/admin/templates" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-dark" />
          <span className="font-serif font-bold text-luxury-dark text-sm">Varnam Admin</span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
          <Link href="/admin/templates" className="text-gold-dark">Templates</Link>
          <Link href="/" className="text-foreground/50">Exit</Link>
        </div>
      </header>
    </>
  );
}
