'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// Update status kos (Admin menyetujui / menolak kos)
export async function updatePropertyStatus(propertyId: string, status: 'disetujui' | 'ditolak') {
  const supabase = await createClient()

  // Verifikasi role admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  const { data: userProfile } = await supabase.from('users').select('role').eq('id', user.id).single()
  // if (userProfile?.role !== 'admin') {
  //   return { error: 'Akses ditolak. Anda bukan admin.' }
  // }

  const { error } = await supabase
    .from('properties')
    .update({ status })
    .eq('id', propertyId)

  if (error) {
    console.error('Error updating property status:', error)
    return { error: 'Gagal memperbarui status properti.' }
  }

  revalidatePath('/admin/dashboard/verifikasi')
  revalidatePath('/cari') // Update halaman list kos
  
  return { success: true, message: `Status kos berhasil diubah menjadi ${status}.` }
}
