"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle2, XCircle, MapPin, Eye, Filter, Loader2 } from "lucide-react";
import { updatePropertyStatus } from "@/app/actions/admin";
import { useSearchParams } from "next/navigation";

export default function VerifikasiClient({ initialProperties }: { initialProperties: any[] }) {
  const searchParams = useSearchParams();
  const globalQuery = searchParams.get("q")?.toLowerCase() || "";
  const [localQuery, setLocalQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Antrean");
  const [properties, setProperties] = useState(initialProperties);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const tabs = ["Antrean", "Disetujui", "Ditolak"];

  // Filter properti berdasarkan tab aktif dan pencarian
  const filteredProperties = properties.filter(p => {
    // 1. Tab Filter
    if (activeTab === "Antrean" && p.status !== "menunggu") return false;
    if (activeTab === "Disetujui" && p.status !== "disetujui") return false;
    if (activeTab === "Ditolak" && p.status !== "ditolak") return false;

    // 2. Search Filter (Local + Global)
    const searchTerm = localQuery.toLowerCase() || globalQuery;
    if (searchTerm) {
      const matchName = p.name?.toLowerCase().includes(searchTerm);
      const matchOwner = p.owner?.full_name?.toLowerCase().includes(searchTerm) || p.users?.full_name?.toLowerCase().includes(searchTerm);
      if (!matchName && !matchOwner) return false;
    }

    return true;
  });

  const handleAction = async (propertyId: string, status: 'disetujui' | 'ditolak') => {
    setLoadingId(propertyId);
    try {
      const result = await updatePropertyStatus(propertyId, status);
      if (result?.error) {
        alert(result.error);
        return;
      }
      
      // Update local state
      setProperties(prev => 
        prev.map(p => p.id === propertyId ? { ...p, status } : p)
      );
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Verifikasi Properti</h2>
          <p className="text-muted-foreground">Tinjau dan setujui pendaftaran kos baru dari mitra.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg overflow-x-auto w-full sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Cari nama properti..." 
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="pl-9 bg-background" 
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 bg-background">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            Tidak ada data {activeTab.toLowerCase()} saat ini.
          </div>
        ) : (
          filteredProperties.map((property) => (
            <Card key={property.id} className="border-l-4 border-l-amber-500 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-48 h-40 sm:h-auto bg-muted relative">
                  <img 
                    src={property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop"} 
                    alt={property.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{property.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Oleh: {property.owner?.full_name || property.users?.full_name || "Pemilik"} 
                          {property.owner?.phone || property.users?.phone ? ` (${property.owner?.phone || property.users?.phone})` : ""}
                        </p>
                      </div>
                      <Badge variant="outline" className={
                        property.status === 'menunggu' ? "text-amber-500 border-amber-500 bg-amber-50" :
                        property.status === 'disetujui' ? "text-emerald-500 border-emerald-500 bg-emerald-50" :
                        "text-red-500 border-red-500 bg-red-50"
                      }>
                        {property.status === 'menunggu' ? "Menunggu Review" : property.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center mt-2 mb-4">
                      <MapPin className="w-3.5 h-3.5 mr-1" /> {property.address}, {property.city}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs mb-4">
                      <span className="bg-muted px-2 py-1 rounded capitalize">Tipe: {property.type}</span>
                      <span className="bg-muted px-2 py-1 rounded">Harga: Rp {property.price_per_month.toLocaleString('id-ID')}/bln</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 border-t pt-4">
                    <Button variant="outline" size="sm" className="text-muted-foreground">
                      <Eye className="w-4 h-4 mr-2" /> Detail
                    </Button>
                    
                    {property.status === 'menunggu' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                          onClick={() => handleAction(property.id, 'ditolak')}
                          disabled={loadingId === property.id}
                        >
                          {loadingId === property.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4 mr-1" /> Tolak</>}
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-emerald-500 hover:bg-emerald-600"
                          onClick={() => handleAction(property.id, 'disetujui')}
                          disabled={loadingId === property.id}
                        >
                          {loadingId === property.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-1" /> Setujui</>}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
