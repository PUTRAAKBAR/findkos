import { createClient } from "@/utils/supabase/server";
import FavoritClient from "./favorit-client";

export default async function FavoritPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <FavoritClient isLoggedIn={false} initialFavorites={[]} />;
  }

  const { data: favorites } = await supabase
    .from('favorites')
    .select('*, properties(*)')
    .eq('user_id', user.id);

  const validFavorites = favorites?.filter((f: any) => f.properties) || [];
  
  const formattedFavorites = validFavorites.map((fav: any) => ({
    id: fav.properties.id,
    favorite_id: fav.id,
    name: fav.properties.name,
    type: fav.properties.type,
    price: fav.properties.price_per_month || 0,
    rating: 0,
    location: fav.properties.city || fav.properties.address || "-",
    image: fav.properties.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
    available: fav.properties.status === 'disetujui'
  }));

  return <FavoritClient isLoggedIn={true} initialFavorites={formattedFavorites} />;
}
