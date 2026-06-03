import React from 'react';
import { 
  LayoutDashboard, Users, Store, ImageIcon, Sparkles, Map, Award, Megaphone, CreditCard, Gift, LogOut 
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'users' | 'providers' | 'feed' | 'ai' | 'packages' | 'passport' | 'editorial' | 'payouts' | 'incentives';
  setActiveTab: (tab: 'dashboard' | 'users' | 'providers' | 'feed' | 'ai' | 'packages' | 'passport' | 'editorial' | 'payouts' | 'incentives') => void;
  usersCount: number;
  pendingProvidersCount: number;
  pendingPostsCount: number;
  usingLocalFallback: boolean;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  usersCount,
  pendingProvidersCount,
  pendingPostsCount,
  usingLocalFallback,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 sticky top-0 h-screen z-20 font-sans">
      <div>
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center p-1.5 shadow-md shadow-slate-100">
            <img src="/logocolor.png" alt="Mochilapp Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 tracking-tight leading-none uppercase">MOCHILAPP</h2>
            <span className="text-[9px] text-slate-400 font-medium font-mono block mt-1 uppercase">Centro Inteligente</span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
            { id: 'users', label: 'Gestión Usuarios', icon: Users, badge: usersCount },
            { id: 'providers', label: 'Prestadores Turísticos', icon: Store, badge: pendingProvidersCount },
            { id: 'feed', label: 'Moderación Feed', icon: ImageIcon, badge: pendingPostsCount, pulse: true },
            { id: 'ai', label: 'Asistente IA Copilot', icon: Sparkles, extraText: 'IA' },
            { id: 'packages', label: 'Paquetes e Itinerarios', icon: Map },
            { id: 'passport', label: 'Pasaporte & MochiPuntos', icon: Award },
            { id: 'editorial', label: 'Editorial y Promociones', icon: Megaphone },
            { id: 'payouts', label: 'Control de Pagos', icon: CreditCard },
            { id: 'incentives', label: 'Fondo de Incentivos', icon: Gift }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full py-2.5 px-3.5 rounded-xl text-left font-semibold text-xs transition-all flex items-center justify-between cursor-pointer ${
                  isSelected ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </div>
                {tab.extraText && (
                  <span className="text-[8px] bg-cyan-100 text-cyan-800 font-mono font-bold px-1.5 py-0.5 rounded">
                    {tab.extraText}
                  </span>
                )}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : tab.pulse ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Widget */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-cyan-100 border border-teal-500 flex items-center justify-center text-teal-800 font-bold font-display text-sm tracking-tight">PV</div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-800 truncate leading-none">Pedro Valenzuela</h4>
            <span className="text-[9px] font-bold text-teal-600 mt-1 block uppercase">Super Admin</span>
          </div>
          <span className={`text-[8px] tracking-wider font-bold rounded px-1 shrink-0 ${usingLocalFallback ? 'text-rose-500 bg-rose-50 animate-pulse' : 'text-emerald-500 bg-emerald-50'}`}>
            {usingLocalFallback ? 'Demo Mode' : 'Firebase Live'}
          </span>
        </div>

        <button onClick={onLogout} className="w-full py-1.5 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
          <LogOut className="w-3 h-3" />
          <span>Cerrar Control Tower</span>
        </button>
      </div>
    </aside>
  );
}
