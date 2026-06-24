import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addProperty } from "@/app/actions/property";
import { Building, MapPin, Upload, Info, Check } from "lucide-react";
import Link from "next/link";
import { TambahPropertiForm } from "./tambah-properti-form";

export default async function TambahPropertiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Cek apakah user adalah pemilik
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'pemilik') {
    redirect("/akun");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tambah Properti Baru</h2>
          <p className="text-muted-foreground">Isi detail kos yang ingin Anda sewakan.</p>
        </div>
        <Link href="/pemilik/dashboard">
          <Button variant="outline">Batal</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            Informasi Dasar
          </CardTitle>
          <CardDescription>Detail utama mengenai kos Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <TambahPropertiForm />
        </CardContent>
      </Card>
    </div>
  );
}
