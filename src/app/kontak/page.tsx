"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

export default function KontakPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-muted/30 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Kontak Kami</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Punya pertanyaan seputar kos atau butuh bantuan teknis? Tim FINDKOS siap membantu Anda mendapatkan hunian impian dengan nyaman.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:w-1/2">
            <Card className="border-none shadow-xl bg-background">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-2">Kirim Pesan</h2>
                <p className="text-muted-foreground mb-8">Lengkapi formulir di bawah ini dan kami akan merespons dalam 24 jam.</p>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input id="name" placeholder="Contoh: Budi Susanto" className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Aktif</Label>
                      <Input id="email" type="email" placeholder="budi@email.com" className="bg-muted/50" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subjek</Label>
                    <Input id="subject" placeholder="Apa yang ingin Anda tanyakan?" className="bg-muted/50" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Isi Pesan</Label>
                    <textarea 
                      id="message" 
                      rows={5}
                      placeholder="Tuliskan detail pertanyaan atau bantuan yang Anda butuhkan di sini..."
                      className="w-full flex min-h-[80px] rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  
                  <Button size="lg" className="w-full">
                    <Send className="w-4 h-4 mr-2" /> Kirim Pesan Sekarang
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="lg:w-1/2 space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-6">Informasi Bantuan</h2>
              <p className="text-muted-foreground mb-8">
                Hubungi kami melalui saluran berikut untuk respon yang lebih cepat.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Email Dukungan</h4>
                    <p className="text-muted-foreground">support@findkos.id</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Telepon / WhatsApp</h4>
                    <p className="text-muted-foreground">+62 21 1234 5678</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Lokasi Kantor</h4>
                    <p className="text-muted-foreground">SCBD, Jl. Jendral Sudirman No. 52, Jakarta Selatan, 12190</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Chat Widget */}
            <div className="bg-muted p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold">Butuh respon kilat?</h4>
                <p className="text-sm text-muted-foreground">Chat langsung dengan tim CS kami.</p>
              </div>
              <Button className="shrink-0 bg-green-500 hover:bg-green-600 text-white border-none">
                <MessageCircle className="w-4 h-4 mr-2" /> Live Chat
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4">BANTUAN CEPAT</Badge>
            <h2 className="text-3xl font-bold tracking-tight">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-muted-foreground mt-2">Cari jawaban cepat untuk kendala yang sering ditemui oleh pengguna FINDKOS.</p>
          </div>

          <Accordion className="w-full bg-background rounded-2xl border px-6">
            <AccordionItem value="item-1" className="border-b py-2">
              <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary">
                Bagaimana cara memesan (booking) kos di FINDKOS?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Pilih kos yang Anda inginkan, klik tombol "Hubungi Pemilik" atau "Booking". Pastikan Anda sudah login untuk melacak status pemesanan Anda di dashboard akun. Tim kami atau pemilik kos akan mengonfirmasi ketersediaan dalam waktu maksimal 1x24 jam.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-b py-2">
              <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary">
                Apakah ada biaya tambahan saat menggunakan layanan ini?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Tidak, layanan pencarian dan pemesanan kos melalui FINDKOS sepenuhnya gratis untuk mahasiswa. Biaya yang Anda bayarkan adalah murni biaya sewa yang ditetapkan oleh pemilik kos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-b py-2">
              <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary">
                Bagaimana jika kos tidak sesuai dengan foto di aplikasi?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Semua kos dengan badge "Terverifikasi" telah disurvei oleh tim FINDKOS. Jika Anda menemukan ketidaksesuaian saat tiba di lokasi, Anda dapat melaporkannya melalui halaman Kontak dan kami akan membantu memediasi pembatalan atau refund sesuai syarat dan ketentuan yang berlaku.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-none py-2">
              <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary">
                Apakah saya bisa mendaftarkan kos milik orang tua saya?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Tentu bisa. Silakan klik menu "Daftar Sebagai Pemilik" dan lengkapi data profil serta informasi properti. Anda akan bertindak sebagai pengelola kos tersebut di sistem kami.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Map Section (Static Image for Mockup) */}
      <section className="py-12 container mx-auto px-4 max-w-6xl mb-12">
        <div className="w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden relative shadow-md bg-muted">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" 
            alt="Peta Lokasi" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-md p-4 rounded-xl border shadow-lg max-w-sm flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold">Kantor Pusat FINDKOS</div>
              <div className="text-xs text-muted-foreground">Sudirman Central Business District, Jakarta</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
