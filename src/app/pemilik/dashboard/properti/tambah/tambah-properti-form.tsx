"use client";

import { useActionState, useState } from "react";
import { addProperty } from "@/app/actions/property";
import { SubmitButton } from "./submit-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building, MapPin, Upload, Info, AlertCircle, Check } from "lucide-react";

export function TambahPropertiForm() {
  const [state, formAction] = useActionState(addProperty, undefined);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [detailPreviews, setDetailPreviews] = useState<string[]>([]);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    } else {
      setBannerPreview(null);
    }
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 9) {
      alert("Maksimal 9 foto detail.");
      e.target.value = "";
      setDetailPreviews([]);
      return;
    }
    const previews = files.map(file => URL.createObjectURL(file));
    setDetailPreviews(previews);
  };

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4" />
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-emerald-200">
          <Check className="w-4 h-4" />
          {state.message}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Kos</Label>
          <Input id="name" name="name" placeholder="Misal: Kos Ganesha Putra" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipe Kos</Label>
            <select 
              id="type" 
              name="type" 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Pilih Tipe</option>
              <option value="putra">Putra</option>
              <option value="putri">Putri</option>
              <option value="campur">Campur</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price_per_month">Harga per Bulan (Rp)</Label>
            <Input id="price_per_month" name="price_per_month" type="number" placeholder="Misal: 1500000" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="available_rooms">Jumlah Kamar Kosong</Label>
            <Input id="available_rooms" name="available_rooms" type="number" placeholder="Misal: 5" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi Lengkap</Label>
          <Textarea 
            id="description" 
            name="description" 
            placeholder="Ceritakan keunggulan kos Anda, aturan jam malam, dll." 
            className="min-h-[100px]"
          />
        </div>
      </div>

      <hr className="my-6" />

      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Lokasi & Fasilitas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Kota</Label>
            <Input id="city" name="city" placeholder="Misal: Bandung" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facilities">Fasilitas Utama (Pisahkan dengan koma)</Label>
            <Input id="facilities" name="facilities" placeholder="WiFi, AC, Kasur, Lemari" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Alamat Lengkap</Label>
          <Textarea id="address" name="address" placeholder="Jl. Contoh No. 123..." required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="map_url">Tautan Google Maps</Label>
          <Input id="map_url" name="map_url" type="url" placeholder="https://maps.google.com/..." />
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <Info className="w-3 h-3 mr-1" />
            Buka Google Maps, cari lokasi kos Anda, klik "Bagikan", lalu salin tautan (opsional tapi sangat disarankan).
          </p>
        </div>
      </div>

      <hr className="my-6" />

      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          Foto Properti
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="bannerImage">Foto Utama / Banner (Wajib)</Label>
          <Input id="bannerImage" name="bannerImage" type="file" accept="image/*" onChange={handleBannerChange} required />
          {bannerPreview && (
            <div className="mt-2 w-full h-48 relative rounded-xl overflow-hidden border">
              <img src={bannerPreview} alt="Banner Preview" className="object-cover w-full h-full" />
            </div>
          )}
        </div>

        <div className="space-y-2 pt-4">
          <Label htmlFor="detailImages">Foto Detail (Opsional, Maksimal 9 foto)</Label>
          <Input id="detailImages" name="detailImages" type="file" accept="image/*" multiple onChange={handleDetailChange} />
          {detailPreviews.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {detailPreviews.map((src, i) => (
                <div key={i} className="aspect-square relative rounded-md overflow-hidden border">
                  <img src={src} alt={`Detail ${i+1}`} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
