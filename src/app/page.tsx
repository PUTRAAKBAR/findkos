import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Star, ShieldCheck, Clock, CreditCard, Building, Heart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Ambil 3 properti terbaru yang disetujui
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'disetujui')
    .order('created_at', { ascending: false })
    .limit(3);

  const popProperties = properties || [];

  // Hitung Mahasiswa
  const { count: studentCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'mahasiswa');

  // Hitung Kos Aktif
  const { count: activePropertiesCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'disetujui');

  // Hitung Kampus Unik
  const { data: campuses } = await supabase
    .from('properties')
    .select('nearest_campus')
    .eq('status', 'disetujui')
    .not('nearest_campus', 'is', null);
    
  const uniqueCampusesCount = campuses ? new Set(campuses.map(p => p.nearest_campus?.toLowerCase().trim())).size : 0;

  // Format angka
  const displayStudents = studentCount || 0;
  const displayProperties = activePropertiesCount || 0;
  const displayCampuses = uniqueCampusesCount || 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/90 to-primary text-primary-foreground py-20 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl">
            Cari Kos Lebih Cepat, Tepat, dan Pasti
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl">
            Temukan hunian impianmu di dekat kampus dengan transparansi harga dan fasilitas lengkap.
          </p>

          {/* Search Box */}
          <form action="/cari" className="w-full max-w-4xl bg-background text-foreground rounded-2xl shadow-xl p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                name="q"
                placeholder="Cari Kampus, Nama Kos, atau Lokasi..." 
                className="pl-10 h-12 w-full text-base bg-muted/50 border-none rounded-xl"
              />
            </div>
            <div className="w-full md:w-48 relative text-left">
              <Select defaultValue="Semua Tipe" name="type">
                <SelectTrigger className="w-full h-12 rounded-xl bg-muted/50 border-none px-4 shadow-none focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Semua Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semua Tipe">Semua Tipe</SelectItem>
                  <SelectItem value="Kos Putra">Kos Putra</SelectItem>
                  <SelectItem value="Kos Putri">Kos Putri</SelectItem>
                  <SelectItem value="Kos Campur">Kos Campur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto h-12 px-8 rounded-xl font-semibold text-base shrink-0">
              <Search className="w-5 h-5 mr-2" />
              Cari Sekarang
            </Button>
          </form>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 border-t border-primary-foreground/20 w-full max-w-3xl">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">{displayStudents}</div>
              <div className="text-sm font-medium text-primary-foreground/80">Mahasiswa</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">{displayProperties}</div>
              <div className="text-sm font-medium text-primary-foreground/80">Kos Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">{displayCampuses}</div>
              <div className="text-sm font-medium text-primary-foreground/80">Kampus</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Recommendations */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <Badge variant="outline" className="mb-2 text-primary border-primary/20 bg-primary/5">Unggulan</Badge>
              <h2 className="text-3xl font-bold tracking-tight">Rekomendasi Kos Populer</h2>
              <p className="text-muted-foreground mt-2">Kos pilihan dengan fasilitas lengkap dan harga bersaing.</p>
            </div>
            <Link href="/cari" className="hidden md:inline-flex text-primary font-medium hover:underline">
              Lihat Semua &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popProperties.map((property: any) => (
              <a href={`/kos/${property.id}`} key={property.id} className="block h-full">
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all group h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden bg-muted">
                    <img 
                      src={property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop"} 
                      alt={property.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-blue-500 capitalize">{property.type}</Badge>
                      <Badge className="bg-emerald-500">Tersedia</Badge>
                    </div>
                    <button className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background text-muted-foreground hover:text-red-500 transition-colors backdrop-blur-sm">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <CardContent className="p-5 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{property.name}</h3>
                      <div className={`flex items-center gap-1 ${property.rating_average ? 'text-amber-500' : 'text-muted-foreground'} shrink-0`}>
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium text-foreground">
                          {property.rating_average ? property.rating_average.toFixed(1) : "Baru"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mr-1 shrink-0" />
                      <span className="line-clamp-1">{property.address || property.location || "Lokasi tidak diketahui"}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">Rp {property.price_per_month?.toLocaleString('id-ID') || 0}</span>
                      <span className="text-sm text-muted-foreground">/ bulan</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-0 mt-auto">
                    <Button className="w-full" variant="outline">Lihat Detail</Button>
                  </CardFooter>
                </Card>
              </a>
            ))}
            {popProperties.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Belum ada properti kos yang tersedia.
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Button variant="ghost" className="w-full font-medium text-primary">
              Lihat Semua Kos
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Kenapa Memilih FINDKOS?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
            Kami menyediakan layanan pencarian kos terpadu yang menjamin kenyamanan dan keamanan transaksi Anda.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Info Akurat & Terverifikasi</h3>
              <p className="text-muted-foreground">
                Setiap pemilik kos wajib melakukan proses verifikasi oleh tim kami agar foto & fasilitas akurat.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Update Ketersediaan Real-Time</h3>
              <p className="text-muted-foreground">
                Tidak ada lagi chat ke pemilik kos hanya untuk tahu apakah kamar masih kosong.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Booking Cepat & Mudah</h3>
              <p className="text-muted-foreground">
                Pesan kamar incaranmu langsung dari platform dan bayar dengan berbagai metode pilihan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Owner */}
      <section className="py-12 md:py-24 container mx-auto px-4">
        <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative shadow-2xl">
          {/* Abstract blobs background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl" />
          
          <div className="md:w-1/2 relative z-10 text-center md:text-left">
            <Badge variant="outline" className="mb-4 bg-white/20 text-white border-none backdrop-blur-md">UNTUK PEMILIK KOS</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Punya Properti Kos? Daftarkan di FINDKOS Sekarang
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg max-w-lg">
              Jangkau ribuan mahasiswa pencari kos setiap harinya. Kelola properti dan reservasi dengan lebih mudah dan efisien.
            </p>
            <Link href="/daftar" className={buttonVariants({ size: "lg", variant: "secondary", className: "font-semibold px-8 h-12" })}>
              Daftar Sebagai Pemilik
            </Link>
          </div>
          
          <div className="md:w-1/2 relative z-10 flex justify-center">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="w-full max-w-sm aspect-video bg-background rounded-xl overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop" 
                  alt="Dashboard Preview" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-4">
                  <div className="bg-background/80 backdrop-blur-md rounded-lg p-3 w-full border border-border/50 flex items-center gap-3">
                    <Building className="text-primary w-8 h-8 shrink-0" />
                    <div>
                      <div className="text-foreground font-bold text-sm">Dashboard Pemilik</div>
                      <div className="text-muted-foreground text-xs">Kelola 5 properti aktif</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial / Story Section */}
      <section className="py-16 md:py-24 mb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 order-2 md:order-1 relative">
              <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop" 
                  alt="Mahasiswa belajar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background border p-6 rounded-2xl shadow-xl max-w-xs">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold text-foreground text-xl">4.9/5</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">Rating Kepuasan Mahasiswa</p>
              </div>
            </div>
            
            <div className="md:w-1/2 order-1 md:order-2 space-y-6">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">TENTANG FINDKOS</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Solusi Hunian Terbaik Untuk Masa Depan Akademismu
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                FINDKOS adalah platform digital terdepan yang didedikasikan untuk membantu mahasiswa Indonesia menemukan tempat tinggal yang aman, nyaman, dan strategis.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Kami percaya bahwa lingkungan hunian yang baik adalah kunci kesuksesan akademik. Dengan teknologi pemetaan terkini dan sistem review jujur, kami memastikan setiap langkah pencarian kos menjadi pengalaman yang menyenangkan.
              </p>
              
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                  <img 
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                    alt="Ahmad Fauzi" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold">Ahmad Fauzi</div>
                  <div className="text-sm text-muted-foreground">CEO FINDKOS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
