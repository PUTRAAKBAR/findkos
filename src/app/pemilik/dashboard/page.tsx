import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Wallet, PlusCircle, ArrowUpRight, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardBookingButtons } from "./dashboard-buttons";

export default async function PemilikDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil profil user
  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();

  if (profile?.role !== 'pemilik') {
    redirect("/akun"); // Lempar ke halaman mhs
  }

  // Fetch Properti
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch Semua Pesanan yang terkait dengan properti user untuk statistik
  const { data: allBookings } = await supabase
    .from('bookings')
    .select(`
      *,
      users(full_name),
      properties(name)
    `)
    // RLS policy ensures owner only sees bookings for their properties
    .order('created_at', { ascending: false });

  const bookings = allBookings?.slice(0, 5) || [];
  const validBookings = allBookings?.filter(b => !['ditolak', 'dibatalkan'].includes(b.status)) || [];

  const activeProperties = properties?.filter(p => p.status === 'disetujui').length || 0;
  const pendingBookings = allBookings?.filter(b => b.status === 'menunggu').length || 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Selamat Datang, {profile.full_name}!</h2>
          <p className="text-muted-foreground">Ini adalah ringkasan performa properti Anda bulan ini.</p>
        </div>
        <Link href="/pemilik/dashboard/properti/tambah">
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Tambah Properti
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Properti Aktif</CardTitle>
            <Building className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProperties}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dari total {properties?.length || 0} properti terdaftar
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pesanan</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{validBookings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingBookings} menunggu persetujuan
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Properti Saya */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Properti Saya</h3>
          </div>
          
          <Card className="border-none shadow-sm overflow-hidden">
            {properties && properties.length > 0 ? (
              properties.map((prop) => (
                <div key={prop.id} className="flex flex-col sm:flex-row border-b last:border-0">
                  <div className="w-full sm:w-48 h-32 bg-muted relative">
                    <img 
                      src={prop.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop"} 
                      alt={prop.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold">{prop.name}</h4>
                        <Badge variant={prop.status === 'disetujui' ? 'default' : prop.status === 'menunggu' ? 'secondary' : 'destructive'} className={prop.status === 'disetujui' ? 'bg-emerald-500' : ''}>
                          {prop.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {prop.city}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm font-medium text-primary">
                        Rp {prop.price_per_month.toLocaleString('id-ID')} / bln
                      </div>
                      <Link href={`/pemilik/dashboard/properti/${prop.id}`}>
                        <Button variant="outline" size="sm">Manajemen Kamar</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Building className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Belum ada properti terdaftar.</p>
                <Link href="/pemilik/dashboard/properti/tambah" className="text-primary mt-2 inline-block hover:underline">
                  Tambah Properti Pertama Anda
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Notifikasi Pesanan */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Pesanan Terbaru</h3>
          </div>
          
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              {bookings && bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking.id} className="p-4 border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold uppercase">
                          {booking.users?.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{booking.users?.full_name}</p>
                          <p className="text-xs text-muted-foreground">{booking.properties?.name}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="bg-background rounded-md p-2 text-xs border mb-3">
                      <span className="font-medium">Mulai:</span> {new Date(booking.start_date).toLocaleDateString('id-ID')} ({booking.duration_months} Bulan)
                    </div>
                    {booking.status === 'menunggu' && (
                      <DashboardBookingButtons bookingId={booking.id} />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Belum ada pesanan masuk.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
