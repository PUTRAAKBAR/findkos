import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import VerifikasiClient from "./verifikasi-client";

export default async function AdminVerifikasiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch ALL properties with their owners
  const { data: allProperties } = await supabase
    .from('properties')
    .select(`
      *,
      owner:users(full_name, phone)
    `)
    .order('created_at', { ascending: false });

  return (
    <VerifikasiClient initialProperties={allProperties || []} />
  );
}
