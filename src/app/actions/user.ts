'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Anda harus login.' }

  const full_name = formData.get('full_name') as string
  const phone = formData.get('phone') as string
  
  if (!full_name || !phone) {
    return { error: 'Semua field wajib diisi.' }
  }

  const { error } = await supabase
    .from('users')
    .update({ full_name, phone })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    return { error: 'Gagal menyimpan profil.' }
  }

  revalidatePath('/akun')
  revalidatePath('/pemilik/pengaturan')
  return { success: true, message: 'Profil berhasil diperbarui.' }
}
