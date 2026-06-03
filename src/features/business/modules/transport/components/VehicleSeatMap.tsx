/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, User } from 'lucide-react';

interface VehicleSeatMapProps {
  capacity: number;
  paidSlots: number;
  pendingSlots: number;
}

export default function VehicleSeatMap({ capacity, paidSlots, pendingSlots }: VehicleSeatMapProps) {
  // Generar array de asientos con su estado secuencial
  const seats = React.useMemo(() => {
    return Array.from({ length: capacity }, (_, i) => {
      let status: 'PAID' | 'PENDING' | 'AVAILABLE' = 'AVAILABLE';
      if (i < paidSlots) {
        status = 'PAID';
      } else if (i < paidSlots + pendingSlots) {
        status = 'PENDING';
      }
      return {
        id: i + 1,
        status,
      };
    });
  }, [capacity, paidSlots, pendingSlots]);

  // Agrupamiento visual: 3 columnas de asientos con un pasillo virtual
  // Fila frontal: Chofer + Copiloto (Asiento 1)
  // Resto de las filas: Distribución 2 + Pasillo + 1 o similar. Para fines genéricos,
  // pintamos un layout de 3 columnas (columna izquierda, pasillo central virtual, columnas derecha)
  // o simplemente un grid de 3 columnas donde la del medio es el pasillo y los asientos se acomodan a los lados.
  // Para que luzca como van turística:
  // Columnas: [Asiento Izq] [Asiento Central] [Pasillo] [Asiento Der]
  // Pero para simplicidad responsiva y soporte de cualquier capacidad, usaremos un grid de 3 columnas de asientos,
  // y renderizaremos los asientos de manera que parezca la cabina de un shuttle.

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-inner max-w-sm mx-auto">
      {/* Cabina del Conductor / Frontal de la Van */}
      <div className="w-full border-2 border-slate-300 rounded-t-[32px] bg-slate-100 p-4 pb-2 mb-4 relative overflow-hidden">
        {/* Parabrisas delantero */}
        <div className="w-[90%] h-3 bg-slate-800 rounded-t-lg mx-auto mb-4 opacity-90" />
        
        {/* Espejos laterales */}
        <div className="absolute -left-1 top-6 w-1 h-3 bg-slate-650 rounded-l" />
        <div className="absolute -right-1 top-6 w-1 h-3 bg-slate-650 rounded-r" />

        <div className="flex justify-between items-center px-4">
          {/* Volante y asiento del chofer */}
          <div className="flex flex-col items-center space-y-1">
            <div className="w-8 h-8 rounded-full border-4 border-slate-700 flex items-center justify-center bg-slate-200">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Chofer</span>
          </div>

          {/* Letrero del Vehículo / Panel */}
          <div className="bg-slate-800 text-emerald-450 px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest text-center shadow-inner">
            SHUTTLE
          </div>

          {/* Asiento Copiloto (si la capacidad >= 1, tomamos el Asiento 1 aquí) */}
          {seats.length > 0 ? (
            <div className="flex flex-col items-center">
              <div 
                className={`w-9 h-9 rounded-xl border flex flex-col items-center justify-center text-[10px] font-black shadow-sm transition-all ${
                  seats[0].status === 'PAID'
                    ? 'bg-blue-600 border-blue-700 text-white'
                    : seats[0].status === 'PENDING'
                    ? 'bg-amber-450 border-amber-500 text-slate-900 animate-pulse'
                    : 'bg-emerald-500 border-emerald-600 text-white'
                }`}
              >
                1
              </div>
              <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase">Copiloto</span>
            </div>
          ) : (
            <div className="w-9 h-9 border border-dashed border-slate-300 rounded-xl" />
          )}
        </div>
      </div>

      {/* Compartimento de Pasajeros */}
      <div className="border-2 border-slate-200 rounded-b-2xl bg-white p-4 space-y-4 shadow-sm">
        {/* Distribución de asientos traseros (del asiento 2 en adelante) */}
        <div className="grid grid-cols-3 gap-y-4 gap-x-2 justify-items-center">
          {seats.slice(1).map((seat) => {
            let seatColor = 'bg-emerald-500 border-emerald-600 text-white';
            if (seat.status === 'PAID') {
              seatColor = 'bg-blue-600 border-blue-700 text-white';
            } else if (seat.status === 'PENDING') {
              seatColor = 'bg-amber-450 border-amber-500 text-slate-900 animate-pulse';
            }

            return (
              <div key={seat.id} className="flex flex-col items-center">
                <div 
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center text-[10px] font-black shadow-sm hover:scale-105 transition-transform ${seatColor}`}
                  title={`Asiento ${seat.id}: ${seat.status}`}
                >
                  {seat.id}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pasillo central de salida de emergencia */}
        <div className="border-t border-dashed border-slate-250 pt-3 flex justify-between items-center text-[9px] font-bold text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            Salida de Emergencia
          </span>
          <span className="uppercase font-mono tracking-wider">Atrás</span>
        </div>
      </div>

      {/* Acotaciones de color */}
      <div className="grid grid-cols-3 gap-2 mt-5 text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-150 p-2.5 rounded-xl">
        <div className="flex items-center gap-1.5 justify-center">
          <span className="w-3 h-3 bg-blue-600 border border-blue-700 rounded-md block shrink-0" />
          <span>Pago ({paidSlots})</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          <span className="w-3 h-3 bg-amber-450 border border-amber-500 rounded-md block shrink-0" />
          <span>Pendiente ({pendingSlots})</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          <span className="w-3 h-3 bg-emerald-500 border border-emerald-600 rounded-md block shrink-0" />
          <span>Libre ({Math.max(0, capacity - paidSlots - pendingSlots)})</span>
        </div>
      </div>
    </div>
  );
}
