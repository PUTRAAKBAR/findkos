import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building, Plus, Search, MapPin, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { PropertiCardButtons } from "./properti-buttons";

export default async function PropertiSayaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'pemilik') redirect("/akun");

  // Ambil semua properti milik user ini
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Properti Saya</h2>
          <p className="text-muted-foreground">Kelola semua properti kos yang Anda daftarkan.</p>
        </div>
        <Link href="/pemilik/dashboard/properti/tambah">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Properti
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-background p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Cari nama properti..." className="pl-9" />
        </div>
        <select className="h-10 px-3 py-2 rounded-md border text-sm bg-background hidden sm:block">
          <option>Semua Status</option>
          <option>Tersedia</option>
          <option>Penuh</option>
          <option>Menunggu Verifikasi</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties && properties.length > 0 ? (
          properties.map((prop) => (
            <Card key={prop.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative h-48 bg-muted">
                <img 
                  src={prop.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop"} 
                  alt={prop.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={prop.status === 'disetujui' ? 'bg-emerald-500' : prop.status === 'menunggu' ? 'bg-amber-500' : 'bg-red-500'}>
                    {prop.status}
                  </Badge>
                  <Badge className="bg-blue-500 capitalize">{prop.type}</Badge>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg line-clamp-1">{prop.name}</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1 text-muted-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground flex items-center mb-4">
                  <MapPin className="w-3.5 h-3.5 mr-1" /> {prop.city}
                </p>
                
                <div className="bg-muted/50 p-3 rounded-lg mb-4 flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Harga</span>
                  <span className="font-bold text-primary">Rp {prop.price_per_month.toLocaleString('id-ID')}</span>
                </div>

                  <PropertiCardButtons propertyId={prop.id} />
              </CardContent>
            </Card>
          ))
        ) : null}

        {/* Card Placeholder (Tambah Properti) */}
        <Link href="/pemilik/dashboard/properti/tambah">
          <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl bg-muted/10 flex flex-col items-center justify-center min-h-[380px] h-full hover:bg-muted/30 transition-colors cursor-pointer group text-muted-foreground hover:text-primary">
            <div className="w-16 h-16 rounded-full bg-background border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <Plus className="w-8 h-8" />
            </div>
            <p className="font-bold">Daftarkan Properti Baru</p>
            <p className="text-sm text-center px-8 mt-2">Perluas jangkauan kos Anda ke ribuan mahasiswa.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
