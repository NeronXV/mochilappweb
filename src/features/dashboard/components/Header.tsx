import React from 'react';
import { Wifi, Clock } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'users' | 'providers' | 'feed' | 'ai' | 'packages' | 'passport' | 'editorial' | 'payouts' | 'incentives';
  usingLocalFallback: boolean;
  firebaseEnabled: boolean;
  currentTime: string;
}

export default function Header({
  activeTab,
  usingLocalFallback,
  firebaseEnabled,
  currentTime,
}: HeaderProps) {
  const getModuleStatusBadge = () => {
    const isDemoOnlyModule = ['packages', 'passport', 'ai', 'incentives'].includes(activeTab);
    
    if (isDemoOnlyModule) {
      return (
        <span className="text-[10px] font-extrabold py-1 px-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-full tracking-wide uppercase select-none flex items-center gap-1">
          ⚠️ Módulo en modo demo / próximo desarrollo
        </span>
      );
    }
    
    if (usingLocalFallback) {
      return (
        <span className="text-[10px] font-extrabold py-1 px-3 bg-orange-50 border border-orange-200 text-orange-700 rounded-full tracking-wide uppercase select-none flex items-center gap-1">
          🤖 Datos simulados
        </span>
      );
    } else {
      return (
        <span className="text-[10px] font-extrabold py-1 px-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full tracking-wide uppercase select-none flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Firebase Live
        </span>
      );
    }
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-5 gap-4 font-sans">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            {activeTab === 'dashboard' && 'Panel Principal'}
            {activeTab === 'users' && 'Gestión de Cuentas'}
            {activeTab === 'providers' && 'Sectores y Proveedores'}
            {activeTab === 'feed' && 'Moderación de Descubrimientos'}
            {activeTab === 'ai' && 'Copiloto de Logística IA'}
            {activeTab === 'packages' && 'Estructurador de Rutas'}
            {activeTab === 'passport' && 'Pasaporte Mochilapp'}
            {activeTab === 'editorial' && 'Editorial y Transmisor Push'}
            {activeTab === 'payouts' && 'Ledger de Retenciones'}
            {activeTab === 'incentives' && 'Fondo de Incentivos Locales'}
          </h1>
          {getModuleStatusBadge()}
        </div>
        <p className="text-xs text-slate-500 mt-1">Conectividad e Inteligencia Turística en Poblados Emergentes.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className={`py-1 px-3 border rounded-xl flex items-center gap-1.5 text-xs font-semibold ${
          usingLocalFallback ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          <Wifi className={`w-3.5 h-3.5 ${usingLocalFallback ? 'text-amber-400' : 'text-emerald-500 animate-pulse'}`} />
          <span>{usingLocalFallback ? '[Local] Modo Demo Inteligente' : 'Escuchas Firebase habilitadas'}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs py-1.5 px-3 rounded-xl flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime}</span>
        </div>
      </div>
    </header>
  );
}
