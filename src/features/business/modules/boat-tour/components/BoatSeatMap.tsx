/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

interface BoatSeatMapProps {
  capacity: number;
  paidSlots: number;
  pendingSlots: number;
  availableSlots: number;
}

export default function BoatSeatMap({
  capacity,
  paidSlots,
  pendingSlots,
  availableSlots,
}: BoatSeatMapProps) {
  // Asegurar límites seguros y fallbacks
  const safeCapacity = Math.max(12, capacity);

  // Generar la lista secuencial de asientos
  // Rellenamos primero los ocupados (PAID), luego los apartados (PENDING), y el resto son disponibles
  const seats: Array<{ id: number; status: 'PAID' | 'PENDING' | 'AVAILABLE' }> = [];
  
  for (let i = 1; i <= safeCapacity; i++) {
    if (i <= paidSlots) {
      seats.push({ id: i, status: 'PAID' });
    } else if (i <= paidSlots + pendingSlots) {
      seats.push({ id: i, status: 'PENDING' });
    } else {
      seats.push({ id: i, status: 'AVAILABLE' });
    }
  }

  // Estructurar filas de asientos de dos en dos.
  // Si la capacidad es impar, la proa (primera fila) tendrá 1 asiento centrado, y el resto serán filas de 2.
  const isOdd = safeCapacity % 2 !== 0;
  const seatRows: Array<typeof seats> = [];

  let startIndex = 0;
  if (isOdd) {
    // Fila de proa con 1 asiento
    seatRows.push([seats[0]]);
    startIndex = 1;
  }

  for (let i = startIndex; i < seats.length; i += 2) {
    const row = seats.slice(i, i + 2);
    seatRows.push(row);
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl relative overflow-hidden max-w-md mx-auto w-full group">
      {/* Luces y Estética de Fondo Marino */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Título de Cabina */}
      <div className="mb-4 text-center z-10">
        <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
          VISTA DE CUBIERTA EN TIEMPO REAL
        </span>
      </div>

      {/* Contenedor de la Lancha */}
      <div className="relative flex flex-col items-center py-12 px-6 bg-slate-950 border-2 border-slate-700/80 rounded-t-[120px] rounded-b-[40px] shadow-2xl w-full max-w-[280px] transition-transform duration-500 group-hover:scale-[1.02]">
        
        {/* Proa (Punta de la lancha) y luz de navegación */}
        <div className="absolute top-2 w-3 h-3 bg-red-500 rounded-full animate-ping pointer-events-none" />
        <div className="absolute top-2 w-2 h-2 bg-emerald-500 rounded-full pointer-events-none" />

        {/* Parabrisas / Windshield de la Lancha */}
        <div className="absolute top-[45px] left-3 right-3 h-3 bg-cyan-500/30 border-y border-cyan-400/50 rounded-full backdrop-blur-sm pointer-events-none flex items-center justify-center">
          <div className="w-12 h-[1px] bg-cyan-300/40" />
        </div>

        {/* Cubierta Principal / Grid de Asientos */}
        <div className="w-full space-y-4 pt-4 z-10">
          {seatRows.map((row, rowIndex) => {
            const isSingleSeatRow = row.length === 1;

            return (
              <div 
                key={rowIndex} 
                className={`flex gap-6 justify-center ${isSingleSeatRow ? 'w-full' : ''}`}
              >
                {row.map((seat) => {
                  let statusBg = 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)] border-emerald-600';
                  let statusIcon = <CheckCircle className="w-3.5 h-3.5" />;
                  let label = 'Libre';

                  if (seat.status === 'PAID') {
                    statusBg = 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_10px_rgba(225,29,72,0.4)] border-rose-700';
                    statusIcon = <ShieldCheck className="w-3.5 h-3.5" />;
                    label = 'Pagado';
                  } else if (seat.status === 'PENDING') {
                    statusBg = 'bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-[0_0_10px_rgba(251,191,36,0.4)] border-amber-500';
                    statusIcon = <Clock className="w-3.5 h-3.5" />;
                    label = 'Apartado';
                  }

                  return (
                    <div
                      key={seat.id}
                      className={`w-11 h-11 rounded-xl border flex flex-col items-center justify-center text-[10px] font-bold transition-all relative cursor-pointer ${statusBg}`}
                      title={`Asiento ${seat.id} - ${label}`}
                    >
                      <span className="text-[9px] opacity-80 block mb-0.5 leading-none">{seat.id}</span>
                      {statusIcon}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Panel de Mandos / Motor de Popa */}
        <div className="w-16 h-4 bg-slate-800 border-x border-t border-slate-700 rounded-t-lg mt-8 flex items-center justify-center text-[7px] text-slate-400 font-mono tracking-widest">
          MOTOR OUTBOARD
        </div>
      </div>

      {/* Popa externa (Motor fuera de borda simulado) */}
      <div className="w-10 h-3 bg-slate-800 border-b border-x border-slate-700 rounded-b-md shadow-md z-0 -mt-[1px]" />

      {/* Guía rápida de Estados */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-[10px] font-semibold text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 w-full z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
          <span>Disponible ({availableSlots})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
          <span>Apartado ({pendingSlots})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-[0_0_5px_rgba(225,29,72,0.5)]" />
          <span>Pagado ({paidSlots})</span>
        </div>
      </div>
    </div>
  );
}
