"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";

export function RealtimeRoomsBadge({ 
  propertyId, 
  initialRooms,
  isAvailable
}: { 
  propertyId: string, 
  initialRooms: number,
  isAvailable: boolean
}) {
  const [rooms, setRooms] = useState<number>(initialRooms);
  const supabase = createClient();

  useEffect(() => {
    // Setup realtime subscription
    const channel = supabase
      .channel(`property-${propertyId}-rooms`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'properties',
          filter: `id=eq.${propertyId}`
        },
        (payload: any) => {
          if (payload.new && payload.new.available_rooms !== undefined) {
            setRooms(payload.new.available_rooms);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId, supabase]);

  if (!isAvailable) {
    return <Badge variant="destructive">Penuh</Badge>;
  }

  if (rooms <= 0) {
    return <Badge variant="destructive">Penuh</Badge>;
  }

  return (
    <Badge className="bg-emerald-500 hover:bg-emerald-600 transition-colors">
      Tersedia {rooms} Kamar
    </Badge>
  );
}
