/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, Home, Compass, MapPin, AlertTriangle, Users, DollarSign, Award, BookOpen, Smile, Key
} from 'lucide-react';
import { formatCurrency } from '../../../../../shared/utils/formatCurrency';
import AvailabilityCalendar from '../components/AvailabilityCalendar';

interface PropertyRentalModuleProps {
  services: any[];
  bookings: any[];
}

export default function PropertyRentalModule({ services, bookings }: PropertyRentalModuleProps) {
  // 1. Filtrar servicios de tipo PROPERTY_RENTAL
  const rentalServices = useMemo(() => {
    return services.filter(s => s.type === 'PROPERTY_RENTAL');
  }, [services]);

  // 2. Estados de selección
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(() => new Date().getMonth()); // 0-11

  // 3. Inicializar servicio seleccionado
  useEffect(() => {
    if (rentalServices.length > 0 && !selectedServiceId) {
      setSelectedServiceId(rentalServices[0].id);
    }
  }, [rentalServices, selectedServiceId]);

  const selectedService = useMemo(() => {
    return rentalServices.find(s => s.id === selectedServiceId) || null;
  }, [rentalServices, selectedServiceId]);

  // 4. Calcular días del mes seleccionado
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  // 5. Filtrar reservas correspondientes a este mes y año
  const activeMonthBookings = useMemo(() => {
    if (!selectedServiceId) return [];

    return bookings.filter(b => {
      if (b.serviceId !== selectedServiceId) return false;
      if (b.status === 'CANCELLED') return false;
      if (!b.date) return false;

      // b.date en formato YYYY-MM-DD
      const parts = b.date.split('-');
      if (parts.length < 3) return false;
      
      const bYear = Number(parts[0]);
      const bMonth = Number(parts[1]) - 1; // 0-indexed en JS

      return bYear === selectedYear && bMonth === selectedMonth;
    });
  }, [bookings, selectedServiceId, selectedYear, selectedMonth]);

  // 6. Lógica de cálculo de KPIs diarios
  const { paidNights, pendingNights, availableNights, monthlyRevenue, occupancyRate } = useMemo(() => {
    let paid = 0;
    let pending = 0;
    let revenue = 0;

    // Recorrer cada día del mes para ver su estado único de ocupación
    for (let day = 1; day <= daysInMonth; day++) {
      const formattedMonth = String(selectedMonth + 1).padStart(2, '0');
      const formattedDay = String(day).padStart(2, '0');
      const dateStr = `${selectedYear}-${formattedMonth}-${formattedDay}`;

      // Encontrar bookings para esta fecha específica
      const dayBookings = activeMonthBookings.filter(b => b.date === dateStr);

      if (dayBookings.some(b => b.status === 'PAID')) {
        paid++;
      } else if (dayBookings.some(b => b.status === 'PENDING')) {
        pending++;
      }
    }

    // Ingresos mensuales de reservas activas del mes
    activeMonthBookings.forEach(b => {
      revenue += Number(b.totalPrice || 0);
    });

    const occupied = paid + pending;
    const available = daysInMonth - occupied;
    const rate = daysInMonth > 0 ? (occupied / daysInMonth) * 100 : 0;

    return {
      paidNights: paid,
      pendingNights: pending,
      availableNights: available,
      monthlyRevenue: revenue,
      occupancyRate: rate
    };
  }, [activeMonthBookings, daysInMonth, selectedYear, selectedMonth]);

  // Cambiar el mes desde el calendario
  const handleMonthChange = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  if (rentalServices.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-8 flex flex-col items-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
          <Home className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-800 uppercase">Sin propiedades registradas</h3>
          <p className="text-xs text-slate-500 font-medium">
            Este módulo requiere que tengas al menos un servicio registrado con la categoría <code className="bg-slate-105 px-1 py-0.5 rounded text-emerald-600 font-bold">PROPERTY_RENTAL</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-250/60 pb-5">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center justify-center">
            <Home className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              Gestión de Renta de Propiedades
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Calendario y control operativo de reservas para alojamientos y casas completas.
            </p>
          </div>
        </div>

        {/* Selector de Propiedad */}
        <div className="w-full md:w-72">
          <label className="block text-[10px] font-extrabold text-slate-450 uppercase font-mono tracking-wider mb-1">
            Seleccionar Propiedad / Renta
          </label>
          <div className="relative">
            <select
              value={selectedServiceId}
              onChange={e => setSelectedServiceId(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-550/20 text-xs outline-none appearance-none cursor-pointer font-bold text-slate-800 shadow-sm"
            >
              {rentalServices.map(service => (
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
          
          {/* Ficha de Detalles de la Propiedad */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                  {selectedService?.name}
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                  <span>{selectedService?.location || 'Ubicación no especificada'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 font-bold block uppercase font-mono tracking-wider">PRECIO POR NOCHE</span>
                <span className="font-black text-emerald-600 text-lg leading-none mt-1 block">
                  {selectedService?.price ? `${formatCurrency(selectedService.price)} MXN` : 'Precio no definido'}
                </span>
              </div>
            </div>

            {/* Reglas y Amenities */}
            <div className="grid sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs">
              {/* Amenities */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase font-mono tracking-wide flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5 text-slate-500" /> Servicos incluidos / Amenities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedService?.amenities && Array.isArray(selectedService.amenities) && selectedService.amenities.length > 0 ? (
                    selectedService.amenities.map((a: string, i: number) => (
                      <span key={i} className="bg-slate-50 border border-slate-200/60 text-slate-600 text-[10px] py-1 px-2.5 rounded-lg font-bold">
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-450 text-[10px] font-medium italic">Sin servicios reportados</span>
                  )}
                </div>
              </div>

              {/* Reglas de la casa */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase font-mono tracking-wide flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" /> Reglas de la Casa
                </span>
                <div className="text-[10px] text-slate-500 leading-relaxed">
                  {selectedService?.rules ? (
                    <p className="font-medium">{selectedService.rules}</p>
                  ) : (
                    <p className="italic">No se han registrado normas específicas para esta propiedad.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* KPIs del mes */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            
            {/* Ocupadas */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">NOCHES OCUPADAS</span>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className="text-xl font-black text-rose-600">{paidNights}</span>
                <span className="text-[9px] text-slate-550 font-bold ml-1">noches</span>
              </div>
            </div>

            {/* Pendientes */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">NOCHES PENDIENTES</span>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className="text-xl font-black text-amber-500">{pendingNights}</span>
                <span className="text-[9px] text-slate-550 font-bold ml-1">noches</span>
              </div>
            </div>

            {/* Disponibles */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">DISPONIBLES</span>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className="text-xl font-black text-emerald-600">{availableNights}</span>
                <span className="text-[9px] text-slate-550 font-bold ml-1">noches</span>
              </div>
            </div>

            {/* Ocupación Porcentual */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">OCUPACIÓN</span>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className="text-xl font-black text-slate-800">{occupancyRate.toFixed(0)}%</span>
                <span className="text-[9px] text-slate-550 font-bold ml-1">del mes</span>
              </div>
            </div>

            {/* Ingresos Estimados del Mes */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">INGRESOS MES</span>
              <div className="mt-1">
                <span className="text-xs font-black text-slate-900 block truncate" title={`${formatCurrency(monthlyRevenue)} MXN`}>
                  {formatCurrency(monthlyRevenue)}
                </span>
                <span className="text-[8px] text-emerald-600 font-bold font-mono">MXN</span>
              </div>
            </div>
          </div>

          {/* Listado de Reservas del Mes */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-4">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Manifiesto de Rentas del Mes ({activeMonthBookings.length})</span>
            </h3>

            {activeMonthBookings.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-150 border-dashed text-slate-400 text-xs font-semibold">
                No hay reservas registradas para este mes.
              </div>
            ) : (
              <div className="overflow-hidden border border-slate-150 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-450 uppercase font-mono">
                      <th className="p-3">Huésped (Email)</th>
                      <th className="p-3 text-center">Noche / Fecha</th>
                      <th className="p-3 text-center">Estado</th>
                      <th className="p-3 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeMonthBookings
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-semibold text-slate-850 truncate max-w-[180px]">
                            {booking.travelerEmail}
                          </td>
                          <td className="p-3 text-center font-mono text-[10px] text-slate-600 font-bold">
                            {booking.date}
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

        {/* Lado Derecho: Calendario Visual */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <AvailabilityCalendar
            serviceId={selectedServiceId}
            bookings={bookings}
            year={selectedYear}
            month={selectedMonth}
            onMonthChange={handleMonthChange}
          />
        </div>
      </div>
    </div>
  );
}
