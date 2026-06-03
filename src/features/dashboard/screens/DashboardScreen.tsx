import React from 'react';
import { 
  Users, Store, Gift, CreditCard, Award, Megaphone, AlertTriangle, Map, Wifi 
} from 'lucide-react';
import { MochilaUser, Provider, Post, Payment, IncentiveCampaign } from '../../../types';
import { formatCurrency } from '../../../shared/utils/formatCurrency';

interface DashboardScreenProps {
  calculatedStats: {
    totalUsers: number;
    activeProviders: number;
    reviewsPending: number;
    totalSales: number;
    totalComision: number;
    poolIncentivos: number;
    activePackages: number;
  };
  users: MochilaUser[];
  providers: Provider[];
  posts: Post[];
  payments: Payment[];
  campaigns: IncentiveCampaign[];
  setActiveTab: (tab: 'dashboard' | 'users' | 'providers' | 'feed' | 'ai' | 'packages' | 'passport' | 'editorial' | 'payouts' | 'incentives') => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function DashboardScreen({
  calculatedStats,
  users,
  providers,
  posts,
  payments,
  campaigns,
  setActiveTab,
  showToast,
}: DashboardScreenProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: 'Mochileros de Alta', value: calculatedStats.totalUsers, desc: 'Registrados en red', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
          { title: 'Proveedores Aptos', value: calculatedStats.activeProviders, desc: 'Socios aprobados', icon: Store, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { title: 'Fondo de Incentivo', value: `${formatCurrency(calculatedStats.poolIncentivos)} MXN`, desc: 'Fondos de Conectividad', icon: Gift, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Fideicomiso Mochila', value: `${formatCurrency(calculatedStats.totalComision)} MXN`, desc: 'Comisión 15% cobrada', icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { title: 'Puntos Emitidos', value: users.reduce((acc, u) => acc + (u.mochiPuntos || 0), 0) + ' pts', desc: 'MochiPuntos acumulados', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'Campañas de Promo', value: campaigns.length, desc: 'Incentivos activos', icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-50' },
          { title: 'Pendientes Revisión', value: calculatedStats.reviewsPending, desc: 'Posts o Socios en espera', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { title: 'Paquetes Activos', value: calculatedStats.activePackages, desc: 'Catalogados en venta', icon: Map, color: 'text-sky-600', bg: 'bg-sky-50' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-slate-250/60 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">{stat.title}</span>
                <h3 className="text-xl md:text-2xl font-black text-slate-800 mt-1">{stat.value}</h3>
                <p className="text-[10px] text-slate-500 mt-1">{stat.desc}</p>
              </div>
              <div className={`p-3 rounded-xl shrink-0 ${stat.bg} ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* SVG Native Trends Analytics (Viajeros vs Proveedores) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm md:text-base">Tendencias de Alta de Usuarios (Trimestre)</h3>
            <p className="text-xs text-slate-400 font-medium">Crecimiento estimado de la red social de comunidades.</p>
          </div>
          <div className="flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-emerald-500 rounded" />Viajeros</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-cyan-500 rounded-full" />Socios</span>
          </div>
        </div>
        <div className="w-full h-44 bg-slate-50 rounded-2xl p-2 relative border border-slate-100">
          <svg viewBox="0 0 500 150" className="w-full h-full" preserveAspectRatio="none">
            <path d="M 0 130 C 100 120, 200 70, 300 60 C 400 50, 500 20, 500 20 L 500 150 L 0 150 Z" fill="url(#grad22)" opacity="0.1" />
            <path d="M 0 130 C 100 120, 200 70, 300 60 C 400 50, 500 20, 500 20" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
            <path d="M 0 140 C 120 120, 240 110, 360 80 C 480 60, 500 45, 500 45" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="300" cy="60" r="4.5" fill="#10b981" />
            <circle cx="500" cy="20" r="4.5" fill="#10b981" />
            <defs>
              <linearGradient id="grad22" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute bottom-1 left-2 right-2 flex justify-between font-mono text-[9px] text-slate-450">
            <span>Marzo 2026</span>
            <span>Abril 2026</span>
            <span>Mayo 2026 (Monitoreo Actual)</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel Alerts (3 elements) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
          <span>Bandeja de Acciones Inmediatas (Admin Dispatcher)</span>
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Publicación foto Sian Ka\'an por Ana Gómez requiere revisión', type: 'Feed', actionTab: 'feed' as const, text: 'Ana Gómez subió una image con descripción bohemia para Sian Ka\'an.' },
            { label: 'Nuevo socio registrado "Aventura Huasteca Potosina" requiere validación mercantil', type: 'Socio', actionTab: 'providers' as const, text: 'Luis Torres cargó seguro de responsabilidad civil pero falta validar RFC.' },
            { label: 'Comisión pendiente de liberación por Glamping Valle de Bravo', type: 'Pagos', actionTab: 'payouts' as const, text: 'Se ha liquidado la reserva estelar masiva, pendiente liberar $4,675 MXN al socio.' }
          ].map((item, id) => (
            <div key={id} className="border border-slate-100 bg-slate-50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-cyan-100 text-cyan-800 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">{item.type}</span>
                  <strong className="text-slate-800">{item.label}</strong>
                </div>
                <p className="text-[11px] text-slate-550">{item.text}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setActiveTab(item.actionTab)} className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors cursor-pointer">Revisar</button>
                <button onClick={() => showToast(`Alerta de ${item.type} ignorada por Admin.`, 'info')} className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-xl transition-colors cursor-pointer">Ignorar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
