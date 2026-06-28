"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, FileText } from "lucide-react";

export default function PemesananClient({ initialBookings }: { initialBookings: any[] }) {
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleDetail = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const tabs = ["Semua", "Menunggu", "Disetujui", "Ditolak", "Dibayar", "Selesai", "Dibatalkan"];

  const filteredBookings = initialBookings.filter(booking => {
    // Filter by tab
    if (activeTab !== "Semua" && booking.status.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const name = booking.users?.full_name?.toLowerCase() || "";
      if (!name.includes(searchQuery.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  });

  const formatWhatsApp = (phone: string) => {
    if (!phone) return "";
    let formatted = phone.replace(/\D/g, "");
    if (formatted.startsWith("0")) {
      formatted = "62" + formatted.substring(1);
    }
    return `https://wa.me/${formatted}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Semua Pemesanan</h2>
        <p className="text-muted-foreground">Pantau seluruh transaksi dan penyewaan kos di platform FINDKOS.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg overflow-x-auto w-full sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Cari nama penyewa..." 
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List Pesanan */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-background border rounded-xl shadow-sm">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Tidak ada pesanan ditemukan.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className={`bg-background border rounded-xl p-5 shadow-sm transition-all ${['ditolak', 'dibatalkan', 'selesai'].includes(booking.status) ? 'opacity-80' : ''}`}>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg uppercase">
                        {booking.users?.full_name?.substring(0, 2) || '?'}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{booking.users?.full_name || 'Pengguna Tidak Diketahui'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.users?.phone || '-'} • {booking.users?.role || '-'}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={booking.status === 'menunggu' ? 'outline' : booking.status === 'ditolak' ? 'destructive' : booking.status === 'dibatalkan' ? 'secondary' : 'default'}
                      className={
                        booking.status === 'menunggu' ? "text-amber-500 border-amber-500 bg-amber-50" : 
                        booking.status === 'disetujui' ? "bg-emerald-500" :
                        booking.status === 'dibayar' ? "bg-blue-500" :
                        booking.status === 'selesai' ? "bg-slate-500" : ""
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Properti</p>
                      <p className="font-semibold">{booking.properties?.name || 'Properti Tidak Diketahui'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Tanggal Mulai</p>
                      <p className="font-semibold flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1"/> 
                        {new Date(booking.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Durasi</p>
                      <p className="font-semibold flex items-center"><Clock className="w-3.5 h-3.5 mr-1"/> {booking.duration_months} Bulan</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Total Biaya</p>
                      <p className="font-bold text-primary">Rp {booking.total_price?.toLocaleString('id-ID') || '0'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 justify-end md:justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                  <Button 
                    variant={expandedId === booking.id ? "default" : "outline"} 
                    className={`w-full ${expandedId === booking.id ? '' : 'text-muted-foreground'}`}
                    onClick={() => toggleDetail(booking.id)}
                  >
                    <FileText className="w-4 h-4 mr-2" /> {expandedId === booking.id ? 'Tutup Detail' : 'Detail'}
                  </Button>
                </div>
              </div>
              
              {/* Detail Section */}
              {expandedId === booking.id && (
                <div className="mt-6 pt-6 border-t animate-in fade-in slide-in-from-top-4 duration-300">
                  <h4 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">Detail Tambahan</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-muted/20 p-5 rounded-lg border border-muted/50">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">ID Pesanan</p>
                        <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">{booking.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Dibuat Pada</p>
                        <p className="text-sm">{new Date(booking.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 sm:border-l sm:pl-6">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Kontak Penyewa</p>
                        <p className="text-sm font-medium">{booking.users?.phone || 'Tidak ada nomor telepon'}</p>
                      </div>
                      {booking.users?.phone && (
                        <a 
                          href={formatWhatsApp(booking.users.phone)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#25D366] text-white hover:bg-[#25D366]/90 h-9 px-4 py-2 mt-2 w-full sm:w-auto"
                        >
                          Hubungi via WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
