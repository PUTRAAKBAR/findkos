'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// Toggle Favorit (Tambah / Hapus)
export async function toggleFavorite(propertyId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Anda harus login untuk menyimpan favorit.' }

  // Cek apakah sudah ada di favorit
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .single()

  if (existing) {
    // Jika sudah ada, hapus
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existing.id)

    if (error) return { error: 'Gagal menghapus favorit.' }
    
    revalidatePath('/favorit')
    return { success: true, isFavorite: false, message: 'Kos dihapus dari favorit.' }
  } else {
    // Jika belum ada, tambahkan
    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        property_id: propertyId
      })

    if (error) return { error: 'Gagal menambahkan favorit.' }
    
    revalidatePath('/favorit')
    return { success: true, isFavorite: true, message: 'Kos ditambahkan ke favorit.' }
  }
}
