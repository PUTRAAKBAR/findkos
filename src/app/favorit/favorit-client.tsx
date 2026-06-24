"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { toggleFavorite } from "@/app/actions/favorite";

interface FavoriteItem {
  id: string; // Property ID
  favorite_id?: string;
  name: string;
  type: string;
  price: number;
  rating: number;
  location: string;
  image: string;
  available: boolean;
}

export default function FavoritClient({ isLoggedIn, initialFavorites }: { isLoggedIn: boolean, initialFavorites: FavoriteItem[] }) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link> &gt; <span className="text-foreground">Favorit Saya</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-8">Favorit Saya</h1>
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed mt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Login untuk Melihat Favorit</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Anda harus masuk ke akun Anda terlebih dahulu untuk menyimpan dan melihat daftar kos favorit.
          </p>
          <Link href="/login">
            <Button size="lg">Login Sekarang</Button>
          </Link>
        </div>
      </div>
    );
  }

  const removeFavorite = async (id: string) => {
    // Optimistic UI update
    const previousFavorites = [...favorites];
    setFavorites(favorites.filter(fav => fav.id !== id));
    
    // Call server action
    const result = await toggleFavorite(id);
    if (result.error) {
      // Revert if error
      setFavorites(previousFavorites);
    }
  };

  const filteredFavorites = favorites.filter(fav => 
    fav.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    fav.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb & Header */}
      <div className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Beranda</Link> &gt; <span className="text-foreground">Favorit Saya</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Favorit Saya</h1>
          <p className="text-muted-foreground mt-1">
            Anda memiliki {favorites.length} properti kos yang disimpan.
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Cari kos favorit..." 
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Belum ada properti favorit</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Anda belum menambahkan kos ke daftar favorit. Mulai pencarian dan temukan kos impian Anda!
          </p>
          <Link href="/cari">
            <Button size="lg">Mulai Cari Kos</Button>
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Tidak ditemukan kos favorit yang sesuai dengan pencarian &quot;{searchQuery}&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((property) => (
            <Card key={property.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group">
              <div className="relative h-48 overflow-hidden bg-muted">
                <img 
                  src={property.image} 
                  alt={property.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={
                    property.type === 'Putra' ? 'bg-blue-500 hover:bg-blue-600' :
                    property.type === 'Putri' ? 'bg-pink-500 hover:bg-pink-600' :
                    'bg-purple-500 hover:bg-purple-600'
                  }>{property.type}</Badge>
                  <Badge className={
                    property.available ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
                  }>
                    {property.available ? 'Tersedia' : 'Penuh'}
                  </Badge>
                </div>
                <button 
                  onClick={() => removeFavorite(property.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-background/90 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                  title="Hapus dari Favorit"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-base line-clamp-1">{property.name}</h3>
                  <div className={`flex items-center gap-1 ${property.rating ? 'text-amber-500' : 'text-muted-foreground'} shrink-0`}>
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-sm font-medium text-foreground">
                      {property.rating ? property.rating.toFixed(1) : "Baru"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                  <span className="line-clamp-1">{property.location}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-4 mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-primary">Rp {property.price.toLocaleString("id-ID")}</span>
                    <span className="text-xs text-muted-foreground">/ bln</span>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0">
                    Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
