"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreVertical, Mail, Phone, Calendar } from "lucide-react";

export function PenggunaClient({ initialUsers }: { initialUsers: any[] }) {
  const searchParams = useSearchParams();
  const globalQuery = searchParams.get("q")?.toLowerCase() || "";

  const [activeTab, setActiveTab] = useState("Semua");
  const [localQuery, setLocalQuery] = useState("");
  const tabs = ["Semua", "Mahasiswa", "Pemilik Kos", "Admin"];

  const filteredUsers = useMemo(() => {
    return initialUsers.filter((user) => {
      // 1. Tab Filter
      if (activeTab === "Mahasiswa" && user.role !== "mahasiswa") return false;
      if (activeTab === "Pemilik Kos" && user.role !== "pemilik") return false;
      if (activeTab === "Admin" && user.role !== "admin") return false;

      // 2. Search Filter (Local + Global)
      const searchTerm = localQuery.toLowerCase() || globalQuery;
      if (searchTerm) {
        const matchName = user.full_name?.toLowerCase().includes(searchTerm);
        const matchEmail = user.email?.toLowerCase().includes(searchTerm);
        const matchPhone = user.phone?.toLowerCase().includes(searchTerm);
        if (!matchName && !matchEmail && !matchPhone) return false;
      }

      return true;
    });
  }, [initialUsers, activeTab, localQuery, globalQuery]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">Admin</Badge>;
      case "pemilik":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Pemilik Kos</Badge>;
      case "mahasiswa":
      default:
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Mahasiswa</Badge>;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h2>
          <p className="text-muted-foreground">Kelola semua akun pengguna terdaftar di FINDKOS.</p>
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
              placeholder="Cari nama atau email..." 
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

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/50 uppercase border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Pengguna</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Kontak</th>
                  <th className="px-6 py-4 font-medium">Tgl Daftar</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      Tidak ada pengguna yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                            user.role === 'pemilik' ? 'bg-primary/10 text-primary' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {getInitials(user.full_name)}
                          </div>
                          <div>
                            <div className="font-bold text-foreground">{user.full_name || "Tanpa Nama"}</div>
                            <div className="text-xs text-muted-foreground">ID: {user.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-muted-foreground"/> {user.email || "-"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-muted-foreground"/> {user.phone || "-"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5"/> {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {/* Selalu aktif untuk MVP seperti request user */}
                        <Badge className="bg-emerald-500 hover:bg-emerald-600">Aktif</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
