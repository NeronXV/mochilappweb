/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Calendar, CreditCard, Store, Clock, CheckCircle, Megaphone, TrendingUp, Users 
} from 'lucide-react';
import { formatCurrency } from '../../../../shared/utils/formatCurrency';

interface BusinessHomeScreenProps {
  services: any[];
  bookings: any[];
  promos?: any[];
  currentUser: any;
}

export default function BusinessHomeScreen({ services, bookings, promos = [], currentUser }: BusinessHomeScreenProps) {
  // 1. Reservas de hoy
  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const bookingsToday = bookings.filter(b => b.date === todayStr);

  // 2. Ingresos del mes (Reservas en estado PAID en el mes actual)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const bookingsThisMonthPaid = bookings.filter(b => {
    if (b.status !== 'PAID') return false;
    if (!b.date) return false;
    const bDate = new Date(b.date);
    return bDate.getFullYear() === currentYear && bDate.getMonth() === currentMonth;
  });
  const monthlyRevenue = bookingsThisMonthPaid.reduce((acc, b) => acc + (b.totalPrice || 0), 0);

  // 3. Servicios activos (isVisible !== false)
  const activeServices = services.filter(s => s.isVisible !== false).length;

  // 4. Reservas pendientes
  const pendingBookingsCount = bookings.filter(b => b.status === 'PENDING').length;

  // 5. Reservas pagadas (validadas)
  const paidBookingsCount = bookings.filter(b => b.status === 'PAID').length;

  // 6. Promociones activas
  const activePromosCount = promos.filter(p => p.isActive !== false).length;

  // Recientes
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 font-sans animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold tracking-widest py-1 px-3 rounded-full uppercase">
              Socio Verificado
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase leading-tight">
              ¡Hola, {currentUser.name}!
            </h2>
            <p className="text-xs text-slate-350 font-medium">
              Gestiona tus servicios, reservas y visualiza el crecimiento de tu negocio.
            </p>
          </div>
          <div className="bg-emerald-800/40 border border-emerald-700/50 p-4 rounded-2xl shrink-0 backdrop-blur-sm">
            <span className="text-[10px] uppercase font-bold text-emerald-300 font-mono tracking-wider block">ID Prestador</span>
            <span className="font-mono text-cyan-300 text-xs font-semibold">{currentUser.id}</span>
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
        {[
          { title: 'Reservas de Hoy', value: bookingsToday.length, desc: 'Para el día de hoy', icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-50' },
          { title: 'Ingresos del Mes', value: `${formatCurrency(monthlyRevenue)} MXN`, desc: 'Reservas pagadas este mes', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Servicios Activos', value: activeServices, desc: 'Visibles en el catálogo', icon: Store, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { title: 'Reservas Pendientes', value: pendingBookingsCount, desc: 'Esperando liberación', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'Reservas Pagadas', value: paidBookingsCount, desc: 'Fondos liberados', icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { title: 'Promos Activas', value: activePromosCount, desc: 'Campañas de difusión', icon: Megaphone, color: 'text-rose-600', bg: 'bg-rose-50' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[9px] uppercase font-black text-slate-400 font-mono tracking-wider">{stat.title}</span>
                <div className={`p-1.5 rounded-lg shrink-0 ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg md:text-xl font-black text-slate-800 leading-none">{stat.value}</h3>
                <p className="text-[9px] text-slate-500 mt-1 font-medium leading-tight">{stat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* SVG Ventas Trimestrales simulated and Recents */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Analytics Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm md:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm md:text-base">Tendencia de Reservas Recibidas</h3>
                <p className="text-xs text-slate-400 font-medium">Volumen de reservas registradas en la plataforma.</p>
              </div>
              <div className="flex gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-emerald-500 rounded" />Reservas</span>
              </div>
            </div>
            <div className="w-full h-44 bg-slate-50 rounded-2xl p-2 relative border border-slate-100 mt-2">
              <svg viewBox="0 0 500 150" className="w-full h-full" preserveAspectRatio="none">
                <path d="M 0 120 C 100 110, 200 90, 300 70 C 400 65, 500 30, 500 30 L 500 150 L 0 150 Z" fill="url(#gradBusiness)" opacity="0.1" />
                <path d="M 0 120 C 100 110, 200 90, 300 70 C 400 65, 500 30, 500 30" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
                <circle cx="300" cy="70" r="4.5" fill="#059669" />
                <circle cx="500" cy="30" r="4.5" fill="#059669" />
                <defs>
                  <linearGradient id="gradBusiness" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-1 left-2 right-2 flex justify-between font-mono text-[9px] text-slate-400">
                <span>Marzo</span>
                <span>Abril</span>
                <span>Mayo (Actual)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm md:col-span-4 flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-sm md:text-base">Últimas Reservas</h3>
            <p className="text-xs text-slate-400 font-medium">Movimientos recientes en tus servicios.</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-48 pr-1">
            {recentBookings.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center py-8 text-center">
                <Clock className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400 font-medium">Sin reservas registradas aún.</p>
              </div>
            ) : (
              recentBookings.map((b) => (
                <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800 truncate max-w-[140px]">{b.travelerEmail}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{b.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold text-slate-900">{formatCurrency(b.totalPrice)}</p>
                    <span className={`inline-block text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      b.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                      b.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700 animate-pulse'
                    }`}>
                      {b.status === 'PAID' ? 'Liquidada' : b.status === 'CANCELLED' ? 'Cancelada' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
