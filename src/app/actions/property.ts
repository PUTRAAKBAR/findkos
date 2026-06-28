'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// Helper for uploading files
async function uploadImage(file: File, supabase: any): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('properties')
    .upload(fileName, file);
    
  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('properties')
    .getPublicUrl(fileName);
    
  return publicUrl;
}

// Tambah Kos Baru
export async function addProperty(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Anda harus login untuk menambahkan kos.' }
  }

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const price_per_month = parseFloat(formData.get('price_per_month') as string)
  const available_rooms = parseInt(formData.get('available_rooms') as string) || 0
  const description = formData.get('description') as string
  const map_url = formData.get('map_url') as string
  const facilitiesString = formData.get('facilities') as string
  const facilities = facilitiesString ? facilitiesString.split(',').map(f => f.trim()) : []
  
  if (!name || !type || !address || !city || isNaN(price_per_month)) {
    return { error: 'Harap isi semua field yang wajib.' }
  }

  // Handle Images
  const images: string[] = []
  
  const bannerImage = formData.get('bannerImage') as File | null
  const detailImages = formData.getAll('detailImages') as File[]

  if (bannerImage && bannerImage.size > 0) {
    const url = await uploadImage(bannerImage, supabase)
    if (url) images.push(url)
  }

  for (const file of detailImages) {
    if (file && file.size > 0) {
      const url = await uploadImage(file, supabase)
      if (url) images.push(url)
    }
  }

  // Fallback for old forms
  const imageUrl = formData.get('imageUrl') as string
  if (images.length === 0 && imageUrl) {
    images.push(imageUrl)
  }

  const { data, error } = await supabase
    .from('properties')
    .insert({
      owner_id: user.id,
      name,
      type,
      address,
      city,
      price_per_month,
      description,
      map_url,
      facilities,
      images,
      status: 'menunggu',
      available_rooms
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding property:', error)
    return { error: 'Gagal menambahkan kos: ' + error.message }
  }

  revalidatePath('/pemilik/dashboard/properti')
  revalidatePath('/pemilik/properti')
  return { success: true, message: 'Kos berhasil ditambahkan dan menunggu persetujuan admin.', propertyId: data.id }
}

// Tambah Kamar ke dalam Kos
export async function addRoom(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const property_id = formData.get('property_id') as string
  const room_number = formData.get('room_number') as string
  
  if (!property_id || !room_number) {
    return { error: 'ID Properti dan Nomor Kamar wajib diisi.' }
  }

  const { error } = await supabase
    .from('rooms')
    .insert({
      property_id,
      room_number,
      status: 'tersedia'
    })

  if (error) {
    console.error('Error adding room:', error)
    return { error: 'Gagal menambahkan kamar.' }
  }

  revalidatePath(`/pemilik/dashboard/properti/${property_id}`)
  return { success: true, message: 'Kamar berhasil ditambahkan.' }
}

// Hapus Properti
export async function deleteProperty(propertyId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Anda harus login.' }
  }

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId)
    .eq('owner_id', user.id)

  if (error) {
    console.error('Error deleting property:', error)
    return { error: 'Gagal menghapus properti: ' + error.message }
  }

  revalidatePath('/pemilik/properti')
  return { success: true, message: 'Properti berhasil dihapus.' }
}

// Update Properti
export async function updateProperty(propertyId: string, prevState: any, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Anda harus login untuk mengubah kos.' }
  }

  const { data: existingProp } = await supabase
    .from('properties')
    .select('owner_id, images')
    .eq('id', propertyId)
    .single()

  if (!existingProp || existingProp.owner_id !== user.id) {
    return { error: 'Anda tidak memiliki akses ke properti ini.' }
  }

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const price_per_month = parseFloat(formData.get('price_per_month') as string)
  const available_rooms = parseInt(formData.get('available_rooms') as string)
  const description = formData.get('description') as string
  const map_url = formData.get('map_url') as string
  const facilitiesString = formData.get('facilities') as string
  const facilities = facilitiesString ? facilitiesString.split(',').map(f => f.trim()) : []
  
  if (!name || !type || !address || !city || isNaN(price_per_month)) {
    return { error: 'Harap isi semua field yang wajib.' }
  }

  const updateData: any = {
    name,
    type,
    address,
    city,
    price_per_month,
    description,
    map_url,
    facilities,
  }

  if (!isNaN(available_rooms)) {
    updateData.available_rooms = available_rooms
  }

  // Handle Images
  const bannerImage = formData.get('bannerImage') as File | null
  const detailImages = formData.getAll('detailImages') as File[]
  const keptImagesJson = formData.get('keptImages') as string
  let images: string[] = keptImagesJson ? JSON.parse(keptImagesJson) : (existingProp.images || [])

  let newBannerUrl = null
  if (bannerImage && bannerImage.size > 0) {
    newBannerUrl = await uploadImage(bannerImage, supabase)
    if (newBannerUrl) {
      if (images.length > 0) images[0] = newBannerUrl;
      else images.push(newBannerUrl);
    }
  }

  for (const file of detailImages) {
    if (file && file.size > 0) {
      const url = await uploadImage(file, supabase)
      if (url) images.push(url)
    }
  }

  // Batasi maksimal 10 foto
  if (images.length > 10) {
    images = images.slice(0, 10);
  }

  if (images.length > 0) {
    updateData.images = images;
  }

  const { error } = await supabase
    .from('properties')
    .update(updateData)
    .eq('id', propertyId)

  if (error) {
    console.error('Error updating property:', error)
    return { error: 'Gagal mengubah kos: ' + error.message }
  }

  revalidatePath('/pemilik/properti')
  revalidatePath('/pemilik/dashboard/properti')
  revalidatePath(`/kos/${propertyId}`)
  
  return { success: true, message: 'Kos berhasil diubah.' }
}
