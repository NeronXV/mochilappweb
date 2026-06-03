/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, User, Users, Compass, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../../../../shared/utils/formatCurrency';

interface BookingItem {
  id: string;
  travelerEmail: string;
  travelerName?: string;
  slots: number;
  totalPrice: number;
  status: 'PAID' | 'PENDING';
  departureTime?: string;
}

interface DepartureData {
  time: string;
  guideName: string;
  capacity: number;
  bookings: BookingItem[];
  paidSlots: number;
  pendingSlots: number;
  occupiedSlots: number;
  availableSlots: number;
  revenue: number;
  statusLabel: 'Sin reservas' | 'Abierto' | 'Casi lleno' | 'Lleno' | 'Sobrecupo';
}

interface DepartureBoardProps {
  times: string[];
  capacity: number;
  guideName: string;
  bookings: any[];
  tourName: string;
}

export default function DepartureBoard({
  times,
  capacity,
  guideName,
  bookings,
  tourName,
}: DepartureBoardProps) {
  // 1. Agrupar las reservas del día por horario
  const departuresList: DepartureData[] = React.useMemo(() => {
    // Clasificar bookings por horario
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
        travelerName: b.travelerName || b.travelerEmail || 'Viajero',
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
      let statusLabel: DepartureData['statusLabel'] = 'Sin reservas';
      if (occupied === 0) {
        statusLabel = 'Sin reservas';
      } else if (available < 0) {
        statusLabel = 'Sobrecupo';
      } else if (available === 0) {
        statusLabel = 'Lleno';
      } else if (available >= 1 && available <= 3) {
        statusLabel = 'Casi lleno';
      } else {
        statusLabel = 'Abierto';
      }

      return {
        time,
        guideName: guideName || 'Guía por asignar',
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

      let statusLabel: DepartureData['statusLabel'] = 'Sin reservas';
      if (occupied === 0) {
        statusLabel = 'Sin reservas';
      } else if (available < 0) {
        statusLabel = 'Sobrecupo';
      } else if (available === 0) {
        statusLabel = 'Lleno';
      } else if (available >= 1 && available <= 3) {
        statusLabel = 'Casi lleno';
      } else {
        statusLabel = 'Abierto';
      }

      formatted.push({
        time: 'General / Sin Horario',
        guideName: 'Por asignar',
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
  }, [times, capacity, guideName, bookings]);

  return (
    <div className="space-y-6">
      {departuresList.map((dep, index) => {
        const isGeneral = dep.time.includes('General');
        
        // Estilos de aforo y colores
        let statusBadge = 'bg-slate-100 text-slate-600';
        let progressColor = 'bg-emerald-500';
        let borderClass = 'border-slate-200';

        if (dep.statusLabel === 'Abierto') {
          statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200/50';
          progressColor = 'bg-emerald-500';
        } else if (dep.statusLabel === 'Casi lleno') {
          statusBadge = 'bg-amber-100 text-amber-800 border-amber-200/50';
          progressColor = 'bg-amber-500';
          borderClass = 'border-amber-200';
        } else if (dep.statusLabel === 'Lleno') {
          statusBadge = 'bg-rose-100 text-rose-800 border-rose-200/50';
          progressColor = 'bg-rose-600';
          borderClass = 'border-rose-300';
        } else if (dep.statusLabel === 'Sobrecupo') {
          statusBadge = 'bg-rose-250 text-rose-950 border-rose-300 animate-pulse';
          progressColor = 'bg-rose-700';
          borderClass = 'border-rose-400';
        }

        // Porcentaje de ocupación para la barra de progreso
        const occupancyPercentage = Math.min(100, Math.max(0, (dep.occupiedSlots / dep.capacity) * 100));

        return (
          <div 
            key={index} 
            className={`bg-white border rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all ${borderClass}`}
          >
            {/* Header de salida */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-655 shrink-0 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-850 leading-tight">
                    Salida de las {dep.time}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider block mt-0.5">
                    {tourName}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 font-bold py-1 px-2.5 rounded-lg flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-450" />
                  Guía: {dep.guideName}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-wider py-1 px-3 rounded-full border ${statusBadge}`}>
                  {dep.statusLabel}
                </span>
              </div>
            </div>

            {/* Progreso visual de aforo */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-550">
                <span>Aforo de la Salida</span>
                <span>{dep.occupiedSlots} / {dep.capacity} pasajeros</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${progressColor}`}
                  style={{ width: `${occupancyPercentage}%` }}
                />
              </div>
            </div>

            {/* Métricas secundarias */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50/60 p-3 rounded-xl border border-slate-100/80">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider font-mono">Disponibles</span>
                <span className={`font-bold ${dep.availableSlots < 0 ? 'text-rose-600 font-extrabold animate-pulse' : 'text-slate-800'}`}>
                  {dep.availableSlots} lugares
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
                <span className="font-bold text-emerald-600">{formatCurrency(dep.revenue)} MXN</span>
              </div>
            </div>

            {/* Listado de clientes de esta salida */}
            <div className="space-y-2">
              <span className="text-[9px] font-extrabold text-slate-450 uppercase font-mono tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                Clientes Registrados ({dep.bookings.length})
              </span>

              {dep.bookings.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic">No hay pasajeros agendados en esta salida.</p>
              ) : (
                <div className="overflow-hidden border border-slate-150 rounded-xl bg-white">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[8px] font-black text-slate-450 uppercase font-mono">
                        <th className="p-2">Pasajero / Viajero</th>
                        <th className="p-2 text-center">Lugares</th>
                        <th className="p-2 text-center">Estado</th>
                        <th className="p-2 text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dep.bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="p-2 font-bold text-slate-800 truncate max-w-[150px]" title={booking.travelerEmail}>
                            {booking.travelerName}
                          </td>
                          <td className="p-2 text-center font-bold text-slate-900">
                            {booking.slots}
                          </td>
                          <td className="p-2 text-center">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                              booking.status === 'PAID' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-amber-50 text-amber-700 border border-amber-200'
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
        );
      })}
    </div>
  );
}
