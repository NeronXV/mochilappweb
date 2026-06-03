/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Anchor, Calendar, Clock, AlertTriangle, Users, Compass, ShieldAlert, Award, Ship
} from 'lucide-react';
import { formatCurrency } from '../../../../../shared/utils/formatCurrency';
import BoatSeatMap from '../components/BoatSeatMap';

interface BoatTourModuleProps {
  services: any[];
  bookings: any[];
}

export default function BoatTourModule({ services, bookings }: BoatTourModuleProps) {
  // 1. Filtrar servicios de tipo BOAT_TOUR
  const boatServices = useMemo(() => {
    return services.filter(s => s.type === 'BOAT_TOUR');
  }, [services]);

  // 2. Estados de selección
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [selectedTime, setSelectedTime] = useState<string>('');

  // 3. Inicializar servicio seleccionado
  useEffect(() => {
    if (boatServices.length > 0 && !selectedServiceId) {
      setSelectedServiceId(boatServices[0].id);
    }
  }, [boatServices, selectedServiceId]);

  const selectedService = useMemo(() => {
    return boatServices.find(s => s.id === selectedServiceId) || null;
  }, [boatServices, selectedServiceId]);

  // 4. Inicializar horario seleccionado si el servicio cuenta con departureTimes
  useEffect(() => {
    if (selectedService?.departureTimes && selectedService.departureTimes.length > 0) {
      setSelectedTime(selectedService.departureTimes[0]);
    } else {
      setSelectedTime('');
    }
  }, [selectedService]);

  // 5. Capacidad con fallback seguro
  const capacity = useMemo(() => {
    if (!selectedService) return 12;
    const cap = Number(selectedService.capacity);
    return isNaN(cap) || cap <= 0 ? 12 : cap;
  }, [selectedService]);

  // 6. Lógica de filtrado de reservas
  const activeBookings = useMemo(() => {
    if (!selectedServiceId) return [];

    return bookings.filter(b => {
      // Coincidir con el servicio
      if (b.serviceId !== selectedServiceId) return false;
      // Coincidir con la fecha
      if (b.date !== selectedDate) return false;
      // Excluir canceladas
      if (b.status === 'CANCELLED') return false;

      // Si el servicio tiene horarios definidos y hay un horario seleccionado
      if (selectedService?.departureTimes && selectedService.departureTimes.length > 0 && selectedTime) {
        // Si el booking tiene un horario específico, debe coincidir
        if (b.departureTime) {
          return b.departureTime === selectedTime;
        }
        // Si el booking NO tiene horario, se considera reserva general del día
        return true;
      }

      return true;
    });
  }, [bookings, selectedServiceId, selectedDate, selectedTime, selectedService]);

  // 7. Cálculos de cupos
  const { paidSlots, pendingSlots, occupiedSlots, availableSlots } = useMemo(() => {
    let paid = 0;
    let pending = 0;

    activeBookings.forEach(b => {
      const slotsCount = Number(b.slots || 1);
      if (b.status === 'PAID') {
        paid += slotsCount;
      } else if (b.status === 'PENDING') {
        pending += slotsCount;
      }
    });

    const occupied = paid + pending;
    const available = capacity - occupied;

    return {
      paidSlots: paid,
      pendingSlots: pending,
      occupiedSlots: occupied,
      availableSlots: available
    };
  }, [activeBookings, capacity]);

  if (boatServices.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-8 flex flex-col items-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600">
          <Anchor className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-800 uppercase">Sin servicios marítimos</h3>
          <p className="text-xs text-slate-500 font-medium">
            Este módulo requiere que tengas al menos un servicio registrado con la categoría <code className="bg-slate-105 px-1 py-0.5 rounded text-cyan-600 font-bold">BOAT_TOUR</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-250/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-cyan-650/10 text-cyan-700 rounded-2xl border border-cyan-100 flex items-center justify-center">
              <Anchor className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                Control de Embarcaciones
              </h2>
              <p className="text-xs text-slate-500 font-medium">Visualización de salidas, ocupación y cupos en tiempo real.</p>
            </div>
          </div>
        </div>
        
        {/* Selector de Servicio Activo */}
        <div className="w-full md:w-72">
          <label className="block text-[10px] font-extrabold text-slate-450 uppercase font-mono tracking-wider mb-1">
            Seleccionar Embarcación / Tour
          </label>
          <div className="relative">
            <select
              value={selectedServiceId}
              onChange={e => setSelectedServiceId(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-550/20 text-xs outline-none appearance-none cursor-pointer font-bold text-slate-800 shadow-sm"
            >
              {boatServices.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Lado Izquierdo: Controles, KPIs y Listado */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Controles de Filtro (Fecha y Horarios) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>Programación de Salida</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Selector de Fecha */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-450 uppercase font-mono tracking-wider mb-1.5">
                  Fecha de Salida
                </label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 text-xs outline-none transition-all font-semibold text-slate-850"
                />
              </div>

              {/* Selector de Horarios (Condicional) */}
              {selectedService?.departureTimes && selectedService.departureTimes.length > 0 ? (
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-450 uppercase font-mono tracking-wider mb-1.5">
                    Horario de Salida
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.departureTimes.map((time: string) => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            isSelected 
                              ? 'bg-cyan-600 border-cyan-700 text-white shadow-sm' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{time}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-150 border-dashed text-slate-400 text-[10px] font-semibold">
                  <Clock className="w-4 h-4 mr-2" />
                  Salida única por fecha general
                </div>
              )}
            </div>
          </div>

          {/* Tarjetas de Métricas / KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Capacidad */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">CAPACIDAD BOTE</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{capacity}</span>
                <span className="text-[10px] text-slate-550 font-bold">lugares</span>
              </div>
            </div>

            {/* Pagados (PAID) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">PAGADOS (PAID)</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-rose-600">{paidSlots}</span>
                <span className="text-[10px] text-slate-550 font-bold">lugares</span>
              </div>
            </div>

            {/* Pendientes (PENDING) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">APARTADOS (PEND)</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-amber-500">{pendingSlots}</span>
                <span className="text-[10px] text-slate-550 font-bold">lugares</span>
              </div>
            </div>

            {/* Disponibles */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">DISPONIBLES</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className={`text-2xl font-black ${availableSlots < 0 ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`}>
                  {availableSlots}
                </span>
                <span className="text-[10px] text-slate-550 font-bold">lugares</span>
              </div>
            </div>
          </div>

          {/* Alertas de Sobrecupo */}
          {availableSlots < 0 && (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-5 flex items-start gap-3.5 shadow-sm animate-pulse">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-2xl border border-rose-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-rose-900 uppercase tracking-wide">¡ALERTA DE SOBREVENTA!</h4>
                <p className="text-[11px] text-rose-700 font-medium leading-relaxed">
                  Las reservas activas ({occupiedSlots}) superan la capacidad autorizada de la embarcación ({capacity}) por{' '}
                  <strong className="font-extrabold">{Math.abs(availableSlots)} lugar(es)</strong>. Por favor reubique a los pasajeros excedentes o modifique el aforo.
                </p>
              </div>
            </div>
          )}

          {/* Breve Listado Operativo de Reservas */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-600" />
                <span>Manifiesto de Pasajeros ({activeBookings.length})</span>
              </h3>
              {selectedService?.price && (
                <span className="text-[10px] text-slate-500 font-bold font-mono">
                  PRECIO: {formatCurrency(selectedService.price)} MXN
                </span>
              )}
            </div>

            {activeBookings.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-150 border-dashed text-slate-400 text-xs">
                No hay reservas registradas para esta fecha{selectedTime ? ` a las ${selectedTime}` : ''}.
              </div>
            ) : (
              <div className="overflow-hidden border border-slate-150 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-450 uppercase font-mono">
                      <th className="p-3">Viajero (Email)</th>
                      <th className="p-3 text-center">Lugares</th>
                      <th className="p-3 text-center">Estado</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-semibold text-slate-850 truncate max-w-[180px]">
                          {booking.travelerEmail}
                        </td>
                        <td className="p-3 text-center font-bold text-slate-800">
                          {booking.slots}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                            booking.status === 'PAID'
                              ? 'bg-rose-50 border-rose-200 text-rose-700'
                              : 'bg-amber-50 border-amber-255 text-amber-700'
                          }`}>
                            {booking.status === 'PAID' ? 'PAGADO' : 'PENDIENTE'}
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900">
                          {formatCurrency(booking.totalPrice)} MXN
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Lado Derecho: Renderizado de la Lancha Visual */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 self-start mb-6">
              <Ship className="w-4 h-4 text-cyan-600 animate-bounce" />
              <span>Distribución de Ocupación</span>
            </h3>

            {/* Renderizado de la Lancha */}
            <BoatSeatMap
              capacity={capacity}
              paidSlots={paidSlots}
              pendingSlots={pendingSlots}
              availableSlots={availableSlots}
            />

            {/* Info aclaratoria */}
            <p className="text-[10px] text-slate-400 mt-6 text-center leading-relaxed max-w-xs font-medium">
              Nota: La distribución gráfica muestra la cantidad de asientos ocupados de forma secuencial. El orden de asignación visual es de popa a proa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
