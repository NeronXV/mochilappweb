/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Clock, ShieldCheck, CheckCircle } from 'lucide-react';

interface AvailabilityCalendarProps {
  serviceId: string;
  bookings: any[];
  year: number;
  month: number; // 0-indexed
  onMonthChange: (year: number, month: number) => void;
}

export default function AvailabilityCalendar({
  serviceId,
  bookings,
  year,
  month,
  onMonthChange,
}: AvailabilityCalendarProps) {
  // Días de la semana en español
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Nombre de los meses
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Calcular offsets y cantidad de días del mes
  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const firstDayIndex = useMemo(() => {
    return new Date(year, month, 1).getDay(); // 0 = Domingo, 1 = Lunes, etc.
  }, [year, month]);

  // Generar array de días del mes y su estado
  const calendarCells = useMemo(() => {
    const cells: Array<{
      day: number | null;
      dateStr: string;
      status: 'PAID' | 'PENDING' | 'AVAILABLE';
      bookingDetails?: any;
    }> = [];

    // Rellenar días vacíos al inicio (offsets)
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ day: null, dateStr: '', status: 'AVAILABLE' });
    }

    // Rellenar días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const formattedMonth = String(month + 1).padStart(2, '0');
      const formattedDay = String(day).padStart(2, '0');
      const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

      // Buscar bookings activas de este día y servicio
      const dayBookings = bookings.filter(b => 
        b.serviceId === serviceId && 
        b.date === dateStr && 
        b.status !== 'CANCELLED'
      );

      // Determinar estado de la fecha
      let status: 'PAID' | 'PENDING' | 'AVAILABLE' = 'AVAILABLE';
      let mainBooking = null;

      if (dayBookings.some(b => b.status === 'PAID')) {
        status = 'PAID';
        mainBooking = dayBookings.find(b => b.status === 'PAID');
      } else if (dayBookings.some(b => b.status === 'PENDING')) {
        status = 'PENDING';
        mainBooking = dayBookings.find(b => b.status === 'PENDING');
      }

      cells.push({
        day,
        dateStr,
        status,
        bookingDetails: mainBooking
      });
    }

    return cells;
  }, [year, month, daysInMonth, firstDayIndex, bookings, serviceId]);

  // Navegación de meses
  const handlePrevMonth = () => {
    if (month === 0) {
      onMonthChange(year - 1, 11);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      onMonthChange(year + 1, 0);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  function useMemo<T>(factory: () => T, deps: React.DependencyList): T {
    return React.useMemo(factory, deps);
  }

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Background lights */}
      <div className="absolute -top-16 -left-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header del Calendario */}
      <div className="flex items-center justify-between mb-6 z-10 relative">
        <div className="space-y-1">
          <h4 className="text-sm font-black text-slate-100 uppercase tracking-wide">
            {monthNames[month]} {year}
          </h4>
          <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
            CALENDARIO DE DISPONIBILIDAD
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-350 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="Mes anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-350 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="Siguiente mes"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nombres de los días */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[10px] font-bold text-slate-400 font-mono tracking-wider">
        {weekDays.map(d => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-2 z-10 relative">
        {calendarCells.map((cell, idx) => {
          // Si es una celda de offset vacía
          if (cell.day === null) {
            return (
              <div
                key={`empty-${idx}`}
                className="aspect-square bg-slate-900/20 border border-transparent rounded-xl"
              />
            );
          }

          let cellClass = 'bg-emerald-500 hover:bg-emerald-450 text-white shadow-[0_0_8px_rgba(16,185,129,0.25)] border-emerald-600';
          let tooltipTitle = 'Disponible';
          let tooltipDesc = 'Sin reservas registradas';

          if (cell.status === 'PAID') {
            cellClass = 'bg-rose-600 hover:bg-rose-550 text-white shadow-[0_0_8px_rgba(225,29,72,0.35)] border-rose-700';
            tooltipTitle = 'Ocupado (PAID)';
            tooltipDesc = cell.bookingDetails?.travelerEmail || 'Reservado y liquidado';
          } else if (cell.status === 'PENDING') {
            cellClass = 'bg-amber-400 hover:bg-amber-350 text-slate-950 shadow-[0_0_8px_rgba(251,191,36,0.35)] border-amber-500';
            tooltipTitle = 'Apartado (PENDING)';
            tooltipDesc = cell.bookingDetails?.travelerEmail || 'Apartado sin liquidar';
          }

          return (
            <div
              key={`day-${cell.day}`}
              className={`aspect-square border rounded-xl flex flex-col items-center justify-center text-xs font-black relative cursor-pointer transition-all duration-300 hover:scale-[1.05] ${cellClass}`}
              title={`${cell.dateStr} - ${tooltipTitle}: ${tooltipDesc}`}
            >
              <span>{cell.day}</span>
              {cell.status !== 'AVAILABLE' && (
                <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                  cell.status === 'PAID' ? 'bg-white' : 'bg-slate-950'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Leyenda del Calendario */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-[9px] font-semibold text-slate-350 bg-slate-950/60 p-3 rounded-2xl border border-slate-900 w-full z-10 relative">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Apartado (Pendiente)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-600" />
          <span>Ocupado (Pagado)</span>
        </div>
      </div>
    </div>
  );
}
