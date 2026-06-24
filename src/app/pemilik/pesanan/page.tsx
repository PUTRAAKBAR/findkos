import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PesananClient from "./pesanan-client";

export default async function PesananPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Cek profile untuk memastikan user adalah pemilik
  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();

  if (profile?.role !== 'pemilik') {
    redirect("/akun"); // Lempar ke halaman mhs
  }

  // Fetch Pesanan yang terkait dengan properti user
  // Supabase RLS policy ensures owner only sees bookings for their properties
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      users(full_name, phone, role),
      properties(name)
    `)
    .order('created_at', { ascending: false });

  return (
    <PesananClient initialBookings={bookings || []} />
  );
}
