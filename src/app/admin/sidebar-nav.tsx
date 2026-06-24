"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CheckSquare } from "lucide-react";

export function SidebarNav({ pendingCount }: { pendingCount: number | null }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/verifikasi", icon: CheckSquare, label: "Verifikasi Kos" },
    { href: "/admin/pengguna", icon: Users, label: "Pengguna" },
  ];

  return (
    <nav className="flex-1 py-6 px-4 space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
              isActive
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              {item.label}
            </div>
            {item.href === "/admin/verifikasi" && !!pendingCount && pendingCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
