import React from 'react';
import { Sparkles, MapPin, Trash2 } from 'lucide-react';
import { Package } from '../../../types';
import { formatCurrency } from '../../../shared/utils/formatCurrency';
import { calculateCommission } from '../../../shared/utils/commissionUtils';

interface PackagesScreenProps {
  generatePackageIa: () => void;
  handleCreatePackage: (e: React.FormEvent) => Promise<void>;
  pkgName: string;
  setPkgName: (value: string) => void;
  pkgDest: string;
  setPkgDest: (value: string) => void;
  pkgDays: number;
  setPkgDays: (value: number) => void;
  pkgPrice: number;
  setPkgPrice: (value: number) => void;
  pkgBudget: 'Económico' | 'Medio' | 'Premium';
  setPkgBudget: (value: 'Económico' | 'Medio' | 'Premium') => void;
  packages: Package[];
  setPackages: React.Dispatch<React.SetStateAction<Package[]>>;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function PackagesScreen({
  generatePackageIa,
  handleCreatePackage,
  pkgName,
  setPkgName,
  pkgDest,
  setPkgDest,
  pkgDays,
  setPkgDays,
  pkgPrice,
  setPkgPrice,
  pkgBudget,
  setPkgBudget,
  packages,
  setPackages,
  showToast,
}: PackagesScreenProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      {/* Create package form */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 className="font-bold text-slate-800 text-sm">Construir Paquete Turístico</h3>
          <button 
            type="button" 
            onClick={generatePackageIa} 
            className="text-[9px] font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Autorellenar IA</span>
          </button>
        </div>

        <form onSubmit={handleCreatePackage} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Nombre Comercial de Ruta</label>
            <input 
              type="text" 
              required 
              placeholder="Ej: Good Vibes La Paz Completo" 
              value={pkgName} 
              onChange={e => setPkgName(e.target.value)} 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-teal-500" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Localidad / Destino</label>
            <input 
              type="text" 
              required 
              placeholder="La Paz, Baja California Sur" 
              value={pkgDest} 
              onChange={e => setPkgDest(e.target.value)} 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-teal-500" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Días de Duración</label>
              <input 
                type="number" 
                min="1" 
                max="15" 
                value={pkgDays} 
                onChange={e => setPkgDays(Number(e.target.value))} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Costo Estimado (MXN)</label>
              <input 
                type="number" 
                step="100" 
                value={pkgPrice} 
                onChange={e => setPkgPrice(Number(e.target.value))} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Rango de Presupuesto</label>
            <select 
              value={pkgBudget} 
              onChange={e => setPkgBudget(e.target.value as any)} 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            >
              <option value="Económico">Económico (Viajero Rústico)</option>
              <option value="Medio">Medio (Mochila Cómoda)</option>
              <option value="Premium">Premium (Glampings y Experiencia Pro)</option>
            </select>
          </div>

          <div className="p-3 bg-cyan-50/50 border border-cyan-100 rounded-2xl space-y-1 text-[10px] text-cyan-800 leading-snug">
            <div className="flex justify-between"><span>Comisión Proyectada 15%:</span><strong className="font-bold font-mono">{formatCurrency(calculateCommission(pkgPrice))} MXN</strong></div>
            <div className="flex justify-between"><span>Incentivo Mochipuntos Ganados:</span><strong className="font-bold font-mono">+{Math.round(pkgPrice * 0.03)} puntos</strong></div>
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/10 cursor-pointer"
          >
            Publicar y Habilitar Paquete Interactivo
          </button>
        </form>
      </div>

      {/* List packages with statuses */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-base mb-4">Catálogo de Paquetes y Programas de Ruta</h3>
        <div className="space-y-4">
          {packages.map(p => (
            <div key={p.id} className="p-4 border rounded-2xl bg-slate-50/40 relative hover:shadow transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="text-slate-800 text-xs sm:text-sm">{p.name}</strong>
                  <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[8px] font-bold font-mono uppercase px-2 py-0.5 rounded-full">{p.budgetRange}</span>
                </div>
                <p className="text-[10px] text-slate-550 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{p.destination}</span>
                  <span>• Duración: {p.durationDays} días</span>
                </p>
                
                <div className="mt-2 flex gap-4 text-[9px] font-mono text-slate-430">
                  <span>Precio Final: <strong className="text-slate-800">{formatCurrency(p.priceEstimate)} MXN</strong></span>
                  <span>Comisión Retenida (15%): <strong className="text-teal-700">{formatCurrency(calculateCommission(p.priceEstimate))} MXN</strong></span>
                  <span>Otorga: <strong className="text-amber-600">+{Math.round(p.priceEstimate * 0.03)} MochiPuntos</strong></span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">{p.status}</span>
                <button 
                  onClick={() => { setPackages(prev => prev.filter(pkg => pkg.id !== p.id)); showToast("Paquete eliminado del catálogo.", "warning"); }} 
                  className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl cursor-pointer" 
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
