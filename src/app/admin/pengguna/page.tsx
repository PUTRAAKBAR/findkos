import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { PenggunaClient } from "./pengguna-client";

export default async function AdminPenggunaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch all users
  const { data: allUsers } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <PenggunaClient initialUsers={allUsers || []} />
  );
}
