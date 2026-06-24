import Link from "next/link";
import { Home, Building, CalendarCheck, Settings, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import { createClient } from "@/utils/supabase/server";
import { SidebarNav } from "./sidebar-nav";

export default async function PemilikLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const { count: pendingCount } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'menunggu');

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-background border-r sticky top-0 h-screen">
        <div className="p-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FINDKOS Logo" className="h-8 w-auto object-contain" />
            <span className="font-bold text-xl tracking-tight text-foreground">FINDKOS</span>
          </Link>
          <div className="mt-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Mitra Dashboard
          </div>
        </div>

        <SidebarNav pendingCount={pendingCount} />

        <div className="p-4 border-t">
          <Link href="/pemilik/pengaturan" className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-medium transition-colors mb-2">
            <Settings className="w-5 h-5" />
            Pengaturan
          </Link>
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 px-3">
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-background border-b sticky top-0 z-10">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FINDKOS Logo" className="h-6 w-auto object-contain" />
            <span className="font-bold text-lg">FINDKOS</span>
          </Link>
          <Button variant="outline" size="sm">Menu</Button>
        </header>

        {/* Topbar Desktop */}
        <header className="hidden md:flex h-16 bg-background border-b items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Cari transaksi..." 
                className="pl-9 pr-4 py-2 bg-muted border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              BJ
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
