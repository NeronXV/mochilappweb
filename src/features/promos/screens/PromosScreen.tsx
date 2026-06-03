import React from 'react';
import { Megaphone, Sparkles, Bell, Smartphone, Wifi, Battery } from 'lucide-react';
import { Promo } from '../../../types';

interface PromosScreenProps {
  promoMerchant: string;
  setPromoMerchant: (merchant: string) => void;
  promoRate: number;
  setPromoRate: (rate: number) => void;
  promoTarget: 'all' | 'viajeros frecuentes' | 'mochipuntos';
  setPromoTarget: (target: 'all' | 'viajeros frecuentes' | 'mochipuntos') => void;
  promoName: string;
  setPromoName: (name: string) => void;
  handlePublishPromo: (e: React.FormEvent) => Promise<void>;
  promos: Promo[];
  setPromos: React.Dispatch<React.SetStateAction<Promo[]>>;
  simulatedNotify: { title: string; body: string; active: boolean } | null;
  setSimulatedNotify: (val: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  usingLocalFallback: boolean;
  firebaseEnabled: boolean;
}

export default function PromosScreen({
  promoMerchant,
  setPromoMerchant,
  promoRate,
  setPromoRate,
  promoTarget,
  setPromoTarget,
  promoName,
  setPromoName,
  handlePublishPromo,
  promos,
  setPromos,
  simulatedNotify,
  setSimulatedNotify,
  showToast,
  usingLocalFallback,
  firebaseEnabled,
}: PromosScreenProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-base">Editorial y Disparador de Notificaciones Push</h3>
        <p className="text-xs text-slate-500 mt-1">Escribe ofertas instantáneas de los prestadores aprobados y simula la recepción masiva en vivo en la app del mochilero.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Promotion builder tool */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-widest font-mono flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-teal-600" /> Redactor de Alerta Masiva
              </h4>
              <button 
                type="button" 
                onClick={() => { 
                  setPromoName("🔥 Oferta de avistamiento de Ballenas usando código LAPAZBALLENA. ¡Cupos súper reducidos!"); 
                  setPromoMerchant("La Paz Good Vibes Marine Adventures"); 
                  setPromoRate(20); 
                  showToast("Contenido promocional rústico cargado con IA.", "info"); 
                }} 
                className="text-[9px] font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-2 rounded py-0.5 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 animate-spin" /> Generar con IA
              </button>
            </div>

            <form onSubmit={handlePublishPromo} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Empresa Proveedora de Excursión</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej: EcoTours Chiapas Premium" 
                  value={promoMerchant} 
                  onChange={e => setPromoMerchant(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Porcentaje de Descuento (%)</label>
                  <input 
                    type="number" 
                    min="5" 
                    max="80" 
                    value={promoRate} 
                    onChange={e => setPromoRate(Number(e.target.value))} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Target de Audiencia</label>
                  <select 
                    value={promoTarget} 
                    onChange={e => setPromoTarget(e.target.value as any)} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="all">Suscritos masivos ('all')</option>
                    <option value="viajeros frecuentes">Sólo Viajeros Frecuentes destacados</option>
                    <option value="mochipuntos">Mochileros con más de 1000 MochiPuntos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Cuerpo Breve para Teléfono Móvil</label>
                <textarea 
                  required 
                  rows={3} 
                  placeholder="¡Lanzamos 15% de descuento en cabañas campestres! Código..." 
                  value={promoName} 
                  onChange={e => setPromoName(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 bg-gradient-to-r from-teal-650 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-teal-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Bell className="w-4 h-4 animate-bounce" />
                <span>Publicar Campaña Editorial y Disparar Flash</span>
              </button>
            </form>
          </div>

          <div className="mt-6 border-t pt-4">
            <h4 className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">Monitoreo de Ofertas y Conversiones de Red</h4>
            <div className="divide-y text-[11px]">
              {promos.map(pr => (
                <div key={pr.id} className="py-2.5 flex justify-between items-center bg-slate-50 rounded-xl p-3 border mb-2">
                  <div>
                    <strong className="text-slate-800">{pr.providerName} • {pr.discountRate}% OFF</strong>
                    <p className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1">"{pr.promoText}"</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded font-bold shrink-0">{pr.clicksCount} clics</span>
                    <button 
                      onClick={() => { 
                        setPromos(prev => prev.map(p => p.id === pr.id ? { ...p, clicksCount: p.clicksCount + 1 } : p)); 
                        showToast("Clic virtual sumado.", "info"); 
                      }} 
                      className="bg-slate-200 hover:bg-slate-300 px-1.5 py-0.5 rounded text-[9px] font-mono cursor-pointer"
                    >
                      +1 clic
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* High fidelity simulated Android Mockup cell phone */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="text-center mb-2">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase flex items-center gap-1 justify-center">
              <Smartphone className="w-3.5 h-3.5" /> Simulador de Interacción de Notificaciones
            </span>
          </div>

          <div className="w-64 h-120 bg-slate-900 rounded-[36px] p-2 border-4 border-slate-700 shadow-xl relative overflow-hidden">
            {/* Notch screen detail */}
            <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black rounded-full z-40" />
            
            {/* Screen canvas */}
            <div className="w-full h-full rounded-[28px] overflow-hidden bg-slate-950 flex flex-col justify-between relative">
              <img 
                referrerPolicy="no-referrer" 
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400" 
                alt="Wallpaper mobile" 
                className="absolute inset-0 w-full h-full object-cover opacity-50" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900/30 to-slate-950 pointer-events-none" />

              <div className="relative z-10 w-full">
                {/* Top status bar phone */}
                <div className="px-5 pt-1.5 flex justify-between items-center text-[8px] font-mono font-bold text-white/90">
                  <span>13:30</span>
                  <div className="flex items-center gap-1">
                    <Wifi className="w-2.5 h-2.5 text-cyan-400" />
                    <Battery className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                </div>

                {/* Floating overlay sliding push notification */}
                {simulatedNotify ? (
                  <div id="simulated-push-notification" className="m-2 p-3 bg-white/90 backdrop-blur rounded-2xl shadow-2xl border border-teal-150 flex gap-2 items-start relative z-50 animate-bounce">
                    <div className="w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-0.5 shrink-0 shadow-sm">
                      <img src="/logocolor.png" alt="Mochilapp Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1 text-slate-900 text-[10px]">
                      <h5 className="font-bold truncate leading-none mb-1">{simulatedNotify.title}</h5>
                      <p className="text-[9px] text-slate-500 font-medium leading-snug line-clamp-3 italic">"{simulatedNotify.body}"</p>
                    </div>
                  </div>
                ) : (
                  <div className="m-3 p-2 bg-black/40 backdrop-blur rounded-xl border border-white/5 text-center text-white/50 text-[10px] italic">
                    Esperando disparo de Notificación Push... (Vuelve a rellenar y publicar)
                  </div>
                )}
              </div>

              {/* App icon representation */}
              <div className="p-4 text-center relative z-10 space-y-1">
                <div className="w-8 h-8 rounded-full bg-white border border-white/30 mx-auto flex items-center justify-center p-1 shadow-lg">
                  <img src="/logocolor.png" alt="Mochilapp Logo" className="w-full h-full object-contain" />
                </div>
                <h4 className="text-white font-black text-xs uppercase leading-none tracking-tight">Mochilapp</h4>
                <p className="text-[8px] text-white/75 font-mono">Conectando América Latina</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
