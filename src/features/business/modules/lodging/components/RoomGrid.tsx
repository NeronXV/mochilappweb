/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Bed, Eye, AlertTriangle, ShieldCheck, Clock, Settings } from 'lucide-react';

interface RoomItem {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'pending';
}

interface RoomGridProps {
  serviceRooms?: any[];
  serviceType: 'HOTEL' | 'HOSTEL';
  paidUnits: number;
  pendingUnits: number;
}

export default function RoomGrid({
  serviceRooms,
  serviceType,
  paidUnits,
  pendingUnits,
}: RoomGridProps) {
  // 1. Resolver el listado de habitaciones/camas
  const rooms: RoomItem[] = React.useMemo(() => {
    // Si ya existe configurado el array de rooms en el servicio, lo usamos
    if (serviceRooms && serviceRooms.length > 0) {
      return serviceRooms.map((r, index) => {
        // Enlazar estado de forma estricta si el servicio ya viene con el status
        return {
          id: r.id || String(index + 1),
          name: r.name || `Habitación ${index + 1}`,
          type: r.type || (serviceType === 'HOTEL' ? 'Habitación' : 'Cama'),
          status: r.status || 'available'
        };
      });
    }

    // Fallback MVP: Generar 8 unidades estándar
    const generated: RoomItem[] = [];
    const count = 8;
    for (let i = 1; i <= count; i++) {
      generated.push({
        id: String(i),
        name: serviceType === 'HOTEL' ? `Hab 10${i}` : `Cama ${i}`,
        type: serviceType === 'HOTEL' ? 'Habitación Standard' : 'Cama Litera',
        status: 'available'
      });
    }
    return generated;
  }, [serviceRooms, serviceType]);

  // 2. Mapear secuencialmente la ocupación diaria sobre las habitaciones disponibles
  // Esto simula la carga del establecimiento de popa a proa / entrada a salida
  const finalRooms = React.useMemo(() => {
    let paidRemaining = paidUnits;
    let pendingRemaining = pendingUnits;

    return rooms.map(room => {
      // Si la habitación ya tiene un estado de mantenimiento o limpieza explícito, se respeta
      if (room.status === 'cleaning' || room.status === 'maintenance') {
        return room;
      }

      let assignedStatus: RoomItem['status'] = 'available';

      if (paidRemaining > 0) {
        assignedStatus = 'occupied'; // PAID = ocupado
        paidRemaining--;
      } else if (pendingRemaining > 0) {
        assignedStatus = 'pending'; // PENDING = reservado/pendiente
        pendingRemaining--;
      }

      return {
        ...room,
        status: assignedStatus
      };
    });
  }, [rooms, paidUnits, pendingUnits]);

  // Conteo de estados finales para la leyenda del mapa
  const stats = React.useMemo(() => {
    let avail = 0;
    let occ = 0;
    let pend = 0;
    let clean = 0;
    let maint = 0;

    finalRooms.forEach(r => {
      if (r.status === 'available') avail++;
      else if (r.status === 'occupied') occ++;
      else if (r.status === 'pending') pend++;
      else if (r.status === 'cleaning') clean++;
      else if (r.status === 'maintenance') maint++;
    });

    return { avail, occ, pend, clean, maint };
  }, [finalRooms]);

  return (
    <div className="w-full space-y-6">
      {/* Grid de habitaciones */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {finalRooms.map((room) => {
          let cardBg = 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/50';
          let statusLabel = 'Disponible';
          let statusBadge = 'bg-emerald-100 text-emerald-800';
          let Icon = serviceType === 'HOTEL' ? Home : Bed;

          if (room.status === 'occupied') {
            cardBg = 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100/50';
            statusLabel = 'Ocupada';
            statusBadge = 'bg-rose-100 text-rose-850';
          } else if (room.status === 'pending') {
            cardBg = 'bg-amber-50 border-amber-250 text-amber-800 hover:bg-amber-100/50';
            statusLabel = 'Reservada';
            statusBadge = 'bg-amber-100 text-amber-850';
          } else if (room.status === 'cleaning') {
            cardBg = 'bg-slate-50 border-slate-200 text-slate-500';
            statusLabel = 'Limpieza';
            statusBadge = 'bg-slate-200 text-slate-700';
          } else if (room.status === 'maintenance') {
            cardBg = 'bg-slate-100 border-slate-300 text-slate-400';
            statusLabel = 'Mantenimiento';
            statusBadge = 'bg-slate-300 text-slate-600';
          }

          return (
            <div
              key={room.id}
              className={`border-2 rounded-2xl p-4 flex flex-col justify-between items-start gap-4 transition-all duration-300 hover:shadow-md cursor-pointer select-none ${cardBg}`}
              title={`${room.name} - ${statusLabel}`}
            >
              <div className="w-full flex justify-between items-start">
                <div className="p-2 bg-white rounded-xl shadow-sm shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${statusBadge}`}>
                  {statusLabel}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-850 leading-tight">
                  {room.name}
                </h4>
                <span className="text-[9px] font-medium text-slate-400 block mt-0.5">
                  {room.type}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leyenda de Estados */}
      <div className="flex flex-wrap justify-center gap-4 text-[10px] font-semibold text-slate-605 bg-slate-50 p-4 rounded-2xl border border-slate-150">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
          <span>Disponible ({stats.avail})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
          <span>Reservada ({stats.pend})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
          <span>Ocupada ({stats.occ})</span>
        </div>
        {stats.clean > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-sm" />
            <span>Limpieza ({stats.clean})</span>
          </div>
        )}
        {stats.maint > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-sm" />
            <span>Mantenimiento ({stats.maint})</span>
          </div>
        )}
      </div>
    </div>
  );
}
