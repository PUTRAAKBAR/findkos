"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { updatePropertyStatus } from "@/app/actions/admin";
import { useTransition } from "react";

export function AdminVerifyButtons({ propertyId }: { propertyId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleVerify = (status: 'disetujui' | 'ditolak') => {
    startTransition(async () => {
      await updatePropertyStatus(propertyId, status);
    });
  };

  if (isPending) {
    return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;
  }

  return (
    <>
      <Button 
        onClick={() => handleVerify('disetujui')}
        size="sm" 
        variant="outline" 
        className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
      >
        <CheckCircle2 className="w-4 h-4 mr-1" /> Setujui
      </Button>
      <Button 
        onClick={() => handleVerify('ditolak')}
        size="sm" 
        variant="outline" 
        className="text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        <XCircle className="w-4 h-4 mr-1" /> Tolak
      </Button>
    </>
  );
}
