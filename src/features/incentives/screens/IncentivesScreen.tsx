import React from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import { IncentiveCampaign } from '../../../types';
import { formatCurrency } from '../../../shared/utils/formatCurrency';

interface IncentivesScreenProps {
  suggestIncentiveCampIa: () => void;
  createIncentiveCampaign: (e: React.FormEvent) => void;
  campName: string;
  setCampName: (value: string) => void;
  campAmount: number;
  setCampAmount: (value: number) => void;
  campType: 'MochiPuntos extra' | 'Cupón de descuento' | 'Crédito reserva' | 'Apoyo conectividad local';
  setCampType: (value: 'MochiPuntos extra' | 'Cupón de descuento' | 'Crédito reserva' | 'Apoyo conectividad local') => void;
  campDesc: string;
  setCampDesc: (value: string) => void;
  campaigns: IncentiveCampaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<IncentiveCampaign[]>>;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function IncentivesScreen({
  suggestIncentiveCampIa,
  createIncentiveCampaign,
  campName,
  setCampName,
  campAmount,
  setCampAmount,
  campType,
  setCampType,
  campDesc,
  setCampDesc,
  campaigns,
  setCampaigns,
  showToast,
}: IncentivesScreenProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      {/* Create campaign form */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 className="font-bold text-slate-800 text-sm">Crear Campaña de Cashback</h3>
          <button 
            type="button" 
            onClick={suggestIncentiveCampIa} 
            className="text-[9px] font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-2 rounded.5 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>Coadyuvar con IA</span>
          </button>
        </div>

        <form onSubmit={createIncentiveCampaign} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Nombre Comercial de la Campaña</label>
            <input 
              type="text" 
              required 
              placeholder="Ej: Regresa a Oaxaca" 
              value={campName} 
              onChange={e => setCampName(e.target.value)} 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Fideicomiso Asignado (MXN)</label>
              <input 
                type="number" 
                step="500" 
                value={campAmount} 
                onChange={e => setCampAmount(Number(e.target.value))} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Tipo de Incentivo</label>
              <select 
                value={campType} 
                onChange={e => setCampType(e.target.value as any)} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer"
              >
                <option value="MochiPuntos extra">MochiPuntos Adicionales</option>
                <option value="Cupón de descuento">Cupón Promocional Directo</option>
                <option value="Crédito reserva">Crédito en Reservas</option>
                <option value="Apoyo conectividad local">Apoyo Vialidad y Combustible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Descripción de Mecánica de Incentivos</label>
            <textarea 
              required 
              rows={3} 
              placeholder="Mecanismo de canjes, restricciones o metas..." 
              value={campDesc} 
              onChange={e => setCampDesc(e.target.value)} 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg cursor-pointer"
          >
            Publicar y Activar Campaña de Ecoturismo
          </button>
        </form>
      </div>

      {/* List active campaigns and outcomes */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-base mb-4">Campañas y Programas de Apoyo Financiados</h3>
        <div className="space-y-4">
          {campaigns.map(c => (
            <div key={c.id} className="p-4 border rounded-2xl bg-slate-50/40 hover:shadow transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <strong className="text-slate-850 text-xs sm:text-sm">{c.name}</strong>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[8px] font-bold font-mono px-2 py-0.5 rounded-full uppercase ml-2">{c.incentiveType}</span>
                <p className="text-[10px] text-slate-600 leading-relaxed mt-1 italic border-l-2 pl-2">
                  "{c.description}"
                </p>
                
                <div className="mt-2.5 flex gap-4 text-[9px] font-mono text-slate-430">
                  <span>Fondo Subvencionado: <strong className="text-slate-800">{formatCurrency(c.allocatedAmount)} MXN</strong></span>
                  <span>Estatus Financiero: <strong className="text-teal-700">Auditado</strong></span>
                  <span>Efectividad clicks: <strong className="text-indigo-600">{c.resultsSimulatedClicks} interacciones</strong></span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <span className="text-[10px] bg-emerald-150 text-emerald-800 font-bold px-2 py-1 rounded max-h-8">{c.status}</span>
                <button 
                  onClick={() => { setCampaigns(prev => prev.filter(cmp => cmp.id !== c.id)); showToast("Campaña removida.", "warning"); }} 
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
