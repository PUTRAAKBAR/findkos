"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Star, Heart, Map, ListFilter } from "lucide-react";

// Mock Data
const MOCK_PROPERTIES = [
  {
    id: 1,
    name: "Kos Putra Mawardah",
    type: "Putra",
    price: 1200000,
    rating: 4.8,
    location: "Kec. Coblong, Bandung",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
    available: true,
  },
  {
    id: 2,
    name: "Kos Elite Jatinangor",
    type: "Campur",
    price: 2500000,
    rating: 4.9,
    location: "Jatinangor, Sumedang",
    image: "https://images.unsplash.com/photo-1598928506311-c55d43958bb1?q=80&w=800&auto=format&fit=crop",
    available: true,
  },
  {
    id: 3,
    name: "Wisma Pondok",
    type: "Putri",
    price: 3100000,
    rating: 4.7,
    location: "Kebayoran Lama, Jakarta",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800&auto=format&fit=crop",
    available: false,
  },
  {
    id: 4,
    name: "Kos Putra Sukapura",
    type: "Putra",
    price: 850000,
    rating: 4.5,
    location: "Dayeuhkolot, Bandung",
    image: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=800&auto=format&fit=crop",
    available: true,
  },
  {
    id: 5,
    name: "Green Residence",
    type: "Putri",
    price: 1500000,
    rating: 4.6,
    location: "Depok, Jawa Barat",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop",
    available: true,
  },
  {
    id: 6,
    name: "Kos Executive",
    type: "Campur",
    price: 2200000,
    rating: 4.9,
    location: "Mlati, Sleman",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    available: true,
  },
];

