/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Clock, User, Users, Compass, AlertCircle, Compass as RouteIcon, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../../../../../shared/utils/formatCurrency';
import VehicleSeatMap from './VehicleSeatMap';

interface BookingItem {
  id: string;
  travelerEmail: string;
  travelerName?: string;
  slots: number;
  totalPrice: number;
  status: 'PAID' | 'PENDING';
  departureTime?: string;
}

interface RouteDepartureData {
  time: string;
  vehicleName: string;
  driverName: string;
  capacity: number;
  bookings: BookingItem[];
  paidSlots: number;
  pendingSlots: number;
  occupiedSlots: number;
  availableSlots: number;
  revenue: number;
  statusLabel: 'Sin reservas' | 'Disponible' | 'Casi lleno' | 'Lleno' | 'Sobrecupo';
}

interface RouteBoardProps {
  times: string[];
  capacity: number;
  vehicleName: string;
  driverName: string;
  bookings: any[];
  routeName: string;
  origin: string;
  destination: string;
}

export default function RouteBoard({
  times,
  capacity,
  vehicleName,
  driverName,
  bookings,
  routeName,
  origin,
  destination,
}: RouteBoardProps) {
  // Estado para expandir el mapa de asientos por cada horario (index)
  const [expandedSeatMap, setExpandedSeatMap] = useState<{ [key: string]: boolean }>({});

  const toggleSeatMap = (time: string) => {
    setExpandedSeatMap(prev => ({
      ...prev,
      [time]: !prev[time]
    }));
  };

  // 1. Agrupar las reservas del día por horario
  const departuresList: RouteDepartureData[] = React.useMemo(() => {
    const grouped: { [key: string]: BookingItem[] } = {};
    const generalBookings: BookingItem[] = [];

    // Inicializar grupos de horarios
    times.forEach(t => {
      grouped[t] = [];
    });

    bookings.forEach(b => {
      const item: BookingItem = {
        id: b.id,
        travelerEmail: b.travelerEmail || 'Sin correo',
        travelerName: b.travelerName || b.travelerEmail || 'Pasajero',
        slots: Number(b.slots || 1),
        totalPrice: Number(b.totalPrice || 0),
        status: b.status || 'PENDING',
        departureTime: b.departureTime
      };

      if (b.departureTime && grouped[b.departureTime]) {
        grouped[b.departureTime].push(item);
      } else {
        generalBookings.push(item);
      }
    });

    // Formatear la lista de salidas
    const formatted = times.map(time => {
      const timeBookings = grouped[time] || [];
      
      let paid = 0;
      let pending = 0;
      let revenue = 0;

      timeBookings.forEach(tb => {
        if (tb.status === 'PAID') paid += tb.slots;
        else if (tb.status === 'PENDING') pending += tb.slots;
        revenue += tb.totalPrice;
      });

      const occupied = paid + pending;
      const available = capacity - occupied;

      // Determinar etiquetas de estatus operativo
      let statusLabel: RouteDepartureData['statusLabel'] = 'Sin reservas';
      if (occupied === 0) {
        statusLabel = 'Sin reservas';
      } else if (available < 0) {
        statusLabel = 'Sobrecupo';
      } else if (available === 0) {
        statusLabel = 'Lleno';
      } else if (available >= 1 && available <= 3) {
        statusLabel = 'Casi lleno';
      } else {
        statusLabel = 'Disponible';
      }

      return {
        time,
        vehicleName: vehicleName || 'Unidad por asignar',
        driverName: driverName || 'Chofer por asignar',
        capacity,
        bookings: timeBookings,
        paidSlots: paid,
        pendingSlots: pending,
        occupiedSlots: occupied,
        availableSlots: available,
        revenue,
        statusLabel
      };
    });

    // Si existen reservas generales sin horario asignado, las agregamos al final en una sección especial
    if (generalBookings.length > 0) {
      let paid = 0;
      let pending = 0;
      let revenue = 0;

      generalBookings.forEach(gb => {
        if (gb.status === 'PAID') paid += gb.slots;
        else if (gb.status === 'PENDING') pending += gb.slots;
        revenue += gb.totalPrice;
      });

      const occupied = paid + pending;
      const available = capacity - occupied;

      let statusLabel: RouteDepartureData['statusLabel'] = 'Sin reservas';
      if (occupied === 0) {
        statusLabel = 'Sin reservas';
      } else if (available < 0) {
        statusLabel = 'Sobrecupo';
      } else if (available === 0) {
        statusLabel = 'Lleno';
      } else if (available >= 1 && available <= 3) {
        statusLabel = 'Casi lleno';
      } else {
        statusLabel = 'Disponible';
      }

      formatted.push({
        time: 'General / Sin Horario',
        vehicleName: 'Unidad por asignar',
        driverName: 'Chofer por asignar',
        capacity,
        bookings: generalBookings,
        paidSlots: paid,
        pendingSlots: pending,
        occupiedSlots: occupied,
        availableSlots: available,
        revenue,
        statusLabel
      });
    }

    return formatted;
  }, [times, capacity, vehicleName, driverName, bookings]);

  return (
    <div className="space-y-6">
      {departuresList.map((dep, index) => {
        const isGeneral = dep.time.includes('General');
        const showSeatMap = expandedSeatMap[dep.time] || false;
        
        // Estilos de aforo y colores
        let statusBadge = 'bg-slate-100 text-slate-650';
        let progressColor = 'bg-emerald-500';
        let borderClass = 'border-slate-200';

        if (dep.statusLabel === 'Disponible') {
          statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-250/50';
          progressColor = 'bg-emerald-500';
        } else if (dep.statusLabel === 'Casi lleno') {
          statusBadge = 'bg-amber-100 text-amber-800 border-amber-250/50';
          progressColor = 'bg-amber-500';
          borderClass = 'border-amber-200';
        } else if (dep.statusLabel === 'Lleno') {
          statusBadge = 'bg-rose-100 text-rose-800 border-rose-250/50';
          progressColor = 'bg-rose-600';
          borderClass = 'border-rose-300';
        } else if (dep.statusLabel === 'Sobrecupo') {
          statusBadge = 'bg-rose-250 text-rose-950 border-rose-350 animate-pulse';
          progressColor = 'bg-rose-700';
          borderClass = 'border-rose-400';
        }

        const occupancyPercentage = Math.min(100, Math.max(0, (dep.occupiedSlots / dep.capacity) * 100));

        return (
          <div 
            key={index} 
            className={`bg-white border rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all ${borderClass}`}
          >
            {/* Header de la Salida / Corrida */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 shrink-0 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-850 leading-tight">
                    Corrida de las {dep.time}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider block mt-0.5 uppercase">
                    Ruta: {routeName} {origin && destination ? `(${origin} ➔ ${destination})` : ''}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 font-bold py-1 px-2.5 rounded-lg">
                  Vehículo: {dep.vehicleName}
                </span>
                <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-650 font-bold py-1 px-2.5 rounded-lg flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Chofer: {dep.driverName}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-wider py-1 px-3 rounded-full border ${statusBadge}`}>
                  {dep.statusLabel}
                </span>
              </div>
            </div>

            {/* Progreso visual de aforo */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-550">
                <span>Ocupación de Asientos</span>
                <span>{dep.occupiedSlots} / {dep.capacity} ocupados</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${progressColor}`}
                  style={{ width: `${occupancyPercentage}%` }}
                />
              </div>
            </div>

            {/* Métricas secundarias */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50/60 p-3 rounded-xl border border-slate-100/85">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider font-mono">Disponibles</span>
                <span className={`font-bold ${dep.availableSlots < 0 ? 'text-rose-600 font-extrabold animate-pulse' : 'text-slate-800'}`}>
                  {dep.availableSlots} asientos
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider font-mono">Pagados (PAID)</span>
                <span className="font-bold text-slate-800">{dep.paidSlots} lugares</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider font-mono">Pendientes</span>
                <span className="font-bold text-slate-800">{dep.pendingSlots} lugares</span>
              </div>
              <div className="text-right sm:text-left">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider font-mono">Ingresos</span>
                <span className="font-bold text-emerald-600 font-mono">{formatCurrency(dep.revenue)} MXN</span>
              </div>
            </div>

            {/* Sección Desplegable: Mapa de Asientos y Manifiesto de Clientes */}
            <div className="border-t border-slate-100 pt-3">
              <button
                onClick={() => toggleSeatMap(dep.time)}
                className="flex items-center gap-1.5 text-[10px] font-black text-emerald-700 uppercase hover:text-emerald-800 tracking-wider transition-colors outline-none"
              >
                <span>{showSeatMap ? 'Ocultar Distribución de Unidad' : 'Ver Distribución de Asientos'}</span>
                {showSeatMap ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showSeatMap && (
                <div className="grid md:grid-cols-12 gap-6 mt-4 items-start animate-fade-in">
                  {/* Mapa de asientos */}
                  <div className="md:col-span-5">
                    <VehicleSeatMap 
                      capacity={dep.capacity}
                      paidSlots={dep.paidSlots}
                      pendingSlots={dep.pendingSlots}
                    />
                  </div>

                  {/* Tabla de Pasajeros de esta Corrida */}
                  <div className="md:col-span-7 space-y-2">
                    <span className="text-[9px] font-extrabold text-slate-450 uppercase font-mono tracking-wider flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Manifiesto de Pasajeros ({dep.bookings.length})
                    </span>

                    {dep.bookings.length === 0 ? (
                      <p className="text-[10px] text-slate-400 italic py-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                        No hay pasajeros reservados para este horario.
                      </p>
                    ) : (
                      <div className="overflow-hidden border border-slate-150 rounded-xl bg-white">
                        <table className="w-full text-left text-[11px] border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-150 text-[8px] font-black text-slate-450 uppercase font-mono">
                              <th className="p-2">Pasajero / Viajero</th>
                              <th className="p-2 text-center">Asientos</th>
                              <th className="p-2 text-center">Estado</th>
                              <th className="p-2 text-right">Monto</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dep.bookings.map((booking) => (
                              <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <td className="p-2 font-bold text-slate-800 truncate max-w-[140px]" title={booking.travelerEmail}>
                                  {booking.travelerName}
                                </td>
                                <td className="p-2 text-center font-bold text-slate-900">
                                  {booking.slots}
                                </td>
                                <td className="p-2 text-center">
                                  <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                                    booking.status === 'PAID' ? 'bg-blue-50 text-blue-750 border border-blue-100' : 'bg-amber-50 text-amber-700 border border-amber-250'
                                  }`}>
                                    {booking.status === 'PAID' ? 'PAGADO' : 'PENDIENTE'}
                                  </span>
                                </td>
                                <td className="p-2 text-right font-bold text-slate-900 font-mono">
                                  {formatCurrency(booking.totalPrice)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
