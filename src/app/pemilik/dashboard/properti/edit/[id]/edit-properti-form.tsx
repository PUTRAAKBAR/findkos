"use client";

import { useActionState, useState } from "react";
import { updateProperty } from "@/app/actions/property";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Upload, Info, AlertCircle, Check } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

function SubmitEditButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
    </Button>
  );
}

export function EditPropertiForm({ property }: { property: any }) {
  const updatePropertyWithId = updateProperty.bind(null, property.id);
  const [state, formAction] = useActionState(updatePropertyWithId, undefined);

  const initialBanner = property.images?.[0] || null;
  const initialDetails = property.images?.slice(1) || [];

  const [bannerPreview, setBannerPreview] = useState<string | null>(initialBanner);
  const [detailPreviews, setDetailPreviews] = useState<string[]>(initialDetails);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    } else {
      setBannerPreview(initialBanner); // revert
    }
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 9) {
      alert("Maksimal 9 foto detail.");
      e.target.value = "";
      return;
    }
    const previews = files.map(file => URL.createObjectURL(file));
    // When previewing, we show initial details + new details
    setDetailPreviews([...initialDetails, ...previews].slice(0, 9));
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="keptImages" value={JSON.stringify(property.images || [])} />
      
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
          <Input id="name" name="name" defaultValue={property.name || ""} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipe Kos</Label>
            <select 
              id="type" 
              name="type" 
              defaultValue={property.type || ""}
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
            <Input id="price_per_month" name="price_per_month" type="number" defaultValue={property.price_per_month || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="available_rooms">Jumlah Kamar Kosong</Label>
            <Input id="available_rooms" name="available_rooms" type="number" defaultValue={property.available_rooms ?? 0} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi Lengkap</Label>
          <Textarea 
            id="description" 
            name="description" 
            defaultValue={property.description || ""}
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
            <Input id="city" name="city" defaultValue={property.city || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facilities">Fasilitas Utama (Pisahkan dengan koma)</Label>
            <Input id="facilities" name="facilities" defaultValue={property.facilities?.join(", ") || ""} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Alamat Lengkap</Label>
          <Textarea id="address" name="address" defaultValue={property.address || ""} required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="map_url">Tautan Google Maps</Label>
          <Input key={property.map_url || "map"} id="map_url" name="map_url" type="url" defaultValue={property.map_url || ""} placeholder="https://maps.google.com/..." />
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <Info className="w-3 h-3 mr-1" />
            Buka Google Maps, cari lokasi kos Anda, klik "Bagikan", lalu salin tautan.
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
          <Label htmlFor="bannerImage">Foto Utama / Banner (Kosongkan jika tidak ingin mengubah)</Label>
          <Input id="bannerImage" name="bannerImage" type="file" accept="image/*" onChange={handleBannerChange} />
          {bannerPreview && (
            <div className="mt-2 w-full h-48 relative rounded-xl overflow-hidden border">
              <img src={bannerPreview} alt="Banner Preview" className="object-cover w-full h-full" />
            </div>
          )}
        </div>

        <div className="space-y-2 pt-4">
          <Label htmlFor="detailImages">Tambah Foto Detail Baru (Maksimal 9 foto)</Label>
          <Input id="detailImages" name="detailImages" type="file" accept="image/*" multiple onChange={handleDetailChange} />
          <p className="text-xs text-muted-foreground">Pilih foto baru untuk ditambahkan ke galeri. Jika Anda mengunggah foto baru, foto tersebut akan ditambahkan ke foto detail yang sudah ada.</p>
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

      <SubmitEditButton />
    </form>
  );
}
