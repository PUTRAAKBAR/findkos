'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Ambil data dari form
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan password harus diisi' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/') // Nanti bisa diubah redirect ke dashboard sesuai rolenya
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const role = formData.get('role') as string // 'mahasiswa' atau 'pemilik'
  const phone = formData.get('phone') as string
  
  if (!email || !password || !fullName || !role || !phone) {
    return { error: 'Semua field harus diisi termasuk nomor telepon' }
  }

  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter' }
  }

  // 1. Daftarkan user ke Supabase Auth
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  // 2. Jika berhasil, masukkan data tambahan ke tabel public.users
  if (data.user) {
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        full_name: fullName,
        role: role,
        phone: phone,
        // email tidak disimpan di public.users, mengacu ke auth.users
      })

    if (insertError) {
      // Jika insert gagal, sebaiknya kita menghapus user dari auth juga (rollback) 
      // Namun untuk MVP, kita kembalikan pesan error saja.
      console.error('Error insert user metadata:', insertError)
      return { error: 'Gagal menyimpan profil pengguna' }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/login?registered=true')
}

export async function logout(prevState: any, formData?: FormData) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
