"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, XCircle } from "lucide-react";
import { updateBookingStatus } from "@/app/actions/booking";
import { useRouter } from "next/navigation";

export function BayarButton({ bookingId, className }: { bookingId: string, className?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = async () => {
    setLoading(true);
    const res = await updateBookingStatus(bookingId, 'dibayar');
    setLoading(false);
    if (res?.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  };

  return (
    <Button onClick={handlePay} variant="outline" size="sm" className={className} disabled={loading}>
      <CreditCard className="w-4 h-4 mr-2"/> {loading ? 'Memproses...' : 'Bayar Sekarang'}
    </Button>
  );
}

export function BatalButton({ bookingId, className }: { bookingId: string, className?: string }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setLoading(true);
    const res = await updateBookingStatus(bookingId, 'dibatalkan');
    setLoading(false);
    
    if (res?.error) {
      alert(res.error);
      setShowConfirm(false);
    } else {
      setShowConfirm(false);
      router.refresh();
    }
  };

  return (
    <>
      <Button onClick={() => setShowConfirm(true)} variant="ghost" size="sm" className={`text-red-500 hover:text-red-600 hover:bg-red-50 ${className}`} disabled={loading}>
        {loading ? 'Membatalkan...' : 'Batalkan'}
      </Button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-background p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Batalkan Pesanan?</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Apakah Anda yakin ingin membatalkan pesanan kos ini? Tindakan ini tidak dapat dikembalikan.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowConfirm(false)} disabled={loading}>
                Kembali
              </Button>
              <Button variant="destructive" className="flex-1 rounded-xl" onClick={handleCancel} disabled={loading}>
                {loading ? 'Memproses...' : 'Ya, Batalkan'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
