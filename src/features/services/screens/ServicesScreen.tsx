import React from 'react';
import { MapPin, Sparkles, Star } from 'lucide-react';
import { Provider } from '../../../types';
import { formatCurrency } from '../../../shared/utils/formatCurrency';

interface ServicesScreenProps {
  mappedProviders: any[];
  selectedProviderForAnalysis: Provider | null;
  setSelectedProviderForAnalysis: (provider: Provider | null) => void;
  selectedProviderAnalysisResult: {
    name: string;
    location: string;
    rating: number;
    priceCategory: string;
    evaluationText: string;
  } | null;
  updateProviderStatus: (id: string, next: 'Aprobado' | 'Rechazado') => Promise<void>;
  toggleProviderRecommended: (id: string) => Promise<void>;
  toggleServiceVisibility: (id: string, currentVisible: boolean) => Promise<void>;
  setActiveTab: (tab: 'dashboard' | 'users' | 'providers' | 'feed' | 'ai' | 'packages' | 'passport' | 'editorial' | 'payouts' | 'incentives') => void;
  setPkgDest: (dest: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function ServicesScreen({
  mappedProviders,
  selectedProviderForAnalysis,
  setSelectedProviderForAnalysis,
  selectedProviderAnalysisResult,
  updateProviderStatus,
  toggleProviderRecommended,
  toggleServiceVisibility,
  setActiveTab,
  setPkgDest,
  showToast,
}: ServicesScreenProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-base mb-4">Empresas Proveedoras y Socios de Experiencia</h3>
        
        <div className="space-y-4">
          {mappedProviders.map(p => (
            <div 
              key={p.id} 
              onClick={() => setSelectedProviderForAnalysis(p)} 
              className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer hover:border-teal-300 transition-all ${
                selectedProviderForAnalysis?.id === p.id ? 'bg-teal-50/40 border-teal-300' : 'bg-slate-50/40 border-slate-100'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="text-slate-800 text-sm sm:text-base">{p.merchantName}</strong>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    p.category === 'hospedaje' ? 'bg-indigo-100 text-indigo-800' : 'bg-cyan-100 text-cyan-800'
                  }`}>{p.category}</span>
                  {p.isRecommended && <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold py-0.5 px-2 rounded-full border border-amber-200">Recomendado</span>}
                  {!p.isVisible && <span className="bg-rose-100 text-rose-800 text-[10px] font-mono font-bold py-0.5 px-2 rounded-full border border-rose-200">Oculto</span>}
                </div>
                <p className="text-xs text-slate-550 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{p.location}</span>
                  <span>• Responsable: {p.responsibleName}</span>
                </p>
                
                <div className="flex gap-4 font-mono text-xs text-slate-500 mt-2">
                  <span>Calificación: <strong className="text-slate-700">{p.rating} ★ ({p.reviewCount} reseñas)</strong></span>
                  <span>Ventas: <strong className="text-teal-600">{formatCurrency(p.salesCalculated)} MXN</strong></span>
                  <span>Comisión Retenida: <strong className="text-cyan-600">{formatCurrency(p.commissionAccumulated)} MXN</strong></span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 sm:items-end shrink-0">
                <span className={`text-[10px] font-black uppercase text-center w-full px-2 py-1.5 rounded-xl border ${
                  p.status === 'Aprobado' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-amber-500 text-slate-900 border-amber-400'
                }`}>{p.status}</span>
                
                <div className="flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); updateProviderStatus(p.id, 'Aprobado'); }} className="px-2 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-bold cursor-pointer">Aprobar</button>
                  <button onClick={(e) => { e.stopPropagation(); updateProviderStatus(p.id, 'Rechazado'); }} className="px-2 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded text-xs font-bold cursor-pointer">Rechazar</button>
                  <button onClick={(e) => { e.stopPropagation(); toggleProviderRecommended(p.id); }} className="px-2 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-xs font-bold cursor-pointer">Destacar</button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleServiceVisibility(p.id, p.isVisible); }} 
                    className={`px-2 py-1.5 rounded text-xs font-bold cursor-pointer ${
                      p.isVisible ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-600 text-white hover:bg-slate-700'
                    }`}
                  >
                    {p.isVisible ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar "Potencial de Paquete" Evaluation section */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b text-slate-800">
            <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />
            <h3 className="font-bold text-sm">IA Analizador: Potencial de Paquete</h3>
          </div>
          {selectedProviderAnalysisResult ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider block uppercase">Comercio Evaluado</span>
                <strong className="text-slate-800 font-display mt-0.5 block">{selectedProviderAnalysisResult.name}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider block">Calificación de Servicio</span>
                <div className="flex items-center gap-1 text-slate-700 font-semibold mt-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-300 shrink-0" />
                  <span>{selectedProviderAnalysisResult.rating} de 5.0 global</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider block uppercase">Nivel de Viabilidad / Fit</span>
                <p className="text-slate-600 mt-1 leading-relaxed bg-teal-50/50 border border-teal-100 rounded-xl p-3 font-semibold italic text-[11px]">
                  "{selectedProviderAnalysisResult.evaluationText}"
                </p>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => { 
                    setActiveTab('packages'); 
                    setPkgDest(selectedProviderAnalysisResult.location); 
                    showToast("Socio seleccionado integrado a parámetros de ruta.", "info"); 
                  }} 
                  className="w-full py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:brightness-105 text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer"
                >
                  Vincular a Estructurador de Ruta
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Haz clic en cualquier proveedor socio para evaluar su viabilidad comercial en packs turísticos.</p>
          )}
        </div>
      </div>
    </div>
  );
}
