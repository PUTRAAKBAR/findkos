import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Settings } from "lucide-react";
import { updateProfile } from "@/app/actions/user";

export default async function PengaturanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Cek apakah user adalah pemilik
  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
  if (profile?.role !== 'pemilik') {
    redirect("/akun");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pengaturan</h2>
          <p className="text-muted-foreground">Kelola informasi profil dan pengaturan akun Anda.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Data Pribadi
          </CardTitle>
          <CardDescription>Perbarui nama dan nomor WhatsApp Anda agar mudah dihubungi penyewa.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={async (formData) => { "use server"; await updateProfile(formData); }} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input key={profile?.full_name || "name"} id="full_name" name="full_name" defaultValue={profile?.full_name || ""} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input key={user.email || "email"} id="email" type="email" defaultValue={user.email || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email tidak dapat diubah.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon (WhatsApp)</Label>
              <Input key={profile?.phone || "phone"} id="phone" name="phone" type="tel" defaultValue={profile?.phone || ""} required placeholder="Misal: 081234567890" />
            </div>
            
            <Button type="submit" className="mt-4 w-full">Simpan Perubahan</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
