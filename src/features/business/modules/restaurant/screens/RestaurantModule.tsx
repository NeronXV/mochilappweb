/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Coffee, Calendar, Clock, Utensils, Compass, Users, Sparkles, AlertTriangle, TrendingUp, HelpCircle, Store
} from 'lucide-react';
import { formatCurrency } from '../../../../../shared/utils/formatCurrency';
import MenuBoard from '../components/MenuBoard';

interface RestaurantModuleProps {
  services: any[];
  bookings: any[];
}

export default function RestaurantModule({ services, bookings }: RestaurantModuleProps) {
  // 1. Filtrar servicios gastronómicos (RESTAURANT o FOOD_STAND)
  const foodServices = useMemo(() => {
    return services.filter(s => s.type === 'RESTAURANT' || s.type === 'FOOD_STAND');
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

  // 3. Inicializar servicio gastronómico seleccionado
  useEffect(() => {
    if (foodServices.length > 0 && !selectedServiceId) {
      setSelectedServiceId(foodServices[0].id);
    }
  }, [foodServices, selectedServiceId]);

  const selectedService = useMemo(() => {
    return foodServices.find(s => s.id === selectedServiceId) || null;
  }, [foodServices, selectedServiceId]);

  const isFoodStand = selectedService?.type === 'FOOD_STAND';

  // 4. Filtrar reservas activas (no canceladas) de hoy
  const activeBookings = useMemo(() => {
    if (!selectedServiceId) return [];

    return bookings.filter(b => {
      return b.serviceId === selectedServiceId &&
             b.date === selectedDate &&
             b.status !== 'CANCELLED';
    });
  }, [bookings, selectedServiceId, selectedDate]);

  // 5. Contar menú ítems e ítems disponibles
  const menuStats = useMemo(() => {
    if (!selectedService) return { total: 0, available: 0 };
    
    // Si ya trae el menú en Firestore
    if (selectedService.menu && Array.isArray(selectedService.menu) && selectedService.menu.length > 0) {
      const total = selectedService.menu.length;
      const available = selectedService.menu.filter((m: any) => m.isAvailable !== false).length;
      return { total, available };
    }

    // Fallback: 4 platillos generados visualmente, de los cuales 3 están disponibles en stubs
    return { total: 4, available: 3 };
  }, [selectedService]);

  // 6. Calcular métricas del día (Reservas e ingresos)
  const { bookingsTodayCount, dailyRevenue } = useMemo(() => {
    let count = activeBookings.length;
    let revenue = 0;

    activeBookings.forEach(b => {
      revenue += Number(b.totalPrice || 0);
    });

    return {
      bookingsTodayCount: count,
      dailyRevenue: revenue
    };
  }, [activeBookings]);

  // 7. Estatus comercial y horarios
  const isOpen = selectedService?.isOpen !== false; // Fallback: Abierto
  const businessHours = selectedService?.businessHours || '12:00 PM - 10:00 PM';
  const todaySpecial = selectedService?.todaySpecial || selectedService?.name || 'Recomendado del Día';

  if (foodServices.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-8 flex flex-col items-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
          <Utensils className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-800 uppercase">Sin servicios gastronómicos</h3>
          <p className="text-xs text-slate-500 font-medium">
            Este módulo requiere que tengas al menos un servicio registrado con la categoría <code className="bg-slate-105 px-1 py-0.5 rounded text-emerald-600 font-bold">RESTAURANT</code> o <code className="bg-slate-105 px-1 py-0.5 rounded text-emerald-600 font-bold">FOOD_STAND</code>.
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
            {isFoodStand ? <Coffee className="w-6 h-6" /> : <Utensils className="w-6 h-6" />}
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              Gestión Gastronómica
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Control de menú digital, horarios de apertura y visualización del aforo de comandas.
            </p>
          </div>
        </div>

        {/* Selector de Negocio */}
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
              {foodServices.map(service => (
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

      {/* Grid Principal */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Lado Izquierdo: Controles, Estatus y Menú */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card de Estado Comercial */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 border shadow-sm ${
                isOpen ? 'bg-emerald-500 border-emerald-450' : 'bg-rose-500 border-rose-400'
              }`}>
                <Store className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase font-mono tracking-wider leading-none block">
                  ESTADO DEL SERVICIO
                </span>
                <h3 className="font-extrabold text-base text-slate-850">
                  {isOpen ? 'Abierto al Público' : 'Cerrado temporalmente'}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Horarios habituales: {businessHours}
                </p>
              </div>
            </div>

            {/* Banner de Especial/Promo */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex-1 max-w-sm flex items-start gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-amber-950 text-[6px] font-black uppercase px-2 py-0.5 rounded-bl font-mono">
                Flash
              </div>
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase font-mono leading-none block">ESPECIAL DE HOY</span>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{todaySpecial}</h4>
                <span className="text-[8px] text-slate-500 font-medium">Formulado del catálogo principal</span>
              </div>
            </div>
          </div>

          {/* Menú Digital Board */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-emerald-600" />
                <span>Menú del Establecimiento</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-bold font-mono">
                {menuStats.available} de {menuStats.total} platillos listados
              </span>
            </div>

            <MenuBoard
              serviceMenu={selectedService?.menu}
              serviceName={selectedService?.name || ''}
              serviceDescription={selectedService?.description || ''}
              servicePrice={selectedService?.price || 0}
              isFoodStand={isFoodStand}
            />
          </div>
        </div>

        {/* Lado Derecho: KPIs, Agenda del día y Manifiesto */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Agenda Operativa / Fecha */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Agenda de Comandas</span>
            </h3>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-450 uppercase font-mono tracking-wider mb-1.5">
                Fecha de Consulta
              </label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all font-semibold text-slate-850"
              />
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4">
            {/* Comandas de Hoy */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider font-mono">RESERVAS DÍA</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-800">
                  {isFoodStand ? '-' : bookingsTodayCount}
                </span>
                {!isFoodStand && <span className="text-[9px] text-slate-500 font-bold">visitas</span>}
              </div>
            </div>

            {/* Ingresos Estimados del Día */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider font-mono">INGRESOS DÍA</span>
              <div className="mt-2">
                <span className="text-xs font-black text-slate-800 block truncate" title={`${formatCurrency(dailyRevenue)} MXN`}>
                  {isFoodStand ? '-' : formatCurrency(dailyRevenue)}
                </span>
                {!isFoodStand && <span className="text-[8px] text-emerald-600 font-bold font-mono">MXN</span>}
              </div>
            </div>
          </div>

          {/* Manifiesto de Visitas (Condicional - Solo Restaurantes) */}
          {!isFoodStand ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-4">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Libro de Reservas ({activeBookings.length})</span>
              </h3>

              {activeBookings.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-150 border-dashed text-slate-400 text-xs font-medium">
                  Sin reservaciones de mesa registradas.
                </div>
              ) : (
                <div className="overflow-hidden border border-slate-150 rounded-2xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[9px] font-bold text-slate-450 uppercase font-mono">
                        <th className="p-2.5">Mesa / Huésped</th>
                        <th className="p-2.5 text-center">Lugares</th>
                        <th className="p-2.5 text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                          <td className="p-2.5 font-semibold text-slate-850 truncate max-w-[130px]" title={booking.travelerEmail}>
                            {booking.travelerEmail}
                          </td>
                          <td className="p-2.5 text-center font-bold text-slate-800">
                            {booking.slots}
                          </td>
                          <td className="p-2.5 text-right font-bold text-slate-900 font-mono text-[10px]">
                            {formatCurrency(booking.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-center items-center text-center space-y-2">
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                <Store className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-850">Puesto de Comida Rápida</h4>
                <p className="text-[10px] text-slate-550 leading-relaxed max-w-[200px] font-medium">
                  Las órdenes se sirven de forma directa por fila. No se administran reservas complejas en el stand.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
