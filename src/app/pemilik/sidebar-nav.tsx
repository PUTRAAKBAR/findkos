"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building, CalendarCheck } from "lucide-react";

export function SidebarNav({ pendingCount }: { pendingCount: number | null }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/pemilik/dashboard", icon: Home, label: "Dashboard" },
    { href: "/pemilik/properti", icon: Building, label: "Properti Saya" },
    { href: "/pemilik/pesanan", icon: CalendarCheck, label: "Pesanan" },
  ];

  return (
    <nav className="flex-1 py-6 px-4 space-y-2">
      {navItems.map((item) => {
        // Special logic for dashboard to prevent matching sub-routes of properti/pesanan
        const isActive = pathname === item.href || (item.href !== "/pemilik/dashboard" && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              {item.label}
            </div>
            {item.href === "/pemilik/pesanan" && !!pendingCount && pendingCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
