import { createClient } from "@/utils/supabase/server";
import CariKosClient from "./client-page";

export default async function CariKosPage(props: { searchParams: Promise<{ q?: string, type?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  // Ambil semua properti yang disetujui
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'disetujui')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Fetch properties error:", error);
  }

  return <CariKosClient initialProperties={properties || []} initialQuery={searchParams.q || ""} initialType={searchParams.type || "Semua Tipe"} />;
}
