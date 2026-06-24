"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Heart, CheckCircle2 } from "lucide-react";
import { toggleFavorite } from "@/app/actions/favorite";
import { createBooking } from "@/app/actions/booking";
import { useRouter } from "next/navigation";

export function TopActions({ propertyId, initialFavorited }: { propertyId: string, initialFavorited: boolean }) {
  const [isFav, setIsFav] = useState(initialFavorited);
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Lihat kos ini!',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link berhasil disalin!");
      }
    } catch (err) {}
  };

  const handleFavorite = async () => {
    const previousFav = isFav;
    setIsFav(!isFav);
    const result = await toggleFavorite(propertyId);
    if (result.error) {
      setIsFav(previousFav);
      alert(result.error);
    }
  };

  return (
    <div className="flex items-center gap-3 w-full md:w-auto">
      <Button variant="outline" className="flex-1 md:flex-none" onClick={handleShare}>
        <Share2 className="w-4 h-4 mr-2" /> Bagikan
      </Button>
      <Button variant="outline" className={`flex-1 md:flex-none ${isFav ? 'text-red-500 bg-red-50 hover:text-red-600 hover:bg-red-100' : ''}`} onClick={handleFavorite}>
        <Heart className={`w-4 h-4 mr-2 ${isFav ? 'fill-current' : ''}`} /> {isFav ? 'Disimpan' : 'Simpan'}
      </Button>
    </div>
  );
}

export function BookingWidget({ property, ownerPhone }: { property: any, ownerPhone: string }) {
  const [duration, setDuration] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const totalPrice = property.price_per_month * duration;
  const adminFee = 25000;
  const grandTotal = totalPrice + adminFee;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createBooking(null, formData);
    setIsLoading(false);
    
    if (res?.error) {
      setErrorMessage(res.error);
      setErrorDialog(true);
    } else {
      setSuccessDialog(true);
    }
  };

  const safePhone = ownerPhone || "081234567890";
  const cleanPhone = safePhone.replace(/\D/g, '').replace(/^0/, '62');
  const waLink = `https://wa.me/${cleanPhone}?text=Halo, saya tertarik dengan kos ${property.name} di FINDKOS.`;

  return (
    <div className="sticky top-24">
      <Card className="shadow-lg border-primary/20">
        <CardContent className="p-6">
          <div className="mb-4">
            <span className="text-3xl font-bold text-primary">Rp {property.price_per_month.toLocaleString('id-ID')}</span>
            <span className="text-muted-foreground"> / bulan</span>
          </div>

          <form onSubmit={handleSubmit}>
            <input type="hidden" name="property_id" value={property.id} />
            
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label>Tanggal Masuk</Label>
                <Input type="date" name="start_date" className="h-12" required />
              </div>
              
              <div className="space-y-2">
                <Label>Durasi Sewa</Label>
                <select 
                  name="duration_months"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="1">1 Bulan</option>
                  <option value="3">3 Bulan</option>
                  <option value="6">6 Bulan</option>
                  <option value="12">1 Tahun</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 mb-6 p-4 bg-muted/50 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Harga {duration} Bulan</span>
                <span className="font-medium">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Biaya Layanan</span>
                <span className="font-medium">Rp {adminFee.toLocaleString('id-ID')}</span>
              </div>
              <hr className="my-2 border-dashed" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-bold mb-3" disabled={property.status !== 'disetujui' || isLoading}>
              {property.status === 'disetujui' ? (isLoading ? 'Memproses...' : 'Ajukan Sewa Sekarang') : 'Kamar Belum Tersedia'}
            </Button>
            
            <a href={waLink} target="_blank" rel="noreferrer" className="block w-full">
              <Button type="button" variant="outline" className="w-full h-12 text-base bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700">
                Chat Pemilik Kos
              </Button>
            </a>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Anda tidak akan dikenakan biaya sebelum pengajuan disetujui oleh pemilik kos.
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      {successDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-background p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Pesanan Berhasil!</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Pengajuan sewa Anda telah terkirim dan sedang menunggu persetujuan dari pemilik kos.
            </p>
            <Button size="lg" className="w-full font-semibold rounded-xl" onClick={() => router.push('/akun#pesanan')}>
              Lihat Riwayat Pesanan
            </Button>
          </div>
        </div>
      )}

      {/* Error Dialog */}
      {errorDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-background p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Tidak Dapat Memesan</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {errorMessage}
            </p>
            <Button variant="outline" size="lg" className="w-full font-semibold rounded-xl" onClick={() => setErrorDialog(false)}>
              Tutup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
