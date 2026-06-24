import Link from "next/link";
import { Home, Settings, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { SidebarNav } from "./sidebar-nav";
import { TopbarSearch } from "./topbar-search";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const { count: pendingCount } = await supabase
    .from('properties')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'menunggu');

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-100 border-r border-slate-800 sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FINDKOS Logo" className="h-8 w-auto object-contain brightness-0 invert" />
            <span className="font-bold text-xl tracking-tight text-white">FINDKOS</span>
          </Link>
          <div className="mt-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
            Admin Pusat
          </div>
        </div>

        <SidebarNav pendingCount={pendingCount} />

        <div className="p-4 border-t border-slate-800">
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl font-medium transition-colors mb-2">
            <Settings className="w-5 h-5" />
            Sistem
          </Link>
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800 px-3">
            <LogOut className="w-5 h-5 mr-3" />
            Keluar Admin
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white sticky top-0 z-10">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FINDKOS Logo" className="h-6 w-auto object-contain brightness-0 invert" />
            <span className="font-bold text-lg">FINDKOS Admin</span>
          </Link>
          <Button variant="outline" size="sm" className="text-slate-900">Menu</Button>
        </header>

        {/* Topbar Desktop */}
        <header className="hidden md:flex h-16 bg-background border-b items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold">Ringkasan Sistem</h1>
          <div className="flex items-center gap-4">
            <TopbarSearch />
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              AD
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
