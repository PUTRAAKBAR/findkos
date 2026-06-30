import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Star, Heart, Check, Share2, Wifi, Wind, Map, Car, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import { TopActions, BookingWidget } from "./client-actions";
import { PhotoGallery } from "./photo-gallery";
import { RealtimeRoomsBadge } from "./realtime-rooms-badge";

export default async function DetailKosPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;

  const { data: property, error } = await supabase
    .from('properties')
    .select('*, owner:users(full_name, phone)')
    .eq('id', resolvedParams.id)
    .single();

  if (error) {
    console.error("Fetch property error:", error);
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Kos Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-8">Maaf, kos yang Anda cari tidak ada atau telah dihapus.</p>
        <Link href="/cari">
          <Button>Kembali ke Pencarian</Button>
        </Link>
      </div>
    );
  }

  // Cek status favorit jika user login
  let isFavorited = false;
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: fav } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', property.id)
      .single();
    if (fav) isFavorited = true;
  }

  // Siapkan data placeholder untuk MVP
  const available = property.status === 'disetujui';
  const availableRooms = property.available_rooms || 0;
  const images = property.images && property.images.length > 0 
    ? property.images 
    : [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1598928506311-c55d43958bb1?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1505691938895-1758d7def511?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
      ];
  
  // Format fasilitas
  const facilityIcons: Record<string, any> = {
    'wifi': <Wifi className="w-5 h-5" />,
    'ac': <Wind className="w-5 h-5" />,
    'kamar mandi dalam': <ShieldCheck className="w-5 h-5" />,
    'parkir': <Car className="w-5 h-5" />
  };
  
  const facilities = (property.facilities || []).map((fac: string) => ({
    name: fac,
    icon: facilityIcons[fac.toLowerCase()] || <Check className="w-5 h-5" />
  }));


  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Beranda</Link> &gt;{" "}
        <Link href="/cari" className="hover:text-primary transition-colors">Cari Kos</Link> &gt;{" "}
        <span className="text-foreground">{property.name}</span>
      </div>

      {/* Header (Title & Actions) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-500 hover:bg-blue-600 capitalize">{property.type}</Badge>
            <RealtimeRoomsBadge 
              propertyId={property.id} 
              initialRooms={availableRooms} 
              isAvailable={available} 
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{property.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{property.address}, {property.city}</span>
            </div>
            <div className={`flex items-center gap-1 ${property.rating_average ? 'text-amber-500' : 'text-muted-foreground'} font-medium`}>
              <Star className="w-4 h-4 fill-current" />
              {property.rating_average ? (
                <span className="text-foreground">{property.rating_average.toFixed(1)}</span>
              ) : (
                <span className="text-sm">Baru</span>
              )}
            </div>
          </div>
        </div>

        <TopActions propertyId={property.id} initialFavorited={isFavorited} />
      </div>

      {/* Image Gallery */}
      <PhotoGallery images={images} />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Details) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Deskripsi */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Tentang Kos Ini</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {property.description || "Belum ada deskripsi."}
            </p>
          </section>

          <hr />

          {/* Fasilitas */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Fasilitas Tersedia</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              {facilities.map((fac: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="text-primary bg-primary/10 p-2 rounded-lg">
                    {fac.icon}
                  </div>
                  <span className="font-medium text-sm md:text-base capitalize">{fac.name}</span>
                </div>
              ))}
            </div>
          </section>

          <hr />

          {/* Map Placement */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Lokasi</h2>
            <p className="text-muted-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> {property.address}, {property.city}
            </p>
            <div className="w-full h-[300px] bg-muted rounded-2xl relative overflow-hidden flex items-center justify-center border">
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-6.89148,107.6106&zoom=15&size=800x400&sensor=false')] bg-cover bg-center opacity-50 grayscale" />
              <div className="z-10 flex flex-col items-center">
                <div className="bg-background p-3 rounded-full shadow-lg mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                {property.map_url ? (
                  <a href={property.map_url} target="_blank" rel="noreferrer">
                    <Button className="shadow-md shadow-black/10 px-8">Buka di Peta</Button>
                  </a>
                ) : (
                  <Button variant="secondary" className="shadow-md shadow-black/10 px-8 opacity-70 cursor-not-allowed">
                    Peta Belum Tersedia
                  </Button>
                )}
              </div>
            </div>
          </section>

        </div>

        {/* Right Column (Sticky Booking Widget) */}
        <div>
          <BookingWidget property={property} ownerPhone={property.owner?.phone || property.users?.phone || ""} />
        </div>
      </div>
    </div>
  );
}
