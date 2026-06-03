/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CalendarRange, Filter, FileText, CheckCircle, Clock, XCircle, Search 
} from 'lucide-react';
import { formatCurrency } from '../../../../shared/utils/formatCurrency';
import { formatDate } from '../../../../shared/utils/formatDate';
import { getBookingStatusLabel, getBookingStatusColorClasses } from '../../../../shared/utils/bookingUtils';

interface MyBookingsScreenProps {
  bookings: any[];
}

export default function MyBookingsScreen({ bookings }: MyBookingsScreenProps) {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'CANCELLED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Estadísticas rápidas de reservas
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const paidCount = bookings.filter(b => b.status === 'PAID').length;
  const cancelledCount = bookings.filter(b => b.status === 'CANCELLED').length;

  // Filtrado de reservas
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesSearch = b.travelerEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.serviceId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (bookings.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-8 flex flex-col items-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
          <CalendarRange className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-800 uppercase">Aún no tienes reservas recibidas</h3>
          <p className="text-xs text-slate-500 font-medium">
            Cuando los viajeros comiencen a reservar tus experiencias desde la app móvil de Mochilapp, aparecerán listadas aquí de forma instantánea.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-900 uppercase font-display">Mis Reservas ({bookings.length})</h2>
        <p className="text-xs text-slate-500 font-medium">Monitorea y valida las reservas entrantes y de tus clientes.</p>
      </div>

      {/* Stats Summary Widget */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pendientes de Liquidar', count: pendingCount, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Liquidadas / Pagadas', count: paidCount, icon: CheckCircle, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
          { label: 'Canceladas', count: cancelledCount, icon: XCircle, color: 'text-rose-700 bg-rose-50 border-rose-100' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`p-4 rounded-2xl border flex items-center gap-4 ${stat.color} shadow-sm`}>
              <div className="p-2 rounded-xl bg-white shrink-0 shadow-sm">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold block uppercase tracking-wide opacity-80 leading-none">{stat.label}</span>
                <span className="text-lg font-black mt-1 block leading-none">{stat.count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Buscar por e-mail de viajero o ID de servicio..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
          />
        </div>

        {/* Buttons Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 shrink-0">
          <span className="text-xs text-slate-550 font-bold flex items-center gap-1 mr-2 font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            FILTRO:
          </span>
          {[
            { id: 'ALL', label: 'Todas' },
            { id: 'PENDING', label: 'Pendientes' },
            { id: 'PAID', label: 'Liquidadas' },
            { id: 'CANCELLED', label: 'Canceladas' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                statusFilter === btn.id 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-slate-105 hover:bg-slate-200/60 text-slate-600'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table/Card list */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-2">
            <FileText className="w-10 h-10 text-slate-300" />
            <p className="text-xs text-slate-450 font-medium">Ninguna reserva coincide con los criterios de búsqueda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-medium">
              <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5">Viajero (Email)</th>
                  <th className="py-3 px-4">ID Servicio</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4 text-center">Cupos</th>
                  <th className="py-3 px-4 text-right">Monto Total</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-5 text-right">Dueño</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredBookings.map((booking) => {
                  const statusColors = getBookingStatusColorClasses(booking.status);
                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900 font-sans max-w-[200px] truncate" title={booking.travelerEmail}>
                        {booking.travelerEmail}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">
                        {booking.serviceId}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {formatDate(booking.date)}
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-900 font-bold">
                        {booking.slots}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-950">
                        {formatCurrency(booking.totalPrice)} MXN
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full ${statusColors.text} bg-slate-100 border border-slate-200/40`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`} />
                          {getBookingStatusLabel(booking.status)}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono text-[9px] text-slate-400">
                        {booking.ownerEmail}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
