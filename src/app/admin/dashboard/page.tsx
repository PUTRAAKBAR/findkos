import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminVerifyButtons } from "./verify-buttons"; // Client component for actions

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  // if (profile?.role !== 'admin') redirect("/akun"); // DINONAKTIFKAN SEMENTARA UNTUK TESTING MVP

  // Fetch pending properties
  const { data: pendingProperties } = await supabase
    .from('properties')
    .select(`
      *,
      users(full_name, phone)
    `)
    .eq('status', 'menunggu')
    .order('created_at', { ascending: false });

  // Fetch stats (simple counts for MVP)
  const { count: activeCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'disetujui');

  const { count: userCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'mahasiswa');

  const { count: ownerCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'pemilik');

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Admin</h2>
          <p className="text-muted-foreground">Pantau kesehatan platform dan setujui pendaftaran kos baru.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Kos Aktif</CardTitle>
            <Building className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mahasiswa Aktif</CardTitle>
            <Users className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mitra Pemilik</CardTitle>
            <Users className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownerCount || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-amber-500">Antrean Verifikasi</CardTitle>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{pendingProperties?.length || 0}</div>
            <p className="text-xs text-amber-600 mt-1">Perlu ditinjau</p>
          </CardContent>
        </Card>
      </div>

      {/* Verification Queue */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Antrean Verifikasi Properti</h3>
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-muted/50 uppercase border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nama Properti</th>
                    <th className="px-6 py-4 font-medium">Pemilik</th>
                    <th className="px-6 py-4 font-medium">Lokasi</th>
                    <th className="px-6 py-4 font-medium">Tanggal Daftar</th>
                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProperties && pendingProperties.length > 0 ? (
                    pendingProperties.map((prop) => (
                      <tr key={prop.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-6 py-4 font-medium">{prop.name}</td>
                        <td className="px-6 py-4">{prop.users?.full_name}</td>
                        <td className="px-6 py-4">{prop.city}</td>
                        <td className="px-6 py-4">{new Date(prop.created_at).toLocaleDateString('id-ID')}</td>
                        <td className="px-6 py-4 flex justify-end gap-2">
                          <AdminVerifyButtons propertyId={prop.id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        Tidak ada antrean verifikasi saat ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
