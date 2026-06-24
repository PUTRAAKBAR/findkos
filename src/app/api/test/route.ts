import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  
  // Try to update a booking
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .limit(1);

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ error: 'No bookings found', bookingsError });
  }

  const testBooking = bookings[0];

  const { data: updateData, error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'disetujui' })
    .eq('id', testBooking.id)
    .select();

  // Try to read users
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(5);

  return NextResponse.json({
    bookingTest: { updateData, updateError },
    usersTest: { usersData, usersError }
  });
}
