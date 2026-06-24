"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, Heart, MessageSquare, Menu, User, LogOut, LayoutDashboard } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logout } from "@/app/auth/actions";
import { useActionState } from "react";

export function Navbar({ user }: { user: any }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, isPending] = useActionState(logout, undefined);

  // Tentukan link dashboard berdasarkan role
  let dashboardLink = "/akun";
  if (user?.role === "pemilik") dashboardLink = "/pemilik/dashboard";
  if (user?.role === "admin") dashboardLink = "/admin/dashboard";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FINDKOS Logo" className="h-8 w-auto object-contain" />
            <span className="font-bold text-xl tracking-tight">FINDKOS</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-primary">Beranda</Link>
            <Link href="/cari" className="transition-colors hover:text-primary">Cari Kos</Link>
            <Link href="/favorit" className="transition-colors hover:text-primary">Favorit</Link>
            <Link href="/tentang" className="transition-colors hover:text-primary">Tentang Kami</Link>
            <Link href="/kontak" className="transition-colors hover:text-primary">Kontak</Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href={dashboardLink}>
                  <Button variant="ghost" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <form action={formAction}>
                  <Button variant="outline" type="submit" disabled={isPending} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Keluar</span>
                  </Button>
                </form>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-primary">
                  Login
                </Link>
                <Link href="/daftar">
                  <Button>Daftar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background flex justify-around items-center h-16 pb-safe safe-area-padding">
        <Link href="/" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Beranda</span>
        </Link>
        <Link href="/cari" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Cari Kos</span>
        </Link>
        <Link href="/favorit" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-medium">Favorit</span>
        </Link>
        <Link href="/kontak" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium">Kontak</span>
        </Link>
        <Link href={user ? dashboardLink : "/login"} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Akun</span>
        </Link>
      </nav>
    </>
  );
}
