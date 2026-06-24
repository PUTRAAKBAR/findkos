'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// Mahasiswa membuat pesanan
export async function createBooking(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Anda harus login untuk memesan kos.' }

  const property_id = formData.get('property_id') as string
  const start_date = formData.get('start_date') as string
  const duration_months = parseInt(formData.get('duration_months') as string)
  
  if (!property_id || !start_date || isNaN(duration_months)) {
    return { error: 'Harap lengkapi semua field pemesanan.' }
  }

  // Cek apakah user sudah memiliki pesanan aktif di kos ini
  const { data: existingBookings, error: checkError } = await supabase
    .from('bookings')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('property_id', property_id)
    .in('status', ['menunggu', 'disetujui', 'dibayar']);

  if (checkError) {
    console.error('Error checking existing bookings:', checkError);
    return { error: 'Gagal memverifikasi status pesanan Anda saat ini.' };
  }

  if (existingBookings && existingBookings.length > 0) {
    const existingStatus = existingBookings[0].status;
    if (existingStatus === 'menunggu') {
      return { error: 'Anda sudah mengajukan pesanan untuk kos ini dan sedang menunggu konfirmasi.' };
    }
    return { error: `Anda tidak dapat memesan lagi karena status pesanan Anda saat ini: ${existingStatus}.` };
  }

  // Hitung total harga (ambil harga per bulan dari tabel properties)
  const { data: property, error: propError } = await supabase
    .from('properties')
    .select('price_per_month')
    .eq('id', property_id)
    .single()

  if (propError || !property) {
    return { error: 'Properti tidak ditemukan.' }
  }

  const total_price = property.price_per_month * duration_months

  const { error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      property_id,
      start_date,
      duration_months,
      total_price,
      status: 'menunggu'
    })

  if (error) {
    console.error('Error creating booking:', error)
    return { error: 'Gagal membuat pesanan.' }
  }

  revalidatePath(`/kos/${property_id}`)
  revalidatePath('/akun')
  
  return { success: true, message: 'Pesanan berhasil dibuat, menunggu konfirmasi pemilik.' }
}

// Pemilik Kos / Admin mengubah status pesanan
export async function updateBookingStatus(bookingId: string, status: 'disetujui' | 'ditolak' | 'dibayar' | 'selesai' | 'dibatalkan') {
  const supabase = await createClient()

  // Verifikasi (idealnya periksa apakah user saat ini adalah pemilik dari kos tersebut)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Untuk MVP, kita langsung update saja (RLS yang akan menolak jika bukan pemiliknya, asalkan RLS sudah diatur dengan baik)
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select()

  if (error) {
    console.error('Error updating booking status:', error)
    return { error: 'Gagal memperbarui status pesanan.' }
  }

  if (!data || data.length === 0) {
    return { error: 'Gagal membatalkan pesanan. Anda mungkin tidak memiliki izin (RLS), atau pesanan tidak ditemukan.' }
  }

  // Jika status diubah menjadi 'disetujui' atau 'dibayar', batalkan semua pesanan 'menunggu' lainnya untuk user ini
  if ((status === 'disetujui' || status === 'dibayar') && data[0]?.user_id) {
    const bookingUserId = data[0].user_id;
    // RLS policy for 'mahasiswa' will allow them to update their own bookings to 'dibatalkan'.
    // If triggered by 'pemilik' (disetujui), it may be silently blocked by RLS for OTHER owners' properties, 
    // but works fine if the mahasiswa had multiple bookings on the SAME owner, or when triggered by 'dibayar'.
    await supabase
      .from('bookings')
      .update({ status: 'dibatalkan' })
      .eq('user_id', bookingUserId)
      .eq('status', 'menunggu')
      .neq('id', bookingId);
  }

  revalidatePath('/pemilik/dashboard')
  revalidatePath('/pemilik/dashboard/pesanan')
  revalidatePath('/akun')
  return { success: true, message: `Status pesanan berhasil diperbarui menjadi ${status}.` }
}
