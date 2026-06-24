import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import Link from "next/link";
import { EditPropertiForm } from "./edit-properti-form";

export default async function EditPropertiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
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

  // Ambil data properti
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (!property || property.owner_id !== user.id) {
    redirect("/pemilik/properti");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Properti</h2>
          <p className="text-muted-foreground">Ubah detail kos yang Anda sewakan.</p>
        </div>
        <Link href="/pemilik/properti">
          <Button variant="outline">Kembali</Button>
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
          <EditPropertiForm property={property} />
        </CardContent>
      </Card>
    </div>
  );
}