export default function CariKosClient({ initialProperties, initialQuery = "", initialType = "Semua Tipe" }: { initialProperties: any[], initialQuery?: string, initialType?: string }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [priceRange, setPriceRange] = useState([500000, 2500000]);
  
  // Set initial selected type based on url param
  const initialSelectedTypes = initialType !== "Semua Tipe" && initialType !== "all" ? [initialType] : [];
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialSelectedTypes);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Terbaru");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProperties = initialProperties.filter(property => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = property.name?.toLowerCase().includes(q);
      const matchLocation = property.city?.toLowerCase().includes(q) || property.address?.toLowerCase().includes(q);
      if (!matchName && !matchLocation) return false;
    }

    if (selectedTypes.length > 0) {
      const propType = property.type?.toLowerCase();
      const mappedSelectedTypes = selectedTypes.map(t => t.toLowerCase().replace('kos ', ''));
      if (!mappedSelectedTypes.includes(propType)) return false;
    }

    const price = property.price_per_month || 0;
    if (price < priceRange[0] || price > priceRange[1]) return false;

    if (selectedFacilities.length > 0) {
      const propFacs = property.facilities?.map((f: string) => f.toLowerCase()) || [];
      const hasAll = selectedFacilities.every(sf => {
        if (sf === "wifi") return propFacs.some((f: string) => f.includes("wifi"));
        if (sf === "ac") return propFacs.some((f: string) => f.includes("ac"));
        if (sf === "dapur") return propFacs.some((f: string) => f.includes("dapur"));
        if (sf === "listrik") return propFacs.some((f: string) => f.includes("listrik"));
        return propFacs.some((f: string) => f.includes(sf.toLowerCase()));
      });
      if (!hasAll) return false;
    }

    return true;
  });

  const properties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "Harga Terendah") return (a.price_per_month || 0) - (b.price_per_month || 0);
    if (sortBy === "Harga Tertinggi") return (b.price_per_month || 0) - (a.price_per_month || 0);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, type]);
    } else {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    }
  };

  const handleFacilityChange = (facility: string, checked: boolean) => {
    if (checked) {
      setSelectedFacilities([...selectedFacilities, facility]);
    } else {
      setSelectedFacilities(selectedFacilities.filter(f => f !== facility));
    }
  };

  const filterContent = (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ListFilter className="w-5 h-5" /> Filter
          </h3>
          <button className="text-sm text-primary hover:underline" onClick={() => {
            setSelectedTypes([]);
            setPriceRange([500000, 2500000]);
            setSelectedFacilities([]);
          }}>Hapus Semua</button>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Tipe Kos</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="putra" checked={selectedTypes.includes("Kos Putra") || selectedTypes.includes("putra")} onCheckedChange={(checked) => handleTypeChange("Kos Putra", !!checked)} />
            <Label htmlFor="putra">Kos Putra</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="putri" checked={selectedTypes.includes("Kos Putri") || selectedTypes.includes("putri")} onCheckedChange={(checked) => handleTypeChange("Kos Putri", !!checked)} />
            <Label htmlFor="putri">Kos Putri</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="campur" checked={selectedTypes.includes("Kos Campur") || selectedTypes.includes("campur")} onCheckedChange={(checked) => handleTypeChange("Kos Campur", !!checked)} />
            <Label htmlFor="campur">Kos Campur</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Rentang Harga</h4>
        <div className="pt-2">
          <Slider
            defaultValue={[500000, 2500000]}
            max={5000000}
            step={10000}
            value={priceRange}
            onValueChange={(val) => setPriceRange(val as number[])}
            className="mb-6"
          />
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-8">Min</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                <Input
                  type="number"
                  min={0}
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                  className="pl-9 h-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-8">Max</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                <Input
                  type="number"
                  min={priceRange[0]}
                  max={5000000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 0])}
                  className="pl-9 h-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Fasilitas</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="wifi" checked={selectedFacilities.includes("wifi")} onCheckedChange={(c) => handleFacilityChange("wifi", !!c)} />
            <Label htmlFor="wifi">Wi-Fi</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="ac" checked={selectedFacilities.includes("ac")} onCheckedChange={(c) => handleFacilityChange("ac", !!c)} />
            <Label htmlFor="ac">AC</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="dapur" checked={selectedFacilities.includes("dapur")} onCheckedChange={(c) => handleFacilityChange("dapur", !!c)} />
            <Label htmlFor="dapur">Kamar Mandi Dalam</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="listrik" checked={selectedFacilities.includes("listrik")} onCheckedChange={(c) => handleFacilityChange("listrik", !!c)} />
            <Label htmlFor="listrik">Termasuk Listrik</Label>
          </div>
        </div>
      </div>
      
      <Button className="w-full lg:hidden mt-8" onClick={() => setIsMobileFilterOpen(false)}>Terapkan Filter</Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb & Header */}
      <div className="text-sm text-muted-foreground mb-6">
        Beranda &gt; Cari Kos &gt; <span className="text-foreground">"Cari Kos"</span>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(searchInput)}
            placeholder="Ketik lokasi atau nama kos..."
            className="pl-10 h-12 w-full"
          />
        </div>
        <Button size="lg" className="h-12 px-8" onClick={() => setSearchQuery(searchInput)}>
          <Search className="w-5 h-5 mr-2" />
          Cari
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0 border-r pr-6">
          {filterContent}
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Hasil Pencarian</h1>
              <p className="text-muted-foreground">Menemukan {properties.length} kos</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetTrigger className={buttonVariants({ variant: "outline", className: "lg:hidden flex-1 sm:flex-none" })}>
                  <ListFilter className="w-4 h-4 mr-2" /> Filter
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto p-6">
                  <SheetHeader>
                    <SheetTitle className="text-left font-bold text-xl mb-4">Filter</SheetTitle>
                  </SheetHeader>
                  <div className="py-2">
                    {filterContent}
                  </div>
                </SheetContent>
              </Sheet>
              <Select value={sortBy} onValueChange={(val) => val && setSortBy(val)}>
                <SelectTrigger className="w-[180px] h-10 px-3 py-2 bg-background">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Terbaru">Terbaru</SelectItem>
                  <SelectItem value="Harga Terendah">Harga Terendah</SelectItem>
                  <SelectItem value="Harga Tertinggi">Harga Tertinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((property) => (
              <a href={`/kos/${property.id}`} key={property.id} className="block">
                <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group h-full">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img 
                      src={property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop"} 
                      alt={property.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-blue-500 capitalize">{property.type}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors">{property.name}</h3>
                      <div className={`flex items-center gap-1 ${property.rating_average ? 'text-amber-500' : 'text-muted-foreground'} shrink-0`}>
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-sm font-medium text-foreground">
                          {property.rating_average ? property.rating_average.toFixed(1) : "Baru"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                      <span className="line-clamp-1">{property.city}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-primary">Rp {property.price_per_month.toLocaleString("id-ID")}</span>
                      <span className="text-xs text-muted-foreground">/ bulan</span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
            
            {properties.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                Tidak ada kos yang ditemukan.
              </div>
            )}
          </div>

          {/* Pagination */}
          {properties.length > 12 && (
            <div className="flex justify-center mt-12 mb-8">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="w-10 h-10 border-primary text-primary" disabled>
                  1
                </Button>
                <Button variant="ghost" size="icon" className="w-10 h-10 text-muted-foreground hover:text-foreground">
                  2
                </Button>
                <Button variant="ghost" size="icon" className="w-10 h-10 text-muted-foreground hover:text-foreground">
                  3
                </Button>
                <span className="px-2 text-muted-foreground">...</span>
                <Button variant="ghost" size="icon" className="w-10 h-10 text-muted-foreground hover:text-foreground">
                  12
                </Button>
                <Button variant="outline" className="ml-2">
                  Berikutnya &rarr;
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
