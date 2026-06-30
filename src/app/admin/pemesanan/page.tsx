import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PemesananClient from "./pemesanan-client";

export default async function AdminPemesananPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all bookings for admin
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      users(full_name, phone, role),
      properties(name)
    `)
    .order('created_at', { ascending: false });

  return (
    <PemesananClient initialBookings={bookings || []} />
  );
}
