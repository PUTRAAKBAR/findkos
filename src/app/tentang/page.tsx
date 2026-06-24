import { Building2, Users, ShieldCheck, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TentangKamiPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary/5 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Menemukan Hunian Nyaman <br className="hidden md:block" />
            <span className="text-primary">Kini Lebih Mudah</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            FINDKOS hadir sebagai solusi terpercaya bagi mahasiswa perantau untuk mencari, menemukan, dan memesan kos idaman tanpa ribet.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000&auto=format&fit=crop" 
                alt="Tim Findkos" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Berawal dari Pengalaman Pribadi</h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Sebagai mantan mahasiswa perantau, kami sangat memahami betapa melelahkannya mencari kos. Harus datang dari satu tempat ke tempat lain, bertanya ke sana-kemari, hanya untuk menemukan bahwa kamar yang diincar sudah penuh atau tidak sesuai ekspektasi.
                </p>
                <p>
                  Dari keresahan itulah FINDKOS lahir. Kami membangun platform yang menjembatani pencari kos dengan pemilik properti, menghadirkan transparansi informasi, kemudahan pencarian dengan filter lengkap, serta sistem pemesanan online yang praktis.
                </p>
                <p>
                  Misi kami sederhana: Membantu setiap mahasiswa menemukan "rumah kedua" mereka dengan aman, nyaman, dan bebas stres.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="bg-muted/30 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Mengapa Memilih FINDKOS?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Kami berkomitmen memberikan layanan terbaik baik bagi pencari kos maupun mitra pemilik properti.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-background p-6 rounded-2xl shadow-sm border text-center">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Terverifikasi & Aman</h3>
              <p className="text-muted-foreground text-sm">Semua properti kos melewati proses verifikasi manual oleh tim kami untuk menjamin keabsahan data.</p>
            </div>

            <div className="bg-background p-6 rounded-2xl shadow-sm border text-center">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Data Real-time</h3>
              <p className="text-muted-foreground text-sm">Informasi ketersediaan kamar selalu diperbarui secara langsung oleh pemilik kos.</p>
            </div>

            <div className="bg-background p-6 rounded-2xl shadow-sm border text-center">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Komunitas Solid</h3>
              <p className="text-muted-foreground text-sm">Bergabunglah dengan ribuan mahasiswa lainnya dan bagikan ulasan pengalaman ngekos Anda.</p>
            </div>

            <div className="bg-background p-6 rounded-2xl shadow-sm border text-center">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Mitra Terpercaya</h3>
              <p className="text-muted-foreground text-sm">Membantu pemilik kos memasarkan properti mereka ke ribuan target pasar potensial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center bg-primary text-primary-foreground rounded-3xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Siap Menemukan Kos Impian Anda?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg">
            Mulai penjelajahan Anda sekarang dan nikmati kemudahan mencari tempat tinggal bersama FINDKOS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cari">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8">
                Cari Kos Sekarang
              </Button>
            </Link>
            <Link href="/daftar">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                Daftar Akun Baru
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
