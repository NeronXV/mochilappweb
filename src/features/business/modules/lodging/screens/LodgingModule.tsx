/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Home, Calendar, Clock, AlertTriangle, Users, Compass, ShieldAlert, Award, Bed, Sparkles, TrendingUp
} from 'lucide-react';
import { formatCurrency } from '../../../../../shared/utils/formatCurrency';
import RoomGrid from '../components/RoomGrid';

interface LodgingModuleProps {
  services: any[];
  bookings: any[];
}

export default function LodgingModule({ services, bookings }: LodgingModuleProps) {
  // 1. Filtrar servicios de hospedaje (HOTEL o HOSTEL)
  const lodgingServices = useMemo(() => {
    return services.filter(s => s.type === 'HOTEL' || s.type === 'HOSTEL');
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

  // 3. Inicializar servicio seleccionado
  useEffect(() => {
    if (lodgingServices.length > 0 && !selectedServiceId) {
      setSelectedServiceId(lodgingServices[0].id);
    }
  }, [lodgingServices, selectedServiceId]);

  const selectedService = useMemo(() => {
    return lodgingServices.find(s => s.id === selectedServiceId) || null;
  }, [lodgingServices, selectedServiceId]);

  // 4. Determinar la capacidad / total de unidades
  const totalUnits = useMemo(() => {
    if (!selectedService) return 8;
    // Si tiene configuradas habitaciones fijas, su largo define las unidades
    if (selectedService.rooms && Array.isArray(selectedService.rooms) && selectedService.rooms.length > 0) {
      return selectedService.rooms.length;
    }
    // Si no, fallback de 8 unidades estándar
    return 8;
  }, [selectedService]);

  // 5. Filtrar reservas del día para este hospedaje
  const activeBookings = useMemo(() => {
    if (!selectedServiceId) return [];

    return bookings.filter(b => {
      return b.serviceId === selectedServiceId &&
             b.date === selectedDate &&
             b.status !== 'CANCELLED';
    });
  }, [bookings, selectedServiceId, selectedDate]);

  // 6. Calcular cupos e ingresos estimados del día
  const { paidUnits, pendingUnits, occupiedUnits, availableUnits, dayRevenue } = useMemo(() => {
    let paid = 0;
    let pending = 0;
    let revenue = 0;

    activeBookings.forEach(b => {
      const slotsCount = Number(b.slots || 1);
      revenue += Number(b.totalPrice || 0);

      if (b.status === 'PAID') {
        paid += slotsCount;
      } else if (b.status === 'PENDING') {
        pending += slotsCount;
      }
    });

    const occupied = paid + pending;
    const available = totalUnits - occupied;

    return {
      paidUnits: paid,
      pendingUnits: pending,
      occupiedUnits: occupied,
      availableUnits: available,
      dayRevenue: revenue
    };
  }, [activeBookings, totalUnits]);

  if (lodgingServices.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-8 flex flex-col items-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
          <Home className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-800 uppercase">Sin servicios de hospedaje</h3>
          <p className="text-xs text-slate-500 font-medium">
            Este módulo requiere que tengas al menos un servicio registrado con la categoría <code className="bg-slate-105 px-1 py-0.5 rounded text-emerald-600 font-bold">HOTEL</code> o <code className="bg-slate-105 px-1 py-0.5 rounded text-emerald-600 font-bold">HOSTEL</code>.
          </p>
        </div>
      </div>
    );
  }

  const isHotel = selectedService?.type === 'HOTEL';

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-250/60 pb-5">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center justify-center">
            {isHotel ? <Home className="w-6 h-6" /> : <Bed className="w-6 h-6" />}
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              Gestión de Hospedaje
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Control diario del aforo de {isHotel ? 'habitaciones' : 'camas literas'} e historial operativo.
            </p>
          </div>
        </div>

        {/* Selector de Alojamiento */}
        <div className="w-full md:w-72">
          <label className="block text-[10px] font-extrabold text-slate-450 uppercase font-mono tracking-wider mb-1">
            Seleccionar Establecimiento
          </label>
          <div className="relative">
            <select
              value={selectedServiceId}
              onChange={e => setSelectedServiceId(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-550/20 text-xs outline-none appearance-none cursor-pointer font-bold text-slate-800 shadow-sm"
            >
              {lodgingServices.map(service => (
                <option key={service.id} value={service.id}>
                  [{service.type}] {service.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Lado Izquierdo: Controles, KPIs y Manifiesto */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Selector de Fecha */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Agenda Operativa</span>
            </h3>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-450 uppercase font-mono tracking-wider mb-1.5">
                Fecha a Consultar
              </label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full max-w-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all font-semibold text-slate-850"
              />
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            
            {/* Total Unidades */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">TOTAL</span>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className="text-xl font-black text-slate-900">{totalUnits}</span>
                <span className="text-[9px] text-slate-500 font-bold ml-1">{isHotel ? 'habs' : 'camas'}</span>
              </div>
            </div>

            {/* Ocupadas */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">OCUPADAS</span>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className="text-xl font-black text-rose-600">{paidUnits}</span>
                <span className="text-[9px] text-slate-500 font-bold ml-1">{isHotel ? 'habs' : 'camas'}</span>
              </div>
            </div>

            {/* Reservadas */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">RESERVADAS</span>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className="text-xl font-black text-amber-500">{pendingUnits}</span>
                <span className="text-[9px] text-slate-500 font-bold ml-1">{isHotel ? 'habs' : 'camas'}</span>
              </div>
            </div>

            {/* Disponibles */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">LIBRES</span>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className={`text-xl font-black ${availableUnits < 0 ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`}>
                  {availableUnits}
                </span>
                <span className="text-[9px] text-slate-500 font-bold ml-1">{isHotel ? 'habs' : 'camas'}</span>
              </div>
            </div>

            {/* Ingresos Estimados */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">INGRESOS DÍA</span>
              <div className="mt-1">
                <span className="text-xs font-black text-slate-900 block truncate" title={`${formatCurrency(dayRevenue)} MXN`}>
                  {formatCurrency(dayRevenue)}
                </span>
                <span className="text-[8px] text-emerald-600 font-bold font-mono">MXN</span>
              </div>
            </div>
          </div>

          {/* Sobrecupo Alert */}
          {availableUnits < 0 && (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-5 flex items-start gap-3.5 shadow-sm animate-pulse">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-2xl border border-rose-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-rose-900 uppercase tracking-wide">¡SOBREVENTA CRÍTICA!</h4>
                <p className="text-[11px] text-rose-700 font-medium leading-relaxed">
                  Las habitaciones asignadas ({occupiedUnits}) superan la capacidad disponible ({totalUnits}) en{' '}
                  <strong className="font-extrabold">{Math.abs(availableUnits)} unidades</strong>. Por favor reubique a los huéspedes o cambie de habitación.
                </p>
              </div>
            </div>
          )}

          {/* Manifiesto de Reservas */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Manifiesto de Huéspedes ({activeBookings.length})</span>
              </h3>
              {selectedService?.price && (
                <span className="text-[10px] text-slate-500 font-bold font-mono">
                  PRECIO BASE: {formatCurrency(selectedService.price)} MXN/noche
                </span>
              )}
            </div>

            {activeBookings.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-150 border-dashed text-slate-400 text-xs">
                No hay check-ins programados para esta fecha.
              </div>
            ) : (
              <div className="overflow-hidden border border-slate-150 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-450 uppercase font-mono">
                      <th className="p-3">Huésped (Email)</th>
                      <th className="p-3 text-center">{isHotel ? 'Habitaciones' : 'Camas'}</th>
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
                              : 'bg-amber-50 border-amber-250 text-amber-700'
                          }`}>
                            {booking.status === 'PAID' ? 'PAGADA' : 'PENDIENTE'}
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

        {/* Lado Derecho: Grid Habitaciones */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Distribución de Planta
              </h3>
            </div>

            <RoomGrid
              serviceRooms={selectedService?.rooms}
              serviceType={selectedService?.type}
              paidUnits={paidUnits}
              pendingUnits={pendingUnits}
            />

            <p className="text-[10px] text-slate-400 text-center leading-relaxed font-medium">
              Nota: La distribución es secuencial de huéspedes basada en las reservas activas del día. Es estrictamente operacional para el MVP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
