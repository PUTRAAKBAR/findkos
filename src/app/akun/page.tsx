import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Calendar, Clock, CreditCard, LogOut, CheckCircle2, XCircle, Info } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/auth/actions";
import { updateProfile } from "@/app/actions/user";
import { BayarButton, BatalButton } from "./booking-buttons";

export default async function AkunPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, properties(name, city, images)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Beranda</Link> &gt; <span className="text-foreground">Akun Saya</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-2">
          <div className="flex flex-col items-center p-6 bg-muted/30 rounded-2xl border border-dashed mb-6 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <User className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-lg">{profile?.full_name || "Pengguna"}</h3>
            <p className="text-sm text-muted-foreground capitalize">{profile?.role || "Mahasiswa"}</p>
          </div>

          <nav className="flex flex-col gap-1">
            <Link href="#profil" className="w-full">
              <Button variant="secondary" className="justify-start w-full font-semibold">
                <User className="w-4 h-4 mr-2" /> Profil
              </Button>
            </Link>
            <Link href="#pesanan" className="w-full">
              <Button variant="ghost" className="justify-start w-full text-muted-foreground hover:text-foreground">
                <Calendar className="w-4 h-4 mr-2" /> Pesanan Saya
              </Button>
            </Link>
            <form action={logout}>
              <Button type="submit" variant="ghost" className="justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50 mt-4">
                <LogOut className="w-4 h-4 mr-2" /> Keluar
              </Button>
            </form>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-8">
          
          {/* Profile Section */}
          <Card className="border-none shadow-sm" id="profil" style={{ scrollMarginTop: "100px" }}>
            <CardHeader>
              <CardTitle>Data Pribadi</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={async (formData) => { "use server"; await updateProfile(formData); }} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input key={profile?.full_name || "name"} name="full_name" defaultValue={profile?.full_name || ""} />
                </div>
                <div className="space-y-2">
                  <Label>Alamat Email</Label>
                  <Input defaultValue={user.email || ""} type="email" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Nomor Telepon (WhatsApp)</Label>
                  <Input key={profile?.phone || "phone"} name="phone" defaultValue={profile?.phone || ""} type="tel" />
                </div>
                <Button type="submit" className="mt-4">Simpan Perubahan</Button>
              </form>
            </CardContent>
          </Card>

          {/* Booking History */}
          <div className="space-y-4" id="pesanan" style={{ scrollMarginTop: "100px" }}>
            <h3 className="text-xl font-bold">Riwayat Pesanan Kos</h3>
            
            <div className="space-y-4">
              {!bookings || bookings.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                  <Calendar className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg">Belum ada pesanan</h3>
                  <p className="text-muted-foreground text-sm">Anda belum memesan kos apa pun.</p>
                </div>
              ) : (
                bookings.map((booking: any) => {
                  const propertyName = booking.properties?.name || "Properti Dihapus";
                  const propertyCity = booking.properties?.city || "-";
                  const imageUrl = booking.properties?.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop";
                  
                  return (
                    <Card key={booking.id} className="border-none shadow-sm overflow-hidden">
                      <div className={`flex flex-col sm:flex-row ${booking.status === 'ditolak' || booking.status === 'dibatalkan' ? 'opacity-60' : ''}`}>
                        <div className="w-full sm:w-48 h-32 bg-muted relative">
                          <img 
                            src={imageUrl} 
                            alt={propertyName} 
                            className={`w-full h-full object-cover ${booking.status === 'ditolak' || booking.status === 'dibatalkan' || booking.status === 'menunggu' ? 'grayscale' : ''}`}
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`font-bold ${booking.status === 'ditolak' || booking.status === 'dibatalkan' ? 'text-muted-foreground' : ''}`}>{propertyName}</h4>
                              
                              {booking.status === 'disetujui' && (
                                <Badge className="bg-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Disetujui</Badge>
                              )}
                              {booking.status === 'dibayar' && (
                                <Badge className="bg-blue-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Sudah Dibayar</Badge>
                              )}
                              {booking.status === 'selesai' && (
                                <Badge className="bg-gray-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Selesai</Badge>
                              )}
                              {booking.status === 'menunggu' && (
                                <Badge variant="outline" className="text-amber-500 border-amber-500 bg-amber-50 flex items-center gap-1"><Clock className="w-3 h-3" /> Menunggu</Badge>
                              )}
                              {booking.status === 'ditolak' && (
                                <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Ditolak</Badge>
                              )}
                              {booking.status === 'dibatalkan' && (
                                <Badge variant="secondary" className="flex items-center gap-1"><Info className="w-3 h-3" /> Dibatalkan</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="w-3.5 h-3.5 mr-1" /> {propertyCity}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 border-t pt-3">
                            <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:gap-4">
                              <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1"/> Mulai: {new Date(booking.start_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</span>
                              <span className="flex items-center mt-1 sm:mt-0"><Clock className="w-3.5 h-3.5 mr-1"/> Durasi: {booking.duration_months} Bulan</span>
                            </div>
                            
                            {booking.status === 'disetujui' && (
                              <BayarButton bookingId={booking.id} className="hidden sm:flex" />
                            )}
                            
                            {booking.status === 'menunggu' && (
                              <BatalButton bookingId={booking.id} className="hidden sm:flex" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {booking.status === 'disetujui' && (
                        <div className="p-3 sm:hidden border-t bg-muted/30">
                          <BayarButton bookingId={booking.id} className="w-full" />
                        </div>
                      )}
                      {booking.status === 'menunggu' && (
                        <div className="p-3 sm:hidden border-t bg-muted/30">
                          <BatalButton bookingId={booking.id} className="w-full" />
                        </div>
                      )}
                    </Card>
                  )
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
