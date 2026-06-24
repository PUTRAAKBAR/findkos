"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { updateBookingStatus } from "@/app/actions/booking";
import { useRouter } from "next/navigation";

export function DashboardBookingButtons({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (status: 'disetujui' | 'ditolak') => {
    setLoading(true);
    const res = await updateBookingStatus(bookingId, status);
    setLoading(false);
    if (res?.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        className="w-full bg-emerald-500 hover:bg-emerald-600" 
        onClick={() => handleAction('disetujui')}
        disabled={loading}
      >
        Terima
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="w-full text-red-500 hover:text-red-600" 
        onClick={() => handleAction('ditolak')}
        disabled={loading}
      >
        Tolak
      </Button>
    </div>
  );
}
