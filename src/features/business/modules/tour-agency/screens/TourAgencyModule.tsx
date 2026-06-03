/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Compass, Calendar, Clock, Users, Compass as CompassIcon, AlertTriangle, TrendingUp, HelpCircle, MapPin, Award, ShieldAlert
} from 'lucide-react';
import { formatCurrency } from '../../../../../shared/utils/formatCurrency';
import DepartureBoard from '../components/DepartureBoard';

interface TourAgencyModuleProps {
  services: any[];
  bookings: any[];
}

export default function TourAgencyModule({ services, bookings }: TourAgencyModuleProps) {
  // 1. Filtrar servicios de tipo TOUR_AGENCY
  const agencyServices = useMemo(() => {
    return services.filter(s => s.type === 'TOUR_AGENCY');
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
    if (agencyServices.length > 0 && !selectedServiceId) {
      setSelectedServiceId(agencyServices[0].id);
    }
  }, [agencyServices, selectedServiceId]);

  const selectedService = useMemo(() => {
    return agencyServices.find(s => s.id === selectedServiceId) || null;
  }, [agencyServices, selectedServiceId]);

  // 4. Configurar horarios de salida (con Fallbacks YYYY-MM-DD)
  const departureTimes = useMemo(() => {
    if (selectedService?.departureTimes && Array.isArray(selectedService.departureTimes) && selectedService.departureTimes.length > 0) {
      return selectedService.departureTimes;
    }
    // Fallback MVP: 09:00, 13:00, 17:00
    return ['09:00', '13:00', '17:00'];
  }, [selectedService]);

  // 5. Configurar capacidad con fallback
  const capacity = useMemo(() => {
    if (!selectedService) return 12;
    const cap = Number(selectedService.capacity);
    return isNaN(cap) || cap <= 0 ? 12 : cap;
  }, [selectedService]);

  const guideName = selectedService?.guideName || 'Guía por asignar';
  const duration = selectedService?.duration || '2 horas';

  // 6. Filtrar reservas del día para esta agencia
  const activeDayBookings = useMemo(() => {
    if (!selectedServiceId) return [];

    return bookings.filter(b => {
      return b.serviceId === selectedServiceId &&
             b.date === selectedDate &&
             b.status !== 'CANCELLED';
    });
  }, [bookings, selectedServiceId, selectedDate]);

  // 7. Calcular métricas operacionales consolidadas
  const kpis = useMemo(() => {
    let departuresCount = departureTimes.length;
    let expectedClients = 0;
    let revenue = 0;
    let almostFullCount = 0;

    // Calcular ocupación por horario para determinar cuántas salidas están "Casi llenas"
    // Clasificar bookings por horario
    const grouped: { [key: string]: number } = {};
    departureTimes.forEach(t => {
      grouped[t] = 0;
    });

    activeDayBookings.forEach(b => {
      const slotsCount = Number(b.slots || 1);
      expectedClients += slotsCount;
      revenue += Number(b.totalPrice || 0);

      if (b.departureTime && grouped[b.departureTime] !== undefined) {
        grouped[b.departureTime] += slotsCount;
      }
    });

    // Contar las salidas "Casi llenas" (availableSlots entre 1 y 3)
    departureTimes.forEach(time => {
      const occupied = grouped[time] || 0;
      const available = capacity - occupied;
      if (available >= 1 && available <= 3) {
        almostFullCount++;
      }
    });

    // Cupos disponibles totales = (capacidad * salidas) - ocupados
    const totalCapacity = capacity * departuresCount;
    const availableSlots = Math.max(0, totalCapacity - expectedClients);

    return {
      departuresCount,
      expectedClients,
      availableSlots,
      dailyRevenue: revenue,
      almostFullCount
    };
  }, [departureTimes, activeDayBookings, capacity]);

  if (agencyServices.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-8 flex flex-col items-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-800 uppercase">Sin servicios de agencia</h3>
          <p className="text-xs text-slate-500 font-medium">
            Este módulo requiere que tengas al menos un servicio registrado con la categoría <code className="bg-slate-105 px-1 py-0.5 rounded text-emerald-600 font-bold">TOUR_AGENCY</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-250/60 pb-5">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              Consola de Operación de Tours
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Supervisión de salidas programadas, asignación de guías y cupos de pasajeros.
            </p>
          </div>
        </div>

        {/* Selector de Aventura */}
        <div className="w-full md:w-72">
          <label className="block text-[10px] font-extrabold text-slate-450 uppercase font-mono tracking-wider mb-1">
            Seleccionar Aventura / Tour
          </label>
          <div className="relative">
            <select
              value={selectedServiceId}
              onChange={e => setSelectedServiceId(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-550/20 text-xs outline-none appearance-none cursor-pointer font-bold text-slate-800 shadow-sm"
            >
              {agencyServices.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <CompassIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Lado Izquierdo: Tablero de Salidas */}
        <div className="lg:col-span-8 space-y-6">
          {/* Selector de fecha */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Consola Operativa</span>
            </h3>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-450 uppercase font-mono tracking-wider mb-1.5">
                Fecha del Manifiesto
              </label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full max-w-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all font-semibold text-slate-850"
              />
            </div>
          </div>

          {/* Departure Board */}
          <DepartureBoard
            times={departureTimes}
            capacity={capacity}
            guideName={guideName}
            bookings={activeDayBookings}
            tourName={selectedService?.name || ''}
          />
        </div>

        {/* Lado Derecho: KPIs e Info del Tour */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* KPIs del Día */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Estadísticas de la Jornada</span>
            </h3>

            <div className="space-y-4 text-xs">
              {/* Salidas Programadas */}
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 font-semibold">Salidas Agendadas</span>
                <span className="font-extrabold text-slate-800">{kpis.departuresCount} salidas</span>
              </div>

              {/* Clientes Esperados */}
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 font-semibold">Clientes Esperados</span>
                <span className="font-extrabold text-slate-800">{kpis.expectedClients} pasajeros</span>
              </div>

              {/* Cupos Disponibles */}
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 font-semibold">Cupos Libres Totales</span>
                <span className="font-extrabold text-emerald-600">{kpis.availableSlots} lugares</span>
              </div>

              {/* Tours Casi Llenos */}
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 font-semibold">Salidas Casi Llenas</span>
                <span className={`font-extrabold ${kpis.almostFullCount > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-800'}`}>
                  {kpis.almostFullCount} salidas
                </span>
              </div>

              {/* Ingresos Diarios */}
              <div className="flex justify-between items-center pt-2 text-sm">
                <span className="text-slate-500 font-bold">Ingresos Estimados</span>
                <span className="font-black text-emerald-700 font-mono">
                  {formatCurrency(kpis.dailyRevenue)} MXN
                </span>
              </div>
            </div>
          </div>

          {/* Ficha Técnica de la Aventura */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Ficha Técnica</span>
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-start gap-2 text-xs">
                <div>
                  <span className="text-[9px] text-slate-450 font-bold block uppercase font-mono tracking-wider">UBICACIÓN</span>
                  <span className="font-bold text-slate-700 mt-1 block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {selectedService?.location}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-455 font-bold block uppercase font-mono tracking-wider">DURACIÓN</span>
                  <span className="font-bold text-slate-700 mt-1 block flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {duration}
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <span className="text-[9px] text-slate-450 font-bold block uppercase font-mono tracking-wider">DESCRIPCIÓN DEL TOUR</span>
                <p className="text-slate-500 font-light leading-relaxed mt-1">
                  {selectedService?.description || 'Sin descripción detallada.'}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase font-mono tracking-wider">PRECIO INDIVIDUAL</span>
                  <span className="font-black text-slate-900 text-sm mt-0.5 block">
                    {selectedService?.price ? `${formatCurrency(selectedService.price)} MXN` : 'Precio no definido'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase py-1 px-3 rounded-full">
                    Tour Activo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
