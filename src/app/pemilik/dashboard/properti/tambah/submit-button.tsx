"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full h-12 text-base mt-8" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Menyimpan...
        </>
      ) : (
        <>
          <Check className="mr-2 h-4 w-4" />
          Simpan & Ajukan Verifikasi
        </>
      )}
    </Button>
  );
}
