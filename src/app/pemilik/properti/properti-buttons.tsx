"use client";

import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { deleteProperty } from "@/app/actions/property";
import { useRouter } from "next/navigation";

export function PropertiCardButtons({ propertyId }: { propertyId: string }) {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteProperty(propertyId);
    setLoading(false);
    
    if (res?.error) {
      alert(res.error);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(false);
      router.refresh();
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-blue-600 border-blue-200 hover:bg-blue-50" 
          title="Edit Properti"
          onClick={() => router.push(`/pemilik/dashboard/properti/edit/${propertyId}`)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-slate-600 border-slate-200 hover:bg-slate-50" 
          title="Lihat Halaman Properti"
          onClick={() => router.push(`/kos/${propertyId}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-red-600 border-red-200 hover:bg-red-50" 
          onClick={() => setShowDeleteConfirm(true)} 
          disabled={loading}
          title="Hapus Properti"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-background p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Hapus Properti?</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus properti ini beserta semua data yang terkait? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
                Kembali
              </Button>
              <Button variant="destructive" className="flex-1 rounded-xl" onClick={handleDelete} disabled={loading}>
                {loading ? 'Menghapus...' : 'Ya, Hapus'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
